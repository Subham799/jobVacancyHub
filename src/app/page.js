"use client"; // This directive marks the component as a Client Component.

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Search, Bell, Menu, X, ChevronDown, Rocket, TrendingUp, Briefcase, CalendarClock, Globe, Building, Code, Banknote, Syringe, Wrench, BookOpen, MessageCircle, Mail, MapPin, Handshake, Info, Phone, FileText, Newspaper, User, LogIn, Plus, ClipboardCopy } from 'lucide-react';
import { useRouter } from 'next/navigation'; // Import useRouter for navigation (external package)

// Import Firebase config - Using correct relative path from src/app to src/firebaseConfig.js
import { db, auth } from '@/firebaseConfig.js'; // Corrected path: from src/app, go up one (to src), then to firebaseConfig.js
import { collection, query, where, onSnapshot, addDoc, serverTimestamp } from 'firebase/firestore'; // External package import
import { onAuthStateChanged } from 'firebase/auth'; // External package import

// Import reusable components - Using correct relative path from src/app to src/components/JobListingTable.js
import JobListingTable from '@/components/JobListingTable.js';
// Corrected path: from src/app, go up one (to src), then into components

// Static data for LLM feature - defined globally for access by summarizeJobDescription
const sampleJobDescription = `
  Job Title: Senior Software Engineer (Full Stack)
  Company: Innovate Solutions Inc.
  Location: Bengaluru, India (Hybrid)
  Experience: 5+ Years

  Innovate Solutions Inc. is seeking a highly motivated and experienced Senior Full Stack Software Engineer to join our dynamic engineering team in Bengaluru. You will be instrumental in designing, developing, and deploying robust, scalable, and high-performance web applications. This role requires a strong grasp of both front-end and back-end technologies, excellent problem-solving skills, and the ability to work collaboratively in an Agile environment.

  Key Responsibilities:
  - Lead the design, development, and maintenance of scalable web applications using React.js, Node.js, and MongoDB.
  - Write clean, maintainable, and efficient code for both front-end and back-end components.
  - Collaborate with product managers, UI/UX designers, and other engineers to define, design, and ship new features.
  - Implement and maintain RESTful APIs.
  - Ensure the performance, quality, and responsiveness of applications.
  - Participate in code reviews to maintain high code quality standards.
  - Mentor junior developers and contribute to a culture of continuous learning.
  - Troubleshoot, debug and upgrade existing systems.
  - Stay up-to-date with emerging technologies and industry trends.

  Required Qualifications:
  - Bachelor's or Master's degree in Computer Science, Engineering, or a related field.
  - 5+ years of professional experience in full stack web development.
  - Proficient in JavaScript/TypeScript, React.js, Node.js, and Express.js.
  - Strong experience with NoSQL databases, particularly MongoDB.
  - Experience with cloud platforms (AWS, Azure, GCP) and containerization (Docker, Kubernetes) is a plus.
  - Familiarity with version control systems (Git) and CI/CD pipelines.
  - Excellent analytical and problem-solving skills.
  - Strong communication and interpersonal skills.

  Benefits:
  - Competitive salary and performance bonuses.
  - Comprehensive health and dental insurance.
  - Flexible working hours and hybrid work model.
  - Generous paid time off.
  - Professional development opportunities and conference attendance.
  - Modern office space with amenities.
`;

// Helper to format date for job deadlines and check if expired
const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  } catch (e) {
    return dateString;
  }
};

const isJobExpired = (deadlineString) => {
    if (!deadlineString || deadlineString === 'N/A') return false;
    try {
        const deadline = new Date(deadlineString);
        const today = new Date();
        today.setHours(0, 0, 0, 0); // Normalize today's date to midnight for accurate comparison
        return deadline < today;
    } catch (e) {
        console.error("Error parsing deadline date:", deadlineString, e);
        return false; // Treat as not expired if date is invalid
    }
};

const App = () => {
  const router = useRouter(); // Initialize router for navigation
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isJobCategoriesMenuOpen, setIsJobCategoriesMenuOpen] = useState(false);
  const [jobSummary, setJobSummary] = useState('');
  const [isSummarizing, setIsSummarizing] = useState(false);
  const [rawJobInput, setRawJobInput] = useState('');
  const [generatedJobData, setGeneratedJobData] = useState(null);
  const [isGeneratingJob, setIsGeneratingJob] = useState(false);
  const [generationError, setGenerationError] = useState('');

  // Firestore related states
  const [latestGovtJobs, setLatestGovtJobs] = useState([]);
  const [jobsNearingDeadlineFromFirestore, setJobsNearingDeadlineFromFirestore] = useState([]);
  const [isAuthReady, setIsAuthReady] = useState(false);
  const [userId, setUserId] = useState(null);


  // For adding a new job (demo purposes)
  const [newJobTitle, setNewJobTitle] = useState('');
  const [newJobDeadline, setNewJobDeadline] = useState('');
  const [newJobCategory, setNewJobCategory] = useState('');
  const [newJobDescription, setNewJobDescription] = useState('');
  const [newJobApplyLink, setNewJobApplyLink] = useState('');

  // Sample notifications (static for now)
  const notifications = [
    { id: 1, type: 'admit_card', title: 'Admit Card for IBPS PO Prelims Out!', link: '#' },
    { id: 2, type: 'exam_date', title: 'SSC CGL Tier 2 Exam Dates Announced', link: '#' },
    { id: 3, type: 'result', title: 'UPSC Civil Services Mains Result Declared', link: '#' },
    { id: 4, type: 'deadline', title: 'Last day to apply for SBI Clerk!', link: '#' },
  ];


  // Initialize Firebase and listen for auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserId(user.uid);
      } else {
        // Fallback for cases where auth is not ready or user is not logged in
        setUserId(null);
      }
      setIsAuthReady(true); // Mark auth as ready once initial check is done
    });
    return () => unsubscribe();
  }, []);

  // Fetch jobs from Firestore
  useEffect(() => {
    if (!isAuthReady) return; // Wait until auth state is confirmed

    const appId = typeof __app_id !== 'undefined' ? __app_id : 'default-app-id';
    const jobsCollectionRef = collection(db, `artifacts/${appId}/public/data/jobs`);

    // Fetch Latest Government Jobs
    const qLatestGovt = query(jobsCollectionRef, where('category', '==', 'govt'));
    const unsubscribeLatestGovt = onSnapshot(qLatestGovt, (snapshot) => {
      const jobsData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      const activeJobs = jobsData.filter(job => !isJobExpired(job.deadline));
      setLatestGovtJobs(activeJobs);
    }, (error) => {
      console.error("Error fetching latest government jobs:", error);
    });

    // Fetch Jobs Nearing Deadline (e.g., within next 30 days)
    const today = new Date();
    today.setHours(0,0,0,0);
    const thirtyDaysFromNow = new Date();
    thirtyDaysFromNow.setDate(today.getDate() + 30);

    // Note: Firestore queries for date ranges are complex with '!=' or ranges if not indexed.
    // For simplicity, we'll fetch all and filter client-side for "nearing deadline" if direct range query isn't simple.
    // A more robust solution might involve a `deadlineTimestamp` field and `orderBy('deadlineTimestamp')`
    const qNearingDeadline = query(jobsCollectionRef); // Fetch all and filter client-side for demo
    const unsubscribeNearingDeadline = onSnapshot(qNearingDeadline, (snapshot) => {
        const jobsData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        const nearingDeadline = jobsData.filter(job => {
            if (!job.deadline) return false;
            try {
                const jobDeadline = new Date(job.deadline);
                jobDeadline.setHours(23,59,59,999); // Set to end of day for comparison
                return jobDeadline >= today && jobDeadline <= thirtyDaysFromNow;
            } catch (e) {
                return false;
            }
        });
        setJobsNearingDeadlineFromFirestore(nearingDeadline);
    }, (error) => {
        console.error("Error fetching jobs nearing deadline:", error);
    });


    return () => {
      unsubscribeLatestGovt();
      unsubscribeNearingDeadline();
    };
  }, [isAuthReady]); // Re-run when auth state is ready


  const trendingJobs = [ // These are still static for now
    { id: 1, title: 'Full Stack Developer', company: 'Innovate Solutions', location: 'Remote' },
    { id: 2, title: 'Digital Marketing Specialist', company: 'BrandGenius', location: 'Mumbai' },
    { id: 3, title: 'Government Teacher', company: 'Ministry of Education', location: 'Delhi' },
  ];

  const latestPrivateJobs = [ // These are still static for now
    { id: 1, title: 'Product Manager', company: 'Global Tech', location: 'Pune' },
    { id: 2, title: 'Sales Executive', company: 'GrowMore Pvt Ltd', location: 'Chennai' },
    { id: 3, title: 'HR Manager', company: 'Corp HR', location: 'Gurugram' },
  ];

  const jobCategories = [
    { name: 'IT Jobs', icon: <Code className="h-6 w-6 text-indigo-600" />, link: '#', view: 'itJobsList' },
    { name: 'Bank Jobs', icon: <Banknote className="h-6 w-6 text-green-600" />, link: '#', view: 'bankJobsList' },
    { name: 'Teaching', icon: <BookOpen className="h-6 w-6 text-yellow-600" />, link: '#', view: 'teachingJobsList' },
    { name: 'Engineering', icon: <Wrench className="h-6 w-6 text-red-600" />, link: '#', view: 'engineeringJobsList' },
    { name: 'Defence', icon: <Rocket className="h-6 w-6 text-gray-600" />, link: '#', view: 'defenceJobsList' },
    { name: 'Railways', icon: <Building className="h-6 w-6 text-orange-600" />, link: '#', view: 'railwaysJobsList' },
    { name: 'Healthcare/Nurses', icon: <Syringe className="h-6 w-6 text-blue-600" />, link: '#', view: 'healthcareJobsList' },
    { name: 'PWD/Disability Jobs', icon: <Handshake className="h-6 w-6 text-teal-600" />, link: '#', view: 'pwdJobsList' },
    { name: 'Internships', icon: <Briefcase className="h-6 w-6 text-purple-600" />, link: '#', view: 'internshipsList' },
    { name: 'Freshers Jobs', icon: <Plus className="h-6 w-6 text-pink-600" />, link: '#', view: 'freshersList' },
  ];

  const blogPosts = [
    { id: 1, title: 'Mastering Your Resume: Tips for 2025', snippet: 'Learn how to craft a compelling resume that stands out...', link: '#' },
    { id: 2, title: 'Govt vs. Private Jobs: Which is Right for You?', snippet: 'A detailed comparison to help you make an informed career choice...', link: '#' },
    { id: 3, title: 'Ace Your Interview: Common Questions & Best Answers', snippet: 'Prepare for your next interview with our expert tips...', link: '#' },
  ];

  // Function to summarize job description using Gemini API
  const summarizeJobDescription = async () => {
    setIsSummarizing(true);
    setJobSummary(''); // Clear previous summary

    const prompt = `Summarize the following job description, highlighting key responsibilities and required qualifications, in 3-5 bullet points:\n\n${sampleJobDescription}`;
    let chatHistory = [];
    chatHistory.push({ role: "user", parts: [{ text: prompt }] });

    const payload = { contents: chatHistory };
    const apiKey = ""; // Canvas will provide this at runtime
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

    try {
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const result = await response.json();

      if (result.candidates && result.candidates.length > 0 &&
          result.candidates[0].content && result.candidates[0].content.parts &&
          result.candidates[0].content.parts.length > 0) {
        const text = result.candidates[0].content.parts[0].text;
        setJobSummary(text);
      } else {
        setJobSummary("Failed to generate summary. Please try again.");
        console.error("Gemini API response structure unexpected:", result);
      }
    } catch (error) {
      setJobSummary("An error occurred while summarizing. Please check your connection.");
      console.error("Error calling Gemini API:", error);
    } finally {
      setIsSummarizing(false);
    }
  };

  // Function to generate structured job data from raw text using Gemini API
  const generateStructuredJobData = async () => {
    setIsGeneratingJob(true);
    setGeneratedJobData(null);
    setGenerationError('');

    if (!rawJobInput.trim()) {
      setGenerationError("Please enter raw job details to generate.");
      setIsGeneratingJob(false);
      return;
    }

    // Prompt to guide the LLM to extract structured data
    const prompt = `Extract the following details from the job description below and return them as a JSON object. If a field is not found, use "N/A" for strings, 0 for numbers, or an empty array for lists.
    The JSON object should have these top-level keys: "jobTitle", "organization", "postDetails", "eligibility", "selectionProcess", "examCenters", "applicationFee", "importantInstructions", "howToApply", "applyLink".

    For "organization", "postDetails", and "applicationFee", structure them as nested objects with key-value pairs (e.g., {"conductedBy": "...", "location": "..."}).
    For "eligibility", "selectionProcess", "examCenters", "importantInstructions", and "howToApply", structure them as arrays of strings.

    Job Description:
    ${rawJobInput}`;

    let chatHistory = [{ role: "user", parts: [{ text: prompt }] }];

    const payload = {
        contents: chatHistory,
        generationConfig: {
            responseMimeType: "application/json",
            responseSchema: { // Provide a schema to guide structured output
                type: "OBJECT",
                properties: {
                    jobTitle: { type: "STRING" },
                    organization: {
                        type: "OBJECT",
                        properties: {
                            conductedBy: { type: "STRING" },
                            location: { type: "STRING" },
                            advertisementNo: { type: "STRING" },
                            applicationMode: { type: "STRING" },
                            lastDateToApply: { type: "STRING" }
                        }
                    },
                    postDetails: {
                        type: "OBJECT",
                        properties: {
                            postName: { type: "STRING" },
                            totalVacancies: { type: "NUMBER" },
                            ur: { type: "NUMBER" },
                            obc: { type: "NUMBER" },
                            sc: { type: "NUMBER" },
                            st: { type: "NUMBER" },
                            ewc: { type: "NUMBER" },
                            group: { type: "STRING" },
                            payScale: { type: "STRING" },
                            additionalBenefits: { type: "STRING" }
                        }
                    },
                    eligibility: { type: "ARRAY", items: { type: "STRING" } },
                    selectionProcess: { type: "ARRAY", items: { type: "STRING" } },
                    examCenters: { type: "ARRAY", items: { type: "STRING" } },
                    applicationFee: {
                        type: "OBJECT",
                        properties: {
                            fee: { type: "STRING" },
                            exemptedCategories: { type: "STRING" },
                            paymentMode: { type: "STRING" }
                        }
                    },
                    importantInstructions: { type: "ARRAY", items: { type: "STRING" } },
                    howToApply: { type: "ARRAY", items: { type: "STRING" } },
                    applyLink: { type: "STRING" }
                }
            }
        }
    };
    const apiKey = ""; // Canvas will provide this at runtime
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

    try {
      const response = await fetch(apiUrl, {
                 method: 'POST',
                 headers: { 'Content-Type': 'application/json' },
                 body: JSON.stringify(payload)
             });
      const result = await response.json();

      if (result.candidates && result.candidates.length > 0 &&
          result.candidates[0].content && result.candidates[0].content.parts &&
          result.candidates[0].content.parts.length > 0) {
        const jsonString = result.candidates[0].content.parts[0].text;
        const parsedJson = JSON.parse(jsonString);
        setGeneratedJobData(parsedJson);
      } else {
        setGenerationError("Failed to generate structured data. Unexpected API response.");
        console.error("Gemini API response structure unexpected:", result);
      }
    } catch (error) {
      setGenerationError("An error occurred while generating structured data. Please ensure the input is valid and try again.");
      console.error("Error calling Gemini API for structured data:", error);
    } finally {
      setIsGeneratingJob(false);
    }
  };

  const handleCopyGeneratedData = () => {
    if (generatedJobData) {
      document.execCommand('copy'); // Fallback for older browsers
      const textarea = document.createElement('textarea');
      textarea.value = JSON.stringify(generatedJobData, null, 2);
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      alert('Generated JSON copied to clipboard!'); // Using alert for simplicity, replace with custom modal
    }
  };

  // Function to add a new job to Firestore
  const handleAddJob = async (e) => {
    e.preventDefault();
    if (!newJobTitle || !newJobDeadline || !newJobCategory || !newJobDescription || !newJobApplyLink || !isAuthReady || !userId) {
      alert("Please fill all fields and ensure user is authenticated to add a job.");
      return;
    }

    const appId = typeof __app_id !== 'undefined' ? __app_id : 'default-app-id';
    const jobsCollectionRef = collection(db, `artifacts/${appId}/public/data/jobs`);

    try {
      // For a more complete job entry, you might include other generated fields here
      // This is a simplified version for quick additions
      await addDoc(jobsCollectionRef, {
        title: newJobTitle,
        deadline: newJobDeadline,
        category: newJobCategory,
        description: newJobDescription,
        applyLink: newJobApplyLink,
        postedDate: serverTimestamp(), // Firestore timestamp
        // Placeholder values for other fields if not provided in the simple form
        organization: { conductedBy: "Self-Posted", location: "India" },
        postDetails: {},
        eligibility: ["Basic eligibility applies"],
        selectionProcess: ["Interview"],
        examCenters: ["Online"],
        applicationFee: { fee: "N/A" },
        importantInstructions: ["Review before submission"],
        howToApply: ["Apply online"],
      });
      alert('Job added successfully!');
      // Clear form
      setNewJobTitle('');
      setNewJobDeadline('');
      setNewJobCategory('');
      setNewJobDescription('');
      setNewJobApplyLink('');
    } catch (error) {
      console.error("Error adding job: ", error);
      alert("Error adding job. Check console for details.");
    }
  };


  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-800">
      {/* Header Section */}
      <header className="sticky top-0 z-50 bg-white shadow-sm">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          {/* Logo and Tagline */}
          <div className="flex items-center">
            <Link href="/">
              <a className="flex items-center space-x-2">
                <Image src="https://placehold.co/40x40/6366F1/FFFFFF?text=JP" alt="Job Portal Logo" width={40} height={40} className="rounded-full" />
                <span className="text-xl font-bold text-indigo-600">JobConnect</span>
              </a>
            </Link>
            <span className="hidden md:block ml-4 text-sm text-gray-500">Find Your Dream Job, Effortlessly.</span>
          </div>

         {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link href="/">
              <a className="text-gray-600 hover:text-indigo-600 transition-colors duration-200">Home</a>
            </Link>
            <div className="relative">
              <button
                className="flex items-center text-gray-600 hover:text-indigo-600 transition-colors duration-200"
                onClick={() => setIsJobCategoriesMenuOpen(!isJobCategoriesMenuOpen)}
              >
                Job Categories <ChevronDown className={`ml-1 h-4 w-4 transition-transform ${isJobCategoriesMenuOpen ? 'rotate-180' : ''}`} />
              </button>
              {isJobCategoriesMenuOpen && (
                <div className="absolute left-0 mt-2 w-64 bg-white rounded-lg shadow-lg py-2 z-10">
                  <Link href="/jobs/government">
                    <a className="block px-4 py-2 text-gray-800 hover:bg-gray-100">Government Jobs</a>
                  </Link>
                  {/* Other category links can be added here, pointing to relevant views */}
                  <a href="#" className="block px-4 py-2 text-gray-800 hover:bg-gray-100">Private Jobs</a>
                  <a href="#" className="block px-4 py-2 text-gray-800 hover:bg-gray-100">IT Jobs</a>
                  <a href="#" className="block px-4 py-2 text-gray-800 hover:bg-gray-100">Banking Jobs</a>
                  <a href="#" className="block px-4 py-2 text-gray-800 hover:bg-gray-100">Engineering Jobs</a>
                  <div className="border-t border-gray-200 my-1"></div>
                  <a href="#" className="block px-4 py-2 text-indigo-600 hover:bg-gray-100 font-medium">Explore All Categories</a>
                </div>
              )}
            </div>
            <a href="#" className="text-gray-600 hover:text-indigo-600 transition-colors duration-200">Blog/Guides</a>
            <a href="#" className="text-gray-600 hover:text-indigo-600 transition-colors duration-200 relative">
              <Bell className="h-5 w-5" />
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold px-1.5 py-0.5 rounded-full">4</span> {/* Notification badge */}
            </a>
            <a href="#" className="text-gray-600 hover:text-indigo-600 transition-colors duration-200">Contact</a>
            <a href="#" className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors duration-200 flex items-center space-x-2">
              <User className="h-4 w-4" />
              <span>Login/Register</span>
            </a>
          </nav>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="text-gray-600 hover:text-indigo-600">
              {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

          {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <nav className="md:hidden bg-white py-4 px-4 border-t border-gray-200">
            <Link href="/">
              <a onClick={() => setIsMobileMenuOpen(false)} className="block px-4 py-2 text-gray-800 hover:bg-gray-100">Home</a>
            </Link>
            <button
              className="w-full flex items-center justify-between px-4 py-2 text-gray-800 hover:bg-gray-100"
              onClick={() => setIsJobCategoriesMenuOpen(!isJobCategoriesMenuOpen)}
            >
              Job Categories <ChevronDown className={`ml-1 h-4 w-4 transition-transform ${isJobCategoriesMenuOpen ? 'rotate-180' : ''}`} />
            </button>
            {isJobCategoriesMenuOpen && (
              <div className="ml-4 border-l border-gray-200 pl-4">
                <Link href="/jobs/government">
                  <a onClick={() => { setIsJobCategoriesMenuOpen(false); setIsMobileMenuOpen(false); }} className="block py-2 text-gray-800 hover:bg-gray-100">Government Jobs</a>
                </Link>
                {/* Other category links can be added here */}
                <a href="#" className="block py-2 text-gray-800 hover:bg-gray-100">Private Jobs</a>
                <a href="#" className="block py-2 text-gray-800 hover:bg-gray-100">IT Jobs</a>
                <a href="#" className="block py-2 text-gray-800 hover:bg-gray-100">Banking Jobs</a>
                <a href="#" className="block py-2 text-gray-800 hover:bg-gray-100">Engineering Jobs</a>
                <a href="#" className="block py-2 text-indigo-600 hover:bg-gray-100 font-medium">Explore All Categories</a>
              </div>
            )}
            <a href="#" className="block px-4 py-2 text-gray-800 hover:bg-gray-100">Blog/Guides</a>
            <a href="#" className="block px-4 py-2 text-gray-800 hover:bg-gray-100">Notifications</a>
            <a href="#" className="block px-4 py-2 text-gray-800 hover:bg-gray-100">Contact</a>
            <a href="#" className="block px-4 py-2 text-indigo-600 font-medium hover:bg-gray-100">Login/Register</a>
          </nav>
        )}
      </header>

      {/* Breaking News Ticker (Always visible for consistency) */}
      <section className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white py-2 overflow-hidden shadow-md">
        <div className="container mx-auto px-4 flex items-center">
          <span className="font-bold text-sm mr-4 flex-shrink-0">Breaking News:</span>
          <div className="flex-grow overflow-hidden relative h-6">
            <div className="animate-marquee whitespace-nowrap absolute top-0 left-0">
              <span className="mx-4">🔥 New Govt Openings: UPSC CSE 2025 Applications Open!</span>
              <span className="mx-4">💼 Private IT/Bank Hiring: Walk-in drives in Bengaluru & Hyderabad!</span>
              <span className="mx-4">⏰ Last Date Reminder: SSC GD Constable - Apply by July 25th!</span>
              <span className="mx-4">🔔 Admit Cards Released: IBPS Clerk Prelims - Download Now!</span>
            </div>
          </div>
        </div>
        {/* Keyframe for marquee animation */}
        <style dangerouslySetInnerHTML={{ __html: `
          @keyframes marquee {
            0% { transform: translateX(0%); }
            100% { transform: translateX(-100%); }
          }
          .animate-marquee {
            animation: marquee 15s linear infinite;
            display: inline-block; /* Ensure content spans wider than container */
            padding-left: 100%; /* Start off-screen */
          }
        `}} />
      </section>

      <main className="container mx-auto px-4 py-8">
        {/* Search Bar Section */}
        <section className="bg-white p-6 rounded-lg shadow-lg mb-8">
          <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">Find Your Perfect Job</h2>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-grow">
              <input
                type="text"
                placeholder="Search by Job Title, Keyword, Company, or Location..."
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
              />
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            </div>
            <button className="px-6 py-3 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 transition-colors duration-200 whitespace-nowrap">
              Search Jobs
            </button>
          </div>
          <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <select className="p-3 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500">
              <option value="">Select Category</option>
              <option value="IT">IT Jobs</option>
              <option value="Bank">Bank Jobs</option>
              <option value="Govt">Government Jobs</option>
            </select>
            <select className="p-3 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500">
              <option value="">Experience Level</option>
              <option value="Fresher">Fresher</option>
              <option value="1-3">1-3 Years</option>
              <option value="3-5">3-5 Years</option>
            </select>
            <select className="p-3 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500">
              <option value="">Location</option>
              <option value="Bengaluru">Bengaluru</option>
              <option value="Delhi">Delhi</option>
              <option value="Mumbai">Mumbai</option>
            </select>
            <select className="p-3 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500">
              <option value="">Employment Type</option>
              <option value="Full-time">Full-time</option>
              <option value="Part-time">Part-time</option>
              <option value="Internship">Internship</option>
            </select>
          </div>
        </section>

        {/* Highlighted Sections */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {/* Jobs Nearing Deadline */}
          <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow-lg">
            <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center"><CalendarClock className="mr-2 text-red-500" /> Jobs Nearing Deadline</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {jobsNearingDeadlineFromFirestore.map(job => (
                <div key={job.id} className="bg-red-50 border-l-4 border-red-500 p-4 rounded-md">
                  <h4 className="font-semibold text-gray-900">{job.title}</h4>
                  <p className="text-sm text-gray-600">{(job.organization?.conductedBy || job.company)} - {(job.jobLocation?.address?.addressLocality || job.location)}</p>
                  <p className="text-xs text-red-700 mt-1">Deadline: {formatDate(job.deadline)}</p>
                  <a href={`/jobs/${job.id}`} className="text-indigo-600 text-sm mt-2 block hover:underline">View Details</a>
                </div>
              ))}
            </div>
            <div className="text-center mt-6">
              <button className="px-6 py-3 bg-indigo-100 text-indigo-700 rounded-lg hover:bg-indigo-200 transition-colors duration-200">View All Deadlines</button>
            </div>
          </div>

          {/* Notifications Panel */}
          <div className="lg:col-span-1 bg-white p-6 rounded-lg shadow-lg">
            <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center"><Bell className="mr-2 text-indigo-500" /> Notifications & Alerts</h3>
            <ul className="space-y-3">
              {notifications.map(notif => (
                <li key={notif.id} className="flex items-start">
                  {notif.type === 'admit_card' && <FileText className="h-5 w-5 text-blue-500 flex-shrink-0 mr-2" />}
                  {notif.type === 'exam_date' && <CalendarClock className="h-5 w-5 text-orange-500 flex-shrink-0 mr-2" />}
                  {notif.type === 'result' && <Newspaper className="h-5 w-5 text-green-500 flex-shrink-0 mr-2" />}
                  {notif.type === 'deadline' && <CalendarClock className="h-5 w-5 text-red-500 flex-shrink-0 mr-2" />}
                  <div>
                    <a href={notif.link} className="text-gray-700 hover:text-indigo-600 hover:underline text-sm font-medium">{notif.title}</a>
                  </div>
                </li>
              ))}
            </ul>
            <div className="text-center mt-6">
              <button className="px-6 py-3 bg-indigo-100 text-indigo-700 rounded-lg hover:bg-indigo-200 transition-colors duration-200">View All Notifications</button>
            </div>
          </div>
        </section>

        {/* Other Highlighted Job Sections */}
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {/* Trending Jobs */}
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center"><TrendingUp className="mr-2 text-purple-600" /> Trending Jobs</h3>
            <ul className="space-y-3">
              {trendingJobs.map(job => (
                <li key={job.id}>
                  <a href="#" className="block p-3 rounded-md hover:bg-gray-50 transition-colors duration-200">
                    <h4 className="font-semibold text-gray-900">{job.title}</h4>
                    <p className="text-sm text-gray-600">{job.company} - {job.location}</p>
                  </a>
                </li>
              ))}
            </ul>
            <div className="text-center mt-6">
              <button className="px-6 py-3 bg-indigo-100 text-indigo-700 rounded-lg hover:bg-indigo-200 transition-colors duration-200">View All Trending</button>
            </div>
          </div>

          {/* Latest Government Jobs */}
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center"><Globe className="mr-2 text-teal-600" /> Latest Government Jobs</h3>
            <ul className="space-y-3">
              {latestGovtJobs.slice(0, 3).map(job => ( // Show only top 3 active jobs
                <li key={job.id}>
                  <a href={`/jobs/${job.id}`} className="block p-3 rounded-md hover:bg-gray-50 transition-colors duration-200">
                    <h4 className="font-semibold text-gray-900">{job.title}</h4>
                    <p className="text-sm text-gray-600">{job.department || job.organization?.conductedBy} - {formatDate(job.postedDate?.toDate ? job.postedDate.toDate() : job.postedDate)}</p>
                  </a>
                </li>
              ))}
            </ul>
            <div className="text-center mt-6">
              <button onClick={() => router.push('/jobs/government')} className="px-6 py-3 bg-indigo-100 text-indigo-700 rounded-lg hover:bg-indigo-200 transition-colors duration-200">View All Govt Jobs</button>
            </div>
          </div>

          {/* Latest Private Jobs */}
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center"><Building className="mr-2 text-orange-600" /> Latest Private Jobs</h3>
            <ul className="space-y-3">
              {latestPrivateJobs.map(job => (
                <li key={job.id}>
                  <a href="#" className="block p-3 rounded-md hover:bg-gray-50 transition-colors duration-200">
                    <h4 className="font-semibold text-gray-900">{job.title}</h4>
                    <p className="text-sm text-gray-600">{job.company} - {job.location}</p>
                  </a>
                </li>
              ))}
            </ul>
            <div className="text-center mt-6">
              <button className="px-6 py-3 bg-indigo-100 text-indigo-700 rounded-lg hover:bg-indigo-200 transition-colors duration-200">View All Private Jobs</button>
            </div>
          </div>
        </section>

        {/* Job Categories (Tiles/Cards) */}
        <section className="bg-white p-6 rounded-lg shadow-lg mb-8">
          <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">Explore Jobs by Category</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            {jobCategories.map(category => (
              <a key={category.name} href={`/jobs/${category.name.toLowerCase().replace(/\s/g, '-')}`} className="flex flex-col items-center justify-center p-6 bg-gray-50 rounded-lg shadow-sm hover:shadow-md hover:bg-indigo-50 transition-all duration-200 transform hover:-translate-y-1">
                {category.icon}
                <span className="mt-3 text-center text-sm font-medium text-gray-800">{category.name}</span>
              </a>
            ))}
          </div>
          <div className="text-center mt-8">
            <button className="px-8 py-4 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 transition-colors duration-200 text-lg">View All Job Categories</button>
          </div>
        </section>

        {/* LLM-Powered Job Description Summarizer Section */}
        <section className="bg-white p-6 rounded-lg shadow-lg mb-8">
          <h2 className="text-2xl font-bold text-center text-gray-800 mb-6 flex items-center justify-center">
            <span className="mr-2">Job Description Summarizer</span> ✨
          </h2>
          <div className="mb-4">
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Sample Job Description:</h3>
            <div className="bg-gray-50 p-4 rounded-md border border-gray-200 h-64 overflow-y-auto text-sm text-gray-700 whitespace-pre-wrap">
              {sampleJobDescription}
            </div>
          </div>
          <div className="text-center mb-4">
            <button
              onClick={summarizeJobDescription}
              disabled={isSummarizing}
              className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition-colors duration-200 flex items-center justify-center mx-auto"
            >
              {isSummarizing ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Summarizing...
                </>
              ) : (
                <>Summarize Job Description ✨</>
              )}
            </button>
          </div>
          {jobSummary && (
            <div className="mt-6 p-4 bg-purple-50 border-l-4 border-purple-500 rounded-md shadow-inner">
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Summary:</h3>
              <p className="text-gray-700 whitespace-pre-wrap">{jobSummary}</p>
            </div>
          )}
        </section>

        {/* LLM-Powered Job Post Generator Section */}
        <section className="bg-white p-6 rounded-lg shadow-lg mb-8">
          <h2 className="text-2xl font-bold text-center text-gray-800 mb-6 flex items-center justify-center">
            <span className="mr-2">Automatic Job Post Generator (via LLM)</span> 🚀
          </h2>
          <p className="text-center text-gray-600 mb-4">Paste raw job details, and our AI will structure it for your professional template.</p>
          <div className="mb-4">
            <label htmlFor="rawJobDetails" className="block text-sm font-medium text-gray-700 mb-2">
              Paste Raw Job Details Here:
            </label>
            <textarea
              id="rawJobDetails"
              rows="10"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 text-gray-800"
              placeholder="e.g., Job Title: Software Engineer, Company: ABC Tech, Location: Bengaluru, Responsibilities: Develop features, etc."
              value={rawJobInput}
              onChange={(e) => {
                setRawJobInput(e.target.value);
                setGeneratedJobData(null); // Clear previous generation on new input
                setGenerationError('');
              }}
            ></textarea>
          </div>
          <div className="text-center mb-4">
            <button
              onClick={generateStructuredJobData}
              disabled={isGeneratingJob || !rawJobInput.trim()}
              className="px-6 py-3 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 transition-colors duration-200 flex items-center justify-center mx-auto"
            >
              {isGeneratingJob ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Generating...
                </>
              ) : (
                <>Generate Structured Job Post</>
              )}
            </button>
          </div>

          {generationError && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mt-4" role="alert">
              <strong className="font-bold">Error:</strong>
              <span className="block sm:inline ml-2">{generationError}</span>
            </div>
          )}

          {generatedJobData && (
            <div className="mt-6">
              <h3 className="text-xl font-semibold text-gray-800 mb-4 text-center">Generated Structured Data:</h3>
              <div className="relative bg-gray-50 p-4 rounded-md border border-gray-200 overflow-x-auto">
                <pre className="whitespace-pre-wrap break-words text-sm text-gray-700">
                  {JSON.stringify(generatedJobData, null, 2)}
                </pre>
                <button
                  onClick={handleCopyGeneratedData}
                  className="absolute top-2 right-2 p-2 bg-gray-200 rounded-md hover:bg-gray-300 transition-colors"
                  title="Copy to clipboard"
                >
                  <ClipboardCopy size={16} />
                </button>
              </div>
              <div className="text-center mt-6">
                <button
                  onClick={() => {
                    // For generated data, we'll assign a temporary ID and navigate
                    // In a real app, this generated data would be saved to a database first
                    const tempJobId = `generated-${Date.now()}`;
                    localStorage.setItem(tempJobId, JSON.stringify(generatedJobData)); // Store temporarily
                    router.push(`/jobs/${tempJobId}`);
                  }}
                  className="px-6 py-3 bg-purple-600 text-white font-semibold rounded-lg shadow-md hover:bg-purple-700 transition-colors duration-200"
                >
                  View Generated Job in Template
                </button>
              </div>
            </div>
          )}
        </section>

        {/* Add New Job Section (for Firestore demo) */}
        <section className="bg-white p-6 rounded-lg shadow-lg mb-8">
          <h2 className="text-2xl font-bold text-center text-gray-800 mb-6 flex items-center justify-center">
            <Plus className="mr-2 text-green-600" /> Add New Job (Firestore Demo)
          </h2>
          {!isAuthReady && <p className="text-center text-red-500 mb-4">Authenticating... Please wait to add jobs.</p>}
          {isAuthReady && !userId && <p className="text-center text-red-500 mb-4">Authentication failed. Cannot add jobs.</p>}
          {isAuthReady && userId && (
            <form onSubmit={handleAddJob} className="space-y-4">
              <div>
                <label htmlFor="jobTitle" className="block text-sm font-medium text-gray-700">Job Title</label>
                <input
                  type="text"
                  id="jobTitle"
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm"
                  value={newJobTitle}
                  onChange={(e) => setNewJobTitle(e.target.value)}
                  required
                />
              </div>
              <div>
                <label htmlFor="jobDeadline" className="block text-sm font-medium text-gray-700">Deadline (YYYY-MM-DD)</label>
                <input
                  type="date"
                  id="jobDeadline"
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm"
                  value={newJobDeadline}
                  onChange={(e) => setNewJobDeadline(e.target.value)}
                  required
                />
              </div>
              <div>
                <label htmlFor="jobCategory" className="block text-sm font-medium text-gray-700">Category (e.g., govt, private)</label>
                <input
                  type="text"
                  id="jobCategory"
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm"
                  value={newJobCategory}
                  onChange={(e) => setNewJobCategory(e.target.value)}
                  required
                />
              </div>
              <div>
                <label htmlFor="jobDescription" className="block text-sm font-medium text-gray-700">Description</label>
                <textarea
                  id="jobDescription"
                  rows="4"
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm"
                  value={newJobDescription}
                  onChange={(e) => setNewJobDescription(e.target.value)}
                  required
                ></textarea>
              </div>
              <div>
                <label htmlFor="applyLink" className="block text-sm font-medium text-gray-700">Apply Link</label>
                <input
                  type="url"
                  id="applyLink"
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm"
                  value={newJobApplyLink}
                  onChange={(e) => setNewJobApplyLink(e.target.value)}
                  required
                />
              </div>
              <button
                type="submit"
                disabled={!isAuthReady || !userId}
                className="w-full px-4 py-2 bg-green-600 text-white font-semibold rounded-md hover:bg-green-700 transition-colors disabled:opacity-50"
              >
                Add Job
              </button>
              {userId && <p className="text-xs text-gray-500 mt-2">Authenticated as: {userId}</p>}
            </form>
          )}
        </section>


        {/* Blog/Articles Section */}
        <section className="bg-white p-6 rounded-lg shadow-lg mb-8">
          <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">Latest from Our Blog</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {blogPosts.map(post => (
              <div key={post.id} className="bg-gray-50 p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200">
                <h3 className="font-semibold text-lg text-gray-900 mb-2">{post.title}</h3>
                <p className="text-sm text-gray-600 line-clamp-3">{post.snippet}</p>
                <a href={post.link} className="text-indigo-600 text-sm mt-3 block hover:underline">Read More &rarr;</a>
              </div>
            ))}
          </div>
          <div className="text-center mt-8">
            <button className="px-6 py-3 bg-indigo-100 text-indigo-700 rounded-lg hover:bg-indigo-200 transition-colors duration-200">View All Articles</button>
          </div>
        </section>

        {/* Social & Updates Area */}
        <section className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white p-8 rounded-lg shadow-lg text-center mb-8">
          <h2 className="text-2xl font-bold mb-4">Join Our Job Alert Group!</h2>
          <p className="text-lg mb-6">Never miss a job update. Connect with us on social media for instant notifications.</p>
          <div className="flex justify-center space-x-6 mb-6">
            <a href="#" className="p-3 bg-white text-indigo-600 rounded-full shadow-lg hover:scale-110 transition-transform duration-200" title="Join Telegram">
              <MessageCircle className="h-7 w-7" />
            </a>
            <a href="#" className="p-3 bg-white text-green-500 rounded-full shadow-lg hover:scale-110 transition-transform duration-200" title="Join WhatsApp">
              <img src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg" alt="WhatsApp" className="h-7 w-7" />
            </a>
            <a href="#" className="p-3 bg-white text-blue-700 rounded-full shadow-lg hover:scale-110 transition-transform duration-200" title="Join Facebook Group">
              <img src="https://upload.wikimedia.org/wikipedia/commons/5/51/Facebook_f_logo_%282019%29.svg" alt="Facebook" className="h-7 w-7" />
            </a>
            <a href="#" className="p-3 bg-white text-red-500 rounded-full shadow-lg hover:scale-110 transition-transform duration-200" title="Get Email Alerts">
              <Mail className="h-7 w-7" />
            </a>
          </div>
          <div className="max-w-md mx-auto flex">
            <input
              type="email"
              placeholder="Enter your email for job alerts"
              className="flex-grow p-3 rounded-l-lg border border-gray-300 focus:ring-indigo-500 focus:border-indigo-500 text-gray-800"
            />
            <button className="px-6 py-3 bg-indigo-800 text-white font-semibold rounded-r-lg hover:bg-indigo-900 transition-colors duration-200 whitespace-nowrap">
              Subscribe
            </button>
          </div>
        </section>
      </main>

      {/* Footer Section */}
      <footer className="bg-gray-900 text-gray-300 py-10 px-4">
        <div className="container mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* About Us */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">About JobConnect</h3>
            <p className="text-sm">Your trusted partner in finding government and private sector jobs across all industries. We connect talent with opportunity.</p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="/" className="hover:text-indigo-400 transition-colors duration-200">Home</a></li>
              <li><a href="/jobs/government" className="hover:text-indigo-400 transition-colors duration-200">Job Categories</a></li>
              <li><a href="#" className="hover:text-indigo-400 transition-colors duration-200">Blog & Guides</a></li>
              <li><a href="#" className="hover:text-indigo-400 transition-colors duration-200">Success Stories</a></li>
              <li><a href="#" className="hover:text-indigo-400 transition-colors duration-200">Sitemap</a></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Support</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="hover:text-indigo-400 transition-colors duration-200 flex items-center"><Phone className="mr-2 h-4 w-4" /> Contact Us</a></li>
              <li><a href="#" className="hover:text-indigo-400 transition-colors duration-200 flex items-center"><Info className="mr-2 h-4 w-4" /> Help Center / FAQs</a></li>
              <li><a href="#" className="hover:text-indigo-400 transition-colors duration-200 flex items-center"><FileText className="mr-2 h-4 w-4" /> Terms & Privacy Policy</a></li>
            </ul>
          </div>

          {/* Newsletter Subscription */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Stay Updated</h3>
            <p className="text-sm mb-3">Subscribe to our newsletter for the latest job alerts and career tips.</p>
            <div className="flex">
              <input
                type="email"
                placeholder="Enter your email address"
                className="flex-grow p-3 rounded-l-lg border border-gray-300 focus:ring-indigo-500 focus:border-indigo-500 text-gray-800"
              />
              <button className="px-5 py-3 bg-indigo-800 text-white rounded-r-md hover:bg-indigo-700 transition-colors duration-200 whitespace-nowrap">
                  Subscribe
                </button>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-700 mt-8 pt-6 text-center text-sm text-gray-500">
            © {new Date().getFullYear()} JobConnect. All rights reserved.
          </div>
        </footer>
      </div>
    );
  };
  
  export default App;
  

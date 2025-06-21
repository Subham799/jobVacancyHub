"use client"; // This directive marks the component as a Client Component, allowing the use of hooks like useState and useEffect.

import React, { useState, useEffect } from 'react';
import { Search, Bell, Menu, X, ChevronDown, Rocket, TrendingUp, Briefcase, CalendarClock, Globe, Building, Code, Banknote, Syringe, Wrench, BookOpen, MessageCircle, Mail, MapPin, Handshake, Info, Phone, FileText, Newspaper, User, LogIn, Plus } from 'lucide-react'; // Using lucide-react for icons

// Main App Component
const App = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isJobCategoriesMenuOpen, setIsJobCategoriesMenuOpen] = useState(false);
  const [notifications, setNotifications] = useState([
    { id: 1, type: 'admit_card', title: 'Admit Card Released: SSC CGL Tier 1', link: '#' },
    { id: 2, type: 'exam_date', title: 'Exam Date Announced: IBPS PO Prelims on Aug 15', link: '#' },
    { id: 3, type: 'result', title: 'Results Declared: UPSC Civil Services Main', link: '#' },
    { id: 4, type: 'deadline', title: 'Deadline Nearing: Railway Group D - Apply by July 20', link: '#' },
  ]);

  // State for LLM feature
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
    - Troubleshoot, debug, and upgrade existing systems.
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

  const [jobSummary, setJobSummary] = useState('');
  const [isSummarizing, setIsSummarizing] = useState(false);

  // Placeholder data for job sections
  const jobsNearingDeadline = [
    { id: 1, title: 'Software Engineer', company: 'Tech Solutions', location: 'Bengaluru', deadline: '2025-07-25' },
    { id: 2, title: 'Data Analyst', company: 'DataCorp', location: 'Hyderabad', deadline: '2025-07-28' },
    { id: 3, title: 'Bank PO', company: 'State Bank of India', location: 'Across India', deadline: '2025-07-30' },
    { id: 4, title: 'Civil Engineer', company: 'PWD Department', location: 'Lucknow', deadline: '2025-08-01' },
  ];

  const trendingJobs = [
    { id: 1, title: 'Full Stack Developer', company: 'Innovate Solutions', location: 'Remote' },
    { id: 2, title: 'Digital Marketing Specialist', company: 'BrandGenius', location: 'Mumbai' },
    { id: 3, title: 'Government Teacher', company: 'Ministry of Education', location: 'Delhi' },
  ];

  const latestGovtJobs = [
    { id: 1, title: 'UPSC Civil Services', department: 'UPSC', postedDate: 'July 15, 2025' },
    { id: 2, title: 'SSC CGL', department: 'SSC', postedDate: 'July 14, 2025' },
    { id: 3, title: 'Railway Recruitment', department: 'Indian Railways', postedDate: 'July 12, 2025' },
  ];

  const latestPrivateJobs = [
    { id: 1, title: 'Product Manager', company: 'Global Tech', location: 'Pune' },
    { id: 2, title: 'Sales Executive', company: 'GrowMore Pvt Ltd', location: 'Chennai' },
    { id: 3, title: 'HR Manager', company: 'Corp HR', location: 'Gurugram' },
  ];

  const jobCategories = [
    { name: 'IT Jobs', icon: <Code className="h-6 w-6 text-indigo-600" />, link: '#' },
    { name: 'Bank Jobs', icon: <Banknote className="h-6 w-6 text-green-600" />, link: '#' },
    { name: 'Teaching', icon: <BookOpen className="h-6 w-6 text-yellow-600" />, link: '#' },
    { name: 'Engineering', icon: <Wrench className="h-6 w-6 text-red-600" />, link: '#' }, // Changed from Engineering to Wrench
    { name: 'Defence', icon: <Rocket className="h-6 w-6 text-gray-600" />, link: '#' },
    { name: 'Railways', icon: <Building className="h-6 w-6 text-orange-600" />, link: '#' },
    { name: 'Healthcare/Nurses', icon: <Syringe className="h-6 w-6 text-blue-600" />, link: '#' }, // Changed from Nurse to Syringe
    { name: 'PWD/Disability Jobs', icon: <Handshake className="h-6 w-6 text-teal-600" />, link: '#' },
    { name: 'Internships', icon: <Briefcase className="h-6 w-6 text-purple-600" />, link: '#' },
    { name: 'Freshers Jobs', icon: <Plus className="h-6 w-6 text-pink-600" />, link: '#' },
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


  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-800">
      {/* Header Section */}
      <header className="sticky top-0 z-50 bg-white shadow-sm">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          {/* Logo and Tagline */}
          <div className="flex items-center">
            <a href="#" className="flex items-center space-x-2">
              <img src="https://placehold.co/40x40/6366F1/FFFFFF?text=JP" alt="Job Portal Logo" className="rounded-full" />
              <span className="text-xl font-bold text-indigo-600">JobConnect</span>
            </a>
            <span className="hidden md:block ml-4 text-sm text-gray-500">Find Your Dream Job, Effortlessly.</span>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <a href="#" className="text-gray-600 hover:text-indigo-600 transition-colors duration-200">Home</a>
            <div className="relative">
              <button
                className="flex items-center text-gray-600 hover:text-indigo-600 transition-colors duration-200"
                onClick={() => setIsJobCategoriesMenuOpen(!isJobCategoriesMenuOpen)}
              >
                Job Categories <ChevronDown className={`ml-1 h-4 w-4 transition-transform ${isJobCategoriesMenuOpen ? 'rotate-180' : ''}`} />
              </button>
              {isJobCategoriesMenuOpen && (
                <div className="absolute left-0 mt-2 w-64 bg-white rounded-lg shadow-lg py-2 z-10">
                  <a href="#" className="block px-4 py-2 text-gray-800 hover:bg-gray-100">Government Jobs</a>
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
            <a href="#" className="block px-4 py-2 text-gray-800 hover:bg-gray-100">Home</a>
            <button
              className="w-full flex items-center justify-between px-4 py-2 text-gray-800 hover:bg-gray-100"
              onClick={() => setIsJobCategoriesMenuOpen(!isJobCategoriesMenuOpen)}
            >
              Job Categories <ChevronDown className={`ml-1 h-4 w-4 transition-transform ${isJobCategoriesMenuOpen ? 'rotate-180' : ''}`} />
            </button>
            {isJobCategoriesMenuOpen && (
              <div className="ml-4 border-l border-gray-200 pl-4">
                <a href="#" className="block py-2 text-gray-800 hover:bg-gray-100">Government Jobs</a>
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

      {/* Breaking News Ticker */}
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
          {/* Advanced Filters (can be expanded with a toggle button) */}
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
              {jobsNearingDeadline.map(job => (
                <div key={job.id} className="bg-red-50 border-l-4 border-red-500 p-4 rounded-md">
                  <h4 className="font-semibold text-gray-900">{job.title}</h4>
                  <p className="text-sm text-gray-600">{job.company} - {job.location}</p>
                  <p className="text-xs text-red-700 mt-1">Deadline: {new Date(job.deadline).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</p>
                  <a href="#" className="text-indigo-600 text-sm mt-2 block hover:underline">Apply Now</a>
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
              {latestGovtJobs.map(job => (
                <li key={job.id}>
                  <a href="#" className="block p-3 rounded-md hover:bg-gray-50 transition-colors duration-200">
                    <h4 className="font-semibold text-gray-900">{job.title}</h4>
                    <p className="text-sm text-gray-600">{job.department} - {job.postedDate}</p>
                  </a>
                </li>
              ))}
            </ul>
            <div className="text-center mt-6">
              <button className="px-6 py-3 bg-indigo-100 text-indigo-700 rounded-lg hover:bg-indigo-200 transition-colors duration-200">View All Govt Jobs</button>
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
              <a key={category.name} href={category.link} className="flex flex-col items-center justify-center p-6 bg-gray-50 rounded-lg shadow-sm hover:shadow-md hover:bg-indigo-50 transition-all duration-200 transform hover:-translate-y-1">
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
              <li><a href="#" className="hover:text-indigo-400 transition-colors duration-200">Home</a></li>
              <li><a href="#" className="hover:text-indigo-400 transition-colors duration-200">Job Categories</a></li>
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
                placeholder="Your email address"
                className="flex-grow p-3 rounded-l-md border border-gray-700 bg-gray-800 text-white text-sm focus:ring-indigo-500 focus:border-indigo-500"
              />
              <button className="px-5 py-3 bg-indigo-600 text-white rounded-r-md hover:bg-indigo-700 transition-colors duration-200">
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

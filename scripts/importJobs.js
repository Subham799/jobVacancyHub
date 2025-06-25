// scripts/importJobs.js

// Initialize Firebase Admin SDK
const admin = require('firebase-admin');
const serviceAccount = require('../serviceAccountKey.json'); // Adjust path if you placed it elsewhere

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

// --- Job Data to Import ---
// You will paste the JSON for each job here as a JavaScript object.
// Ensure dates that were "__datatype__": "Timestamp" are converted to Date objects for the script.
// Example: "2025-06-23" for deadlines.

const jobsToImport = [
  // 1. Central Bank of India Apprentice Recruitment 2025
  {
    id: "central-bank-apprentice-2025",
    title: "Central Bank of India Apprentice Recruitment 2025",
    category: "banking",
    deadline: "2025-06-23", // Use YYYY-MM-DD string
    applyLink: "https://www.nats.education.gov.in/",
    description: "This recruitment drive is specifically for 4500 Apprentices under the Apprentices Act, 1961, for the financial year 2025-26, offering a significant opportunity for recent graduates to gain experience in the banking sector.",
    postedDate: admin.firestore.Timestamp.now(), // Use Admin SDK's timestamp for current time
    jobTitle: "Apprentice",
    organization: {
      hiringBody: "Central Bank of India",
      established: "1911",
      type: "Public Sector Bank"
    },
    postDetails: {
      postName: "Apprentice",
      totalVacancies: 4500,
      location: "Across various states in India"
    },
    eligibility: [
      "Nationality: Citizen of India, or specific other categories (needs GOI certificate for non-Indians).",
      "Educational Qualification: Graduate degree in any discipline from a recognized university or equivalent, completed on or after January 1, 2021.",
      "Age Limit (as on May 31, 2025): Minimum 20 years, Maximum 28 years (Unreserved/EWS). Born between May 31, 1997, and May 31, 2005 (both inclusive).",
      "Age Relaxation: Applicable for SC/ST (5 years), OBC (NCL) (3 years), PwBD (UR/EWS) (10 years), PwBD (OBC) (13 years), PwBD (SC/ST) (15 years), widows/divorced/legally separated women (up to 35/38/40 years)."
    ],
    importantDates: {
      onlineRegistrationOpening: "2025-06-07",
      onlineRegistrationClosing: "2025-06-23",
      applicationFeePaymentDates: "2025-06-07 to 2025-06-25",
      tentativeOnlineExaminationDate: "First week of July 2025"
    },
    applicationFee: {
      pwbdCandidates: "₹400/- + GST",
      scStWomenEws: "₹600/- + GST",
      allOtherCandidates: "₹800/- + GST",
      notes: "Fee must be paid online and is non-refundable."
    },
    applicationProcess: [
      "Mandatory registration on Government of India's National Apprenticeship Training Scheme (NATS) portal.",
      "Search for 'Central Bank of India' apprenticeship advertisement on the NATS portal.",
      "Apply on NATS and note the Enrolment ID.",
      "Successful applicants will receive an email from BFSI SSC (email@bfsi_ssc.com) with a link for further details and fee payment.",
      "Fill in the online application form, upload required documents (photograph, signature), and pay the application fee.",
      "Submit the form and take a printout for future reference."
    ],
    salaryAndBenefits: [
      "Fixed monthly stipend of ₹15,000.",
      "No other allowances or benefits.",
      "Training opportunity, does not guarantee future employment."
    ],
    selectionProcess: [
      "Online Examination (Objective Type): Conducted by BFSI Sector Skill Council of India (BFSI SSC). The exam covers Quantitative Aptitude, Logical Reasoning, Computer Knowledge, English Language, Basic Retail Products, Basic Retail Asset Products, Basic Investment Products, and Basic Insurance Products. There are 100 questions for 100 marks, with a total duration of 60 minutes. There will be no negative marking for incorrect answers.",
      "Test of Local Language: Candidates must be proficient (reading, writing, speaking, and understanding) in one of the specified local languages of the state for which they apply.",
      "Final selection is based on merit in the online exam, document verification, and medical fitness."
    ],
    tableEligibilitySummary: "Graduate degree (on/after Jan 1, 2021)",
    tableAgeLimitSummary: "20-28 years (UR/EWS), relaxations apply"
  },

  // 2. Graduate Trainee-Associate Production Support Engineer (PayU)
  {
    id: "payu-production-support-engineer-2025",
    title: "Graduate Trainee-Associate Production Support Engineer (PayU)",
    category: "IT",
    deadline: "2025-07-31",
    applyLink: "https://careers.payu.in/job-postings/graduate-trainee-associate-production-support-engineer",
    description: "This role is for a graduate trainee position focusing on production support within the financial technology sector.",
    postedDate: admin.firestore.Timestamp.now(),
    jobTitle: "Graduate Trainee-Associate Production Support Engineer",
    organization: {
      company: "PayU",
      type: "Digital Financial Services Provider",
      regulation: "Regulated by Reserve Bank of India",
      location: "Gurgaon, IN"
    },
    importantDates: {
      advertisementDate: "June 18, 2025"
    },
    eligibility: [
      "Educational Qualification: Candidates must have graduated in 2023 or 2024 from a Tier 2 or Tier 3 college.",
      "Required Skills/Knowledge: Programming languages (JAVA, Python, PHP, Shell Scripting, Node.JS, JavaScript, UNIX/LINUX), Databases (SQL, MySQL, MongoDB - including simple queries for debugging), Excellent analytical and logical thinking, Quick troubleshooting, diagnosing, problem-solving, and debugging skills, Working knowledge of any programming language for code debugging and web-application/mobile debugging skills."
    ],
    responsibilities: [
      "Providing L2/L3 Support.",
      "Monitoring production systems for errors and promptly resolving issues.",
      "Addressing technical concerns and user questions.",
      "Ensuring a seamless user experience by managing disruptions effectively.",
      "Writing and executing SQL queries for data retrieval and analysis for debugging.",
      "Ensuring data integrity and troubleshooting database-related issues (SQL, MySQL, MongoDB, etc.)."
    ],
    whatPayUOffers: [
      "A positive and dynamic workplace environment.",
      "An inclusive environment that values diverse voices.",
      "Opportunity to learn cutting-edge concepts and innovation in an agile start-up environment with global scale.",
      "Access to over 5000 training courses (e.g., from Harvard, Coursera, Udacity) to support growth and development."
    ],
    tableEligibilitySummary: "Graduated 2023/2024 from Tier 2/3 college; Tech skills req.",
    tableAgeLimitSummary: "N/A (Age not specified in source)"
  },

  // 3. SSC Selection Posts Phase-XIII/2025
  {
    id: "ssc-selection-posts-phase-xiii-2025",
    title: "SSC Selection Posts Phase-XIII/2025",
    category: "govt",
    deadline: "2025-06-23",
    applyLink: "https://ssc.nic.in/",
    description: "This is a wide-ranging recruitment drive by the Staff Selection Commission for various posts across Central Government Ministries/Departments/Offices. Total Posts: 2423 tentative vacancies. Location: All India Service Liability (AISL).",
    postedDate: admin.firestore.Timestamp.now(),
    jobTitle: "Various Posts",
    organization: {
      hiringBody: "Staff Selection Commission (SSC)",
      type: "Government of India"
    },
    postDetails: {
      totalVacancies: 2423,
      location: "All India Service Liability (AISL)"
    },
    eligibility: [
      "Crucial Date for Age/Qualifications: August 1, 2025.",
      "Educational Qualification: Minimum educational qualification varies for each post, ranging from Matriculation, Higher Secondary (10+2), to Graduation & above. Must possess specific Essential Qualification (EQ) for each post; result of qualifying exam declared on or before August 1, 2025.",
      "Age Limit (as on 01.08.2025): Specific to each post (e.g., 18-25, 18-27, 18-30, 20-25 years). Examples: 18-25 posts (Born not earlier than 02-08-2000 and not later than 01-08-2007); 18-30 posts (Born not earlier than 02-08-1995 and not later than 01-08-2007).",
      "Age Relaxation: Permissible for reserved categories: SC/ST (5 years), OBC (3 years), PwBD (Unreserved) (10 years), PwBD (OBC) (13 years), PwBD (SC/ST) (15 years), Ex-Servicemen (3 years after deduction of military service), Central Govt. Civilian Employees (Group C) (up to 40 years of age), and for widows/divorced women/women judicially separated and not remarried (up to 35 years for UR, 40 years for SC/ST)."
    ],
    importantDates: {
      onlineApplicationSubmissionDates: "June 2, 2025 to June 23, 2025 (Up to 2300 Hrs.)",
      onlineFeePaymentLastDate: "June 24, 2025 (Up to 2300 Hrs.)",
      applicationFormCorrectionWindow: "June 28, 2025 to June 30, 2025 (Up to 2300 Hrs.)",
      computerBasedExaminationDates: "July 24, 2025 – August 4, 2025 (Tentative)"
    },
    applicationFee: {
      feePayable: "₹100/- (Rupees One Hundred only)",
      exemptions: "Women candidates, SC, ST, PwBD, and Ex-Servicemen eligible for reservation are exempted from paying the fee.",
      notes: "Payment online only. Fees non-refundable. Must be paid separately for each post category applied for.",
      correctionCharges: "₹200 for first re-submission, ₹500 for second re-submission (non-refundable)."
    },
    applicationProcess: [
      "Applications online via official SSC website or mySSC mobile app.",
      "Two-part process: One-Time Registration (OTR) on new SSC website (old OTRs invalid), then filling online application form.",
      "Advised to opt for Aadhaar Based Authentication during OTR.",
      "Application module requires live photograph capture (no cap, mask, glasses, plain background, face fully inside delineated area). Scanned signature required (JPEG/JPG, 10-20 KB, 6.0 cm x 2.0 cm).",
      "Candidates applying for more than one post must apply separately for each category and pay fee for each."
    ],
    salaryAndBenefits: [
      "Selected candidates appointed to posts with pay scales ranging from Level 1 to Level 8 of the Pay Matrix.",
      "In addition to basic pay, employees receive allowances like Dearness Allowance (DA), House Rent Allowance (HRA), Transport Allowance (TA), and other benefits as per Central Government norms."
    ],
    selectionProcess: [
      "Computer Based Examination (CBE): Three separate CBEs based on minimum educational qualifications (Matriculation, Higher Secondary, Graduation & above).",
      "Exam covers General Intelligence, General Awareness, Quantitative Aptitude, and English Language. 25 questions per subject, 50 marks each (100 questions, 200 marks total). Duration 60 minutes (80 minutes for eligible scribes).",
      "Negative marking of 0.50 marks for each wrong answer.",
      "Minimum Qualifying Marks in CBE (Normalized Scores): Unreserved (UR): 30%, OBC/EWS: 25%, Other Categories: 20%.",
      "Skill Tests (if applicable): Typing/Data Entry/Computer Proficiency Test (qualifying in nature).",
      "Scrutiny of Documents: Candidates shortlisted based on CBE scores, then upload self-attested copies of supporting documents.",
      "Document Verification (DV): Original documents verified by the User Department concerned."
    ],
    tableEligibilitySummary: "Matriculation to Graduation & above (varies by post); See details.",
    tableAgeLimitSummary: "18-25, 18-27, 18-30 (varies by post); relaxations apply"
  }
];

// Define the base path for your jobs collection
const appId = 'jobvacancy-60d3a'; // ✅ Correct Firestore path
 // This should match the __app_id used in your app.js
const collectionPath = `artifacts/${appId}/public/data/jobs`;

async function importJobs() {
  console.log('Starting job import...');
  for (const job of jobsToImport) {
    try {
      // Use set() with the specified ID to create or overwrite the document
      await db.collection(collectionPath).doc(job.id).set(job);
      console.log(`Successfully added/updated job: ${job.title} (ID: ${job.id})`);
    } catch (error) {
      console.error(`Error adding job ${job.title} (ID: ${job.id}):`, error);
    }
  }
  console.log('Job import complete.');
  process.exit(); // Exit the script after completion
}

importJobs();

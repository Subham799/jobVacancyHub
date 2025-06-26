const admin = require('firebase-admin');
const serviceAccount = require('../serviceAccountKey.json');

// Initialize Firebase Admin SDK (as per source [1])
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

// --- Job Data to Import ---
// This array will contain all job documents.
const jobsToImport = [
    // Existing Job 1: Central Bank of India Apprentice Recruitment 2025
    // (Retained from conversation history, with sector corrected as previously discussed)
    {
        id: "central-bank-apprentice-2025",
        title: "Central Bank of India Apprentice Recruitment 2025",
        // Standardized from "goverment" to "govt" for consistency with the specified values [conversation history]
        sector: "govt",
        subcategory: "banking",
        deadline: "2025-06-23", // YYYY-MM-DD string [2]
        applyLink: "https://www.nats.education.gov.in/",
        description: "This recruitment drive is specifically for 4500 Apprentices under the Apprentices Act, 1961, for the financial year 2025-26, offering a significant opportunity for recent graduates to gain experience in the banking sector.", 
        postedDate: admin.firestore.Timestamp.now(), // Firestore Timestamp for current time [3]
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

    // Existing Job 2: Graduate Trainee-Associate Production Support Engineer (PayU)
    // (Retained from conversation history)
    {
        id: "payu-production-support-engineer-2025",
        title: "Graduate Trainee-Associate Production Support Engineer (PayU)", 
        sector: "private", 
        subcategory: "IT", 
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

    // Existing Job 3: SSC Selection Posts Phase-XIII/2025
    // (Retained from conversation history, with sector corrected as previously discussed)
    {
        id: "ssc-selection-posts-phase-xiii-2025",
        title: "SSC Selection Posts Phase-XIII/2025", 
        // Standardized from "ssc" to "govt" for consistency with the specified values [conversation history]
        sector: "govt",
        subcategory: "various", // Broad subcategory due to "Various Posts" [12]
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
            "Age Limit (as on 01.08.2025): Specific to each post (e.g., 18-25, 18-27, 18-30, 20-25 years).", 
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
    },

    // New Job 1: Ordnance Factory Chanda Apprentice Recruitment 2025
    {
        id: "ordnance-factory-chanda-apprentice-2025",
        title: "Ordnance Factory Chanda Apprentice Recruitment 2025", 
        // Ordnance Factory is a government entity under the Ministry of Defence, so "govt" [Inferred]
        sector: "govt",
        // "Graduate & Technician Posts" suggests a technical or engineering subcategory [20]
        subcategory: "technical",
        // Deadline not explicitly mentioned in the provided snippet [20]
        deadline: "TBD",
        // Source [20] states "Apply Offline", so a direct online application link is not applicable here.
        applyLink: "Apply Offline (Online link not specified in provided sources)",
        description: "This recruitment is for 140 Graduate & Technician Apprentice positions at Ordnance Factory Chanda.", 
        postedDate: admin.firestore.Timestamp.now(), // Set to current import date as per import script practice [3]
        jobTitle: "Graduate & Technician Apprentice",
        organization: {
            hiringBody: "Ordnance Factory Chanda",
            type: "Government of India (Public Sector/Defence Production)" // Inferred
        },
        postDetails: {
            totalVacancies: 140,
            postName: "Graduate & Technician Apprentice"
        },
        eligibility: [], // Detailed eligibility criteria not available in source [20]
        importantDates: {}, // Specific dates not available in source [20]
        applicationFee: {}, // Fee details not available in source [20]
        applicationProcess: [], // Process details beyond "Apply Offline" not available in source [20]
        salaryAndBenefits: [], // Salary/stipend details not available in source [20]
        selectionProcess: [], // Selection process details not available in source [20]
        tableEligibilitySummary: "N/A (Details not available in sources)",
        tableAgeLimitSummary: "N/A (Details not available in sources)"
    },

    // New Job 2: SSC CHSL 2025: LDC, JSA, DEO Recruitment
    {
        id: "ssc-chsl-2025",
        title: "SSC CHSL 2025 Notification Out for 3131 LDC, JSA & DEO Posts",
        // Staff Selection Commission (SSC) is a government body [22]
        sector: "govt",
        // LDC, JSA, DEO roles are primarily clerical and administrative 
        subcategory: "clerical",
        deadline: "2025-07-18", // Online Application End Date is 18th July 2025 
        applyLink: "https://ssc.nic.in/", // Consistent with other SSC job document and suggested by source [24]
        description: "The Staff Selection Commission (SSC) has officially released the much-awaited SSC CHSL 2025 Notification, bringing great news for aspirants seeking government jobs after the 12th standard. The commission has announced approximately 3131 tentative vacancies for Group C posts, including Lower Divisional Clerk (LDC), Junior Secretariat Assistant (JSA), and Data Entry Operators (DEO) across various central government ministries, departments, and offices.", 
        postedDate: admin.firestore.Timestamp.now(), // Notification released on June 23, 2025 [21], setting to current import time as per script practice [3]
        jobTitle: "Lower Divisional Clerk (LDC) / Junior Secretariat Assistant (JSA), Data Entry Operator (DEO), Data Entry Operator, Grade ‘A’", 
        organization: {
            hiringBody: "Staff Selection Commission (SSC)", 
            type: "Government of India"
        },
        postDetails: {
            totalVacancies: 3131, 
            location: "Across India" 
        },
        eligibility: [
            "Educational Qualification (as on 01-01-2026): Candidates must have passed the 12th Standard or an equivalent examination. For Data Entry Operator (DEO)/ DEO Grade ‘A’ in the Ministry of Consumer Affairs, Food & Public Distribution, Ministry of Culture, and Staff Selection Commission, candidates must have passed 12th Standard in the Science stream with Mathematics as a subject. Candidates appearing for 12th-grade exams can apply if they possess the essential qualification by the cut-off date.", 
            "Age Limit (as on 01-01-2026): The required age limit is 18 to 27 years (born not earlier than 02-01-1999 and not later than 01-01-2008). Upper age relaxation is provided for various reserved categories (SC/ST: 5 years, OBC: 3 years, PwBD: 10-15 years, Ex-Servicemen: 3 years, etc.)." 
        ],
        importantDates: {
            notificationReleaseDate: "2025-06-23", 
            onlineApplicationStart: "2025-06-23",
            onlineApplicationEnd: "2025-07-18", 
            lastDateForOnlineFeePayment: "2025-07-19", 
            applicationFormCorrectionWindow: "2025-07-23 to 2025-07-24", 
            tierIExamDateCBE: "2025-09-08 to 2025-09-18", 
            tierIIExamDateCBE: "February-March 2026 (Tentative)" 
        },
        applicationFee: {
            feePayable: "₹100/-", 
            exemptions: "Women candidates and candidates belonging to Scheduled Castes (SC), Scheduled Tribes (ST), Persons with Benchmark Disabilities (PwBD), and Ex-servicemen (ESM) are exempted from payment of the fee.", 
            paymentMode: "Online through BHIM UPI, Net Banking, or Credit/Debit cards." 
        },
        salaryAndBenefits: [
            "Posts offer attractive salary packages and allowances as per the 7th Pay Commission.", 
            "Post-wise Pay Levels: Lower Division Clerk (LDC) / JSA (Level-2: ₹19,900 – 63,200), Data Entry Operator (DEO) (Level-4: ₹25,500 – 81,100), Data Entry Operator (DEO) (Level-5: ₹29,200 – 92,300), Data Entry Operator, Grade ‘A’ (Level-4: ₹25,500 – 81,100).", 
            "Additional allowances include Dearness Allowance (DA), House Rent Allowance (HRA), and Transport Allowance (TA)." ],
      
        selectionProcess: [
            "Tier-I: A computer-based objective multiple-choice examination (qualifying stage, 0.50 marks negative marking for each incorrect answer).", 
            "Tier-II: A computer-based examination conducted in two sessions, including objective tests and a skill/typing test (1 mark negative marking for wrong answers in Section-I, Section-II, and Section-III).", 
            "Final selection is based on overall performance in the Tier-II examination, subject to qualifying all its sections.", 
            "Document Verification is conducted by the user departments/ministries after the final result declaration for successful candidates." 
        ],
        tableEligibilitySummary: "12th Pass (Science with Maths for specific DEO posts)", // Summarized from source [26]
        tableAgeLimitSummary: "18-27 years (as on 01-01-2026), relaxations apply" // Summarized from source 
    },

    // New Job 3: SBI Circle Based Officer Recruitment 2025
    {
        id: "sbi-cbo-2025",
        title: "SBI Circle Based Officer Recruitment 2025", 
        // State Bank of India (SBI) is a Public Sector Bank, thus "govt"
        sector: "govt",
        // The role is in the banking sector
        subcategory: "banking",
        // Deadline not explicitly mentioned for the "Reopened" status in the provided snippet [33]
        deadline: "TBD",
        // A specific apply link for the reopened status is not provided, directing to check official portal
        applyLink: "Apply Link Not Specified (check official SBI career portal)",
        description: "This recruitment drive by State Bank of India (SBI) is for Circle Based Officers, with 2964 vacancies. The application process has been re-opened.", 
        postedDate: admin.firestore.Timestamp.now(), // Set to current import date as per import script practice [3]
        jobTitle: "Circle Based Officer",
        organization: {
            hiringBody: "State Bank of India (SBI)",
            type: "Public Sector Bank" // Inferred
        },
        postDetails: {
            totalVacancies: 2964, 
            postName: "Circle Based Officer"
        },
        eligibility: [], // Detailed eligibility criteria not available in source [33]
        importantDates: {}, // Specific dates not available in source [33]
        applicationFee: {}, // Fee details not available in source [33]
        applicationProcess: [], // Process details not available in source [33]
        salaryAndBenefits: [], // Salary/benefits not available in source [33]
        selectionProcess: [], // Selection process details not available in source [33]
        tableEligibilitySummary: "N/A (Details not available in sources)",
        tableAgeLimitSummary: "N/A (Details not available in sources)"
    },
    {
    id: "indian-coast-guard-navik-yantrik-2025",
    title: "Indian Coast Guard Recruitment 2025 for Navik (GD, DB) & Yantrik Posts | CGEPT 01 & 02/2026 Batch – Last Date Extended",
    sector: "government",
    subcategory: "defence",
    deadline: "2025-06-29", // Extended Till 29.06.2025 [1, 6]
    applyLink: "https://indiancoastguard.gov.in/", // Official Website provided as the starting point for application [12, 14]
    description: "The Indian Coast Guard (ICG), under the Ministry of Defence, has released an official notification inviting online applications from eligible male Indian citizens for the recruitment of Navik (General Duty), Navik (Domestic Branch), and Yantrik for the CGEPT 01/2026 & 02/2026 batches. This is a remarkable opportunity for individuals aspiring to build a prestigious career in the armed forces.", // [1]
    postedDate: "2025-06-12", // Original post date [1]
    jobTitle: "Navik (General Duty), Navik (Domestic Branch), Yantrik", // [2]
    organization: {
        hiringBody: "Indian Coast Guard (ICG)", // [2]
        underMinistry: "Ministry of Defence, Government of India" // [2]
    },
    postDetails: {
        postName: "Navik (General Duty), Navik (Domestic Branch), Yantrik (Mechanical, Electrical, Electronics)", // [2]
        totalVacancies: 630, // [2]
        batches: "CGEPT – 01/2026 & 02/2026", // [2]
        location: "Across India", // [2]
        whoCanApply: "All India Male Candidates", // [2]
        vacancyBreakdown: {
            CGEPT_01_2026_Batch: {
                "Navik (General Duty)": 260, // [3]
                "Yantrik (Mechanical)": 30, // [3]
                "Yantrik (Electrical)": 11, // [3]
                "Yantrik (Electronics)": 19 // [3]
            },
            CGEPT_02_2026_Batch: {
                "Navik (General Duty)": 260, // [3]
                "Navik (Domestic Branch)": 50 // [3]
            },
            note: "The vacancies for Navik (GD) and Navik (DB) are distributed zone-wise. Candidates must provide a domicile certificate to be considered for their respective zones." // [3]
        }
    },
    eligibility: {
        educationalQualification: [
            "Navik (General Duty): Must have passed Class 12th with Maths and Physics from an education board recognized by the Council of Boards for School Education (COBSE).", // [4]
            "Navik (Domestic Branch): Must have passed Class 10th from an education board recognized by COBSE.", // [4]
            "Yantrik: Must have passed Class 10th from a COBSE-recognized board AND hold a 3 or 4-year Diploma in Electrical/ Mechanical / Electronics/ Telecommunication (Radio/Power) Engineering approved by the All India Council of Technical Education (AICTE). OR Passed Class 10th and 12th from a COBSE-recognized board AND a 2 or 3-year Diploma in the aforementioned engineering streams approved by AICTE." // [4, 5]
        ],
        ageLimit: [
            "Minimum Age: 18 Years, Maximum Age: 22 Years.", // [5]
            "Navik (GD) for 01/26 & 02/26 batch: Candidates should be born between 01 August 2004 to 01 August 2008 (inclusive).", // [5]
            "Yantrik for 01/26 batch: Candidates should be born between 01 March 2004 to 01 March 2008 (inclusive).", // [5]
            "Navik (DB) for 02/26 batch: Candidates should be born between 01 August 2004 to 01 August 2008 (inclusive)." // [5]
        ],
        ageRelaxation: "An upper age relaxation of 5 years is applicable for SC/ST candidates and 3 years for OBC (non-creamy layer) candidates for posts reserved for them." // [6]
    },
    importantDates: {
        onlineApplicationStart: "2025-06-11", // [6]
        onlineApplicationEnd: "2025-06-29", // Extended from 25th June [1, 6]
        cgept01_stage1_exam: "Mid/End September 2025", // [6]
        cgept01_stage2_exam: "Mid/End November 2025", // [6]
        cgept01_stage3_training_commence: "End February 2026", // [6]
        cgept02_stage1_exam: "Mid/End February 2026", // [6]
        cgept02_stage2_exam: "Mid/End April 2026", // [6]
        cgept02_stage3_training_commence: "End July 2026" // [6]
    },
    applicationFee: {
        generalOBC_EWS: "₹ 300/- (Rupees Three Hundred Only)", // [14]
        scSt: "No Fee", // [14]
        paymentMode: "Online (Net Banking, Credit/Debit Card, UPI)" // [14]
    },
    applicationProcess: [
        "Visit the Official Website: Go to the ICG recruitment portal.", // [12]
        "Registration: Register yourself using a valid Email ID and Mobile Number. Keep these details safe, as all communication will be sent to them.", // [12]
        "Fill the Application Form: Log in and fill out the application form with accurate personal, academic, and communication details.", // [12]
        "Upload Documents: Upload scanned copies of the required documents in the prescribed format and size. This includes: Recent passport-size photograph (not older than 3 months); Live image capture; Scanned signature; Date of Birth proof (10th marksheet); Identity proof (Aadhaar Card, PAN card etc.); Domicile Certificate (for Navik GD/DB); Category Certificate (SC/ST/OBC/EWS), if applicable.", // [12, 13]
        "Pay Application Fee: Pay the fee through the online payment gateway.", // [13]
        "Submit and Print: Review your application using the “Print Preview” option and then submit it. Take a printout of the final application form for future reference." // [13]
    ],
    salaryAndBenefits: {
        payScale: {
            navik: "Basic Pay of ₹21,700/- (Pay Level-3) plus Dearness Allowance and other allowances based on the nature of duty and place of posting.", // [7]
            yantrik: "Basic Pay of ₹29,200/- (Pay Level-5). In addition, a Yantrik Pay of ₹6,200/- will be provided, along with Dearness Allowance and other allowances." // [7]
        },
        promotion: "Excellent promotion prospects exist up to the rank of Pradhan Adhikari / Pradhan Shayak Engineer with a pay scale of ₹47,600/- (Pay Level 8).", // [8]
        otherBenefits: [
            "Free ration and clothing.", // [8]
            "Free medical treatment for self and family, including dependent parents.", // [8]
            "Government accommodation or House Rent Allowance (HRA).", // [8]
            "45 days of Earned Leave and 8 days of Casual Leave every year.", // [8]
            "Leave Travel Concession (LTC) for self and family.", // [8]
            "Contributory Pension Scheme (NPS) and Gratuity on retirement.", // [8]
            "Canteen (CSD) facilities.", // [8]
            "ECHS medical facilities after retirement.", // [8]
            "Insurance cover of ₹75 lakhs (on contribution)." // [8]
        ]
    },
    selectionProcess: [
        "Stage-I: Computer Based Examination (CBE): This is an online objective-type examination. The test structure varies by post: Navik (DB) - Section I; Navik (GD) - Section I + II; Yantrik (Electrical) - Section I + III; Yantrik (Electronics) - Section I + IV; Yantrik (Mechanical) - Section I + V. Passing each section separately is compulsory. There is no negative marking.", // [9]
        "Stage-II: Qualifying Stage: Candidates shortlisted from Stage-I will undergo an OMR-based Assessment Test (qualifying in nature), Physical Fitness Test (PFT) including a 1.6 Km run in 7 minutes, 20 Squat ups, and 10 Push-ups (all in continuity). This stage also includes Document Verification (of original documents against application information) and a Recruitment Medical Examination as per prescribed standards.", // [10]
        "Stage-III: Final Selection at INS Chilka: Candidates who clear Stage-II and stand in the merit list will be called for this stage, which involves Final Document Verification, Pre-Enrolment Medicals, and submission of original documents, police verification, and other forms.", // [11]
        "Stage-IV: Post-Training Verification: All submitted documents will be verified by the respective boards/universities after the candidates join for training. Any document found to be non-genuine will lead to termination from service." // [11]
],
    tableEligibilitySummary: "Class 10th (Navik DB), Class 12th with Maths & Physics (Navik GD), or Class 10th/12th with relevant 2-4 year Engineering Diploma (Yantrik); All India Male Candidates.", // [2, 4, 5]
    tableAgeLimitSummary: "18-22 years, with specific date ranges for each post (e.g., 01 Aug 2004 to 01 Aug 2008 for Navik GD/DB) and age relaxations for SC/ST (5 years) and OBC (3 years)." // [5, 6]
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


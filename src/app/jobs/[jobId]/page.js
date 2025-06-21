// src/app/jobs/[jobId]/page.js
"use client"; // This directive marks the component as a Client Component.

import { notFound } from 'next/navigation';
import JobDetailsView from '@/components/JobDetailsView.js'; // Using alias
import { useRouter } from 'next/navigation'; // For client-side navigation
import React, { useState, useEffect } from 'react';

import { db, auth } from '@/firebaseConfig.js'; // Using alias
import { doc, getDoc } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';


// Helper to retrieve job by ID (now async for Firestore)
async function getJobByIdFromFirestore(jobId) {
  const appId = typeof __app_id !== 'undefined' ? __app_id : 'default-app-id';
  const jobDocRef = doc(db, `artifacts/${appId}/public/data/jobs`, jobId);

  try {
    const jobSnap = await getDoc(jobDocRef);
    if (jobSnap.exists()) {
      return { id: jobSnap.id, ...jobSnap.data() };
    }
  } catch (e) {
    console.error("Error fetching job from Firestore (client-side context):", e);
  }

  // Fallback for dynamically generated jobs stored in localStorage (from LLM demo)
  if (typeof window !== 'undefined' && jobId.startsWith('generated-')) {
    const storedJob = localStorage.getItem(jobId);
    if (storedJob) {
      try {
        return JSON.parse(storedJob);
      } catch (e) {
        console.error("Error parsing stored job data from localStorage:", e);
        return null;
      }
    }
  }
  return null;
}

// Function to generate dynamic metadata for each job page
// This runs on the server. The getJobByIdFromFirestore called here
// needs to be able to fetch data in a server context.
// As discussed, this might require Firebase Admin SDK setup for real deployments.
export async function generateMetadata({ params }) {
  const job = await getJobByIdFromFirestore(params.jobId); // Await the async fetch

  if (!job) {
    return {
      title: "Job Not Found | Job Finder",
      description: "The job you are looking for does not exist.",
    };
  }

  const jobTitle = job.jobTitle || job.title || 'Job Details';
  const description = job.description || `Detailed information about the ${jobTitle} position at ${job.organization?.conductedBy || 'various organizations'}.`;
  const keywords = [
    jobTitle,
    job.category ? `${job.category} jobs` : '',
    job.organization?.conductedBy,
    'job vacancy', 'recruitment', 'career', 'latest jobs',
    ...(Array.isArray(job.eligibility) ? job.eligibility : [])
  ].filter(Boolean).join(', '); // Filter out any empty strings

  const currentUrl = `https://www.jobvacancy.com/jobs/${job.id}`;
  const ogImage = job.ogImage || 'https://www.jobvacancy.com/images/job-finder-og.png';
  const twitterImage = job.twitterImage || 'https://www.jobvacancy.com/images/job-finder-twitter.png';

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "JobPosting",
    "title": jobTitle,
    "description": description,
    "identifier": {
      "@type": "PropertyValue",
      "name": job.organization?.conductedBy || "Job Vacancy Hub",
      "value": job.id
    },
    // Ensure dates are correctly formatted for JSON-LD
    "datePosted": job.postedDate?.toDate ? job.postedDate.toDate().toISOString().split('T')[0] : (job.postedDate ? new Date(job.postedDate).toISOString().split('T')[0] : new Date().toISOString().split('T')[0]),
    "validThrough": job.deadline ? new Date(job.deadline).toISOString().split('T')[0] : undefined,
    "employmentType": job.employmentType || "FULL_TIME",
    "hiringOrganization": {
      "@type": "Organization",
      "name": job.organization?.conductedBy || "Job Vacancy Hub",
      "sameAs": "https://www.jobvacancy.com/" // Link to your organization's page or homepage
    },
    "jobLocation": {
      "@type": "Place",
      "address": {
        "@type": "PostalAddress",
        "streetAddress": job.jobLocation?.address?.streetAddress || "N/A", // If location is more detailed
        "addressLocality": job.jobLocation?.address?.addressLocality || job.location || "India", // City or general area
        "addressRegion": job.jobLocation?.address?.addressRegion || "IN", // Country code or region
        "postalCode": job.jobLocation?.address?.postalCode || undefined,
        "addressCountry": "IN"
      }
    },
    "baseSalary": {
      "@type": "MonetaryAmount",
      "currency": "INR", // Indian Rupees
      "value": {
        "@type": "QuantitativeValue",
        "value": job.postDetails?.payScale?.match(/₹([\d,]+)/)?.[1]?.replace(/,/g, '') || undefined, // Extract numbers
        "unitText": "MONTH" // Assuming monthly pay, adjust as needed
      }
    },
    "responsibilities": (job.postDetails?.responsibilities && Array.isArray(job.postDetails.responsibilities) ? job.postDetails.responsibilities : []).join('. '), // If responsibilities were extracted as an array
    "qualifications": (job.eligibility && Array.isArray(job.eligibility) ? job.eligibility : []).join('. '), // If eligibility were extracted as an array
    "url": currentUrl
  };


  return {
    title: jobTitle,
    description: description,
    keywords: keywords,
    alternates: {
      canonical: currentUrl,
    },
    openGraph: {
      title: jobTitle,
      description: description,
      url: currentUrl,
      type: 'article', // More specific for job posts
      images: [{ url: ogImage }],
    },
    twitter: {
      card: 'summary_large_image',
      title: jobTitle,
      description: description,
      images: [{ url: twitterImage }],
    },
    // Add JSON-LD directly to metadata
    "script": [{
      "type": "application/ld+json",
      "dangerouslySetInnerHTML": { __html: JSON.stringify(jsonLd) }
    }]
  };
}


// Main Page Component for displaying job details
const JobDetailPage = ({ params }) => {
  const router = useRouter();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAuthReady, setIsAuthReady] = useState(false);

  useEffect(() => {
    // Listen for auth state changes to ensure Firebase is ready
    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      setIsAuthReady(true);
    });
    return () => unsubscribeAuth();
  }, []);


  useEffect(() => {
    if (!isAuthReady) return; // Wait until auth is ready before fetching

    const fetchJob = async () => {
      setLoading(true);
      setError(null);
      try {
        const fetchedJob = await getJobByIdFromFirestore(params.jobId);
        if (!fetchedJob) {
          notFound(); // If job not found, trigger Next.js notFound handler
        }
        setJob(fetchedJob);
      } catch (err) {
        setError(err.message);
        console.error("Error fetching job details:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchJob();
  }, [params.jobId, isAuthReady]); // Re-fetch if jobId changes or auth state changes

  // Handle client-side temporary job data for generated posts
  const handleClose = () => {
    // If it was a dynamically generated job, remove it from localStorage upon closing
    if (params.jobId.startsWith('generated-')) {
      localStorage.removeItem(params.jobId);
    }
    router.back(); // Go back to the previous page (list or home)
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center text-gray-700">Loading job details...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center text-red-700">Error: {error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-800">
      <main className="container mx-auto px-4 py-8">
        <div className="text-left mb-6">
          <button onClick={handleClose} className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors duration-200">
            &larr; Back to Listings
          </button>
        </div>
        <JobDetailsView job={job} onClose={handleClose} />
      </main>
    </div>
  );
};

export default JobDetailPage;

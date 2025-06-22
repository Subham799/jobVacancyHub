// src/app/jobs/[jobId]/page.js
// This is a Server Component. NO "use client" directive here.

import { notFound } from 'next/navigation';

// IMPORTANT: This path expects JobDetailClient.js to be in the SAME DIRECTORY
// (i.e., src/app/jobs/[jobId]/JobDetailClient.js)
import JobDetailClient from './JobDetailClient';

// IMPORTANT: This path expects firebaseConfig.js to be in your project's 'src' directory.
// Relative path from src/app/jobs/[jobId]:
// 1. ../ (from [jobId] to jobs)
// 2. ../ (from jobs to app)
// 3. ../ (from app to src)
import { db } from '../../../firebaseConfig.js';
import { doc, getDoc } from 'firebase/firestore'; // Firebase Firestore module (external package)


// Helper to retrieve job by ID for Server Component context
async function getJobByIdFromFirestore(jobId) {
  const appId = typeof __app_id !== 'undefined' ? __app_id : 'default-app-id';
  const jobDocRef = doc(db, `artifacts/${appId}/public/data/jobs`, jobId);

  try {
    const jobSnap = await getDoc(jobDocRef);
    if (jobSnap.exists()) {
      return { id: jobSnap.id, ...jobSnap.data() };
    }
  } catch (e) {
    console.error("Error fetching job from Firestore (server-side context):", e);
  }
  return null; // Return null if not found in Firestore
}

// Function to generate dynamic metadata for each job page (runs on the server)
export async function generateMetadata({ params }) {
  const job = await getJobByIdFromFirestore(params.jobId);

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
  ].filter(Boolean).join(', ');

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
    "datePosted": job.postedDate?.toDate ? job.postedDate.toDate().toISOString().split('T')[0] : (job.postedDate ? new Date(job.postedDate).toISOString().split('T')[0] : new Date().toISOString().split('T')[0]),
    "validThrough": job.deadline ? new Date(job.deadline).toISOString().split('T')[0] : undefined,
    "employmentType": job.employmentType || "FULL_TIME",
    "hiringOrganization": {
      "@type": "Organization",
      "name": job.organization?.conductedBy || "Job Vacancy Hub",
      "sameAs": "https://www.jobvacancy.com/"
    },
    "jobLocation": {
      "@type": "Place",
      "address": {
        "@type": "PostalAddress",
        "streetAddress": job.jobLocation?.address?.streetAddress || "N/A",
        "addressLocality": job.jobLocation?.address?.addressLocality || job.location || "India",
        "addressRegion": job.jobLocation?.address?.addressRegion || "IN",
        "postalCode": job.jobLocation?.address?.postalCode || undefined,
        "addressCountry": "IN"
      }
    },
    "baseSalary": {
      "@type": "MonetaryAmount",
      "currency": "INR",
      "value": {
        "@type": "QuantitativeValue",
        "value": job.postDetails?.payScale?.match(/₹([\d,]+)/)?.[1]?.replace(/,/g, '') || undefined,
        "unitText": "MONTH"
      }
    },
    "responsibilities": (job.postDetails?.responsibilities && Array.isArray(job.postDetails.responsibilities) ? job.postDetails.responsibilities : []).join('. '),
    "qualifications": (job.eligibility && Array.isArray(job.eligibility) ? job.eligibility : []).join('. '),
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
      type: 'article',
      images: [{ url: ogImage }],
    },
    twitter: {
      card: 'summary_large_image',
      title: jobTitle,
      description: description,
      images: [{ url: twitterImage }],
    },
    "script": [{
      "type": "application/ld+json",
      "dangerouslySetInnerHTML": { __html: JSON.stringify(jsonLd) }
    }]
  };
}


// Main Page Component for displaying job details (Server Component)
export default function JobDetailPage({ params }) {
  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-800">
      <main className="container mx-auto px-4 py-8">
        {/* Render the Client Component and pass the params */}
        <JobDetailClient params={params} />
      </main>
    </div>
  );
}

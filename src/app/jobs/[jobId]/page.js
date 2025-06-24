// src/app/jobs/[jobId]/page.js

import { notFound } from 'next/navigation';
import { dbAdmin } from '@/lib/firebaseAdmin'; // ✅ Centralized Admin SDK

import JobDetailClient from './JobDetailClient'; // ✅ Client Component

// ✅ Server-side Firestore fetch using Admin SDK
async function getJobByIdFromFirestore(jobId) {
  const appId = process.env.NEXT_PUBLIC_APP_ID || 'default-app-id';
  const jobDocRef = dbAdmin.collection(`artifacts/${appId}/public/data/jobs`).doc(jobId);

  try {
    const jobSnap = await jobDocRef.get();
    if (jobSnap.exists) {
      return { id: jobSnap.id, ...jobSnap.data() };
    }
  } catch (e) {
    console.error("Error fetching job from Firestore (admin):", e);
  }
  return null;
}

// ✅ Dynamic metadata for each job page (SSR)
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
    "datePosted": job.postedDate?.toDate
      ? job.postedDate.toDate().toISOString().split('T')[0]
      : (job.postedDate ? new Date(job.postedDate).toISOString().split('T')[0] : new Date().toISOString().split('T')[0]),
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

// ✅ Server-rendered Job Detail Page
export default function JobDetailPage({ params }) {
  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-800">
      <main className="container mx-auto px-4 py-8">
        <JobDetailClient params={params} />
      </main>
    </div>
  );
}

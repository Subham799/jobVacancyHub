// src/app/jobs/[jobId]/JobDetailClient.js
"use client"; // This is a Client Component. It MUST have this directive.

import React, { useState, useEffect } from 'react';
import { useRouter, notFound } from 'next/navigation'; // useRouter is a client hook
// IMPORTANT: This path expects JobDetailsView.js to be in src/components.
// Relative path from src/app/jobs/[jobId]:
// 1. ../ (from [jobId] to jobs)
// 2. ../ (from jobs to app)
// 3. ../ (from app to src)
// 4. components/JobDetailsView.js (from src to components then the file)
import JobDetailsView from '../../../components/JobDetailsView.js';

// IMPORTANT: This path expects firebaseConfig.js to be in your project's 'src' directory.
// Relative path from src/app/jobs/[jobId]:
// 1. ../ (from [jobId] to jobs)
// 2. ../ (from jobs to app)
// 3. ../ (from app to src)
import { db, auth } from '../../../firebaseConfig.js'; // Firebase config import
import { doc, getDoc } from 'firebase/firestore'; // Firebase Firestore module (external package)
import { onAuthStateChanged } from 'firebase/auth'; // Firebase Auth module (external package)


// Helper to retrieve job by ID for Client Component context
// This function now handles both Firestore fetch and localStorage fallback
async function getJobByIdFromFirestoreClient(jobId) {
  // First, try to get from Firestore
  const appId = typeof __app_id !== 'undefined' ? __app_id : 'jobvacancy-60d3a';
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


const JobDetailClient = ({ params }) => {
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
        const fetchedJob = await getJobByIdFromFirestoreClient(params.jobId);
        if (!fetchedJob) {
          // In a client component, calling notFound() directly is usually
          // intended for server-side not found. For client-side, you might
          // show a custom message or redirect. For now, we'll keep it as is,
          // but be aware of its server-side primary intent.
          notFound();
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
    <>
      <div className="text-left mb-6">
        <button onClick={handleClose} className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors duration-200">
          &larr; Back to Listings
        </button>
      </div>
      <JobDetailsView job={job} onClose={handleClose} />
    </>
  );
};

export default JobDetailClient;

// src/app/jobs/government/page.js
"use client"; // This is a client component as it uses useRouter for navigation
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation'; // For programmatic navigation
import JobListingTable from '@/components/JobListingTable.js'; // Using alias

import { db, auth } from '@/firebaseConfig.js'; // Using alias
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';

// Helper to check if a job is expired
const isJobExpired = (deadlineString) => {
    if (!deadlineString || deadlineString === 'N/A') return false;
    try {
        const deadline = new Date(deadlineString);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return deadline < today;
    } catch (e) {
        console.error("Error parsing deadline date:", deadlineString, e);
        return false;
    }
};

const GovernmentJobsPage = () => {
  const router = useRouter();
  const [govtJobs, setGovtJobs] = useState([]);
  const [isAuthReady, setIsAuthReady] = useState(false);
  const [userId, setUserId] = useState(null); // Not directly used here, but good practice
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserId(user.uid);
      } else {
        setUserId(null);
      }
      setIsAuthReady(true);
    });
    return () => unsubscribeAuth();
  }, []);

  useEffect(() => {
    if (!isAuthReady) return; // Wait until auth state is confirmed

    const appId = typeof __app_id !== 'undefined' ? __app_id : 'jobvacancy-60d3a';
    const jobsCollectionRef = collection(db, `artifacts/${appId}/public/data/jobs`);

    // Fetch Government Jobs
    const qGovtJobs = query(jobsCollectionRef, where('category', '==', 'govt'));

    setLoading(true);
    const unsubscribe = onSnapshot(qGovtJobs, (snapshot) => {
      try {
        const jobsData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        const activeJobs = jobsData.filter(job => !isJobExpired(job.deadline));
        setGovtJobs(activeJobs);
        setError(null); // Clear any previous errors
      } catch (e) {
        setError("Error processing job data.");
        console.error("Error processing snapshot data:", e);
      } finally {
        setLoading(false);
      }
    }, (err) => {
      setError(`Error fetching data: ${err.message}`);
      console.error("Error fetching government jobs from Firestore:", err);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [isAuthReady]); // Re-run when auth state is ready


  const handleJobClick = (jobId) => {
    router.push(`/jobs/${jobId}`);
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 text-center text-gray-600">Loading government jobs...</div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8 text-center text-red-600">Error: {error}</div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-left mb-6">
        <button onClick={() => router.push('/')} className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors duration-200">
          &larr; Back to Home
        </button>
      </div>
      <JobListingTable
        title="Latest Government Jobs"
        jobs={govtJobs}
        onJobClick={handleJobClick}
      />
    </div>
  );
};

export default GovernmentJobsPage;

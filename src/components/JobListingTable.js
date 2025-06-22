// src/components/JobListingTable.js
"use client"; // Added directive

import React from 'react';
import { List } from 'lucide-react';
import { useRouter } from 'next/navigation'; // Import useRouter

// Helper to format date for job deadlines and check if expired
const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  try {
    const date = new Date(dateString);
    // Firestore Timestamp objects have a .toDate() method
    // This check ensures it works for both string dates and Firestore Timestamps
    const actualDate = dateString && typeof dateString.toDate === 'function' ? dateString.toDate() : new Date(dateString);
    return actualDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
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
        return false; // Treat as not expired if date is invalid
    }
};


const JobListingTable = ({ title, jobs }) => { // Removed onJobClick prop, will use useRouter directly
  const router = useRouter();

  const handleJobClick = (jobId) => {
    router.push(`/jobs/${jobId}`);
  };

  return (
    <section className="bg-white p-6 rounded-lg shadow-lg mb-8">
      <h2 className="text-2xl font-bold text-center text-gray-800 mb-6 flex items-center justify-center">
        <List className="mr-3 text-indigo-600" size={28} /> {title}
      </h2>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200 rounded-lg">
          <thead>
            <tr className="bg-gray-100 text-gray-700 uppercase text-sm leading-normal">
              <th className="py-3 px-6 text-left">Full Details</th>
              <th className="py-3 px-6 text-left">Name of Job</th>
              <th className="py-3 px-6 text-left">Job Category</th>
              <th className="py-3 px-6 text-left">Eligibility Criteria</th>
              <th className="py-3 px-6 text-left">Age Limit</th>
              <th className="py-3 px-6 text-left">Last Date of Submission</th>
              <th className="py-3 px-6 text-center">Apply Link</th>
            </tr>
          </thead>
          <tbody className="text-gray-600 text-sm font-light">
            {jobs.length > 0 ? (
              jobs.map((job) => (
                <tr key={job.id} className={`border-b border-gray-200 hover:bg-gray-50 ${isJobExpired(job.deadline) ? 'bg-gray-200 text-gray-400 opacity-70 italic' : ''}`}>
                  <td className="py-3 px-6 text-left whitespace-nowrap">
                    <button onClick={() => handleJobClick(job.id)} className="text-indigo-600 hover:text-indigo-800 font-medium hover:underline" disabled={isJobExpired(job.deadline)}>
                      View {isJobExpired(job.deadline) && '(Expired)'}
                    </button>
                  </td>
                  <td className="py-3 px-6 text-left">{job.title}</td>
                  <td className="py-3 px-6 text-left">{job.category}</td>
                  <td className="py-3 px-6 text-left">{job.tableEligibilitySummary || (Array.isArray(job.eligibility) ? job.eligibility.join(', ') : job.eligibility || 'N/A')}</td>
                  <td className="py-3 px-6 text-left">{job.tableAgeLimitSummary || job.ageLimit || 'N/A'}</td>
                  <td className="py-3 px-6 text-left">{formatDate(job.deadline)}</td>
                  <td className="py-3 px-6 text-center">
                    <Link href={job.applyLink} target="_blank" rel="noopener noreferrer" className={`text-blue-500 hover:text-blue-700 hover:underline ${isJobExpired(job.deadline) ? 'pointer-events-none text-gray-500' : ''}`}>
                      Apply Here
                    </Link>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="py-6 text-center text-gray-500">No jobs found in this category.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
};

export default JobListingTable;

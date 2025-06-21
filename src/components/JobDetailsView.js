// src/components/JobDetailsView.js
import React from 'react';
import { X } from 'lucide-react';

const JobDetailsView = ({ job, onClose }) => {
  if (!job) {
    return (
      <section className="bg-white p-6 rounded-lg shadow-lg mb-8 relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-gray-800">
          <X size={24} />
        </button>
        <div className="text-center text-gray-500 py-10">No job details to display.</div>
      </section>
    );
  }

  return (
    <section className="bg-white p-6 rounded-lg shadow-lg mb-8 relative">
      <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 hover:bg-gray-100 rounded-full p-1 transition-colors">
        <X size={24} />
      </button>
      <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">{job.jobTitle || 'Job Details'}</h2>

      {job.organization && (
        <div className="mb-6 p-4 bg-indigo-50 rounded-lg">
          <h3 className="text-xl font-semibold text-indigo-800 mb-2">Organization & Advertisement Details:</h3>
          <ul className="list-disc list-inside text-gray-700 text-base space-y-1">
            {Object.entries(job.organization).map(([key, value]) => (
              <li key={key}>
                <span className="font-medium capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}:</span> {value}
              </li>
            ))}
          </ul>
        </div>
      )}

      {job.postDetails && (
        <div className="mb-6 p-4 bg-green-50 rounded-lg">
          <h3 className="text-xl font-semibold text-green-800 mb-2">Post Details:</h3>
          <ul className="list-disc list-inside text-gray-700 text-base space-y-1">
            {Object.entries(job.postDetails).map(([key, value]) => (
              <li key={key}>
                <span className="font-medium capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}:</span> {value}
              </li>
            ))}
          </ul>
        </div>
      )}

      {job.eligibility && (
        <div className="mb-6 p-4 bg-yellow-50 rounded-lg">
          <h3 className="text-xl font-semibold text-yellow-800 mb-2">Eligibility Criteria:</h3>
          <ul className="list-disc list-inside text-gray-700 text-base space-y-1">
            {/* Ensure eligibility is an array before mapping */}
            {(Array.isArray(job.eligibility) ? job.eligibility : [job.eligibility]).filter(Boolean).map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        </div>
      )}

      {job.selectionProcess && (
        <div className="mb-6 p-4 bg-red-50 rounded-lg">
          <h3 className="text-xl font-semibold text-red-800 mb-2">Selection Process:</h3>
          <ul className="list-disc list-inside text-gray-700 text-base space-y-1">
            {(Array.isArray(job.selectionProcess) ? job.selectionProcess : [job.selectionProcess]).filter(Boolean).map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        </div>
      )}

      {job.examCenters && (
        <div className="mb-6 p-4 bg-blue-50 rounded-lg">
          <h3 className="text-xl font-semibold text-blue-800 mb-2">Exam Centers:</h3>
          <ul className="list-disc list-inside text-gray-700 text-base space-y-1">
            {(Array.isArray(job.examCenters) ? job.examCenters : [job.examCenters]).filter(Boolean).map((center, index) => (
              <li key={index}>{center}</li>
            ))}
          </ul>
        </div>
      )}

      {job.applicationFee && (
        <div className="mb-6 p-4 bg-purple-50 rounded-lg">
          <h3 className="text-xl font-semibold text-purple-800 mb-2">Application Fee & Payment Mode:</h3>
          <ul className="list-disc list-inside text-gray-700 text-base space-y-1">
            {Object.entries(job.applicationFee).map(([key, value]) => (
              <li key={key}>
                <span className="font-medium capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}:</span> {value}
              </li>
            ))}
          </ul>
        </div>
      )}

      {job.importantInstructions && (
        <div className="mb-6 p-4 bg-teal-50 rounded-lg">
          <h3 className="text-xl font-semibold text-teal-800 mb-2">Important Instructions:</h3>
          <ul className="list-disc list-inside text-gray-700 text-base space-y-1">
            {(Array.isArray(job.importantInstructions) ? job.importantInstructions : [job.importantInstructions]).filter(Boolean).map((instruction, index) => (
              <li key={index}>{instruction}</li>
            ))}
          </ul>
        </div>
      )}

      {job.howToApply && (
        <div className="mb-6 p-4 bg-gray-100 rounded-lg">
          <h3 className="text-xl font-semibold text-gray-800 mb-2">How To Apply:</h3>
          <ul className="list-disc list-inside text-gray-700 text-base space-y-1">
            {(Array.isArray(job.howToApply) ? job.howToApply : [job.howToApply]).filter(Boolean).map((instruction, index) => (
              <li key={index}>{instruction}</li>
            ))}
          </ul>
        </div>
      )}
      
      {job.applyLink && (
        <div className="text-center mt-8">
            <a href={job.applyLink} target="_blank" rel="noopener noreferrer"
               className="px-8 py-4 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 transition-colors duration-200 text-lg">
                Apply Now
            </a>
        </div>
      )}

    </section>
  );
};

export default JobDetailsView;

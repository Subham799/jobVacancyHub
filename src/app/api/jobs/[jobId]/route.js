// src/app/api/jobs/[jobId]/route.js
import pool from '../../../lib/db.js'; // Adjust path
import { NextResponse } from 'next/server';

// Helper to convert MySQL DATE/DATETIME to string for consistent frontend use
const formatDbJob = (dbJob) => {
  if (!dbJob) return null;

  // Convert MySQL Date/DateTime objects to ISO strings or formatted strings
  const formattedJob = { ...dbJob };
  if (formattedJob.deadline instanceof Date) {
    formattedJob.deadline = formattedJob.deadline.toISOString().split('T')[0];
  }
  if (formattedJob.postedDate instanceof Date) {
    formattedJob.postedDate = formattedJob.postedDate.toISOString();
  }

  // Parse JSON stringified arrays
  try {
    if (formattedJob.eligibility && typeof formattedJob.eligibility === 'string') {
      formattedJob.eligibility = JSON.parse(formattedJob.eligibility);
    }
  } catch (e) { console.error("Error parsing eligibility:", e); }
  try {
    if (formattedJob.selectionProcess && typeof formattedJob.selectionProcess === 'string') {
      formattedJob.selectionProcess = JSON.parse(formattedJob.selectionProcess);
    }
  } catch (e) { console.error("Error parsing selectionProcess:", e); }
  try {
    if (formattedJob.examCenters && typeof formattedJob.examCenters === 'string') {
      formattedJob.examCenters = JSON.parse(formattedJob.examCenters);
    }
  } catch (e) { console.error("Error parsing examCenters:", e); }
  try {
    if (formattedJob.importantInstructions && typeof formattedJob.importantInstructions === 'string') {
      formattedJob.importantInstructions = JSON.parse(formattedJob.importantInstructions);
    }
  } catch (e) { console.error("Error parsing importantInstructions:", e); }
  try {
    if (formattedJob.howToApply && typeof formattedJob.howToApply === 'string') {
      formattedJob.howToApply = JSON.parse(formattedJob.howToApply);
    }
  } catch (e) { console.error("Error parsing howToApply:", e); }


  // Reconstruct nested objects if stored as flat columns
  formattedJob.organization = {
    conductedBy: formattedJob.organization_conductedBy || 'N/A',
    location: formattedJob.organization_location || 'N/A',
    advertisementNo: formattedJob.organization_advertisementNo || 'N/A',
    applicationMode: formattedJob.organization_applicationMode || 'N/A',
    lastDateToApply: formattedJob.organization_lastDateToApply || 'N/A',
  };
  formattedJob.postDetails = {
    postName: formattedJob.postDetails_postName || 'N/A',
    totalVacancies: formattedJob.postDetails_totalVacancies || 0,
    ur: formattedJob.postDetails_ur || 0,
    obc: formattedJob.postDetails_obc || 0,
    sc: formattedJob.postDetails_sc || 0,
    st: formattedJob.postDetails_st || 0,
    ewc: formattedJob.postDetails_ewc || 0,
    group: formattedJob.postDetails_group || 'N/A',
    payScale: formattedJob.postDetails_payScale || 'N/A',
    additionalBenefits: formattedJob.postDetails_additionalBenefits || 'N/A',
  };
  formattedJob.applicationFee = {
    fee: formattedJob.applicationFee_fee || 'N/A',
    exemptedCategories: formattedJob.applicationFee_exemptedCategories || 'N/A',
    paymentMode: formattedJob.applicationFee_paymentMode || 'N/A',
  };
   formattedJob.jobLocation = {
    address: {
      streetAddress: formattedJob.jobLocation_address_streetAddress || 'N/A',
      addressLocality: formattedJob.jobLocation_address_addressLocality || 'N/A',
      addressRegion: formattedJob.jobLocation_address_addressRegion || 'N/A',
      postalCode: formattedJob.jobLocation_address_postalCode || 'N/A',
      addressCountry: formattedJob.jobLocation_address_addressCountry || 'N/A',
    }
  };


  // Remove flat columns that were moved to nested objects
  delete formattedJob.organization_conductedBy;
  delete formattedJob.organization_location;
  delete formattedJob.organization_advertisementNo;
  delete formattedJob.organization_applicationMode;
  delete formattedJob.organization_lastDateToApply;
  delete formattedJob.postDetails_postName;
  delete formattedJob.postDetails_totalVacancies;
  delete formattedJob.postDetails_ur;
  delete formattedJob.postDetails_obc;
  delete formattedJob.postDetails_sc;
  delete formattedJob.postDetails_st;
  delete formattedJob.postDetails_ewc;
  delete formattedJob.postDetails_group;
  delete formattedJob.postDetails_payScale;
  delete formattedJob.postDetails_additionalBenefits;
  delete formattedJob.applicationFee_fee;
  delete formattedJob.applicationFee_exemptedCategories;
  delete formattedJob.applicationFee_paymentMode;
  delete formattedJob.jobLocation_address_streetAddress;
  delete formattedJob.jobLocation_address_addressLocality;
  delete formattedJob.jobLocation_address_addressRegion;
  delete formattedJob.jobLocation_address_postalCode;
  delete formattedJob.jobLocation_address_addressCountry;

  return formattedJob;
};

// GET /api/jobs/[jobId] - Fetch a single job by ID
export async function GET(request, { params }) {
  const { jobId } = params;
  try {
    // Check localStorage first for 'generated-' jobs (from LLM demo)
    if (jobId.startsWith('generated-')) {
        if (typeof window !== 'undefined') { // Ensure localStorage is only accessed in client-side environment
            const storedJob = localStorage.getItem(jobId);
            if (storedJob) {
                return NextResponse.json(JSON.parse(storedJob));
            }
        }
        return NextResponse.json({ message: 'Job not found' }, { status: 404 });
    }

    // Fetch from database for regular jobs
    const [rows] = await pool.query('SELECT * FROM jobs WHERE id = ?', [jobId]);
    if (rows.length === 0) {
      return NextResponse.json({ message: 'Job not found' }, { status: 404 });
    }
    const job = formatDbJob(rows[0]);
    return NextResponse.json(job);
  } catch (error) {
    console.error('Error fetching job by ID:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}

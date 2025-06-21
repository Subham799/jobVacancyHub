// src/app/sitemap.js
// This file can generate a sitemap dynamically.
// In a real app, you'd fetch all job IDs from your database here.

// Placeholder for all job IDs (matching the 'id' field in your job data)
const allJobIds = [
  'upsc-civil-services',
  'ssc-cgl',
  'railway-recruitment',
  'rubber-board-field-officer-2025'
];

export default function sitemap() {
  const baseUrl = 'https://www.jobvacancy.com'; // Replace with your actual domain

  const jobRoutes = allJobIds.map((id) => ({
    url: `${baseUrl}/jobs/${id}`,
    lastModified: new Date().toISOString(), // You'd ideally use job.updatedAt here
    changeFrequency: 'daily', // Or 'weekly', 'monthly'
    priority: 0.8, // Higher priority for detail pages
  }));

  return [
    {
      url: baseUrl,
      lastModified: new Date().toISOString(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${baseUrl}/jobs/government`,
      lastModified: new Date().toISOString(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    // Add other static pages or category pages here
    // {
    //   url: `${baseUrl}/about`,
    //   lastModified: new Date().toISOString(),
    //   changeFrequency: 'monthly',
    //   priority: 0.5,
    // },
    ...jobRoutes,
  ];
}

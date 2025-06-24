// src/app/sitemap.js

// ✅ Import the initialized Firestore instance from our central file
import { dbAdmin } from '@/lib/firebaseAdmin';

export default async function sitemap() {
  const baseUrl = 'https://www.jobvacancy.com'; // 🔁 Replace with your actual domain

  let jobRoutes = [];

  // Check if dbAdmin was initialized correctly
  if (dbAdmin) {
    try {
      const appId = process.env.NEXT_PUBLIC_APP_ID || 'default-app-id';
      const jobsCollectionRef = dbAdmin.collection(`artifacts/${appId}/public/data/jobs`);
      const snapshot = await jobsCollectionRef.get();

      jobRoutes = snapshot.docs.map((doc) => ({
        url: `${baseUrl}/jobs/${doc.id}`,
        lastModified: doc.updateTime.toDate().toISOString(),
        changeFrequency: 'daily',
        priority: 0.8,
      }));

      console.log(`Sitemap generated: ${jobRoutes.length} job routes added.`);
    } catch (error) {
      console.error('Error fetching jobs for sitemap:', error);
      // Don't let a fetch error break the entire build
      jobRoutes = []; 
    }
  } else {
    console.warn("Firestore Admin instance (dbAdmin) is not available for sitemap.");
  }

  // Static routes
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
    ...jobRoutes,
  ];
}
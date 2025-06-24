// src/app/sitemap.js
// This file can generate a sitemap dynamically.
// It will now fetch all job IDs from your Firestore database.

// IMPORTANT: Ensure you have 'firebase-admin' installed as a dependency: npm install firebase-admin
import admin from 'firebase-admin';
import { getFirestore } from 'firebase-admin/firestore';

// Initialize Firebase Admin SDK if not already initialized
if (!admin.apps.length) {
  try {
    admin.initializeApp({
      credential: admin.credential.cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'), // Handle newline chars
      })
    });
  } catch (error) {
    console.error("Firebase Admin initialization error in sitemap.js:", error);
    // In a real deployment, you might want to log this or return an empty sitemap
    // to prevent build failures.
  }
}

// Get Firestore instance from Admin SDK
const db = admin.apps.length ? getFirestore() : null;

export default async function sitemap() {
  const baseUrl = 'https://www.jobvacancy.com'; // IMPORTANT: Replace with your actual deployed domain!

  let jobRoutes = [];
  if (db) {
    try {
      const appId = process.env.NEXT_PUBLIC_APP_ID || 'default-app-id'; // Use environment variable for app ID
      const jobsCollectionRef = db.collection(`artifacts/${appId}/public/data/jobs`);
      const snapshot = await jobsCollectionRef.get();
      
      jobRoutes = snapshot.docs.map((doc) => ({
        url: `${baseUrl}/jobs/${doc.id}`,
        lastModified: doc.updateTime.toDate().toISOString(), // Use Firestore update time for lastModified
        changeFrequency: 'daily', // Assuming jobs change frequently
        priority: 0.8, // Higher priority for detail pages
      }));
      console.log(`Sitemap generated: Added ${jobRoutes.length} job routes.`);
    } catch (error) {
      console.error('Error fetching jobs for sitemap:', error);
      // Fallback to an empty array or handle error gracefully
      jobRoutes = []; 
    }
  } else {
    console.warn("Firebase Admin SDK not initialized, cannot fetch jobs for sitemap.");
  }


  return [
    {
      url: baseUrl,
      lastModified: new Date().toISOString(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${baseUrl}/jobs/government`, // Assuming this page exists
      lastModified: new Date().toISOString(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    // Add other static pages here if they are not dynamically generated
    // {
    //   url: `${baseUrl}/about`,
    //   lastModified: new Date().toISOString(),
    //   changeFrequency: 'monthly',
    //   priority: 0.5,
    // },
    ...jobRoutes,
  ];
}

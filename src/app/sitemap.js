// src/app/sitemap.js

import admin from 'firebase-admin';
import { getFirestore } from 'firebase-admin/firestore';

// ✅ Initialize Firebase Admin SDK using the base64 service account JSON
if (!admin.apps.length) {
  try {
    const serviceAccountBase64 = process.env.FIREBASE_SERVICE_ACCOUNT;

    if (!serviceAccountBase64) {
      throw new Error("Missing FIREBASE_SERVICE_ACCOUNT environment variable");
    }

    const serviceAccount = JSON.parse(
      Buffer.from(serviceAccountBase64, 'base64').toString('utf8')
    );

    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount)
    });
  } catch (error) {
    console.error("Firebase Admin initialization error in sitemap.js:", error);
  }
}

// ✅ Get Firestore instance
const db = admin.apps.length ? getFirestore() : null;

// ✅ Sitemap generation
export default async function sitemap() {
  const baseUrl = 'https://www.jobvacancy.com'; // 🔁 Replace with your actual domain

  let jobRoutes = [];

  if (db) {
    try {
      const appId = process.env.NEXT_PUBLIC_APP_ID || 'default-app-id'; // 🔁 Use proper app ID
      const jobsCollectionRef = db.collection(`artifacts/${appId}/public/data/jobs`);
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
      url: `${baseUrl}/jobs/government`,
      lastModified: new Date().toISOString(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    ...jobRoutes,
  ];
}

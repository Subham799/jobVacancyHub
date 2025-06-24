// src/lib/firebaseAdmin.js

import admin from 'firebase-admin';
import { getFirestore } from 'firebase-admin/firestore';

// Check if we have already initialized the app
if (!admin.apps.length) {
  try {
    const serviceAccountBase64 = process.env.FIREBASE_SERVICE_ACCOUNT;

    if (!serviceAccountBase64) {
      throw new Error("FIREBASE_SERVICE_ACCOUNT environment variable is not set.");
    }

    // Decode the base64 string and parse the JSON
    const serviceAccount = JSON.parse(
      Buffer.from(serviceAccountBase64, 'base64').toString('utf8')
    );

    // Initialize the app with the credentials
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount)
    });
    
    console.log("Firebase Admin SDK initialized successfully.");

  } catch (error) {
    // Log a more descriptive error message
    console.error("Firebase Admin initialization error:", error.message);
  }
}

// Export the initialized Firestore instance for use in other files
const dbAdmin = getFirestore();

export { dbAdmin };
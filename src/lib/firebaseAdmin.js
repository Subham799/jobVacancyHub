// src/lib/firebaseAdmin.js
import admin from 'firebase-admin';
import { getFirestore } from 'firebase-admin/firestore';

if (!admin.apps.length) {
  try {
    const serviceAccountBase64 = process.env.FIREBASE_SERVICE_ACCOUNT;

    if (!serviceAccountBase64) {
      throw new Error("FIREBASE_SERVICE_ACCOUNT environment variable is not set.");
    }

    const serviceAccount = JSON.parse(
      Buffer.from(serviceAccountBase64, 'base64').toString('utf8')
    );

    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount)
    });

    console.log("✅ Firebase Admin SDK initialized");
  } catch (error) {
    console.error("Firebase Admin initialization error:", error.message);
  }
}

// ✅ Only call getFirestore() if app is initialized
const dbAdmin = admin.apps.length ? getFirestore() : null;

export { dbAdmin };

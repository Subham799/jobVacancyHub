
import { getAuth, signInAnonymously, signInWithCustomToken } from "firebase/auth";

import { initializeApp, getApps } from "firebase/app";
// import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyBvgRUF3hXwrIeiTAgmpq7yEi5V53jajSQ",
  authDomain: "jobvacancy-60d3a.firebaseapp.com",
  projectId: "jobvacancy-60d3a",
  storageBucket: "jobvacancy-60d3a.firebasestorage.app",
  messagingSenderId: "4322038171",
  appId: "1:4322038171:web:07752627ff6d4081e4513e",
  measurementId: "G-Z27LGDNVDT"
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApps()[0];
const db = getFirestore(app);
const auth = getAuth(app);
let analytics = null;
if (typeof window !== "undefined") {
  analytics = getAnalytics(app);
}
// const analytics = getAnalytics(app);

const initializeAuth = async () => {
  if (typeof __initial_auth_token !== 'undefined' && __initial_auth_token) {
    // Canvas environment: Use provided custom token
    try {
      await signInWithCustomToken(auth, __initial_auth_token);
      console.log("Firebase signed in with custom token (Canvas):", auth.currentUser.uid);
    } catch (error) {
      console.error("Firebase custom token sign-in error (Canvas):", error);
      // Fallback for Canvas if custom token fails (shouldn't happen often)
      try {
        await signInAnonymously(auth);
        console.log("Firebase signed in anonymously as fallback (Canvas).");
      } catch (anonError) {
        console.error("Firebase anonymous sign-in error (Canvas):", anonError);
      }
    }
  } else {
    // Live deployment or local development outside Canvas: Sign in anonymously
    // This allows the app to read/write to Firestore if rules permit unauthenticated access,
    // or if `request.auth != null` rules are used with anonymous sign-in.
    try {
      await signInAnonymously(auth);
      console.log("Firebase signed in anonymously (Live/Local).");
    } catch (error) {
      console.error("Firebase anonymous sign-in error (Live/Local):", error);
    }
  }
};

// Call the authentication initialization
initializeAuth();


export { db, auth };

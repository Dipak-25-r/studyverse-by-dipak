/**
 * StudyVerse by Dipak - Core Firebase Infrastructure Hub
 */

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { 
  getAuth, 
  GoogleAuthProvider, 
  signInWithPopup, 
  signOut, 
  onAuthStateChanged 
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";
import { getAnalytics, logEvent } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-analytics.js";

const firebaseConfig = {
  apiKey: "AIzaSyDlZCxkZjZTmd67vlvSEelJlFOoB3MjBcg",
  authDomain: "studyverse-by-dipak.firebaseapp.com",
  projectId: "studyverse-by-dipak",
  storageBucket: "studyverse-by-dipak.firebasestorage.app",
  messagingSenderId: "811811751165",
  appId: "1:811811751165:web:40deed4afc0c9b5f57aa94",
  measurementId: "G-GN9C869FQB"
};


// Initialize Core Application Sandbox Context
const app = initializeApp(firebaseConfig);

// Initialize Infrastructure Modules
export const db = getFirestore(app);
export const analytics = getAnalytics(app);
export const auth = getAuth(app);

// 1. Initialize Google Auth Provider
const googleProvider = new GoogleAuthProvider();
// Force account selection popup every time (good for student testing)
googleProvider.setCustomParameters({ prompt: 'select_account' }); 

/**
 * Trigger Google Login Popup Flow
 */
export async function loginWithGoogle() {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    // This gives you a Google Access Token to access Google APIs if needed.
    const credential = GoogleAuthProvider.credentialFromResult(result);
    const user = result.user;
    
    console.log("Logged in user details:", user);
    logEvent(analytics, "login", { method: "Google" });
    return user;
  } catch (error) {
    console.error("Google authentication failed:", error.message);
    throw error;
  }
}

/**
 * Trigger Global Sign Out
 */
export async function logoutUser() {
  try {
    await signOut(auth);
    logEvent(analytics, "logout");
    console.log("User successfully signed out.");
  } catch (error) {
    console.error("Sign out failure:", error.message);
  }
}

/**
 * Custom Telemetry Event Tracker
 */
export function trackSystemEvent(eventName, eventParams = {}) {
  try {
    logEvent(analytics, eventName, eventParams);
  } catch (err) {
    console.error("Telemetry failed to trace:", err);
  }
}

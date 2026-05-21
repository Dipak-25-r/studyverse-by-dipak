import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";
import { getAnalytics, logEvent } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-analytics.js";

// Paste your actual generated keys inside this object configuration block:
const firebaseConfig = {
  apiKey: "AIzaSyDlZCxkZjZTmd67vlvSEelJlFOoB3MjBcg",
  authDomain: "studyverse-by-dipak.firebaseapp.com",
  projectId: "studyverse-by-dipak",
  storageBucket: "studyverse-by-dipak.firebasestorage.app",
  messagingSenderId: "811811751165",
  appId: "1:811811751165:web:40deed4afc0c9b5f57aa94",
  measurementId: "G-GN9C869FQB"
};


// Initialize Application Sandbox Context Node
const app = initializeApp(firebaseConfig);

// Export Cryptographic Security & Persistent Session Handles
export const auth = getAuth(app);

// Export Globally Indexable Non-Relational Datastore Instance
export const db = getFirestore(app);


// Initialize and Export the Analytics Tracker Engine Instance
export const analytics = getAnalytics(app);

/**
 * Custom Telemetry Broadcaster Wrapper Helper
 * Call this function from any script to log targeted performance metrics custom events.
 */
export function trackSystemEvent(eventName, eventParams = {}) {
  try {
    logEvent(analytics, eventName, eventParams);
  } catch (err) {
    console.error("Failed to forward tracking trace metric downstream:", err);
  }
}

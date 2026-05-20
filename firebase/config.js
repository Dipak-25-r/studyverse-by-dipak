/**
 * StudyVerse by Dipak - Core Firebase Infrastructure Configuration Hub
 * Architectural responsibility: Initialize the decentralized web client sdk engines,
 * spin up distributed firestore connections, and bind cloud binary bucket contexts.
 */

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";
import { getStorage } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-storage.js";

// Global Ecosystem Environmental Constants (Replace placeholders with your real credentials)
const firebaseConfig = {
  apiKey: "YOUR_FIREBASE_API_KEY_PRODUCTION_REPLACE",
  authDomain: "studyverse-by-dipak.firebaseapp.com",
  projectId: "studyverse-by-dipak",
  storageBucket: "studyverse-by-dipak.appspot.com",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APPLICATION_HEX_ID_NODE"
};

// Initialize Application Sandbox Context Node
const app = initializeApp(firebaseConfig);

// Export Cryptographic Security & Persistent Session Handles
export const auth = getAuth(app);

// Export Globally Indexable Non-Relational Datastore Instance
export const db = getFirestore(app);

// Export Binary Object Pipeline Storage System
export const storage = getStorage(app);

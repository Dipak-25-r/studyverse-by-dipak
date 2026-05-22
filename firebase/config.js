// We use the full CDN URLs here so your browser can load them instantly from any page folder depth
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { 
  getAuth, 
  GoogleAuthProvider, 
  signInWithPopup, 
  signOut 
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

// Create global export handles
export let db = null;
export let analytics = null;
export let auth = null;

const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: 'select_account' }); 

// Crash-proof Initialization wrapper: Keeps the website alive even if the API Key is invalid!
try {
  const app = initializeApp(firebaseConfig);
  db = getFirestore(app);
  auth = getAuth(app);
  
  // Initialize analytics safely if supported by browser environment
  analytics = getAnalytics(app);
} catch (error) {
  console.error("Firebase Initialization blocked due to invalid configuration credentials:", error.message);
}

// Google Login Function
export async function loginWithGoogle() {
  if (!auth) {
    alert("Authentication is currently offline. Please check your Firebase API key settings configuration.");
    return;
  }
  try {
    const result = await signInWithPopup(auth, googleProvider);
    if (analytics) logEvent(analytics, "login", { method: "Google" });
    return result.user;
  } catch (error) {
    console.error("Google authentication failed:", error.message);
    throw error;
  }
}

// Logout Function
export async function logoutUser() {
  if (!auth) return;
  try {
    await signOut(auth);
    if (analytics) logEvent(analytics, "logout");
  } catch (error) {
    console.error("Sign out failure:", error.message);
  }
}

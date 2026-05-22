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


const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const analytics = getAnalytics(app);
export const auth = getAuth(app);

const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: 'select_account' }); 

// Google Login Function
export async function loginWithGoogle() {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    logEvent(analytics, "login", { method: "Google" });
    return result.user;
  } catch (error) {
    console.error("Google authentication failed:", error.message);
    throw error;
  }
}

// Logout Function
export async function logoutUser() {
  try {
    await signOut(auth);
    logEvent(analytics, "logout");
  } catch (error) {
    console.error("Sign out failure:", error.message);
  }
}

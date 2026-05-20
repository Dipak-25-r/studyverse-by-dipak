/**
 * StudyVerse Identity Framework Module
 * Architectural responsibility: Multi-tenant credential verification, Session Lifecycle hooks, 
 * database mutations on registration, and navigation route guards.
 */

import { auth, db } from "../firebase/config.js";
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  onAuthStateChanged 
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
import { doc, setDoc, getDoc } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

// Global Guard Middleware protecting sensitive application routing contexts
export async function routeGuard() {
  return new Promise((resolve) => {
    onAuthStateChanged(auth, async (user) => {
      if (!user) {
        localStorage.removeItem("user_uid");
        // Force redirect unauthorized traffic out if accessing private spaces
        const path = window.location.pathname;
        if (path.includes("profile.html") || path.includes("settings.html") || path.includes("upload.html") || path.includes("chat.html")) {
          window.location.href = "login.html";
        }
        resolve(null);
      } else {
        localStorage.setItem("user_uid", user.uid);
        const snapshot = await getDoc(doc(db, "users", user.uid));
        resolve({ uid: user.uid, ...snapshot.data() });
      }
    });
  });
}

// Attach UI Event Processors if running natively on login window frame
document.addEventListener("DOMContentLoaded", () => {
  const tabLogin = document.getElementById("tab-login");
  const tabSignup = document.getElementById("tab-signup");
  const formLogin = document.getElementById("form-login");
  const formSignup = document.getElementById("form-signup");
  const alertBox = document.getElementById("auth-alert");

  if (!formLogin) return; // Prevent lifecycle crash on pages without authentication interfaces

  const triggerAlert = (msg, isSuccess = false) => {
    if (!alertBox) return;
    alertBox.innerText = msg;
    alertBox.className = isSuccess 
      ? "mb-4 p-4 rounded-xl text-xs font-mono bg-green-500/10 border-green-500/30 text-green-400 border" 
      : "mb-4 p-4 rounded-xl text-xs font-mono bg-red-500/10 border-red-500/30 text-red-400 border";
  };

  // Switch Interactivity Context Layout Controls
  if (tabLogin && tabSignup && formLogin && formSignup) {
    tabLogin.addEventListener("click", () => {
      tabLogin.className = "flex-1 text-center font-semibold text-sm pb-2 text-indigo-400 border-b-2 border-indigo-500 focus:outline-none";
      tabSignup.className = "flex-1 text-center font-semibold text-sm pb-2 text-gray-500 focus:outline-none";
      formLogin.classList.remove("hidden");
      formSignup.classList.add("hidden");
    });

    tabSignup.addEventListener("click", () => {
      tabSignup.className = "flex-1 text-center font-semibold text-sm pb-2 text-indigo-400 border-b-2 border-indigo-500 focus:outline-none";
      tabLogin.className = "flex-1 text-center font-semibold text-sm pb-2 text-gray-500 focus:outline-none";
      formSignup.classList.remove("hidden");
      formLogin.classList.add("hidden");
    });
  }

  // Account Authentication Execution Sub-routine
  formLogin.addEventListener("submit", async (e) => {
    e.preventDefault();
    const email = document.getElementById("login-email").value.trim();
    const pass = document.getElementById("login-password").value;
    try {
      const credential = await signInWithEmailAndPassword(auth, email, pass);
      localStorage.setItem("user_uid", credential.user.uid);
      triggerAlert("Identity validated. Initializing secure space mapping...", true);
      setTimeout(() => window.location.href = "profile.html", 1000);
    } catch (err) {
      triggerAlert(`Authentication rejected: ${err.message}`);
    }
  });

  // Account Infrastructure Registration Mutation Lifecycle
  formSignup.addEventListener("submit", async (e) => {
    e.preventDefault();
    const name = document.getElementById("sign-name").value.trim();
    const address = document.getElementById("sign-address").value.trim();
    const contact = document.getElementById("sign-contact").value.trim();
    const email = document.getElementById("sign-email").value.trim();
    const pass = document.getElementById("sign-password").value;

    try {
      const res = await createUserWithEmailAndPassword(auth, email, pass);
      // Synchronously write structured document record to Firebase Database Firestore index
      await setDoc(doc(db, "users", res.user.uid), {
        uid: res.user.uid,
        name,
        address,
        contact,
        email,
        profession: "Workspace Member",
        bio: "Initialized workspace profile pipeline node.",
        followers: [],
        following: [],
        createdAt: new Date().toISOString()
      });
      triggerAlert("Identity initialized and database workspace structured successfully.", true);
      setTimeout(() => window.location.href = "profile.html", 1200);
    } catch (err) {
      triggerAlert(`Registration aborted: ${err.message}`);
    }
  });
});

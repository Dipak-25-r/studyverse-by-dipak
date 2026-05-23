/**
 * StudyVerse Identity Framework Module (auth.js)
 * Architectural responsibility: Multi-tenant credential verification, Session Lifecycle hooks, 
 * database mutations on registration, and navigation route guards with anti-hang resolution.
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
    let internalStateResolved = false;

    // 1. ANTI-HANG SAFETY LIFECYCLE: Bypasses infinite loader loops if network/Firebase throttles token validation
    const safetyGraceTimeout = setTimeout(() => {
      if (!internalStateResolved) {
        internalStateResolved = true;
        console.warn("Ecosystem Identity Framework: Token synchronization timed out. Falling back to Guest context.");
        
        const path = window.location.pathname;
        const isPrivateRoute = path.includes("profile.html") || 
                               path.includes("settings.html") || 
                               path.includes("upload.html") || 
                               path.includes("chat.html");

        if (isPrivateRoute) {
          window.location.href = "login.html";
        } else {
          resolve({ authenticated: false, user: null });
        }
      }
    }, 1200); // 1.2 Second maximize grace threshold

    // 2. Main Auth Listener Thread Entry
    onAuthStateChanged(auth, async (user) => {
      // Clear safety timer immediately if Firebase responds ahead of schedule
      clearTimeout(safetyGraceTimeout);
      
      if (internalStateResolved) return;
      internalStateResolved = true;

      const path = window.location.pathname;
      
      // Define exactly which pages REQUIRE a login to see
      const isPrivateRoute = path.includes("profile.html") || 
                             path.includes("settings.html") || 
                             path.includes("upload.html") || 
                             path.includes("chat.html");

      if (!user) {
        localStorage.removeItem("user_uid");
        
        // Force redirect unauthorized traffic out ONLY if accessing private routes
        if (isPrivateRoute) {
          window.location.href = "login.html";
          return; 
        }
        
        // If on a public page, resolve gracefully as a guest workspace member
        resolve({ authenticated: false, user: null });
      } else {
        localStorage.setItem("user_uid", user.uid);
        
        try {
          const snapshot = await getDoc(doc(db, "users", user.uid));
          // Return an authenticated flag along with user database profiles
          resolve({ 
            authenticated: true, 
            uid: user.uid, 
            name: user.displayName || (snapshot.exists() ? snapshot.data().name : "Workspace Member"),
            ...(snapshot.exists() ? snapshot.data() : {}) 
          });
        } catch (error) {
          console.error("Error fetching user profile payload from Firestore:", error);
          // Fallback so application execution doesn't stall if database fails
          resolve({ authenticated: true, uid: user.uid, name: user.displayName || "Workspace Member" });
        }
      }
    });
  });
}

// Attach UI Event Processors natively if running on the login window frame
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

  // Account Infrastructure Registration Mutation Lifecycle (With Loop and Auto-Fire Prevention Guards)
  formSignup.addEventListener("submit", async (e) => {
    e.preventDefault();

    // 🛑 GUARD 1: Prevent automatic execution on empty fields during page load glitches
    const emailInput = document.getElementById("sign-email");
    const passInput = document.getElementById("sign-password");

    if (!emailInput || !passInput) return;

    const email = emailInput.value.trim();
    const pass = passInput.value;

    // If inputs are blank strings, do not send malicious/empty payloads to Google's SDK backend
    if (!email || !pass) {
      console.warn("Ecosystem Interceptor: Registration blocked. Form submission fired without complete user inputs.");
      return; 
    }

    // 🛑 GUARD 2: Prevent password rule exhaustion errors (Minimum 6 characters rule)
    if (pass.length < 6) {
      triggerAlert("Registration aborted: Passwords must be at least 6 characters long.");
      return;
    }

    const name = document.getElementById("sign-name")?.value.trim() || "New Member";
    const address = document.getElementById("sign-address")?.value.trim() || "";
    const contact = document.getElementById("sign-contact")?.value.trim() || "";

    try {
      // Disengage form button state elements so users cannot multi-click during loading times
      const submitBtn = formSignup.querySelector("button[type='submit']");
      if (submitBtn) submitBtn.disabled = true;

      const res = await createUserWithEmailAndPassword(auth, email, pass);
      
      // Write user payload safely down to Cloud Firestore indices
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
      
      // Re-enable submit actions if registration fails so they can make adjustments
      const submitBtn = formSignup.querySelector("button[type='submit']");
      if (submitBtn) submitBtn.disabled = false;
    }
  });
});

/**
 * StudyVerse by Dipak - Core Application Engine & Navigation Router
 * Architectural responsibility: Global state management, UI theme persistence,
 * dynamic header injection, and real-time Firebase Google Authentication.
 */

import { auth, loginWithGoogle, logoutUser } from "./firebase/config.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";

document.addEventListener("DOMContentLoaded", () => {
  // 1. Initialize Global Loader Dismissal Engine
  const loader = document.getElementById("global-loader");
  if (loader) {
    setTimeout(() => {
      loader.classList.add("loader-hidden");
    }, 450);
  }

  // 2. Enforce System Custom Dark/Light Themes
  const persistedTheme = localStorage.getItem("theme") || "dark";
  if (persistedTheme === "light") {
    document.documentElement.classList.add("light-theme");
  } else {
    document.documentElement.classList.remove("light-theme");
  }

  // 3. Reactively Build, Inject, and Update Navigation Bar via Firebase Auth State
  const navbarContainer = document.getElementById("global-navbar");
  if (navbarContainer) {
    
    // Compute paths contextually based on directory depth level
    const isSubdir = window.location.pathname.includes("/notes/");
    const base = isSubdir ? "../" : "";

    // Set layout classes
    navbarContainer.className = "w-full border-b border-gray-800/40 bg-slate-950/60 backdrop-blur-md sticky top-0 z-50 transition-colors duration-300";

    // Listen to Firebase auth instead of localStorage to render the buttons
    onAuthStateChanged(auth, (user) => {
      
      // Define what the profile/auth section looks like for Desktop & Mobile
      let authDesktopHTML = "";
      let authMobileHTML = "";

      if (user) {
        // Logged-in state layouts
        authDesktopHTML = `
          <div class="flex items-center space-x-3">
            <div class="flex items-center gap-2 bg-slate-900/50 pl-2 pr-3 py-1 rounded-full border border-gray-800">
              <img src="${user.photoURL}" alt="avatar" class="w-6 h-6 rounded-full object-cover">
              <span class="text-xs font-medium text-gray-300">Hi, ${user.displayName.split(' ')[0]}</span>
            </div>
            <a href="${base}upload.html" class="px-3.5 py-1.5 rounded-lg bg-indigo-500/10 text-indigo-400 hover:bg-indigo-500 hover:text-white border border-indigo-500/20 transition-all"><i class="fas fa-cloud-upload-alt mr-1"></i> Ingest</a>
            <a href="${base}profile.html" class="hover:text-white transition-colors"><i class="fas fa-user-circle mr-1"></i> Identity</a>
            <a href="${base}settings.html" class="hover:text-white text-gray-300 transition-colors"><i class="fas fa-cog text-sm"></i></a>
            <button id="logoutBtn" class="px-3 py-1.5 rounded-lg border border-gray-800 hover:border-red-500/30 text-gray-400 hover:text-red-400 text-xs transition-colors">Sign Out</button>
          </div>
        `;

        authMobileHTML = `
          <div class="flex items-center gap-2 px-2 py-1 bg-slate-900/40 rounded-xl mb-2">
            <img src="${user.photoURL}" alt="avatar" class="w-6 h-6 rounded-full">
            <span class="text-xs text-gray-300">Hi, ${user.displayName}</span>
          </div>
          <a href="${base}upload.html" class="hover:text-white py-1 transition-colors"><i class="fas fa-cloud-upload-alt w-5"></i> Ingest Engine</a>
          <a href="${base}profile.html" class="hover:text-white py-1 transition-colors"><i class="fas fa-user-circle w-5"></i> Identity Ledger</a>
          <a href="${base}settings.html" class="hover:text-white py-1 transition-colors"><i class="fas fa-cog w-5"></i> Settings</a>
          <button id="mobileLogoutBtn" class="w-full text-center py-2.5 mt-2 rounded-xl border border-gray-800 text-red-400 font-semibold text-sm">Sign Out</button>
        `;
      } else {
        // Logged-out state layouts
        authDesktopHTML = `
          <button id="loginBtn" class="px-4 py-2 rounded-xl bg-indigo-500 text-white hover:bg-indigo-600 transition-colors shadow-lg shadow-indigo-500/10">Authorize Terminal</button>
        `;

        authMobileHTML = `
          <button id="mobileLoginBtn" class="w-full text-center py-2.5 rounded-xl bg-indigo-500 text-white transition-all font-semibold">Authorize Session</button>
        `;
      }

      // Inject the completed navbar containing the correct auth state layout strings
      navbarContainer.innerHTML = `
        <div class="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <a href="${base}index.html" class="flex items-center space-x-2 group">
            <span class="text-xl font-black tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-400 group-hover:from-indigo-300 group-hover:to-purple-300 transition-all">
              StudyVerse <span class="text-[10px] font-medium tracking-normal text-gray-500">by Dipak</span>
            </span>
          </a>
          
          <nav class="hidden md:flex items-center space-x-6 text-xs font-semibold tracking-wide text-gray-400">
            <a href="${base}notes/stds.html" class="hover:text-white transition-colors"><i class="fas fa-book-open mr-1"></i> Notes</a>
            <a href="${base}feed.html" class="hover:text-white transition-colors"><i class="fas fa-stream mr-1"></i> Feed</a>
            <a href="${base}chat.html" class="hover:text-white transition-colors"><i class="fas fa-comments mr-1"></i> Nexus Chat</a>
            <a href="${base}info.html" class="hover:text-white transition-colors"><i class="fas fa-info-circle mr-1"></i> Team</a>
            ${authDesktopHTML}
          </nav>

          <button id="mobile-menu-trigger" class="md:hidden text-gray-400 hover:text-white text-lg focus:outline-none">
            <i class="fas fa-bars"></i>
          </button>
        </div>

        <div id="mobile-nav-drawer" class="hidden border-t border-gray-800/60 bg-slate-950 px-4 py-4 space-y-3 flex flex-col text-sm font-medium text-gray-400 md:hidden animate-fade-in">
          <a href="${base}notes/stds.html" class="hover:text-white py-1 transition-colors"><i class="fas fa-book-open w-5"></i> Notes Directory</a>
          <a href="${base}feed.html" class="hover:text-white py-1 transition-colors"><i class="fas fa-stream w-5"></i> Main Feed</a>
          <a href="${base}chat.html" class="hover:text-white py-1 transition-colors"><i class="fas fa-comments w-5"></i> Nexus Chat</a>
          <a href="${base}info.html" class="hover:text-white py-1 transition-colors"><i class="fas fa-info-circle w-5"></i> Core Team</a>
          ${authMobileHTML}
        </div>
      `;

      // Bind functional dynamic listeners to injected elements safely
      bindAuthListeners();
    });
  }

  // 4. Hook Button Actions & Menu Interceptors
  function bindAuthListeners() {
    // Desktop & Mobile Login Buttons
    const triggerLogin = () => loginWithGoogle().catch(err => console.error("Login crashed:", err));
    document.getElementById("loginBtn")?.addEventListener("click", triggerLogin);
    document.getElementById("mobileLoginBtn")?.addEventListener("click", triggerLogin);

    // Desktop & Mobile Logout Buttons
    document.getElementById("logoutBtn")?.addEventListener("click", () => logoutUser());
    document.getElementById("mobileLogoutBtn")?.addEventListener("click", () => logoutUser());

    // Mobile Navigation Drawer Toggle Handler
    const trigger = document.getElementById("mobile-menu-trigger");
    const drawer = document.getElementById("mobile-nav-drawer");
    if (trigger && drawer) {
      trigger.addEventListener("click", () => {
        drawer.classList.toggle("hidden");
        const icon = trigger.querySelector("i");
        if (icon) {
          icon.classList.toggle("fa-bars");
          icon.classList.toggle("fa-times");
        }
      });
    }
  }
});

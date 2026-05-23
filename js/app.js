/**
 * StudyVerse by Dipak - Core Application Engine & Navigation Router
 * Architectural responsibility: Global state management, UI theme persistence,
 * dynamic header injection, and real-time Firebase Google Authentication.
 */

import { auth, loginWithGoogle, logoutUser } from "../firebase/config.js"; 
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";

document.addEventListener("DOMContentLoaded", () => {
  // 1. DISMISS LOADER IMMEDIATELY NO MATTER WHAT
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

  // 3. Render and Bind Navigation Menu Safely
  try {
    initializeNavbarEngine();
  } catch (err) {
    console.error("Core navbar engine layout failed to mount safely:", err);
  }
});

function initializeNavbarEngine() {
  const navbarContainer = document.getElementById("global-navbar");
  if (!navbarContainer) return;
    
  const isSubdir = window.location.pathname.includes("/notes/");
  const base = isSubdir ? "../" : "";

  navbarContainer.className = "w-full border-b border-gray-800/40 bg-slate-950/60 backdrop-blur-md sticky top-0 z-50 transition-colors duration-300";

  // If auth object failed to boot due to an infrastructure/config error, render a clean backup layout
  if (!auth) {
    navbarContainer.innerHTML = `
      <div class="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        <a href="${base}index.html" class="flex items-center space-x-2">
          <span class="text-xl font-black text-white">StudyVerse <span class="text-xs text-red-400 font-mono">[Auth Engine Offline]</span></span>
        </a>
      </div>
    `;
    return;
  }

  // Watch Authentication Changes safely without crashing the layout rendering thread
  onAuthStateChanged(auth, (user) => {
    const currentPath = window.location.pathname;
    if (!user && (currentPath.includes("chat.html") || currentPath.includes("upload.html"))) {
      alert("Access Denied: Unauthenticated visitors can view content but cannot access Chat or Link Sharing nodes.");
      window.location.href = "index.html";
      return;
    }

    let authDesktopHTML = "";
    let authMobileHTML = "";

    if (user) {
      authDesktopHTML = `
        <div class="flex items-center space-x-3">
          <div class="flex items-center gap-2 bg-slate-900/50 pl-2 pr-3 py-1 rounded-full border border-gray-800">
            <img src="${user.photoURL}" alt="avatar" class="w-6 h-6 rounded-full object-cover" onerror="this.src='https://ui-avatars.com/api/?name=${encodeURIComponent(user.displayName)}'">
            <span class="text-xs font-medium text-gray-300">Hi, ${user.displayName.split(' ')[0]}</span>
          </div>
          <a href="${base}upload.html" class="px-3.5 py-1.5 rounded-lg bg-indigo-500/10 text-indigo-400 hover:bg-indigo-500 hover:text-white border border-indigo-500/20 transition-all"><i class="fas fa-link mr-1"></i> Share Link</a>
          <a href="${base}profile.html" class="hover:text-white transition-colors"><i class="fas fa-user mr-1"></i> Profile</a>
          <button id="logoutBtn" class="px-3 py-1.5 rounded-lg border border-gray-800 text-gray-400 hover:text-red-400 text-xs transition-colors cursor-pointer">Sign Out</button>
        </div>
      `;

      authMobileHTML = `
        <div class="flex items-center gap-2 px-2 py-1 bg-slate-900/40 rounded-xl mb-2">
          <img src="${user.photoURL}" alt="avatar" class="w-6 h-6 rounded-full object-cover" onerror="this.src='https://ui-avatars.com/api/?name=${encodeURIComponent(user.displayName)}'">
          <span class="text-xs text-gray-300">Hi, ${user.displayName}</span>
        </div>
        <a href="${base}upload.html" class="hover:text-white py-1 transition-colors"><i class="fas fa-link w-5"></i> Share Link</a>
        <a href="${base}profile.html" class="hover:text-white py-1 transition-colors"><i class="fas fa-user w-5"></i> Profile</a>
        <button id="mobileLogoutBtn" class="w-full text-center py-2.5 mt-2 rounded-xl border border-gray-800 text-red-400 font-semibold text-sm cursor-pointer">Sign Out</button>
      `;
    } else {
      authDesktopHTML = `
        <button id="loginBtn" class="px-4 py-2 rounded-xl bg-indigo-500 text-white hover:bg-indigo-600 transition-colors cursor-pointer">Authorize Terminal</button>
      `;
      authMobileHTML = `
        <button id="mobileLoginBtn" class="w-full text-center py-2.5 rounded-xl bg-indigo-500 text-white font-semibold cursor-pointer">Authorize Session</button>
      `;
    }

    navbarContainer.innerHTML = `
      <div class="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        <a href="${base}index.html" class="flex items-center space-x-2 group">
          <span class="text-xl font-black tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-400 transition-all">
            StudyVerse <span class="text-[10px] font-medium text-gray-500">by Dipak</span>
          </span>
        </a>
        
        <nav class="hidden md:flex items-center space-x-6 text-xs font-semibold tracking-wide text-gray-400">
          <a href="${base}notes/stds.html" class="hover:text-white transition-colors"><i class="fas fa-book-open mr-1"></i> Notes</a>
          <a href="${base}quiz.html" class="hover:text-white transition-colors"><i class="fas fa-tasks mr-1"></i> Quiz Engine</a>
          <a href="${base}graph.html" class="hover:text-white transition-colors"><i class="fas fa-chart-line mr-1"></i> GeoGebra Graph</a>
          <a href="${base}chat.html" class="hover:text-white transition-colors"><i class="fas fa-comments mr-1"></i> Chat Hub</a>
          ${authDesktopHTML}
        </nav>

        <button id="mobile-menu-trigger" class="md:hidden text-gray-400 hover:text-white text-lg focus:outline-none cursor-pointer">
          <i class="fas fa-bars"></i>
        </button>
      </div>

      <div id="mobile-nav-drawer" class="hidden border-t border-gray-800/60 bg-slate-950 px-4 py-4 space-y-3 flex flex-col text-sm font-medium text-gray-400 md:hidden">
        <a href="${base}notes/stds.html" class="hover:text-white py-1 transition-colors"><i class="fas fa-book-open w-5"></i> Notes</a>
        <a href="${base}quiz.html" class="hover:text-white py-1 transition-colors"><i class="fas fa-tasks w-5"></i> Quiz Engine</a>
        <a href="${base}graph.html" class="hover:text-white py-1 transition-colors"><i class="fas fa-chart-line w-5"></i> GeoGebra Graph</a>
        <a href="${base}chat.html" class="hover:text-white py-1 transition-colors"><i class="fas fa-comments w-5"></i> Chat Hub</a>
        ${authMobileHTML}
      </div>
    `;

    // Attaches Event Interceptors directly following layout generation
    bindAuthListeners();
  });
}

function bindAuthListeners() {
  const triggerLogin = () => loginWithGoogle().catch(err => alert("Sign-in popup closed or denied."));
  
  // Bind Login triggers across desktop & mobile instances safely
  document.getElementById("loginBtn")?.addEventListener("click", triggerLogin);
  document.getElementById("mobileLoginBtn")?.addEventListener("click", triggerLogin);

  // Bind Sign-out triggers across desktop & mobile instances safely
  document.getElementById("logoutBtn")?.addEventListener("click", () => logoutUser());
  document.getElementById("mobileLogoutBtn")?.addEventListener("click", () => logoutUser());

  // Handle Mobile layout responsive side drawers deployment toggle
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

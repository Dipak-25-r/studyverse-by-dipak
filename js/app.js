/**
 * StudyVerse by Dipak - Core Application Engine & Navigation Router
 * Architectural responsibility: Global state management, UI theme persistence,
 * and dynamic header/navigation injection across all nodes.
 */

document.addEventListener("DOMContentLoaded", () => {
  // Initialize Global Loader Dismissal Engine
  const loader = document.getElementById("global-loader");
  if (loader) {
    setTimeout(() => {
      loader.classList.add("loader-hidden");
    }, 450);
  }

  // Enforce System Custom Dark/Light Themes
  const persistedTheme = localStorage.getItem("theme") || "dark";
  if (persistedTheme === "light") {
    document.documentElement.classList.add("light-theme");
  } else {
    document.documentElement.classList.remove("light-theme");
  }

  // Build and Inject Global Navigation Matrix Header Node
  const navbarContainer = document.getElementById("global-navbar");
  if (navbarContainer) {
    const activeUserToken = localStorage.getItem("user_uid");
    
    // Compute paths contextually based on directory depth level
    const isSubdir = window.location.pathname.includes("/notes/");
    const base = isSubdir ? "../" : "";

    navbarContainer.className = "w-full border-b border-gray-800/40 bg-slate-950/60 backdrop-blur-md sticky top-0 z-50 transition-colors duration-300";
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
          ${activeUserToken ? `
            <a href="${base}upload.html" class="px-3.5 py-1.5 rounded-lg bg-indigo-500/10 text-indigo-400 hover:bg-indigo-500 hover:text-white border border-indigo-500/20 transition-all"><i class="fas fa-cloud-upload-alt mr-1"></i> Ingest</a>
            <a href="${base}profile.html" class="hover:text-white transition-colors"><i class="fas fa-user-circle mr-1"></i> Identity</a>
            <a href="${base}settings.html" class="hover:text-white text-gray-300 transition-colors"><i class="fas fa-cog text-sm"></i></a>
          ` : `
            <a href="${base}login.html" class="px-4 py-2 rounded-xl bg-indigo-500 text-white hover:bg-indigo-600 transition-colors shadow-lg shadow-indigo-500/10">Authorize Terminal</a>
          `}
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
        ${activeUserToken ? `
          <a href="${base}upload.html" class="hover:text-white py-1 transition-colors"><i class="fas fa-cloud-upload-alt w-5"></i> Ingest Engine</a>
          <a href="${base}profile.html" class="hover:text-white py-1 transition-colors"><i class="fas fa-user-circle w-5"></i> Identity Ledger</a>
          <a href="${base}settings.html" class="hover:text-white py-1 transition-colors"><i class="fas fa-cog w-5"></i> Settings</a>
        ` : `
          <a href="${base}login.html" class="w-full text-center py-2.5 rounded-xl bg-indigo-500 text-white transition-all font-semibold">Authorize Session</a>
        `}
      </div>
    `;

    // Hook Mobile Click Interceptor Trigger Events
    const trigger = document.getElementById("mobile-menu-trigger");
    const drawer = document.getElementById("mobile-nav-drawer");
    if (trigger && drawer) {
      trigger.addEventListener("click", () => {
        drawer.classList.toggle("hidden");
        const icon = trigger.querySelector("i");
        if (icon) icon.classList.toggle("fa-bars"), icon.classList.toggle("fa-times");
      });
    }
  }
});

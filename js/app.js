// Universal Architecture Handler
document.addEventListener("DOMContentLoaded", () => {
  initTheme();
  initLoader();
  renderNavbar();
});

function initTheme() {
  const savedTheme = localStorage.getItem("theme") || "dark";
  if (savedTheme === "light") {
    document.documentElement.classList.add("light-theme");
  } else {
    document.documentElement.classList.remove("light-theme");
  }
}

function initLoader() {
  const loader = document.getElementById("global-loader");
  if (loader) {
    window.addEventListener("load", () => {
      setTimeout(() => {
        loader.classList.add("loader-hide");
      }, 400);
    });
    setTimeout(() => {
      loader.classList.add("loader-hide");
    }, 2500);
  }
}

function renderNavbar() {
  const navContainer = document.getElementById("global-navbar");
  if (!navContainer) return;

  const currentPath = window.location.pathname;
  const isSubDir = currentPath.includes("/notes/");
  const basePrefix = isSubDir ? "../" : "";

  navContainer.className = "glass-card sticky top-0 z-50 px-6 py-4 flex justify-between items-center border-b shadow-lg transition-all duration-300";
  
  navContainer.innerHTML = `
    <div class="flex items-center space-x-3">
      <a href="${basePrefix}index.html" class="text-2xl font-bold tracking-wider text-indigo-500 hover:scale-105 transition-transform duration-300">StudyVerse</a>
    </div>
    <nav class="hidden md:flex space-x-8 text-sm font-medium">
      <a href="${basePrefix}index.html" class="hover:text-indigo-500 transition-colors ${currentPath.endsWith('index.html') || currentPath.endsWith('/') ? 'text-indigo-500 border-b-2 border-indigo-500' : ''}">Home</a>
      <a href="${basePrefix}notes/stds.html" class="hover:text-indigo-500 transition-colors ${currentPath.includes('notes/') ? 'text-indigo-500 border-b-2 border-indigo-500' : ''}">Notes</a>
      <a href="${basePrefix}feed.html" class="hover:text-indigo-500 transition-colors ${currentPath.endsWith('feed.html') ? 'text-indigo-500 border-b-2 border-indigo-500' : ''}">Feed</a>
      <a href="${basePrefix}chat.html" class="hover:text-indigo-500 transition-colors ${currentPath.endsWith('chat.html') ? 'text-indigo-500 border-b-2 border-indigo-500' : ''}">Chat</a>
      <a href="${basePrefix}upload.html" class="hover:text-indigo-500 transition-colors ${currentPath.endsWith('upload.html') ? 'text-indigo-500 border-b-2 border-indigo-500' : ''}">Upload</a>
      <a href="${basePrefix}info.html" class="hover:text-indigo-500 transition-colors ${currentPath.endsWith('info.html') ? 'text-indigo-500 border-b-2 border-indigo-500' : ''}">Team</a>
    </nav>
    <div class="flex items-center space-x-4">
      <a href="${basePrefix}profile.html" class="hover:scale-105 transition-transform"><i class="fas fa-user-circle text-2xl"></i></a>
      <a href="${basePrefix}settings.html" class="hover:scale-105 transition-transform"><i class="fas fa-cog text-2xl"></i></a>
      <button id="mobile-menu-btn" class="md:hidden text-2xl focus:outline-none"><i class="fas fa-bars"></i></button>
    </div>
    <div id="mobile-menu" class="hidden absolute top-full left-0 w-full glass-card flex flex-col p-6 space-y-4 shadow-xl border-t border-gray-700">
      <a href="${basePrefix}index.html" class="py-2 border-b border-gray-700">Home</a>
      <a href="${basePrefix}notes/stds.html" class="py-2 border-b border-gray-700">Notes</a>
      <a href="${basePrefix}feed.html" class="py-2 border-b border-gray-700">Feed</a>
      <a href="${basePrefix}chat.html" class="py-2 border-b border-gray-700">Chat</a>
      <a href="${basePrefix}upload.html" class="py-2 border-b border-gray-700">Upload</a>
      <a href="${basePrefix}info.html" class="py-2">Team</a>
    </div>
  `;

  document.getElementById("mobile-menu-btn").addEventListener("click", () => {
    document.getElementById("mobile-menu").classList.toggle("hidden");
  });
}

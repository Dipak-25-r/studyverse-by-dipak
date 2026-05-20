/**
 * Modern Micro-Feed Social Engineering Pipeline
 * Architectural responsibility: Dynamic UI structural rendering for data nodes, 
 * like mutations, and user engagement interfaces.
 */

import { routeGuard } from "./auth.js";
import { db } from "../firebase/config.js";
import { 
  collection, 
  query, 
  orderBy, 
  onSnapshot, 
  doc, 
  updateDoc, 
  arrayUnion, 
  arrayRemove 
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

document.addEventListener("DOMContentLoaded", async () => {
  const activeIdentity = await routeGuard();
  const timelineStream = document.getElementById("feed-stream");
  if (!timelineStream) return;

  const feedQuery = query(collection(db, "posts"), orderBy("timestamp", "desc"));

  // Open transaction streaming sockets
  onSnapshot(feedQuery, (snapshot) => {
    timelineStream.innerHTML = "";
    if (snapshot.empty) {
      timelineStream.innerHTML = `<div class="text-center text-gray-500 text-xs py-12">No active algorithmic micro-posts operating on timeline network loop.</div>`;
      return;
    }

    snapshot.forEach((postDoc) => {
      const data = postDoc.data();
      const docId = postDoc.id;
      const totalLikes = data.likes?.length || 0;
      const userHasLiked = activeIdentity && data.likes?.includes(activeIdentity.uid);

      const timelineCard = document.createElement("article");
      timelineCard.className = "glass-card rounded-2xl border border-gray-800/60 overflow-hidden shadow-xl hover:border-gray-700/80 transition-all duration-300";
      
      timelineCard.innerHTML = `
        <div class="p-4 bg-slate-900/20 border-b border-gray-900/40 flex items-center justify-between">
          <div class="flex items-center space-x-3">
            <div class="w-8 h-8 rounded-full bg-indigo-600/20 text-indigo-400 font-bold text-xs flex items-center justify-center border border-indigo-500/10">
              ${data.uploaderName ? data.uploaderName.substring(0, 2).toUpperCase() : "SV"}
            </div>
            <div>
              <h4 class="text-xs font-bold text-gray-200 tracking-wide">${data.uploaderName}</h4>
              <p class="text-[10px] text-gray-500 font-mono">${data.timestamp ? new Date(data.timestamp).toLocaleDateString() : ""}</p>
            </div>
          </div>
        </div>
        <div class="p-5 space-y-4">
          <p class="text-xs text-gray-300 leading-relaxed font-normal whitespace-pre-wrap">${data.text}</p>
          ${data.mediaUrl ? `
            <div class="rounded-xl overflow-hidden bg-slate-950 border border-gray-900 max-h-96 flex items-center justify-center">
              ${data.mediaType?.startsWith("image/") ? `<img src="${data.mediaUrl}" class="w-full h-full object-cover" alt="Post Media Payload">` : ""}
              ${data.mediaType?.startsWith("video/") ? `<video src="${data.mediaUrl}" controls class="w-full max-h-96 bg-black"></video>` : ""}
              ${data.mediaType?.startsWith("audio/") ? `<audio src="${data.mediaUrl}" controls class="w-full p-2"></audio>` : ""}
            </div>
          ` : ""}
        </div>
        <div class="px-5 py-3.5 bg-slate-900/10 border-t border-gray-900/40 flex items-center space-x-6">
          <button data-id="${docId}" data-liked="${userHasLiked}" class="btn-like-trigger flex items-center text-xs space-x-1.5 focus:outline-none transition-colors ${userHasLiked ? 'text-pink-500' : 'text-gray-500 hover:text-pink-400'}">
            <i class="${userHasLiked ? 'fas' : 'far'} fa-heart"></i>
            <span class="font-bold font-mono text-[11px]">${totalLikes}</span>
          </button>
        </div>
      `;

      // Bind functional dynamic engagement engines right onto rendered nodes
      const likeBtn = timelineCard.querySelector(".btn-like-trigger");
      if (likeBtn && activeIdentity) {
        likeBtn.addEventListener("click", async () => {
          const targetId = likeBtn.getAttribute("data-id");
          const executionState = likeBtn.getAttribute("data-liked") === "true";
          const documentReference = doc(db, "posts", targetId);

          try {
            await updateDoc(documentReference, {
              likes: executionState ? arrayRemove(activeIdentity.uid) : arrayUnion(activeIdentity.uid)
            });
          } catch (err) {
            console.error("Failed to mutate telemetry interaction index profile standard:", err);
          }
        });
      }

      timelineStream.appendChild(timelineCard);
    });
  });
});

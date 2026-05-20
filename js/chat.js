/**
 * Communications Matrix Sub-System Pipeline
 * Architectural responsibility: Manage real-time sub-second bidirectional data streams
 * for messaging components with zero rendering stutter.
 */

import { routeGuard } from "./auth.js";
import { db } from "../firebase/config.js";
import { 
  collection, 
  addDoc, 
  query, 
  orderBy, 
  limit, 
  onSnapshot 
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

document.addEventListener("DOMContentLoaded", async () => {
  const identityContext = await routeGuard();
  if (!identityContext) return;

  const msgFrame = document.getElementById("chat-messages-frame");
  const dispatchForm = document.getElementById("chat-dispatch-form");
  const inputText = document.getElementById("chat-input-text");

  if (!msgFrame || !dispatchForm) return;

  // Establish live persistent network pipeline subscription down into firestore metrics
  const chatQuery = query(collection(db, "nexus_chats"), orderBy("timestamp", "asc"), limit(100));

  onSnapshot(chatQuery, (snapshot) => {
    msgFrame.innerHTML = "";
    if (snapshot.empty) {
      msgFrame.innerHTML = `<div class="text-center text-gray-600 text-xs my-auto">Channel conversation loop initialization empty. Send transmission pack.</div>`;
      return;
    }

    snapshot.forEach((doc) => {
      const packet = doc.data();
      const isOutgoing = packet.senderUid === identityContext.uid;
      const parsedTime = packet.timestamp?.seconds 
        ? new Date(packet.timestamp.seconds * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) 
        : "";

      const msgNode = document.createElement("div");
      msgNode.className = `flex flex-col max-w-[75%] space-y-1 ${isOutgoing ? 'self-end items-end' : 'self-start items-start'}`;
      
      msgNode.innerHTML = `
        <span class="text-[10px] text-gray-500 font-semibold tracking-wider px-1">${packet.senderName}</span>
        <div class="p-3.5 rounded-2xl text-xs leading-relaxed ${isOutgoing ? 'bg-indigo-600 text-white rounded-tr-none' : 'bg-slate-900 border border-gray-800 text-gray-200 rounded-tl-none'} shadow-md">
          <p class="break-words font-medium">${packet.message}</p>
        </div>
        <span class="text-[9px] text-gray-600 font-mono px-1">${parsedTime}</span>
      `;
      msgFrame.appendChild(msgNode);
    });

    // Auto-scroll layout layer down to newest streaming node item
    msgFrame.scrollTo({ top: msgFrame.scrollHeight, behavior: 'smooth' });
  }, (err) => {
    console.error("Communications live sync pipeline fatal exception:", err);
  });

  // Handle data packet ingestion dispatch event loops
  dispatchForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const draftText = inputText.value.trim();
    if (!draftText) return;

    inputText.value = "";
    try {
      await addDoc(collection(db, "nexus_chats"), {
        senderUid: identityContext.uid,
        senderName: identityContext.name,
        message: draftText,
        timestamp: new Date() // Fallback sorting standard
      });
    } catch (err) {
      console.error("Message pack drop abort:", err);
    }
  });
});

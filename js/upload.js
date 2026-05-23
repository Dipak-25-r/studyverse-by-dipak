/**
 * Binary Storage & Document Ingestion Router
 * Architectural responsibility: Multiplex data handling inputs, 
 * pipeline local disk assets natively into Firebase Storage buckets, 
 * and log corresponding indexing payloads to cloud databases.
 */

import { routeGuard } from "./auth.js";
import { db } from "../firebase/config.js";
import { collection, addDoc } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

document.addEventListener("DOMContentLoaded", async () => {
  const activeUser = await routeGuard();
  if (!activeUser) return;

  // Tabs Toggle Control Elements Mapping Matrix
  const triggerNote = document.getElementById("trigger-note");
  const triggerPost = document.getElementById("trigger-post");
  const formNote = document.getElementById("form-upload-note");
  const formPost = document.getElementById("form-upload-post");
  const statusDisplay = document.getElementById("status-display");

  if (!formNote || !formPost) return;

  // Global Context Alert Subroutine Handler
  const renderStatus = (message, statusType = "info") => {
    if (!statusDisplay) return;
    statusDisplay.innerText = message;
    statusDisplay.className = "mb-6 p-4 rounded-xl text-xs font-mono border block ";
    
    if (statusType === "success") {
      statusDisplay.classList.add("bg-green-500/10", "border-green-500/30", "text-green-400");
    } else if (statusType === "error") {
      statusDisplay.classList.add("bg-red-500/10", "border-red-500/30", "text-red-400");
    } else {
      statusDisplay.classList.add("bg-indigo-500/10", "border-indigo-500/30", "text-indigo-400");
    }
  };

  // Form View Switching Logic Control Arrays
  if (triggerNote && triggerPost) {
    triggerNote.addEventListener("click", () => {
      triggerNote.className = "text-sm font-semibold tracking-wide text-indigo-400 border-b-2 border-indigo-500 pb-2 focus:outline-none";
      triggerPost.className = "text-sm font-semibold tracking-wide text-gray-500 pb-2 focus:outline-none";
      formNote.classList.remove("hidden");
      formPost.classList.add("hidden");
    });

    triggerPost.addEventListener("click", () => {
      triggerPost.className = "text-sm font-semibold tracking-wide text-purple-400 border-b-2 border-purple-500 pb-2 focus:outline-none";
      triggerNote.className = "text-sm font-semibold tracking-wide text-gray-500 pb-2 focus:outline-none";
      formPost.classList.remove("hidden");
      formNote.classList.add("hidden");
    });
  }

  // Binary uploading removed: System operates completely via external URL linking.

  // Core Processing Routine: Library Note Payload Execution
  formNote.addEventListener("submit", async (e) => {
    e.preventDefault();
    renderStatus("Initializing byte array staging pipelines across remote storage cells...");

    const targetStd = document.getElementById("note-std").value;
    const targetSub = document.getElementById("note-sub").value;
    const targetCh = document.getElementById("note-ch").value;
    const targetTitle = document.getElementById("note-title").value.trim();
    const targetDesc = document.getElementById("note-desc").value.trim();

    // Read text strings representing URLs instead of reading from raw file element payloads
    const pdfUrl = document.getElementById("link-pdf").value.trim();
    const videoUrl = document.getElementById("link-video").value.trim();
    const imageUrl = document.getElementById("link-img").value.trim();

    try {
      // Mutate structured document reference catalog index tables using shared links
      await addDoc(collection(db, "notes"), {
        standard: targetStd,
        subject: targetSub,
        chapter: targetCh,
        title: targetTitle,
        description: targetDesc,
        pdfUrl: pdfUrl || null,
        videoUrl: videoUrl || null,
        imageUrl: imageUrl || null,
        uploaderUid: activeUser.uid,
        uploaderName: activeUser.name,
        timestamp: new Date().toISOString()
      });

      renderStatus("Transaction complete: Materials compiled and indexing matrix updated successfully.", "success");
      formNote.reset();
    } catch (err) {
      console.error(err);
      renderStatus(`Transaction aborted: Data pipeline broken -> ${err.message}`, "error");
    }
  });

  // Core Processing Routine: Interactive Post Payload Execution
  formPost.addEventListener("submit", async (e) => {
    e.preventDefault();
    renderStatus("Assembling social network data packet payload elements...");

    const textPayload = document.getElementById("post-text").value.trim();
    const sharedMediaUrl = document.getElementById("post-media-link").value.trim();

    try {
      // Sync shared media text strings without staging underlying assets natively
      await addDoc(collection(db, "posts"), {
        text: textPayload,
        mediaUrl: sharedMediaUrl || null,
        mediaType: sharedMediaUrl ? "external_link" : null,
        uploaderUid: activeUser.uid,
        uploaderName: activeUser.name,
        likes: [],
        timestamp: new Date().toISOString()
      });

      renderStatus("Broadcast pipeline flushed: Post payload successfully integrated into micro-feed.", "success");
      formPost.reset();
    } catch (err) {
      console.error(err);
      renderStatus(`Broadcast dropped: Critical state transaction failure -> ${err.message}`, "error");
    }
  });
});

/**
 * Binary Storage & Document Ingestion Router
 * Architectural responsibility: Multiplex data handling inputs, 
 * pipeline local disk assets natively into Firebase Storage buckets, 
 * and log corresponding indexing payloads to cloud databases.
 */

import { routeGuard } from "./auth.js";
import { db, storage } from "../firebase/config.js";
import { collection, addDoc } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";
import { ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-storage.js";

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

  // Sub-Routine: Modular Binary Core Ingestion Handler
  async function stageBinaryToBucket(destinationDirectory, fileObject) {
    if (!fileObject) return null;
    const distinctFilename = `${Date.now()}_${fileObject.name.replace(/\s+/g, "_")}`;
    const targetStorageRef = ref(storage, `${destinationDirectory}/${distinctFilename}`);
    
    // Commit raw byte arrays straight to designated storage node
    const transmissionSnapshot = await uploadBytes(targetStorageRef, fileObject);
    return await getDownloadURL(transmissionSnapshot.ref);
  }

  // Core Processing Routine: Library Note Payload Execution
  formNote.addEventListener("submit", async (e) => {
    e.preventDefault();
    renderStatus("Initializing byte array staging pipelines across remote storage cells...");

    const targetStd = document.getElementById("note-std").value;
    const targetSub = document.getElementById("note-sub").value;
    const targetCh = document.getElementById("note-ch").value;
    const targetTitle = document.getElementById("note-title").value.trim();
    const targetDesc = document.getElementById("note-desc").value.trim();

    const pdfHandle = document.getElementById("file-pdf").files[0];
    const videoHandle = document.getElementById("file-video").files[0];
    const imageHandle = document.getElementById("file-img").files[0];

    try {
      // Execute pipeline tasks in concurrent sequence
      const pdfUrl = await stageBinaryToBucket("pdfs", pdfHandle);
      const videoUrl = await stageBinaryToBucket("videos", videoHandle);
      const imageUrl = await stageBinaryToBucket("images", imageHandle);

      // Mutate structured document reference catalog index tables
      await addDoc(collection(db, "notes"), {
        standard: targetStd,
        subject: targetSub,
        chapter: targetCh,
        title: targetTitle,
        description: targetDesc,
        pdfUrl,
        videoUrl,
        imageUrl,
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
    const mediaHandle = document.getElementById("post-media").files[0];

    try {
      let mediaUrl = null;
      let mediaType = null;

      if (mediaHandle) {
        mediaType = mediaHandle.type;
        mediaUrl = await stageBinaryToBucket("posts", mediaHandle);
      }

      // Sync data structure indices with timeline parameters
      await addDoc(collection(db, "posts"), {
        text: textPayload,
        mediaUrl,
        mediaType,
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

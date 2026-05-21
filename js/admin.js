/**
 * StudyVerse Secure System Administrator Cockpit Control Logic Hub
 * Architectural responsibility: Master token signature authorization, 
 * real-time advertising state tracking mutations, and structural quiz matrix compilation.
 */

import { db } from "../firebase/config.js";
import { doc, setDoc, addDoc, updateDoc } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

class CentralOperationsManagerHub {
  constructor() {
    this.cryptographicKeySignatureToken = "DR_ADMIN_2026";
    this.stagedQuestionsBlueprintBufferList = [];
    
    this.hookAuthorizationSecurityGateEvents();
    this.bindOperationsMutationSubroutines();
  }

  hookAuthorizationSecurityGateEvents() {
    const shieldFormGate = document.getElementById("admin-barrier-gate-form");
    const keyInputText = document.getElementById("admin-secret-gate-input");
    const errorLogBox = document.getElementById("gatekeeper-error-log");
    const mainWorkspace = document.getElementById("admin-primary-workspace");
    const barrierOverlay = document.getElementById("admin-gatekeeper-barrier");

    if (!shieldFormGate) return;

    shieldFormGate.addEventListener("submit", (e) => {
      e.preventDefault();
      if (keyInputText.value === this.cryptographicKeySignatureToken) {
        errorLogBox.classList.add("hidden");
        barrierOverlay.remove(); // Drop modal asset context safely out of memory lifecycle stack
        mainWorkspace.classList.remove("hidden");
      } else {
        errorLogBox.innerText = "Signature mismatch. Intrusion trace telemetry logged.";
        errorLogBox.classList.remove("hidden");
        keyInputText.value = "";
      }
    });
  }

  bindOperationsMutationSubroutines() {
    const formAds = document.getElementById("admin-advertising-mutation-form");
    const formQuiz = document.getElementById("admin-quiz-generation-form");
    const btnPushQuestion = document.getElementById("append-compiled-question-node-btn");

    if (formAds) {
      formAds.addEventListener("submit", async (e) => {
        e.preventDefault();
        this.renderStatusFeedback("ad-panel-status-feedback", "Initiating datastore trace modification tasks...", "info");
        
        const nodeTarget = document.getElementById("ad-form-target-node").value;
        const stateActive = document.getElementById("ad-form-active-state").value === "true";
        const codePayload = document.getElementById("ad-form-injected-payload").value;

        try {
          const documentRefTarget = doc(db, "ads", nodeTarget);
          await setDoc(documentRefTarget, {
            active: stateActive,
            code: codePayload,
            lastMutatedTimestamp: new Date().toISOString()
          }, { merge: true });
          this.renderStatusFeedback("ad-panel-status-feedback", "Global state matrix update committed downstream.", "success");
          formAds.reset();
        } catch (err) {
          this.renderStatusFeedback("ad-panel-status-feedback", `Database mutation aborted: ${err.message}`, "error");
        }
      });
    }

    if (btnPushQuestion) {
      btnPushQuestion.addEventListener("click", () => this.stageQuestionElementToMemoryBuffer());
    }

    if (formQuiz) {
      formQuiz.addEventListener("submit", async (e) => {
        e.preventDefault();
        this.renderStatusFeedback("quiz-panel-status-feedback", "Compiling blueprint structural layouts across collection trees...", "info");

        if (!this.stagedQuestionsBlueprintBufferList.length) {
          this.renderStatusFeedback("quiz-panel-status-feedback", "Compilation halted: Assessment content array stack is empty.", "error");
          return;
        }

        const evaluationTitle = document.getElementById("quiz-meta-title").value.trim();
        const allocationTime = document.getElementById("quiz-meta-timer").value;
        const trackingStrategy = document.getElementById("quiz-meta-approval-strategy").value;

        try {
          const targetedQuizCollection = collection(db, "quizzes");
          await addDoc(targetedQuizCollection, {
            title: evaluationTitle,
            timer: parseInt(allocationTime),
            approvalStrategy: trackingStrategy,
            questions: this.stagedQuestionsBlueprintBufferList,
            initializedTimestamp: new Date().toISOString()
          });

          this.renderStatusFeedback("quiz-panel-status-feedback", "Payload assessment compiled and deployed successfully.", "success");
          this.stagedQuestionsBlueprintBufferList = [];
          this.refreshStagedQuestionsVisualQueueMonitor();
          formQuiz.reset();
        } catch (err) {
          this.renderStatusFeedback("quiz-panel-status-feedback", `Ecosystem transaction error: ${err.message}`, "error");
        }
      });
    }
  }

  stageQuestionElementToMemoryBuffer() {
    const promptText = document.getElementById("q-builder-text").value.trim();
    const mediaType = document.getElementById("q-builder-media-type").value;
    const mediaUrl = document.getElementById("q-builder-media-url").value.trim();
    
    const opt0 = document.getElementById("q-builder-opt-0").value.trim();
    const opt1 = document.getElementById("q-builder-opt-1").value.trim();
    const opt2 = document.getElementById("q-builder-opt-2").value.trim();
    const opt3 = document.getElementById("q-builder-opt-3").value.trim();
    
    const correctIndexCode = document.getElementById("q-builder-correct-key").value;

    if (!promptText || !opt0 || !opt1) {
      alert("Core query parameter statements and structural minimum options must be filled.");
      return;
    }

    const compiledQuestionNode = {
      text: promptText,
      mediaType,
      mediaUrl: mediaUrl || null,
      options: [opt0, opt1, opt2 || null, opt3 || null],
      correctIndex: parseInt(correctIndexCode)
    };

    this.stagedQuestionsBlueprintBufferList.push(compiledQuestionNode);
    this.refreshStagedQuestionsVisualQueueMonitor();
    
    // Wipe individual question field elements safely
    document.getElementById("q-builder-text").value = "";
    document.getElementById("q-builder-media-url").value = "";
    document.getElementById("q-builder-opt-0").value = "";
    document.getElementById("q-builder-opt-1").value = "";
    document.getElementById("q-builder-opt-2").value = "";
    document.getElementById("q-builder-opt-3").value = "";
  }

  refreshStagedQuestionsVisualQueueMonitor() {
    const queueContainer = document.getElementById("staged-questions-visual-feedback-queue");
    const countIndicatorBadge = document.getElementById("staged-questions-count");
    
    if (!queueContainer) return;
    
    countIndicatorBadge.innerText = `${this.stagedQuestionsBlueprintBufferList.length} Staged`;
    
    if (!this.stagedQuestionsBlueprintBufferList.length) {
      queueContainer.innerHTML = `<div class="p-2 text-center">Staged blueprint structure array allocation parameters are empty.</div>`;
      return;
    }

    queueContainer.innerHTML = this.stagedQuestionsBlueprintBufferList.map((q, idx) => `
      <div class="p-2.5 flex justify-between items-center bg-slate-900/30">
        <span class="truncate max-w-xs text-[11px]"><strong class="text-purple-400">#${idx+1}:</strong> ${q.text}</span>
        <span class="text-[9px] uppercase tracking-wide font-mono bg-slate-800 text-gray-400 px-2 py-0.5 rounded">Correct opt key: [${q.correctIndex}]</span>
      </div>
    `).join("");
  }

  renderStatusFeedback(targetedContainerId, feedbackMessage, statusStrategyCode) {
    const feedbackBox = document.getElementById(targetedContainerId);
    if (!feedbackBox) return;

    feedbackBox.innerText = feedbackMessage;
    feedbackBox.className = "text-[10px] font-mono p-2.5 rounded-lg border block mb-4 ";
    
    if (statusStrategyCode === "success") {
      feedbackBox.classList.add("bg-green-500/10", "border-green-500/20", "text-green-400");
    } else if (statusStrategyCode === "error") {
      feedbackBox.classList.add("bg-red-500/10", "border-red-500/20", "text-red-400");
    } else {
      feedbackBox.classList.add("bg-purple-500/10", "border-purple-500/20", "text-purple-400");
    }
  }
}

export const ActiveAdminSystemWorkspace = new CentralOperationsManagerHub();

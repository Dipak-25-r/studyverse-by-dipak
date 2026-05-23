/**
 * StudyVerse Advanced Assessment Logic Engine
 * Architectural responsibility: Orchestrate evaluations, countdown timers, voice recording,
 * caching layers, and Firebase persistence updates.
 */

import { routeGuard } from "./auth.js";
import { db } from "../firebase/config.js";
import { collection, getDocs, doc, addDoc, getDoc } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

class AssessmentRuntimeSubsystem {
  constructor() {
    this.userProfileToken = null;
    this.loadedQuizzesCollection = [];
    this.activeQuizPayload = null;
    this.activeQuestionIndexPointer = 0;
    this.runtimeAnswersArray = [];
    this.countdownTimerObject = null;
    this.remainingSecondsCounter = 0;
    this.voiceRecognitionEngine = null;
    
    this.mapDOMElementPointers();
    this.bindActionInterceptors();
  }

  mapDOMElementPointers() {
    this.panelSelection = document.getElementById("quiz-selection-panel");
    this.panelExecution = document.getElementById("quiz-execution-panel");
    this.panelResult = document.getElementById("quiz-result-panel");
    this.ledgersContainer = document.getElementById("quiz-ledgers-container");
    this.lblActiveTitle = document.getElementById("active-quiz-title");
    this.lblProgressIndex = document.getElementById("question-progress-index");
    this.lblCountdownClock = document.getElementById("quiz-countdown-clock");
    this.viewportMultimedia = document.getElementById("multimedia-viewport-frame");
    this.lblQuestionPrompt = document.getElementById("active-question-prompt");
    this.matrixOptionsContainer = document.getElementById("active-options-matrix");
    this.voiceModuleContainer = document.getElementById("voice-module-container");
    this.lblVoiceStatus = document.getElementById("voice-speech-status");
    
    this.btnProceed = document.getElementById("quiz-proceed-btn");
    this.btnBack = document.getElementById("quiz-back-btn");
    this.btnTriggerVoice = document.getElementById("trigger-voice-recording-btn");
    this.btnCloseResult = document.getElementById("result-close-btn");
  }

  bindActionInterceptors() {
    document.addEventListener("DOMContentLoaded", async () => {
      const headerNode = document.getElementById("global-navbar");
      if (headerNode) {
        headerNode.innerHTML = `
          <a href="index.html" class="navbar-brand">STUDYVERSE</a>
          <div class="navbar-links-group">
            <a href="index.html" class="navbar-item">Home</a>
            <a href="chat.html" class="navbar-item">Chat Spaces</a>
            <a href="upload.html" class="navbar-item">Upload Vault</a>
            <a href="profile.html" class="navbar-item">My Profile</a>
          </div>
        `;
      }
      this.userProfileToken = await routeGuard();
      this.fetchQuizManifestLedgers();
      this.initializeVoiceEcosystemHardware();
    });

    if (this.btnProceed) this.btnProceed.addEventListener("click", () => this.handleNavigationForwardStep());
    if (this.btnBack) this.btnBack.addEventListener("click", () => this.abortQuizSessionContext());
    if (this.btnTriggerVoice) this.btnTriggerVoice.addEventListener("click", () => this.toggleVoiceStreamCapture());
    if (this.btnCloseResult) this.btnCloseResult.addEventListener("click", () => this.resetRuntimeInterfaceState());
  }

  async fetchQuizManifestLedgers() {
    try {
      const snapshots = await getDocs(collection(db, "quizzes"));
      this.ledgersContainer.innerHTML = "";
      this.loadedQuizzesCollection = [];

      if (snapshots.empty) {
        this.ledgersContainer.innerHTML = `<div class="text-xs text-gray-500 font-mono p-2">No quiz evaluation profiles logged in database registries.</div>`;
        return;
      }

      snapshots.forEach((documentNode) => {
        const data = documentNode.data();
        const id = documentNode.id;
        this.loadedQuizzesCollection.push({ id, ...data });

        const ledgerSelectionCard = document.createElement("button");
        ledgerSelectionCard.className = "w-full text-left p-4 rounded-xl border border-gray-800 bg-slate-900/40 hover:border-indigo-500/40 transition-all space-y-2 group block focus:outline-none";
        ledgerSelectionCard.innerHTML = `
          <div class="flex justify-between items-center">
            <span class="text-xs font-bold text-gray-200 group-hover:text-indigo-400 transition-colors">${data.title}</span>
            <span class="text-[10px] font-mono bg-indigo-500/10 text-indigo-400 px-2 py-0.5 rounded">${data.questions?.length || 0} Nodes</span>
          </div>
          <p class="text-[11px] text-gray-500 truncate">Routing Validation Matrix Strategy: ${data.approvalStrategy}</p>
        `;
        ledgerSelectionCard.addEventListener("click", () => this.stageAssessmentContext(id));
        this.ledgersContainer.appendChild(ledgerSelectionCard);
      });
    } catch (err) {
      console.error("Ecosystem catalog pull failed:", err);
    }
  }

  stageAssessmentContext(targetDocumentId) {
    this.activeQuizPayload = this.loadedQuizzesCollection.find(q => q.id === targetDocumentId);
    if (!this.activeQuizPayload || !this.activeQuizPayload.questions?.length) return;

    this.activeQuestionIndexPointer = 0;
    this.runtimeAnswersArray = [];
    
    this.panelSelection.classList.add("hidden");
    this.panelExecution.classList.remove("hidden");
    
    this.lblActiveTitle.innerText = this.activeQuizPayload.title;
    this.renderActiveQuestionStructureNode();
  }

  renderActiveQuestionStructureNode() {
    this.clearCountdownIntervalObject();
    
    const activeQuestionsArray = this.activeQuizPayload.questions;
    const currentNode = activeQuestionsArray[this.activeQuestionIndexPointer];
    
    this.lblProgressIndex.innerText = `Question ${this.activeQuestionIndexPointer + 1} of ${activeQuestionsArray.length}`;
    this.lblQuestionPrompt.innerText = currentNode.text;
    
    // Manage Dynamic Multimedia Viewport Frames Injection Loops
    if (currentNode.mediaType && currentNode.mediaType !== "none" && currentNode.mediaUrl) {
      this.viewportMultimedia.classList.remove("hidden");
      if (currentNode.mediaType === "video") {
        this.viewportMultimedia.innerHTML = `<video src="${currentNode.mediaUrl}" controls class="w-full max-h-56 rounded-lg bg-black"></video>`;
      } else if (currentNode.mediaType === "audio") {
        this.viewportMultimedia.innerHTML = `<audio src="${currentNode.mediaUrl}" controls class="w-full p-2"></audio>`;
      }
    } else {
      this.viewportMultimedia.classList.add("hidden");
      this.viewportMultimedia.innerHTML = "";
    }

    // Generate Dynamic Options Selection Buttons
    this.matrixOptionsContainer.innerHTML = "";
    currentNode.options.forEach((optionValue, idx) => {
      if (!optionValue) return;
      const optionRowBtn = document.createElement("button");
      optionRowBtn.className = "w-full text-left p-3.5 rounded-xl border border-gray-800 bg-slate-900/20 hover:bg-slate-900 font-medium text-xs text-gray-300 hover:text-white transition-colors flex items-center space-x-3 focus:outline-none";
      optionRowBtn.innerHTML = `<span class="w-5 h-5 rounded-lg bg-slate-800 border border-gray-700 flex items-center justify-center text-[10px] font-mono text-gray-400 group-hover:border-indigo-500">${String.fromCharCode(65 + idx)}</span> <span class="flex-grow">${optionValue}</span>`;
      
      optionRowBtn.addEventListener("click", () => {
        this.deselectActiveOptionElements();
        optionRowBtn.className = "w-full text-left p-3.5 rounded-xl border border-indigo-500 bg-indigo-500/10 font-semibold text-xs text-white transition-colors flex items-center space-x-3 focus:outline-none";
        optionRowBtn.setAttribute("data-selected-index-key", idx);
      });
      this.matrixOptionsContainer.appendChild(optionRowBtn);
    });

    // Handle Custom Voice Answer UI Module Layout Visibility Status
    if (this.voiceRecognitionEngine) {
      this.voiceModuleContainer.classList.remove("hidden");
      this.lblVoiceStatus.innerText = "System matching engine standing by...";
    }

    // Configure Timer Parameters Boundaries Allocation
    const allocationTimeBoundary = parseInt(this.activeQuizPayload.timer) || 30;
    this.remainingSecondsCounter = allocationTimeBoundary;
    this.executeClockCountdownCycle();
  }

  deselectActiveOptionElements() {
    Array.from(this.matrixOptionsContainer.children).forEach(node => {
      node.className = "w-full text-left p-3.5 rounded-xl border border-gray-800 bg-slate-900/20 hover:bg-slate-900 font-medium text-xs text-gray-300 hover:text-white transition-colors flex items-center space-x-3 focus:outline-none";
    });
  }

  executeClockCountdownCycle() {
    const formatPadding = (val) => String(val).padStart(2, "0");
    this.lblCountdownClock.innerText = `00:${formatPadding(this.remainingSecondsCounter)}`;
    
    this.countdownTimerObject = setInterval(() => {
      this.remainingSecondsCounter--;
      if (this.remainingSecondsCounter <= 0) {
        this.clearCountdownIntervalObject();
        this.lblCountdownClock.innerText = "00:00";
        this.handleNavigationForwardStep(true); // Enforce systemic auto-submission routine loops
      } else {
        this.lblCountdownClock.innerText = `00:${formatPadding(this.remainingSecondsCounter)}`;
      }
    }, 1000);
  }

  clearCountdownIntervalObject() {
    if (this.countdownTimerObject) {
      clearInterval(this.countdownTimerObject);
      this.countdownTimerObject = null;
    }
  }

  handleNavigationForwardStep(enforceAutoSubmission = false) {
    this.clearCountdownIntervalObject();
    const selectedOptionElement = this.matrixOptionsContainer.querySelector("[data-selected-index-key]");
    const activeSelectedValue = selectedOptionElement ? parseInt(selectedOptionElement.getAttribute("data-selected-index-key")) : -1;
    
    this.runtimeAnswersArray.push(activeSelectedValue);
    
    const activeQuestionsArray = this.activeQuizPayload.questions;
    if (this.activeQuestionIndexPointer + 1 < activeQuestionsArray.length) {
      this.activeQuestionIndexPointer++;
      this.renderActiveQuestionStructureNode();
    } else {
      this.commitEvaluationTelemetryLogsToCloud();
    }
  }

  async commitEvaluationTelemetryLogsToCloud() {
    this.panelExecution.classList.add("hidden");
    this.panelResult.classList.remove("hidden");
    
    let computedCorrectCounter = 0;
    const questionsArray = this.activeQuizPayload.questions;
    
    questionsArray.forEach((q, index) => {
      if (parseInt(q.correctIndex) === this.runtimeAnswersArray[index]) {
        computedCorrectCounter++;
      }
    });

    const runtimeLogPayload = {
      quizId: this.activeQuizPayload.id,
      quizTitle: this.activeQuizPayload.title,
      studentUid: this.userProfileToken?.uid || "anonymous_node",
      studentName: this.userProfileToken?.name || "Anonymous Member",
      capturedResponses: this.runtimeAnswersArray,
      scoreMetrics: {
        correct: computedCorrectCounter,
        total: questionsArray.length
      },
      strategyMode: this.activeQuizPayload.approvalStrategy,
      timestamp: new Date().toISOString()
    };

    try {
      await addDoc(collection(db, "results"), runtimeLogPayload);
      
      const textLogBox = document.getElementById("result-status-message");
      const badgeTelemetryScore = document.getElementById("score-telemetry-badge");
      const textRatioOutput = document.getElementById("score-ratio-output");

      if (this.activeQuizPayload.approvalStrategy === "instant") {
        badgeTelemetryScore.classList.remove("hidden");
        textRatioOutput.innerText = `${computedCorrectCounter} / ${questionsArray.length}`;
        textLogBox.innerText = "System scoring protocols executed instantly against cloud architecture standards.";
      } else {
        badgeTelemetryScore.classList.add("hidden");
        textLogBox.innerText = "Payload indexed successfully. Result parameters are withheld awaiting administrator verification loops.";
      }
    } catch (err) {
      console.error("Telemetry write transaction error:", err);
    }
  }

  initializeVoiceEcosystemHardware() {
    const WebSpeechAPIValue = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!WebSpeechAPIValue) return;

    this.voiceRecognitionEngine = new WebSpeechAPIValue();
    this.voiceRecognitionEngine.continuous = false;
    this.voiceRecognitionEngine.interimResults = false;
    
    this.voiceRecognitionEngine.onresult = (event) => {
      const detectedSpeechString = event.results[0][0].transcript.toLowerCase();
      this.lblVoiceStatus.innerText = `Parsed Voice Token: "${detectedSpeechString}"`;
      this.executeSpeechMappingParser(detectedSpeechString);
    };

    this.voiceRecognitionEngine.onerror = () => {
      this.lblVoiceStatus.innerText = "Failed parsing signal parameters.";
    };

    this.voiceRecognitionEngine.onend = () => {
      this.btnTriggerVoice.classList.remove("bg-red-500", "text-white");
    };
  }

  toggleVoiceStreamCapture() {
    if (!this.voiceRecognitionEngine) return;
    try {
      this.btnTriggerVoice.classList.add("bg-red-500", "text-white");
      this.lblVoiceStatus.innerText = "Listening to dynamic sound vectors...";
      this.voiceRecognitionEngine.start();
    } catch (e) {
      this.voiceRecognitionEngine.stop();
    }
  }

  executeSpeechMappingParser(voiceInputText) {
    const targetsArray = Array.from(this.matrixOptionsContainer.children);
    if (voiceInputText.includes("option a") || voiceInputText.includes("first")) targetsArray[0]?.click();
    else if (voiceInputText.includes("option b") || voiceInputText.includes("second")) targetsArray[1]?.click();
    else if (voiceInputText.includes("option c") || voiceInputText.includes("third")) targetsArray[2]?.click();
    else if (voiceInputText.includes("option d") || voiceInputText.includes("fourth")) targetsArray[3]?.click();
  }

  abortQuizSessionContext() {
    this.clearCountdownIntervalObject();
    this.resetRuntimeInterfaceState();
  }

  resetRuntimeInterfaceState() {
    this.panelResult.classList.add("hidden");
    this.panelExecution.classList.add("hidden");
    this.panelSelection.classList.remove("hidden");
    this.fetchQuizManifestLedgers();
  }
}

export const ActiveQuizSystem = new AssessmentRuntimeSubsystem();

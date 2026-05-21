/**
 * StudyVerse Advanced Autonomous Dynamic Advertising Injector Pipeline
 * Architectural responsibility: Real-time query streaming logic against cloud 
 * configuration paths, state persistence fallback matrices, and secure document injection.
 */

import { db } from "../firebase/config.js";
import { doc, onSnapshot } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

class AdvertisingDistributionMatrixEngine {
  constructor() {
    this.localCacheStateKey = "studyverse_cached_telemetry_ads";
    this.initializePipelineListeners();
  }

  initializePipelineListeners() {
    // Synchronously track banner config mappings via passive background process listeners
    const bannerReference = doc(db, "ads", "bannerAd");
    onSnapshot(bannerReference, (snapshot) => {
      if (snapshot.exists()) {
        const payload = snapshot.data();
        this.cacheParameters("bannerAd", payload);
        this.executeInjection("bannerAd", payload);
      }
    }, () => this.evaluateFallbackExecutionCache("bannerAd"));

    // Track Interstitial Popup Configurations matching identical lifecycle protocols
    const popupReference = doc(db, "ads", "popupAd");
    onSnapshot(popupReference, (snapshot) => {
      if (snapshot.exists()) {
        const payload = snapshot.data();
        this.cacheParameters("popupAd", payload);
        this.executeInjection("popupAd", payload);
      }
    }, () => this.evaluateFallbackExecutionCache("popupAd"));
  }

  cacheParameters(keyNode, dynamicData) {
    try {
      const activeWorkspaceCache = JSON.parse(localStorage.getItem(this.localCacheStateKey)) || {};
      activeWorkspaceCache[keyNode] = dynamicData;
      localStorage.setItem(this.localCacheStateKey, JSON.stringify(activeWorkspaceCache));
    } catch (err) {
      console.warn("Local storage ecosystem caching pipeline parameters blocked:", err);
    }
  }

  evaluateFallbackExecutionCache(keyNode) {
    try {
      const activeWorkspaceCache = JSON.parse(localStorage.getItem(this.localCacheStateKey));
      if (activeWorkspaceCache && activeWorkspaceCache[keyNode]) {
        this.executeInjection(keyNode, activeWorkspaceCache[keyNode]);
      }
    } catch (err) {
      console.error("Critical fallback storage framework retrieval failure:", err);
    }
  }

  executeInjection(keyNode, payload) {
    if (!payload || payload.active !== true || !payload.code) {
      this.clearTargetViewportNode(keyNode);
      return;
    }

    if (keyNode === "bannerAd") {
      const topContainer = document.getElementById("top-banner-ad-container");
      const bottomContainer = document.getElementById("bottom-banner-ad-container");
      if (topContainer) topContainer.innerHTML = payload.code;
      if (bottomContainer) bottomContainer.innerHTML = payload.code;
    }

    if (keyNode === "popupAd") {
      // Execute contextual state delayed interstitial popup mapping layout values
      const sessionTriggerTrace = sessionStorage.getItem("studyverse_interstitial_triggered");
      if (!sessionTriggerTrace) {
        setTimeout(() => {
          this.buildInterstitialModalDOMOverlay(payload.code);
          sessionStorage.setItem("studyverse_interstitial_triggered", "true");
        }, 6000); // Trigger countdown sequence boundary point
      }
    }
  }

  clearTargetViewportNode(keyNode) {
    if (keyNode === "bannerAd") {
      const topContainer = document.getElementById("top-banner-ad-container");
      const bottomContainer = document.getElementById("bottom-banner-ad-container");
      if (topContainer) topContainer.innerHTML = "";
      if (bottomContainer) bottomContainer.innerHTML = "";
    }
  }

  buildInterstitialModalDOMOverlay(injectedRawHTMLCode) {
    const overlayNodeShield = document.createElement("div");
    overlayNodeShield.id = "studyverse-interstitial-popup-overlay";
    overlayNodeShield.className = "fixed inset-0 bg-black/80 backdrop-blur-md z-[9999] flex items-center justify-center p-4 animate-fade-in";
    
    const contextWrapperCard = document.createElement("div");
    contextWrapperCard.className = "glass-card p-6 rounded-2xl border border-gray-800 max-w-md w-full relative shadow-2xl bg-slate-950";
    
    const dismissTriggerButton = document.createElement("button");
    dismissTriggerButton.className = "absolute top-3 right-3 text-gray-500 hover:text-white transition-colors focus:outline-none text-xs font-mono bg-slate-900 p-2 rounded-xl border border-gray-800";
    dismissTriggerButton.innerHTML = "<i class='fas fa-times mr-1'></i> Close Asset";
    
    dismissTriggerButton.addEventListener("click", () => {
      overlayNodeShield.classList.add("hidden");
      overlayNodeShield.remove();
    });

    const injectionPayloadViewport = document.createElement("div");
    injectionPayloadViewport.className = "pt-6 text-center overflow-hidden";
    injectionPayloadViewport.innerHTML = injectedRawHTMLCode;

    contextWrapperCard.appendChild(dismissTriggerButton);
    contextWrapperCard.appendChild(injectionPayloadViewport);
    overlayNodeShield.appendChild(contextWrapperCard);
    document.body.appendChild(overlayNodeShield);
  }
}

// Instantiate and expose the system-wide background operations node engine framework
export const StudyVerseAdsEngine = new AdvertisingDistributionMatrixEngine();

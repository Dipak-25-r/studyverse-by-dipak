/**
 * Analytical Geometry Studio - Interactive Bidirectional Graph Engine
 * Architectural responsibility: Orchestrate equation parsing, dynamic parameter value mappings,
 * coordinate calculation matrices, and push live function state vectors directly into GeoGebra.
 */

document.addEventListener("DOMContentLoaded", () => {
  const checkGGB = setInterval(() => {
    if (window.ggbApplet) {
      clearInterval(checkGGB);
      initializeGraphController(window.ggbApplet);
    }
  }, 200);
});

function initializeGraphController(ggb) {
  // --- UI Element Mapping ---
  const presetButtons = document.querySelectorAll(".btn-preset-trigger");
  const scaleSlider = document.getElementById("input-param-scale");
  const aSlider = document.getElementById("input-param-a");
  const bSlider = document.getElementById("input-param-b");
  
  const displayScale = document.getElementById("val-display-scale");
  const displayA = document.getElementById("val-display-a");
  const displayB = document.getElementById("val-display-b");
  
  const equationString = document.getElementById("dynamic-equation-string");
  const narrativeBox = document.getElementById("graph-learning-narrative-box");
  const languageSelect = document.getElementById("graph-language-select");

  // --- Core State Variables ---
  let activeType = "line"; 
  let currentHexColor = "#6366f1"; 

  // --- Step-by-Step Manual Drafting Localization Engine ---
  const instructionMatrix = {
    en: {
      line: (a, b) => `How to Draw This Graph Manually:
1. Find the Y-intercept: Set x = 0. Here, y = ${b}. Plot point (0, ${b}).
2. Calculate a second point: Set x = 2. Here, y = (${a} * 2) + ${b} = ${(a * 2 + b).toFixed(1)}. Plot point (2, ${(a * 2 + b).toFixed(1)}).
3. Draw a straight line connecting these two coordinates across your plane.`,
      wave: (a, b) => `How to Draw This Graph Manually:
1. Identify key wave boundaries: Amplitude = |${a}|, Frequency factor = ${b}.
2. Plot origin points: Since sin(0) = 0, the wave passes through (0, 0).
3. Plot peak point: The wave reaches its maximum value of ${a} when x = ${(Math.PI / (2 * (b || 1))).toFixed(2)}. Plot point (${(Math.PI / (2 * (b || 1))).toFixed(2)}, ${a}).
4. Sketch a smooth, repeating periodic wave passing through these coordinates.`,
      parabola: (a, b) => `How to Draw This Graph Manually:
1. Locate the Vertex: For y = ax² + b, the vertex point is exactly at (0, ${b}).
2. Calculate symmetric side inputs: Set x = 1 and x = -1. 
   y = ${a}(1)² + ${b} = ${(a + b).toFixed(1)}. Plot coordinates (1, ${(a + b).toFixed(1)}) and (-1, ${(a + b).toFixed(1)}).
3. Draw a smooth, U-shaped parabolic curve linking these coordinates together.`,
      sphere: (a, b) => `How to Map This 3D Spatial Geometry:
1. Find the Radius: The equation represents a sphere where r² = |2 * a| = ${Math.abs(a * 2).toFixed(1)}.
2. Calculate actual radius length: r = ${Math.sqrt(Math.abs(a * 2)).toFixed(2)}.
3. Pin the center node precisely at the origin point (0, 0, 0).
4. Sweep a 3D boundary frame symmetrically extending ${Math.sqrt(Math.abs(a * 2)).toFixed(2)} units across the X, Y, and Z spatial dimensions.`
    },
    hi: {
      line: (a, b) => `इस ग्राफ़ को मैन्युअल रूप से कैसे बनाएं:
1. Y-अन्त:खण्ड खोजें: x = 0 रखें। यहाँ, y = ${b}। बिन्दु (0, ${b}) को चिह्नित करें।
2. दूसरा बिन्दु निकालें: x = 2 रखें। यहाँ, y = (${a} * 2) + ${b} = ${(a * 2 + b).toFixed(1)}। बिन्दु (2, ${(a * 2 + b).toFixed(1)}) को चिह्नित करें।
3. इन दोनों बिन्दुओं को मिलाते हुए एक सीधी रेखा खींचें।`,
      wave: (a, b) => `इस ग्राफ़ को मैन्युअल रूप से कैसे बनाएं:
1. मुख्य तरंग सीमाएं पहचानें: आयाम = |${a}|, आवृत्ति गुणांक = ${b}।
2. मूल बिन्दु चिह्नित करें: चूंकि sin(0) = 0, तरंग (0, 0) से होकर गुजरती है।
3. उच्चतम बिन्दु चिह्नित करें: तरंग अपना अधिकतम मान ${a} प्राप्त करती है जब x = ${(Math.PI / (2 * (b || 1))).toFixed(2)}। बिन्दु (${(Math.PI / (2 * (b || 1))).toFixed(2)}, ${a}) चिह्नित करें।
4. इन बिन्दुओं से गुजरती हुई एक सहज, आवर्ती तरंग का रेखाचित्र बनाएं।`
    },
    gu: {
      line: (a, b) => `આ ગ્રાફ જાતે કેવી રીતે દોરવો:
1. Y-અંતઃખંડ શોધો: x = 0 લો. અહીં, y = ${b}. બિંદુ (0, ${b}) આલેખો.
2. બીજું બિંદુ શોધો: x = 2 લો. અહીં, y = (${a} * 2) + ${b} = ${(a * 2 + b).toFixed(1)}. બિંદુ (2, ${(a * 2 + b).toFixed(1)}) આલેખો.
3. આ બંને બિંદુઓને જોડતી એક સીધી રેખા કાર્ટેઝિયન પ્લેન પર દોરો.`
    }
  };

  /**
   * Translates active user variables into real-time visual equations
   * Executes the Equation-to-Graph conversion through GeoGebra commands.
   */
  function synchronizeGraphMetrics() {
    const a = parseFloat(aSlider?.value || 1.0);
    const b = parseFloat(bSlider?.value || 0.0);
    const lang = languageSelect?.value || "en";

    // Clean previous plot variables out of workspace memory arrays
    ggb.evalCommand("Delete[f]");
    ggb.evalCommand("Delete[eq1]");

    // --- Equation to Graph Transformation Architecture ---
    if (activeType === "line") {
      ggb.evalCommand(`f(x) = ${a} * x + ${b}`);
      if (equationString) equationString.innerText = `y = ${a}x + (${b})`;
    } else if (activeType === "wave") {
      ggb.evalCommand(`f(x) = ${a} * sin(${b || 1} * x)`);
      if (equationString) equationString.innerText = `y = ${a} * sin(${b}x)`;
    } else if (activeType === "parabola") {
      ggb.evalCommand(`f(x) = ${a} * x^2 + ${b}`);
      if (equationString) equationString.innerText = `y = ${a}x² + (${b})`;
    } else if (activeType === "3d-sphere") {
      const radiusSquare = Math.abs(a * 2 || 1);
      ggb.evalCommand(`eq1: x^2 + y^2 + z^2 = ${radiusSquare}`);
      if (equationString) equationString.innerText = `x² + y² + z² = ${radiusSquare.toFixed(1)}`;
    }

    // Apply styles to target objects
    const targetPlotId = activeType === "3d-sphere" ? "eq1" : "f";
    ggb.setColor(targetPlotId, ...hexToRgb(currentHexColor));
    ggb.setThickness(targetPlotId, 5);

    // --- Render Number Explanations and Instructional Guides ---
    const localizer = instructionMatrix[lang] || instructionMatrix["en"];
    if (narrativeBox) {
      narrativeBox.innerText = localizer[activeType]
        ? localizer[activeType](a, b)
        : instructionMatrix["en"][activeType](a, b);
    }
  }

  // --- Real-Time Interface Input Sliders Mapping Matrix ---
  const updateSlidersDisplayValues = () => {
    if (displayA && aSlider) displayA.innerText = parseFloat(aSlider.value).toFixed(1);
    if (displayB && bSlider) displayB.innerText = parseFloat(bSlider.value).toFixed(1);
    synchronizeGraphMetrics();
  };

  aSlider?.addEventListener("input", updateSlidersDisplayValues);
  bSlider?.addEventListener("input", updateSlidersDisplayValues);

  if (scaleSlider) {
    scaleSlider.addEventListener("input", (e) => {
      const z = parseFloat(e.target.value);
      if (displayScale) displayScale.innerText = `${z.toFixed(1)}x`;
      ggb.setCoordSystem(-10 * z, 10 * z, -5 * z, 5 * z);
    });
  }

  // --- Preset Selection Switches Matrix ---
  presetButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      presetButtons.forEach(b => b.className = "btn-preset-trigger p-3 rounded-xl bg-slate-900 border border-gray-800 text-gray-400 font-semibold hover:bg-slate-900 text-left transition-all");
      btn.className = "btn-preset-trigger p-3 rounded-xl bg-indigo-600/10 border border-indigo-500/20 text-indigo-400 font-semibold hover:bg-indigo-600/20 text-left transition-all";

      activeType = btn.getAttribute("data-type");
      synchronizeGraphMetrics();
    });
  });

  // --- Theme Vector Shading Pipeline Filters ---
  const colorButtons = document.querySelectorAll(".btn-color-trigger");
  colorButtons.forEach(cBtn => {
    cBtn.addEventListener("click", () => {
      colorButtons.forEach(b => b.className = "btn-color-trigger w-7 h-7 rounded-full ring-0 ring-offset-2 ring-offset-slate-950 transition-transform");
      cBtn.classList.add("ring-2", "scale-110");
      currentHexColor = cBtn.getAttribute("data-color");
      synchronizeGraphMetrics();
    });
  });

  languageSelect?.addEventListener("change", synchronizeGraphMetrics);

  // --- Export PNG Canvas Captures ---
  const exportBtn = document.getElementById("export-graph-png-btn");
  if (exportBtn) {
    exportBtn.addEventListener("click", () => {
      const base64Data = ggb.getPNGBase64(1.0, false, 300);
      const downloadAnchor = document.createElement("a");
      downloadAnchor.href = `data:image/png;base64,${base64Data}`;
      downloadAnchor.download = `StudyVerse_Math_Plot_${Date.now()}.png`;
      downloadAnchor.click();
    });
  }

  // Helper Utility: Hex Parser
  function hexToRgb(hex) {
    const raw = hex.replace(/^#/, '');
    const bigint = parseInt(raw, 16);
    return [(bigint >> 16) & 255, (bigint >> 8) & 255, bigint & 255];
  }

  // Build initial graph parameters instantly on component load sequence
  setTimeout(() => synchronizeGraphMetrics(), 800);
}
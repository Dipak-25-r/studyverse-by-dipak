/**
 * StudyVerse Analytical Geometry Studio Logic Core
 * Architectural responsibility: Real-time 2D Cartesian rendering, 3D WebGL meshes,
 * multivariable coefficient scaling, internationalized string parameters, and vector generation exports.
 */

class GeometryStudioWorkspaceController {
  constructor() {
    this.systemLanguageCode = "en";
    this.activePresetModeType = "line";
    this.baseZoomFactorScale = 1.0;
    this.coefficientA = 1.0;
    this.coefficientB = 0.0;
    this.activeStrokeHexColor = "#6366f1";
    
    // Injected Localization Dictionary Matrices
    this.translationMatrixBundles = {
      en: {
        presets: "Functional Equation Presets",
        modifiers: "Scalar Matrix Parameters",
        color: "Vector Shading Palette",
        line_desc: "Linear function representation standard tracking y = ax + b configuration rules. Demonstrates constant scalar increments across coordinate frameworks.",
        wave_desc: "Sinusoidal periodic waveform tracking equation y = a * sin(bx). Simulates propagation cycles, audio analytics vectors, and periodic oscillations.",
        parabola_desc: "Quadratic curves computing polynomial layout vectors structural path y = a * x² + b. Defines structural ballistic pathways.",
        sphere_desc: "Three-dimensional isometric spatial visualization grid evaluating matrix function x² + y² + z² = r². Interactive orbit controls enabled."
      },
      hi: {
        presets: "समीकरण प्रीसेट ढांचा",
        modifiers: "अदिश आव्यूह पैरामीटर",
        color: "वेक्टर शेडिंग पैलेट",
        line_desc: "रैखिक फलन प्रतिनिधित्व y = ax + b के नियमों का पालन करता है। यह ग्रिड पर निरंतर वृद्धि को दर्शाता है।",
        wave_desc: "ज्यावक्रीय तरंग प्रवाह समीकरण y = a * sin(bx) का अनुसरण करता है। यह ध्वनि तरंगों और चक्रों को अनुकरण करता है।",
        parabola_desc: "द्विघात परवलय वक्र समीकरण y = a * x² + b की गणना करता है। यह प्रक्षेप्य पथ को परिभाषित करता है।",
        sphere_desc: "त्रि-आयामी ज्यामिति दृश्य ग्रिड x² + y² + z² = r² का मूल्यांकन करता है। इंटरएक्टिव ऑर्बिट रेंडरिंग सक्रिय है।"
      },
      gu: {
        presets: "સમીકરણ પ્રીસેટ માળખું",
        modifiers: "અદિશ મેટ્રિક્સ પરિમાણો",
        color: "વેક્ટર શેડિંગ પેલેટ",
        line_desc: "રેખીય સમીકરણ રજૂઆત y = ax + b ના નિયમોનું પાલન કરે છે. આ ગ્રીડ પર સતત સ્કેલર વધારો દર્શાવે છે.",
        wave_desc: "સાઇનુસોઇડલ સામયિક તરંગ સમીકરણ y = a * sin(bx) ને ટ્રેક કરે છે. આ ધ્વનિ તરંગો અને કંપનોનું અનુકરણ કરે છે.",
        parabola_desc: "દ્વિઘાત પરવલય વક્ર y = a * x² + b વેક્ટર પાથની ગણતરી કરે છે. આ પ્રક્ષેપણ માર્ગ વ્યાખ્યાયિત કરે છે.",
        sphere_desc: "ત્રિ-પરિમાણીય ભૂમિતિ દ્રશ્ય ગ્રીડ x² + y² + z² = r² નું મૂલ્યાંકન કરે છે. ઇન્ટરેક્ટિવ ઓર્બિટ રેન્ડરિંગ સક્રિય છે."
      }
    };

    this.mapDOMPointers();
    this.hookEventEcosystemListeners();
    this.initializeEnginePipelines();
  }

  mapDOMPointers() {
    this.canvas2D = document.getElementById("canvas-2d-viewport");
    this.ctx2D = this.canvas2D ? this.canvas2D.getContext("2d") : null;
    this.frame3D = document.getElementById("canvas-3d-viewport");
    
    this.selectLang = document.getElementById("graph-language-select");
    this.sliderScale = document.getElementById("input-param-scale");
    this.sliderA = document.getElementById("input-param-a");
    this.sliderB = document.getElementById("input-param-b");
    
    this.dispScale = document.getElementById("val-display-scale");
    this.dispA = document.getElementById("val-display-a");
    this.dispB = document.getElementById("val-display-b");
    
    this.lblEquationStr = document.getElementById("dynamic-equation-string");
    this.lblNarrativeBox = document.getElementById("graph-learning-narrative-box");
    this.telemetryCoords = document.getElementById("telemetry-coord-string");
    this.btnExportPng = document.getElementById("export-graph-png-btn");
  }

  hookEventEcosystemListeners() {
    if (this.selectLang) {
      this.selectLang.addEventListener("change", (e) => {
        this.systemLanguageCode = e.target.value;
        this.updateLocalizationLabelsContext();
      });
    }

    // Dynamic Parameter Slide Refreshes
    const triggerRecalculation = () => {
      this.baseZoomFactorScale = parseFloat(this.sliderScale.value);
      this.coefficientA = parseFloat(this.sliderA.value);
      this.coefficientB = parseFloat(this.sliderB.value);
      
      if (this.dispScale) this.dispScale.innerText = `${this.baseZoomFactorScale.toFixed(1)}x`;
      if (this.dispA) this.dispA.innerText = this.coefficientA.toFixed(1);
      if (this.dispB) this.dispB.innerText = this.coefficientB.toFixed(1);
      
      this.executeEcosystemRenderPipeline();
    };

    if (this.sliderScale) this.sliderScale.addEventListener("input", triggerRecalculation);
    if (this.sliderA) this.sliderA.addEventListener("input", triggerRecalculation);
    if (this.sliderB) this.sliderB.addEventListener("input", triggerRecalculation);

    // Bind Presets Buttons Controllers Matrix
    document.querySelectorAll(".btn-preset-trigger").forEach(btn => {
      btn.addEventListener("click", (e) => {
        document.querySelectorAll(".btn-preset-trigger").forEach(b => b.className = "p-3 rounded-xl bg-slate-900 border border-gray-800 text-gray-400 font-semibold hover:bg-slate-900 text-left transition-all");
        btn.className = "p-3 rounded-xl bg-indigo-600/10 border border-indigo-500/20 text-indigo-400 font-semibold hover:bg-indigo-600/20 text-left transition-all";
        this.activePresetModeType = btn.getAttribute("data-type");
        this.executeEcosystemRenderPipeline();
      });
    });

    // Color Swatch Selection Routing Triggers
    document.querySelectorAll(".btn-color-trigger").forEach(swatch => {
      swatch.addEventListener("click", () => {
        document.querySelectorAll(".btn-color-trigger").forEach(s => s.className = "btn-color-trigger w-7 h-7 rounded-full ring-0 ring-offset-2 ring-offset-slate-950 transition-transform");
        const targetedHex = swatch.getAttribute("data-color");
        swatch.className = `btn-color-trigger w-7 h-7 rounded-full ring-2 ring-offset-2 ring-offset-slate-950 scale-110 transition-transform`;
        // Match color classes dynamically
        if(targetedHex === "#6366f1") swatch.classList.add("bg-indigo-500","ring-indigo-500");
        if(targetedHex === "#ec4899") swatch.classList.add("bg-pink-500","ring-pink-500");
        if(targetedHex === "#10b981") swatch.classList.add("bg-emerald-500","ring-emerald-500");
        if(targetedHex === "#f59e0b") swatch.classList.add("bg-amber-500","ring-amber-500");
        
        this.activeStrokeHexColor = targetedHex;
        this.executeEcosystemRenderPipeline();
      });
    });

    // Tracking Interceptor Node Maps
    if (this.canvas2D) {
      this.canvas2D.addEventListener("mousemove", (e) => this.calculateCursorCartesianTelemetry(e));
    }

    if (this.btnExportPng) {
      this.btnExportPng.addEventListener("click", () => this.triggerSnapshotDownloadPipeline());
    }

    window.addEventListener("resize", () => this.handleViewportResizeConstraints());
  }

  initializeEnginePipelines() {
    this.handleViewportResizeConstraints();
    this.updateLocalizationLabelsContext();
    this.initialize3DWebGLContextStructure();
    this.executeEcosystemRenderPipeline();
  }

  handleViewportResizeConstraints() {
    if (this.canvas2D) {
      this.canvas2D.width = this.canvas2D.parentElement.clientWidth;
      this.canvas2D.height = this.canvas2D.parentElement.clientHeight;
      this.executeEcosystemRenderPipeline();
    }
  }

  updateLocalizationLabelsContext() {
    const bundle = this.translationMatrixBundles[this.systemLanguageCode];
    
    // Set text contents safe structures checking for existing header nodes elements
    const hPresets = document.getElementById("txt-lbl-presets");
    const hModifiers = document.getElementById("txt-lbl-modifiers");
    const hColor = document.getElementById("txt-lbl-vector-color");
    
    if (hPresets) hPresets.innerText = bundle.presets;
    if (hModifiers) hModifiers.innerText = bundle.modifiers;
    if (hColor) hColor.innerText = bundle.color;

    this.updateExplanationNarrativeString();
  }

  updateExplanationNarrativeString() {
    const bundle = this.translationMatrixBundles[this.systemLanguageCode];
    if (this.activePresetModeType === "line") {
      this.lblEquationStr.innerText = `y = (${this.coefficientA.toFixed(1)})x + (${this.coefficientB.toFixed(1)})`;
      this.lblNarrativeBox.innerText = bundle.line_desc;
    } else if (this.activePresetModeType === "wave") {
      this.lblEquationStr.innerText = `y = (${this.coefficientA.toFixed(1)}) * sin((${this.coefficientB.toFixed(1)})x)`;
      this.lblNarrativeBox.innerText = bundle.wave_desc;
    } else if (this.activePresetModeType === "parabola") {
      this.lblEquationStr.innerText = `y = (${this.coefficientA.toFixed(1)})x² + (${this.coefficientB.toFixed(1)})`;
      this.lblNarrativeBox.innerText = bundle.parabola_desc;
    } else if (this.activePresetModeType === "3d-sphere") {
      this.lblEquationStr.innerText = `x² + y² + z² = (${Math.abs(this.coefficientA * 4).toFixed(1)})²`;
      this.lblNarrativeBox.innerText = bundle.sphere_desc;
    }
  }

  calculateCursorCartesianTelemetry(mouseEvent) {
    const rect = this.canvas2D.getBoundingClientRect();
    const cursorCanvasX = mouseEvent.clientX - rect.left;
    const cursorCanvasY = mouseEvent.clientY - rect.top;
    
    const midPointX = this.canvas2D.width / 2;
    const midPointY = this.canvas2D.height / 2;
    const trackingResolutionStep = 40 * this.baseZoomFactorScale;
    
    const cartesianCoordinateX = (cursorCanvasX - midPointX) / trackingResolutionStep;
    const cartesianCoordinateY = (midPointY - cursorCanvasY) / trackingResolutionStep;
    
    if (this.telemetryCoords) {
      this.telemetryCoords.innerText = `(X: ${cartesianCoordinateX.toFixed(2)}, Y: ${cartesianCoordinateY.toFixed(2)})`;
    }
  }

  executeEcosystemRenderPipeline() {
    this.updateExplanationNarrativeString();
    
    if (this.activePresetModeType === "3d-sphere") {
      this.canvas2D.classList.add("hidden");
      this.frame3D.classList.remove("hidden");
      this.execute3DObjectGeometryPass();
    } else {
      this.frame3D.classList.add("hidden");
      this.canvas2D.classList.remove("hidden");
      this.execute2DGraphicsDrawingPass();
    }
  }

  execute2DGraphicsDrawingPass() {
    if (!this.ctx2D) return;
    
    const width = this.canvas2D.width;
    const height = this.canvas2D.height;
    const midX = width / 2;
    const midY = height / 2;
    const gridSpacingUnit = 40 * this.baseZoomFactorScale;

    // Flush and reset drawing surface pipeline buffer
    this.ctx2D.fillStyle = "#030712";
    this.ctx2D.fillRect(0, 0, width, height);

    // Draw grid lines
    this.ctx2D.strokeStyle = "rgba(31, 41, 55, 0.4)";
    this.ctx2D.lineWidth = 1;

    for (let x = midX; x < width; x += gridSpacingUnit) {
      this.ctx2D.beginPath(); this.ctx2D.moveTo(x, 0); this.ctx2D.lineTo(x, height); this.ctx2D.stroke();
    }
    for (let x = midX; x > 0; x -= gridSpacingUnit) {
      this.ctx2D.beginPath(); this.ctx2D.moveTo(x, 0); this.ctx2D.lineTo(x, height); this.ctx2D.stroke();
    }
    for (let y = midY; y < height; y += gridSpacingUnit) {
      this.ctx2D.beginPath(); this.ctx2D.moveTo(0, y); this.ctx2D.lineTo(width, y); this.ctx2D.stroke();
    }
    for (let y = midY; y > 0; y -= gridSpacingUnit) {
      this.ctx2D.beginPath(); this.ctx2D.moveTo(0, y); this.ctx2D.lineTo(width, y); this.ctx2D.stroke();
    }

    // Draw central axis indicators
    this.ctx2D.strokeStyle = "rgba(156, 163, 175, 0.6)";
    this.ctx2D.lineWidth = 2;
    this.ctx2D.beginPath(); this.ctx2D.moveTo(0, midY); this.ctx2D.lineTo(width, midY); this.ctx2D.stroke();
    this.ctx2D.beginPath(); this.ctx2D.moveTo(midX, 0); this.ctx2D.lineTo(midX, height); this.ctx2D.stroke();

    // Plot continuous vector mathematical geometry curves
    this.ctx2D.strokeStyle = this.activeStrokeHexColor;
    this.ctx2D.lineWidth = 3;
    this.ctx2D.beginPath();

    let initialPlotPointLogged = false;

    for (let pixelX = 0; pixelX < width; pixelX++) {
      const standardInputX = (pixelX - midX) / gridSpacingUnit;
      let calculatedOutputY = 0;

      if (this.activePresetModeType === "line") {
        calculatedOutputY = this.coefficientA * standardInputX + this.coefficientB;
      } else if (this.activePresetModeType === "wave") {
        calculatedOutputY = this.coefficientA * Math.sin(this.coefficientB * standardInputX);
      } else if (this.activePresetModeType === "parabola") {
        calculatedOutputY = this.coefficientA * Math.pow(standardInputX, 2) + this.coefficientB;
      }

      const pixelY = midY - (calculatedOutputY * gridSpacingUnit);

      // Verify calculation boundary constraints
      if (pixelY >= 0 && pixelY <= height) {
        if (!initialPlotPointLogged) {
          this.ctx2D.moveTo(pixelX, pixelY);
          initialPlotPointLogged = true;
        } else {
          this.ctx2D.lineTo(pixelX, pixelY);
        }
      }
    }
    this.ctx2D.stroke();
  }

  initialize3DWebGLContextStructure() {
    if (!this.frame3D) return;
    this.scene3D = new THREE.Scene();
    this.camera3D = new THREE.PerspectiveCamera(45, this.frame3D.clientWidth / this.frame3D.clientHeight, 0.1, 1000);
    this.renderer3D = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    
    this.renderer3D.setSize(this.frame3D.clientWidth, this.frame3D.clientHeight);
    this.frame3D.appendChild(this.renderer3D.domElement);

    // Apply basic illumination tracking loops configuration vectors
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    const pointLight = new THREE.PointLight(0xffffff, 0.8);
    pointLight.position.set(10, 20, 15);
    
    this.scene3D.add(ambientLight);
    this.scene3D.add(pointLight);

    this.camera3D.position.z = 15;
  }

  execute3DObjectGeometryPass() {
    if (!this.scene3D) return;
    
    // Clear legacy objects in target scene space arrays
    if (this.active3DMeshObjectNode) {
      this.scene3D.remove(this.active3DMeshObjectNode);
    }

    const calculatedRadius = Math.abs(this.coefficientA * 2) || 0.5;
    const baseResolutionGeometry = new THREE.SphereGeometry(calculatedRadius, 32, 32);
    const conceptualWireframeMaterial = new THREE.MeshBasicMaterial({
      color: this.activeStrokeHexColor,
      wireframe: true
    });

    this.active3DMeshObjectNode = new THREE.Mesh(baseResolutionGeometry, conceptualWireframeMaterial);
    this.scene3D.add(this.active3DMeshObjectNode);

    // Trigger internal core presentation render frames loop execution handles
    const tickAnimate = () => {
      if (this.activePresetModeType !== "3d-sphere") return;
      requestAnimationFrame(tickAnimate);
      
      this.active3DMeshObjectNode.rotation.x += 0.005;
      this.active3DMeshObjectNode.rotation.y += 0.01;
      
      this.renderer3D.render(this.scene3D, this.camera3D);
    };
    tickAnimate();
  }

  triggerSnapshotDownloadPipeline() {
    if (this.activePresetModeType === "3d-sphere") return;
    const snapshotDataURLData = this.canvas2D.toDataURL("image/png");
    const structuralTriggerAnchorLink = document.createElement("a");
    structuralTriggerAnchorLink.download = "studyverse_geometry_vector_output.png";
    structuralTriggerAnchorLink.href = snapshotDataURLData;
    structuralTriggerAnchorLink.click();
  }
}

export const StructuralGeometryStudio = new GeometryStudioWorkspaceController();

/**
 * StudyVerse Modern Scroll Animation System
 * Architectural responsibility: Performance-optimized structural interaction observers 
 * intercepting visual rendering thresholds across cross-platform environments.
 */

document.addEventListener("DOMContentLoaded", () => {
  const scrollIntersectionObserverOptions = {
    root: null, // Utilize native browser main viewport bounding containers
    rootMargin: "0px",
    threshold: 0.15 // Animate elements when 15% visibility factor returns true
  };

  const structuralObserverInstance = new IntersectionObserver((monitoredDOMElementEntriesArray, operationalObserverReference) => {
    monitoredDOMElementEntriesArray.forEach((elementEntryNode) => {
      if (elementEntryNode.isIntersecting) {
        const structuralTargetElement = elementEntryNode.target;
        
        // Execute structural class transformations smoothly to trigger high-performance GPU layers
        structuralTargetElement.classList.add("scroll-animate-visible");
        
        // Unobserve individual target nodes immediately to prevent memory leaks during view manipulation
        operationalObserverReference.unobserve(structuralTargetElement);
      }
    });
  }, scrollIntersectionObserverOptions);

  // Parse layout tree capturing tracking tags match parameters criteria
  const queryStagedAnimationTargetElements = document.querySelectorAll(".scroll-animate");
  queryStagedAnimationTargetElements.forEach(elementNode => {
    structuralObserverInstance.observe(elementNode);
  });
});

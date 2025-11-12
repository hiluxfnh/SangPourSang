// hero.js - orchestrates the one-time intro logo animation and reveals the page
// - Plays once on page load
// - Respects prefers-reduced-motion and user accessibility
// - Adds classes to <body>: intro-play while animating, intro-finished after complete

(function () {
  const body = document.body;
  const intro = document.getElementById("intro");
  if (intro) intro.dataset.managed = "hero";
  const introImg = document.getElementById("intro-img");
  const introCopy = document.querySelector(".intro-copy");

  // Safety: if any of the elements missing, simply hide intro and exit
  function finishIntro(skipAnimation) {
    // Mark finished so CSS hides overlay
    body.classList.remove("intro-play");
    body.classList.add("intro-finished");
    // remove overlay from DOM after transition to avoid tab stops
    setTimeout(() => {
      try {
        if (intro) intro.style.display = "none";
      } catch (e) {}
    }, 700);
  }

  // If user prefers reduced motion, skip animation
  const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
  if (mq && mq.matches) {
    finishIntro(true);
    return;
  }

  // Start when DOM ready
  document.addEventListener("DOMContentLoaded", () => {
    // If intro element missing, nothing to do
    if (!intro) {
      return;
    }

    // Wait for the image to be ready (handles cache and slow networks)
    const startPlay = () => {
      // small frame gap to ensure initial styles applied
      requestAnimationFrame(() =>
        setTimeout(() => body.classList.add("intro-play"), 40)
      );

      // Show the intro for a pleasant duration: logo animates in (~700ms) + copy visible (~1400ms)
      const logoIn = 700; // ms
      const visible = 1400; // ms to keep visible after intro
      const total = logoIn + visible;

      // Failsafe: finish after total
      setTimeout(() => finishIntro(false), total);

      // Also listen for the copy transition end to finish slightly earlier if desired
      let ended = false;
      function onEnd(e) {
        if (ended) return;
        ended = true;
        finishIntro(false);
      }
      if (introCopy)
        introCopy.addEventListener("transitionend", onEnd, { once: true });
    };

    if (introImg) {
      // If the image is already complete (cached), start immediately
      if (introImg.complete) {
        startPlay();
      } else introImg.addEventListener("load", startPlay, { once: true });
      // If image fails to load, skip the animation quickly
      introImg.addEventListener("error", () => startPlay(), { once: true });
    } else {
      // No image found, just play and hide
      startPlay();
    }
  });
})();

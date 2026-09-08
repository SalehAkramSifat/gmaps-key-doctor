/**
 * Developer Easter Egg Modal Component (15 Taps Controller)
 */
import { elements } from './dom.elements.js';

let logoTapCount = 0;
let tapTimeout = null;

export function openDevModal() {
  if (elements.devModalOverlay) {
    elements.devModalOverlay.classList.add("active");
  }
}

export function closeDevModal() {
  if (elements.devModalOverlay) {
    elements.devModalOverlay.classList.remove("active");
  }
}

export function setupDeveloperEasterEgg() {
  const headerElements = [
    elements.radarIcon,
    document.querySelector(".headline-badge"),
    document.querySelector("header h1")
  ].filter(Boolean);

  headerElements.forEach(el => {
    el.style.cursor = "pointer";
    el.addEventListener("click", (e) => {
      e.stopPropagation();
      logoTapCount += 1;

      // Visual pulse effect on icon
      if (elements.radarIcon) {
        elements.radarIcon.style.transform = "scale(0.85)";
        setTimeout(() => elements.radarIcon.style.transform = "scale(1)", 140);
      }

      clearTimeout(tapTimeout);
      tapTimeout = setTimeout(() => {
        logoTapCount = 0;
      }, 4000);

      if (logoTapCount === 15) {
        logoTapCount = 0;
        openDevModal();
      }
    });
  });

  if (elements.devModalClose) {
    elements.devModalClose.addEventListener("click", closeDevModal);
  }

  if (elements.devModalOverlay) {
    elements.devModalOverlay.addEventListener("click", (e) => {
      if (e.target === elements.devModalOverlay) {
        closeDevModal();
      }
    });
  }

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      closeDevModal();
    }
  });
}

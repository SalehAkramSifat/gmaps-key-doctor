
import { API_DETAILS } from '../data/api-details.data.js';
import { buildConsoleUrl } from '../utils/url.builder.js';

let popupEl = null;
let overlayEl = null;

export function setupDetailPopup() {
  overlayEl = document.getElementById("detailPopupOverlay");
  popupEl = document.getElementById("detailPopup");

  if (!overlayEl || !popupEl) return;

  // Close on overlay backdrop click
  overlayEl.addEventListener("click", (e) => {
    if (e.target === overlayEl) closeDetailPopup();
  });

  // Close on ESC key
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeDetailPopup();
  });

  // Close button
  document.getElementById("detailPopupClose")?.addEventListener("click", closeDetailPopup);
}

export function openDetailPopup(apiId, currentStatus) {
  const detail = API_DETAILS[apiId];
  if (!detail || !popupEl || !overlayEl) return;

  const consoleUrl = buildConsoleUrl(detail.consoleSlug);

  // Determine popup content based on current status
  let statusBadge = "";
  let bodyContent = "";

  if (currentStatus === "ok") {
    statusBadge = `<span class="popup-status-badge ok">✅ PASS</span>`;
    bodyContent = buildPassContent(detail);
  } else if (currentStatus === "fail") {
    statusBadge = `<span class="popup-status-badge fail">❌ FAIL</span>`;
    bodyContent = buildFailContent(detail, consoleUrl);
  } else if (currentStatus === "warn") {
    statusBadge = `<span class="popup-status-badge warn">⚠️ INFO</span>`;
    bodyContent = buildWarnContent(detail, apiId);
  } else {
    statusBadge = `<span class="popup-status-badge skip">⏭️ SKIPPED</span>`;
    bodyContent = buildSkipContent(detail);
  }

  popupEl.innerHTML = `
    <button class="popup-close-btn" id="detailPopupClose" title="Close">&times;</button>

    <div class="popup-header">
      <span class="popup-api-icon">${detail.icon}</span>
      <div class="popup-title-group">
        <h3 class="popup-api-name">${detail.name}</h3>
        ${statusBadge}
      </div>
    </div>

    <p class="popup-description">${detail.description}</p>

    <hr class="popup-divider" />

    ${bodyContent}

    <a class="popup-console-link" href="${consoleUrl}" target="_blank" rel="noopener">
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
        <polyline points="15 3 21 3 21 9"/>
        <line x1="10" y1="14" x2="21" y2="3"/>
      </svg>
      Open in Google Cloud Console
    </a>
  `;

  // Re-wire close button (innerHTML reset)
  document.getElementById("detailPopupClose")?.addEventListener("click", closeDetailPopup);

  overlayEl.classList.add("active");
  popupEl.classList.add("active");
}

export function closeDetailPopup() {
  overlayEl?.classList.remove("active");
  popupEl?.classList.remove("active");
}

// ── Content Builders ─────────────────────────────────────────────────────────

function buildPassContent(detail) {
  const useCases = detail.useCases.map(u => `<li>${u}</li>`).join("");
  return `
    <div class="popup-section">
      <div class="popup-section-title pass">✅ What this enables in your app</div>
      <p class="popup-pass-note">${detail.passNote}</p>
      <ul class="popup-list">${useCases}</ul>
    </div>
  `;
}

function buildFailContent(detail, consoleUrl) {
  const reasons = detail.failReasons.map(r => `<li>${r}</li>`).join("");
  const steps = detail.fixSteps.map((s, i) => `
    <li class="popup-fix-step">
      <span class="popup-step-num">${i + 1}</span>
      <span>${s}</span>
    </li>
  `).join("");

  return `
    <div class="popup-section">
      <div class="popup-section-title fail">🩺 Diagnosis — Why did this fail?</div>
      <ul class="popup-list">${reasons}</ul>
    </div>
    <div class="popup-section">
      <div class="popup-section-title fix">🔧 How to Fix — Step by Step</div>
      <ol class="popup-fix-list">${steps}</ol>
    </div>
  `;
}

function buildWarnContent(detail, apiId) {
  const steps = detail.fixSteps.map((s, i) => `
    <li class="popup-fix-step">
      <span class="popup-step-num">${i + 1}</span>
      <span>${s}</span>
    </li>
  `).join("");

  const useCases = detail.useCases.map(u => `<li>${u}</li>`).join("");

  return `
    <div class="popup-section">
      <div class="popup-section-title warn">ℹ️ Why does this show INFO?</div>
      <p class="popup-warn-note">${detail.warnNote}</p>
    </div>
    <div class="popup-section">
      <div class="popup-section-title fix">🔧 Manual Verification Steps</div>
      <ol class="popup-fix-list">${steps}</ol>
    </div>
    <div class="popup-section">
      <div class="popup-section-title pass">💡 What this API enables</div>
      <ul class="popup-list">${useCases}</ul>
    </div>
  `;
}

function buildSkipContent(detail) {
  const useCases = detail.useCases.map(u => `<li>${u}</li>`).join("");
  return `
    <div class="popup-section">
      <div class="popup-section-title skip">⏭️ This API was not tested</div>
      <p class="popup-skip-note">You deselected this API before scanning. Re-enable it in the selection panel and rescan your key.</p>
    </div>
    <div class="popup-section">
      <div class="popup-section-title">💡 What this API does</div>
      <ul class="popup-list">${useCases}</ul>
    </div>
  `;
}

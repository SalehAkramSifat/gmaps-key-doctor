/**
 * GMaps Key Doctor — Application Entry Point
 * ES Module orchestrator: initializes all UI components and wires up event listeners.
 */
import { API_ROWS } from './config/apis.config.js';
import { elements } from './ui/dom.elements.js';
import { renderApiGrid, buildRack, getSelectedApiIds, updateSelectionButtons } from './ui/rack.component.js';
import { renderSummaryReport, copyMarkdownReport, resetSummaryCard } from './ui/summary.component.js';
import { setupDeveloperEasterEgg } from './ui/modal.component.js';
import { setupDetailPopup } from './ui/detail-popup.component.js';
import { updateScanCounterDisplay, incrementScanCounter } from './services/counter.service.js';
import { runDiagnostics, getTestResults } from './services/api-tester.service.js';

// ── Initialization ──────────────────────────────────────────────────────────

function initialize() {
  updateScanCounterDisplay();
  renderApiGrid();
  buildRack();
  setupDeveloperEasterEgg();
  setupDetailPopup();
}

// ── Select / Clear All Buttons ──────────────────────────────────────────────

elements.selectAllBtn?.addEventListener("click", () => {
  API_ROWS.forEach(r => r.selected = true);
  renderApiGrid();
});

elements.clearAllBtn?.addEventListener("click", () => {
  API_ROWS.forEach(r => r.selected = false);
  renderApiGrid();
});

// ── Copy Report Button ──────────────────────────────────────────────────────

elements.copyBtn?.addEventListener("click", () => {
  const key = elements.KEY_FIELD?.value.trim() || "";
  const selectedIds = getSelectedApiIds();
  copyMarkdownReport(key, selectedIds, getTestResults());
});

// ── Scan Button ─────────────────────────────────────────────────────────────

elements.runBtn?.addEventListener("click", () => {
  const key = elements.KEY_FIELD?.value.trim();
  if (!key) {
    alert("Please input a Google Maps API Key first.");
    return;
  }

  const selectedIds = getSelectedApiIds();
  if (selectedIds.length === 0) {
    alert("Please select at least one API to test.");
    return;
  }

  // Update UI into scanning state
  incrementScanCounter();
  resetSummaryCard();
  buildRack();

  elements.runBtn.disabled = true;
  elements.runBtn.textContent = "Scanning...";
  elements.scanState.textContent = "STATUS: SCANNING";
  elements.radarIcon?.classList.add("scanning");

  // Run all diagnostic tests
  runDiagnostics(key, selectedIds, (testResults) => {
    // Scan complete — update UI
    elements.scanState.textContent = "STATUS: COMPLETE";
    elements.radarIcon?.classList.remove("scanning");
    elements.runBtn.disabled = false;
    elements.runBtn.innerHTML = `
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
        <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/>
      </svg>
      Rescan Key
    `;
    renderSummaryReport(selectedIds, testResults);
  });
});

// ── Boot ────────────────────────────────────────────────────────────────────
initialize();

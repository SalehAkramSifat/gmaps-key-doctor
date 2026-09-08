/**
 * Diagnostic Rack UI Component - Renders API Selection Checkboxes and Rack Row Statuses
 */
import { API_ROWS } from '../config/apis.config.js';
import { elements } from './dom.elements.js';
import { openDetailPopup } from './detail-popup.component.js';

// Track current statuses for popup context
const currentStatuses = {};

export function getSelectedApiIds() {
  return API_ROWS.filter(r => r.selected).map(r => r.id);
}

export function updateSelectionButtons() {
  const selectedCount = API_ROWS.filter(r => r.selected).length;
  const totalCount = API_ROWS.length;

  if (elements.selectedCountEl) {
    elements.selectedCountEl.textContent = selectedCount;
  }

  if (selectedCount === totalCount) {
    elements.selectAllBtn.style.display = "none";
    elements.actionDivider.style.display = "none";
    elements.clearAllBtn.style.display = "inline";
  } else if (selectedCount === 0) {
    elements.selectAllBtn.style.display = "inline";
    elements.actionDivider.style.display = "none";
    elements.clearAllBtn.style.display = "none";
  } else {
    elements.selectAllBtn.style.display = "inline";
    elements.actionDivider.style.display = "inline";
    elements.clearAllBtn.style.display = "inline";
  }
}

export function renderApiGrid() {
  if (!elements.apiGrid) return;
  elements.apiGrid.innerHTML = API_ROWS.map(r => `
    <label class="api-checkbox-label" for="cb-${r.id}">
      <input type="checkbox" id="cb-${r.id}" ${r.selected ? "checked" : ""} data-id="${r.id}" />
      <span>${r.name}</span>
    </label>
  `).join("");

  elements.apiGrid.querySelectorAll("input[type=checkbox]").forEach(cb => {
    cb.addEventListener("change", (e) => {
      const id = e.target.getAttribute("data-id");
      const row = API_ROWS.find(r => r.id === id);
      if (row) row.selected = e.target.checked;
      updateSelectionButtons();
    });
  });

  updateSelectionButtons();
}

export function buildRack() {
  if (!elements.rack) return;
  elements.rack.innerHTML = API_ROWS.map(r => `
    <div class="row" id="row-${r.id}" style="${r.selected ? "" : "opacity:0.4; pointer-events:none;"}">
      <div class="led ${r.selected ? "pending" : "skip"}" id="led-${r.id}"></div>
      <div class="row-body">
        <div class="row-top">
          <div class="api-name">${r.name}</div>
          <div class="status-badge ${r.selected ? "pending" : "skip"}" id="word-${r.id}">
            ${r.selected ? "Waiting" : "Skipped"}
          </div>
        </div>
        <div class="row-msg" id="msg-${r.id}">
          ${r.selected ? "Awaiting scan execution..." : "Unselected by user filter."}
        </div>
      </div>
    </div>
  `).join("");

  // Attach click handler on every row to open detail popup
  API_ROWS.forEach(r => {
    const rowEl = document.getElementById("row-" + r.id);
    if (rowEl) {
      rowEl.addEventListener("click", () => {
        const status = currentStatuses[r.id] || (r.selected ? "pending" : "skip");
        openDetailPopup(r.id, status);
      });
    }
  });
}

export function setStatus(id, state, message, badgeText) {
  const led = document.getElementById("led-" + id);
  const word = document.getElementById("word-" + id);
  const msg = document.getElementById("msg-" + id);

  if (!led || !word || !msg) return;

  // Track current status for popup
  currentStatuses[id] = state;

  led.className = `led ${state}`;
  word.className = `status-badge ${state}`;
  word.textContent = badgeText || (
    state === "ok" ? "OK" :
    state === "fail" ? "FAIL" :
    state === "warn" ? "WARN" :
    state === "pending" ? "TESTING" : "SKIPPED"
  );
  msg.innerHTML = message;
}

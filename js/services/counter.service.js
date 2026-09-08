/**
 * Scan Counter Service - Manages local scan history & remote analytics counter
 */
import { elements } from '../ui/dom.elements.js';

let localScans = parseInt(localStorage.getItem("key_radar_scans_count") || "0", 10);
const baseCounter = 1240;

export function updateScanCounterDisplay() {
  if (elements.totalScanCountEl) {
    elements.totalScanCountEl.textContent = (baseCounter + localScans).toLocaleString();
  }
}

export function incrementScanCounter() {
  localScans += 1;
  localStorage.setItem("key_radar_scans_count", localScans.toString());
  updateScanCounterDisplay();

  try {
    fetch("https://api.counterapi.dev/v1/key-radar-app/scans/up").catch(() => {});
  } catch (e) {
    // Silent catch for network isolation
  }
}

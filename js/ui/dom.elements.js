/**
 * Centralized DOM Elements Registry Cache
 */
export const elements = {
  get KEY_FIELD() { return document.getElementById("apiKey"); },
  get runBtn() { return document.getElementById("runBtn"); },
  get rack() { return document.getElementById("rack"); },
  get radarIcon() { return document.getElementById("radarIcon"); },
  get scanState() { return document.getElementById("scanState"); },
  get summaryCard() { return document.getElementById("summaryCard"); },
  get summaryTitle() { return document.getElementById("summaryTitle"); },
  get summaryStats() { return document.getElementById("summaryStats"); },
  get summaryDesc() { return document.getElementById("summaryDesc"); },
  get copyBtn() { return document.getElementById("copyBtn"); },
  get apiGrid() { return document.getElementById("apiGrid"); },
  get selectedCountEl() { return document.getElementById("selectedCount"); },
  get selectAllBtn() { return document.getElementById("selectAllBtn"); },
  get clearAllBtn() { return document.getElementById("clearAllBtn"); },
  get actionDivider() { return document.getElementById("actionDivider"); },
  get totalScanCountEl() { return document.getElementById("totalScanCount"); },
  get devModalOverlay() { return document.getElementById("devModalOverlay"); },
  get devModalClose() { return document.getElementById("devModalClose"); }
};

/**
 * Summary Banner Component & Markdown Report Copying
 */
import { API_ROWS } from '../config/apis.config.js';
import { elements } from './dom.elements.js';

let latestTestResults = {};

export function setLatestTestResults(results) {
  latestTestResults = results;
}

export function resetSummaryCard() {
  if (elements.summaryCard) {
    elements.summaryCard.style.display = "none";
  }
}

export function renderSummaryReport(selectedIds, testResults) {
  latestTestResults = testResults;
  const passed = [];
  const failed = [];
  const warn = [];

  selectedIds.forEach(id => {
    const res = testResults[id];
    if (res === "ok") passed.push(id);
    else if (res === "fail") failed.push(id);
    else if (res === "warn") warn.push(id);
  });

  const totalTested = selectedIds.length;
  const passCount = passed.length;
  const failCount = failed.length;
  const warnCount = warn.length;

  if (elements.summaryTitle) {
    if (failCount === 0 && passCount > 0) {
      elements.summaryTitle.innerHTML = `🩺 <span style="color:var(--ok);">All Systems Operational</span>`;
    } else if (passCount > 0 && failCount > 0) {
      elements.summaryTitle.innerHTML = `🩺 <span style="color:var(--amber);">Partial API Access Detected</span>`;
    } else if (failCount > 0) {
      elements.summaryTitle.innerHTML = `🩺 <span style="color:var(--fail);">Critical API Errors Detected</span>`;
    } else {
      elements.summaryTitle.innerHTML = `🩺 <span style="color:var(--text);">Diagnostic Summary</span>`;
    }
  }

  if (elements.summaryStats) {
    elements.summaryStats.innerHTML = `
      <span class="stat-badge ok">✓ ${passCount} Passed</span>
      ${failCount > 0 ? `<span class="stat-badge fail">✗ ${failCount} Failed</span>` : ""}
      ${warnCount > 0 ? `<span class="stat-badge skip">ℹ ${warnCount} Info/REST</span>` : ""}
    `;
  }

  if (elements.summaryDesc) {
    let text = `Scanned <b>${totalTested} APIs</b> against your API Key. `;
    if (failCount > 0) {
      const failedNames = failed.map(id => API_ROWS.find(r => r.id === id).name).join(", ");
      text += `<br/><span style="color:var(--fail);"><b>Restricted / Unenabled Services (${failCount}):</b> ${failedNames}. Click the Cloud Console links below to enable them.</span>`;
    } else {
      text += `All selected services are fully enabled and ready for production deployment.`;
    }
    elements.summaryDesc.innerHTML = text;
  }

  if (elements.summaryCard) {
    elements.summaryCard.style.display = "block";
  }
}

export function copyMarkdownReport(apiKey, selectedIds, testResults) {
  const maskedKey = apiKey ? `${apiKey.substring(0, 6)}...${apiKey.substring(apiKey.length - 4)}` : "N/A";

  let report = `# 🩺 GMaps Key Doctor Diagnostic Report\n`;
  report += `- **Key**: \`${maskedKey}\`\n`;
  report += `- **Scan Time**: ${new Date().toLocaleString()}\n`;
  report += `- **Total Tested**: ${selectedIds.length} APIs\n\n`;
  report += `| API / Service | Status | Details |\n`;
  report += `| :--- | :---: | :--- |\n`;

  selectedIds.forEach(id => {
    const rowObj = API_ROWS.find(r => r.id === id);
    const status = testResults[id] || "UNKNOWN";
    const statusIcon = status === "ok" ? "✅ PASS" : status === "fail" ? "❌ FAIL" : "ℹ INFO";

    const msgEl = document.getElementById("msg-" + id);
    const msgText = msgEl ? msgEl.textContent.trim().replace(/\s+/g, " ") : "";

    report += `| **${rowObj.name}** | ${statusIcon} | ${msgText} |\n`;
  });

  report += `\n---\n*Report generated via GMaps Key Doctor — 100% Client-Side Privacy*`;

  navigator.clipboard.writeText(report).then(() => {
    if (elements.copyBtn) {
      elements.copyBtn.innerHTML = `✓ Copied Report!`;
      setTimeout(() => {
        elements.copyBtn.innerHTML = `
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
          </svg> Copy Report
        `;
      }, 2000);
    }
  }).catch(() => {
    alert("Copied to clipboard!");
  });
}

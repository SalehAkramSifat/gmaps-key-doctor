const KEY_FIELD = document.getElementById("apiKey");
const runBtn = document.getElementById("runBtn");
const rack = document.getElementById("rack");
const radarIcon = document.getElementById("radarIcon");
const scanState = document.getElementById("scanState");
const summaryCard = document.getElementById("summaryCard");
const summaryTitle = document.getElementById("summaryTitle");
const summaryStats = document.getElementById("summaryStats");
const summaryDesc = document.getElementById("summaryDesc");
const copyBtn = document.getElementById("copyBtn");
const apiGrid = document.getElementById("apiGrid");
const selectedCountEl = document.getElementById("selectedCount");
const selectAllBtn = document.getElementById("selectAllBtn");
const clearAllBtn = document.getElementById("clearAllBtn");
const actionDivider = document.getElementById("actionDivider");
const totalScanCountEl = document.getElementById("totalScanCount");

const rows = [
  { id: "jsapi", name: "Maps JavaScript API", consoleSlug: "maps-backend.googleapis.com", selected: true },
  { id: "geocode", name: "Geocoding API", consoleSlug: "geocoding-backend.googleapis.com", selected: true },
  { id: "places", name: "Places API (Classic/New)", consoleSlug: "places-backend.googleapis.com", selected: true },
  { id: "directions", name: "Directions API", consoleSlug: "directions-backend.googleapis.com", selected: true },
  { id: "distance", name: "Distance Matrix API", consoleSlug: "distance-matrix-backend.googleapis.com", selected: true },
  { id: "elevation", name: "Elevation API", consoleSlug: "elevation-backend.googleapis.com", selected: true },
  { id: "staticmap", name: "Maps Static API", consoleSlug: "static-maps-backend.googleapis.com", selected: true },
  { id: "streetview", name: "Street View Static API", consoleSlug: "street-view-image-backend.googleapis.com", selected: true },
  { id: "timezone", name: "Time Zone API", consoleSlug: "timezone-backend.googleapis.com", selected: true },
  { id: "embedmap", name: "Maps Embed API", consoleSlug: "maps-embed-backend.googleapis.com", selected: true }
];

let testResults = {};

// Scan Counter Logic
let localScans = parseInt(localStorage.getItem("key_radar_scans_count") || "0", 10);
let baseCounter = 1240;

function updateScanCounterDisplay() {
  if (totalScanCountEl) {
    totalScanCountEl.textContent = (baseCounter + localScans).toLocaleString();
  }
}

function incrementScanCounter() {
  localScans += 1;
  localStorage.setItem("key_radar_scans_count", localScans.toString());
  updateScanCounterDisplay();

  try {
    fetch("https://api.counterapi.dev/v1/key-radar-app/scans/up").catch(() => {});
  } catch (e) {}
}

// Render Checkboxes
function renderApiGrid() {
  apiGrid.innerHTML = rows.map(r => `
    <label class="api-checkbox-label" for="cb-${r.id}">
      <input type="checkbox" id="cb-${r.id}" ${r.selected ? "checked" : ""} data-id="${r.id}" />
      <span>${r.name}</span>
    </label>
  `).join("");

  updateSelectedCount();

  apiGrid.querySelectorAll("input[type=checkbox]").forEach(cb => {
    cb.addEventListener("change", (e) => {
      const id = e.target.getAttribute("data-id");
      const item = rows.find(r => r.id === id);
      if (item) item.selected = e.target.checked;
      updateSelectedCount();
    });
  });
}

function updateSelectedCount() {
  const count = rows.filter(r => r.selected).length;
  const total = rows.length;
  selectedCountEl.textContent = count;

  if (count === total) {
    selectAllBtn.style.display = "none";
    if (actionDivider) actionDivider.style.display = "none";
    clearAllBtn.style.display = "inline-block";
  } else if (count === 0) {
    selectAllBtn.style.display = "inline-block";
    if (actionDivider) actionDivider.style.display = "none";
    clearAllBtn.style.display = "none";
  } else {
    selectAllBtn.style.display = "inline-block";
    if (actionDivider) actionDivider.style.display = "inline-block";
    clearAllBtn.style.display = "inline-block";
  }
}

selectAllBtn.addEventListener("click", () => {
  rows.forEach(r => r.selected = true);
  renderApiGrid();
});

clearAllBtn.addEventListener("click", () => {
  rows.forEach(r => r.selected = false);
  renderApiGrid();
});

function buildRack() {
  testResults = {};
  summaryCard.style.display = "none";
  rack.innerHTML = rows.map(r => {
    if (r.selected) {
      return `
        <div class="row" id="row-${r.id}">
          <div class="led pending" id="led-${r.id}"></div>
          <div class="row-body">
            <div class="row-top">
              <span class="api-name">${r.name}</span>
              <span class="status-badge pending" id="word-${r.id}">Waiting</span>
            </div>
            <div class="row-msg" id="msg-${r.id}">Awaiting scan execution...</div>
          </div>
        </div>
      `;
    } else {
      testResults[r.id] = { level: "skip", text: "Skipped by user" };
      return `
        <div class="row" id="row-${r.id}">
          <div class="led skip" id="led-${r.id}"></div>
          <div class="row-body">
            <div class="row-top">
              <span class="api-name" style="opacity:0.6;">${r.name}</span>
              <span class="status-badge skip" id="word-${r.id}">Skipped</span>
            </div>
            <div class="row-msg" id="msg-${r.id}">Skipped by user option.</div>
          </div>
        </div>
      `;
    }
  }).join("");
}

function setStatus(id, level, msgHtml, rawMsgText) {
  const led = document.getElementById("led-" + id);
  const word = document.getElementById("word-" + id);
  const msg = document.getElementById("msg-" + id);
  if (!led) return;

  // Prevent overwriting an already passed ("ok") test status
  if (testResults[id] && testResults[id].level === "ok" && level === "fail") {
    return;
  }

  led.className = "led " + level;
  word.className = "status-badge " + level;
  word.textContent = level === "ok" ? "Pass" : level === "warn" ? "Info" : level === "pending" ? "Waiting" : level === "skip" ? "Skipped" : "Fail";
  if (msgHtml !== undefined) msg.innerHTML = msgHtml;
  
  testResults[id] = { level, text: rawMsgText || msg.textContent };
}

function buildConsoleUrl(slug) {
  return `https://console.cloud.google.com/apis/library/${slug}`;
}

function buildIframeSrcdoc(key, selectedIds) {
  const checkGeocode = selectedIds.includes("geocode");
  const checkPlaces = selectedIds.includes("places");
  const checkDirections = selectedIds.includes("directions");
  const checkDistance = selectedIds.includes("distance");
  const checkElevation = selectedIds.includes("elevation");
  const checkJsApi = selectedIds.includes("jsapi");

  return `<!DOCTYPE html><html><head><meta charset="utf-8"></head><body>
<div id="map" style="width:50px;height:50px;"></div>
<script>
  var jsApiPassed = false;

  function send(id, level, msg, rawText) {
    parent.postMessage({ source: "key-radar", id: id, level: level, msg: msg, rawText: rawText }, "*");
  }

  window.gm_authFailure = function () {
    if (${checkJsApi} && !jsApiPassed) {
      send("jsapi", "fail", 
        "<b>Maps JS SDK Auth Failure</b><br/>Maps JavaScript API disabled or restricted on Web.", 
        "Auth Failure — Maps JS SDK disabled"
      );
    }
  };

  function runAllTests() {
    jsApiPassed = true;
    if (${checkJsApi}) {
      send("jsapi", "ok", "Loaded successfully — Maps JavaScript SDK is operational.", "Loaded successfully");
    }

    if (${checkGeocode}) {
      try {
        var geocoder = new google.maps.Geocoder();
        geocoder.geocode({ address: "Dhaka" }, function(res, status) {
          if (status === "OK") {
            send("geocode", "ok", "OK — Address Geocoding lookup successful.", "OK");
          } else {
            var url = "https://console.cloud.google.com/apis/library/geocoding-backend.googleapis.com";
            send("geocode", "fail", status + " — Geocoding API is not activated on your API project. <a href='" + url + "' target='_blank'>Enable in Cloud Console</a>", status);
          }
        });
      } catch (e) {
        var url = "https://console.cloud.google.com/apis/library/geocoding-backend.googleapis.com";
        send("geocode", "fail", "REQUEST_DENIED — Geocoding API is disabled. <a href='" + url + "' target='_blank'>Enable in Cloud Console</a>", e.message);
      }
    }

    if (${checkPlaces}) {
      try {
        var map = new google.maps.Map(document.getElementById("map"), { center: { lat: 23.81, lng: 90.41 }, zoom: 10 });
        var svc = new google.maps.places.PlacesService(map);
        svc.findPlaceFromQuery({ query: "Dhaka", fields: ["name"] }, function(res, status) {
          if (status === "OK") {
            send("places", "ok", "OK — Place search query returned valid results.", "OK");
          } else {
            var url = "https://console.cloud.google.com/apis/library/places-backend.googleapis.com";
            send("places", "fail", status + " — Places API is not activated. <a href='" + url + "' target='_blank'>Enable in Cloud Console</a>", status);
          }
        });
      } catch (e) {
        var url = "https://console.cloud.google.com/apis/library/places-backend.googleapis.com";
        send("places", "fail", "REQUEST_DENIED — Places API disabled. <a href='" + url + "' target='_blank'>Enable in Cloud Console</a>", e.message);
      }
    }

    if (${checkDirections}) {
      try {
        var ds = new google.maps.DirectionsService();
        ds.route({ origin: "Dhaka", destination: "Gazipur", travelMode: google.maps.TravelMode.DRIVING }, function(res, status) {
          if (status === "OK") {
            send("directions", "ok", "OK — Route calculation completed successfully.", "OK");
          } else {
            var url = "https://console.cloud.google.com/apis/library/directions-backend.googleapis.com";
            send("directions", "fail", status + " — Directions API is not activated. <a href='" + url + "' target='_blank'>Enable in Cloud Console</a>", status);
          }
        });
      } catch (e) {
        var url = "https://console.cloud.google.com/apis/library/directions-backend.googleapis.com";
        send("directions", "fail", "REQUEST_DENIED — Directions API disabled. <a href='" + url + "' target='_blank'>Enable in Cloud Console</a>", e.message);
      }
    }

    if (${checkDistance}) {
      try {
        var dm = new google.maps.DistanceMatrixService();
        dm.getDistanceMatrix({
          origins: ["Dhaka"], destinations: ["Gazipur"],
          travelMode: google.maps.TravelMode.DRIVING
        }, function(res, status) {
          if (status === "OK") {
            send("distance", "ok", "OK — Distance & Duration matrix returned valid values.", "OK");
          } else {
            var url = "https://console.cloud.google.com/apis/library/distance-matrix-backend.googleapis.com";
            send("distance", "fail", status + " — Distance Matrix API is not activated. <a href='" + url + "' target='_blank'>Enable in Cloud Console</a>", status);
          }
        });
      } catch (e) {
        var url = "https://console.cloud.google.com/apis/library/distance-matrix-backend.googleapis.com";
        send("distance", "fail", "REQUEST_DENIED — Distance Matrix API disabled. <a href='" + url + "' target='_blank'>Enable in Cloud Console</a>", e.message);
      }
    }

    if (${checkElevation}) {
      try {
        var el = new google.maps.ElevationService();
        el.getElevationForLocations({ locations: [{ lat: 23.81, lng: 90.41 }] }, function(res, status) {
          if (status === "OK") {
            send("elevation", "ok", "OK — Elevation data retrieved successfully.", "OK");
          } else {
            var url = "https://console.cloud.google.com/apis/library/elevation-backend.googleapis.com";
            send("elevation", "fail", status + " — Elevation API is not activated. <a href='" + url + "' target='_blank'>Enable in Cloud Console</a>", status);
          }
        });
      } catch (e) {
        var url = "https://console.cloud.google.com/apis/library/elevation-backend.googleapis.com";
        send("elevation", "fail", "REQUEST_DENIED — Elevation API disabled. <a href='" + url + "' target='_blank'>Enable in Cloud Console</a>", e.message);
      }
    }
  }

  var script = document.createElement("script");
  script.src = "https://maps.googleapis.com/maps/api/js?key=${encodeURIComponent(key)}&libraries=places&callback=runAllTests";
  script.onerror = function() {
    if (${checkJsApi} && !jsApiPassed) {
      send("jsapi", "fail", "Script Load Error — Invalid API Key or network connectivity issue.", "Script Load Error");
    }
  };
  document.head.appendChild(script);
</script>
</body></html>`;
}

window.addEventListener("message", (e) => {
  const d = e.data;
  if (!d || d.source !== "key-radar") return;

  setStatus(d.id, d.level, d.msg, d.rawText);
  maybeFinishScan();
});

function maybeFinishScan() {
  const selectedRows = rows.filter(r => r.selected);
  const doneCount = selectedRows.filter(r => {
    const w = document.getElementById("word-" + r.id);
    return w && w.textContent !== "Waiting";
  }).length;

  if (doneCount === selectedRows.length) {
    scanState.textContent = "STATUS: COMPLETE";
    radarIcon.classList.remove("scanning");
    runBtn.disabled = false;
    runBtn.innerHTML = `
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>
      Rescan Key
    `;
    renderSummary();
  }
}

function renderSummary() {
  let pass = 0, fail = 0, skip = 0;
  rows.forEach(r => {
    const res = testResults[r.id];
    if (res) {
      if (res.level === "ok") pass++;
      else if (res.level === "fail") fail++;
      else if (res.level === "skip") skip++;
    }
  });

  summaryStats.innerHTML = `
    <span class="stat-badge ok">Pass: ${pass}</span>
    <span class="stat-badge fail">Fail: ${fail}</span>
    <span class="stat-badge skip">Skipped: ${skip}</span>
  `;

  if (pass > 0 && fail === 0) {
    summaryTitle.innerHTML = `<span style="color:var(--ok);">✓ Key Fully Operational</span>`;
    summaryDesc.innerHTML = `All ${pass} tested APIs are functional and ready for production deployment.`;
  } else if (pass > 0 && fail > 0) {
    summaryTitle.innerHTML = `<span style="color:var(--amber);">⚠️ Partial API Activation</span>`;
    summaryDesc.innerHTML = `${pass} APIs passed, but ${fail} APIs failed or are disabled in Google Cloud Console. Check details below.`;
  } else {
    summaryTitle.innerHTML = `<span style="color:var(--fail);">✕ Invalid Key / All Tests Failed</span>`;
    summaryDesc.innerHTML = `No APIs passed validation. Verify your key string, Cloud Console billing, and HTTP referrer restrictions.`;
  }

  summaryCard.style.display = "block";
}

copyBtn.addEventListener("click", () => {
  const keyVal = KEY_FIELD.value.trim();
  const maskedKey = keyVal.length > 8 ? keyVal.substring(0,6) + "..." + keyVal.substring(keyVal.length-4) : "HIDDEN_KEY";
  let reportText = `--- KEY RADAR DIAGNOSTIC REPORT ---\nKey: ${maskedKey}\nTimestamp: ${new Date().toLocaleString()}\n\n`;
  rows.forEach(r => {
    const res = testResults[r.id];
    reportText += `[${res ? res.level.toUpperCase() : "SKIPPED"}] ${r.name}: ${res ? res.text : "Not tested"}\n`;
  });
  
  navigator.clipboard.writeText(reportText).then(() => {
    const oldText = copyBtn.innerHTML;
    copyBtn.innerHTML = `✓ Copied!`;
    setTimeout(() => { copyBtn.innerHTML = oldText; }, 2000);
  });
});

let currentFrame = null;

runBtn.addEventListener("click", () => {
  const key = KEY_FIELD.value.trim();
  if (!key) { alert("Please input a Google Maps API Key first."); return; }

  const selectedRows = rows.filter(r => r.selected);
  if (selectedRows.length === 0) {
    alert("Please select at least one API to test.");
    return;
  }

  incrementScanCounter();

  buildRack();
  runBtn.disabled = true;
  runBtn.textContent = "Scanning...";
  scanState.textContent = "STATUS: SCANNING";
  radarIcon.classList.add("scanning");

  const selectedIds = selectedRows.map(r => r.id);

  // Load Iframe for SDK-based APIs if any selected
  const sdkApis = ["jsapi", "geocode", "places", "directions", "distance", "elevation"];
  const needsIframe = sdkApis.some(id => selectedIds.includes(id));

  if (needsIframe) {
    if (currentFrame) currentFrame.remove();
    currentFrame = document.createElement("iframe");
    currentFrame.style.display = "none";
    currentFrame.srcdoc = buildIframeSrcdoc(key, selectedIds);
    document.body.appendChild(currentFrame);
  }

  // 1. Static Map Test
  if (selectedIds.includes("staticmap")) {
    const img = new Image();
    img.onload = () => {
      setStatus("staticmap", "ok", "OK — Static Map image (200x200) loaded successfully.", "OK - Image loaded");
      maybeFinishScan();
    };
    img.onerror = () => {
      const url = buildConsoleUrl("static-maps-backend.googleapis.com");
      setStatus("staticmap", "fail", 
        "REQUEST_DENIED — Maps Static API disabled or restricted. <a href='" + url + "' target='_blank'>Enable in Cloud Console</a>",
        "REQUEST_DENIED"
      );
      maybeFinishScan();
    };
    img.src = `https://maps.googleapis.com/maps/api/staticmap?center=Dhaka&zoom=12&size=200x200&key=${encodeURIComponent(key)}`;
  }

  // 2. Street View Static Test
  if (selectedIds.includes("streetview")) {
    const img = new Image();
    img.onload = () => {
      setStatus("streetview", "ok", "OK — Street View Panorama image loaded successfully.", "OK");
      maybeFinishScan();
    };
    img.onerror = () => {
      const url = buildConsoleUrl("street-view-image-backend.googleapis.com");
      setStatus("streetview", "fail", 
        "REQUEST_DENIED — Street View Static API disabled or restricted. <a href='" + url + "' target='_blank'>Enable in Cloud Console</a>",
        "REQUEST_DENIED"
      );
      maybeFinishScan();
    };
    img.src = `https://maps.googleapis.com/maps/api/streetview?size=200x200&location=23.8103,90.4125&heading=151.78&pitch=-0.76&key=${encodeURIComponent(key)}`;
  }

  // 3. Time Zone Test
  if (selectedIds.includes("timezone")) {
    const ts = Math.floor(Date.now() / 1000);
    const tzUrl = `https://maps.googleapis.com/maps/api/timezone/json?location=23.8103,90.4125&timestamp=${ts}&key=${encodeURIComponent(key)}`;
    setStatus("timezone", "warn", 
      `No Web JS SDK available. <a href="${tzUrl}" target="_blank" rel="noopener">Click here for direct REST test link</a> — <code>"status": "OK"</code> confirms API is active.`,
      "Direct REST Test link available"
    );
    maybeFinishScan();
  }

  // 4. Maps Embed Test
  if (selectedIds.includes("embedmap")) {
    const embedUrl = `https://www.google.com/maps/embed/v1/place?key=${encodeURIComponent(key)}&q=Dhaka`;
    setStatus("embedmap", "warn", 
      `Maps Embed API operates via iframe. <a href="${embedUrl}" target="_blank" rel="noopener">Click here to test Embed URL</a> — map render confirms activation.`,
      "Embed Iframe test link available"
    );
    maybeFinishScan();
  }

  // Timeout Guard
  setTimeout(() => {
    selectedIds.forEach(id => {
      const w = document.getElementById("word-" + id);
      if (w && w.textContent === "Waiting") {
        const consoleUrl = buildConsoleUrl(rows.find(r => r.id === id).consoleSlug);
        setStatus(id, "fail", `Timeout — Request timed out. API disabled or network issue. <a href="${consoleUrl}" target="_blank">Enable in Cloud Console</a>`, "Timeout");
      }
    });
    maybeFinishScan();
  }, 7000);
});

// Initialize
updateScanCounterDisplay();
renderApiGrid();
buildRack();

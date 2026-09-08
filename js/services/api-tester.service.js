/**
 * API Tester Service - Core Diagnostic Engine
 * Runs SDK Iframe tests and direct REST fallback tests concurrently
 */
import { buildConsoleUrl } from '../utils/url.builder.js';
import { API_ROWS } from '../config/apis.config.js';
import { setStatus } from '../ui/rack.component.js';
import { elements } from '../ui/dom.elements.js';

let testResults = {};
let currentFrame = null;

export function getTestResults() {
  return testResults;
}

export function resetTestResults() {
  testResults = {};
}

/**
 * Build the iframe srcdoc for Google Maps JS SDK tests
 */
function buildIframeSrcdoc(key, selectedIds) {
  const check = (id) => selectedIds.includes(id);

  return `<!DOCTYPE html><html><head><meta charset="utf-8"></head><body>
<div id="map" style="width:50px;height:50px;"></div>
<script>
  var jsApiPassed = false;

  function send(id, level, msg, rawText) {
    parent.postMessage({ source: "key-radar", id: id, level: level, msg: msg, rawText: rawText }, "*");
  }

  window.gm_authFailure = function () {
    if (${check("jsapi")} && !jsApiPassed) {
      send("jsapi", "fail",
        "<b>Maps JS SDK Auth Failure</b><br/>Maps JavaScript API disabled or restricted on Web.",
        "Auth Failure — Maps JS SDK disabled"
      );
    }
  };

  function runAllTests() {
    jsApiPassed = true;
    if (${check("jsapi")}) {
      send("jsapi", "ok", "Loaded successfully — Maps JavaScript SDK is operational.", "Loaded successfully");
    }

    if (${check("geocode")}) {
      try {
        var geocoder = new google.maps.Geocoder();
        geocoder.geocode({ address: "Dhaka" }, function(res, status) {
          if (status === "OK") {
            send("geocode", "ok", "OK — Address Geocoding lookup successful.", "OK");
          } else {
            var url = "https://console.cloud.google.com/apis/library/geocoding-backend.googleapis.com";
            send("geocode", "fail", status + " — Geocoding API is not activated. <a href='" + url + "' target='_blank'>Enable in Cloud Console</a>", status);
          }
        });
      } catch (e) {
        var url = "https://console.cloud.google.com/apis/library/geocoding-backend.googleapis.com";
        send("geocode", "fail", "REQUEST_DENIED — Geocoding API is disabled. <a href='" + url + "' target='_blank'>Enable in Cloud Console</a>", e.message);
      }
    }

    if (${check("places")}) {
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

    if (${check("directions")}) {
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

    if (${check("distance")}) {
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

    if (${check("elevation")}) {
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
    if (${check("jsapi")} && !jsApiPassed) {
      send("jsapi", "fail", "Script Load Error — Invalid API Key or network connectivity issue.", "Script Load Error");
    }
  };
  document.head.appendChild(script);
<\/script>
</body></html>`;
}

/**
 * Set a single API row status and store result
 */
function recordAndSetStatus(id, level, msgHtml, rawText) {
  // Protect already-passed results from being overwritten by a failure
  if (testResults[id] && testResults[id].level === "ok" && level === "fail") {
    return;
  }
  testResults[id] = { level, text: rawText };
  setStatus(id, level, msgHtml, rawText);
}

/**
 * Run all API diagnostics for a given key and set of selected API IDs
 * @param {string} key - Google Maps API key
 * @param {string[]} selectedIds - Array of API IDs to test
 * @param {Function} onAllDone - Callback when all tests finish
 */
export function runDiagnostics(key, selectedIds, onComplete) {
  resetTestResults();

  const sdkApis = ["jsapi", "geocode", "places", "directions", "distance", "elevation"];
  const needsIframe = sdkApis.some(id => selectedIds.includes(id));

  // Listen for iframe postMessages
  const messageHandler = (e) => {
    const d = e.data;
    if (!d || d.source !== "key-radar") return;
    recordAndSetStatus(d.id, d.level, d.msg, d.rawText);
    checkCompletion();
  };
  window.addEventListener("message", messageHandler);

  // Launch iframe for SDK-backed APIs
  if (needsIframe) {
    if (currentFrame) currentFrame.remove();
    currentFrame = document.createElement("iframe");
    currentFrame.style.display = "none";
    currentFrame.srcdoc = buildIframeSrcdoc(key, selectedIds);
    document.body.appendChild(currentFrame);
  }

  // Static Maps REST test
  if (selectedIds.includes("staticmap")) {
    const img = new Image();
    img.onload = () => {
      recordAndSetStatus("staticmap", "ok", "OK — Static Map image (200x200) loaded successfully.", "OK");
      checkCompletion();
    };
    img.onerror = () => {
      const url = buildConsoleUrl("static-maps-backend.googleapis.com");
      recordAndSetStatus("staticmap", "fail",
        `REQUEST_DENIED — Maps Static API disabled or restricted. <a href='${url}' target='_blank'>Enable in Cloud Console</a>`,
        "REQUEST_DENIED"
      );
      checkCompletion();
    };
    img.src = `https://maps.googleapis.com/maps/api/staticmap?center=Dhaka&zoom=12&size=200x200&key=${encodeURIComponent(key)}`;
  }

  // Street View REST test
  if (selectedIds.includes("streetview")) {
    const img = new Image();
    img.onload = () => {
      recordAndSetStatus("streetview", "ok", "OK — Street View Panorama image loaded successfully.", "OK");
      checkCompletion();
    };
    img.onerror = () => {
      const url = buildConsoleUrl("street-view-image-backend.googleapis.com");
      recordAndSetStatus("streetview", "fail",
        `REQUEST_DENIED — Street View Static API disabled or restricted. <a href='${url}' target='_blank'>Enable in Cloud Console</a>`,
        "REQUEST_DENIED"
      );
      checkCompletion();
    };
    img.src = `https://maps.googleapis.com/maps/api/streetview?size=200x200&location=23.8103,90.4125&heading=151.78&pitch=-0.76&key=${encodeURIComponent(key)}`;
  }

  // Time Zone API (REST Link only — no JS SDK available)
  if (selectedIds.includes("timezone")) {
    const ts = Math.floor(Date.now() / 1000);
    const tzUrl = `https://maps.googleapis.com/maps/api/timezone/json?location=23.8103,90.4125&timestamp=${ts}&key=${encodeURIComponent(key)}`;
    recordAndSetStatus("timezone", "warn",
      `No Web JS SDK available. <a href="${tzUrl}" target="_blank" rel="noopener">Click here for direct REST test link</a> — <code>"status": "OK"</code> confirms API is active.`,
      "Direct REST Test link available"
    );
    checkCompletion();
  }

  // Maps Embed API (iframe link only)
  if (selectedIds.includes("embedmap")) {
    const embedUrl = `https://www.google.com/maps/embed/v1/place?key=${encodeURIComponent(key)}&q=Dhaka`;
    recordAndSetStatus("embedmap", "warn",
      `Maps Embed API operates via iframe. <a href="${embedUrl}" target="_blank" rel="noopener">Click here to test Embed URL</a> — map render confirms activation.`,
      "Embed Iframe test link available"
    );
    checkCompletion();
  }

  // Timeout guard — mark any still-waiting rows as failed after 7s
  const timeoutGuard = setTimeout(() => {
    selectedIds.forEach(id => {
      if (!testResults[id]) {
        const row = API_ROWS.find(r => r.id === id);
        const consoleUrl = buildConsoleUrl(row.consoleSlug);
        recordAndSetStatus(id, "fail",
          `Timeout — Request timed out. API disabled or network issue. <a href="${consoleUrl}" target="_blank">Enable in Cloud Console</a>`,
          "Timeout"
        );
      }
    });
    window.removeEventListener("message", messageHandler);
    checkCompletion(true);
  }, 7000);

  function checkCompletion(forced = false) {
    const doneCount = selectedIds.filter(id => !!testResults[id]).length;
    if (forced || doneCount === selectedIds.length) {
      clearTimeout(timeoutGuard);
      window.removeEventListener("message", messageHandler);
      onComplete(testResults);
    }
  }
}

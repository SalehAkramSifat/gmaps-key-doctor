/**
 * API Detail Knowledge Base
 * Contains use-cases, fix steps, and diagnostic info for all 10 Google Maps APIs
 */
export const API_DETAILS = {

  jsapi: {
    name: "Maps JavaScript API",
    icon: "🗺️",
    description: "The core SDK that renders interactive Google Maps in your web or Flutter Web app.",
    useCases: [
      "Interactive map rendering on websites & Flutter Web",
      "Custom markers, polygons, and overlays",
      "Map events (click, drag, zoom)",
      "Base SDK required for Places, Directions UI components",
    ],
    passNote: "Your key can successfully load the Maps JavaScript SDK. Interactive maps will render correctly.",
    warnNote: null,
    failReasons: [
      "Maps JavaScript API is not enabled in Google Cloud Console",
      "API key is restricted to Mobile Apps (Package Name / SHA-1) — browser requests are blocked",
      "Billing account is not active or linked",
      "Key HTTP referrer restriction doesn't include your current domain",
    ],
    fixSteps: [
      "Open Google Cloud Console → APIs & Services → Library",
      "Search for <b>Maps JavaScript API</b> and click Enable",
      "Ensure your Billing Account is active under Billing section",
      "If key is restricted, add <code>http://127.0.0.1:*</code> or your domain to HTTP referrers",
    ],
    consoleSlug: "maps-backend.googleapis.com",
  },

  geocode: {
    name: "Geocoding API",
    icon: "📍",
    description: "Converts addresses to geographic coordinates (lat/lng) and vice versa.",
    useCases: [
      "Converting user-typed addresses to map coordinates",
      "Reverse geocoding — pin drop to readable address",
      "Address validation in forms",
      "Powering delivery & pickup address inputs",
    ],
    passNote: "Geocoding is working. Address lookups and reverse geocoding will function correctly in your app.",
    warnNote: null,
    failReasons: [
      "Geocoding API is not enabled in Google Cloud Console",
      "Billing account is not active",
      "API key quota has been exceeded",
      "Key is restricted to wrong domain or app",
    ],
    fixSteps: [
      "Open Google Cloud Console → APIs & Services → Library",
      "Search for <b>Geocoding API</b> and click Enable",
      "Check your Billing Account is active",
      "If quota exceeded, check your usage in Quotas section",
    ],
    consoleSlug: "geocoding-backend.googleapis.com",
  },

  places: {
    name: "Places API (Classic / New)",
    icon: "🏪",
    description: "Search for places, get place details, autocomplete address inputs, and find nearby businesses.",
    useCases: [
      "Address autocomplete dropdowns",
      "Nearby search (restaurants, hospitals, banks)",
      "Place detail cards (name, rating, photo, hours)",
      "Place search in Flutter using google_maps_flutter",
    ],
    passNote: "Places API is active. Autocomplete, nearby search, and place details will work correctly.",
    warnNote: null,
    failReasons: [
      "Places API (Classic or New) is not enabled",
      "Only one version enabled — Classic or New — depending on your SDK version, the other may fail",
      "Billing is not active",
      "API quota exceeded",
    ],
    fixSteps: [
      "Open Google Cloud Console → APIs & Services → Library",
      "Search <b>Places API</b> and enable both Classic and New versions",
      "Ensure your Billing Account is active",
      "For Flutter apps, also enable <b>Maps SDK for Android / iOS</b>",
    ],
    consoleSlug: "places-backend.googleapis.com",
  },

  directions: {
    name: "Directions API",
    icon: "🧭",
    description: "Calculates routes between locations with turn-by-turn instructions and travel time estimates.",
    useCases: [
      "Navigation routes in ride-hailing & delivery apps",
      "Turn-by-turn driving/walking/cycling directions",
      "Multi-waypoint route planning",
      "ETA calculation for drivers and riders",
    ],
    passNote: "Directions API is active. Route calculation and turn-by-turn navigation data will work correctly.",
    warnNote: null,
    failReasons: [
      "Directions API is not enabled in Google Cloud Console",
      "Billing is not active",
      "Quota exceeded — heavy usage without quota increase",
      "Key restricted to wrong domain",
    ],
    fixSteps: [
      "Open Google Cloud Console → APIs & Services → Library",
      "Search <b>Directions API</b> and click Enable",
      "Ensure Billing Account is active",
      "Monitor usage in Quotas section and request increases if needed",
    ],
    consoleSlug: "directions-backend.googleapis.com",
  },

  distance: {
    name: "Distance Matrix API",
    icon: "📏",
    description: "Calculates travel distance and duration between multiple origins and destinations simultaneously.",
    useCases: [
      "Estimating trip price based on distance",
      "Finding nearest driver to a rider",
      "Delivery fee calculation",
      "Multi-stop route optimization",
    ],
    passNote: "Distance Matrix API is active. Distance and duration calculations will return accurate results.",
    warnNote: null,
    failReasons: [
      "Distance Matrix API is not enabled in Google Cloud Console",
      "Billing is not active",
      "Quota limit reached",
    ],
    fixSteps: [
      "Open Google Cloud Console → APIs & Services → Library",
      "Search <b>Distance Matrix API</b> and click Enable",
      "Ensure Billing Account is linked and active",
    ],
    consoleSlug: "distance-matrix-backend.googleapis.com",
  },

  elevation: {
    name: "Elevation API",
    icon: "⛰️",
    description: "Returns elevation data for any geographic coordinates on Earth's surface.",
    useCases: [
      "Altitude-aware routing for cycling and hiking apps",
      "Terrain analysis and elevation profiles",
      "Environmental and mapping data applications",
      "Aviation and drone flight planning",
    ],
    passNote: "Elevation API is active. Altitude and terrain data lookups will work correctly.",
    warnNote: null,
    failReasons: [
      "Elevation API is not enabled in Google Cloud Console",
      "Billing is not active",
    ],
    fixSteps: [
      "Open Google Cloud Console → APIs & Services → Library",
      "Search <b>Elevation API</b> and click Enable",
      "Ensure Billing Account is active",
    ],
    consoleSlug: "elevation-backend.googleapis.com",
  },

  staticmap: {
    name: "Maps Static API",
    icon: "🖼️",
    description: "Generates static map images as PNG files — no JavaScript required.",
    useCases: [
      "Map thumbnails in emails and PDF reports",
      "Social media sharing previews with map location",
      "Lightweight map displays in Flutter (Image widget)",
      "Non-interactive location previews in notifications",
    ],
    passNote: "Maps Static API is active. Static map image generation will work correctly — ideal for emails, PDFs, and image previews.",
    warnNote: null,
    failReasons: [
      "Maps Static API is not enabled in Google Cloud Console",
      "API key is restricted — image requests are blocked",
      "Billing is not active",
    ],
    fixSteps: [
      "Open Google Cloud Console → APIs & Services → Library",
      "Search <b>Maps Static API</b> and click Enable",
      "If using key restrictions, ensure static map image URLs are whitelisted",
      "Ensure Billing Account is active",
    ],
    consoleSlug: "static-maps-backend.googleapis.com",
  },

  streetview: {
    name: "Street View Static API",
    icon: "📸",
    description: "Fetches real-world panoramic Street View imagery as static images.",
    useCases: [
      "Location previews before navigation",
      "Property or business storefront photos",
      "Virtual tour thumbnails",
      "Verification of pickup/dropoff addresses in ride apps",
    ],
    passNote: "Street View Static API is active. Panoramic street-level imagery will load correctly.",
    warnNote: null,
    failReasons: [
      "Street View Static API is not enabled",
      "Billing is not active",
      "API key domain restriction mismatch",
    ],
    fixSteps: [
      "Open Google Cloud Console → APIs & Services → Library",
      "Search <b>Street View Static API</b> and click Enable",
      "Ensure Billing Account is active",
    ],
    consoleSlug: "street-view-image-backend.googleapis.com",
  },

  timezone: {
    name: "Time Zone API",
    icon: "🕐",
    description: "Returns the time zone for any geographic coordinate — including DST offset and UTC offset.",
    useCases: [
      "Scheduling appointments across time zones",
      "Displaying local time at a delivery destination",
      "International shipping and logistics apps",
      "Ride-hailing apps with cross-timezone coverage",
    ],
    passNote: null,
    warnNote: "The Time Zone API has no JavaScript SDK — it's a REST-only API. Browser CORS policy blocks direct requests from web pages. Use the REST test link to manually verify. In your backend or Flutter app, call the REST endpoint directly with your key.",
    failReasons: [],
    fixSteps: [
      "Open Google Cloud Console → APIs & Services → Library",
      "Search <b>Time Zone API</b> and click Enable",
      "Test via the REST link above — look for <code>\"status\": \"OK\"</code>",
      "In Flutter/backend, call the REST API directly — CORS does not apply server-side",
    ],
    consoleSlug: "timezone-backend.googleapis.com",
  },

  embedmap: {
    name: "Maps Embed API",
    icon: "🔗",
    description: "Embeds an interactive Google Map into a webpage via an <iframe> — no JavaScript SDK needed.",
    useCases: [
      "Embedding store/office location maps on websites",
      "Contact pages with an interactive location map",
      "Simple non-interactive maps without JS setup",
      "CMS platforms (WordPress, Wix) map integrations",
    ],
    passNote: null,
    warnNote: "Maps Embed API works via an <code>&lt;iframe&gt;</code> URL. Browser security prevents programmatic verification — use the test link to confirm. If the iframe renders a map, your key is active.",
    failReasons: [],
    fixSteps: [
      "Open Google Cloud Console → APIs & Services → Library",
      "Search <b>Maps Embed API</b> and click Enable",
      "Click the Embed Test link above — if a map renders, the API is active",
      "Ensure your domain is added to allowed HTTP referrers if key is restricted",
    ],
    consoleSlug: "maps-embed-backend.googleapis.com",
  },
};

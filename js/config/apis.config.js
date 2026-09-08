/**
 * Core Google Maps Platform API Definitions & Configuration
 */
export const API_ROWS = [
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

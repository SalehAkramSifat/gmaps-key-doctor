/**
 * Google Cloud Console URL Generator
 * @param {string} consoleSlug - The specific API backend service slug
 * @returns {string} Deep link to Google Cloud Console API enablement page
 */
export function buildConsoleUrl(consoleSlug) {
  if (!consoleSlug) {
    return "https://console.cloud.google.com/google/maps-apis/overview";
  }
  return `https://console.cloud.google.com/apis/library/${consoleSlug}`;
}

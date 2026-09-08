# 🩺 GMaps Key Doctor — Google Maps API Health Diagnostics

<p align="center">
  <img src="https://img.shields.io/badge/Security-100%25%20Client--Side%20Privacy-10b981?style=for-the-badge&logo=shield" alt="Client-Side Privacy" />
  <img src="https://img.shields.io/badge/Google%20Maps-10%20Core%20APIs%20Supported-3b82f6?style=for-the-badge&logo=googlemaps" alt="Google Maps APIs" />
  <img src="https://img.shields.io/badge/License-MIT-f59e0b?style=for-the-badge" alt="MIT License" />
</p>

<p align="center">
  <b>Test, diagnose, and prescribe solutions for any Google Maps Platform API key against 10 core APIs instantly — 100% client-side in your browser.</b>
</p>

---

## 💡 Why GMaps Key Doctor Exists

A single Google Maps API key often powers multiple features (Geocoding, Places, Directions, Static Maps, etc.), but each API must be individually activated in Google Cloud Console. 

When a feature fails in a Flutter/Mobile or Web app, developers usually face blank maps or generic error codes. **GMaps Key Doctor diagnoses and fixes this problem in seconds:**

1. **One Key, 10 APIs**: Test all core Google Maps Platform APIs simultaneously in one click.
2. **Clear Error Explanations**: Instantly detect `REQUEST_DENIED`, `BILLING_DISABLED`, `RefererNotAllowedMapError`, or missing API activations.
3. **Direct Cloud Console Links**: Every failed API test provides a 1-click link directly to the specific Google Cloud Console page to enable it.
4. **Pre-Deployment Sanity Checks**: Verify new client keys or rotated keys before pushing code to production.
5. **100% Client-Side Privacy**: Zero backend servers. Your API key is never stored, logged, or transmitted anywhere outside your browser.

---

## ⚡ Supported Google Maps Platform APIs

| API / Service | Check Method | Supported |
| :--- | :--- | :---: |
| **Maps JavaScript SDK** | Interactive Map SDK Init | `✓` |
| **Geocoding API** | Reverse Address Lookup | `✓` |
| **Places API (Classic & New)** | Place Query Search | `✓` |
| **Directions API** | Route Calculation | `✓` |
| **Distance Matrix API** | Travel Distance & Duration | `✓` |
| **Elevation API** | Elevation Location Lookup | `✓` |
| **Maps Static API** | Static Image Render Test | `✓` |
| **Street View Static API** | Panorama Image Render Test | `✓` |
| **Time Zone API** | Direct REST Link & Check | `✓` |
| **Maps Embed API** | Interactive Iframe Render Link | `✓` |

---

## ✨ Features

- 🎯 **Configurable API Selection**: Select or unselect specific APIs before scanning (Smart *Select All* / *Clear All* controls).
- 🔍 **Dual-Mode Verification**: Runs JavaScript SDK tests alongside direct REST fallbacks for maximum accuracy.
- 📋 **1-Click Markdown Report Copy**: Easily copy formatted diagnostic results to share with clients or team members.
- ⚡ **Live Scan Counter**: Track local & global diagnostic scans in real-time.
- 🎨 **Minimal Modern Dark UI**: Designed with clean typography (`Inter` + `JetBrains Mono`) and dark glassmorphic styling.

---

## 🚀 Quick Start (Local Run)

### Option 1 — Static Server (npm)
```bash
npm install
npm run dev
```
Open `http://127.0.0.1:5500` in your browser.

### Option 2 — Double Click
Simply open `index.html` directly in any web browser.

---

## 🌐 One-Click Deployment

### Deploy to Vercel
[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new)

1. Import this repository in Vercel.
2. Framework Preset: **Other** (No build command or output directory required).
3. Click **Deploy**.

### Deploy to GitHub Pages
1. Go to repository **Settings -> Pages**.
2. Source: **Deploy from a branch** -> Select `main` branch `/root`.
3. Click **Save**.

---

## 🔒 Privacy & Security

GMaps Key Doctor is built with privacy as its primary foundation:
- All network requests originate directly from your browser to `https://maps.googleapis.com`.
- There are **no analytics, backend APIs, or databases** storing submitted keys.
- Your API key remains strictly in browser memory during execution.

---

## 📝 License

Distributed under the MIT License. See `LICENSE` for more information.

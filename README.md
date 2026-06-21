# Drag Queen Forecast

A drag-themed weather app built as a portfolio project. It fetches real-time weather data and presents it with a little extra flair.

## Tech Stack

- **React 19** — UI components and state management
- **TypeScript** — type-safe throughout
- **Vite** — build tool and dev server
- **Open-Meteo API** — free, no-key weather data (current conditions, hourly, and 7-day forecasts)
- **BigDataCloud API** — reverse geocoding to display a city name from coordinates
- **Cloudflare Pages** — deployment target (`npm run deploy`)

## Features

- Current conditions with feels-like temperature, wind speed, and humidity
- Hourly forecast for the next 12 hours
- 3-day extended forecast
- 7-day weekly forecast
- °F / °C toggle
- Browser geolocation or manual city search
- Drag-queen-flavored weather descriptions and day names

## Getting Started

```bash
npm install
npm run dev
```

## Build & Deploy

```bash
npm run build       # TypeScript compile + Vite build
npm run deploy      # Build and deploy to Cloudflare Pages
```

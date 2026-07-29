# CAIP — Climate Action Intelligence Platform

A Climate-Smart Agriculture Decision Support System for governments, extension
officers, researchers, and farmers. It turns climate, satellite, IoT, and drone
data into ranked, actionable recommendations.

Prototype with simulated sample data (Rwanda focus).

## Tech Stack

- **Next.js 15** (App Router) + **React 19** + **TypeScript**
- **Tailwind CSS** (light/dark themes)
- **Leaflet** + **react-leaflet** (interactive GIS maps)
- **Recharts** (time-series & analytics)
- **Framer Motion** (animations)
- **lucide-react** (icons)

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

Production build:

```bash
npm run build && npm start
```

Note: don't run `npm run build` while `npm run dev` is running — they share the
`.next` folder and the build will corrupt the live dev server. Stop dev first,
or delete `.next` and restart dev if it happens.

## Modules

| Route | Module | Highlights |
|-------|--------|-----------|
| `/` | **Dashboard** | Overview cards, live weather, AI recommendations, alerts, KPI strip, risk map |
| `/map` | **Interactive GIS Map** | Layer controls (NDVI, LST, soil, rainfall, water, drone, IoT), risk heatmap, basemap switch, province filter |
| `/analytics` | **Analytics** | NDVI, rainfall, temp anomalies, soil moisture, water, AI risk prediction |
| `/decision-support` | **AI Decision Support** | Ranked, confidence-scored recommendations with categories & actions |
| `/risk-engine` | **Multi-Hazard Risk Engine** | Data-fusion vulnerability score gauge, weighted input layers, district ranking |
| `/forecast` | **Climate Forecast** | Seasonal rainfall, heatwave probability, WRSI, forecast confidence |
| `/earth-observation` | **Earth Observation** | Sentinel-2 / Landsat / DE Africa / WOfS, before/after NDVI slider, fractional cover |
| `/iot` | **IoT Monitoring** | Live-updating sensor telemetry, sensor map, battery/status table |
| `/drone` | **Drone Analytics** | Mission history, crop-health imagery, stress detection, upload, inspection reports |
| `/alerts` | **Alert Center** | Multi-hazard alerts, SMS/email/push previews, acknowledge flow |
| `/reports` | **Reports** | Report list + printable PDF preview (browser print → PDF) |
| `/users` | **User Management** | 5 roles (Admin, Government, Researcher, Extension Officer, Farmer) + permission matrix |

## Notes

- All data is mock/simulated (see [`lib/mockData.ts`](lib/mockData.ts)) — no backend required.
  Swap this module for real Supabase / Digital Earth Africa / sensor APIs to go live.
- Fully responsive (desktop / tablet / mobile) with a collapsible sidebar.
- Light & dark themes (toggle in the top bar; respects system preference).

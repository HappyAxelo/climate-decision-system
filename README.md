# CAIP — Climate Action Intelligence Platform

A Climate-Smart Agriculture Decision Support System for governments, extension
officers, researchers, and farmers. It turns climate, satellite, and IoT data
into ranked, actionable recommendations.

Live: https://intwali.netlify.app · Rwanda focus. Weather is live (Open-Meteo);
NDVI and IoT run on sample data until you plug in a provider (see Live data).

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
| `/` | **Dashboard** | Overview cards, **live weather**, AI recommendations, alerts, KPI strip, risk map |
| `/map` | **Interactive GIS Map** | Layer controls (NDVI, LST, soil, rainfall, water, IoT), risk heatmap, basemap switch, province filter |
| `/analytics` | **Analytics** | NDVI, rainfall, temp anomalies, soil moisture, water, AI risk prediction |
| `/decision-support` | **AI Decision Support** | Ranked, confidence-scored recommendations with categories & actions |
| `/risk-engine` | **Multi-Hazard Risk Engine** | Data-fusion vulnerability score gauge, weighted input layers, district ranking |
| `/forecast` | **Climate Forecast** | Seasonal rainfall, heatwave probability, WRSI, forecast confidence |
| `/earth-observation` | **Earth Observation** | Sentinel-2 / Landsat / DE Africa / WOfS, before/after NDVI slider, **live-capable NDVI series** |
| `/iot` | **IoT Monitoring** | Sensor telemetry, sensor map, battery/status table, **live ingestion endpoint** |
| `/alerts` | **Alert Center** | Multi-hazard alerts, SMS/email/push previews, acknowledge flow |
| `/reports` | **Reports** | Report list + printable PDF preview (browser print → PDF) |
| `/users` | **User Management** | 5 roles (Admin, Government, Researcher, Extension Officer, Farmer) + permission matrix |

## Live data

The app is moving off mock data through a typed data layer in [`lib/data/`](lib/data/),
exposed as API routes. Each has a graceful fallback so the UI never breaks.

| Endpoint | Source | Status | Activate with |
|----------|--------|--------|---------------|
| `GET /api/weather` | [Open-Meteo](https://open-meteo.com) | **Live now** (no key) | nothing — works out of the box |
| `GET /api/ndvi` | Sentinel-2 via [Sentinel Hub](https://www.sentinel-hub.com) | Sample until keyed | `SENTINELHUB_CLIENT_ID` + `SENTINELHUB_CLIENT_SECRET` |
| `GET /api/iot` | Seed + live ingestion | Live-ready | POST readings to it (below) |
| `POST /api/iot` | Sensor ingestion webhook | Live-ready | point TTN / MQTT bridge / TAHMO poller at it |

Copy [`.env.example`](.env.example) to `.env.local` to add keys (all optional).

**Sending IoT readings** — point The Things Network's HTTP webhook, an MQTT→HTTP
bridge, or a TAHMO poller at `POST /api/iot`. Accepts a flat payload or a TTN v3 uplink:

```bash
curl -X POST https://intwali.netlify.app/api/iot \
  -H "content-type: application/json" \
  -H "x-ingest-key: $INGEST_API_KEY" \
  -d '{"id":"KRH-01","temp":33.4,"humidity":29,"soilMoisture":13,"battery":82}'
```

> The IoT store is in-memory (resets on serverless cold start). For production,
> persist to Supabase / Postgres / Redis by swapping the store in [`lib/data/iot.ts`](lib/data/iot.ts).

See [where to get real satellite & IoT data](#) — Digital Earth Africa, Copernicus,
NASA POWER, CHIRPS, TAHMO, The Things Network.

## Notes

- Remaining modules use sample data in [`lib/mockData.ts`](lib/mockData.ts); the live
  data layer in [`lib/data/`](lib/data/) is replacing it module by module.
- Fully responsive (desktop / tablet / mobile) with a collapsible sidebar.
- Light & dark themes (toggle in the top bar; respects system preference).

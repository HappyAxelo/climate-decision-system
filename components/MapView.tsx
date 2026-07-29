"use client";

import { MapContainer, TileLayer, CircleMarker, Popup, Tooltip, Rectangle } from "react-leaflet";
import { districts, sensors, riskColor } from "@/lib/mockData";

const rwandaCenter: [number, number] = [-1.94, 30.06];

interface MapViewProps {
  showRisk?: boolean;
  showSensors?: boolean;
  showHeatmap?: boolean;
  height?: string;
  basemap?: "dark" | "light" | "satellite";
}

// Simulated raster overlay cells for heatmap look
function heatCells() {
  return districts.map((d) => {
    const size = 0.18;
    const bounds: [[number, number], [number, number]] = [
      [d.lat - size, d.lng - size],
      [d.lat + size, d.lng + size],
    ];
    const opacity = d.vulnerabilityScore / 160 + 0.15;
    return { id: d.id, bounds, color: riskColor[d.risk], opacity };
  });
}

const tiles = {
  dark: {
    url: "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png",
    attr: "&copy; OpenStreetMap &copy; CARTO",
  },
  light: {
    url: "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png",
    attr: "&copy; OpenStreetMap &copy; CARTO",
  },
  satellite: {
    url: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
    attr: "&copy; Esri, Maxar, Earthstar Geographics",
  },
};

export default function MapView({
  showRisk = true,
  showSensors = false,
  showHeatmap = false,
  height = "560px",
  basemap = "dark",
}: MapViewProps) {
  const t = tiles[basemap];
  const sensorColor: Record<string, string> = {
    online: "#10b981",
    warning: "#f59e0b",
    offline: "#ef4444",
  };

  return (
    <MapContainer
      center={rwandaCenter}
      zoom={8}
      scrollWheelZoom
      style={{ height, width: "100%", borderRadius: "1rem", zIndex: 0 }}
    >
      <TileLayer url={t.url} attribution={t.attr} />

      {showHeatmap &&
        heatCells().map((c) => (
          <Rectangle
            key={c.id}
            bounds={c.bounds}
            pathOptions={{ color: c.color, weight: 0, fillColor: c.color, fillOpacity: c.opacity }}
          />
        ))}

      {showRisk &&
        districts.map((d) => (
          <CircleMarker
            key={d.id}
            center={[d.lat, d.lng]}
            radius={8 + d.vulnerabilityScore / 8}
            pathOptions={{
              color: "#fff",
              weight: 1.5,
              fillColor: riskColor[d.risk],
              fillOpacity: 0.85,
            }}
          >
            <Tooltip direction="top" offset={[0, -6]}>
              <span className="font-semibold">{d.name}</span> — score {d.vulnerabilityScore}
            </Tooltip>
            <Popup>
              <div style={{ minWidth: 180 }}>
                <div style={{ fontWeight: 700, fontSize: 14 }}>{d.name}</div>
                <div style={{ color: "#64748b", fontSize: 12, marginBottom: 6 }}>
                  {d.province} Province
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 4, fontSize: 12 }}>
                  <span>Vuln. Score</span>
                  <b style={{ color: riskColor[d.risk] }}>{d.vulnerabilityScore}</b>
                  <span>NDVI</span>
                  <b>{d.ndvi}</b>
                  <span>LST</span>
                  <b>{d.lst}°C</b>
                  <span>Soil moisture</span>
                  <b>{d.soilMoisture}%</b>
                  <span>Rainfall 30d</span>
                  <b>{d.rainfall} mm</b>
                </div>
              </div>
            </Popup>
          </CircleMarker>
        ))}

      {showSensors &&
        sensors.map((s) => (
          <CircleMarker
            key={s.id}
            center={[s.lat, s.lng]}
            radius={7}
            pathOptions={{
              color: "#fff",
              weight: 1.5,
              fillColor: sensorColor[s.status],
              fillOpacity: 0.9,
            }}
          >
            <Tooltip direction="top" offset={[0, -6]}>
              {s.id} · {s.status}
            </Tooltip>
            <Popup>
              <div style={{ minWidth: 160 }}>
                <div style={{ fontWeight: 700 }}>{s.name}</div>
                <div style={{ color: "#64748b", fontSize: 12, marginBottom: 6 }}>{s.id} · {s.district}</div>
                <div style={{ fontSize: 12 }}>
                  Temp {s.temp}°C &nbsp; Humidity {s.humidity}% <br />
                  Soil {s.soilMoisture}% &nbsp; Battery {s.battery}%
                </div>
              </div>
            </Popup>
          </CircleMarker>
        ))}
    </MapContainer>
  );
}

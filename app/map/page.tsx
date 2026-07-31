"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import {
  Map as MapIcon,
  Leaf,
  Thermometer,
  Droplets,
  CloudRain,
  Waves,
  Radio,
  Flame,
  Layers,
} from "lucide-react";
import { districts, riskColor, riskLabel, RiskLevel } from "@/lib/mockData";
import { PageHeader, RiskBadge, Card } from "@/components/ui";

const MapView = dynamic(() => import("@/components/MapView"), {
  ssr: false,
  loading: () => (
    <div className="grid h-[560px] place-items-center rounded-2xl bg-ink-100 text-sm text-ink-400 dark:bg-ink-900">
      Loading map…
    </div>
  ),
});

const layers = [
  { key: "ndvi", label: "NDVI", icon: Leaf, color: "#10b981", on: true },
  { key: "lst", label: "Land Surface Temp", icon: Thermometer, color: "#ef4444", on: false },
  { key: "soil", label: "Soil Moisture", icon: Droplets, color: "#3b82f6", on: false },
  { key: "rain", label: "Rainfall", icon: CloudRain, color: "#0ea5e9", on: false },
  { key: "water", label: "Water Bodies", icon: Waves, color: "#06b6d4", on: false },
  { key: "sensors", label: "IoT Sensor Locations", icon: Radio, color: "#f59e0b", on: true },
  { key: "heatmap", label: "Risk Heatmap", icon: Flame, color: "#f43f5e", on: true },
];

export default function GISMapPage() {
  const [active, setActive] = useState<Record<string, boolean>>(
    Object.fromEntries(layers.map((l) => [l.key, l.on]))
  );
  const [basemap, setBasemap] = useState<"dark" | "light" | "satellite">("dark");
  const [province, setProvince] = useState<string>("All");

  const provinces = ["All", ...Array.from(new Set(districts.map((d) => d.province)))];
  const filtered =
    province === "All" ? districts : districts.filter((d) => d.province === province);

  const toggle = (k: string) => setActive((a) => ({ ...a, [k]: !a[k] }));

  return (
    <div className="space-y-6">
      <PageHeader
        title="Interactive GIS Map"
        subtitle="Earth observation layers · risk heatmap · district intelligence"
        icon={MapIcon}
        actions={
          <div className="flex overflow-hidden rounded-xl border border-ink-200 dark:border-ink-800">
            {(["dark", "light", "satellite"] as const).map((b) => (
              <button
                key={b}
                onClick={() => setBasemap(b)}
                className={`px-3 py-2 text-xs font-medium capitalize transition ${
                  basemap === b ? "bg-brand-600 text-white" : "hover:bg-ink-100 dark:hover:bg-ink-800"
                }`}
              >
                {b}
              </button>
            ))}
          </div>
        }
      />

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-4">
        {/* Layer control panel */}
        <div className="space-y-4 lg:col-span-1">
          <Card className="!p-4">
            <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold">
              <Layers size={15} className="text-brand-500" /> Map Layers
            </h3>
            <div className="space-y-1.5">
              {layers.map((l) => {
                const Icon = l.icon;
                const on = active[l.key];
                return (
                  <button
                    key={l.key}
                    onClick={() => toggle(l.key)}
                    className="flex w-full items-center gap-3 rounded-lg px-2 py-2 text-left text-sm hover:bg-ink-100 dark:hover:bg-ink-800"
                  >
                    <span
                      className="grid h-7 w-7 shrink-0 place-items-center rounded-md"
                      style={{ backgroundColor: `${l.color}1a`, color: l.color }}
                    >
                      <Icon size={15} />
                    </span>
                    <span className="flex-1 font-medium">{l.label}</span>
                    <span
                      className={`relative h-5 w-9 rounded-full transition-colors ${
                        on ? "bg-brand-500" : "bg-ink-300 dark:bg-ink-700"
                      }`}
                    >
                      <span
                        className={`absolute top-0.5 h-4 w-4 rounded-full bg-white transition-all ${
                          on ? "left-4" : "left-0.5"
                        }`}
                      />
                    </span>
                  </button>
                );
              })}
            </div>
          </Card>

          <Card className="!p-4">
            <h3 className="mb-3 text-sm font-semibold">Filter by Province</h3>
            <select
              value={province}
              onChange={(e) => setProvince(e.target.value)}
              className="w-full rounded-lg border border-ink-200 bg-ink-50 px-3 py-2 text-sm outline-none focus:border-brand-400 dark:border-ink-800 dark:bg-ink-950"
            >
              {provinces.map((p) => (
                <option key={p}>{p}</option>
              ))}
            </select>

            <h3 className="mb-2 mt-4 text-sm font-semibold">Risk Legend</h3>
            <div className="space-y-1.5">
              {(["high", "moderate", "low"] as RiskLevel[]).map((r) => (
                <div key={r} className="flex items-center gap-2 text-sm">
                  <span className="h-3 w-3 rounded-full" style={{ backgroundColor: riskColor[r] }} />
                  {riskLabel[r]}
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Map + district list */}
        <div className="space-y-4 lg:col-span-3">
          <Card className="!p-3">
            <MapView
              showRisk={active.heatmap || active.ndvi}
              showSensors={active.sensors}
              showHeatmap={active.heatmap}
              basemap={basemap}
              height="520px"
            />
          </Card>

          <Card className="!p-0 overflow-hidden">
            <div className="border-b border-ink-200 p-4 dark:border-ink-800">
              <h3 className="text-sm font-semibold">
                Districts {province !== "All" && `· ${province}`}
                <span className="ml-2 text-ink-400">({filtered.length})</span>
              </h3>
            </div>
            <div className="max-h-72 overflow-y-auto">
              <table className="w-full text-sm">
                <thead className="sticky top-0 bg-ink-50 text-xs uppercase text-ink-400 dark:bg-ink-950">
                  <tr>
                    <th className="px-4 py-2 text-left font-medium">District</th>
                    <th className="px-4 py-2 text-left font-medium">Score</th>
                    <th className="hidden px-4 py-2 text-left font-medium sm:table-cell">NDVI</th>
                    <th className="hidden px-4 py-2 text-left font-medium sm:table-cell">LST</th>
                    <th className="px-4 py-2 text-left font-medium">Risk</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered
                    .sort((a, b) => b.vulnerabilityScore - a.vulnerabilityScore)
                    .map((d) => (
                      <tr
                        key={d.id}
                        className="border-t border-ink-100 hover:bg-ink-50 dark:border-ink-800 dark:hover:bg-ink-950"
                      >
                        <td className="px-4 py-2.5 font-medium">
                          {d.name}
                          <div className="text-xs text-ink-400">{d.province}</div>
                        </td>
                        <td className="px-4 py-2.5">
                          <span className="font-semibold" style={{ color: riskColor[d.risk] }}>
                            {d.vulnerabilityScore}
                          </span>
                        </td>
                        <td className="hidden px-4 py-2.5 sm:table-cell">{d.ndvi}</td>
                        <td className="hidden px-4 py-2.5 sm:table-cell">{d.lst}°C</td>
                        <td className="px-4 py-2.5">
                          <RiskBadge risk={d.risk} size="sm" />
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

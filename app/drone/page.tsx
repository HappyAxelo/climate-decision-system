"use client";

import { useState } from "react";
import { Plane, Upload, MapPin, Calendar, Layers, AlertTriangle, CheckCircle2, Loader2 } from "lucide-react";
import { droneMissions, riskColor } from "@/lib/mockData";
import { PageHeader, Card, SectionTitle, Chip, Progress } from "@/components/ui";

const statusChip: Record<string, "green" | "amber" | "blue"> = {
  completed: "green",
  processing: "amber",
  scheduled: "blue",
};

// Simulated crop-health heatmap tile
function HealthTile({ stress }: { stress: number }) {
  const bg = `radial-gradient(circle at 25% 30%, rgba(239,68,68,${stress / 100}), transparent 40%),
    radial-gradient(circle at 75% 65%, rgba(245,158,11,${stress / 140}), transparent 45%),
    linear-gradient(135deg, rgba(16,185,129,.55), rgba(5,150,105,.75))`;
  return <div className="h-full w-full" style={{ background: bg }} />;
}

export default function DronePage() {
  const [selected, setSelected] = useState(droneMissions[0]);
  const [uploaded, setUploaded] = useState<string[]>([]);

  const handleUpload = () => {
    const names = ["field_north_rgb.tif", "canopy_ndvi.png", "thermal_stress.jpg"];
    setUploaded((u) => [...u, names[u.length % names.length]]);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Drone Analytics"
        subtitle="Mission history · crop health · plant stress detection · field inspection"
        icon={Plane}
        actions={
          <button
            onClick={handleUpload}
            className="flex items-center gap-2 rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-700"
          >
            <Upload size={16} /> Upload Imagery
          </button>
        }
      />

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        {/* Mission list */}
        <div className="space-y-3 lg:col-span-1">
          <SectionTitle>Mission History</SectionTitle>
          {droneMissions.map((m, i) => {
            const active = selected.id === m.id;
            return (
              <button
                key={m.id}
                onClick={() => setSelected(m)}
                className={`surface w-full p-4 text-left transition ${
                  active ? "ring-1 ring-brand-500" : "hover:border-ink-300 dark:hover:border-ink-700"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-ink-400">{m.id}</span>
                  <Chip tone={statusChip[m.status]}>
                    {m.status === "completed" && <CheckCircle2 size={11} />}
                    {m.status === "processing" && <Loader2 size={11} className="animate-spin" />}
                    {m.status}
                  </Chip>
                </div>
                <h3 className="mt-1 text-sm font-semibold">{m.name}</h3>
                <div className="mt-1 flex items-center gap-3 text-xs text-ink-400">
                  <span className="flex items-center gap-1">
                    <MapPin size={11} /> {m.district}
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar size={11} /> {m.date}
                  </span>
                </div>
                <div className="mt-2 flex gap-2 text-xs">
                  <span className="text-ink-400">{m.area} ha</span>
                  {m.images > 0 && <span className="text-ink-400">· {m.images} images</span>}
                </div>
              </button>
            );
          })}
        </div>

        {/* Detail */}
        <div className="space-y-4 lg:col-span-2">
          <Card className="!p-0 overflow-hidden">
            <div className="relative h-64">
              {selected.status === "completed" ? (
                <HealthTile stress={selected.stressDetected} />
              ) : (
                <div className="grid h-full place-items-center bg-ink-100 text-sm text-ink-400 dark:bg-ink-900">
                  {selected.status === "processing" ? "Imagery processing…" : "Mission not yet flown"}
                </div>
              )}
              <div className="absolute left-3 top-3 flex gap-2">
                <span className="rounded-md bg-black/50 px-2 py-1 text-xs font-medium text-white">
                  {selected.name}
                </span>
              </div>
              {selected.status === "completed" && (
                <div className="absolute bottom-3 left-3 flex gap-2 text-xs">
                  <span className="rounded-md bg-emerald-500/80 px-2 py-1 font-medium text-white">Healthy canopy</span>
                  <span className="rounded-md bg-amber-500/80 px-2 py-1 font-medium text-white">Moderate stress</span>
                  <span className="rounded-md bg-rose-500/80 px-2 py-1 font-medium text-white">High stress</span>
                </div>
              )}
            </div>
          </Card>

          {selected.status === "completed" && (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Card>
                <SectionTitle>Crop Health Score</SectionTitle>
                <div className="text-3xl font-bold text-emerald-600">{selected.healthScore}%</div>
                <div className="mt-2">
                  <Progress value={selected.healthScore} color="#10b981" />
                </div>
                <p className="mt-2 text-xs text-ink-400">Canopy vigor from multispectral NDVI analysis.</p>
              </Card>
              <Card>
                <SectionTitle>Plant Stress Detected</SectionTitle>
                <div className="flex items-center gap-2 text-3xl font-bold" style={{ color: riskColor[selected.stressDetected > 30 ? "high" : "moderate"] }}>
                  <AlertTriangle size={26} /> {selected.stressDetected}%
                </div>
                <div className="mt-2">
                  <Progress value={selected.stressDetected} color={riskColor[selected.stressDetected > 30 ? "high" : "moderate"]} />
                </div>
                <p className="mt-2 text-xs text-ink-400">Water & nutrient stress across surveyed area.</p>
              </Card>
            </div>
          )}

          {/* Inspection report */}
          <Card>
            <SectionTitle>
              <span className="flex items-center gap-2">
                <Layers size={15} className="text-brand-500" /> Field Inspection Report
              </span>
            </SectionTitle>
            <ul className="space-y-2 text-sm">
              <li className="flex gap-2">
                <CheckCircle2 size={16} className="mt-0.5 shrink-0 text-emerald-500" />
                <span>Northern sector shows healthy vegetation with NDVI &gt; 0.6.</span>
              </li>
              <li className="flex gap-2">
                <AlertTriangle size={16} className="mt-0.5 shrink-0 text-amber-500" />
                <span>{selected.stressDetected}% of area flagged for water stress — recommend targeted irrigation.</span>
              </li>
              <li className="flex gap-2">
                <AlertTriangle size={16} className="mt-0.5 shrink-0 text-rose-500" />
                <span>South-eastern patch shows early pest/disease indicators — schedule ground inspection.</span>
              </li>
            </ul>
          </Card>

          {uploaded.length > 0 && (
            <Card>
              <SectionTitle>Recently Uploaded ({uploaded.length})</SectionTitle>
              <div className="flex flex-wrap gap-2">
                {uploaded.map((f, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-2 rounded-lg bg-ink-100 px-3 py-2 text-xs dark:bg-ink-800"
                  >
                    <Upload size={13} className="text-brand-500" /> {f}
                  </div>
                ))}
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}

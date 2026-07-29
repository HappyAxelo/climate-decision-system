"use client";

import { useState } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { Satellite, Layers, Radio, CheckCircle2, MoveHorizontal } from "lucide-react";
import { eoDatasets, fractionalCover, ndviTrend } from "@/lib/mockData";
import { PageHeader, Card, SectionTitle, Chip } from "@/components/ui";
import { TrendChart } from "@/components/Charts";

// Simulated NDVI raster (green = healthy, brown = stressed)
function NdviTile({ health }: { health: number }) {
  // health 0..1 controls green vs brown mix
  const bg = `radial-gradient(circle at 30% 30%, rgba(16,185,129,${0.2 + health * 0.6}), transparent 55%),
    radial-gradient(circle at 70% 60%, rgba(16,185,129,${0.1 + health * 0.5}), transparent 50%),
    radial-gradient(circle at 55% 80%, rgba(161,98,7,${0.5 - health * 0.35}), transparent 55%),
    linear-gradient(135deg, rgba(161,98,7,${0.6 - health * 0.4}), rgba(16,185,129,${0.15 + health * 0.35}))`;
  return <div className="h-full w-full" style={{ background: bg }} />;
}

function BeforeAfter() {
  const [pos, setPos] = useState(50);
  return (
    <div className="relative h-64 w-full select-none overflow-hidden rounded-xl">
      <div className="absolute inset-0">
        <NdviTile health={0.8} />
        <span className="absolute right-2 top-2 rounded-md bg-black/50 px-2 py-0.5 text-xs font-medium text-white">
          Apr 2026 · NDVI 0.61
        </span>
      </div>
      <div className="absolute inset-0 overflow-hidden" style={{ width: `${pos}%` }}>
        <div className="h-full" style={{ width: "100vw", maxWidth: 900 }}>
          <NdviTile health={0.25} />
        </div>
        <span className="absolute left-2 top-2 rounded-md bg-black/50 px-2 py-0.5 text-xs font-medium text-white">
          Jul 2026 · NDVI 0.34
        </span>
      </div>
      <div className="absolute inset-y-0" style={{ left: `${pos}%` }}>
        <div className="h-full w-0.5 bg-white shadow" />
        <div className="absolute top-1/2 grid h-7 w-7 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border border-ink-200 bg-white text-ink-500">
          <MoveHorizontal size={14} />
        </div>
      </div>
      <input
        type="range"
        min={0}
        max={100}
        value={pos}
        onChange={(e) => setPos(+e.target.value)}
        className="absolute inset-x-0 bottom-3 mx-auto w-11/12 cursor-pointer accent-brand-500"
      />
    </div>
  );
}

export default function EarthObservationPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Earth Observation"
        subtitle="Digital Earth Africa · Sentinel-2 · Landsat · NDVI · Fractional Cover · WOfS"
        icon={Satellite}
      />

      {/* Dataset connections */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {eoDatasets.map((d, i) => (
          <Card key={d.name} delay={i * 0.04} className="!p-4">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2.5">
                <span className="grid h-9 w-9 place-items-center rounded-lg bg-sky-500/10 text-sky-600">
                  <Radio size={16} />
                </span>
                <div>
                  <div className="text-sm font-semibold">{d.name}</div>
                  <div className="text-xs text-ink-400">{d.provider}</div>
                </div>
              </div>
              <Chip tone="green">
                <CheckCircle2 size={11} /> {d.status}
              </Chip>
            </div>
            <div className="mt-3 grid grid-cols-3 gap-2 text-center text-xs">
              <div className="rounded-lg bg-ink-50 py-1.5 dark:bg-ink-950">
                <div className="font-semibold">{d.resolution}</div>
                <div className="text-ink-400">resolution</div>
              </div>
              <div className="rounded-lg bg-ink-50 py-1.5 dark:bg-ink-950">
                <div className="font-semibold">{d.revisit}</div>
                <div className="text-ink-400">revisit</div>
              </div>
              <div className="rounded-lg bg-ink-50 py-1.5 dark:bg-ink-950">
                <div className="font-semibold">{d.lastPass}</div>
                <div className="text-ink-400">last pass</div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        {/* Before/after */}
        <Card className="lg:col-span-2">
          <SectionTitle action={<Chip tone="blue">Sentinel-2 L2A</Chip>}>
            <span className="flex items-center gap-2">
              <Layers size={15} className="text-brand-500" /> Before / After — Vegetation Change (Kirehe)
            </span>
          </SectionTitle>
          <BeforeAfter />
          <p className="mt-3 text-xs text-ink-400">
            Drag the slider to compare NDVI composites. A 44% decline in vegetation vigor detected over 3 months.
          </p>
        </Card>

        {/* Fractional cover pie */}
        <Card>
          <SectionTitle>Fractional Cover</SectionTitle>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={fractionalCover}
                dataKey="value"
                nameKey="name"
                innerRadius={50}
                outerRadius={80}
                paddingAngle={3}
              >
                {fractionalCover.map((c) => (
                  <Cell key={c.name} fill={c.color} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{ borderRadius: 12, border: "1px solid #e2e8f0", fontSize: 12 }}
                formatter={(v: number) => `${v}%`}
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="mt-2 space-y-1.5">
            {fractionalCover.map((c) => (
              <div key={c.name} className="flex items-center justify-between text-sm">
                <span className="flex items-center gap-2">
                  <span className="h-3 w-3 rounded-full" style={{ backgroundColor: c.color }} />
                  {c.name}
                </span>
                <span className="font-semibold">{c.value}%</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* NDVI time series */}
      <Card>
        <SectionTitle action={<Chip tone="blue">MODIS / Sentinel composite</Chip>}>
          NDVI Time-Series
        </SectionTitle>
        <TrendChart
          data={ndviTrend}
          xKey="month"
          type="area"
          height={240}
          series={[
            { key: "ndvi", color: "#10b981", name: "NDVI" },
            { key: "baseline", color: "#94a3b8", name: "10-yr baseline", dashed: true, fill: false },
          ]}
        />
      </Card>
    </div>
  );
}

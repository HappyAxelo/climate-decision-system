"use client";

import { useState, useEffect } from "react";
import { CloudRain, Thermometer, Droplets, Gauge, TrendingDown, TrendingUp } from "lucide-react";
import { forecastCards, seasonalOutlook, riskColor } from "@/lib/mockData";
import { PageHeader, Card, RiskBadge, Progress, SectionTitle, Trend, Chip } from "@/components/ui";
import { TrendChart } from "@/components/Charts";
import type { ForecastResult } from "@/lib/data/forecast";

const cardIcon: Record<string, any> = {
  rainfall: CloudRain,
  heatwave: Thermometer,
  soil: Droplets,
  wrsi: Gauge,
};

const initial: ForecastResult = {
  cards: forecastCards as ForecastResult["cards"],
  series: (seasonalOutlook as any[]).map((w) => ({ day: w.week, rainfall: w.forecast, prob: 50 })),
  confidence: [
    { label: "Rainfall", v: 78 },
    { label: "Temperature", v: 85 },
    { label: "Soil moisture", v: 83 },
    { label: "WRSI", v: 80 },
  ],
  summary: { text: "Loading live forecast…", trendingUp: true },
  live: false,
  source: "Loading…",
};

export default function ForecastPage() {
  const [fc, setFc] = useState<ForecastResult>(initial);

  useEffect(() => {
    fetch("/api/forecast")
      .then((r) => r.json())
      .then((d: ForecastResult) => setFc(d))
      .catch(() => {});
  }, []);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Climate Forecast"
        subtitle="16-day outlook · rainfall · heatwave probability · soil moisture · WRSI"
        icon={CloudRain}
        actions={<Chip tone={fc.live ? "green" : "default"}>{fc.live ? "Live" : "Sample"} · {fc.source}</Chip>}
      />

      {/* Forecast cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {fc.cards.map((c) => {
          const Icon = cardIcon[c.key];
          return (
            <Card key={c.key}>
              <div className="flex items-start justify-between">
                <span
                  className="grid h-10 w-10 place-items-center rounded-lg"
                  style={{ backgroundColor: `${riskColor[c.risk]}14`, color: riskColor[c.risk] }}
                >
                  <Icon size={19} />
                </span>
                <Trend value={c.trend} invert />
              </div>
              <div className="mt-3 text-2xl font-semibold">{c.value}</div>
              <div className="text-xs font-medium text-ink-500">{c.title}</div>
              <div className="mt-1 text-xs text-ink-400">{c.detail}</div>
              <div className="mt-3 flex items-center justify-between">
                <RiskBadge risk={c.risk} size="sm" />
                <span className="text-xs text-ink-400">{c.confidence}% conf.</span>
              </div>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        {/* Rainfall outlook chart */}
        <Card className="lg:col-span-2">
          <SectionTitle
            action={<span className="text-xs text-ink-400">Daily rainfall & chance of rain</span>}
          >
            16-Day Rainfall Outlook
          </SectionTitle>
          <TrendChart
            data={fc.series}
            xKey="day"
            type="area"
            height={280}
            series={[
              { key: "rainfall", color: "#0ea5e9", name: "Rainfall (mm)" },
              { key: "prob", color: "#94a3b8", name: "Rain chance (%)", fill: false, dashed: true },
            ]}
          />
        </Card>

        {/* Confidence + advisory */}
        <div className="space-y-4">
          <Card>
            <SectionTitle>Forecast Confidence</SectionTitle>
            {fc.confidence.map((f) => (
              <div key={f.label} className="mb-3">
                <div className="mb-1 flex justify-between text-xs">
                  <span className="text-ink-500">{f.label}</span>
                  <span className="font-semibold">{f.v}%</span>
                </div>
                <Progress value={f.v} color={f.v >= 80 ? "#10b981" : "#f59e0b"} />
              </div>
            ))}
          </Card>

          <Card className={`border-l-2 ${fc.summary.trendingUp ? "!border-l-amber-500" : "!border-l-emerald-500"}`}>
            <div className={`flex items-center gap-2 ${fc.summary.trendingUp ? "text-amber-600" : "text-emerald-600"}`}>
              {fc.summary.trendingUp ? <TrendingDown size={18} /> : <TrendingUp size={18} />}
              <h3 className="text-sm font-medium">Outlook summary</h3>
            </div>
            <p className="mt-2 text-sm text-ink-500">{fc.summary.text}</p>
            <div className="mt-3 flex items-center gap-2 text-xs">
              {fc.summary.trendingUp ? (
                <>
                  <TrendingUp size={14} className="text-rose-500" />
                  <span className="font-medium text-rose-500">Drought/heat risk trending up</span>
                </>
              ) : (
                <>
                  <TrendingUp size={14} className="text-emerald-500" />
                  <span className="font-medium text-emerald-600">Conditions stable</span>
                </>
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

"use client";

import { motion } from "framer-motion";
import { CloudRain, Thermometer, Droplets, Gauge, TrendingDown, TrendingUp } from "lucide-react";
import { forecastCards, seasonalOutlook, riskColor } from "@/lib/mockData";
import { PageHeader, Card, RiskBadge, Progress, SectionTitle, Trend } from "@/components/ui";
import { TrendChart } from "@/components/Charts";

const cardIcon: Record<string, any> = {
  rainfall: CloudRain,
  heatwave: Thermometer,
  soil: Droplets,
  wrsi: Gauge,
};

export default function ForecastPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Climate Forecast"
        subtitle="Seasonal outlook · heatwave probability · WRSI · forecast confidence"
        icon={CloudRain}
        actions={
          <div className="flex overflow-hidden rounded-xl border border-ink-200 dark:border-ink-800">
            {["7 days", "30 days", "Season"].map((t, i) => (
              <button
                key={t}
                className={`px-3 py-2 text-xs font-medium ${
                  i === 1 ? "bg-brand-600 text-white" : "hover:bg-ink-100 dark:hover:bg-ink-800"
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        }
      />

      {/* Forecast cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {forecastCards.map((c, i) => {
          const Icon = cardIcon[c.key];
          return (
            <Card key={c.key} delay={i * 0.05}>
              <div className="flex items-start justify-between">
                <span
                  className="grid h-10 w-10 place-items-center rounded-xl"
                  style={{ backgroundColor: `${riskColor[c.risk]}1a`, color: riskColor[c.risk] }}
                >
                  <Icon size={19} />
                </span>
                <Trend value={c.trend} invert />
              </div>
              <div className="mt-3 text-2xl font-bold">{c.value}</div>
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
        {/* Seasonal outlook chart */}
        <Card className="lg:col-span-2">
          <SectionTitle
            action={<span className="text-xs text-ink-400">12-week probabilistic forecast</span>}
          >
            Seasonal Rainfall Outlook
          </SectionTitle>
          <TrendChart
            data={seasonalOutlook}
            xKey="week"
            type="area"
            unit="mm"
            height={280}
            series={[
              { key: "upper", color: "#93c5fd", name: "Upper bound" },
              { key: "forecast", color: "#0ea5e9", name: "Forecast" },
              { key: "lower", color: "#93c5fd", name: "Lower bound", fill: false, dashed: true },
            ]}
          />
        </Card>

        {/* Confidence + advisory */}
        <div className="space-y-4">
          <Card>
            <SectionTitle>Forecast Confidence</SectionTitle>
            {[
              { label: "Rainfall", v: 78 },
              { label: "Temperature", v: 85 },
              { label: "Soil moisture", v: 83 },
              { label: "WRSI", v: 80 },
            ].map((f) => (
              <div key={f.label} className="mb-3">
                <div className="mb-1 flex justify-between text-xs">
                  <span className="text-ink-500">{f.label}</span>
                  <span className="font-semibold">{f.v}%</span>
                </div>
                <Progress value={f.v} color={f.v >= 80 ? "#10b981" : "#f59e0b"} />
              </div>
            ))}
          </Card>

          <Card className="border-l-2 !border-l-amber-500">
            <div className="flex items-center gap-2 text-amber-600">
              <TrendingDown size={18} />
              <h3 className="text-sm font-medium">Season B outlook</h3>
            </div>
            <p className="mt-2 text-sm text-ink-500">
              Below-normal rainfall (−28%) combined with rising heatwave probability signals
              elevated drought risk across the Eastern Province. Early mitigation strongly advised.
            </p>
            <div className="mt-3 flex items-center gap-2 text-xs">
              <TrendingUp size={14} className="text-rose-500" />
              <span className="font-medium text-rose-500">Drought risk trending up</span>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

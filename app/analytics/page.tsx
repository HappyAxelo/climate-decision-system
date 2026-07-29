"use client";

import { BarChart3, Leaf, CloudRain, Thermometer, Droplets, Waves, TrendingUp } from "lucide-react";
import {
  ndviTrend,
  rainfallTrend,
  tempAnomaly,
  soilMoistureTrend,
  waterAvailability,
  riskPrediction,
} from "@/lib/mockData";
import { PageHeader, Card, SectionTitle } from "@/components/ui";
import { TrendChart, AnomalyChart } from "@/components/Charts";

function ChartCard({
  title,
  icon: Icon,
  subtitle,
  children,
  delay = 0,
}: {
  title: string;
  icon: any;
  subtitle: string;
  children: React.ReactNode;
  delay?: number;
}) {
  return (
    <Card delay={delay}>
      <div className="mb-4 flex items-center gap-2.5">
        <span className="grid h-9 w-9 place-items-center rounded-lg bg-brand-500/10 text-brand-600">
          <Icon size={17} />
        </span>
        <div>
          <h3 className="text-sm font-semibold">{title}</h3>
          <p className="text-xs text-ink-400">{subtitle}</p>
        </div>
      </div>
      {children}
    </Card>
  );
}

export default function AnalyticsPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Analytics"
        subtitle="Historical trends, anomalies & AI risk prediction"
        icon={BarChart3}
        actions={
          <button className="rounded-xl border border-ink-200 px-3 py-2 text-sm font-medium hover:bg-ink-100 dark:border-ink-800 dark:hover:bg-ink-800">
            Export CSV
          </button>
        }
      />

      <SectionTitle>Vegetation & Rainfall</SectionTitle>
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <ChartCard title="NDVI Trend" subtitle="Vegetation health vs baseline" icon={Leaf}>
          <TrendChart
            data={ndviTrend}
            xKey="month"
            type="area"
            series={[
              { key: "ndvi", color: "#10b981", name: "NDVI" },
              { key: "baseline", color: "#94a3b8", name: "Baseline", dashed: true, fill: false },
            ]}
          />
        </ChartCard>
        <ChartCard title="Rainfall Trend" subtitle="Monthly rainfall vs normal (mm)" icon={CloudRain} delay={0.05}>
          <TrendChart
            data={rainfallTrend}
            xKey="month"
            type="bar"
            series={[
              { key: "rainfall", color: "#0ea5e9", name: "Actual" },
              { key: "normal", color: "#cbd5e1", name: "Normal" },
            ]}
          />
        </ChartCard>
      </div>

      <SectionTitle>Temperature & Soil</SectionTitle>
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <ChartCard title="Temperature Anomalies" subtitle="Deviation from 30-yr mean (°C)" icon={Thermometer}>
          <AnomalyChart data={tempAnomaly} />
        </ChartCard>
        <ChartCard title="Soil Moisture Trend" subtitle="Volumetric water content (%)" icon={Droplets} delay={0.05}>
          <TrendChart
            data={soilMoistureTrend}
            xKey="month"
            type="area"
            unit="%"
            series={[{ key: "moisture", color: "#3b82f6", name: "Soil moisture" }]}
          />
        </ChartCard>
      </div>

      <SectionTitle>Water & Risk Prediction</SectionTitle>
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <ChartCard title="Water Availability" subtitle="Reservoir & surface water index (%)" icon={Waves}>
          <TrendChart
            data={waterAvailability}
            xKey="month"
            type="area"
            unit="%"
            series={[{ key: "level", color: "#06b6d4", name: "Availability" }]}
          />
        </ChartCard>
        <ChartCard title="AI Risk Prediction Timeline" subtitle="Predicted multi-hazard risk & model confidence" icon={TrendingUp} delay={0.05}>
          <TrendChart
            data={riskPrediction}
            xKey="month"
            type="line"
            series={[
              { key: "predicted", color: "#ef4444", name: "Predicted risk" },
              { key: "confidence", color: "#10b981", name: "Confidence" },
            ]}
          />
        </ChartCard>
      </div>
    </div>
  );
}

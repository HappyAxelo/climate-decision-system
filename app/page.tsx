"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import {
  Droplets,
  Wind,
  Sun,
  CloudRain,
  Cloud,
  Gauge,
  Thermometer,
  Brain,
  ArrowRight,
  MapPin,
  Sprout,
  Users2,
  Radio,
  Layers,
} from "lucide-react";
import {
  overviewMetrics,
  weather,
  recommendations,
  alerts,
  kpis,
  riskColor,
} from "@/lib/mockData";
import { Card, RiskBadge, Trend, Sparkline, PageHeader, Chip, SectionTitle } from "@/components/ui";

const MapView = dynamic(() => import("@/components/MapView"), { ssr: false });

const weatherIcon: Record<string, typeof Sun> = { sun: Sun, cloud: Cloud, rain: CloudRain };

const metricIcon: Record<string, typeof Sun> = {
  drought: Sun,
  heatwave: Thermometer,
  soil: Droplets,
  vegetation: Sprout,
  water: CloudRain,
};

export default function Dashboard() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="National Overview"
        subtitle="Rwanda · Season B 2026 · last 30 days"
        icon={Layers}
        actions={
          <>
            <button className="rounded-lg border border-ink-200 px-3 py-2 text-sm font-medium hover:bg-ink-100 dark:border-ink-800 dark:hover:bg-ink-800">
              Last 30 days
            </button>
            <button className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-700">
              Generate report
            </button>
          </>
        }
      />

      {/* KPI strip */}
      <div className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-6">
        {[
          { label: "Districts", value: kpis.districtsMonitored, icon: MapPin },
          { label: "Active sensors", value: kpis.activeSensors, icon: Radio },
          { label: "Active alerts", value: kpis.activeAlerts, icon: Brain },
          { label: "Farmers reached", value: `${(kpis.farmersReached / 1000).toFixed(0)}k`, icon: Users2 },
          { label: "Hectares", value: `${(kpis.hectaresMonitored / 1e6).toFixed(2)}M`, icon: Layers },
          { label: "Drone missions", value: kpis.droneMissions, icon: Sprout },
        ].map((k) => (
          <div key={k.label} className="surface flex items-center gap-3 p-3.5">
            <div className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-ink-100 text-ink-500 dark:bg-ink-800 dark:text-ink-400">
              <k.icon size={17} />
            </div>
            <div className="min-w-0">
              <div className="text-lg font-semibold leading-none">{k.value}</div>
              <div className="mt-1 truncate text-[11px] text-ink-400">{k.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Metric cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-5">
        {overviewMetrics.map((m) => {
          const Icon = metricIcon[m.key] ?? Sun;
          return (
            <Card key={m.key} className="!p-4">
              <div className="flex items-start justify-between">
                <div className="grid h-9 w-9 place-items-center rounded-lg" style={{ backgroundColor: `${riskColor[m.risk]}14`, color: riskColor[m.risk] }}>
                  <Icon size={18} />
                </div>
                <Trend value={m.trend} />
              </div>
              <div className="mt-3 flex items-baseline gap-1">
                <span className="text-2xl font-semibold">{m.value}</span>
                {m.unit && <span className="text-sm text-ink-400">{m.unit}</span>}
              </div>
              <div className="mt-0.5 text-xs text-ink-500">{m.title}</div>
              <div className="mt-2">
                <Sparkline data={m.spark} color={riskColor[m.risk]} />
              </div>
              <div className="mt-2">
                <RiskBadge risk={m.risk} size="sm" />
              </div>
            </Card>
          );
        })}
      </div>

      {/* Main grid: map + weather */}
      <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
        <Card className="xl:col-span-2 !p-0 overflow-hidden">
          <div className="flex items-center justify-between p-5 pb-3">
            <div>
              <h2 className="font-semibold">Multi-hazard risk map</h2>
              <p className="text-xs text-ink-400">Vulnerability score by district</p>
            </div>
            <Link href="/map" className="flex items-center gap-1 text-sm font-medium text-brand-600 hover:underline">
              Open GIS <ArrowRight size={14} />
            </Link>
          </div>
          <div className="px-4 pb-4">
            <MapView showRisk showHeatmap height="380px" />
          </div>
        </Card>

        {/* Weather widget */}
        <Card className="!p-0 overflow-hidden">
          <div className="border-b border-ink-200 p-5 dark:border-ink-800">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-1.5 text-sm font-medium text-ink-500">
                  <MapPin size={14} /> {weather.location}
                </div>
                <div className="mt-3 flex items-center gap-2">
                  <span className="text-5xl font-semibold">{weather.temp}°</span>
                  <div className="text-sm text-ink-500">
                    <div>{weather.condition}</div>
                    <div className="text-ink-400">Feels {weather.feelsLike}°</div>
                  </div>
                </div>
              </div>
              <Sun size={44} className="text-amber-400" />
            </div>
            <div className="mt-4 grid grid-cols-3 gap-2 text-xs text-ink-500">
              <div className="surface-muted flex items-center gap-1.5 p-2">
                <Droplets size={14} className="text-sky-500" /> {weather.humidity}%
              </div>
              <div className="surface-muted flex items-center gap-1.5 p-2">
                <Wind size={14} className="text-ink-400" /> {weather.wind} km/h
              </div>
              <div className="surface-muted flex items-center gap-1.5 p-2">
                <Gauge size={14} className="text-ink-400" /> UV {weather.uv}
              </div>
            </div>
          </div>
          <div className="grid grid-cols-5 gap-1 p-3">
            {weather.forecast.map((f) => {
              const WIcon = weatherIcon[f.icon];
              return (
                <div key={f.day} className="rounded-lg px-1 py-2 text-center hover:bg-ink-100 dark:hover:bg-ink-800">
                  <div className="text-[11px] font-medium text-ink-400">{f.day}</div>
                  <WIcon size={18} className="mx-auto my-1.5 text-ink-400" />
                  <div className="text-xs font-semibold">{f.hi}°</div>
                  <div className="text-[11px] text-ink-400">{f.lo}°</div>
                  <div className="mt-1 text-[10px] text-sky-500">{f.rain}%</div>
                </div>
              );
            })}
          </div>
        </Card>
      </div>

      {/* AI recommendations + alerts */}
      <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
        <div className="xl:col-span-2">
          <SectionTitle
            action={
              <Link href="/decision-support" className="text-xs font-medium text-brand-600 hover:underline">
                View all
              </Link>
            }
          >
            Recommendations
          </SectionTitle>
          <div className="space-y-3">
            {recommendations.slice(0, 4).map((r) => (
              <div key={r.id} className="surface flex items-start gap-4 p-4">
                <div className="mt-0.5 grid h-9 w-9 shrink-0 place-items-center rounded-lg" style={{ backgroundColor: `${riskColor[r.risk]}14`, color: riskColor[r.risk] }}>
                  <Brain size={17} />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="font-medium">{r.title}</h3>
                    <RiskBadge risk={r.risk} size="sm" />
                  </div>
                  <p className="mt-1 text-sm text-ink-500">{r.detail}</p>
                  <div className="mt-2.5 flex flex-wrap items-center gap-2 text-xs">
                    <Chip>{r.action}</Chip>
                    <span className="text-ink-400">{r.confidence}% confidence · {r.impact}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent alerts */}
        <div>
          <SectionTitle
            action={
              <Link href="/alerts" className="text-xs font-medium text-brand-600 hover:underline">
                View all
              </Link>
            }
          >
            Recent alerts
          </SectionTitle>
          <div className="space-y-3">
            {alerts.slice(0, 5).map((a) => (
              <div key={a.id} className="surface p-3.5">
                <div className="flex items-center justify-between">
                  <RiskBadge risk={a.severity} size="sm" />
                  <span className="text-[11px] text-ink-400">{a.time}</span>
                </div>
                <h4 className="mt-2 text-sm font-medium">{a.title}</h4>
                <div className="mt-0.5 flex items-center gap-1 text-xs text-ink-400">
                  <MapPin size={11} /> {a.district}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

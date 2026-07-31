"use client";

import { useState } from "react";
import {
  Brain,
  Sprout,
  Droplets,
  Wheat,
  Beef,
  Waves,
  Eye,
  CheckCircle2,
  Clock,
  MapPin,
} from "lucide-react";
import { recommendations, riskColor, RiskLevel } from "@/lib/mockData";
import { PageHeader, RiskBadge, Card, Chip, Progress } from "@/components/ui";

const categoryIcon: Record<string, any> = {
  planting: Sprout,
  irrigation: Droplets,
  seeds: Wheat,
  livestock: Beef,
  water: Waves,
  monitoring: Eye,
};

const filters: { key: string; label: string }[] = [
  { key: "all", label: "All" },
  { key: "high", label: "High Risk" },
  { key: "moderate", label: "Moderate" },
  { key: "planting", label: "Planting" },
  { key: "irrigation", label: "Irrigation" },
  { key: "livestock", label: "Livestock" },
];

export default function DecisionSupportPage() {
  const [filter, setFilter] = useState("all");
  const [done, setDone] = useState<Record<string, boolean>>({});

  const list = recommendations.filter((r) => {
    if (filter === "all") return true;
    if (filter === "high" || filter === "moderate") return r.risk === filter;
    return r.category === filter;
  });

  return (
    <div className="space-y-6">
      <PageHeader
        title="AI Decision Support"
        subtitle="Actionable recommendations generated from combined climate, satellite & IoT signals"
        icon={Brain}
      />

      {/* How it works banner */}
      <Card className="!p-5">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="grid h-11 w-11 place-items-center rounded-lg bg-ink-100 text-ink-500 dark:bg-ink-800 dark:text-ink-400">
              <Brain size={22} />
            </div>
            <div>
              <h3 className="font-medium">Recommendations engine</h3>
              <p className="text-sm text-ink-500">
                Satellite, forecast and IoT inputs ranked into confidence-scored decisions.
              </p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2 text-xs">
            <Chip>6 active</Chip>
            <Chip tone="amber">3 high priority</Chip>
            <Chip>Updated 4 min ago</Chip>
          </div>
        </div>
      </Card>

      {/* Filters */}
      <div className="flex flex-wrap gap-2">
        {filters.map((f) => (
          <button
            key={f.key}
            onClick={() => setFilter(f.key)}
            className={`rounded-full px-4 py-1.5 text-sm font-medium transition ${
              filter === f.key
                ? "bg-brand-600 text-white"
                : "border border-ink-200 hover:bg-ink-100 dark:border-ink-800 dark:hover:bg-ink-800"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Recommendations grid */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {list.map((r, i) => {
          const Icon = categoryIcon[r.category];
          const complete = done[r.id];
          return (
            <div
              key={r.id}
              className={`surface p-5 ${complete ? "opacity-60" : ""}`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className="grid h-11 w-11 place-items-center rounded-xl text-white"
                    style={{ backgroundColor: riskColor[r.risk] }}
                  >
                    <Icon size={20} />
                  </div>
                  <div>
                    <h3 className="font-semibold leading-tight">{r.title}</h3>
                    <div className="mt-1 flex items-center gap-1 text-xs text-ink-400">
                      <MapPin size={11} /> {r.district}
                    </div>
                  </div>
                </div>
                <RiskBadge risk={r.risk} size="sm" />
              </div>

              <p className="mt-3 text-sm text-ink-500">{r.detail}</p>

              <div className="mt-4 rounded-xl bg-ink-50 p-3 dark:bg-ink-950">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold uppercase tracking-wide text-ink-400">Recommended action</span>
                  <span className="font-medium text-ink-500">{r.impact}</span>
                </div>
                <div className="mt-1.5 text-sm font-semibold text-brand-600">→ {r.action}</div>
              </div>

              <div className="mt-4">
                <div className="mb-1 flex items-center justify-between text-xs">
                  <span className="text-ink-400">Model confidence</span>
                  <span className="font-semibold">{r.confidence}%</span>
                </div>
                <Progress value={r.confidence} color={riskColor[r.risk]} />
              </div>

              <div className="mt-4 flex gap-2">
                <button
                  onClick={() => setDone((d) => ({ ...d, [r.id]: !d[r.id] }))}
                  className={`flex flex-1 items-center justify-center gap-1.5 rounded-xl px-3 py-2 text-sm font-semibold transition ${
                    complete
                      ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-400"
                      : "bg-brand-600 text-white hover:bg-brand-700"
                  }`}
                >
                  {complete ? <CheckCircle2 size={16} /> : <Clock size={16} />}
                  {complete ? "Actioned" : "Mark as actioned"}
                </button>
                <button className="rounded-xl border border-ink-200 px-3 py-2 text-sm font-medium hover:bg-ink-100 dark:border-ink-800 dark:hover:bg-ink-800">
                  Details
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

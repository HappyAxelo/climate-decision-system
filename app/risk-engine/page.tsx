"use client";

import { motion } from "framer-motion";
import { ShieldAlert, Satellite, CloudRain, Cpu, ArrowRight } from "lucide-react";
import {
  riskLayers,
  districts,
  riskColor,
  riskLabel,
  RiskLevel,
} from "@/lib/mockData";
import { PageHeader, Card, RiskBadge, Progress, SectionTitle } from "@/components/ui";

const layerIcon: Record<string, any> = {
  "Satellite Observations": Satellite,
  "Climate Model Outputs": CloudRain,
  "IoT Sensor Data": Cpu,
};

function Gauge({ score, risk }: { score: number; risk: RiskLevel }) {
  const r = 70;
  const circ = Math.PI * r; // half circle
  const offset = circ - (score / 100) * circ;
  return (
    <div className="relative mx-auto w-[200px]">
      <svg viewBox="0 0 200 110" className="w-full">
        <path d="M 20 100 A 80 80 0 0 1 180 100" fill="none" stroke="#e2e8f0" strokeWidth="16" strokeLinecap="round" />
        <motion.path
          d="M 20 100 A 80 80 0 0 1 180 100"
          fill="none"
          stroke={riskColor[risk]}
          strokeWidth="16"
          strokeLinecap="round"
          strokeDasharray={circ}
          initial={{ strokeDashoffset: circ }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1.2, ease: "easeOut" }}
        />
      </svg>
      <div className="absolute inset-x-0 bottom-0 text-center">
        <div className="text-4xl font-bold" style={{ color: riskColor[risk] }}>
          {score}
        </div>
        <div className="text-xs font-medium text-ink-400">/ 100 Vulnerability</div>
      </div>
    </div>
  );
}

export default function RiskEnginePage() {
  const weighted = Math.round(
    riskLayers.reduce((s, l) => s + (l.signal * l.weight) / 100, 0)
  );
  const overallRisk: RiskLevel = weighted >= 70 ? "high" : weighted >= 45 ? "moderate" : "low";

  const counts = {
    high: districts.filter((d) => d.risk === "high").length,
    moderate: districts.filter((d) => d.risk === "moderate").length,
    low: districts.filter((d) => d.risk === "low").length,
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Multi-Hazard Risk Engine"
        subtitle="Fusing satellite, climate & IoT signals into one Vulnerability Score"
        icon={ShieldAlert}
      />

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        {/* Score gauge */}
        <Card className="lg:col-span-1">
          <SectionTitle>National Vulnerability Score</SectionTitle>
          <Gauge score={weighted} risk={overallRisk} />
          <div className="mt-4 flex justify-center">
            <RiskBadge risk={overallRisk} />
          </div>
          <div className="mt-5 grid grid-cols-3 gap-2 text-center">
            {(["high", "moderate", "low"] as RiskLevel[]).map((r) => (
              <div key={r} className="rounded-xl p-2" style={{ backgroundColor: `${riskColor[r]}12` }}>
                <div className="text-xl font-bold" style={{ color: riskColor[r] }}>
                  {counts[r]}
                </div>
                <div className="text-[11px] text-ink-400">{riskLabel[r]}</div>
              </div>
            ))}
          </div>
        </Card>

        {/* Input layers */}
        <Card className="lg:col-span-2">
          <SectionTitle>Data Fusion — Input Layers</SectionTitle>
          <div className="space-y-4">
            {riskLayers.map((l, i) => {
              const Icon = layerIcon[l.name];
              const sig: RiskLevel = l.signal >= 75 ? "high" : l.signal >= 50 ? "moderate" : "low";
              return (
                <div key={l.name}>
                  <div className="mb-1.5 flex items-center gap-3">
                    <span className="grid h-9 w-9 place-items-center rounded-lg bg-ink-100 text-ink-600 dark:bg-ink-800 dark:text-ink-300">
                      <Icon size={17} />
                    </span>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-semibold">{l.name}</span>
                        <span className="text-sm font-bold" style={{ color: riskColor[sig] }}>
                          {l.signal}
                        </span>
                      </div>
                      <div className="text-xs text-ink-400">{l.source}</div>
                    </div>
                    <span className="rounded-md bg-ink-100 px-2 py-0.5 text-xs font-medium text-ink-500 dark:bg-ink-800">
                      weight {l.weight}%
                    </span>
                  </div>
                  <Progress value={l.signal} color={riskColor[sig]} />
                </div>
              );
            })}
          </div>

          <div className="mt-5 flex items-center justify-center gap-2 rounded-xl bg-ink-50 p-3 text-sm dark:bg-ink-950">
            <span className="text-ink-400">Weighted fusion</span>
            <ArrowRight size={15} className="text-brand-500" />
            <span className="font-bold" style={{ color: riskColor[overallRisk] }}>
              Vulnerability Score {weighted}
            </span>
          </div>
        </Card>
      </div>

      {/* District ranking */}
      <Card className="!p-0 overflow-hidden">
        <div className="border-b border-ink-200 p-4 dark:border-ink-800">
          <h3 className="text-sm font-semibold">District Vulnerability Ranking</h3>
        </div>
        <div className="divide-y divide-ink-100 dark:divide-ink-800">
          {districts
            .slice()
            .sort((a, b) => b.vulnerabilityScore - a.vulnerabilityScore)
            .map((d, i) => (
              <div
                key={d.id}
                className="flex items-center gap-4 px-4 py-3 hover:bg-ink-50 dark:hover:bg-ink-950"
              >
                <div className="w-6 text-center text-sm font-bold text-ink-300">{i + 1}</div>
                <div className="w-32 shrink-0">
                  <div className="text-sm font-semibold">{d.name}</div>
                  <div className="text-xs text-ink-400">{d.province}</div>
                </div>
                <div className="flex-1">
                  <Progress value={d.vulnerabilityScore} color={riskColor[d.risk]} />
                </div>
                <div className="w-10 text-right text-sm font-bold" style={{ color: riskColor[d.risk] }}>
                  {d.vulnerabilityScore}
                </div>
                <div className="hidden w-28 justify-end sm:flex">
                  <RiskBadge risk={d.risk} size="sm" />
                </div>
              </div>
            ))}
        </div>
      </Card>
    </div>
  );
}

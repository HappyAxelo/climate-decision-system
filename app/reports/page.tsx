"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  FileText,
  Download,
  Plus,
  FileCheck2,
  Loader2,
  Map,
  BarChart3,
  Brain,
  TrendingUp,
  X,
} from "lucide-react";
import { reports, recommendations, districts, riskColor } from "@/lib/mockData";
import { PageHeader, Card, Chip, SectionTitle } from "@/components/ui";

const typeColor: Record<string, "green" | "amber" | "blue" | "red"> = {
  "Risk Summary": "red",
  Recommendation: "green",
  Vulnerability: "amber",
  Analytics: "blue",
};

const includes = [
  { icon: TrendingUp, label: "Risk summary" },
  { icon: Brain, label: "AI recommendations" },
  { icon: Map, label: "Maps" },
  { icon: BarChart3, label: "Charts" },
  { icon: FileText, label: "Historical trends" },
];

export default function ReportsPage() {
  const [preview, setPreview] = useState(false);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Reports"
        subtitle="Generate downloadable PDF briefings for governments, researchers & field teams"
        icon={FileText}
        actions={
          <button
            onClick={() => setPreview(true)}
            className="flex items-center gap-2 rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-700"
          >
            <Plus size={16} /> New Report
          </button>
        }
      />

      {/* What's included */}
      <Card className="!p-5">
        <SectionTitle>Each report includes</SectionTitle>
        <div className="flex flex-wrap gap-3">
          {includes.map((inc) => (
            <div key={inc.label} className="flex items-center gap-2 rounded-xl bg-white px-3 py-2 text-sm font-medium shadow-card dark:bg-ink-900">
              <inc.icon size={16} className="text-brand-500" />
              {inc.label}
            </div>
          ))}
        </div>
      </Card>

      {/* Report list */}
      <Card className="!p-0 overflow-hidden">
        <div className="border-b border-ink-200 p-4 dark:border-ink-800">
          <h3 className="text-sm font-semibold">Generated Reports</h3>
        </div>
        <div className="divide-y divide-ink-100 dark:divide-ink-800">
          {reports.map((r, i) => (
            <div
              key={r.id}
              className="flex items-center gap-4 px-4 py-3.5 hover:bg-ink-50 dark:hover:bg-ink-950"
            >
              <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-rose-500/10 text-rose-500">
                <FileText size={18} />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h4 className="truncate text-sm font-semibold">{r.title}</h4>
                  <Chip tone={typeColor[r.type] ?? "blue"}>{r.type}</Chip>
                </div>
                <div className="mt-0.5 text-xs text-ink-400">
                  {r.id} · {r.date} · {r.pages} pages · {r.author}
                </div>
              </div>
              {r.status === "ready" ? (
                <button
                  onClick={() => setPreview(true)}
                  className="flex items-center gap-1.5 rounded-lg border border-ink-200 px-3 py-1.5 text-xs font-semibold hover:bg-ink-100 dark:border-ink-800 dark:hover:bg-ink-800"
                >
                  <Download size={13} /> PDF
                </button>
              ) : (
                <span className="flex items-center gap-1.5 text-xs font-medium text-amber-600">
                  <Loader2 size={13} className="animate-spin" /> Generating
                </span>
              )}
            </div>
          ))}
        </div>
      </Card>

      {/* Report preview modal */}
      {preview && <ReportPreview onClose={() => setPreview(false)} />}
    </div>
  );
}

function ReportPreview({ onClose }: { onClose: () => void }) {
  const top = districts.slice().sort((a, b) => b.vulnerabilityScore - a.vulnerabilityScore).slice(0, 5);
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, y: 12 }}
        animate={{ scale: 1, y: 0 }}
        onClick={(e) => e.stopPropagation()}
        className="max-h-[85vh] w-full max-w-2xl overflow-y-auto rounded-xl border border-ink-200 bg-white shadow-xl dark:border-ink-800 dark:bg-ink-900"
      >
        {/* Report header */}
        <div className="sticky top-0 flex items-center justify-between border-b border-ink-200 bg-white p-4 dark:border-ink-800 dark:bg-ink-900">
          <div className="flex items-center gap-2 text-sm font-semibold">
            <FileCheck2 size={18} className="text-brand-500" /> Report Preview
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => window.print()}
              className="flex items-center gap-1.5 rounded-lg bg-brand-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-brand-700"
            >
              <Download size={13} /> Download PDF
            </button>
            <button onClick={onClose} className="grid h-8 w-8 place-items-center rounded-lg hover:bg-ink-100 dark:hover:bg-ink-800">
              <X size={16} />
            </button>
          </div>
        </div>

        {/* Report body */}
        <div className="space-y-5 p-6">
          <div className="border-b border-ink-200 pb-4 dark:border-ink-800">
            <div className="text-xs font-semibold uppercase tracking-wider text-brand-600">
              CAIP · Climate Action Intelligence Platform
            </div>
            <h1 className="mt-1 text-2xl font-bold">Eastern Province Drought Risk Assessment</h1>
            <p className="mt-1 text-sm text-ink-400">Generated 2026-07-29 · Season B · AI Engine</p>
          </div>

          <section>
            <h2 className="mb-2 text-sm font-semibold uppercase tracking-wide text-ink-500">1. Risk Summary</h2>
            <p className="text-sm text-ink-600 dark:text-ink-300">
              National vulnerability score stands at <b>74/100 (High)</b>, driven by a −28% seasonal
              rainfall deficit and declining soil moisture across the Eastern Province. Immediate
              intervention is advised for 3 high-risk districts.
            </p>
          </section>

          <section>
            <h2 className="mb-2 text-sm font-semibold uppercase tracking-wide text-ink-500">2. Top At-Risk Districts</h2>
            <table className="w-full text-sm">
              <thead className="text-xs uppercase text-ink-400">
                <tr>
                  <th className="py-1 text-left">District</th>
                  <th className="py-1 text-left">Score</th>
                  <th className="py-1 text-left">NDVI</th>
                  <th className="py-1 text-left">Soil</th>
                </tr>
              </thead>
              <tbody>
                {top.map((d) => (
                  <tr key={d.id} className="border-t border-ink-100 dark:border-ink-800">
                    <td className="py-1.5 font-medium">{d.name}</td>
                    <td className="py-1.5 font-semibold" style={{ color: riskColor[d.risk] }}>{d.vulnerabilityScore}</td>
                    <td className="py-1.5">{d.ndvi}</td>
                    <td className="py-1.5">{d.soilMoisture}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>

          <section>
            <h2 className="mb-2 text-sm font-semibold uppercase tracking-wide text-ink-500">3. AI Recommendations</h2>
            <ul className="space-y-2">
              {recommendations.slice(0, 4).map((r) => (
                <li key={r.id} className="flex gap-2 text-sm">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full" style={{ backgroundColor: riskColor[r.risk] }} />
                  <span>
                    <b>{r.title}:</b> {r.action} — <span className="text-ink-400">{r.impact} ({r.confidence}% conf.)</span>
                  </span>
                </li>
              ))}
            </ul>
          </section>

          <div className="rounded-xl bg-ink-50 p-3 text-xs text-ink-400 dark:bg-ink-950">
            This report was auto-generated by the CAIP AI engine from Sentinel-2, Landsat and IoT
            sensor data sources. For decision support only.
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  BellRing,
  Sun,
  Thermometer,
  Droplets,
  Waves,
  Cpu,
  MapPin,
  Mail,
  MessageSquare,
  Smartphone,
  Check,
} from "lucide-react";
import { alerts as seedAlerts, Alert, riskColor } from "@/lib/mockData";
import { PageHeader, Card, RiskBadge, Chip, SectionTitle } from "@/components/ui";

const typeIcon: Record<string, any> = {
  drought: Sun,
  heatwave: Thermometer,
  soil: Droplets,
  flood: Waves,
  sensor: Cpu,
};

const typeLabel: Record<string, string> = {
  drought: "Drought",
  heatwave: "Heatwave",
  soil: "Low Soil Moisture",
  flood: "Flood Risk",
  sensor: "Sensor Failure",
};

const channelIcon = { sms: MessageSquare, email: Mail, push: Smartphone };

export default function AlertsPage() {
  const [alerts, setAlerts] = useState<Alert[]>(seedAlerts);
  const [filter, setFilter] = useState("all");

  const ack = (id: string) =>
    setAlerts((a) => a.map((x) => (x.id === id ? { ...x, acknowledged: true } : x)));

  const filtered = alerts.filter((a) => (filter === "all" ? true : a.type === filter));
  const unack = alerts.filter((a) => !a.acknowledged).length;

  const types = ["all", "drought", "heatwave", "soil", "flood", "sensor"];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Alert Center"
        subtitle="Automated multi-hazard alerts with SMS & email notification delivery"
        icon={BellRing}
        actions={
          <Chip tone="red">
            {unack} unacknowledged
          </Chip>
        }
      />

      {/* Notification preview */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Card className="!p-4">
          <div className="mb-2 flex items-center gap-2 text-sm font-semibold">
            <MessageSquare size={16} className="text-emerald-500" /> SMS Preview
          </div>
          <div className="rounded-xl bg-ink-100 p-3 text-sm dark:bg-ink-800">
            <p className="font-medium">CAIP Alert</p>
            <p className="mt-1 text-ink-500">
              SEVERE DROUGHT — Kirehe. Soil moisture critical (14%). Delay planting 2–3 wks. Reply INFO for advice.
            </p>
          </div>
          <div className="mt-2 text-xs text-ink-400">Delivered to 4,210 farmers · +250 78x xxx xxx</div>
        </Card>

        <Card className="!p-4">
          <div className="mb-2 flex items-center gap-2 text-sm font-semibold">
            <Mail size={16} className="text-sky-500" /> Email Preview
          </div>
          <div className="rounded-xl bg-ink-100 p-3 text-sm dark:bg-ink-800">
            <p className="font-medium">Subject: [High] Heatwave probability rising — Nyagatare</p>
            <p className="mt-1 text-ink-500">
              LST projected &gt; 36°C for 5+ days. Livestock heat-stress risk elevated. View dashboard →
            </p>
          </div>
          <div className="mt-2 text-xs text-ink-400">Sent to 38 extension officers & gov contacts</div>
        </Card>

        <Card className="!p-4">
          <div className="mb-2 flex items-center gap-2 text-sm font-semibold">
            <Smartphone size={16} className="text-brand-500" /> Push Preview
          </div>
          <div className="rounded-xl bg-ink-100 p-3 text-sm dark:bg-ink-800">
            <p className="font-medium">Flash flood watch — Rubavu</p>
            <p className="mt-1 text-ink-500">
              Heavy rainfall + saturated soils. Low-lying sectors at risk over next 24h.
            </p>
          </div>
          <div className="mt-2 text-xs text-ink-400">Push to 1,120 app users</div>
        </Card>
      </div>

      {/* Type filters */}
      <div className="flex flex-wrap gap-2">
        {types.map((t) => (
          <button
            key={t}
            onClick={() => setFilter(t)}
            className={`rounded-full px-4 py-1.5 text-sm font-medium capitalize transition ${
              filter === t
                ? "bg-brand-600 text-white"
                : "border border-ink-200 hover:bg-ink-100 dark:border-ink-800 dark:hover:bg-ink-800"
            }`}
          >
            {t === "all" ? "All alerts" : typeLabel[t]}
          </button>
        ))}
      </div>

      {/* Alert feed */}
      <div className="space-y-3">
        <AnimatePresence>
          {filtered.map((a, i) => {
            const Icon = typeIcon[a.type];
            return (
              <motion.div
                key={a.id}
                layout
                exit={{ opacity: 0 }}
                transition={{ duration: 0.15 }}
                className={`surface flex items-start gap-4 p-4 ${a.acknowledged ? "opacity-60" : ""}`}
                style={{ borderLeft: `4px solid ${riskColor[a.severity]}` }}
              >
                <div
                  className="grid h-11 w-11 shrink-0 place-items-center rounded-xl text-white"
                  style={{ backgroundColor: riskColor[a.severity] }}
                >
                  <Icon size={20} />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="font-semibold">{a.title}</h3>
                    <RiskBadge risk={a.severity} size="sm" />
                    <Chip>{typeLabel[a.type]}</Chip>
                  </div>
                  <div className="mt-1 flex items-center gap-1 text-xs text-ink-400">
                    <MapPin size={11} /> {a.district} · {a.time}
                  </div>
                  <p className="mt-2 text-sm text-ink-500">{a.message}</p>
                  <div className="mt-2 flex items-center gap-1.5">
                    <span className="text-xs text-ink-400">Sent via:</span>
                    {a.channels.map((c) => {
                      const CIcon = channelIcon[c];
                      return (
                        <span
                          key={c}
                          className="grid h-6 w-6 place-items-center rounded-md bg-ink-100 text-ink-500 dark:bg-ink-800"
                          title={c}
                        >
                          <CIcon size={12} />
                        </span>
                      );
                    })}
                  </div>
                </div>
                <div className="shrink-0">
                  {a.acknowledged ? (
                    <span className="flex items-center gap-1 text-xs font-medium text-emerald-600">
                      <Check size={14} /> Acknowledged
                    </span>
                  ) : (
                    <button
                      onClick={() => ack(a.id)}
                      className="rounded-lg bg-brand-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-brand-700"
                    >
                      Acknowledge
                    </button>
                  )}
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );
}

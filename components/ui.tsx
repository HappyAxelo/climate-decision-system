"use client";

import { motion } from "framer-motion";
import { ArrowDownRight, ArrowUpRight, type LucideIcon } from "lucide-react";
import { RiskLevel, riskColor, riskLabel } from "@/lib/mockData";
import { ReactNode } from "react";

// ---------------------------------------------------------------------------
export function PageHeader({
  title,
  subtitle,
  icon: Icon,
  actions,
}: {
  title: string;
  subtitle?: string;
  icon?: LucideIcon;
  actions?: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-start gap-3">
        {Icon && (
          <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-brand-500/10 text-brand-600">
            <Icon size={22} />
          </div>
        )}
        <div>
          <h1 className="text-xl font-semibold tracking-tight sm:text-2xl">{title}</h1>
          {subtitle && <p className="mt-0.5 text-sm text-ink-500">{subtitle}</p>}
        </div>
      </div>
      {actions && <div className="flex items-center gap-2">{actions}</div>}
    </div>
  );
}

// ---------------------------------------------------------------------------
export function Card({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
  /** accepted for call-site compatibility; no longer used */
  delay?: number;
}) {
  return <div className={`surface p-5 ${className}`}>{children}</div>;
}

// ---------------------------------------------------------------------------
export function RiskBadge({ risk, size = "md" }: { risk: RiskLevel; size?: "sm" | "md" }) {
  const pad = size === "sm" ? "px-2 py-0.5 text-[11px]" : "px-2.5 py-1 text-xs";
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full font-medium ${pad}`}
      style={{ color: riskColor[risk], backgroundColor: `${riskColor[risk]}1a` }}
    >
      <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: riskColor[risk] }} />
      {riskLabel[risk]}
    </span>
  );
}

// ---------------------------------------------------------------------------
export function Trend({ value, invert = false }: { value: number; invert?: boolean }) {
  const positive = invert ? value < 0 : value > 0;
  const good = positive; // higher considered "up"
  const color = good ? "text-emerald-600" : "text-rose-500";
  return (
    <span className={`inline-flex items-center gap-0.5 text-xs font-semibold ${color}`}>
      {value >= 0 ? <ArrowUpRight size={13} /> : <ArrowDownRight size={13} />}
      {Math.abs(value)}%
    </span>
  );
}

// ---------------------------------------------------------------------------
export function Sparkline({ data, color = "#10b981" }: { data: number[]; color?: string }) {
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const w = 100;
  const h = 32;
  const pts = data
    .map((d, i) => `${(i / (data.length - 1)) * w},${h - ((d - min) / range) * h}`)
    .join(" ");
  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="h-8 w-full" preserveAspectRatio="none">
      <polyline points={pts} fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

// ---------------------------------------------------------------------------
export function Stat({
  label,
  value,
  sub,
  accent = "#10b981",
}: {
  label: string;
  value: string;
  sub?: ReactNode;
  accent?: string;
}) {
  return (
    <div>
      <p className="text-xs font-medium uppercase tracking-wide text-ink-400">{label}</p>
      <p className="mt-1 text-2xl font-semibold" style={{ color: accent }}>
        {value}
      </p>
      {sub && <div className="mt-0.5 text-xs text-ink-500">{sub}</div>}
    </div>
  );
}

// ---------------------------------------------------------------------------
export function Progress({ value, color = "#10b981" }: { value: number; color?: string }) {
  return (
    <div className="h-2 w-full overflow-hidden rounded-full bg-ink-200 dark:bg-ink-800">
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: `${value}%` }}
        transition={{ duration: 0.9, ease: "easeOut" }}
        className="h-full rounded-full"
        style={{ backgroundColor: color }}
      />
    </div>
  );
}

// ---------------------------------------------------------------------------
export function Chip({ children, tone = "default" }: { children: ReactNode; tone?: "default" | "green" | "amber" | "red" | "blue" }) {
  const tones: Record<string, string> = {
    default: "bg-ink-100 text-ink-600 dark:bg-ink-800 dark:text-ink-300",
    green: "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-400",
    amber: "bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-400",
    red: "bg-rose-100 text-rose-700 dark:bg-rose-500/15 dark:text-rose-400",
    blue: "bg-sky-100 text-sky-700 dark:bg-sky-500/15 dark:text-sky-400",
  };
  return <span className={`inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-xs font-medium ${tones[tone]}`}>{children}</span>;
}

// ---------------------------------------------------------------------------
export function SectionTitle({ children, action }: { children: ReactNode; action?: ReactNode }) {
  return (
    <div className="mb-4 flex items-center justify-between">
      <h2 className="text-sm font-semibold uppercase tracking-wide text-ink-500">{children}</h2>
      {action}
    </div>
  );
}

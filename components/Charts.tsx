"use client";

import {
  ResponsiveContainer,
  AreaChart,
  Area,
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ReferenceLine,
  Cell,
} from "recharts";

const axis = { fontSize: 11, fill: "#94a3b8" };
const grid = "#e2e8f0";

const tooltipStyle = {
  contentStyle: {
    borderRadius: 12,
    border: "1px solid #e2e8f0",
    fontSize: 12,
    boxShadow: "0 10px 30px -10px rgba(0,0,0,.2)",
  },
};

interface Series {
  key: string;
  color: string;
  name?: string;
  dashed?: boolean;
  fill?: boolean;
}

export function TrendChart({
  data,
  xKey,
  series,
  height = 260,
  type = "area",
  unit = "",
}: {
  data: any[];
  xKey: string;
  series: Series[];
  height?: number;
  type?: "area" | "line" | "bar";
  unit?: string;
}) {
  if (type === "bar") {
    return (
      <ResponsiveContainer width="100%" height={height}>
        <BarChart data={data} margin={{ top: 6, right: 8, left: -18, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke={grid} vertical={false} />
          <XAxis dataKey={xKey} tick={axis} axisLine={false} tickLine={false} />
          <YAxis tick={axis} axisLine={false} tickLine={false} unit={unit} />
          <Tooltip {...tooltipStyle} />
          {series.length > 1 && <Legend wrapperStyle={{ fontSize: 12 }} />}
          {series.map((s) => (
            <Bar key={s.key} dataKey={s.key} name={s.name ?? s.key} fill={s.color} radius={[4, 4, 0, 0]} />
          ))}
        </BarChart>
      </ResponsiveContainer>
    );
  }

  if (type === "line") {
    return (
      <ResponsiveContainer width="100%" height={height}>
        <LineChart data={data} margin={{ top: 6, right: 8, left: -18, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke={grid} vertical={false} />
          <XAxis dataKey={xKey} tick={axis} axisLine={false} tickLine={false} />
          <YAxis tick={axis} axisLine={false} tickLine={false} unit={unit} />
          <Tooltip {...tooltipStyle} />
          {series.length > 1 && <Legend wrapperStyle={{ fontSize: 12 }} />}
          {series.map((s) => (
            <Line
              key={s.key}
              type="monotone"
              dataKey={s.key}
              name={s.name ?? s.key}
              stroke={s.color}
              strokeWidth={2.5}
              strokeDasharray={s.dashed ? "5 4" : undefined}
              dot={false}
              activeDot={{ r: 4 }}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={height}>
      <AreaChart data={data} margin={{ top: 6, right: 8, left: -18, bottom: 0 }}>
        <defs>
          {series.map((s) => (
            <linearGradient key={s.key} id={`grad-${s.key}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={s.color} stopOpacity={0.35} />
              <stop offset="95%" stopColor={s.color} stopOpacity={0} />
            </linearGradient>
          ))}
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke={grid} vertical={false} />
        <XAxis dataKey={xKey} tick={axis} axisLine={false} tickLine={false} />
        <YAxis tick={axis} axisLine={false} tickLine={false} unit={unit} />
        <Tooltip {...tooltipStyle} />
        {series.length > 1 && <Legend wrapperStyle={{ fontSize: 12 }} />}
        {series.map((s) => (
          <Area
            key={s.key}
            type="monotone"
            dataKey={s.key}
            name={s.name ?? s.key}
            stroke={s.color}
            strokeWidth={2.5}
            strokeDasharray={s.dashed ? "5 4" : undefined}
            fill={s.fill === false ? "transparent" : `url(#grad-${s.key})`}
          />
        ))}
      </AreaChart>
    </ResponsiveContainer>
  );
}

export function AnomalyChart({ data, height = 260 }: { data: any[]; height?: number }) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart data={data} margin={{ top: 6, right: 8, left: -18, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke={grid} vertical={false} />
        <XAxis dataKey="month" tick={axis} axisLine={false} tickLine={false} />
        <YAxis tick={axis} axisLine={false} tickLine={false} unit="°" />
        <Tooltip {...tooltipStyle} />
        <ReferenceLine y={0} stroke="#94a3b8" />
        <Bar dataKey="anomaly" radius={[4, 4, 0, 0]}>
          {data.map((d, i) => (
            <Cell key={i} fill={d.anomaly >= 1 ? "#ef4444" : d.anomaly >= 0.5 ? "#f59e0b" : "#10b981"} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}

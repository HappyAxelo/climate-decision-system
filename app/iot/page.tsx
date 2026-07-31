"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import {
  Cpu,
  Thermometer,
  Droplets,
  CloudRain,
  Wind,
  BatteryFull,
  BatteryLow,
  Sprout,
  Wifi,
  WifiOff,
} from "lucide-react";
import { sensors as seedSensors, sensorLiveSeries } from "@/lib/mockData";
import { PageHeader, Card, SectionTitle, Chip } from "@/components/ui";
import { TrendChart } from "@/components/Charts";
import type { SensorsResult } from "@/lib/data/iot";

const MapView = dynamic(() => import("@/components/MapView"), { ssr: false });

const statusChip: Record<string, "green" | "amber" | "red"> = {
  online: "green",
  warning: "amber",
  offline: "red",
};

export default function IoTPage() {
  const [sensors, setSensors] = useState(seedSensors);
  const [source, setSource] = useState("Seed (awaiting ingestion)");
  const online = sensors.filter((s) => s.status !== "offline").length;
  const [tick, setTick] = useState(0);

  // simulate per-second variation for the live feel
  useEffect(() => {
    const id = setInterval(() => setTick((t) => t + 1), 3000);
    return () => clearInterval(id);
  }, []);

  // pull current sensors (seed + any live ingestion) from /api/iot, poll every 15s
  useEffect(() => {
    const load = () =>
      fetch("/api/iot")
        .then((r) => r.json())
        .then((d: SensorsResult) => {
          if (d.sensors?.length) setSensors(d.sensors);
          setSource(d.source);
        })
        .catch(() => {});
    load();
    const id = setInterval(load, 15000);
    return () => clearInterval(id);
  }, []);

  const jitter = (v: number, amt = 0.4) =>
    v === 0 ? 0 : +(v + Math.sin(tick + v) * amt).toFixed(1);

  const agg = {
    temp: +(sensors.filter((s) => s.status !== "offline").reduce((a, s) => a + s.temp, 0) / online).toFixed(1),
    humidity: Math.round(sensors.filter((s) => s.status !== "offline").reduce((a, s) => a + s.humidity, 0) / online),
    soil: Math.round(sensors.filter((s) => s.status !== "offline").reduce((a, s) => a + s.soilMoisture, 0) / online),
    rain: sensors.reduce((a, s) => a + s.rainfall, 0),
  };

  const summary = [
    { label: "Avg Temperature", value: `${jitter(agg.temp, 0.3)}°C`, icon: Thermometer, color: "#ef4444" },
    { label: "Avg Humidity", value: `${agg.humidity}%`, icon: Droplets, color: "#3b82f6" },
    { label: "Avg Soil Moisture", value: `${agg.soil}%`, icon: Sprout, color: "#10b981" },
    { label: "Total Rainfall", value: `${agg.rain} mm`, icon: CloudRain, color: "#0ea5e9" },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="IoT Monitoring"
        subtitle={`Field sensor network · ${source}`}
        icon={Cpu}
        actions={
          <div className="flex items-center gap-3">
            <Chip tone="green">
              <Wifi size={12} /> {online} online
            </Chip>
            <Chip tone="red">
              <WifiOff size={12} /> {sensors.length - online} offline
            </Chip>
          </div>
        }
      />

      {/* Live aggregate cards */}
      <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
        {summary.map((s, i) => (
          <Card key={s.label} delay={i * 0.05} className="!p-4">
            <div className="flex items-center gap-3">
              <span
                className="grid h-11 w-11 place-items-center rounded-xl"
                style={{ backgroundColor: `${s.color}1a`, color: s.color }}
              >
                <s.icon size={20} />
              </span>
              <div>
                <div className="text-xl font-semibold">{s.value}</div>
                <div className="text-xs text-ink-400">{s.label}</div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        {/* Live chart */}
        <Card className="lg:col-span-2">
          <SectionTitle action={<Chip tone="blue">Last 24 hours</Chip>}>
            Live Telemetry Stream
          </SectionTitle>
          <TrendChart
            data={sensorLiveSeries}
            xKey="hour"
            type="line"
            height={260}
            series={[
              { key: "temp", color: "#ef4444", name: "Temp °C" },
              { key: "humidity", color: "#3b82f6", name: "Humidity %" },
              { key: "soil", color: "#10b981", name: "Soil %" },
            ]}
          />
        </Card>

        {/* Sensor map */}
        <Card className="!p-3">
          <div className="px-2 pb-2 pt-1">
            <h3 className="text-sm font-semibold">Sensor Locations</h3>
          </div>
          <MapView showRisk={false} showSensors height="290px" basemap="dark" />
        </Card>
      </div>

      {/* Sensor table */}
      <Card className="!p-0 overflow-hidden">
        <div className="border-b border-ink-200 p-4 dark:border-ink-800">
          <h3 className="text-sm font-semibold">Field Sensors ({sensors.length})</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px] text-sm">
            <thead className="bg-ink-50 text-xs uppercase text-ink-400 dark:bg-ink-950">
              <tr>
                {["Sensor", "Temp", "Humidity", "Soil", "Rain", "Wind", "Battery", "Status"].map((h) => (
                  <th key={h} className="px-4 py-2.5 text-left font-medium">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {sensors.map((s, i) => (
                <tr
                  key={s.id}
                  className="border-t border-ink-100 hover:bg-ink-50 dark:border-ink-800 dark:hover:bg-ink-950"
                >
                  <td className="px-4 py-3">
                    <div className="font-semibold">{s.id}</div>
                    <div className="text-xs text-ink-400">{s.name} · {s.district}</div>
                  </td>
                  <td className="px-4 py-3">{s.status === "offline" ? "—" : `${jitter(s.temp, 0.2)}°C`}</td>
                  <td className="px-4 py-3">{s.status === "offline" ? "—" : `${s.humidity}%`}</td>
                  <td className="px-4 py-3">{s.status === "offline" ? "—" : `${s.soilMoisture}%`}</td>
                  <td className="px-4 py-3">{s.status === "offline" ? "—" : `${s.rainfall} mm`}</td>
                  <td className="px-4 py-3">{s.status === "offline" ? "—" : `${s.wind} km/h`}</td>
                  <td className="px-4 py-3">
                    <span className="flex items-center gap-1.5">
                      {s.battery > 20 ? (
                        <BatteryFull size={16} className="text-emerald-500" />
                      ) : (
                        <BatteryLow size={16} className="text-rose-500" />
                      )}
                      {s.battery}%
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <Chip tone={statusChip[s.status]}>{s.status}</Chip>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}

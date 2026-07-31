// ============================================================================
// IoT ingestion + read layer.
//
// POST readings here from:
//   - The Things Network (LoRaWAN) HTTP webhook integration
//   - an MQTT -> HTTP bridge
//   - a scheduled TAHMO poller (https://tahmo.org)
//
// NOTE: this uses an in-memory store, which resets on serverless cold start.
// For production, persist to Supabase / Postgres / Redis (swap the Map below).
// ============================================================================

import { sensors as seedSensors, Sensor } from "@/lib/mockData";

export interface Reading {
  id: string;
  name?: string;
  district?: string;
  lat?: number;
  lng?: number;
  temp?: number;
  humidity?: number;
  soilMoisture?: number;
  rainfall?: number;
  wind?: number;
  battery?: number;
  at: number; // epoch ms
}

// Module-level store (replace with a real DB in production).
const store = new Map<string, Reading>();

function statusFor(battery: number | undefined, ageMs: number): Sensor["status"] {
  if (ageMs > 6 * 60 * 60 * 1000) return "offline"; // no data in 6h
  if (battery != null && battery <= 5) return "offline";
  if (battery != null && battery <= 20) return "warning";
  return "online";
}

function ago(ms: number): string {
  const s = Math.round((Date.now() - ms) / 1000);
  if (s < 60) return "just now";
  const m = Math.round(s / 60);
  if (m < 60) return `${m} min ago`;
  const h = Math.round(m / 60);
  return `${h} hr ago`;
}

/** Normalise a webhook body into a Reading. Supports flat JSON or TTN uplinks. */
export function parseReading(body: any): Reading | null {
  // The Things Network v3 uplink shape
  if (body?.uplink_message?.decoded_payload) {
    const p = body.uplink_message.decoded_payload;
    const id = body.end_device_ids?.device_id;
    if (!id) return null;
    return {
      id,
      temp: p.temperature ?? p.temp,
      humidity: p.humidity,
      soilMoisture: p.soil_moisture ?? p.soilMoisture,
      rainfall: p.rainfall,
      wind: p.wind_speed ?? p.wind,
      battery: p.battery ?? p.batt,
      at: Date.now(),
    };
  }
  // Flat normalised payload
  if (body?.id) {
    return {
      id: String(body.id),
      name: body.name,
      district: body.district,
      lat: body.lat,
      lng: body.lng,
      temp: body.temp,
      humidity: body.humidity,
      soilMoisture: body.soilMoisture,
      rainfall: body.rainfall,
      wind: body.wind,
      battery: body.battery,
      at: Date.now(),
    };
  }
  return null;
}

export function ingest(reading: Reading) {
  store.set(reading.id, reading);
}

export interface SensorsResult {
  sensors: Sensor[];
  liveCount: number;
  source: string;
}

/** Merge live-ingested readings over the seed sensor list. */
export function getSensors(): SensorsResult {
  const bySeed = new Map(seedSensors.map((s) => [s.id, s]));
  const ids = new Set<string>([...bySeed.keys(), ...store.keys()]);

  const merged: Sensor[] = [...ids].map((id) => {
    const seed = bySeed.get(id);
    const live = store.get(id);
    if (!live) return seed as Sensor;

    const base: Sensor =
      seed ??
      {
        id,
        name: live.name ?? id,
        district: live.district ?? "—",
        lat: live.lat ?? 0,
        lng: live.lng ?? 0,
        temp: 0,
        humidity: 0,
        soilMoisture: 0,
        rainfall: 0,
        wind: 0,
        battery: 0,
        status: "online",
        lastSeen: "just now",
      };

    return {
      ...base,
      temp: live.temp ?? base.temp,
      humidity: live.humidity ?? base.humidity,
      soilMoisture: live.soilMoisture ?? base.soilMoisture,
      rainfall: live.rainfall ?? base.rainfall,
      wind: live.wind ?? base.wind,
      battery: live.battery ?? base.battery,
      status: statusFor(live.battery ?? base.battery, Date.now() - live.at),
      lastSeen: ago(live.at),
    };
  });

  return {
    sensors: merged,
    liveCount: store.size,
    source: store.size ? "Live ingestion + seed" : "Seed (awaiting ingestion)",
  };
}

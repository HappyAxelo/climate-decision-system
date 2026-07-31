import { NextResponse } from "next/server";
import { getSensors, ingest, parseReading } from "@/lib/data/iot";

// In-memory store must not be statically cached.
export const dynamic = "force-dynamic";

// GET /api/iot -> current sensors (seed merged with any live ingestion)
export async function GET() {
  return NextResponse.json(getSensors());
}

// POST /api/iot -> ingest a reading (TTN webhook / MQTT bridge / TAHMO poller)
// Protect with header  x-ingest-key: <INGEST_API_KEY>  when the env var is set.
export async function POST(req: Request) {
  const key = process.env.INGEST_API_KEY;
  if (key && req.headers.get("x-ingest-key") !== key) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "invalid JSON" }, { status: 400 });
  }

  const reading = parseReading(body);
  if (!reading) {
    return NextResponse.json(
      { error: "could not parse reading; expected {id, temp, humidity, ...} or a TTN uplink" },
      { status: 422 }
    );
  }

  ingest(reading);
  return NextResponse.json({ ok: true, id: reading.id });
}

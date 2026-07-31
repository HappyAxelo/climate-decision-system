import { NextResponse } from "next/server";
import { getWeather } from "@/lib/data/weather";
import { weather as fallback } from "@/lib/mockData";

export const revalidate = 600;

// GET /api/weather?lat=..&lng=..&name=..
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const lat = searchParams.get("lat");
  const lng = searchParams.get("lng");
  const name = searchParams.get("name") ?? undefined;

  try {
    const data = await getWeather(
      lat ? parseFloat(lat) : undefined,
      lng ? parseFloat(lng) : undefined,
      name
    );
    return NextResponse.json(data);
  } catch (e) {
    // Graceful fallback to seed data so the UI never breaks.
    return NextResponse.json(
      { ...fallback, live: false, updatedAt: new Date().toISOString() },
      { status: 200 }
    );
  }
}

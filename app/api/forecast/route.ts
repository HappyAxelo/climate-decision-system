import { NextResponse } from "next/server";
import { getForecast } from "@/lib/data/forecast";

export const revalidate = 3600; // 1h

// GET /api/forecast?lat=..&lng=..&name=..
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const lat = searchParams.get("lat");
  const lng = searchParams.get("lng");
  const name = searchParams.get("name") ?? undefined;

  const result = await getForecast(
    lat ? parseFloat(lat) : undefined,
    lng ? parseFloat(lng) : undefined,
    name
  );
  return NextResponse.json(result);
}

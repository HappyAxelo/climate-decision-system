import { NextResponse } from "next/server";
import { getNdviSeries } from "@/lib/data/ndvi";

export const revalidate = 21600; // 6h

// GET /api/ndvi?lat=..&lng=..&months=12
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const lat = searchParams.get("lat");
  const lng = searchParams.get("lng");
  const months = searchParams.get("months");

  const result = await getNdviSeries(
    lat ? parseFloat(lat) : undefined,
    lng ? parseFloat(lng) : undefined,
    months ? parseInt(months, 10) : undefined
  );
  return NextResponse.json(result);
}

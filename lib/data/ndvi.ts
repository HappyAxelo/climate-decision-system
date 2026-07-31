// ============================================================================
// NDVI time-series.
//
// Real source: Sentinel Hub Statistical API (Sentinel-2 L2A). Activates when
// SENTINELHUB_CLIENT_ID + SENTINELHUB_CLIENT_SECRET are set (free account at
// https://www.sentinel-hub.com). Without a key it returns a deterministic
// simulated series so the UI keeps working — see README for how to go live.
//
// Alternative providers you can drop in here: Digital Earth Africa (STAC +
// OGC), Google Earth Engine, or Microsoft Planetary Computer.
// ============================================================================

import { ndviTrend } from "@/lib/mockData";

export interface NdviPoint {
  month: string;
  ndvi: number;
  baseline: number;
}

export interface NdviResult {
  series: NdviPoint[];
  live: boolean;
  source: string;
}

const monthLabel = (iso: string) =>
  new Date(iso).toLocaleDateString("en-US", { month: "short" });

async function sentinelHubToken(id: string, secret: string): Promise<string> {
  const res = await fetch(
    "https://services.sentinel-hub.com/auth/realms/main/protocol/openid-connect/token",
    {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        grant_type: "client_credentials",
        client_id: id,
        client_secret: secret,
      }),
    }
  );
  if (!res.ok) throw new Error(`SentinelHub auth ${res.status}`);
  return (await res.json()).access_token as string;
}

const NDVI_EVALSCRIPT = `//VERSION=3
function setup() {
  return {
    input: [{ bands: ["B04", "B08", "dataMask"] }],
    output: [
      { id: "ndvi", bands: 1 },
      { id: "dataMask", bands: 1 },
    ],
  };
}
function evaluatePixel(s) {
  let ndvi = (s.B08 - s.B04) / (s.B08 + s.B04);
  return { ndvi: [ndvi], dataMask: [s.dataMask] };
}`;

/**
 * Monthly NDVI mean for the last `months` months around a point.
 */
export async function getNdviSeries(
  lat = -2.259,
  lng = 30.71,
  months = 12
): Promise<NdviResult> {
  const id = process.env.SENTINELHUB_CLIENT_ID;
  const secret = process.env.SENTINELHUB_CLIENT_SECRET;

  if (!id || !secret) {
    return {
      series: ndviTrend as NdviPoint[],
      live: false,
      source: "Simulated (set SENTINELHUB_CLIENT_ID/SECRET to go live)",
    };
  }

  try {
    const token = await sentinelHubToken(id, secret);
    const to = new Date();
    const from = new Date();
    from.setMonth(from.getMonth() - months);

    // ~5km box around the point
    const d = 0.05;
    const body = {
      input: {
        bounds: {
          bbox: [lng - d, lat - d, lng + d, lat + d],
          properties: { crs: "http://www.opengis.net/def/crs/EPSG/0/4326" },
        },
        data: [
          {
            type: "sentinel-2-l2a",
            dataFilter: { mosaickingOrder: "leastCC", maxCloudCoverage: 40 },
          },
        ],
      },
      aggregation: {
        timeRange: { from: from.toISOString(), to: to.toISOString() },
        aggregationInterval: { of: "P1M" },
        evalscript: NDVI_EVALSCRIPT,
        resx: 0.0001,
        resy: 0.0001,
      },
      calculations: { ndvi: { statistics: { default: {} } } },
    };

    const res = await fetch("https://services.sentinel-hub.com/api/v1/statistics", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(body),
      next: { revalidate: 21600 }, // 6h
    });
    if (!res.ok) throw new Error(`SentinelHub stats ${res.status}`);
    const json = await res.json();

    const series: NdviPoint[] = (json.data ?? [])
      .map((interval: any) => {
        const mean = interval.outputs?.ndvi?.bands?.B0?.stats?.mean;
        if (mean == null) return null;
        return {
          month: monthLabel(interval.interval.from),
          ndvi: +mean.toFixed(2),
          baseline: 0.55,
        };
      })
      .filter(Boolean);

    if (!series.length) throw new Error("SentinelHub returned no valid intervals");

    return { series, live: true, source: "Sentinel-2 L2A via Sentinel Hub" };
  } catch (e) {
    return {
      series: ndviTrend as NdviPoint[],
      live: false,
      source: "Simulated (Sentinel Hub request failed)",
    };
  }
}

// ============================================================================
// Climate forecast derived from Open-Meteo (free, no key).
// 16-day daily forecast -> rainfall outlook, heatwave probability, soil-moisture
// trend, and a WRSI (Water Requirement Satisfaction Index) water-balance proxy.
// Server-side; used by /api/forecast. Falls back to sample data on failure.
// ============================================================================

import { RiskLevel, forecastCards as seedCards, seasonalOutlook as seedSeries } from "@/lib/mockData";

export interface ForecastCard {
  key: "rainfall" | "heatwave" | "soil" | "wrsi";
  title: string;
  value: string;
  detail: string;
  confidence: number;
  risk: RiskLevel;
  trend: number;
}

export interface ForecastPoint {
  day: string;
  rainfall: number; // mm
  prob: number; // %
}

export interface ConfidenceItem {
  label: string;
  v: number;
}

export interface ForecastResult {
  cards: ForecastCard[];
  series: ForecastPoint[];
  confidence: ConfidenceItem[];
  summary: { text: string; trendingUp: boolean };
  live: boolean;
  source: string;
}

const HEAT_THRESHOLD = 32; // °C — heat-stress threshold for the Eastern Province
const sum = (a: number[]) => a.reduce((s, x) => s + (x ?? 0), 0);
const dayLabel = (iso: string) =>
  new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric" });

function sampleFallback(): ForecastResult {
  return {
    cards: seedCards as ForecastCard[],
    series: (seedSeries as any[]).map((w) => ({
      day: w.week,
      rainfall: w.forecast,
      prob: 50,
    })),
    confidence: [
      { label: "Rainfall", v: 78 },
      { label: "Temperature", v: 85 },
      { label: "Soil moisture", v: 83 },
      { label: "WRSI", v: 80 },
    ],
    summary: {
      text:
        "Sample outlook. Connect to Open-Meteo for a live 16-day forecast of rainfall, heat and soil moisture.",
      trendingUp: true,
    },
    live: false,
    source: "Sample",
  };
}

export async function getForecast(
  lat = -2.259,
  lng = 30.71,
  place = "Eastern Province"
): Promise<ForecastResult> {
  try {
    const url =
      `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}` +
      `&daily=precipitation_sum,precipitation_probability_max,temperature_2m_max,et0_fao_evapotranspiration` +
      `&hourly=soil_moisture_0_to_7cm&forecast_days=16&timezone=auto`;

    const res = await fetch(url, { next: { revalidate: 3600 } }); // 1h
    if (!res.ok) throw new Error(`Open-Meteo ${res.status}`);
    const d = await res.json();

    const daily = d.daily;
    const precip: number[] = daily.precipitation_sum ?? [];
    const probs: number[] = daily.precipitation_probability_max ?? [];
    const tmax: number[] = daily.temperature_2m_max ?? [];
    const et0: number[] = daily.et0_fao_evapotranspiration ?? [];
    const soil: number[] = (d.hourly?.soil_moisture_0_to_7cm ?? []).filter(
      (x: number) => x != null
    );

    // ---- Rainfall outlook (next 16 days) ----
    const totalRain = Math.round(sum(precip));
    const avgProb = probs.length ? Math.round(sum(probs) / probs.length) : 0;
    const REF = 80; // rough 16-day growing-season reference (mm)
    const rainRisk: RiskLevel = totalRain < 40 ? "high" : totalRain < 80 ? "moderate" : "low";
    const rainValue =
      totalRain < 40 ? "Below Normal" : totalRain < 80 ? "Near Normal" : "Above Normal";
    const rainTrend = Math.round(((totalRain - REF) / REF) * 100);

    // ---- Heatwave probability ----
    const hotDays = tmax.filter((t) => t >= HEAT_THRESHOLD).length;
    const peak = tmax.length ? Math.round(Math.max(...tmax)) : 0;
    const heatPct = tmax.length ? Math.round((hotDays / tmax.length) * 100) : 0;
    const heatRisk: RiskLevel = hotDays >= 6 ? "high" : hotDays >= 3 ? "moderate" : "low";
    const heatTrend =
      tmax.length > 1 ? Math.round((tmax[tmax.length - 1] - tmax[0]) * 4) : 0;

    // ---- Soil moisture trend (0-7cm, m³/m³ -> %) ----
    const soilStart = soil.length ? soil[0] : 0.25;
    const soilEnd = soil.length ? soil[soil.length - 1] : 0.2;
    const soilEndPct = Math.round(soilEnd * 100);
    const soilTrend = soilStart ? Math.round(((soilEnd - soilStart) / soilStart) * 100) : 0;
    const soilRisk: RiskLevel = soilEnd < 0.15 ? "high" : soilEnd < 0.25 ? "moderate" : "low";
    const soilValue = soilTrend < -5 ? "Declining" : soilTrend > 5 ? "Rising" : "Stable";

    // ---- WRSI proxy = cumulative rainfall / cumulative ET0 (capped at 1) ----
    const cumET0 = sum(et0);
    const wrsi = cumET0 > 0 ? Math.min(1, totalRain / cumET0) : 0;
    const wrsiRisk: RiskLevel = wrsi < 0.6 ? "high" : wrsi < 0.85 ? "moderate" : "low";
    const wrsiTrend = Math.round(((wrsi - 0.75) / 0.75) * 100);

    const cards: ForecastCard[] = [
      {
        key: "rainfall",
        title: "16-Day Rainfall Outlook",
        value: rainValue,
        detail: `${totalRain} mm expected · ${avgProb}% avg chance`,
        confidence: Math.max(60, Math.min(88, avgProb + 30)),
        risk: rainRisk,
        trend: rainTrend,
      },
      {
        key: "heatwave",
        title: "Heatwave Probability",
        value: `${heatPct}%`,
        detail: `${hotDays}/${tmax.length} days ≥ ${HEAT_THRESHOLD}°C · peak ${peak}°C`,
        confidence: 76,
        risk: heatRisk,
        trend: heatTrend,
      },
      {
        key: "soil",
        title: "Soil Moisture Forecast",
        value: soilValue,
        detail: `~${soilEndPct}% vol. water by day 16`,
        confidence: 80,
        risk: soilRisk,
        trend: soilTrend,
      },
      {
        key: "wrsi",
        title: "Water Requirement Satisfaction (WRSI)",
        value: wrsi.toFixed(2),
        detail: wrsi < 0.75 ? "Below adequate threshold (0.75)" : "At or above adequate (0.75)",
        confidence: 78,
        risk: wrsiRisk,
        trend: wrsiTrend,
      },
    ];

    const series: ForecastPoint[] = (daily.time ?? []).map((iso: string, i: number) => ({
      day: dayLabel(iso),
      rainfall: Math.round((precip[i] ?? 0) * 10) / 10,
      prob: probs[i] ?? 0,
    }));

    const confidence: ConfidenceItem[] = [
      { label: "Rainfall", v: cards[0].confidence },
      { label: "Temperature", v: 85 },
      { label: "Soil moisture", v: cards[2].confidence },
      { label: "WRSI", v: cards[3].confidence },
    ];

    const highRisks = cards.filter((c) => c.risk === "high").length;
    const summary = {
      text:
        highRisks >= 2
          ? `Elevated drought risk for ${place}: ${totalRain} mm rain forecast over 16 days with ${hotDays} hot days (≥${HEAT_THRESHOLD}°C). Early mitigation advised.`
          : `Conditions for ${place} look manageable: ${totalRain} mm rain forecast over 16 days, WRSI ${wrsi.toFixed(
              2
            )}. Keep monitoring.`,
      trendingUp: rainRisk === "high" || heatRisk === "high",
    };

    return {
      cards,
      series,
      confidence,
      summary,
      live: true,
      source: "Open-Meteo 16-day",
    };
  } catch {
    return sampleFallback();
  }
}

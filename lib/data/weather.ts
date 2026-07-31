// ============================================================================
// Live weather via Open-Meteo (https://open-meteo.com) — free, no API key.
// Server-side fetch used by /api/weather.
// ============================================================================

export interface WeatherForecastDay {
  day: string;
  hi: number;
  lo: number;
  icon: "sun" | "cloud" | "rain";
  rain: number;
}

export interface WeatherData {
  location: string;
  temp: number;
  condition: string;
  humidity: number;
  wind: number;
  uv: number;
  pressure: number;
  feelsLike: number;
  forecast: WeatherForecastDay[];
  live: boolean;
  updatedAt: string; // ISO
}

// WMO weather interpretation codes → label + simplified icon
function interpret(code: number): { label: string; icon: "sun" | "cloud" | "rain" } {
  if (code === 0) return { label: "Clear", icon: "sun" };
  if (code === 1) return { label: "Mainly Clear", icon: "sun" };
  if (code === 2) return { label: "Partly Cloudy", icon: "cloud" };
  if (code === 3) return { label: "Overcast", icon: "cloud" };
  if (code === 45 || code === 48) return { label: "Fog", icon: "cloud" };
  if (code >= 51 && code <= 57) return { label: "Drizzle", icon: "rain" };
  if (code >= 61 && code <= 67) return { label: "Rain", icon: "rain" };
  if (code >= 71 && code <= 77) return { label: "Snow", icon: "rain" };
  if (code >= 80 && code <= 82) return { label: "Rain Showers", icon: "rain" };
  if (code >= 95) return { label: "Thunderstorm", icon: "rain" };
  return { label: "Cloudy", icon: "cloud" };
}

const dayName = (iso: string) =>
  new Date(iso).toLocaleDateString("en-US", { weekday: "short" });

export async function getWeather(
  lat = -1.9441,
  lng = 30.0619,
  location = "Kigali, Rwanda"
): Promise<WeatherData> {
  const url =
    `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}` +
    `&current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m,surface_pressure` +
    `&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max,uv_index_max` +
    `&timezone=auto&forecast_days=5`;

  const res = await fetch(url, { next: { revalidate: 600 } }); // cache 10 min
  if (!res.ok) throw new Error(`Open-Meteo ${res.status}`);
  const d = await res.json();

  const cur = d.current;
  const daily = d.daily;
  const now = interpret(cur.weather_code);

  const forecast: WeatherForecastDay[] = daily.time
    .slice(0, 5)
    .map((iso: string, i: number) => ({
      day: dayName(iso),
      hi: Math.round(daily.temperature_2m_max[i]),
      lo: Math.round(daily.temperature_2m_min[i]),
      icon: interpret(daily.weather_code[i]).icon,
      rain: daily.precipitation_probability_max?.[i] ?? 0,
    }));

  return {
    location,
    temp: Math.round(cur.temperature_2m),
    condition: now.label,
    humidity: Math.round(cur.relative_humidity_2m),
    wind: Math.round(cur.wind_speed_10m),
    uv: Math.round(daily.uv_index_max?.[0] ?? 0),
    pressure: Math.round(cur.surface_pressure),
    feelsLike: Math.round(cur.apparent_temperature),
    forecast,
    live: true,
    updatedAt: new Date().toISOString(),
  };
}

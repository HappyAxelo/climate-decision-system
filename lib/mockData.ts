// ============================================================================
// CAIP — Climate Action Intelligence Platform
// Central mock data store (simulates Supabase / satellite / IoT backends)
// ============================================================================

export type RiskLevel = "low" | "moderate" | "high";

export const riskColor: Record<RiskLevel, string> = {
  low: "#10b981",
  moderate: "#f59e0b",
  high: "#ef4444",
};

export const riskLabel: Record<RiskLevel, string> = {
  low: "Low Risk",
  moderate: "Moderate Risk",
  high: "High Risk",
};

// ---------------------------------------------------------------------------
// Districts (Rwanda focus — aligns with Digital Earth Africa coverage)
// ---------------------------------------------------------------------------
export interface District {
  id: string;
  name: string;
  province: string;
  lat: number;
  lng: number;
  vulnerabilityScore: number; // 0-100
  risk: RiskLevel;
  ndvi: number;
  lst: number; // land surface temp °C
  soilMoisture: number; // %
  rainfall: number; // mm (last 30d)
  population: number;
}

export const districts: District[] = [
  { id: "kirehe", name: "Kirehe", province: "Eastern", lat: -2.259, lng: 30.71, vulnerabilityScore: 82, risk: "high", ndvi: 0.31, lst: 34.2, soilMoisture: 14, rainfall: 21, population: 340368 },
  { id: "nyagatare", name: "Nyagatare", province: "Eastern", lat: -1.293, lng: 30.325, vulnerabilityScore: 78, risk: "high", ndvi: 0.34, lst: 33.6, soilMoisture: 17, rainfall: 26, population: 465855 },
  { id: "kayonza", name: "Kayonza", province: "Eastern", lat: -1.883, lng: 30.616, vulnerabilityScore: 71, risk: "high", ndvi: 0.38, lst: 32.9, soilMoisture: 19, rainfall: 33, population: 344157 },
  { id: "bugesera", name: "Bugesera", province: "Eastern", lat: -2.212, lng: 30.145, vulnerabilityScore: 64, risk: "moderate", ndvi: 0.42, lst: 31.4, soilMoisture: 23, rainfall: 41, population: 361914 },
  { id: "gatsibo", name: "Gatsibo", province: "Eastern", lat: -1.585, lng: 30.455, vulnerabilityScore: 58, risk: "moderate", ndvi: 0.45, lst: 30.8, soilMoisture: 26, rainfall: 47, population: 433997 },
  { id: "gasabo", name: "Gasabo", province: "Kigali", lat: -1.905, lng: 30.11, vulnerabilityScore: 44, risk: "moderate", ndvi: 0.52, lst: 28.9, soilMoisture: 31, rainfall: 62, population: 530907 },
  { id: "musanze", name: "Musanze", province: "Northern", lat: -1.499, lng: 29.635, vulnerabilityScore: 29, risk: "low", ndvi: 0.68, lst: 24.1, soilMoisture: 44, rainfall: 94, population: 368267 },
  { id: "rubavu", name: "Rubavu", province: "Western", lat: -1.678, lng: 29.353, vulnerabilityScore: 26, risk: "low", ndvi: 0.71, lst: 23.5, soilMoisture: 47, rainfall: 108, population: 403662 },
  { id: "nyamasheke", name: "Nyamasheke", province: "Western", lat: -2.343, lng: 29.144, vulnerabilityScore: 31, risk: "low", ndvi: 0.66, lst: 24.8, soilMoisture: 42, rainfall: 88, population: 381804 },
  { id: "huye", name: "Huye", province: "Southern", lat: -2.596, lng: 29.739, vulnerabilityScore: 49, risk: "moderate", ndvi: 0.49, lst: 27.6, soilMoisture: 29, rainfall: 55, population: 328398 },
];

// ---------------------------------------------------------------------------
// Dashboard overview metrics
// ---------------------------------------------------------------------------
export interface MetricCard {
  key: string;
  title: string;
  value: string;
  unit?: string;
  trend: number; // % change
  risk: RiskLevel;
  spark: number[];
}

export const overviewMetrics: MetricCard[] = [
  { key: "drought", title: "Drought Risk", value: "High", risk: "high", trend: 12, spark: [40, 44, 51, 58, 63, 71, 78] },
  { key: "heatwave", title: "Heatwave Risk", value: "Moderate", risk: "moderate", trend: 8, spark: [30, 33, 38, 41, 44, 49, 55] },
  { key: "soil", title: "Soil Moisture", value: "24", unit: "%", risk: "high", trend: -15, spark: [42, 39, 35, 31, 28, 26, 24] },
  { key: "vegetation", title: "Vegetation Health", value: "0.46", unit: "NDVI", risk: "moderate", trend: -6, spark: [0.58, 0.55, 0.53, 0.5, 0.48, 0.47, 0.46] },
  { key: "water", title: "Water Availability", value: "61", unit: "%", risk: "moderate", trend: -9, spark: [78, 74, 71, 68, 65, 63, 61] },
];

// ---------------------------------------------------------------------------
// Live weather widget
// ---------------------------------------------------------------------------
export const weather = {
  location: "Kigali, Rwanda",
  temp: 29,
  condition: "Partly Cloudy",
  humidity: 38,
  wind: 14,
  uv: 9,
  pressure: 1012,
  feelsLike: 31,
  forecast: [
    { day: "Mon", hi: 30, lo: 17, icon: "sun", rain: 5 },
    { day: "Tue", hi: 31, lo: 18, icon: "sun", rain: 0 },
    { day: "Wed", hi: 29, lo: 17, icon: "cloud", rain: 20 },
    { day: "Thu", hi: 27, lo: 16, icon: "rain", rain: 65 },
    { day: "Fri", hi: 28, lo: 16, icon: "cloud", rain: 35 },
  ],
};

// ---------------------------------------------------------------------------
// AI recommendations / decision support
// ---------------------------------------------------------------------------
export interface Recommendation {
  id: string;
  title: string;
  detail: string;
  action: string;
  risk: RiskLevel;
  district: string;
  confidence: number; // %
  impact: string;
  category: "planting" | "irrigation" | "seeds" | "livestock" | "water" | "monitoring";
}

export const recommendations: Recommendation[] = [
  { id: "r1", title: "Delay planting in Kirehe", detail: "Soil moisture at 14% and seasonal rainfall forecast below the 20th percentile. Planting now risks 60–75% germination failure.", action: "Delay planting 2–3 weeks", risk: "high", district: "Kirehe", confidence: 91, impact: "Protects ~48,000 ha of maize", category: "planting" },
  { id: "r2", title: "Irrigate immediately — Nyagatare", detail: "WRSI dropped to 0.58. Crops entering critical flowering stage with acute water deficit over the next 10 days.", action: "Activate supplemental irrigation", risk: "high", district: "Nyagatare", confidence: 87, impact: "Saves est. 12,400 t yield", category: "irrigation" },
  { id: "r3", title: "Deploy drought-resistant seeds", detail: "Distribute certified drought-tolerant maize (ZM523) and bean varieties across high-risk Eastern districts ahead of Season B.", action: "Pre-position seed stock", risk: "high", district: "Kayonza", confidence: 84, impact: "Covers 31,000 smallholders", category: "seeds" },
  { id: "r4", title: "Livestock relocation advisory", detail: "Pasture NDVI down 22% and surface water bodies shrinking. Move herds toward Akagera buffer grazing corridors.", action: "Issue relocation guidance", risk: "moderate", district: "Bugesera", confidence: 79, impact: "~26,000 cattle affected", category: "livestock" },
  { id: "r5", title: "Water conservation measures", detail: "Reservoir levels at 61%. Promote drip irrigation, mulching, and rainwater harvesting in moderate-risk sectors.", action: "Launch conservation campaign", risk: "moderate", district: "Gatsibo", confidence: 82, impact: "Cuts water use ~18%", category: "water" },
  { id: "r6", title: "Increase extension monitoring", detail: "Deploy additional field officers and drone flights to validate satellite stress signals in emerging hotspots.", action: "Schedule 3 drone missions", risk: "moderate", district: "Huye", confidence: 76, impact: "Improves early detection", category: "monitoring" },
];

// ---------------------------------------------------------------------------
// Alerts
// ---------------------------------------------------------------------------
export interface Alert {
  id: string;
  type: "drought" | "heatwave" | "soil" | "flood" | "sensor";
  title: string;
  district: string;
  severity: RiskLevel;
  time: string;
  message: string;
  channels: ("sms" | "email" | "push")[];
  acknowledged: boolean;
}

export const alerts: Alert[] = [
  { id: "a1", type: "drought", title: "Severe drought conditions", district: "Kirehe", severity: "high", time: "12 min ago", message: "30-day rainfall 68% below normal. Soil moisture critical. Immediate intervention advised.", channels: ["sms", "email", "push"], acknowledged: false },
  { id: "a2", type: "heatwave", title: "Heatwave probability rising", district: "Nyagatare", severity: "high", time: "48 min ago", message: "LST projected to exceed 36°C for 5+ consecutive days. Livestock heat stress risk elevated.", channels: ["sms", "email"], acknowledged: false },
  { id: "a3", type: "soil", title: "Low soil moisture threshold breached", district: "Kayonza", severity: "moderate", time: "2 hrs ago", message: "Sensor cluster KYZ-04 reporting <18% volumetric water content across 6 sensors.", channels: ["email", "push"], acknowledged: true },
  { id: "a4", type: "sensor", title: "Sensor failure detected", district: "Gatsibo", severity: "moderate", time: "3 hrs ago", message: "IoT node GTB-11 offline for 6 hours. Battery at 4%. Field technician dispatched.", channels: ["email"], acknowledged: false },
  { id: "a5", type: "flood", title: "Flash flood watch", district: "Rubavu", severity: "moderate", time: "5 hrs ago", message: "Heavy convective rainfall (108mm/30d) with saturated soils. Low-lying sectors at risk.", channels: ["sms", "email", "push"], acknowledged: true },
  { id: "a6", type: "drought", title: "Emerging dry spell", district: "Bugesera", severity: "moderate", time: "8 hrs ago", message: "NDVI declining trend detected over 3 consecutive Sentinel-2 passes.", channels: ["email"], acknowledged: true },
];

// ---------------------------------------------------------------------------
// Time-series data (analytics + earth observation)
// ---------------------------------------------------------------------------
const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

export const ndviTrend = months.map((m, i) => ({
  month: m,
  ndvi: +(0.62 - Math.sin(i / 2) * 0.06 - i * 0.012 + (i > 6 ? -0.05 : 0)).toFixed(2),
  baseline: +(0.6 - Math.sin(i / 2) * 0.04).toFixed(2),
}));

export const rainfallTrend = months.map((m, i) => ({
  month: m,
  rainfall: Math.max(4, Math.round(80 + Math.sin(i / 1.7) * 55 - i * 3)),
  normal: Math.round(90 + Math.sin(i / 1.7) * 50),
}));

export const tempAnomaly = months.map((m, i) => ({
  month: m,
  anomaly: +(0.4 + i * 0.11 + Math.sin(i) * 0.3).toFixed(2),
}));

export const soilMoistureTrend = months.map((m, i) => ({
  month: m,
  moisture: Math.max(12, Math.round(45 - i * 1.6 + Math.sin(i / 2) * 6)),
}));

export const waterAvailability = months.map((m, i) => ({
  month: m,
  level: Math.max(48, Math.round(82 - i * 2.1 + Math.sin(i / 2.5) * 5)),
}));

export const riskPrediction = months.map((m, i) => ({
  month: m,
  predicted: Math.min(95, Math.round(35 + i * 4.2 + Math.sin(i) * 5)),
  confidence: Math.max(60, Math.round(88 - i * 1.2)),
}));

// ---------------------------------------------------------------------------
// Climate forecast module
// ---------------------------------------------------------------------------
export const forecastCards = [
  { key: "rainfall", title: "Seasonal Rainfall Forecast", value: "Below Normal", detail: "−28% vs 1991–2020 climatology", confidence: 78, risk: "high" as RiskLevel, trend: -28 },
  { key: "heatwave", title: "Heatwave Probability", value: "64%", detail: "Next 30 days, Eastern Province", confidence: 71, risk: "high" as RiskLevel, trend: 15 },
  { key: "soil", title: "Soil Moisture Forecast", value: "Declining", detail: "Projected 19% by week 4", confidence: 83, risk: "high" as RiskLevel, trend: -21 },
  { key: "wrsi", title: "Water Requirement Satisfaction (WRSI)", value: "0.58", detail: "Below adequate threshold (0.75)", confidence: 80, risk: "high" as RiskLevel, trend: -12 },
];

export const seasonalOutlook = Array.from({ length: 12 }, (_, i) => ({
  week: `W${i + 1}`,
  forecast: Math.max(5, Math.round(60 + Math.sin(i / 2) * 40 - i * 3)),
  lower: Math.max(0, Math.round(40 + Math.sin(i / 2) * 30 - i * 3)),
  upper: Math.round(85 + Math.sin(i / 2) * 45 - i * 2),
}));

// ---------------------------------------------------------------------------
// IoT sensors
// ---------------------------------------------------------------------------
export interface Sensor {
  id: string;
  name: string;
  district: string;
  lat: number;
  lng: number;
  temp: number;
  humidity: number;
  soilMoisture: number;
  rainfall: number;
  wind: number;
  battery: number;
  status: "online" | "offline" | "warning";
  lastSeen: string;
}

export const sensors: Sensor[] = [
  { id: "KRH-01", name: "Kirehe Field A", district: "Kirehe", lat: -2.25, lng: 30.72, temp: 34.1, humidity: 29, soilMoisture: 13, rainfall: 0, wind: 16, battery: 82, status: "warning", lastSeen: "1 min ago" },
  { id: "NYG-02", name: "Nyagatare Ranch", district: "Nyagatare", lat: -1.29, lng: 30.33, temp: 33.4, humidity: 31, soilMoisture: 16, rainfall: 0, wind: 19, battery: 67, status: "online", lastSeen: "2 min ago" },
  { id: "KYZ-04", name: "Kayonza Cluster", district: "Kayonza", lat: -1.88, lng: 30.61, temp: 32.6, humidity: 34, soilMoisture: 17, rainfall: 1, wind: 12, battery: 91, status: "online", lastSeen: "just now" },
  { id: "BGS-07", name: "Bugesera South", district: "Bugesera", lat: -2.21, lng: 30.14, temp: 31.2, humidity: 40, soilMoisture: 22, rainfall: 3, wind: 9, battery: 45, status: "online", lastSeen: "4 min ago" },
  { id: "GTB-11", name: "Gatsibo North", district: "Gatsibo", lat: -1.58, lng: 30.45, temp: 0, humidity: 0, soilMoisture: 0, rainfall: 0, wind: 0, battery: 4, status: "offline", lastSeen: "6 hrs ago" },
  { id: "MSZ-03", name: "Musanze Highland", district: "Musanze", lat: -1.5, lng: 29.63, temp: 23.8, humidity: 61, soilMoisture: 44, rainfall: 8, wind: 7, battery: 88, status: "online", lastSeen: "1 min ago" },
  { id: "RBV-05", name: "Rubavu Lakeside", district: "Rubavu", lat: -1.68, lng: 29.35, temp: 23.1, humidity: 66, soilMoisture: 47, rainfall: 11, wind: 6, battery: 73, status: "online", lastSeen: "3 min ago" },
  { id: "HUY-09", name: "Huye Research Plot", district: "Huye", lat: -2.6, lng: 29.74, temp: 27.4, humidity: 48, soilMoisture: 28, rainfall: 2, wind: 8, battery: 59, status: "online", lastSeen: "2 min ago" },
];

export const sensorLiveSeries = Array.from({ length: 24 }, (_, i) => ({
  hour: `${i}:00`,
  temp: +(24 + Math.sin((i - 6) / 3.8) * 8).toFixed(1),
  humidity: Math.round(55 - Math.sin((i - 6) / 3.8) * 22),
  soil: Math.round(24 + Math.cos(i / 5) * 3),
}));

// ---------------------------------------------------------------------------
// Drone analytics
// ---------------------------------------------------------------------------
export interface DroneMission {
  id: string;
  name: string;
  district: string;
  date: string;
  area: number; // ha
  status: "completed" | "processing" | "scheduled";
  healthScore: number; // %
  stressDetected: number; // %
  images: number;
}

export const droneMissions: DroneMission[] = [
  { id: "DM-231", name: "Kirehe Maize Survey", district: "Kirehe", date: "2026-07-27", area: 420, status: "completed", healthScore: 58, stressDetected: 34, images: 1240 },
  { id: "DM-230", name: "Nyagatare Pasture Scan", district: "Nyagatare", date: "2026-07-25", area: 680, status: "completed", healthScore: 62, stressDetected: 28, images: 1890 },
  { id: "DM-229", name: "Kayonza Bean Fields", district: "Kayonza", date: "2026-07-24", area: 310, status: "completed", healthScore: 71, stressDetected: 19, images: 940 },
  { id: "DM-232", name: "Bugesera Irrigation Check", district: "Bugesera", date: "2026-07-28", area: 250, status: "processing", healthScore: 0, stressDetected: 0, images: 720 },
  { id: "DM-233", name: "Gatsibo Crop Audit", district: "Gatsibo", date: "2026-07-30", area: 540, status: "scheduled", healthScore: 0, stressDetected: 0, images: 0 },
];

// ---------------------------------------------------------------------------
// Earth observation datasets
// ---------------------------------------------------------------------------
export const eoDatasets = [
  { name: "Sentinel-2 L2A", provider: "ESA Copernicus", resolution: "10 m", revisit: "5 days", status: "active", lastPass: "6 hrs ago" },
  { name: "Landsat 9 OLI-2", provider: "USGS / NASA", resolution: "30 m", revisit: "16 days", status: "active", lastPass: "2 days ago" },
  { name: "Fractional Cover", provider: "Digital Earth Africa", resolution: "30 m", revisit: "monthly", status: "active", lastPass: "5 days ago" },
  { name: "WOfS (Water Obs.)", provider: "Digital Earth Africa", resolution: "30 m", revisit: "monthly", status: "active", lastPass: "5 days ago" },
  { name: "NDVI Composite", provider: "MODIS / Sentinel", resolution: "250 m", revisit: "daily", status: "active", lastPass: "3 hrs ago" },
];

export const fractionalCover = [
  { name: "Green Vegetation", value: 34, color: "#10b981" },
  { name: "Non-green Vegetation", value: 41, color: "#f59e0b" },
  { name: "Bare Soil", value: 25, color: "#a16207" },
];

// ---------------------------------------------------------------------------
// Reports
// ---------------------------------------------------------------------------
export const reports = [
  { id: "RPT-0091", title: "Eastern Province Drought Risk Assessment", type: "Risk Summary", date: "2026-07-28", author: "AI Engine + Dr. Uwase", pages: 14, status: "ready" },
  { id: "RPT-0090", title: "Season B Planting Advisory — National", type: "Recommendation", date: "2026-07-26", author: "AI Engine", pages: 22, status: "ready" },
  { id: "RPT-0089", title: "Kirehe Multi-Hazard Vulnerability Report", type: "Vulnerability", date: "2026-07-24", author: "AI Engine + Ext. Team", pages: 9, status: "ready" },
  { id: "RPT-0088", title: "Q2 Climate & Water Availability Review", type: "Analytics", date: "2026-07-15", author: "Research Division", pages: 31, status: "ready" },
  { id: "RPT-0092", title: "Nyagatare Livestock Heat Stress Brief", type: "Risk Summary", date: "2026-07-29", author: "AI Engine", pages: 7, status: "generating" },
];

// ---------------------------------------------------------------------------
// Users
// ---------------------------------------------------------------------------
export type UserRole = "Administrator" | "Government" | "Researcher" | "Extension Officer" | "Farmer";

export interface AppUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  district: string;
  status: "active" | "invited" | "suspended";
  lastActive: string;
  avatar: string;
}

export const users: AppUser[] = [
  { id: "u1", name: "Happy Muyombano", email: "muyombanohappy@gmail.com", role: "Administrator", district: "Kigali", status: "active", lastActive: "now", avatar: "HM" },
  { id: "u2", name: "Dr. Claudine Uwase", email: "c.uwase@rab.gov.rw", role: "Researcher", district: "Huye", status: "active", lastActive: "12 min ago", avatar: "CU" },
  { id: "u3", name: "Jean-Paul Habimana", email: "jp.habimana@minagri.gov.rw", role: "Government", district: "Kigali", status: "active", lastActive: "1 hr ago", avatar: "JH" },
  { id: "u4", name: "Aline Mukamana", email: "a.mukamana@ext.rw", role: "Extension Officer", district: "Kirehe", status: "active", lastActive: "3 hrs ago", avatar: "AM" },
  { id: "u5", name: "Emmanuel Nkurunziza", email: "e.nkurunziza@ext.rw", role: "Extension Officer", district: "Nyagatare", status: "active", lastActive: "5 hrs ago", avatar: "EN" },
  { id: "u6", name: "Esperance Uwimana", email: "esperance.farm@gmail.com", role: "Farmer", district: "Kayonza", status: "active", lastActive: "1 day ago", avatar: "EU" },
  { id: "u7", name: "Patrick Bizimana", email: "p.bizimana@gmail.com", role: "Farmer", district: "Bugesera", status: "invited", lastActive: "—", avatar: "PB" },
  { id: "u8", name: "Sandrine Ingabire", email: "s.ingabire@rab.gov.rw", role: "Researcher", district: "Musanze", status: "suspended", lastActive: "2 weeks ago", avatar: "SI" },
];

export const rolePermissions: Record<UserRole, string[]> = {
  Administrator: ["Full system access", "User management", "Configure alerts", "Export all data", "Manage integrations"],
  Government: ["National dashboards", "All district reports", "Policy analytics", "Export reports"],
  Researcher: ["Earth observation data", "Analytics & models", "Historical archives", "Export datasets"],
  "Extension Officer": ["District dashboards", "Field alerts", "Drone missions", "Farmer advisories"],
  Farmer: ["Local weather", "Personal advisories", "SMS alerts", "Crop recommendations"],
};

// ---------------------------------------------------------------------------
// Risk engine — input layers combined into vulnerability score
// ---------------------------------------------------------------------------
export const riskLayers = [
  { name: "Satellite Observations", weight: 30, signal: 78, source: "Sentinel-2 / MODIS NDVI, LST" },
  { name: "Climate Model Outputs", weight: 25, signal: 71, source: "Seasonal forecast, WRSI" },
  { name: "IoT Sensor Data", weight: 25, signal: 84, source: "Soil moisture, temp, rainfall" },
  { name: "Drone Imagery", weight: 20, signal: 66, source: "Crop stress, canopy health" },
];

export const kpis = {
  districtsMonitored: 30,
  activeSensors: 247,
  activeAlerts: 6,
  farmersReached: 128500,
  hectaresMonitored: 1840000,
  droneMissions: 233,
};

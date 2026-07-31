import {
  LayoutDashboard,
  Map,
  Brain,
  ShieldAlert,
  Satellite,
  CloudRain,
  Cpu,
  BellRing,
  FileText,
  BarChart3,
  Users,
  type LucideIcon,
} from "lucide-react";

export interface NavItem {
  label: string;
  href: string;
  icon: LucideIcon;
  badge?: string;
  group: "Overview" | "Intelligence" | "Data Sources" | "Operations";
}

export const navItems: NavItem[] = [
  { label: "Dashboard", href: "/", icon: LayoutDashboard, group: "Overview" },
  { label: "GIS Map", href: "/map", icon: Map, group: "Overview" },
  { label: "Analytics", href: "/analytics", icon: BarChart3, group: "Overview" },

  { label: "AI Decision Support", href: "/decision-support", icon: Brain, group: "Intelligence" },
  { label: "Multi-Hazard Risk", href: "/risk-engine", icon: ShieldAlert, group: "Intelligence" },
  { label: "Climate Forecast", href: "/forecast", icon: CloudRain, group: "Intelligence" },

  { label: "Earth Observation", href: "/earth-observation", icon: Satellite, group: "Data Sources" },
  { label: "IoT Monitoring", href: "/iot", icon: Cpu, group: "Data Sources" },

  { label: "Alert Center", href: "/alerts", icon: BellRing, badge: "6", group: "Operations" },
  { label: "Reports", href: "/reports", icon: FileText, group: "Operations" },
  { label: "User Management", href: "/users", icon: Users, group: "Operations" },
];

export const navGroups = ["Overview", "Intelligence", "Data Sources", "Operations"] as const;

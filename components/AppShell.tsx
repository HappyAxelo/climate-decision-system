"use client";

import { useState, useEffect, ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Leaf,
  Menu,
  X,
  Search,
  Bell,
  Moon,
  Sun,
  ChevronDown,
} from "lucide-react";
import { navItems, navGroups } from "./nav";

function Brand() {
  return (
    <Link href="/" className="flex items-center gap-2.5">
      <div className="grid h-8 w-8 place-items-center rounded-md bg-brand-600 text-white">
        <Leaf size={17} />
      </div>
      <div className="leading-tight">
        <div className="text-sm font-semibold tracking-tight">CAIP</div>
        <div className="text-[10px] font-medium uppercase tracking-wider text-ink-400">
          Climate Intelligence
        </div>
      </div>
    </Link>
  );
}

function SidebarContent({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();
  return (
    <nav className="flex flex-1 flex-col gap-6 overflow-y-auto px-3 py-5">
      {navGroups.map((group) => (
        <div key={group}>
          <p className="mb-2 px-3 text-[10px] font-semibold uppercase tracking-wider text-ink-400">
            {group}
          </p>
          <div className="space-y-0.5">
            {navItems
              .filter((i) => i.group === group)
              .map((item) => {
                const active = pathname === item.href;
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={onNavigate}
                    className={`group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors ${
                      active
                        ? "bg-brand-500/10 text-brand-700 dark:text-brand-400"
                        : "text-ink-600 hover:bg-ink-100 dark:text-ink-300 dark:hover:bg-ink-800"
                    }`}
                  >
                    {active && (
                      <motion.span
                        layoutId="active-pill"
                        className="absolute left-0 top-1/2 h-6 w-1 -translate-y-1/2 rounded-r-full bg-brand-500"
                      />
                    )}
                    <Icon size={18} className={active ? "text-brand-600 dark:text-brand-400" : ""} />
                    <span className="flex-1">{item.label}</span>
                    {item.badge && (
                      <span className="grid h-5 min-w-5 place-items-center rounded-full bg-rose-500 px-1.5 text-[10px] font-bold text-white">
                        {item.badge}
                      </span>
                    )}
                  </Link>
                );
              })}
          </div>
        </div>
      ))}
    </nav>
  );
}

export default function AppShell({ children }: { children: ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dark, setDark] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("caip-theme");
    const prefers = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const isDark = stored ? stored === "dark" : prefers;
    setDark(isDark);
    document.documentElement.classList.toggle("dark", isDark);
  }, []);

  const toggleTheme = () => {
    const next = !dark;
    setDark(next);
    document.documentElement.classList.toggle("dark", next);
    localStorage.setItem("caip-theme", next ? "dark" : "light");
  };

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Desktop sidebar */}
      <aside className="hidden w-64 shrink-0 flex-col border-r border-ink-200 bg-white lg:flex dark:border-ink-800 dark:bg-ink-900">
        <div className="flex h-16 items-center border-b border-ink-200 px-5 dark:border-ink-800">
          <Brand />
        </div>
        <SidebarContent />
        <div className="border-t border-ink-200 p-3 dark:border-ink-800">
          <div className="flex items-center gap-3 rounded-lg bg-ink-50 p-3 dark:bg-ink-950">
            <div className="grid h-9 w-9 place-items-center rounded-full bg-ink-800 text-xs font-semibold text-white dark:bg-ink-700">
              HM
            </div>
            <div className="min-w-0 flex-1">
              <div className="truncate text-sm font-semibold">Happy Muyombano</div>
              <div className="truncate text-xs text-ink-400">Administrator</div>
            </div>
            <ChevronDown size={16} className="text-ink-400" />
          </div>
        </div>
      </aside>

      {/* Mobile sidebar */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
              className="fixed inset-0 z-40 bg-black/40 lg:hidden"
            />
            <motion.aside
              initial={{ x: -300 }}
              animate={{ x: 0 }}
              exit={{ x: -300 }}
              transition={{ type: "spring", damping: 26, stiffness: 260 }}
              className="fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-ink-200 bg-white lg:hidden dark:border-ink-800 dark:bg-ink-900"
            >
              <div className="flex h-16 items-center justify-between border-b border-ink-200 px-5 dark:border-ink-800">
                <Brand />
                <button onClick={() => setMobileOpen(false)} className="text-ink-400">
                  <X size={20} />
                </button>
              </div>
              <SidebarContent onNavigate={() => setMobileOpen(false)} />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main area */}
      <div className="flex flex-1 flex-col overflow-hidden">
        <header className="flex h-16 shrink-0 items-center gap-3 border-b border-ink-200 bg-white/80 px-4 backdrop-blur dark:border-ink-800 dark:bg-ink-900/80 sm:px-6">
          <button
            onClick={() => setMobileOpen(true)}
            className="grid h-9 w-9 place-items-center rounded-lg text-ink-500 hover:bg-ink-100 lg:hidden dark:hover:bg-ink-800"
          >
            <Menu size={20} />
          </button>

          <div className="relative hidden max-w-md flex-1 sm:block">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-400" />
            <input
              placeholder="Search districts, sensors, reports…"
              className="w-full rounded-xl border border-ink-200 bg-ink-50 py-2 pl-9 pr-3 text-sm outline-none transition focus:border-brand-400 focus:bg-white dark:border-ink-800 dark:bg-ink-950 dark:focus:bg-ink-900"
            />
          </div>

          <div className="flex flex-1 items-center justify-end gap-1">
            <span className="mr-1 hidden text-xs text-ink-400 md:inline">Updated 4 min ago</span>
            <button
              onClick={toggleTheme}
              aria-label="Toggle theme"
              className="grid h-9 w-9 place-items-center rounded-lg text-ink-500 hover:bg-ink-100 dark:hover:bg-ink-800"
            >
              {dark ? <Sun size={18} /> : <Moon size={18} />}
            </button>
            <button aria-label="Notifications" className="relative grid h-9 w-9 place-items-center rounded-lg text-ink-500 hover:bg-ink-100 dark:hover:bg-ink-800">
              <Bell size={18} />
              <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-rose-500" />
            </button>
            <div className="ml-1 grid h-9 w-9 place-items-center rounded-full bg-ink-800 text-xs font-semibold text-white lg:hidden dark:bg-ink-700">
              HM
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto bg-ink-50 p-4 dark:bg-ink-950 sm:p-6">
          <div className="mx-auto max-w-[1400px]">{children}</div>
        </main>
      </div>
    </div>
  );
}

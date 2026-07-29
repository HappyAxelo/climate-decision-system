"use client";

import { useState } from "react";
import {
  Users as UsersIcon,
  Shield,
  Landmark,
  FlaskConical,
  HeartHandshake,
  Sprout,
  UserPlus,
  Check,
  MoreVertical,
} from "lucide-react";
import { users, rolePermissions, UserRole } from "@/lib/mockData";
import { PageHeader, Card, Chip, SectionTitle } from "@/components/ui";

const roleIcon: Record<UserRole, any> = {
  Administrator: Shield,
  Government: Landmark,
  Researcher: FlaskConical,
  "Extension Officer": HeartHandshake,
  Farmer: Sprout,
};

const roleColor: Record<UserRole, string> = {
  Administrator: "#8b5cf6",
  Government: "#0ea5e9",
  Researcher: "#f59e0b",
  "Extension Officer": "#10b981",
  Farmer: "#84cc16",
};

const statusChip: Record<string, "green" | "amber" | "red"> = {
  active: "green",
  invited: "amber",
  suspended: "red",
};

export default function UsersPage() {
  const [role, setRole] = useState<UserRole | "All">("All");

  const roles = Object.keys(rolePermissions) as UserRole[];
  const filtered = role === "All" ? users : users.filter((u) => u.role === role);

  const counts = roles.map((r) => ({
    role: r,
    count: users.filter((u) => u.role === r).length,
  }));

  return (
    <div className="space-y-6">
      <PageHeader
        title="User Management"
        subtitle="Role-based access for administrators, governments, researchers, officers & farmers"
        icon={UsersIcon}
        actions={
          <button className="flex items-center gap-2 rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-700">
            <UserPlus size={16} /> Invite User
          </button>
        }
      />

      {/* Role cards */}
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-5">
        {counts.map((c, i) => {
          const Icon = roleIcon[c.role];
          return (
            <button
              key={c.role}
              onClick={() => setRole(role === c.role ? "All" : c.role)}
              className={`surface p-4 text-left transition ${
                role === c.role ? "ring-1 ring-brand-500" : "hover:border-ink-300 dark:hover:border-ink-700"
              }`}
            >
              <div
                className="grid h-10 w-10 place-items-center rounded-xl"
                style={{ backgroundColor: `${roleColor[c.role]}1a`, color: roleColor[c.role] }}
              >
                <Icon size={19} />
              </div>
              <div className="mt-3 text-2xl font-semibold">{c.count}</div>
              <div className="text-xs font-medium text-ink-500">{c.role}</div>
            </button>
          );
        })}
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        {/* User table */}
        <Card className="!p-0 overflow-hidden lg:col-span-2">
          <div className="flex items-center justify-between border-b border-ink-200 p-4 dark:border-ink-800">
            <h3 className="text-sm font-semibold">
              Users {role !== "All" && `· ${role}`}
              <span className="ml-2 text-ink-400">({filtered.length})</span>
            </h3>
            {role !== "All" && (
              <button onClick={() => setRole("All")} className="text-xs font-medium text-brand-600 hover:underline">
                Clear filter
              </button>
            )}
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[560px] text-sm">
              <thead className="bg-ink-50 text-xs uppercase text-ink-400 dark:bg-ink-950">
                <tr>
                  <th className="px-4 py-2.5 text-left font-medium">User</th>
                  <th className="px-4 py-2.5 text-left font-medium">Role</th>
                  <th className="px-4 py-2.5 text-left font-medium">District</th>
                  <th className="px-4 py-2.5 text-left font-medium">Status</th>
                  <th className="px-4 py-2.5 text-left font-medium">Active</th>
                  <th className="px-4 py-2.5"></th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((u, i) => (
                  <tr
                    key={u.id}
                    className="border-t border-ink-100 hover:bg-ink-50 dark:border-ink-800 dark:hover:bg-ink-950"
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2.5">
                        <div
                          className="grid h-8 w-8 shrink-0 place-items-center rounded-full text-xs font-bold text-white"
                          style={{ backgroundColor: roleColor[u.role] }}
                        >
                          {u.avatar}
                        </div>
                        <div className="min-w-0">
                          <div className="truncate font-medium">{u.name}</div>
                          <div className="truncate text-xs text-ink-400">{u.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="font-medium" style={{ color: roleColor[u.role] }}>
                        {u.role}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-ink-500">{u.district}</td>
                    <td className="px-4 py-3">
                      <Chip tone={statusChip[u.status]}>{u.status}</Chip>
                    </td>
                    <td className="px-4 py-3 text-xs text-ink-400">{u.lastActive}</td>
                    <td className="px-4 py-3 text-right">
                      <button className="grid h-7 w-7 place-items-center rounded-md text-ink-400 hover:bg-ink-100 dark:hover:bg-ink-800">
                        <MoreVertical size={15} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        {/* Permissions matrix */}
        <Card>
          <SectionTitle>Role Permissions</SectionTitle>
          <div className="space-y-4">
            {roles.map((r) => {
              const Icon = roleIcon[r];
              return (
                <div key={r}>
                  <div className="mb-1.5 flex items-center gap-2">
                    <Icon size={15} style={{ color: roleColor[r] }} />
                    <span className="text-sm font-semibold">{r}</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5 pl-6">
                    {rolePermissions[r].map((p) => (
                      <span
                        key={p}
                        className="inline-flex items-center gap-1 rounded-md bg-ink-100 px-2 py-0.5 text-xs text-ink-600 dark:bg-ink-800 dark:text-ink-300"
                      >
                        <Check size={10} className="text-emerald-500" /> {p}
                      </span>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      </div>
    </div>
  );
}

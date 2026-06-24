"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import SalaryTable from "@/components/SalaryTable";
import FilterBar from "@/components/FilterBar";

interface Stats {
  totalEntries: number;
  totalCompanies: number;
  avgTc: number;
  topRoles: { role: string; count: number; avgTc: number }[];
}

export default function HomePage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [filters, setFilters] = useState<Record<string, string>>({});

  useEffect(() => {
    fetch("/api/stats")
      .then((r) => r.json())
      .then(setStats)
      .catch(() => {});
  }, []);

  const fmt = (n: number) =>
    n >= 1_000_000
      ? `$${(n / 1_000_000).toFixed(1)}M`
      : n >= 1_000
      ? `$${Math.round(n / 1_000)}K`
      : `$${n}`;

  return (
    <div className="page-container" style={{ paddingTop: 48, paddingBottom: 80 }}>
      {/* Hero */}
      <div style={{ marginBottom: 48, textAlign: "center" }}>
        <div style={{
          display: "inline-block",
          padding: "4px 14px",
          borderRadius: 100,
          background: "var(--accent-dim)",
          color: "var(--accent-light)",
          fontSize: 12,
          fontWeight: 500,
          marginBottom: 20,
          letterSpacing: "0.04em",
        }}>
          LEVELS MATTER MORE THAN TITLES
        </div>
        <h1 style={{ fontSize: 48, fontWeight: 800, letterSpacing: "-0.03em", margin: "0 0 16px", lineHeight: 1.1 }}>
          Real compensation,<br />
          <span style={{ color: "var(--accent)" }}>by level</span>
        </h1>
        <p style={{ color: "var(--text-secondary)", fontSize: 18, maxWidth: 480, margin: "0 auto 36px", lineHeight: 1.6 }}>
          Compare salaries with full TC breakdowns — base, bonus, and equity — across roles, companies, and locations.
        </p>

        {/* Stats row */}
        {stats && (
          <div style={{ display: "flex", gap: 24, justifyContent: "center", marginBottom: 40, flexWrap: "wrap" }}>
            {[
              { label: "Salary entries", value: stats.totalEntries.toLocaleString() },
              { label: "Companies", value: stats.totalCompanies.toLocaleString() },
              { label: "Avg total comp", value: fmt(stats.avgTc) },
            ].map((s) => (
              <div key={s.label} className="stat-card" style={{ textAlign: "left", minWidth: 160 }}>
                <div style={{ fontSize: 28, fontWeight: 700, letterSpacing: "-0.02em" }}>{s.value}</div>
                <div style={{ fontSize: 13, color: "var(--text-secondary)", marginTop: 4 }}>{s.label}</div>
              </div>
            ))}
          </div>
        )}

        {/* Top roles chips */}
        {stats && stats.topRoles.length > 0 && (
          <div style={{ display: "flex", gap: 8, justifyContent: "center", flexWrap: "wrap" }}>
            {stats.topRoles.slice(0, 6).map((r) => (
              <button
                key={r.role}
                className="filter-chip"
                onClick={() => setFilters((f) => ({ ...f, role: r.role }))}
              >
                {r.role}
                <span style={{ color: "var(--text-muted)", fontSize: 11 }}>
                  {fmt(r.avgTc)} avg
                </span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Filters + Table */}
      <FilterBar filters={filters} onChange={setFilters} />
      <div style={{ marginTop: 16 }}>
        <SalaryTable filters={filters} onFilterChange={setFilters} />
      </div>
    </div>
  );
}

"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { formatCurrency } from "@/lib/utils";

interface CompanyData {
  company: { name: string; slug: string; website: string | null; industry: string | null };
  stats: { count: number; avgTc: number; maxTc: number; minTc: number };
  levelBreakdown: { level: string; avg: number; count: number; min: number; max: number }[];
  recentSalaries: {
    id: string; role: string; level: string; yearsOfExp: number;
    baseSalary: number; bonus: number; stockPerYear: number; totalComp: number;
    location: { city: string; country: string };
  }[];
}

export default function CompanyPage() {
  const { slug } = useParams<{ slug: string }>();
  const [data, setData] = useState<CompanyData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/companies/${slug}`)
      .then((r) => r.json())
      .then((j) => setData(j.data))
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) {
    return (
      <div className="page-container" style={{ paddingTop: 48 }}>
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="skeleton" style={{ height: 80, marginBottom: 16, borderRadius: 12 }} />
        ))}
      </div>
    );
  }

  if (!data) {
    return (
      <div className="page-container" style={{ paddingTop: 80, textAlign: "center" }}>
        <p style={{ color: "var(--text-secondary)" }}>Company not found.</p>
        <Link href="/companies" style={{ color: "var(--accent-light)" }}>← Back to companies</Link>
      </div>
    );
  }

  const { company, stats, levelBreakdown, recentSalaries } = data;
  const maxLevelAvg = levelBreakdown.length ? Math.max(...levelBreakdown.map((l) => l.avg)) : 1;

  return (
    <div className="page-container" style={{ paddingTop: 48, paddingBottom: 80 }}>
      {/* Header */}
      <div style={{ marginBottom: 36 }}>
        <Link href="/companies" style={{ fontSize: 13, color: "var(--text-muted)", textDecoration: "none" }}>
          ← Companies
        </Link>
        <div style={{ display: "flex", alignItems: "flex-start", gap: 20, marginTop: 16 }}>
          <div style={{
            width: 56, height: 56, borderRadius: 12,
            background: "var(--bg-hover)", border: "1px solid var(--border)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 22, fontWeight: 700, color: "var(--accent-light)", flexShrink: 0,
          }}>
            {company.name[0]}
          </div>
          <div>
            <h1 style={{ fontSize: 28, fontWeight: 800, letterSpacing: "-0.02em", margin: "0 0 4px" }}>
              {company.name}
            </h1>
            <div style={{ display: "flex", gap: 12, color: "var(--text-muted)", fontSize: 13 }}>
              {company.industry && <span>{company.industry}</span>}
              {company.website && (
                <a href={company.website} target="_blank" rel="noreferrer"
                  style={{ color: "var(--accent-light)", textDecoration: "none" }}>
                  Website ↗
                </a>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, marginBottom: 28 }}>
        {[
          { label: "Entries", value: stats.count.toString() },
          { label: "Avg TC", value: formatCurrency(stats.avgTc) },
          { label: "Max TC", value: formatCurrency(stats.maxTc) },
          { label: "Min TC", value: formatCurrency(stats.minTc) },
        ].map((s) => (
          <div key={s.label} className="stat-card">
            <div style={{ fontSize: 11, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 6 }}>
              {s.label}
            </div>
            <div style={{ fontSize: 22, fontWeight: 700, letterSpacing: "-0.01em" }}>{s.value}</div>
          </div>
        ))}
      </div>

      {/* Level breakdown */}
      {levelBreakdown.length > 0 && (
        <div className="card" style={{ padding: 24, marginBottom: 24 }}>
          <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 20 }}>Compensation by level</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {levelBreakdown.map((l) => (
              <div key={l.level}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, marginBottom: 6 }}>
                  <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                    <span className="badge badge-level">{l.level}</span>
                    <span style={{ color: "var(--text-muted)" }}>{l.count} {l.count === 1 ? "entry" : "entries"}</span>
                  </div>
                  <span style={{ fontWeight: 700 }}>{formatCurrency(l.avg)} avg</span>
                </div>
                <div style={{ position: "relative", height: 6, background: "var(--bg-hover)", borderRadius: 3, overflow: "hidden" }}>
                  <div style={{
                    position: "absolute",
                    left: `${(l.min / maxLevelAvg) * 100}%`,
                    width: `${((l.max - l.min) / maxLevelAvg) * 100}%`,
                    height: "100%",
                    background: "rgba(124,106,247,0.3)",
                    borderRadius: 3,
                  }} />
                  <div style={{
                    position: "absolute",
                    left: `${(l.avg / maxLevelAvg) * 100}%`,
                    transform: "translateX(-50%)",
                    width: 3, height: "100%",
                    background: "var(--accent)",
                    borderRadius: 2,
                  }} />
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: "var(--text-muted)", marginTop: 4 }}>
                  <span>{formatCurrency(l.min)}</span>
                  <span>{formatCurrency(l.max)}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recent salaries table */}
      <div className="card table-wrap">
        <div style={{ padding: "16px 20px", borderBottom: "1px solid var(--border)", fontSize: 14, fontWeight: 600 }}>
          Recent salary entries
        </div>
        <table>
          <thead>
            <tr>
              <th>Role</th>
              <th>Level</th>
              <th>Location</th>
              <th>YOE</th>
              <th>Base</th>
              <th>Bonus</th>
              <th>Equity/yr</th>
              <th>Total Comp</th>
            </tr>
          </thead>
          <tbody>
            {recentSalaries.map((s) => (
              <tr key={s.id}>
                <td style={{ color: "var(--text-secondary)" }}>{s.role}</td>
                <td><span className="badge badge-level">{s.level}</span></td>
                <td style={{ fontSize: 12, color: "var(--text-muted)" }}>{s.location.city}, {s.location.country}</td>
                <td style={{ color: "var(--text-muted)" }}>{s.yearsOfExp}y</td>
                <td>{formatCurrency(s.baseSalary)}</td>
                <td style={{ color: s.bonus > 0 ? "var(--green)" : "var(--text-muted)" }}>
                  {s.bonus > 0 ? `+${formatCurrency(s.bonus)}` : "—"}
                </td>
                <td style={{ color: s.stockPerYear > 0 ? "var(--amber)" : "var(--text-muted)" }}>
                  {s.stockPerYear > 0 ? `+${formatCurrency(s.stockPerYear)}` : "—"}
                </td>
                <td style={{ fontWeight: 700 }}>{formatCurrency(s.totalComp)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

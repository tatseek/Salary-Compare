"use client";
import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { formatCurrency, convertCurrency } from "@/lib/utils";

interface Entry {
  id: string;
  role: string;
  level: string;
  yearsOfExp: number;
  baseSalary: number;
  bonus: number;
  stockPerYear: number;
  totalComp: number;
  currency: string;
  remote: boolean;
  submittedAt: string;
  company: { name: string; slug: string; industry: string | null };
  location: { city: string; state: string | null; country: string; region: string };
}

interface Meta { total: number; page: number; pageSize: number; totalPages: number; }

interface Props {
  filters: Record<string, string>;
  onFilterChange: (f: Record<string, string>) => void;
}

const SORT_OPTIONS = [
  { label: "TC ↓", sortBy: "totalComp", sortOrder: "desc" },
  { label: "TC ↑", sortBy: "totalComp", sortOrder: "asc" },
  { label: "Base ↓", sortBy: "baseSalary", sortOrder: "desc" },
  { label: "Recent", sortBy: "submittedAt", sortOrder: "desc" },
  { label: "YOE ↑", sortBy: "yearsOfExp", sortOrder: "asc" },
];

export default function SalaryTable({ filters, onFilterChange }: Props) {
  const [data, setData] = useState<Entry[]>([]);
  const [meta, setMeta] = useState<Meta | null>(null);
  const [loading, setLoading] = useState(true);
  const [compareIds, setCompareIds] = useState<Set<string>>(new Set());
  const [displayCurrency, setDisplayCurrency] = useState<"native" | "USD" | "INR">("native");

  const fetchData = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams();
    for (const [k, v] of Object.entries(filters)) { if (v) params.set(k, v); }
    try {
      const res = await fetch(`/api/salaries?${params}`);
      const json = await res.json();
      setData(json.data || []);
      setMeta(json.meta);
    } catch { setData([]); }
    finally { setLoading(false); }
  }, [filters]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const setSort = (sortBy: string, sortOrder: string) => {
    onFilterChange({ ...filters, sortBy, sortOrder, page: "1" });
  };

  const currentSort = `${filters.sortBy || "totalComp"}-${filters.sortOrder || "desc"}`;

  const toggleCompare = (id: string) => {
    const next = new Set(compareIds);
    if (next.has(id)) next.delete(id);
    else if (next.size < 3) next.add(id);
    setCompareIds(next);
  };

  // Convert amount for display
  const display = (amount: number, nativeCurrency: string) => {
    if (displayCurrency === "native") return formatCurrency(amount, nativeCurrency);
    const converted = convertCurrency(amount, nativeCurrency, displayCurrency);
    return formatCurrency(converted, displayCurrency);
  };

  const tcForBar = (entry: Entry) => {
    if (displayCurrency === "native") return entry.totalComp;
    return convertCurrency(entry.totalComp, entry.currency, displayCurrency);
  };

  const maxTc = data.length ? Math.max(...data.map(tcForBar)) : 1;

  return (
    <div>
      {/* Controls row */}
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12, flexWrap: "wrap" }}>
        {/* Sort chips */}
        <span style={{ fontSize: 13, color: "var(--text-secondary)", marginRight: 4 }}>Sort:</span>
        {SORT_OPTIONS.map((s) => (
          <button
            key={`${s.sortBy}-${s.sortOrder}`}
            className={`filter-chip ${currentSort === `${s.sortBy}-${s.sortOrder}` ? "active" : ""}`}
            onClick={() => setSort(s.sortBy, s.sortOrder)}
          >
            {s.label}
          </button>
        ))}

        {/* Currency display selector */}
        <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 6 }}>
          <span style={{ fontSize: 12, color: "var(--text-muted)" }}>Show as:</span>
          {(["native", "INR", "USD"] as const).map((c) => (
            <button
              key={c}
              onClick={() => setDisplayCurrency(c)}
              className={`filter-chip ${displayCurrency === c ? "active" : ""}`}
              style={{ fontSize: 11 }}
            >
              {c === "native" ? "Native" : c === "INR" ? "₹ INR" : "$ USD"}
            </button>
          ))}
        </div>

        {meta && (
          <span style={{ fontSize: 13, color: "var(--text-muted)", marginLeft: 8 }}>
            {meta.total.toLocaleString()} results
          </span>
        )}

        {compareIds.size >= 2 && (
          <Link
            href={`/compare?${Array.from(compareIds).map((id) => `id=${id}`).join("&")}&displayCurrency=${displayCurrency}`}
            className="btn-primary"
            style={{ textDecoration: "none", fontSize: 12, padding: "6px 14px" }}
          >
            Compare {compareIds.size} →
          </Link>
        )}
      </div>

      {displayCurrency !== "native" && (
        <div style={{ fontSize: 12, color: "var(--text-muted)", marginBottom: 10, padding: "6px 12px", background: "var(--bg-hover)", borderRadius: 6, display: "inline-block" }}>
          ≈ Converted at 1 USD = ₹84 · Approximate only
        </div>
      )}

      <div className="card table-wrap">
        {loading ? (
          <div style={{ padding: 32 }}>
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="skeleton" style={{ height: 52, marginBottom: 8 }} />
            ))}
          </div>
        ) : data.length === 0 ? (
          <div style={{ padding: 64, textAlign: "center", color: "var(--text-muted)" }}>
            No results found. Try adjusting your filters.
          </div>
        ) : (
          <table>
            <thead>
              <tr>
                <th style={{ width: 36 }}></th>
                <th>Company</th>
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
              {data.map((entry) => {
                const tc = tcForBar(entry);
                const tcPct = (tc / maxTc) * 100;
                const selected = compareIds.has(entry.id);
                return (
                  <tr key={entry.id} style={{ background: selected ? "rgba(124,106,247,0.04)" : undefined }}>
                    <td>
                      <button
                        onClick={() => toggleCompare(entry.id)}
                        title={selected ? "Remove from compare" : "Add to compare (max 3)"}
                        style={{
                          width: 20, height: 20, borderRadius: 4,
                          border: `1.5px solid ${selected ? "var(--accent)" : "var(--border)"}`,
                          background: selected ? "var(--accent)" : "transparent",
                          cursor: "pointer", display: "flex", alignItems: "center",
                          justifyContent: "center", color: selected ? "#fff" : "transparent", fontSize: 11,
                        }}
                      >✓</button>
                    </td>
                    <td>
                      <Link href={`/companies/${entry.company.slug}`}
                        style={{ textDecoration: "none", color: "var(--text-primary)", fontWeight: 500 }}>
                        {entry.company.name}
                      </Link>
                      {entry.company.industry && (
                        <div style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 2 }}>{entry.company.industry}</div>
                      )}
                    </td>
                    <td style={{ color: "var(--text-secondary)" }}>{entry.role}</td>
                    <td><span className="badge badge-level">{entry.level}</span></td>
                    <td style={{ color: "var(--text-secondary)", fontSize: 12 }}>
                      {entry.location.city}
                      {entry.location.country === "IN"
                        ? entry.location.state ? `, ${entry.location.state}` : ", IN"
                        : entry.location.country !== "US"
                        ? `, ${entry.location.country}`
                        : entry.location.state ? `, ${entry.location.state}` : ""}
                      {entry.remote && <span className="badge badge-remote" style={{ marginLeft: 6 }}>Remote</span>}
                    </td>
                    <td style={{ color: "var(--text-muted)" }}>{entry.yearsOfExp}y</td>
                    <td>{display(entry.baseSalary, entry.currency)}</td>
                    <td style={{ color: entry.bonus > 0 ? "var(--green)" : "var(--text-muted)" }}>
                      {entry.bonus > 0 ? `+${display(entry.bonus, entry.currency)}` : "—"}
                    </td>
                    <td style={{ color: entry.stockPerYear > 0 ? "var(--amber)" : "var(--text-muted)" }}>
                      {entry.stockPerYear > 0 ? `+${display(entry.stockPerYear, entry.currency)}` : "—"}
                    </td>
                    <td>
                      <div style={{ fontWeight: 700, fontSize: 14, letterSpacing: "-0.01em" }}>
                        {display(entry.totalComp, entry.currency)}
                        {displayCurrency !== "native" && entry.currency !== displayCurrency && (
                          <span style={{ fontSize: 10, color: "var(--text-muted)", display: "block", fontWeight: 400 }}>
                            orig. {formatCurrency(entry.totalComp, entry.currency)}
                          </span>
                        )}
                      </div>
                      <div className="tc-bar" style={{ width: `${tcPct}%`, marginTop: 4 }} />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      {/* Pagination */}
      {meta && meta.totalPages > 1 && (
        <div style={{ display: "flex", gap: 8, justifyContent: "center", marginTop: 24, alignItems: "center" }}>
          <button className="btn-ghost" disabled={meta.page <= 1}
            onClick={() => onFilterChange({ ...filters, page: String(meta.page - 1) })}>
            ← Prev
          </button>
          <span style={{ fontSize: 13, color: "var(--text-secondary)" }}>
            Page {meta.page} of {meta.totalPages}
          </span>
          <button className="btn-ghost" disabled={meta.page >= meta.totalPages}
            onClick={() => onFilterChange({ ...filters, page: String(meta.page + 1) })}>
            Next →
          </button>
        </div>
      )}
    </div>
  );
}
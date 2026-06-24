"use client";
import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { formatCurrency, convertCurrency } from "@/lib/utils";

interface Entry {
  id: string; role: string; level: string; yearsOfExp: number;
  baseSalary: number; bonus: number; stockPerYear: number;
  totalComp: number; currency: string; remote: boolean;
  company: { name: string; slug: string };
  location: { city: string; country: string };
}

function CompareContent() {
  const searchParams = useSearchParams();
  const ids = searchParams.getAll("id");
  const initialCurrency = (searchParams.get("displayCurrency") as "native" | "USD" | "INR") || "native";
  const [entries, setEntries] = useState<Entry[]>([]);
  const [loading, setLoading] = useState(true);
  const [displayCurrency, setDisplayCurrency] = useState<"native" | "USD" | "INR">(initialCurrency);

  useEffect(() => {
    if (ids.length < 2) { setLoading(false); return; }
    fetch(`/api/compare?${ids.map((id) => `id=${id}`).join("&")}`)
      .then((r) => r.json())
      .then((j) => setEntries(j.data || []))
      .finally(() => setLoading(false));
  }, []);

  const disp = (amount: number, nativeCurrency: string) => {
    if (displayCurrency === "native") return formatCurrency(amount, nativeCurrency);
    const converted = convertCurrency(amount, nativeCurrency, displayCurrency);
    return formatCurrency(converted, displayCurrency);
  };

  const tc = (entry: Entry) => {
    if (displayCurrency === "native") return entry.totalComp;
    return convertCurrency(entry.totalComp, entry.currency, displayCurrency);
  };

  if (loading) return <div style={{ padding: 64, textAlign: "center", color: "var(--text-muted)" }}>Loading...</div>;

  if (entries.length < 2) {
    return (
      <div className="page-container" style={{ paddingTop: 80, textAlign: "center" }}>
        <p style={{ color: "var(--text-secondary)" }}>Select 2–3 entries from the main table to compare them.</p>
        <a href="/" className="btn-primary" style={{ textDecoration: "none", display: "inline-block", marginTop: 16 }}>
          ← Browse salaries
        </a>
      </div>
    );
  }

  const maxTc = Math.max(...entries.map(tc));
  const colors = ["var(--accent)", "var(--green)", "var(--amber)"];

  const rows = [
    { label: "Company", render: (e: Entry) => e.company.name },
    { label: "Role", render: (e: Entry) => e.role },
    { label: "Level", render: (e: Entry) => <span className="badge badge-level">{e.level}</span> },
    { label: "Location", render: (e: Entry) => `${e.location.city}, ${e.location.country}` },
    { label: "YOE", render: (e: Entry) => `${e.yearsOfExp} years` },
    { label: "Native currency", render: (e: Entry) => e.currency },
    { label: "Base salary", render: (e: Entry, i: number) => <span style={{ color: colors[i] }}>{disp(e.baseSalary, e.currency)}</span> },
    {
      label: "Annual bonus",
      render: (e: Entry) => e.bonus > 0
        ? <span style={{ color: "var(--green)" }}>{disp(e.bonus, e.currency)}</span>
        : <span style={{ color: "var(--text-muted)" }}>—</span>
    },
    {
      label: "Equity / yr",
      render: (e: Entry) => e.stockPerYear > 0
        ? <span style={{ color: "var(--amber)" }}>{disp(e.stockPerYear, e.currency)}</span>
        : <span style={{ color: "var(--text-muted)" }}>—</span>
    },
  ];

  const hasMixedCurrencies = new Set(entries.map((e) => e.currency)).size > 1;

  return (
    <div className="page-container" style={{ paddingTop: 48, paddingBottom: 80 }}>
      <h1 style={{ fontSize: 28, fontWeight: 800, letterSpacing: "-0.02em", marginBottom: 8 }}>
        Compensation comparison
      </h1>
      <p style={{ color: "var(--text-secondary)", marginBottom: 24 }}>
        Side-by-side breakdown of {entries.length} salary entries
      </p>

      {/* Currency selector */}
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 28, flexWrap: "wrap" }}>
        <span style={{ fontSize: 13, color: "var(--text-secondary)" }}>Display currency:</span>
        {(["native", "INR", "USD"] as const).map((c) => (
          <button
            key={c}
            className={`filter-chip ${displayCurrency === c ? "active" : ""}`}
            onClick={() => setDisplayCurrency(c)}
          >
            {c === "native" ? "Native" : c === "INR" ? "₹ INR" : "$ USD"}
          </button>
        ))}
        {hasMixedCurrencies && displayCurrency === "native" && (
          <span style={{ fontSize: 12, color: "var(--amber)", marginLeft: 4 }}>
            ⚠ Mixed currencies — select INR or USD to compare on same scale
          </span>
        )}
        {displayCurrency !== "native" && (
          <span style={{ fontSize: 12, color: "var(--text-muted)", marginLeft: 4 }}>
            ≈ 1 USD = ₹84 · Approximate
          </span>
        )}
      </div>

      {/* TC Visual bars */}
      <div className="card" style={{ padding: 24, marginBottom: 24 }}>
        <div style={{ fontSize: 12, color: "var(--text-muted)", marginBottom: 16, textTransform: "uppercase", letterSpacing: "0.06em" }}>
          Total compensation
        </div>
        <div style={{ display: "grid", gridTemplateColumns: `repeat(${entries.length}, 1fr)`, gap: 24 }}>
          {entries.map((e, i) => {
            const tcVal = tc(e);
            const pct = (tcVal / maxTc) * 100;
            return (
              <div key={e.id}>
                <div style={{ fontSize: 22, fontWeight: 800, letterSpacing: "-0.02em", color: colors[i] }}>
                  {disp(e.totalComp, e.currency)}
                </div>
                {displayCurrency !== "native" && e.currency !== displayCurrency && (
                  <div style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 2 }}>
                    orig. {formatCurrency(e.totalComp, e.currency)}
                  </div>
                )}
                <div style={{ fontSize: 12, color: "var(--text-secondary)", margin: "6px 0 10px" }}>
                  {e.company.name} · {e.level}
                </div>
                {/* TC bar */}
                <div style={{ height: 6, borderRadius: 3, background: "var(--bg-hover)", overflow: "hidden" }}>
                  <div style={{ width: `${pct}%`, height: "100%", background: colors[i], borderRadius: 3, transition: "width 0.6s ease" }} />
                </div>
                {/* Component breakdown bar */}
                <div style={{ display: "flex", gap: 8, marginTop: 16 }}>
                  {([
                    { label: "Base", val: e.baseSalary, color: colors[i] },
                    { label: "Bonus", val: e.bonus, color: "var(--green)" },
                    { label: "Equity", val: e.stockPerYear, color: "var(--amber)" },
                  ]).map((s) => (
                    <div key={s.label} style={{ flex: s.val > 0 ? s.val : 0.001 }}>
                      <div style={{ height: 4, borderRadius: 2, background: s.val > 0 ? s.color : "transparent" }} />
                      <div style={{ fontSize: 10, color: "var(--text-muted)", marginTop: 4 }}>{s.label}</div>
                      <div style={{ fontSize: 12, fontWeight: 600 }}>
                        {s.val > 0 ? disp(s.val, e.currency) : "—"}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Detail table */}
      <div className="card table-wrap">
        <table>
          <thead>
            <tr>
              <th style={{ width: 160 }}>Field</th>
              {entries.map((e, i) => (
                <th key={e.id} style={{ color: colors[i] }}>{e.company.name}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.label}>
                <td style={{ color: "var(--text-muted)", fontSize: 12, fontWeight: 500 }}>{row.label}</td>
                {entries.map((e, i) => (
                  <td key={e.id}>{row.render(e, i) as React.ReactNode}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div style={{ marginTop: 24, textAlign: "center" }}>
        <a href="/" style={{ color: "var(--accent-light)", textDecoration: "none", fontSize: 14 }}>
          ← Back to explore
        </a>
      </div>
    </div>
  );
}

export default function ComparePage() {
  return (
    <Suspense fallback={<div style={{ padding: 64, textAlign: "center" }}>Loading...</div>}>
      <CompareContent />
    </Suspense>
  );
}
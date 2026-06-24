"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { formatCurrency } from "@/lib/utils";

interface Company {
  id: string; name: string; slug: string;
  industry: string | null; count: number;
  avgTc: number; maxTc: number; minTc: number;
}

export default function CompaniesPage() {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => {
      fetch(`/api/companies?search=${encodeURIComponent(search)}`)
        .then((r) => r.json())
        .then((j) => setCompanies(j.data || []))
        .finally(() => setLoading(false));
    }, 200);
    return () => clearTimeout(t);
  }, [search]);

  const maxAvgTc = companies.length ? Math.max(...companies.map((c) => c.avgTc)) : 1;

  return (
    <div className="page-container" style={{ paddingTop: 48, paddingBottom: 80 }}>
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ fontSize: 32, fontWeight: 800, letterSpacing: "-0.02em", margin: "0 0 8px" }}>
          Companies
        </h1>
        <p style={{ color: "var(--text-secondary)", margin: "0 0 24px" }}>
          {companies.length} companies with compensation data
        </p>
        <input
          placeholder="Search companies..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ maxWidth: 360 }}
        />
      </div>

      {loading ? (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 16 }}>
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={i} className="skeleton" style={{ height: 120 }} />
          ))}
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 16 }}>
          {companies.map((c) => (
            <Link key={c.id} href={`/companies/${c.slug}`} style={{ textDecoration: "none" }}>
              <div className="card" style={{ padding: 20, transition: "border-color 0.15s, background 0.15s" }}
                onMouseEnter={(e) => (e.currentTarget.style.borderColor = "var(--border-hover)")}
                onMouseLeave={(e) => (e.currentTarget.style.borderColor = "")}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 16 }}>{c.name}</div>
                    {c.industry && (
                      <div style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 2 }}>{c.industry}</div>
                    )}
                  </div>
                  <span style={{ fontSize: 11, color: "var(--text-muted)", background: "var(--bg-hover)", padding: "3px 8px", borderRadius: 100 }}>
                    {c.count} {c.count === 1 ? "entry" : "entries"}
                  </span>
                </div>
                <div style={{ display: "flex", gap: 16 }}>
                  <div>
                    <div style={{ fontSize: 11, color: "var(--text-muted)" }}>Avg TC</div>
                    <div style={{ fontWeight: 700, fontSize: 18, letterSpacing: "-0.01em" }}>
                      {formatCurrency(c.avgTc)}
                    </div>
                  </div>
                  <div>
                    <div style={{ fontSize: 11, color: "var(--text-muted)" }}>Range</div>
                    <div style={{ fontSize: 13, color: "var(--text-secondary)" }}>
                      {formatCurrency(c.minTc)} – {formatCurrency(c.maxTc)}
                    </div>
                  </div>
                </div>
                <div style={{ marginTop: 12 }}>
                  <div style={{ height: 3, borderRadius: 2, background: "var(--bg-hover)", overflow: "hidden" }}>
                    <div style={{
                      width: `${(c.avgTc / maxAvgTc) * 100}%`,
                      height: "100%",
                      background: "var(--accent)",
                      borderRadius: 2,
                    }} />
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

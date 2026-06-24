export default function ResearchPage() {
  const features = [
    {
      feature: "Salary by level",
      levelsfyi: " Core feature",
      sixfigr: " Yes",
      ambitionbox: " Partial",
      glassdoor: " Partial",
      we_build: " Yes — level-first design",
    },
    {
      feature: "TC breakdown (base+bonus+equity)",
      levelsfyi: " Detailed",
      sixfigr: " Yes",
      ambitionbox: " Base only",
      glassdoor: " Limited",
      we_build: " Full breakdown, visualised",
    },
    {
      feature: "Company-level aggregation",
      levelsfyi: " Rich",
      sixfigr: " Yes",
      ambitionbox: " Yes",
      glassdoor: " Yes",
      we_build: " Company pages with level charts",
    },
    {
      feature: "Location filtering",
      levelsfyi: " City-level",
      sixfigr: " Yes",
      ambitionbox: " India-focused",
      glassdoor: " Yes",
      we_build: " City + country + region + remote",
    },
    {
      feature: "Side-by-side compare",
      levelsfyi: " Limited (Pro)",
      sixfigr: " No",
      ambitionbox: " No",
      glassdoor: " No",
      we_build: " Up to 3 entries, full breakdown",
    },
    {
      feature: "Anonymous submission",
      levelsfyi: " Yes",
      sixfigr: " Yes",
      ambitionbox: " Account needed",
      glassdoor: " Account needed",
      we_build: " Fully anonymous",
    },
    {
      feature: "Duplicate detection",
      levelsfyi: " Yes",
      sixfigr: "Unknown",
      ambitionbox: "Unknown",
      glassdoor: "Unknown",
      we_build: " 5% base threshold, 30-day window",
    },
    {
      feature: "Equity normalisation (annual)",
      levelsfyi: " Yes (4yr vest)",
      sixfigr: " Yes",
      ambitionbox: " No",
      glassdoor: " Inconsistent",
      we_build: " Per-year equity input",
    },
    {
      feature: "Sortable table",
      levelsfyi: " Yes",
      sixfigr: " Yes",
      ambitionbox: " Limited",
      glassdoor: " Limited",
      we_build: " 5 sort modes",
    },
    {
      feature: "Company normalisation",
      levelsfyi: " Yes",
      sixfigr: "Partial",
      ambitionbox: " Yes",
      glassdoor: " Yes",
      we_build: " Slug-based dedup + name normalisation",
    },
  ];

  const observations = [
    {
      platform: "Levels.fyi",
      key: "Level-first philosophy — L3/L4/L5 matter more than 'Senior'. TC breakdown is the standard, not an afterthought. Verification via offer letter improves trust.",
    },
    {
      platform: "6figr",
      key: "Strong India market coverage. Good TC normalisation. Less known outside India tech ecosystem. Simple UX.",
    },
    {
      platform: "AmbitionBox",
      key: "Strong brand in India. Salary data is base-only and often unverified. Better for reviews than comp data. No TC breakdown.",
    },
    {
      platform: "Glassdoor",
      key: "Large dataset but quality varies. Anonymous but requires account. Limited level-based filtering. No equity standardisation.",
    },
  ];

  return (
    <div className="page-container" style={{ paddingTop: 48, paddingBottom: 80 }}>
      <div style={{ marginBottom: 40 }}>
        <div style={{
          display: "inline-block", padding: "4px 12px", borderRadius: 100,
          background: "var(--accent-dim)", color: "var(--accent-light)",
          fontSize: 11, fontWeight: 500, letterSpacing: "0.06em", marginBottom: 16,
        }}>
          MANDATORY RESEARCH
        </div>
        <h1 style={{ fontSize: 32, fontWeight: 800, letterSpacing: "-0.02em", margin: "0 0 8px" }}>
          Competitive research
        </h1>
        <p style={{ color: "var(--text-secondary)", margin: 0 }}>
          Key observations and feature comparison across compensation platforms.
        </p>
      </div>

      {/* Observations */}
      <div style={{ marginBottom: 40 }}>
        <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 16 }}>Key observations</h2>
        <div style={{ display: "grid", gap: 12 }}>
          {observations.map((o) => (
            <div key={o.platform} className="card" style={{ padding: 20, display: "flex", gap: 16 }}>
              <div style={{
                minWidth: 100, fontSize: 13, fontWeight: 700,
                color: "var(--accent-light)",
              }}>
                {o.platform}
              </div>
              <div style={{ fontSize: 14, color: "var(--text-secondary)", lineHeight: 1.7 }}>{o.key}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Feature comparison table */}
      <div>
        <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 16 }}>Feature comparison</h2>
        <div className="card table-wrap">
          <table>
            <thead>
              <tr>
                <th style={{ minWidth: 180 }}>Feature</th>
                <th>Levels.fyi</th>
                <th>6figr</th>
                <th>AmbitionBox</th>
                <th>Glassdoor</th>
                <th style={{ color: "var(--accent-light)" }}>CompIQ (ours)</th>
              </tr>
            </thead>
            <tbody>
              {features.map((f) => (
                <tr key={f.feature}>
                  <td style={{ fontWeight: 500, fontSize: 13 }}>{f.feature}</td>
                  <td style={{ fontSize: 13, color: "var(--text-secondary)" }}>{f.levelsfyi}</td>
                  <td style={{ fontSize: 13, color: "var(--text-secondary)" }}>{f.sixfigr}</td>
                  <td style={{ fontSize: 13, color: "var(--text-secondary)" }}>{f.ambitionbox}</td>
                  <td style={{ fontSize: 13, color: "var(--text-secondary)" }}>{f.glassdoor}</td>
                  <td style={{ fontSize: 13, color: "var(--accent-light)", fontWeight: 500 }}>{f.we_build}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

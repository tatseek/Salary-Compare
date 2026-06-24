"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { INDUSTRIES } from "@/lib/utils";

const LEVELS = ["Intern","Junior","Mid","Senior","Staff","Principal","Director","VP","C-Suite"];

export default function SubmitPage() {
  const router = useRouter();
  const [currency, setCurrency] = useState<"USD" | "INR">("INR");
  const [form, setForm] = useState({
    companyName: "", role: "", level: "Senior",
    yearsOfExp: "3", baseSalary: "", bonus: "0", stockPerYear: "0",
    city: "", country: "IN", state: "", remote: false,
    website: "", industry: "Technology",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const set = (k: string, v: string | boolean) => setForm((f) => ({ ...f, [k]: v }));

  const totalComp =
    (parseFloat(form.baseSalary) || 0) +
    (parseFloat(form.bonus) || 0) +
    (parseFloat(form.stockPerYear) || 0);

  const fmt = (n: number) => {
    if (currency === "INR") {
      return new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(n);
    }
    return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(n);
  };

  // When currency switches, auto-set country hint
  const handleCurrencySwitch = (c: "USD" | "INR") => {
    setCurrency(c);
    if (c === "INR" && form.country === "US") set("country", "IN");
    if (c === "USD" && form.country === "IN") set("country", "US");
  };

  const handleSubmit = async () => {
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/salaries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          currency,
          yearsOfExp: parseInt(form.yearsOfExp),
          baseSalary: parseFloat(form.baseSalary),
          bonus: parseFloat(form.bonus) || 0,
          stockPerYear: parseFloat(form.stockPerYear) || 0,
        }),
      });
      const json = await res.json();
      if (!res.ok) setError(json.error || "Something went wrong");
      else { setSuccess(true); setTimeout(() => router.push("/"), 2000); }
    } catch {
      setError("Network error, please try again");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="page-container" style={{ paddingTop: 80, textAlign: "center" }}>
        <div style={{ fontSize: 48, marginBottom: 16 }}>✓</div>
        <h2>Salary submitted!</h2>
        <p style={{ color: "var(--text-secondary)" }}>Thank you for contributing. Redirecting...</p>
      </div>
    );
  }

  const currencySymbol = currency === "INR" ? "₹" : "$";
  const placeholder = currency === "INR" ? "e.g. 3500000" : "e.g. 150000";

  return (
    <div className="page-container" style={{ paddingTop: 48, paddingBottom: 80, maxWidth: 680 }}>
      <div style={{ marginBottom: 36 }}>
        <h1 style={{ fontSize: 32, fontWeight: 800, letterSpacing: "-0.02em", margin: "0 0 8px" }}>
          Share your compensation
        </h1>
        <p style={{ color: "var(--text-secondary)", margin: 0 }}>
          Anonymous. Helps thousands make informed career decisions.
        </p>
      </div>

      {/* Currency toggle */}
      <div className="card" style={{ padding: 16, marginBottom: 20, display: "flex", alignItems: "center", gap: 12 }}>
        <span style={{ fontSize: 13, color: "var(--text-secondary)" }}>Salary currency:</span>
        <div style={{ display: "flex", gap: 6 }}>
          {(["INR", "USD"] as const).map((c) => (
            <button
              key={c}
              onClick={() => handleCurrencySwitch(c)}
              style={{
                padding: "7px 20px",
                borderRadius: 8,
                border: `1.5px solid ${currency === c ? "var(--accent)" : "var(--border)"}`,
                background: currency === c ? "var(--accent-dim)" : "transparent",
                color: currency === c ? "var(--accent-light)" : "var(--text-secondary)",
                fontWeight: currency === c ? 600 : 400,
                cursor: "pointer",
                fontSize: 14,
                transition: "all 0.15s",
              }}
            >
              {c === "INR" ? "₹ INR" : "$ USD"}
            </button>
          ))}
        </div>
        <span style={{ fontSize: 12, color: "var(--text-muted)", marginLeft: 4 }}>
          {currency === "INR" ? "Indian Rupees" : "US Dollars"}
        </span>
      </div>

      {/* TC Preview */}
      {totalComp > 0 && (
        <div className="card" style={{ padding: 20, marginBottom: 24, display: "flex", gap: 24, alignItems: "center" }}>
          <div>
            <div style={{ fontSize: 11, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.06em" }}>Total Comp</div>
            <div style={{ fontSize: 28, fontWeight: 800, letterSpacing: "-0.02em", color: "var(--accent-light)" }}>
              {fmt(totalComp)}
            </div>
          </div>
          <div style={{ flex: 1, display: "flex", gap: 16, flexWrap: "wrap" }}>
            {[
              { label: "Base", val: parseFloat(form.baseSalary) || 0, color: "var(--text-primary)" },
              { label: "Bonus", val: parseFloat(form.bonus) || 0, color: "var(--green)" },
              { label: "Equity/yr", val: parseFloat(form.stockPerYear) || 0, color: "var(--amber)" },
            ].map((s) => (
              <div key={s.label}>
                <div style={{ fontSize: 11, color: "var(--text-muted)" }}>{s.label}</div>
                <div style={{ fontWeight: 600, color: s.color }}>{fmt(s.val)}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="card" style={{ padding: 28 }}>
        <div style={{ display: "grid", gap: 20 }}>
          {/* Company + Industry */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            <div>
              <label>Company name *</label>
              <input placeholder="e.g. Razorpay" value={form.companyName} onChange={(e) => set("companyName", e.target.value)} />
            </div>
            <div>
              <label>Industry</label>
              <select value={form.industry} onChange={(e) => set("industry", e.target.value)}>
                {INDUSTRIES.map((i) => <option key={i}>{i}</option>)}
              </select>
            </div>
          </div>

          {/* Role + Level */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            <div>
              <label>Job role *</label>
              <input placeholder="e.g. Software Engineer" value={form.role} onChange={(e) => set("role", e.target.value)} />
            </div>
            <div>
              <label>Level *</label>
              <select value={form.level} onChange={(e) => set("level", e.target.value)}>
                {LEVELS.map((l) => <option key={l}>{l}</option>)}
              </select>
            </div>
          </div>

          {/* YOE + Remote */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, alignItems: "end" }}>
            <div>
              <label>Years of experience</label>
              <input type="number" min="0" max="50" value={form.yearsOfExp} onChange={(e) => set("yearsOfExp", e.target.value)} />
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 10, paddingBottom: 2 }}>
              <input type="checkbox" id="remote" checked={form.remote} onChange={(e) => set("remote", e.target.checked)} style={{ width: "auto" }} />
              <label htmlFor="remote" style={{ margin: 0, cursor: "pointer", color: "var(--text-primary)" }}>
                Remote position
              </label>
            </div>
          </div>

          <hr style={{ border: "none", borderTop: "1px solid var(--border)" }} />

          {/* Compensation */}
          <div>
            <div style={{ fontSize: 13, color: "var(--text-secondary)", marginBottom: 12, fontWeight: 500, display: "flex", alignItems: "center", gap: 8 }}>
              Compensation (annual, {currency})
              <span style={{ fontSize: 11, color: "var(--text-muted)", fontWeight: 400 }}>
                {currency === "INR" ? "Enter full amount e.g. 3500000 for ₹35L" : "Enter full amount e.g. 150000 for $150K"}
              </span>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16 }}>
              <div>
                <label>Base salary * {currencySymbol}</label>
                <input type="number" placeholder={placeholder} value={form.baseSalary} onChange={(e) => set("baseSalary", e.target.value)} />
              </div>
              <div>
                <label>Annual bonus {currencySymbol}</label>
                <input type="number" placeholder="0" value={form.bonus} onChange={(e) => set("bonus", e.target.value)} />
              </div>
              <div>
                <label>Equity / year {currencySymbol}</label>
                <input type="number" placeholder="0" value={form.stockPerYear} onChange={(e) => set("stockPerYear", e.target.value)} />
              </div>
            </div>
          </div>

          <hr style={{ border: "none", borderTop: "1px solid var(--border)" }} />

          {/* Location */}
          <div>
            <div style={{ fontSize: 13, color: "var(--text-secondary)", marginBottom: 12, fontWeight: 500 }}>Location</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16 }}>
              <div>
                <label>City *</label>
                <input placeholder={currency === "INR" ? "Bengaluru" : "San Francisco"} value={form.city} onChange={(e) => set("city", e.target.value)} />
              </div>
              <div>
                <label>State / Province</label>
                <input placeholder={currency === "INR" ? "KA" : "CA"} value={form.state} onChange={(e) => set("state", e.target.value)} />
              </div>
              <div>
                <label>Country code *</label>
                <input placeholder="IN / US / GB" maxLength={2} value={form.country} onChange={(e) => set("country", e.target.value.toUpperCase())} />
              </div>
            </div>
          </div>

          {error && (
            <div style={{ padding: "12px 16px", borderRadius: 8, background: "rgba(239,68,68,0.1)", color: "var(--red)", fontSize: 14 }}>
              {error}
            </div>
          )}

          <button
            className="btn-primary"
            onClick={handleSubmit}
            disabled={loading || !form.companyName || !form.role || !form.baseSalary || !form.city}
            style={{ padding: "14px", fontSize: 15, fontWeight: 600 }}
          >
            {loading ? "Submitting..." : "Submit salary →"}
          </button>

          <p style={{ fontSize: 12, color: "var(--text-muted)", margin: 0, textAlign: "center" }}>
            100% anonymous. No personal information is collected.
          </p>
        </div>
      </div>
    </div>
  );
}
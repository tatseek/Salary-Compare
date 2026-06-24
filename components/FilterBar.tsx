"use client";
import { INDUSTRIES } from "@/lib/utils";
import { useEffect, useState } from "react";

const LEVELS = ["Intern","Junior","Mid","Senior","Staff","Principal","Director","VP","C-Suite"];

interface FilterBarProps {
  filters: Record<string, string>;
  onChange: (f: Record<string, string>) => void;
}

export default function FilterBar({ filters, onChange }: FilterBarProps) {
  const [open, setOpen] = useState(false);

  const set = (key: string, value: string) => {
    onChange({ ...filters, [key]: value, page: "1" });
  };

  const clear = () => onChange({ page: "1" });

  const hasFilters = Object.entries(filters)
    .filter(([k]) => k !== "page" && k !== "sortBy" && k !== "sortOrder")
    .some(([, v]) => v);

  return (
    <div className="card" style={{ padding: 16, marginBottom: 0 }}>
      <div style={{ display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap" }}>
        <input
          placeholder="Search role or company..."
          value={filters.company || ""}
          onChange={(e) => set("company", e.target.value)}
          style={{ flex: "1 1 200px", minWidth: 0 }}
        />
        <input
          placeholder="Role (e.g. Software Engineer)"
          value={filters.role || ""}
          onChange={(e) => set("role", e.target.value)}
          style={{ flex: "1 1 200px", minWidth: 0 }}
        />
        <select
          value={filters.level || ""}
          onChange={(e) => set("level", e.target.value)}
          style={{ flex: "0 1 160px" }}
        >
          <option value="">All levels</option>
          {LEVELS.map((l) => <option key={l} value={l}>{l}</option>)}
        </select>
        <input
          placeholder="Location"
          value={filters.location || ""}
          onChange={(e) => set("location", e.target.value)}
          style={{ flex: "0 1 160px" }}
        />
        <select value={filters.currency || ""} onChange={(e) => set("currency", e.target.value)} style={{ flex: "0 1 120px" }}>
          <option value="">All currencies</option>
          <option value="INR">₹ INR only</option>
          <option value="USD">$ USD only</option>
        </select>
        <button
          className="btn-ghost"
          onClick={() => setOpen(!open)}
          style={{ whiteSpace: "nowrap" }}
        >
          More filters {open ? "↑" : "↓"}
        </button>
        {hasFilters && (
          <button className="btn-ghost" onClick={clear} style={{ whiteSpace: "nowrap", color: "var(--accent-light)" }}>
            Clear all
          </button>
        )}
      </div>

      {open && (
        <div style={{ display: "flex", gap: 12, marginTop: 12, flexWrap: "wrap", alignItems: "center" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, flex: "0 1 auto" }}>
            <span style={{ fontSize: 13, color: "var(--text-secondary)", whiteSpace: "nowrap" }}>YOE:</span>
            <select value={filters.industry || ""} onChange={(e) => set("industry", e.target.value)} style={{ flex: "0 1 160px" }}>
              <option value="">All industries</option>
              {INDUSTRIES.map((i) => <option key={i} value={i}>{i}</option>)}
            </select>
            <input
              type="number"
              placeholder="Min"
              value={filters.minYoe || ""}
              onChange={(e) => set("minYoe", e.target.value)}
              style={{ width: 80 }}
            />
            <span style={{ color: "var(--text-muted)" }}>—</span>
            <input
              type="number"
              placeholder="Max"
              value={filters.maxYoe || ""}
              onChange={(e) => set("maxYoe", e.target.value)}
              style={{ width: 80 }}
            />
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 8, flex: "0 1 auto" }}>
            <span style={{ fontSize: 13, color: "var(--text-secondary)", whiteSpace: "nowrap" }}>TC:</span>
            <input
              type="number"
              placeholder="Min $"
              value={filters.minTc || ""}
              onChange={(e) => set("minTc", e.target.value)}
              style={{ width: 100 }}
            />
            <span style={{ color: "var(--text-muted)" }}>—</span>
            <input
              type="number"
              placeholder="Max $"
              value={filters.maxTc || ""}
              onChange={(e) => set("maxTc", e.target.value)}
              style={{ width: 100 }}
            />
          </div>
          <select
            value={filters.remote || ""}
            onChange={(e) => set("remote", e.target.value)}
            style={{ flex: "0 1 140px" }}
          >
            <option value="">All (remote + onsite)</option>
            <option value="true">Remote only</option>
            <option value="false">Onsite only</option>
          </select>
        </div>
      )}
    </div>
  );
}

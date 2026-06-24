"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/", label: "Explore" },
  { href: "/companies", label: "Companies" },
  { href: "/compare", label: "Compare" },
  { href: "/submit", label: "Add Salary" },
  { href: "/research", label: "Research" },
];

export default function Nav() {
  const pathname = usePathname();

  return (
    <nav style={{
      borderBottom: "1px solid var(--border)",
      position: "sticky",
      top: 0,
      zIndex: 100,
      backdropFilter: "blur(12px)",
      background: "rgba(15,15,17,0.85)",
    }}>
      <div className="page-container" style={{ display: "flex", alignItems: "center", height: 56, gap: 8 }}>
        <Link href="/" style={{ textDecoration: "none", marginRight: 24 }}>
          <span style={{ fontWeight: 700, fontSize: 18, color: "var(--text-primary)", letterSpacing: "-0.02em" }}>
            Comp<span style={{ color: "var(--accent)" }}>IQ</span>
          </span>
        </Link>
        <div style={{ display: "flex", gap: 2, flex: 1 }}>
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={`nav-link ${pathname === l.href ? "active" : ""}`}
            >
              {l.label}
            </Link>
          ))}
        </div>
        <Link href="/submit" className="btn-primary" style={{ textDecoration: "none", fontSize: 13 }}>
          + Share Salary
        </Link>
      </div>
    </nav>
  );
}

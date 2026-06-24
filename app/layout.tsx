import type { Metadata } from "next";
import "./globals.css";
import Nav from "@/components/Nav";

export const metadata: Metadata = {
  title: "CompIQ — Compensation Intelligence",
  description: "Compare real salaries by level, role, and location. Make informed career decisions.",
  openGraph: {
    title: "CompIQ — Compensation Intelligence",
    description: "Real compensation data for smarter career decisions",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Nav />
        <main>{children}</main>
      </body>
    </html>
  );
}

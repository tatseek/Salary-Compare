import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const [totalEntries, totalCompanies, avgTcResult, topRoles] = await Promise.all([
    prisma.salaryEntry.count(),
    prisma.company.count(),
    prisma.salaryEntry.aggregate({ _avg: { totalComp: true } }),
    prisma.salaryEntry.groupBy({
      by: ["role"],
      _count: { role: true },
      _avg: { totalComp: true },
      orderBy: { _count: { role: "desc" } },
      take: 10,
    }),
  ]);

  return NextResponse.json({
    totalEntries,
    totalCompanies,
    avgTc: Math.round(avgTcResult._avg.totalComp ?? 0),
    topRoles: topRoles.map((r: { role: string; _count: { role: number }; _avg: { totalComp: number | null } }) => ({
      role: r.role,
      count: r._count.role,
      avgTc: Math.round(r._avg.totalComp ?? 0),
    })),
  });
}

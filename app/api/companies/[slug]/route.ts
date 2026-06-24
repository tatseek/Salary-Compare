import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { LEVEL_ORDER } from "@/lib/utils";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;

  const company = await prisma.company.findUnique({
    where: { slug },
    include: {
      salaries: {
        include: { location: true },
        orderBy: { totalComp: "desc" },
      },
    },
  });

  if (!company) {
    return NextResponse.json({ error: "Company not found" }, { status: 404 });
  }

  const salaries = company.salaries;
  const tcs = salaries.map((s: { totalComp: number }) => s.totalComp);
  const avg = tcs.length ? tcs.reduce((a: number, b: number) => a + b, 0) / tcs.length : 0;

  const byLevel: Record<string, { avg: number; count: number; min: number; max: number }> = {};
  for (const s of salaries) {
    if (!byLevel[s.level]) byLevel[s.level] = { avg: 0, count: 0, min: Infinity, max: -Infinity };
    const g = byLevel[s.level];
    g.count++;
    g.avg += s.totalComp;
    g.min = Math.min(g.min, s.totalComp);
    g.max = Math.max(g.max, s.totalComp);
  }
  for (const k of Object.keys(byLevel)) {
    byLevel[k].avg = Math.round(byLevel[k].avg / byLevel[k].count);
    byLevel[k].min = Math.round(byLevel[k].min);
    byLevel[k].max = Math.round(byLevel[k].max);
  }

  const levelBreakdown = Object.entries(byLevel)
    .sort((a, b) => (LEVEL_ORDER[a[0]] ?? 99) - (LEVEL_ORDER[b[0]] ?? 99))
    .map(([level, stats]) => ({ level, ...stats }));

  return NextResponse.json({
    data: {
      company: {
        id: company.id,
        name: company.name,
        slug: company.slug,
        logo: company.logo,
        website: company.website,
        industry: company.industry,
      },
      stats: {
        count: salaries.length,
        avgTc: Math.round(avg),
        maxTc: tcs.length ? Math.round(Math.max(...tcs)) : 0,
        minTc: tcs.length ? Math.round(Math.min(...tcs)) : 0,
      },
      levelBreakdown,
      recentSalaries: salaries.slice(0, 20),
    },
  });
}

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const search = searchParams.get("search") || "";

  const companies = await prisma.company.findMany({
    where: search
      ? { name: { contains: search, mode: "insensitive" } }
      : undefined,
    include: {
      _count: { select: { salaries: true } },
      salaries: {
        select: { totalComp: true, baseSalary: true, bonus: true, stockPerYear: true, level: true },
      },
    },
    orderBy: { salaries: { _count: "desc" } },
    take: 50,
  });

  const result = companies.map((c: typeof companies[number]) => {
    const tcs = c.salaries.map((s: { totalComp: number }) => s.totalComp);
    const avg = tcs.length ? tcs.reduce((a: number, b: number) => a + b, 0) / tcs.length : 0;
    const max = tcs.length ? Math.max(...tcs) : 0;
    const min = tcs.length ? Math.min(...tcs) : 0;

    return {
      id: c.id,
      name: c.name,
      slug: c.slug,
      logo: c.logo,
      industry: c.industry,
      count: c._count.salaries,
      avgTc: Math.round(avg),
      maxTc: Math.round(max),
      minTc: Math.round(min),
    };
  });

  return NextResponse.json({ data: result });
}

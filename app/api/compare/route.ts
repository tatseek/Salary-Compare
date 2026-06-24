import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const ids = searchParams.getAll("id");

  if (ids.length < 2 || ids.length > 3) {
    return NextResponse.json(
      { error: "Provide 2 or 3 entry IDs" },
      { status: 400 }
    );
  }

  const entries = await prisma.salaryEntry.findMany({
    where: { id: { in: ids } },
    include: {
      company: { select: { name: true, slug: true, industry: true } },
      location: { select: { city: true, country: true, region: true } },
    },
  });

  return NextResponse.json({ data: entries });
}

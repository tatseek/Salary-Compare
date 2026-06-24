import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { SalarySubmitSchema, SalaryFilterSchema } from "@/lib/validations";
import { slugify, normalizeCompanyName, formatTC } from "@/lib/utils";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const params = Object.fromEntries(searchParams.entries());
    const filter = SalaryFilterSchema.parse(params);

    const where: Record<string, unknown> = {};

    if (filter.company) {
      where.company = {
        name: { contains: filter.company, mode: "insensitive" },
      };
    }
    if (filter.role) {
      where.role = { contains: filter.role, mode: "insensitive" };
    }
    if (filter.level) {
      where.level = filter.level;
    }
    if (filter.currency) {
      where.currency = filter.currency;
    }
    if (filter.industry) {
      where.company = {
        ...(where.company as object ?? {}),
        industry: { contains: filter.industry, mode: "insensitive" },
      };
    }
    if (filter.location) {
      where.location = {
        OR: [
          { city: { contains: filter.location, mode: "insensitive" } },
          { country: { contains: filter.location, mode: "insensitive" } },
          { region: { contains: filter.location, mode: "insensitive" } },
        ],
      };
    }
    if (filter.minYoe !== undefined || filter.maxYoe !== undefined) {
      where.yearsOfExp = {
        ...(filter.minYoe !== undefined && { gte: filter.minYoe }),
        ...(filter.maxYoe !== undefined && { lte: filter.maxYoe }),
      };
    }
    if (filter.minTc !== undefined || filter.maxTc !== undefined) {
      where.totalComp = {
        ...(filter.minTc !== undefined && { gte: filter.minTc }),
        ...(filter.maxTc !== undefined && { lte: filter.maxTc }),
      };
    }
    if (filter.remote === "true") where.remote = true;
    if (filter.remote === "false") where.remote = false;

    const [total, entries] = await Promise.all([
      prisma.salaryEntry.count({ where }),
      prisma.salaryEntry.findMany({
        where,
        include: {
          company: { select: { name: true, slug: true, logo: true, industry: true } },
          location: { select: { city: true, state: true, country: true, region: true } },
        },
        orderBy: { [filter.sortBy]: filter.sortOrder },
        skip: (filter.page - 1) * filter.pageSize,
        take: filter.pageSize,
      }),
    ]);

    return NextResponse.json({
      data: entries,
      meta: {
        total,
        page: filter.page,
        pageSize: filter.pageSize,
        totalPages: Math.ceil(total / filter.pageSize),
      },
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const data = SalarySubmitSchema.parse(body);

    const normalizedName = normalizeCompanyName(data.companyName);
    const slug = slugify(normalizedName);
    const totalComp = formatTC(data.baseSalary, data.bonus ?? 0, data.stockPerYear ?? 0);

    // Upsert company
    const company = await prisma.company.upsert({
      where: { slug },
      update: {
        ...(data.website && { website: data.website }),
        ...(data.industry && { industry: data.industry }),
      },
      create: {
        name: normalizedName,
        slug,
        website: data.website || null,
        industry: data.industry || null,
      },
    });

    // Determine region
    const regionMap: Record<string, string> = {
      US: "North America", CA: "North America", MX: "North America",
      GB: "Europe", DE: "Europe", FR: "Europe", NL: "Europe", SE: "Europe",
      IN: "South Asia", PK: "South Asia", BD: "South Asia",
      SG: "Asia Pacific", JP: "Asia Pacific", AU: "Asia Pacific", CN: "Asia Pacific",
      BR: "Latin America", AR: "Latin America", CO: "Latin America",
      AE: "Middle East & Africa", ZA: "Middle East & Africa", NG: "Middle East & Africa",
    };
    const region = regionMap[data.country.toUpperCase()] ?? "Other";

    // Upsert location
    const location = await prisma.location.upsert({
      where: { city_country: { city: data.city, country: data.country } },
      update: {},
      create: {
        city: data.city,
        state: data.state || null,
        country: data.country,
        region,
      },
    });

    // Duplicate detection
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const duplicate = await prisma.salaryEntry.findFirst({
      where: {
        companyId: company.id,
        role: { equals: data.role, mode: "insensitive" },
        level: data.level,
        locationId: location.id,
        baseSalary: { gte: data.baseSalary * 0.95, lte: data.baseSalary * 1.05 },
        submittedAt: { gte: thirtyDaysAgo },
      },
    });

    if (duplicate) {
      return NextResponse.json(
        { error: "Similar entry already submitted recently" },
        { status: 409 }
      );
    }

    const entry = await prisma.salaryEntry.create({
      data: {
        companyId: company.id,
        locationId: location.id,
        role: data.role,
        level: data.level,
        yearsOfExp: data.yearsOfExp,
        baseSalary: data.baseSalary,
        bonus: data.bonus ?? 0,
        stockPerYear: data.stockPerYear ?? 0,
        totalComp,
        currency: data.currency,
        remote: data.remote ?? false,
      },
      include: {
        company: true,
        location: true,
      },
    });

    return NextResponse.json({ data: entry }, { status: 201 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}

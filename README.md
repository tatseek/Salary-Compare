# CompIQ — Compensation Intelligence System

A full-stack compensation intelligence platform built with Next.js 15, TypeScript, Prisma ORM, and Neon PostgreSQL.

## Live Demo
[https://salary-compare-rho.vercel.app/](https://salary-compare-git-main-tatseeks-projects.vercel.app/)

## Features

- **Level-first design** — compensation is compared by level (Senior, Staff, Principal), not just title
- **Full TC breakdown** — base salary + annual bonus + equity per year, all separately tracked
- **Searchable salary table** — filter by company, role, level, location, YOE, TC range, and remote status
- **5 sort modes** — TC (high/low), base salary, recency, years of experience
- **Side-by-side comparison** — select 2–3 entries and compare every field with visual TC bars
- **Company pages** — per-company stats, level breakdown with range bars, recent entries
- **Submission form** — anonymous salary submission with live TC preview
- **Duplicate detection** — rejects entries within 5% base salary of existing ones in the same 30-day window
- **Research page** — competitive analysis vs Levels.fyi, 6figr, AmbitionBox, Glassdoor
- **Seed data** — 40+ realistic entries across Google, Meta, Netflix, Stripe, Flipkart, and more

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js 15 (App Router), React 19, TypeScript |
| Styling | Tailwind CSS v4, custom CSS design system |
| Backend | Next.js API Routes (TypeScript) |
| Validation | Zod |
| ORM | Prisma |
| Database | Neon PostgreSQL |
| Deployment | Vercel + Neon |

## Architecture

```
/app
  /api
    /salaries      → GET (filter/sort/paginate) + POST (ingest/validate/dedup)
    /companies     → GET all companies with aggregated TC stats
    /companies/[slug] → GET company detail with level breakdown
    /compare       → GET 2–3 entries side-by-side
    /stats         → GET homepage hero stats
  /                → Explore (table + filters)
  /companies       → Company grid
  /companies/[slug]→ Company detail
  /compare         → Compare view
  /submit          → Salary submission form
  /research        → Competitive analysis

/lib
  prisma.ts        → Singleton Prisma client
  validations.ts   → Zod schemas (SalarySubmitSchema, SalaryFilterSchema)
  utils.ts         → formatCurrency, slugify, normalizeCompanyName, LEVELS

/prisma
  schema.prisma    → Company, Location, SalaryEntry models
  seed.ts          → 40+ seed entries
```

## Local Development

### 1. Clone and install
```bash
git clone https://github.com/tatseek/Salary-Compare.git
cd comp-iq
npm install
```

### 2. Set up Neon DB
1. Create a free database at [neon.tech](https://neon.tech)
2. Copy the connection string

### 3. Configure environment
```bash
cp .env.local.example .env.local
# Edit .env.local and paste your Neon DATABASE_URL
```

### 4. Push schema + seed
```bash
npm run db:push       # push schema to Neon
npm run db:seed       # insert seed data
```

### 5. Run dev server
```bash
npm run dev
# Open http://localhost:3000
```

## Deployment (Vercel + Neon)

1. Push to GitHub
2. Import project in [vercel.com](https://vercel.com)
3. Add `DATABASE_URL` environment variable (from Neon dashboard)
4. Deploy — Vercel runs `prisma generate && next build` automatically

After first deploy, run seed:
```bash
DATABASE_URL="your-neon-url" npm run db:seed
```

## Key Engineering Decisions

### Why Prisma over raw SQL?
Type-safe queries with auto-generated types from the schema. The `upsert` pattern for companies and locations keeps the codebase clean without manual ON CONFLICT SQL.

### Duplicate detection logic
A submission is rejected if there's an existing entry with the same company, role, level, and location where the base salary is within ±5% and it was submitted in the last 30 days. This catches copy-paste duplicates while allowing legitimate updates.

### Company name normalisation
`normalizeCompanyName()` strips common suffixes (Inc, Ltd, LLC), trims whitespace, and generates a slug. "Google LLC" and "Google Inc." both resolve to the same company record.

### TC calculation
`totalComp = baseSalary + bonus + stockPerYear`. All missing components default to 0. Equity is captured as an annualised figure — if someone inputs a 4-year $400K grant, they should enter $100K/yr.

### Zod validation on both ends
`SalarySubmitSchema` validates input types, ranges, and required fields. `SalaryFilterSchema` uses `z.coerce.number()` for query string params so URL params are safely cast.

## Tradeoffs

| Decision | Tradeoff |
|---|---|
| No user accounts | Simpler, faster, more anonymous. Can't verify or edit submissions. |
| Currency stored as-is | INR and USD entries are both in the same table. A real system would normalise to USD. |
| No auth on POST /salaries | Spam-prone. Rate limiting or CAPTCHA would be the next step. |
| Seed data is INR for India | Amounts look huge (₹35,00,000). A real system would display currency correctly. |

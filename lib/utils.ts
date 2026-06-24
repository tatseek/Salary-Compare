import { clsx, type ClassValue } from "clsx";

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

export function slugify(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export function normalizeCompanyName(name: string): string {
  return name
    .trim()
    .replace(/\s+/g, " ")
    .replace(/\b(inc|ltd|llc|corp|co|pvt)\b\.?/gi, "")
    .trim();
}

export function formatCurrency(amount: number, currency = "USD"): string {
  return new Intl.NumberFormat(currency === "INR" ? "en-IN" : "en-US", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(amount);
}

export const USD_TO_INR = 96;
export const INR_TO_USD = 1 / USD_TO_INR;

export function convertCurrency(amount: number, fromCurrency: string, toCurrency: string): number {
  if (fromCurrency === toCurrency) return amount;
  if (toCurrency === "USD") return Math.round(amount / USD_TO_INR);
  if (toCurrency === "INR") return Math.round(amount * USD_TO_INR);
  return amount;
}

export function formatTC(base: number, bonus: number, stock: number): number {
  return base + bonus + stock;
}

export const LEVELS = [
  "Intern",
  "Junior",
  "Mid",
  "Senior",
  "Staff",
  "Principal",
  "Director",
  "VP",
  "C-Suite",
] as const;

export const LEVEL_ORDER: Record<string, number> = {
  Intern: 0,
  Junior: 1,
  Mid: 2,
  Senior: 3,
  Staff: 4,
  Principal: 5,
  Director: 6,
  VP: 7,
  "C-Suite": 8,
};

export const REGIONS = [
  "North America",
  "Europe",
  "Asia Pacific",
  "South Asia",
  "Latin America",
  "Middle East & Africa",
] as const;

export const INDUSTRIES = [
  "Technology",
  "SaaS",
  "FinTech",
  "EdTech",
  "HealthTech",
  "Food Tech",
  "E-Commerce",
  "D2C",
  "Mobility",
  "Logistics",
  "IT Services",
  "Finance",
  "Consulting",
  "Gaming",
  "Media",
  "Telecom",
  "Automotive",
  "Other",
] as const;

import { z } from "zod";

export const SalarySubmitSchema = z.object({
  companyName: z.string().min(1).max(100),
  role: z.string().min(1).max(100),
  level: z.enum(["Intern", "Junior", "Mid", "Senior", "Staff", "Principal", "Director", "VP", "C-Suite"]),
  yearsOfExp: z.number().int().min(0).max(50),
  baseSalary: z.number().positive().max(100_000_000), 
  bonus: z.number().min(0).max(10_000_000).default(0),
  stockPerYear: z.number().min(0).max(10_000_000).default(0),
  currency: z.enum(["USD", "INR"]).default("INR"),
  city: z.string().min(1).max(100),
  country: z.string().min(1).max(100),
  state: z.string().max(100).optional(),
  remote: z.boolean().default(false),
  website: z.string().url().optional().or(z.literal("")),
  industry: z.string().max(100).optional(),
});

export type SalarySubmitInput = z.infer<typeof SalarySubmitSchema>;

export const SalaryFilterSchema = z.object({
  company: z.string().optional(),
  role: z.string().optional(),
  level: z.string().optional(),
  currency: z.enum(["USD", "INR", ""]).optional(),
  industry: z.string().optional(),
  location: z.string().optional(),
  minYoe: z.coerce.number().optional(),
  maxYoe: z.coerce.number().optional(),
  minTc: z.coerce.number().optional(),
  maxTc: z.coerce.number().optional(),
  remote: z.enum(["true", "false", ""]).optional(),
  sortBy: z.enum(["totalComp", "baseSalary", "submittedAt", "yearsOfExp"]).default("totalComp"),
  sortOrder: z.enum(["asc", "desc"]).default("desc"),
  page: z.coerce.number().int().positive().default(1),
  pageSize: z.coerce.number().int().positive().max(100).default(20),
});

export type SalaryFilterInput = z.infer<typeof SalaryFilterSchema>;

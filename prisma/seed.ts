import { PrismaClient } from "@prisma/client";
import { slugify, normalizeCompanyName } from "../lib/utils";

const prisma = new PrismaClient();

const companies = [
  // India - Product
  { name: "Flipkart", industry: "E-Commerce", website: "https://flipkart.com" },
  { name: "Swiggy", industry: "Food Tech", website: "https://swiggy.com" },
  { name: "Zomato", industry: "Food Tech", website: "https://zomato.com" },
  { name: "Razorpay", industry: "FinTech", website: "https://razorpay.com" },
  { name: "PhonePe", industry: "FinTech", website: "https://phonepe.com" },
  { name: "Paytm", industry: "FinTech", website: "https://paytm.com" },
  { name: "Groww", industry: "FinTech", website: "https://groww.in" },
  { name: "CRED", industry: "FinTech", website: "https://cred.club" },
  { name: "Zepto", industry: "E-Commerce", website: "https://zepto.com" },
  { name: "Meesho", industry: "E-Commerce", website: "https://meesho.com" },
  { name: "Nykaa", industry: "D2C", website: "https://nykaa.com" },
  { name: "Ola", industry: "Mobility", website: "https://olacabs.com" },
  { name: "Dunzo", industry: "Logistics", website: "https://dunzo.com" },
  { name: "Urban Company", industry: "Marketplace", website: "https://urbancompany.com" },
  { name: "Byju's", industry: "EdTech", website: "https://byjus.com" },
  { name: "Unacademy", industry: "EdTech", website: "https://unacademy.com" },
  { name: "upGrad", industry: "EdTech", website: "https://upgrad.com" },
  { name: "Lenskart", industry: "D2C", website: "https://lenskart.com" },
  { name: "BrowserStack", industry: "SaaS", website: "https://browserstack.com" },
  { name: "Freshworks", industry: "SaaS", website: "https://freshworks.com" },
  { name: "Zoho", industry: "SaaS", website: "https://zoho.com" },
  { name: "Postman", industry: "SaaS", website: "https://postman.com" },
  { name: "Chargebee", industry: "SaaS", website: "https://chargebee.com" },
  { name: "Leadsquared", industry: "SaaS", website: "https://leadsquared.com" },
  // India - IT Services
  { name: "Infosys", industry: "IT Services", website: "https://infosys.com" },
  { name: "TCS", industry: "IT Services", website: "https://tcs.com" },
  { name: "Wipro", industry: "IT Services", website: "https://wipro.com" },
  { name: "HCL Technologies", industry: "IT Services", website: "https://hcltech.com" },
  { name: "Tech Mahindra", industry: "IT Services", website: "https://techmahindra.com" },
  // India - Global MNC India offices
  { name: "Google", industry: "Technology", website: "https://google.com" },
  { name: "Microsoft", industry: "Technology", website: "https://microsoft.com" },
  { name: "Amazon", industry: "Technology", website: "https://amazon.com" },
  { name: "Meta", industry: "Technology", website: "https://meta.com" },
  { name: "Adobe", industry: "SaaS", website: "https://adobe.com" },
  { name: "Atlassian", industry: "SaaS", website: "https://atlassian.com" },
  { name: "Walmart Global Tech", industry: "Technology", website: "https://walmart.com" },
  { name: "Uber", industry: "Mobility", website: "https://uber.com" },
  { name: "Goldman Sachs", industry: "Finance", website: "https://goldmansachs.com" },
  { name: "JPMorgan Chase", industry: "Finance", website: "https://jpmorgan.com" },
  // US companies
  { name: "Netflix", industry: "Media", website: "https://netflix.com" },
  { name: "Stripe", industry: "FinTech", website: "https://stripe.com" },
  { name: "Airbnb", industry: "Marketplace", website: "https://airbnb.com" },
  { name: "Salesforce", industry: "SaaS", website: "https://salesforce.com" },
  { name: "Notion", industry: "SaaS", website: "https://notion.so" },
];

const locations = [
  // India
  { city: "Bengaluru", state: "KA", country: "IN", region: "South Asia" },
  { city: "Hyderabad", state: "TS", country: "IN", region: "South Asia" },
  { city: "Mumbai", state: "MH", country: "IN", region: "South Asia" },
  { city: "Pune", state: "MH", country: "IN", region: "South Asia" },
  { city: "Delhi", state: "DL", country: "IN", region: "South Asia" },
  { city: "Gurgaon", state: "HR", country: "IN", region: "South Asia" },
  { city: "Noida", state: "UP", country: "IN", region: "South Asia" },
  { city: "Chennai", state: "TN", country: "IN", region: "South Asia" },
  { city: "Remote India", state: null, country: "IN", region: "South Asia" },
  // US
  { city: "San Francisco", state: "CA", country: "US", region: "North America" },
  { city: "New York", state: "NY", country: "US", region: "North America" },
  { city: "Seattle", state: "WA", country: "US", region: "North America" },
  { city: "Austin", state: "TX", country: "US", region: "North America" },
  { city: "Remote US", state: null, country: "US", region: "North America" },
  // Others
  { city: "London", state: null, country: "GB", region: "Europe" },
  { city: "Singapore", state: null, country: "SG", region: "Asia Pacific" },
];

interface SeedEntry {
  companyName: string;
  locationCity: string;
  role: string;
  level: string;
  yearsOfExp: number;
  baseSalary: number;
  bonus: number;
  stockPerYear: number;
  remote: boolean;
  currency: string;
}

const seedEntries: SeedEntry[] = [
  // ── INDIA PRODUCT COMPANIES (INR) ──────────────────────────────────────────

  // Flipkart
  { companyName: "Flipkart", locationCity: "Bengaluru", role: "Software Engineer", level: "Intern", yearsOfExp: 0, baseSalary: 1200000, bonus: 0, stockPerYear: 0, remote: false, currency: "INR" },
  { companyName: "Flipkart", locationCity: "Bengaluru", role: "Software Engineer", level: "Junior", yearsOfExp: 1, baseSalary: 1800000, bonus: 200000, stockPerYear: 400000, remote: false, currency: "INR" },
  { companyName: "Flipkart", locationCity: "Bengaluru", role: "Software Engineer", level: "Mid", yearsOfExp: 3, baseSalary: 2800000, bonus: 450000, stockPerYear: 900000, remote: false, currency: "INR" },
  { companyName: "Flipkart", locationCity: "Bengaluru", role: "Software Engineer", level: "Senior", yearsOfExp: 6, baseSalary: 3800000, bonus: 700000, stockPerYear: 1800000, remote: false, currency: "INR" },
  { companyName: "Flipkart", locationCity: "Bengaluru", role: "Software Engineer", level: "Staff", yearsOfExp: 9, baseSalary: 5500000, bonus: 1200000, stockPerYear: 3500000, remote: false, currency: "INR" },
  { companyName: "Flipkart", locationCity: "Bengaluru", role: "Data Scientist", level: "Mid", yearsOfExp: 3, baseSalary: 2500000, bonus: 400000, stockPerYear: 800000, remote: false, currency: "INR" },
  { companyName: "Flipkart", locationCity: "Bengaluru", role: "Product Manager", level: "Senior", yearsOfExp: 6, baseSalary: 4200000, bonus: 900000, stockPerYear: 2500000, remote: false, currency: "INR" },

  // Swiggy
  { companyName: "Swiggy", locationCity: "Bengaluru", role: "Software Engineer", level: "Junior", yearsOfExp: 1, baseSalary: 1600000, bonus: 180000, stockPerYear: 350000, remote: false, currency: "INR" },
  { companyName: "Swiggy", locationCity: "Bengaluru", role: "Software Engineer", level: "Mid", yearsOfExp: 3, baseSalary: 2600000, bonus: 420000, stockPerYear: 850000, remote: false, currency: "INR" },
  { companyName: "Swiggy", locationCity: "Bengaluru", role: "Software Engineer", level: "Senior", yearsOfExp: 5, baseSalary: 3500000, bonus: 650000, stockPerYear: 1500000, remote: false, currency: "INR" },
  { companyName: "Swiggy", locationCity: "Bengaluru", role: "Product Manager", level: "Senior", yearsOfExp: 6, baseSalary: 4000000, bonus: 850000, stockPerYear: 2200000, remote: false, currency: "INR" },
  { companyName: "Swiggy", locationCity: "Remote India", role: "Software Engineer", level: "Mid", yearsOfExp: 3, baseSalary: 2400000, bonus: 380000, stockPerYear: 700000, remote: true, currency: "INR" },

  // Zomato
  { companyName: "Zomato", locationCity: "Gurgaon", role: "Software Engineer", level: "Junior", yearsOfExp: 1, baseSalary: 1500000, bonus: 150000, stockPerYear: 300000, remote: false, currency: "INR" },
  { companyName: "Zomato", locationCity: "Gurgaon", role: "Software Engineer", level: "Mid", yearsOfExp: 3, baseSalary: 2400000, bonus: 380000, stockPerYear: 750000, remote: false, currency: "INR" },
  { companyName: "Zomato", locationCity: "Gurgaon", role: "Software Engineer", level: "Senior", yearsOfExp: 5, baseSalary: 3400000, bonus: 600000, stockPerYear: 1400000, remote: false, currency: "INR" },
  { companyName: "Zomato", locationCity: "Gurgaon", role: "Data Scientist", level: "Senior", yearsOfExp: 5, baseSalary: 3200000, bonus: 550000, stockPerYear: 1200000, remote: false, currency: "INR" },

  // Razorpay
  { companyName: "Razorpay", locationCity: "Bengaluru", role: "Software Engineer", level: "Junior", yearsOfExp: 1, baseSalary: 1700000, bonus: 200000, stockPerYear: 400000, remote: false, currency: "INR" },
  { companyName: "Razorpay", locationCity: "Bengaluru", role: "Software Engineer", level: "Mid", yearsOfExp: 3, baseSalary: 2800000, bonus: 450000, stockPerYear: 1000000, remote: false, currency: "INR" },
  { companyName: "Razorpay", locationCity: "Bengaluru", role: "Software Engineer", level: "Senior", yearsOfExp: 6, baseSalary: 3800000, bonus: 750000, stockPerYear: 2000000, remote: false, currency: "INR" },
  { companyName: "Razorpay", locationCity: "Bengaluru", role: "Software Engineer", level: "Staff", yearsOfExp: 9, baseSalary: 5800000, bonus: 1300000, stockPerYear: 4000000, remote: false, currency: "INR" },

  // PhonePe
  { companyName: "PhonePe", locationCity: "Bengaluru", role: "Software Engineer", level: "Mid", yearsOfExp: 3, baseSalary: 2600000, bonus: 400000, stockPerYear: 900000, remote: false, currency: "INR" },
  { companyName: "PhonePe", locationCity: "Bengaluru", role: "Software Engineer", level: "Senior", yearsOfExp: 6, baseSalary: 3600000, bonus: 700000, stockPerYear: 1800000, remote: false, currency: "INR" },
  { companyName: "PhonePe", locationCity: "Bengaluru", role: "Data Engineer", level: "Senior", yearsOfExp: 5, baseSalary: 3200000, bonus: 600000, stockPerYear: 1500000, remote: false, currency: "INR" },

  // Paytm
  { companyName: "Paytm", locationCity: "Noida", role: "Software Engineer", level: "Junior", yearsOfExp: 1, baseSalary: 1200000, bonus: 100000, stockPerYear: 200000, remote: false, currency: "INR" },
  { companyName: "Paytm", locationCity: "Noida", role: "Software Engineer", level: "Mid", yearsOfExp: 3, baseSalary: 2000000, bonus: 280000, stockPerYear: 500000, remote: false, currency: "INR" },
  { companyName: "Paytm", locationCity: "Noida", role: "Software Engineer", level: "Senior", yearsOfExp: 6, baseSalary: 2800000, bonus: 450000, stockPerYear: 900000, remote: false, currency: "INR" },

  // Groww
  { companyName: "Groww", locationCity: "Bengaluru", role: "Software Engineer", level: "Mid", yearsOfExp: 3, baseSalary: 2700000, bonus: 420000, stockPerYear: 950000, remote: false, currency: "INR" },
  { companyName: "Groww", locationCity: "Bengaluru", role: "Software Engineer", level: "Senior", yearsOfExp: 6, baseSalary: 3700000, bonus: 720000, stockPerYear: 1900000, remote: false, currency: "INR" },
  { companyName: "Groww", locationCity: "Bengaluru", role: "Product Manager", level: "Mid", yearsOfExp: 4, baseSalary: 2800000, bonus: 500000, stockPerYear: 1000000, remote: false, currency: "INR" },

  // CRED
  { companyName: "CRED", locationCity: "Bengaluru", role: "Software Engineer", level: "Mid", yearsOfExp: 3, baseSalary: 3000000, bonus: 500000, stockPerYear: 1200000, remote: false, currency: "INR" },
  { companyName: "CRED", locationCity: "Bengaluru", role: "Software Engineer", level: "Senior", yearsOfExp: 5, baseSalary: 4200000, bonus: 850000, stockPerYear: 2800000, remote: false, currency: "INR" },
  { companyName: "CRED", locationCity: "Bengaluru", role: "Software Engineer", level: "Staff", yearsOfExp: 9, baseSalary: 6500000, bonus: 1500000, stockPerYear: 5000000, remote: false, currency: "INR" },

  // Zepto
  { companyName: "Zepto", locationCity: "Mumbai", role: "Software Engineer", level: "Junior", yearsOfExp: 1, baseSalary: 1600000, bonus: 180000, stockPerYear: 500000, remote: false, currency: "INR" },
  { companyName: "Zepto", locationCity: "Mumbai", role: "Software Engineer", level: "Senior", yearsOfExp: 4, baseSalary: 3200000, bonus: 600000, stockPerYear: 2200000, remote: false, currency: "INR" },

  // Meesho
  { companyName: "Meesho", locationCity: "Bengaluru", role: "Software Engineer", level: "Mid", yearsOfExp: 3, baseSalary: 2400000, bonus: 380000, stockPerYear: 800000, remote: false, currency: "INR" },
  { companyName: "Meesho", locationCity: "Bengaluru", role: "Software Engineer", level: "Senior", yearsOfExp: 5, baseSalary: 3300000, bonus: 600000, stockPerYear: 1500000, remote: false, currency: "INR" },
  { companyName: "Meesho", locationCity: "Remote India", role: "Software Engineer", level: "Mid", yearsOfExp: 3, baseSalary: 2200000, bonus: 350000, stockPerYear: 700000, remote: true, currency: "INR" },

  // BrowserStack
  { companyName: "BrowserStack", locationCity: "Mumbai", role: "Software Engineer", level: "Mid", yearsOfExp: 3, baseSalary: 2800000, bonus: 420000, stockPerYear: 900000, remote: false, currency: "INR" },
  { companyName: "BrowserStack", locationCity: "Mumbai", role: "Software Engineer", level: "Senior", yearsOfExp: 6, baseSalary: 4000000, bonus: 750000, stockPerYear: 2000000, remote: false, currency: "INR" },
  { companyName: "BrowserStack", locationCity: "Remote India", role: "Software Engineer", level: "Senior", yearsOfExp: 6, baseSalary: 3800000, bonus: 700000, stockPerYear: 1800000, remote: true, currency: "INR" },

  // Freshworks
  { companyName: "Freshworks", locationCity: "Chennai", role: "Software Engineer", level: "Junior", yearsOfExp: 1, baseSalary: 1400000, bonus: 150000, stockPerYear: 300000, remote: false, currency: "INR" },
  { companyName: "Freshworks", locationCity: "Chennai", role: "Software Engineer", level: "Mid", yearsOfExp: 3, baseSalary: 2200000, bonus: 320000, stockPerYear: 700000, remote: false, currency: "INR" },
  { companyName: "Freshworks", locationCity: "Chennai", role: "Software Engineer", level: "Senior", yearsOfExp: 6, baseSalary: 3200000, bonus: 580000, stockPerYear: 1400000, remote: false, currency: "INR" },

  // Zoho
  { companyName: "Zoho", locationCity: "Chennai", role: "Software Engineer", level: "Junior", yearsOfExp: 1, baseSalary: 800000, bonus: 80000, stockPerYear: 0, remote: false, currency: "INR" },
  { companyName: "Zoho", locationCity: "Chennai", role: "Software Engineer", level: "Mid", yearsOfExp: 4, baseSalary: 1400000, bonus: 120000, stockPerYear: 0, remote: false, currency: "INR" },
  { companyName: "Zoho", locationCity: "Chennai", role: "Software Engineer", level: "Senior", yearsOfExp: 7, baseSalary: 2200000, bonus: 200000, stockPerYear: 0, remote: false, currency: "INR" },

  // Postman
  { companyName: "Postman", locationCity: "Bengaluru", role: "Software Engineer", level: "Mid", yearsOfExp: 3, baseSalary: 3000000, bonus: 500000, stockPerYear: 1500000, remote: false, currency: "INR" },
  { companyName: "Postman", locationCity: "Bengaluru", role: "Software Engineer", level: "Senior", yearsOfExp: 6, baseSalary: 4500000, bonus: 900000, stockPerYear: 3000000, remote: false, currency: "INR" },

  // Byju's
  { companyName: "Byju's", locationCity: "Bengaluru", role: "Software Engineer", level: "Junior", yearsOfExp: 1, baseSalary: 1000000, bonus: 80000, stockPerYear: 150000, remote: false, currency: "INR" },
  { companyName: "Byju's", locationCity: "Bengaluru", role: "Software Engineer", level: "Mid", yearsOfExp: 3, baseSalary: 1800000, bonus: 200000, stockPerYear: 400000, remote: false, currency: "INR" },
  { companyName: "Byju's", locationCity: "Bengaluru", role: "Product Manager", level: "Senior", yearsOfExp: 6, baseSalary: 3000000, bonus: 500000, stockPerYear: 1000000, remote: false, currency: "INR" },

  // Unacademy
  { companyName: "Unacademy", locationCity: "Bengaluru", role: "Software Engineer", level: "Mid", yearsOfExp: 3, baseSalary: 2000000, bonus: 280000, stockPerYear: 600000, remote: false, currency: "INR" },
  { companyName: "Unacademy", locationCity: "Bengaluru", role: "Software Engineer", level: "Senior", yearsOfExp: 5, baseSalary: 2800000, bonus: 450000, stockPerYear: 1100000, remote: false, currency: "INR" },

  // IT Services (much lower but realistic)
  { companyName: "Infosys", locationCity: "Bengaluru", role: "Software Engineer", level: "Intern", yearsOfExp: 0, baseSalary: 350000, bonus: 0, stockPerYear: 0, remote: false, currency: "INR" },
  { companyName: "Infosys", locationCity: "Bengaluru", role: "Software Engineer", level: "Junior", yearsOfExp: 1, baseSalary: 600000, bonus: 50000, stockPerYear: 0, remote: false, currency: "INR" },
  { companyName: "Infosys", locationCity: "Bengaluru", role: "Software Engineer", level: "Mid", yearsOfExp: 4, baseSalary: 1000000, bonus: 80000, stockPerYear: 0, remote: false, currency: "INR" },
  { companyName: "Infosys", locationCity: "Bengaluru", role: "Software Engineer", level: "Senior", yearsOfExp: 7, baseSalary: 1600000, bonus: 150000, stockPerYear: 0, remote: false, currency: "INR" },
  { companyName: "TCS", locationCity: "Mumbai", role: "Software Engineer", level: "Intern", yearsOfExp: 0, baseSalary: 350000, bonus: 0, stockPerYear: 0, remote: false, currency: "INR" },
  { companyName: "TCS", locationCity: "Mumbai", role: "Software Engineer", level: "Junior", yearsOfExp: 1, baseSalary: 550000, bonus: 40000, stockPerYear: 0, remote: false, currency: "INR" },
  { companyName: "TCS", locationCity: "Mumbai", role: "Software Engineer", level: "Mid", yearsOfExp: 4, baseSalary: 950000, bonus: 70000, stockPerYear: 0, remote: false, currency: "INR" },
  { companyName: "TCS", locationCity: "Mumbai", role: "Software Engineer", level: "Senior", yearsOfExp: 8, baseSalary: 1500000, bonus: 120000, stockPerYear: 0, remote: false, currency: "INR" },
  { companyName: "Wipro", locationCity: "Bengaluru", role: "Software Engineer", level: "Junior", yearsOfExp: 1, baseSalary: 500000, bonus: 35000, stockPerYear: 0, remote: false, currency: "INR" },
  { companyName: "Wipro", locationCity: "Bengaluru", role: "Software Engineer", level: "Mid", yearsOfExp: 4, baseSalary: 900000, bonus: 65000, stockPerYear: 0, remote: false, currency: "INR" },
  { companyName: "HCL Technologies", locationCity: "Noida", role: "Software Engineer", level: "Mid", yearsOfExp: 4, baseSalary: 900000, bonus: 60000, stockPerYear: 0, remote: false, currency: "INR" },
  { companyName: "HCL Technologies", locationCity: "Noida", role: "Software Engineer", level: "Senior", yearsOfExp: 7, baseSalary: 1500000, bonus: 110000, stockPerYear: 0, remote: false, currency: "INR" },
  { companyName: "Tech Mahindra", locationCity: "Pune", role: "Software Engineer", level: "Mid", yearsOfExp: 4, baseSalary: 850000, bonus: 55000, stockPerYear: 0, remote: false, currency: "INR" },

  // MNC India offices (INR)
  { companyName: "Google", locationCity: "Bengaluru", role: "Software Engineer", level: "Junior", yearsOfExp: 1, baseSalary: 2200000, bonus: 400000, stockPerYear: 800000, remote: false, currency: "INR" },
  { companyName: "Google", locationCity: "Bengaluru", role: "Software Engineer", level: "Mid", yearsOfExp: 3, baseSalary: 3500000, bonus: 700000, stockPerYear: 1500000, remote: false, currency: "INR" },
  { companyName: "Google", locationCity: "Bengaluru", role: "Software Engineer", level: "Senior", yearsOfExp: 6, baseSalary: 5500000, bonus: 1300000, stockPerYear: 2800000, remote: false, currency: "INR" },
  { companyName: "Google", locationCity: "Bengaluru", role: "Software Engineer", level: "Staff", yearsOfExp: 10, baseSalary: 8000000, bonus: 2200000, stockPerYear: 5000000, remote: false, currency: "INR" },
  { companyName: "Microsoft", locationCity: "Hyderabad", role: "Software Engineer", level: "Junior", yearsOfExp: 1, baseSalary: 2000000, bonus: 350000, stockPerYear: 600000, remote: false, currency: "INR" },
  { companyName: "Microsoft", locationCity: "Hyderabad", role: "Software Engineer", level: "Mid", yearsOfExp: 3, baseSalary: 3200000, bonus: 600000, stockPerYear: 1200000, remote: false, currency: "INR" },
  { companyName: "Microsoft", locationCity: "Hyderabad", role: "Software Engineer", level: "Senior", yearsOfExp: 6, baseSalary: 4800000, bonus: 1100000, stockPerYear: 2500000, remote: false, currency: "INR" },
  { companyName: "Amazon", locationCity: "Hyderabad", role: "Software Engineer", level: "Mid", yearsOfExp: 3, baseSalary: 3000000, bonus: 500000, stockPerYear: 1300000, remote: false, currency: "INR" },
  { companyName: "Amazon", locationCity: "Hyderabad", role: "Software Engineer", level: "Senior", yearsOfExp: 6, baseSalary: 4500000, bonus: 900000, stockPerYear: 2200000, remote: false, currency: "INR" },
  { companyName: "Amazon", locationCity: "Bengaluru", role: "Data Scientist", level: "Senior", yearsOfExp: 6, baseSalary: 4200000, bonus: 800000, stockPerYear: 2000000, remote: false, currency: "INR" },
  { companyName: "Meta", locationCity: "Gurgaon", role: "Software Engineer", level: "Mid", yearsOfExp: 3, baseSalary: 3500000, bonus: 700000, stockPerYear: 1800000, remote: false, currency: "INR" },
  { companyName: "Meta", locationCity: "Gurgaon", role: "Software Engineer", level: "Senior", yearsOfExp: 6, baseSalary: 5200000, bonus: 1200000, stockPerYear: 3000000, remote: false, currency: "INR" },
  { companyName: "Adobe", locationCity: "Noida", role: "Software Engineer", level: "Mid", yearsOfExp: 3, baseSalary: 2800000, bonus: 450000, stockPerYear: 900000, remote: false, currency: "INR" },
  { companyName: "Adobe", locationCity: "Noida", role: "Software Engineer", level: "Senior", yearsOfExp: 6, baseSalary: 4200000, bonus: 800000, stockPerYear: 2000000, remote: false, currency: "INR" },
  { companyName: "Atlassian", locationCity: "Bengaluru", role: "Software Engineer", level: "Mid", yearsOfExp: 3, baseSalary: 3000000, bonus: 500000, stockPerYear: 1200000, remote: false, currency: "INR" },
  { companyName: "Atlassian", locationCity: "Bengaluru", role: "Software Engineer", level: "Senior", yearsOfExp: 6, baseSalary: 4600000, bonus: 1000000, stockPerYear: 2500000, remote: false, currency: "INR" },
  { companyName: "Walmart Global Tech", locationCity: "Bengaluru", role: "Software Engineer", level: "Senior", yearsOfExp: 6, baseSalary: 4000000, bonus: 750000, stockPerYear: 1800000, remote: false, currency: "INR" },
  { companyName: "Goldman Sachs", locationCity: "Bengaluru", role: "Software Engineer", level: "Mid", yearsOfExp: 3, baseSalary: 2600000, bonus: 800000, stockPerYear: 600000, remote: false, currency: "INR" },
  { companyName: "Goldman Sachs", locationCity: "Bengaluru", role: "Software Engineer", level: "Senior", yearsOfExp: 6, baseSalary: 3800000, bonus: 1400000, stockPerYear: 1000000, remote: false, currency: "INR" },
  { companyName: "JPMorgan Chase", locationCity: "Mumbai", role: "Software Engineer", level: "Senior", yearsOfExp: 6, baseSalary: 3500000, bonus: 1200000, stockPerYear: 800000, remote: false, currency: "INR" },
  { companyName: "Uber", locationCity: "Bengaluru", role: "Software Engineer", level: "Senior", yearsOfExp: 5, baseSalary: 4200000, bonus: 800000, stockPerYear: 2000000, remote: false, currency: "INR" },

  // ── US COMPANIES (USD) ─────────────────────────────────────────────────────
  { companyName: "Google", locationCity: "San Francisco", role: "Software Engineer", level: "Junior", yearsOfExp: 1, baseSalary: 145000, bonus: 15000, stockPerYear: 30000, remote: false, currency: "USD" },
  { companyName: "Google", locationCity: "San Francisco", role: "Software Engineer", level: "Mid", yearsOfExp: 3, baseSalary: 185000, bonus: 35000, stockPerYear: 70000, remote: false, currency: "USD" },
  { companyName: "Google", locationCity: "San Francisco", role: "Software Engineer", level: "Senior", yearsOfExp: 6, baseSalary: 225000, bonus: 55000, stockPerYear: 130000, remote: false, currency: "USD" },
  { companyName: "Google", locationCity: "San Francisco", role: "Software Engineer", level: "Staff", yearsOfExp: 10, baseSalary: 285000, bonus: 85000, stockPerYear: 210000, remote: false, currency: "USD" },
  { companyName: "Google", locationCity: "San Francisco", role: "Software Engineer", level: "Principal", yearsOfExp: 14, baseSalary: 340000, bonus: 115000, stockPerYear: 380000, remote: false, currency: "USD" },
  { companyName: "Meta", locationCity: "San Francisco", role: "Software Engineer", level: "Mid", yearsOfExp: 3, baseSalary: 190000, bonus: 45000, stockPerYear: 100000, remote: false, currency: "USD" },
  { companyName: "Meta", locationCity: "San Francisco", role: "Software Engineer", level: "Senior", yearsOfExp: 6, baseSalary: 245000, bonus: 75000, stockPerYear: 190000, remote: false, currency: "USD" },
  { companyName: "Meta", locationCity: "Remote US", role: "Software Engineer", level: "Senior", yearsOfExp: 5, baseSalary: 215000, bonus: 55000, stockPerYear: 150000, remote: true, currency: "USD" },
  { companyName: "Amazon", locationCity: "Seattle", role: "Software Engineer", level: "Mid", yearsOfExp: 3, baseSalary: 175000, bonus: 20000, stockPerYear: 80000, remote: false, currency: "USD" },
  { companyName: "Amazon", locationCity: "Seattle", role: "Software Engineer", level: "Senior", yearsOfExp: 6, baseSalary: 215000, bonus: 30000, stockPerYear: 145000, remote: false, currency: "USD" },
  { companyName: "Microsoft", locationCity: "Seattle", role: "Software Engineer", level: "Senior", yearsOfExp: 7, baseSalary: 210000, bonus: 45000, stockPerYear: 105000, remote: false, currency: "USD" },
  { companyName: "Netflix", locationCity: "San Francisco", role: "Software Engineer", level: "Mid", yearsOfExp: 4, baseSalary: 295000, bonus: 0, stockPerYear: 0, remote: false, currency: "USD" },
  { companyName: "Netflix", locationCity: "San Francisco", role: "Software Engineer", level: "Senior", yearsOfExp: 7, baseSalary: 385000, bonus: 0, stockPerYear: 0, remote: false, currency: "USD" },
  { companyName: "Netflix", locationCity: "Remote US", role: "Software Engineer", level: "Staff", yearsOfExp: 11, baseSalary: 500000, bonus: 0, stockPerYear: 0, remote: true, currency: "USD" },
  { companyName: "Stripe", locationCity: "San Francisco", role: "Software Engineer", level: "Senior", yearsOfExp: 6, baseSalary: 255000, bonus: 42000, stockPerYear: 125000, remote: false, currency: "USD" },
  { companyName: "Stripe", locationCity: "Remote US", role: "Software Engineer", level: "Staff", yearsOfExp: 10, baseSalary: 325000, bonus: 65000, stockPerYear: 210000, remote: true, currency: "USD" },
  { companyName: "Airbnb", locationCity: "San Francisco", role: "Software Engineer", level: "Senior", yearsOfExp: 7, baseSalary: 225000, bonus: 42000, stockPerYear: 125000, remote: false, currency: "USD" },
  { companyName: "Salesforce", locationCity: "San Francisco", role: "Software Engineer", level: "Mid", yearsOfExp: 3, baseSalary: 165000, bonus: 25000, stockPerYear: 55000, remote: false, currency: "USD" },
  { companyName: "Salesforce", locationCity: "San Francisco", role: "Software Engineer", level: "Senior", yearsOfExp: 6, baseSalary: 210000, bonus: 40000, stockPerYear: 95000, remote: false, currency: "USD" },
  { companyName: "Notion", locationCity: "San Francisco", role: "Software Engineer", level: "Senior", yearsOfExp: 6, baseSalary: 235000, bonus: 45000, stockPerYear: 150000, remote: false, currency: "USD" },
  { companyName: "Goldman Sachs", locationCity: "New York", role: "Software Engineer", level: "Senior", yearsOfExp: 7, baseSalary: 200000, bonus: 200000, stockPerYear: 80000, remote: false, currency: "USD" },
];

async function main() {
  console.log("Clearing old data...");
  await prisma.salaryEntry.deleteMany();
  await prisma.location.deleteMany();
  await prisma.company.deleteMany();

  console.log("Seeding companies...");
  for (const co of companies) {
    const slug = slugify(normalizeCompanyName(co.name));
    await prisma.company.upsert({
      where: { slug },
      update: {},
      create: { name: co.name, slug, industry: co.industry, website: co.website },
    });
  }

  console.log("Seeding locations...");
  for (const loc of locations) {
    await prisma.location.upsert({
      where: { city_country: { city: loc.city, country: loc.country } },
      update: {},
      create: loc,
    });
  }

  console.log("Seeding salary entries...");
  let count = 0;
  for (const entry of seedEntries) {
    const slug = slugify(normalizeCompanyName(entry.companyName));
    const company = await prisma.company.findUnique({ where: { slug } });
    const location = await prisma.location.findFirst({ where: { city: entry.locationCity } });
    if (!company || !location) {
      console.warn(`Skipping: ${entry.companyName} @ ${entry.locationCity}`);
      continue;
    }
    const totalComp = entry.baseSalary + entry.bonus + entry.stockPerYear;
    await prisma.salaryEntry.create({
      data: {
        companyId: company.id,
        locationId: location.id,
        role: entry.role,
        level: entry.level,
        yearsOfExp: entry.yearsOfExp,
        baseSalary: entry.baseSalary,
        bonus: entry.bonus,
        stockPerYear: entry.stockPerYear,
        totalComp,
        currency: entry.currency,
        remote: entry.remote,
        verified: true,
      },
    });
    count++;
  }

  console.log(`✅ Seeded ${count} salary entries across ${companies.length} companies`);
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
import { Project } from "@/lib/types/project";

export const mockProjects: Project[] = [
  {
  id: "1",

  title: "توسعه خط تولید پلیمری",

  symbol: "IP-204",

  description:
    "طرح توسعه کارخانه تولید قطعات پلیمری پیشرفته جهت صادرات",

  shortDescription:
    "توسعه خط تولید محصولات مکمل دارویی.",

  industry: "صنعتی",

  category: "صنعتی",

  image: "/images/img-1.png",

  status: "active",

  progress: 65,

  targetAmount: 50000,

  fundedAmount: 32500,

  investors: 128,

  profit: 32,

  chartData: [30, 45, 40, 65, 55, 85],

  projectCode: "INV-2025-001",

  remainingDays: 12,

  minInvestment: 500000,

  maxInvestment: 500000000,

  investmentPeriod: 12,

  paymentPeriod: "هر سه ماه",

  guarantee: "چک صیادی",

  documents: [
    {
      id: "1",
      title: "طرح توجیهی",
      size: "PDF • 2.5 MB",
      type: "pdf",
      isLocked: true,
    },
    {
      id: "2",
      title: "گزارش مالی",
      size: "Excel • 1.2 MB",
      type: "excel",
      isLocked: true,
    },
  ],
},
 {
  id: "2",

  title: "نیروگاه خورشیدی مرکزی",

  symbol: "IP-205",

  description:
    "احداث نیروگاه خورشیدی ۲۰ مگاواتی در منطقه مرکزی کشور",

  shortDescription:
    "احداث نیروگاه خورشیدی ۲۰ مگاواتی.",

  industry: "انرژی",

  category: "انرژی",

  image: "/images/img-1.png",

  status: "funded",

  progress: 100,

  targetAmount: 120000,

  fundedAmount: 120000,

  investors: 215,

  profit: 28,

  chartData: [20, 30, 50, 70, 90, 100],

  projectCode: "INV-2025-002",

  remainingDays: 0,

  minInvestment: 1000000,

  maxInvestment: 1000000000,

  investmentPeriod: 18,

  paymentPeriod: "هر شش ماه",

  guarantee: "ضمانت بانکی",

  documents: [
    {
      id: "1",
      title: "مطالعات امکان‌سنجی",
      size: "PDF • 3 MB",
      type: "pdf",
      isLocked: true,
    },
    {
      id: "2",
      title: "گزارش تولید",
      size: "Excel • 1.8 MB",
      type: "excel",
      isLocked: true,
    },
  ],
},
  {
  id: "3",

  title: "استارتاپ هوش مصنوعی",

  symbol: "IP-206",

  description:
    "پلتفرم تحلیل داده مبتنی بر هوش مصنوعی برای صنایع مالی",

  shortDescription:
    "پلتفرم تحلیل داده مبتنی بر هوش مصنوعی برای تحلیل ریسک و داده‌های مالی.",

  industry: "فناوری",

  category: "فناوری",

  image: "/images/img-1.png",

  status: "closed",

  progress: 100,

  targetAmount: 35000,

  fundedAmount: 35000,

  investors: 86,

  profit: 35,

  chartData: [25, 35, 55, 75, 95, 100],

  projectCode: "INV-2025-003",

  remainingDays: 0,

  minInvestment: 300000,

  maxInvestment: 200000000,

  investmentPeriod: 10,

  paymentPeriod: "ماهانه",

  guarantee: "سفته",

  documents: [
    {
      id: "1",
      title: "Business Plan",
      size: "PDF • 2 MB",
      type: "pdf",
      isLocked: true,
    },
    {
      id: "2",
      title: "صورت‌های مالی",
      size: "Excel • 900 KB",
      type: "excel",
      isLocked: true,
    },
  ],
},
  {
  id: "4",

  title: "کارخانه بازیافت هوشمند",

  symbol: "IP-207",

  description:
    "احداث کارخانه بازیافت پسماند با فناوری هوشمند برای کاهش آلودگی و تولید مواد اولیه قابل استفاده.",

  shortDescription:
    "احداث کارخانه بازیافت پسماند با فناوری هوشمند.",

  industry: "محیط زیست",

  category: "محیط زیست",

  image: "/images/img-1.png",

  status: "active",

  progress: 53,

  targetAmount: 80000,

  fundedAmount: 42000,

  investors: 104,

  profit: 30,

  chartData: [10, 20, 35, 45, 53, 53],

  projectCode: "INV-2025-004",

  remainingDays: 21,

  minInvestment: 500000,

  maxInvestment: 300000000,

  investmentPeriod: 14,

  paymentPeriod: "هر سه ماه",

  guarantee: "ضمانت بانکی",

  documents: [
    {
      id: "1",
      title: "طرح کسب‌وکار",
      size: "PDF • 2.8 MB",
      type: "pdf",
      isLocked: true,
    },
    {
      id: "2",
      title: "برآورد هزینه‌ها",
      size: "Excel • 1.4 MB",
      type: "excel",
      isLocked: true,
    },
  ],
},
];
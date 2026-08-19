import {
  ShieldCheck,
  FileCheck,
  LockKeyhole,
} from "lucide-react";

import { SecurityItem } from "@/lib/types/security-item";

export const securityItems: SecurityItem[] = [
  {
    id: 1,
    title: "استانداردهای امنیتی",
    description: "رعایت پروتکل‌های ISO 27001",
    icon: ShieldCheck,
  },
  {
    id: 2,
    title: "نظارت مستمر",
    description: "انطباق با قوانین بانک مرکزی و بورس",
    icon: FileCheck,
  },
  {
    id: 3,
    title: "کنترل دسترسی",
    description: "سطوح دسترسی پیشرفته (RBAC)",
    icon: LockKeyhole,
  },
];
import { LucideIcon } from "lucide-react";

export type StatCardProps = {
  title: string;
  value: number;
  suffix: string;
  prefix?: string;
  icon: LucideIcon;
};
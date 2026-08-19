import { LucideIcon } from "lucide-react";

export type IconType = LucideIcon;

export interface PlatformStat {
  id: number;
  title: string;
  value: number;
  prefix?: string;
  suffix: string;
  icon: IconType;
}
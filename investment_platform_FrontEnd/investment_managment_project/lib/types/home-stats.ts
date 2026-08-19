import { LucideIcon } from "lucide-react";

export type IconType = LucideIcon;

export interface HomeStat {
  id: number;
  title: string;
  label: string;
  icon: IconType;
}
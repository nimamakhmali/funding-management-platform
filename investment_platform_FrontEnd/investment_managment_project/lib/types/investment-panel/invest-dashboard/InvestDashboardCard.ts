import type { LucideIcon } from "lucide-react";


export type CardVariant =
    | "success"
    | "neutral"
    | "danger";


export interface DashboardCardProps {
    title: string;
    value: string | number;
    unit?: string;
    change?: string;
    status?: string;
    icon?: LucideIcon;
    progress?: number;
    variant?: CardVariant;
    className?: string;

}
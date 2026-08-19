import { CardVariant } from "@/lib/types/investment-panel/invest-dashboard/InvestDashboardCard";

export const cardVariantStyles: Record<CardVariant, string> = {
    success:
        "text-primary bg-primary/10",
    neutral:
        "text-text-muted bg-background-light",
    danger:
        "text-red-500 bg-red-500/10"
};
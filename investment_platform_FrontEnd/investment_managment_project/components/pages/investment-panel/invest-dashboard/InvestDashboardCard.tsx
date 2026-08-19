import { cn } from "@/lib/utils";
import { cardVariantStyles } from "@/lib/constants/invetment-panel/invest-dashboard/dashboard-card.constants";
import { DashboardCardProps } from "@/lib/types/investment-panel/invest-dashboard/InvestDashboardCard";

export default function DashboardCard({
    title,
    value,
    unit,
    change,
    status,
    progress = 70,
    variant = "success",
    className,
}: DashboardCardProps) {
    return (
        <div
            className={cn(
                `
                bg-white
                p-6
                rounded-2xl
                border
                border-gray-100
                shadow-sm
                hover:shadow-md
                transition-shadow
                flex
                flex-col
                gap-4
                relative
                overflow-hidden
                `,
                className
            )}
        >
            <div
                className="
                flex
                justify-between
                items-start
                z-10
                "
            >
                <div>
                    <p
                        className="
                        text-text-muted
                        font-medium
                        mb-1
                        "
                    >
                        {title}
                    </p>


                    <h3
                        className="
                        text-3xl
                        font-bold
                        text-text-main
                        tracking-tight
                        "
                    >
                        {value}
                        {unit && (
                            <span
                                className="
                                text-lg
                                font-normal
                                text-text-muted
                                mr-2
                                "
                            >
                                {unit}
                            </span>
                        )}
                    </h3>
                </div>
                {(change || status) && (
                    <span
                        className={cn(
                            `
                            px-2
                            py-1
                            rounded-lg
                            text-sm
                            font-bold
                            `,
                            cardVariantStyles[variant]
                        )}
                    >
                        {change ?? status}
                    </span>
                )}
            </div>
            <div
                className="
                w-full
                bg-background-light
                h-1.5
                rounded-full
                overflow-hidden
                mt-auto
                "
            >
                <div
                    className="
                    bg-primary
                    h-full
                    rounded-full
                    transition-all
                    "
                    style={{
                        width: `${progress}%`,
                    }}
                />
            </div>
        </div>
    );
}
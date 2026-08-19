"use client";
import { ReactNode } from "react";
import { cn } from "@/lib/utils";

type StatisticCardProps = {
  title: string;
  value: string;
  unit?: string;
  icon: ReactNode;
  iconClass: string;
  footer: ReactNode;
};

export default function StatisticCard({
  title,
  value,
  unit,
  icon,
  iconClass,
  footer,
}: StatisticCardProps) {
  return (
    <div className="group rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition-all hover:border-primary/30 mt-8 mb-8">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-medium text-text-muted">
            {title}
          </p>
          <h4 className="mt-2 text-xl font-black text-text-dark">
            {value}
            {unit && (
              <span className="mr-1 text-sm font-normal text-text-muted">
                {unit}
              </span>
            )}
          </h4>
        </div>
        <div
          className={cn(
            "rounded-lg p-2 transition-colors",
            iconClass
          )}
        >
          {icon}
        </div>
      </div>
      <div className="mt-4">
        {footer}
      </div>
    </div>
  );
}
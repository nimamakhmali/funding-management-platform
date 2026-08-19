"use client";

import Card from "@/components/ui/Card";
import { toPersianNumber } from "@/lib/utils/Numberformat";
import { MapPin } from "lucide-react";

// ── نوع پروژه از API ──────────────────────────────────────────────────────────
interface ProjectData {
  id: string;
  title: string;
  description: string;
  category_display: string;
  cover_image_url: string | null;
  required_budget: string;
  raised_amount: string;
  min_investment_amount: string;
  max_investment_amount: string;
  profit_rate_percentage: string;
  remaining_days: number;
  funding_percentage: string;
  investors_count: number;
  status: string;
  status_display: string;
  start_date: string | null;
  end_date: string | null;
}

interface Props {
  project: ProjectData;
}

export default function InvestmentProjectCardConnected({ project }: Props) {
  const progress = parseFloat(project.funding_percentage) || 0;
  const roi = parseFloat(project.profit_rate_percentage) || 0;
  const remainingCapacity =
    parseFloat(project.required_budget) - parseFloat(project.raised_amount);

  // مدت زمان (روز به ماه تقریبی)
  const durationMonths = Math.ceil(project.remaining_days / 30) || 0;

  const infoItems = [
    {
      label: "بازدهی سالانه (ROI)",
      value: `${toPersianNumber(roi)}%`,
      className: "flex-1",
    },
    {
      label: "روزهای باقی‌مانده",
      value: `${toPersianNumber(project.remaining_days)} روز`,
      className: "flex-1",
    },
    {
      label: "ظرفیت باقی‌مانده",
      value: toPersianNumber(Math.max(0, remainingCapacity)),
      unit: "تومان",
      className: "flex-1",
    },
  ];

  return (
    <Card
      data={{ title: project.title, value: roi }}
      mapping={{ title: "title", value: "value" }}
      renderTitle={(title) => (
        <>
          <div className="flex flex-col md:flex-row justify-between md:items-start gap-4">
            <div className="flex gap-3">
              <div
                className="size-12 rounded-xl bg-cover bg-center shrink-0 shadow-sm"
                style={{
                  backgroundImage: `url(${project.cover_image_url ?? "/images/img-1.png"})`,
                }}
              />
              <div>
                <h3 className="text-lg font-bold text-text-main mb-0.5">
                  {title}
                </h3>
                <div className="flex items-center gap-1 text-text-secondary text-xs">
                  <MapPin className="size-4" />
                  <span>{project.category_display}</span>
                </div>
              </div>
            </div>
            <div className="inline-flex items-center gap-1.5 bg-primary/5 px-2 py-1 rounded-lg border border-primary/10 self-start">
              <span className="text-primary text-xs font-medium">
                {project.status_display}
              </span>
            </div>
          </div>
          <div className="h-px bg-neutral-border w-full opacity-60 my-3" />
        </>
      )}
      renderValue={() => (
        <div className="flex flex-col gap-4">
          <div className="flex justify-between items-center gap-4">
            {infoItems.map((item, index) => (
              <div key={index} className={item.className}>
                <span className="text-gray-800 text-xs font-medium block mb-1">
                  {item.label}
                </span>
                <span className="text-xl font-bold text-text-main">
                  {item.value}{" "}
                  {item.unit && (
                    <span className="text-xs font-normal text-text-secondary">
                      {item.unit}
                    </span>
                  )}
                </span>
              </div>
            ))}
          </div>
          <div className="flex flex-col gap-1.5">
            <div className="flex justify-between text-xs">
              <span className="text-text-main font-medium">
                پیشرفت تامین مالی
              </span>
              <span className="text-primary font-bold font-mono text-xs">
                {toPersianNumber(Number(progress.toFixed(1)))}%
              </span>
            </div>
            <div className="w-full bg-neutral-border/50 rounded-full h-2 overflow-hidden">
              <div
                className="bg-primary h-2 rounded-full"
                style={{ width: `${Math.min(progress, 100)}%` }}
              />
            </div>
          </div>
        </div>
      )}
      className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 mt-10"
    />
  );
}
import { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Progress } from "@/components/ui/progress";
import { toPersianNumber } from "@/lib/utils/Numberformat"; 

interface FinancialItem {
  icon: ReactNode;
  iconClassName?: string;
  label: string;
  amount: number; 
  currency: string;
}

interface ProjectFinancialCardProps {
  targetAmount: FinancialItem;  
  raisedAmount: FinancialItem;  
  progress: {
    percentage: number;
    label: string;
    remainingTime: string;
  };
  className?: string;
}

export function ProjectFinancialCard({
  targetAmount,
  raisedAmount,
  progress,
  className,
}: ProjectFinancialCardProps) {
  return (
    <div
      className={cn(
        "bg-white rounded-2xl p-6 shadow-sm border border-slate-100 flex flex-col justify-between min-h-[180px]",
        className
      )}
    >
      <div>
        <div className="flex flex-col md:flex-row justify-between gap-6 mb-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <div className={targetAmount.iconClassName || "p-1.5 bg-purple-50 text-primary rounded-md"}>
                {targetAmount.icon}
              </div>
              <span className="text-slate-500 text-sm font-medium">
                {targetAmount.label}
              </span>
            </div>
            <p className="text-2xl font-bold">
              {toPersianNumber(targetAmount.amount)}{" "}
              <span className="text-sm text-gray-400 font-normal">
                {targetAmount.currency}
              </span>
            </p>
          </div>
          <div className="flex-1 md:border-r md:pr-6 border-slate-100">
            <div className="flex items-center gap-2 mb-2">
              <div className={raisedAmount.iconClassName || "p-1.5 text-primary rounded-md"}>
                {raisedAmount.icon}
              </div>
              <span className="text-slate-500 text-sm font-medium">
                {raisedAmount.label}
              </span>
            </div>
            <p className="text-2xl font-black">
              {toPersianNumber(raisedAmount.amount)}{" "}
              <span className="text-sm text-gray-400 font-normal">
                {raisedAmount.currency}
              </span>
            </p>
          </div>
        </div>
        <div className="mt-10">
          <div className="flex justify-between items-end mb-2">
            <span className="text-sm font-bold text-primary">
              {progress.label}
            </span>
            <span className="text-xs text-gray-400">
              {progress.remainingTime}
            </span>
          </div>
          <Progress 
            value={progress.percentage} 
            className="h-3" 
          />
        </div>
      </div>
    </div>
  );
}
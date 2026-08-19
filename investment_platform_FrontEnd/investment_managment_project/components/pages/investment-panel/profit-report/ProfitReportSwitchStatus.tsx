import { ReactNode } from "react";

type Props = {
  status: "pay" | "isPending";
};

export default function ProfitReportSwitchStatus({ status }: Props) {
  let ProfitReportSwitchStatusComponent: ReactNode | null = null;

  switch (status) {
    case "pay":
      ProfitReportSwitchStatusComponent = (
        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-primary/10 text-primary border border-primary/10">
          <span className="w-1 h-1 bg-primary inline-block rounded-full" />
          پرداخت شده
        </span>
      );
      break;
    case "isPending":
      ProfitReportSwitchStatusComponent = (
        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-50 text-amber-700 text-[11px] font-black border border-amber-100">
          <span className="w-1 h-1 bg-amber-700 inline-block rounded-full" />
          در انتظار پرداخت
        </span>
      );
      break;
    default:
      throw new Error("Invalid status");
  }
  return ProfitReportSwitchStatusComponent;
}

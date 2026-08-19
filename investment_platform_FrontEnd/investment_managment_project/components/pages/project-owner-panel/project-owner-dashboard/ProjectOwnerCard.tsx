import { ReactNode } from "react";

type DashboardCardProps = {
  children: ReactNode;
};

export default function ProjectOwnerCard({
  children,
}: DashboardCardProps) {
  return (
    <div className="group rounded-2xl border border-slate-100 bg-white p-6 shadow-card transition-all hover:shadow-soft">
      {children}
    </div>
  );
}
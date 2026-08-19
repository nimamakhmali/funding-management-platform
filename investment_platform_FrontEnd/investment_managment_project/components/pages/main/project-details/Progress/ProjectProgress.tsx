import { TrendingUp, Users, CalendarDays } from "lucide-react";
import { Project } from "@/lib/types/project";

type Props = {
  project: Project;
};

export default function ProjectProgress({
  project,
}: Props) {
  const percent =
    (project.fundedAmount / project.targetAmount) * 100;

  const remaining =
    project.targetAmount - project.fundedAmount;

  return (
    <section className="rounded-2xl border border-border bg-white p-8 shadow-sm">

      <div className="flex flex-col gap-8">

        <div className="flex items-end justify-between">

          <div>
            <p className="text-sm text-muted-foreground">
              مبلغ جذب شده
            </p>

            <h2 className="mt-1 text-4xl font-extrabold">
              {project.fundedAmount.toLocaleString("fa-IR")}
            </h2>

            <span className="text-sm text-muted-foreground">
              تومان
            </span>
          </div>

          <div className="text-left">
            <p className="text-sm text-muted-foreground">
              مبلغ هدف
            </p>

            <h3 className="mt-1 text-2xl font-bold text-gray-400">
              {project.targetAmount.toLocaleString("fa-IR")}
            </h3>

            <span className="text-sm text-muted-foreground">
              تومان
            </span>
          </div>

        </div>

        <div>

          <div className="mb-3 h-4 overflow-hidden rounded-full bg-muted">
            <div
              className="h-full rounded-full bg-primary transition-all duration-700"
              style={{
                width: `${percent}%`,
              }}
            />
          </div>

          <div className="flex items-center justify-between">

            <span className="font-bold text-primary">
              {Math.round(percent).toLocaleString("fa-IR")}٪
            </span>

            <span className="text-sm text-muted-foreground">
              {remaining.toLocaleString("fa-IR")} تومان باقی مانده
            </span>

          </div>

        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">

          <div className="rounded-xl border border-border bg-muted/30 p-5 text-center">
            <TrendingUp className="mx-auto mb-3 h-6 w-6 text-primary" />

            <p className="text-sm text-muted-foreground">
              سود سالانه
            </p>

            <h3 className="mt-2 text-2xl font-bold">
              {project.profit.toLocaleString("fa-IR")}٪
            </h3>
          </div>

          <div className="rounded-xl border border-border bg-muted/30 p-5 text-center">
            <Users className="mx-auto mb-3 h-6 w-6 text-primary" />

            <p className="text-sm text-muted-foreground">
              سرمایه‌گذاران
            </p>

            <h3 className="mt-2 text-2xl font-bold">
              {project.investors.toLocaleString("fa-IR")}
            </h3>
          </div>

          <div className="rounded-xl border border-border bg-muted/30 p-5 text-center">
            <CalendarDays className="mx-auto mb-3 h-6 w-6 text-primary" />

            <p className="text-sm text-muted-foreground">
              روز باقی‌مانده
            </p>

            <h3 className="mt-2 text-2xl font-bold">
              {project.remainingDays.toLocaleString("fa-IR")}
            </h3>
          </div>

        </div>

      </div>

    </section>
  );
}
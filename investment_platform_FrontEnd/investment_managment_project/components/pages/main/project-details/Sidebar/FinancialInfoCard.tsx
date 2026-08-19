import { Project } from "@/lib/types/project";


type Props = {
  project: Project;
};

export default function FinancialInfoCard({
  project,
}: Props) {
  const items = [
    {
      title: "حداقل سرمایه‌گذاری",
      value: `${project.minInvestment.toLocaleString("fa-IR")} تومان`,
    },
    {
      title: "حداکثر سرمایه‌گذاری",
      value: `${project.maxInvestment.toLocaleString("fa-IR")} تومان`,
    },
    {
      title: "دوره سرمایه‌گذاری",
      value: `${project.investmentPeriod} ماه`,
    },
    {
      title: "پرداخت سود",
      value: project.paymentPeriod,
    },
    {
      title: "ضمانت",
      value: project.guarantee,
    },
  ];

  return (
    <section className="rounded-2xl border border-border bg-white p-6 shadow-sm">

      <h2 className="mb-5 text-xl font-extrabold">
        اطلاعات مالی
      </h2>

      <div className="space-y-4">

        {items.map((item) => (
          <div
            key={item.title}
            className="
              flex
              items-center
              justify-between
              border-b
              border-border
              pb-3
              last:border-none
              last:pb-0
            "
          >
            <span className="text-sm text-muted-foreground">
              {item.title}
            </span>

            <span className="font-bold">
              {item.value}
            </span>

          </div>
        ))}

      </div>

    </section>
  );
}
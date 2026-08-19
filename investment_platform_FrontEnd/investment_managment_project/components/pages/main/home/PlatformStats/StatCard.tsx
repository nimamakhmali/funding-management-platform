import { StatCardProps } from "@/lib/types/stat";


export default function StatCard({
  title,
  value,
  suffix,
  prefix,
  icon: Icon,
}: StatCardProps) {
  return (
    <div className="group rounded-3xl border border-border bg-surface p-8 transition-all duration-300 hover:-translate-y-2 hover:shadow-xl">

      <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 transition-transform duration-300 group-hover:scale-110">
        <Icon className="h-7 w-7 text-primary" />
      </div>

      <h3 className="text-5xl font-black text-text-main">
        {prefix}
        {value.toLocaleString("fa-IR")}
      </h3>

      <p className="mt-3 font-bold text-text-main">
        {suffix}
      </p>

      <p className="mt-2 text-sm text-text-muted">
        {title}
      </p>

    </div>
  );
}
import { SecurityItem } from "@/lib/types/security-item";

type SecurityCardProps = {
  item: SecurityItem;
};

export default function SecurityCard({
  item,
}: SecurityCardProps) {
  const Icon = item.icon;

  return (
    <div className="flex flex-col items-center rounded-xl border border-dashed border-border p-6 text-center transition-all duration-300 hover:-translate-y-2 hover:border-primary/30 hover:shadow-lg">

      <Icon className="mb-4 h-14 w-14 text-gray-400" />

      <h3 className="mb-2 font-bold text-text-main">
        {item.title}
      </h3>

      <p className="text-xs text-text-muted">
        {item.description}
      </p>

    </div>
  );
}
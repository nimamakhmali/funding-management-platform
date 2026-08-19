import { ProjectOwnerStatsCard as ProjectOwnerStatsCardType } from "@/lib/types/project-owner-panel/project-owner-dashboard/projectOwnerStatsCard";

type ProjectOwnerStatsCardProps = {
  card: ProjectOwnerStatsCardType;
};

export default function ProjectOwnerStatsCard({
  card,
}: ProjectOwnerStatsCardProps) {
  return (
    <div
      className={`flex items-center gap-4 rounded-xl border border-slate-100 bg-white p-5 shadow-sm transition-all hover:border-primary/20 ${card.cardClassName ?? ""}`}
    >
      <div
        className={`flex size-12 items-center justify-center rounded-xl ${card.iconClassName}`}
      >
        {card.icon}
      </div>

      <div className="flex flex-col">
        <span
          className={`text-[11px] font-bold ${card.titleClassName}`}
        >
          {card.title}
        </span>

        <span className="text-xl font-black text-text-main">
          {card.value}
        </span>
      </div>
    </div>
  );
}
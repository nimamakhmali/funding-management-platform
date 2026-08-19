import { ProjectOwnerProjectStat as ProjectStat } from "@/lib/types/project-owner-panel/project-owner-dashboard/ProjectOwnerActiveProject";

type Props = {
  stat: ProjectStat;
};

export default function ProjectOwnerProjectStat({
  stat,
}: Props) {
  return (
    <div className="space-y-1">
      <span className="text-[10px] font-bold text-text-secondary">
        {stat.label}
      </span>

      <p
        className={`font-bold text-text-main ${stat.valueClassName ?? ""}`}
      >
        {stat.value}

        {stat.unit && (
          <span className="mr-1 text-[9px] text-slate-400">
            {stat.unit}
          </span>
        )}
      </p>
    </div>
  );
}
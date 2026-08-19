import ProjectOwnerCard from "./ProjectOwnerCard";
import ProjectOwnerCardBadge from "./ProjectOwnerCardBadge";
import ProjectOwnerCardIcon from "./ProjectOwnerCardIcon";

import { ProjectOwnerDashboardCards } from "@/lib/types/project-owner-panel/project-owner-dashboard/projectOwnerDashboardCards";

type ProjectOwnerDashboardCardProps = {
  card: ProjectOwnerDashboardCards;
};

export default function ProjectOwnerDashboardCard({
  card,
}: ProjectOwnerDashboardCardProps) {
  return (
    <ProjectOwnerCard>
      <div className="mb-5 flex items-center gap-3">
  <ProjectOwnerCardIcon
    icon={card.icon}
    className={card.iconClassName}
  />

  <span className="text-xs font-bold text-gray-800">
    {card.title}
  </span>
</div>

      <div className="space-y-1 text-right">
        <div className="text-2xl font-black text-text-main">
          {card.value}

          {card.unit && (
            <span className="mr-1 text-xs font-medium text-gray-700">
              {card.unit}
            </span>
          )}

          {card.badge && (
            <ProjectOwnerCardBadge 
              text={card.badge.text}
              icon={card.badge.icon}
              className={card.badge.className}
            />
          )}
        </div>

        <p className="text-[11px] text-gray-800">
          {card.description}
        </p>
      </div>
    </ProjectOwnerCard>
  );
}
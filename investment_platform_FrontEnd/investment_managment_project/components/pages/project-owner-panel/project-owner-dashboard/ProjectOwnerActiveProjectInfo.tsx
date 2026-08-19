import ProjectOwnerProjectStat from "./ProjectOwnerProjectStat";
import { ProjectOwnerActiveProject } from 
"@/lib/types/project-owner-panel/project-owner-dashboard/ProjectOwnerActiveProject";

type Props = {
  project: ProjectOwnerActiveProject;
};

export default function ProjectOwnerActiveProjectInfo({
  project,
}: Props) {
  return (
    <div className="mb-8 flex flex-col gap-8 md:flex-row">
      <div className="flex size-20 items-center justify-center rounded-2xl border border-slate-100 bg-slate-50 text-primary">
        {project.icon}
      </div>

      <div className="flex-1 space-y-4">
        <div>
          <h4 className="mb-1 text-xl font-black text-text-main">
            {project.title}
          </h4>

          <p className="text-sm text-text-secondary">
            شناسه طرح:

            <span className="mr-1 font-sans">
              {project.code}
            </span>
          </p>
        </div>

        <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
          {project.stats.map((stat) => (
            <ProjectOwnerProjectStat
              key={stat.label}
              stat={stat}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
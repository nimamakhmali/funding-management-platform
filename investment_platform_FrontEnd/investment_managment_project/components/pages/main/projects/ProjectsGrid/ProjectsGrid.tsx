import ProjectCard from "./ProjectCard";
import { Project } from "@/lib/types/project";

type ProjectsGridProps = {
  projects: Project[];
};

export default function ProjectsGrid({ projects }: ProjectsGridProps) {
  if (!projects.length) {
    return (
      <div
        className="
          mt-10
          rounded-2xl
          border
          border-dashed
          border-border
          bg-white
          p-12
          text-center
        "
      >
        <h3 className="text-lg font-bold">پروژه‌ای پیدا نشد</h3>

        <p className="mt-2 text-sm text-muted-foreground">
          فیلترهای انتخابی خود را تغییر دهید.
        </p>
      </div>
    );
  }

  return (
    <section
      className="
        mt-8
        grid
        grid-cols-1
        gap-8
        md:grid-cols-2
        xl:grid-cols-3
      "
    >
      {projects.map((project) => (
        <ProjectCard key={project.id} project={project} />
      ))}
    </section>
  );
}

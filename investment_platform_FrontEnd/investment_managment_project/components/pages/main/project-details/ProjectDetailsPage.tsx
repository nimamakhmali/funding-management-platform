import ProjectHero from "./Hero/ProjectHero";
import ProjectProgress from "./Progress/ProjectProgress";
import ProjectDescription from "./Description/ProjectDescription";



import FinancialInfoCard from "./Sidebar/FinancialInfoCard";
import InvestmentCard from "./Sidebar/InvestmentCard";
import SecurityBadges from "./Sidebar/SecurityBadges";

import { Project } from "@/lib/types/project";
import DocumentsCard from "./Documents/DocumentCard";

type Props = {
  project: Project;
};

export default function ProjectDetailsPage({
  project,
}: Props) {
  return (
    <section className="mx-auto max-w-7xl px-4 py-8">

      <div className="grid gap-8 lg:grid-cols-3">

        <div className="space-y-8 lg:col-span-2">

          <ProjectHero
            project={project}
          />

          <ProjectProgress
            project={project}
          />

          <ProjectDescription
            description={project.description}
          />

          <DocumentsCard
            documents={project.documents}
          />

        </div>

        <aside>

          <div className="sticky top-24 space-y-6">

            <FinancialInfoCard
              project={project}
            />

            <InvestmentCard />

            <SecurityBadges />

          </div>

        </aside>

      </div>

    </section>
  );
}
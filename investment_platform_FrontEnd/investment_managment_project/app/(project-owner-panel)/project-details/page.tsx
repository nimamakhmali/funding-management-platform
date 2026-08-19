import { Suspense } from "react";
import ProjectDetailsHeader from "@/components/pages/project-owner-panel/project-details/ProjectDetailsHeader";
import ProjectDetailsInformation from "@/components/pages/project-owner-panel/project-details/ProjectDetailsInformation";
import ProjectDetailsSection from "@/components/pages/project-owner-panel/project-details/ProjectDetailsSection";
import Container from "@/components/ui/Container";

export default function Page() {
  return (
    <Container>
      <Suspense fallback={<div className="py-8 text-center text-gray-400">در حال بارگذاری...</div>}>
        <ProjectDetailsHeader />
        <ProjectDetailsInformation />
        <ProjectDetailsSection />
      </Suspense>
    </Container>
  );
}
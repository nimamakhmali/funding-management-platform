import Container from "@/components/ui/Container";
import CreateProjectHeader from "@/components/pages/project-owner-panel/create-project/CreateProjectHeader";
import CreateNewProjectForm from "@/components/pages/project-owner-panel/create-project/CreateNewProjectForm";
export default function Page(){
    return(
        <Container>
            <CreateProjectHeader />
            <CreateNewProjectForm />
        </Container>
        
    )
}
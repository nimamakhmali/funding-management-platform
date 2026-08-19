import MyProjectsBody from "@/components/pages/project-owner-panel/my-projects/MyProjectsBody";
import MyProjectsHeader from "@/components/pages/project-owner-panel/my-projects/MyProjectsHeader";
import MyPojectsFilter from "@/components/pages/project-owner-panel/my-projects/MyProjectsFilter";
export default function Page(){
    return(
      <div>
        <MyProjectsHeader />
        <MyPojectsFilter />
        <MyProjectsBody />
      </div>
    )
}
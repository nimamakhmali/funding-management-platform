import {
 FolderKanban,
  BookDashed,
  FileChartColumn
} from "lucide-react";


export const PROJECT_OWNER_SIDEBAR = [
  {
    id: "dashboard-owner",
    href: "/project-owner-dashboard",
    title: "داشبورد",
    icon: BookDashed,
  },

  {
    id: "projects-owner",
    href: "/my-projects",
    title: "پروژه های من",
    icon: FolderKanban,
  },


  {
    id: "reports-owner",
    href: "/reports",
    title: "گزارش ها",
    icon: FileChartColumn,
  },

];
'use client'

import { Sidebar } from "@/components/ui/sidebar"
import UserSidebarFooter from "./UserSidebarFooter"
import UseSidebarHeader from "./UseSidebarHeader"
import UseSidebarContant from "./UseSidebarContant"

import { SIDEBARE_ITEMS } from "@/lib/constants/sidebar"
import { Sidebar as SidebarType } from "@/lib/types/sidebar-types"


type AppSidebarProps = {
  items?: SidebarType[]
}


export default function AppSidebar({
  items = SIDEBARE_ITEMS
}: AppSidebarProps) {


  return (
    <Sidebar 
      variant="sidebar" 
      side="right" 
      collapsible="icon" 
      className="border-gray-100 bg-white shadow-sm"
    >
      <UseSidebarHeader />
      <UseSidebarContant items={items} />
      <UserSidebarFooter/>
    </Sidebar>
  )
}
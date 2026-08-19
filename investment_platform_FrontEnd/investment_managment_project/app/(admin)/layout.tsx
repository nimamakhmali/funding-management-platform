"use client";

import { SidebarProvider } from "@/components/ui/sidebar";
import AppSidebar from "@/components/layouts/Sidebar";
import { TooltipProvider } from "@/components/ui/tooltip";
import PanelHeader from "@/components/layouts/PanelHeader";
import MobileSidebar from "@/components/layouts/UseMobileSidebar";
import { ADMIN_SIDEBAR } from "@/lib/constants/admin/admin-sidebar";


export default function ProjectOwnerLayout({children}: {children: React.ReactNode})
 {
  return (
    <SidebarProvider defaultOpen={true}>
      <TooltipProvider>
        <div className="flex h-screen w-full bg-gray-50 relative">
          <AppSidebar 
            items={ADMIN_SIDEBAR}
          />
          <div className="flex flex-1 flex-col overflow-hidden">
            <PanelHeader />
            <main className="flex-1 overflow-y-auto p-6">
              {children}
            </main>
          </div>
          <MobileSidebar />
        </div>
      </TooltipProvider>
    </SidebarProvider>
  );
}
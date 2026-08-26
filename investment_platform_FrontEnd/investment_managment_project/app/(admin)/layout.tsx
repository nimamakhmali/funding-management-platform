// investment_platform_FrontEnd/investment_managment_project/app/(admin)/layout.tsx
"use client";

import { SidebarProvider } from "@/components/ui/sidebar";
import AppSidebar from "@/components/layouts/Sidebar";
import { TooltipProvider } from "@/components/ui/tooltip";
import PanelHeader from "@/components/layouts/PanelHeader";
import MobileSidebar from "@/components/layouts/UseMobileSidebar";
import { ADMIN_SIDEBAR } from "@/lib/constants/admin/admin-sidebar";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // reset scroll به بالا در هر navigation
  useEffect(() => {
    const main = document.querySelector("main");
    if (main) {
      main.scrollTop = 0;
    }
  }, [pathname]);

  if (!mounted) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-gray-50">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  return (
    <SidebarProvider defaultOpen={true}>
      <TooltipProvider>
        <div className="flex h-screen w-full bg-gray-50 relative overflow-hidden">
          <AppSidebar items={ADMIN_SIDEBAR} />
          <div className="flex flex-1 flex-col min-h-0 overflow-hidden">
            <PanelHeader />
            <main
              key={pathname}
              className="flex-1 overflow-y-auto p-6"
            >
              {children}
            </main>
          </div>
          <MobileSidebar />
        </div>
      </TooltipProvider>
    </SidebarProvider>
  );
}
"use client"
import {
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";

export default function UseSidebarHeader() {
  const { isMobile, state, toggleSidebar } = useSidebar();

  const isCollapsed = state === "collapsed" && !isMobile;
  return (
    <SidebarHeader className="border-b border-gray-200 pb-4">
      <SidebarMenu>
        <SidebarMenuItem
          className={`flex items-center ${
            isCollapsed ? "justify-center" : "justify-between"
          }`}
        >
          {isCollapsed ? (
            <button
              onClick={toggleSidebar}
              className="flex items-center justify-center h-12"
            >
              <div className="size-9 bg-purple-100 rounded-xl flex items-center justify-center shadow-sm">
                <div className="size-4 bg-primary rounded-full" />
              </div>
            </button>
          ) : (
            <>
              <SidebarMenuButton size="lg" asChild>
                <div className="flex items-center gap-2 px-2">
                  <div className="size-10 bg-purple-100 rounded-xl flex items-center justify-center shadow-sm shrink-0">
                    <div className="size-5 bg-primary rounded-full" />
                  </div>

                  <div className="flex flex-col gap-0.5 leading-none">
                    <span className="text-lg font-semibold">
                      لگو
                    </span>
                  </div>
                </div>
              </SidebarMenuButton>
              <SidebarTrigger className="hidden md:flex shrink-0 text-gray-600 hover:text-gray-600" />
            </>
          )}
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarHeader>
  );
}
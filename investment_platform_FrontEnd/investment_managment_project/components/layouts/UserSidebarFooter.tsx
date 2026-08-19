"use client";

import { AvatarImage, AvatarFallback, Avatar } from "../ui/avatar";
import { SidebarFooter, SidebarMenuButton } from "../ui/sidebar";
import { useSidebar } from "@/components/ui/sidebar";
import Link from "next/link";
import { LogOut } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { useAuthStore } from "@/lib/store/auth.store";
import { authService } from "@/lib/api/services/auth.service";

function getRoleLabel(role: string | null): string {
  const map: Record<string, string> = {
    INVESTOR: "سرمایه‌گذار",
    PROJECT_OWNER: "صاحب طرح",
    ENTREPRENEUR: "کارآفرین",
    ADMIN: "مدیر سیستم",
  };
  return map[role ?? ""] ?? "";
}

function getInitials(fullName?: string | null): string {
  if (!fullName) return "ک";
  const parts = fullName.trim().split(" ");
  if (parts.length >= 2) {
    return (parts[0].charAt(0) + parts[1].charAt(0)).toUpperCase();
  }
  return parts[0].charAt(0).toUpperCase();
}

export default function UserSidebarFooter() {
  const { state, isMobile } = useSidebar();
  const isCollapsed = state === "collapsed" && !isMobile;
  const { isAuthenticated, role, logout } = useAuthStore();

  const { data: profile } = useQuery({
    queryKey: ["profile", "me"],
    queryFn: authService.getProfile,
    enabled: isAuthenticated,
    staleTime: 5 * 60 * 1000,
  });

  // full_name را مستقیم از بک‌اند می‌گیریم
  const displayName = profile?.full_name || profile?.user?.username || "کاربر";

  // role را از profile بک‌اند می‌گیریم (دقیق‌تر از store)
  const currentRole = profile?.role ?? role;
  const roleLabel = getRoleLabel(currentRole);
  const initials = getInitials(profile?.full_name);

  const handleLogout = () => {
    logout();
    window.location.href = "/login";
  };

  return (
    <SidebarFooter className="border-t border-gray-200 p-4">
      {isCollapsed ? (
        <SidebarMenuButton
          asChild
          className="w-full flex justify-center gap-3"
        >
          <Link href="/AccountSettings">
            <Avatar className="h-9 w-9">
              {profile?.avatar_url ? (
                <AvatarImage src={profile.avatar_url} />
              ) : (
                <AvatarFallback className="bg-primary/10 text-primary font-bold">
                  {initials}
                </AvatarFallback>
              )}
            </Avatar>
          </Link>
        </SidebarMenuButton>
      ) : (
        <div className="flex items-center gap-2">
          <SidebarMenuButton asChild className="flex-1">
            <Link
              href="/AccountSettings"
              className="flex items-center gap-3"
            >
              <Avatar className="h-8 w-8">
                {profile?.avatar_url ? (
                  <AvatarImage src={profile.avatar_url} />
                ) : (
                  <AvatarFallback className="bg-primary/10 text-primary font-bold text-xs">
                    {initials}
                  </AvatarFallback>
                )}
              </Avatar>

              <div className="flex flex-col items-start min-w-0">
                <span className="text-sm font-medium truncate max-w-[120px]">
                  {displayName}
                </span>
                {roleLabel && (
                  <span className="text-xs text-gray-400">{roleLabel}</span>
                )}
              </div>
            </Link>
          </SidebarMenuButton>

          <button
            onClick={handleLogout}
            className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-red-500 transition-colors"
            title="خروج"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      )}
    </SidebarFooter>
  );
}
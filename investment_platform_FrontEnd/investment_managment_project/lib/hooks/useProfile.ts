"use client";
import { useQuery } from "@tanstack/react-query";
import { useAuthStore } from "@/lib/store/auth.store";
import { profileService, UserProfileData } from "@/lib/api/services/profile.service";

export const PROFILE_QUERY_KEY = ["profile", "me"];

export function useProfile() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const setUser = useAuthStore((s) => s.setUser);

  const query = useQuery<UserProfileData>({
    queryKey: PROFILE_QUERY_KEY,
    queryFn: async () => {
      const profile = await profileService.getMe();
      // اطلاعات پروفایل را در store ذخیره می‌کنیم
      setUser({
        id: profile.user.id,
        phone_number: profile.user.phone_number,
        role: profile.role,
        username: profile.user.username,
      });
      return profile;
    },
    enabled: isAuthenticated,
    staleTime: 5 * 60 * 1000,    // 5 دقیقه
    gcTime: 10 * 60 * 1000,      // 10 دقیقه
    retry: 1,
  });

  return {
    profile: query.data,
    isLoading: query.isLoading,
    isError: query.isError,
    refetch: query.refetch,
    // فیلدهای پرکاربرد مستقیماً expose می‌شوند
    fullName: query.data?.full_name ?? "",
    role: query.data?.role ?? "",
    avatarUrl: query.data?.avatar_url ?? null,
    email: query.data?.email ?? "",
  };
}
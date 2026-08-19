import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { decodeJwtPayload, getRoleDashboardPath } from "@/lib/utils/auth.utils";

export interface UserInfo {
  id: string;
  phone_number: string;
  role: string;
  username?: string;
  full_name?: string;  // اضافه شد
}

interface AuthState {
  accessToken: string | null;
  refreshToken: string | null;
  phoneNumber: string | null;
  role: string | null;
  isAuthenticated: boolean;
  user: UserInfo | null;

  setTokens: (access: string, refresh: string) => void;
  setPhoneNumber: (phone: string) => void;
  setRole: (role: string) => void;
  setUser: (user: UserInfo) => void;
  getDashboardPath: () => string;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      accessToken: null,
      refreshToken: null,
      phoneNumber: null,
      role: null,
      isAuthenticated: false,
      user: null,

      setTokens: (access, refresh) => {
        const payload = decodeJwtPayload(access);
        const role = (payload?.role as string) ?? null;
        set({
          accessToken: access,
          refreshToken: refresh,
          isAuthenticated: true,
          role,
        });
      },

      setPhoneNumber: (phone) => set({ phoneNumber: phone }),

      setRole: (role) => set({ role }),

      setUser: (user) =>
        set({
          user,
          role: user.role,
          phoneNumber: user.phone_number,
        }),

      getDashboardPath: () => {
        const role = get().role;
        return getRoleDashboardPath(role ?? "");
      },

      logout: () =>
        set({
          accessToken: null,
          refreshToken: null,
          phoneNumber: null,
          role: null,
          isAuthenticated: false,
          user: null,
        }),
    }),
    {
      name: "auth-storage",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
        phoneNumber: state.phoneNumber,
        role: state.role,
        isAuthenticated: state.isAuthenticated,
        user: state.user,
      }),
    }
  )
);
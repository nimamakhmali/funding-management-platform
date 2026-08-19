import axiosInstance from "@/lib/api/orval/axios-instance";

export interface UserProfileData {
  id: string;
  user: {
    id: string;
    username: string;
    phone_number: string;
  };
  email: string;
  role: string;
  full_name: string;
  profile_type: "INDIVIDUAL" | "LEGAL_ENTITY" | null;
  first_name: string | null;
  last_name: string | null;
  date_of_birth: string | null;
  contact_number: string | null;
  entity_type: string | null;
  company_name_persian: string | null;
  company_name_latin: string | null;
  ceo_name: string | null;
  surname: string | null;
  country: string | null;
  province: string | null;
  postal_code: string | null;
  company_name: string | null;
  address: string | null;
  bio: string | null;
  avatar_url: string | null;
  bank_account_number: string | null;
  created_at: string;
  updated_at: string;
}

export interface ProfileApiResponse {
  data: UserProfileData;
  message?: string;
}

export const profileService = {
   getMe: async (): Promise<UserProfileData> => {
     const response = await axiosInstance.get<ProfileApiResponse>(
       "profile/me/"
     );
     // بک‌اند ممکن است data را در wrapper بفرستد
     const payload = response.data;
     if (payload && typeof payload === "object" && "data" in payload) {
       return (payload as ProfileApiResponse).data;
     }
     return payload as unknown as UserProfileData;
   },

   updateMe: async (data: Partial<UserProfileData>): Promise<UserProfileData> => {
     const response = await axiosInstance.put<ProfileApiResponse>(
       "profile/me/",
       data
     );
    const payload = response.data;
    if (payload && typeof payload === "object" && "data" in payload) {
      return (payload as ProfileApiResponse).data;
    }
    return payload as unknown as UserProfileData;
  },
};
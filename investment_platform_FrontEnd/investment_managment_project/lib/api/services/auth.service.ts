import axiosInstance from "@/lib/api/orval/axios-instance";

// ─── Types ────────────────────────────────────────────────────────────────────

export type RoleEnum = "INVESTOR" | "ENTREPRENEUR" | "PROJECT_OWNER" | "ADMIN";

export type PurposeEnum =
  | "LOGIN"
  | "VERIFY_PHONE"
  | "RESET_PASSWORD"
  | "WITHDRAWAL";

export interface RegisterRequest {
  phone_number: string;
  role: RoleEnum;
}

export interface OTPRequestPayload {
  phone_number: string;
  purpose: PurposeEnum;
}

export interface OTPVerifyPayload {
  phone_number: string;
  code: string;
  purpose: PurposeEnum;
}

export interface LoginRequest {
  phone_number: string;
  password: string;
}

export interface LoginResponse {
  access: string;
  refresh: string;
}

export interface RefreshRequest {
  refresh: string;
}

export interface RefreshResponse {
  access: string;
  refresh: string;
}

export interface ForgotPasswordRequest {
  phone_number: string;
}

export interface ResetPasswordRequest {
  phone_number: string;
  code: string;
  new_password: string;
  new_password_confirm: string;
}

export interface CompleteIndividualProfileRequest {
  phone_number: string;
  first_name: string;
  last_name: string;
  national_id: string;
  date_of_birth: string;
  password: string;
  password_confirm: string;
  contact_number?: string;
  email?: string;
}

export interface CompleteLegalEntityProfileRequest {
  phone_number: string;
  entity_type: "COMPANY" | "ORGANIZATION";
  company_name_persian: string;
  company_name_latin: string;
  ceo_name: string;
  surname: string;
  password: string;
  password_confirm: string;
  country: string;
  province: string;
  postal_code: string;
  contact_number?: string;
  email?: string;
}

// ── UserProfile کامل‌شده با فیلدهای جدید بک‌اند ──────────────────────────────
export interface UserProfile {
  id: string;
  user: {
    id: string;
    username: string;
    phone_number: string;
  };
  // فیلدهای جدید که بک‌اند برمی‌گرداند
  role: string;
  full_name: string;
  email: string;
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

// ─── API Wrapper Type ─────────────────────────────────────────────────────────
interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

// ─── Helper: unwrap بک‌اند response ──────────────────────────────────────────
function unwrap<T>(response: { data: ApiResponse<T> | T }): T {
  const payload = response.data;
  if (
    payload &&
    typeof payload === "object" &&
    "data" in payload &&
    "success" in payload
  ) {
    return (payload as ApiResponse<T>).data;
  }
  return payload as T;
}

// ─── API Calls ────────────────────────────────────────────────────────────────

export const authService = {
  register: async (data: RegisterRequest): Promise<void> => {
    await axiosInstance.post("auth/register/", data);
  },

  requestOtp: async (data: OTPRequestPayload): Promise<void> => {
    await axiosInstance.post("auth/otp/request/", data);
  },

  verifyOtp: async (
    data: OTPVerifyPayload
  ): Promise<{ access: string; refresh: string } | void> => {
    const response = await axiosInstance.post("auth/otp/verify/", data);
    return unwrap<{ access: string; refresh: string }>(response);
  },

  login: async (data: LoginRequest): Promise<LoginResponse> => {
    const response = await axiosInstance.post("auth/login/", data);
    return unwrap<LoginResponse>(response);
  },

  refreshToken: async (data: RefreshRequest): Promise<RefreshResponse> => {
    const response = await axiosInstance.post("auth/refresh/", data);
    return unwrap<RefreshResponse>(response);
  },

  forgotPassword: async (data: ForgotPasswordRequest): Promise<void> => {
    await axiosInstance.post("auth/password/forgot/", data);
  },

  resetPassword: async (data: ResetPasswordRequest): Promise<void> => {
    await axiosInstance.post("auth/password/reset/", data);
  },

  completeIndividualProfile: async (
    data: CompleteIndividualProfileRequest
  ): Promise<void> => {
    await axiosInstance.post("profile/complete/individual/", data);
  },

  completeLegalEntityProfile: async (
    data: CompleteLegalEntityProfileRequest
  ): Promise<void> => {
    await axiosInstance.post("profile/complete/legal-entity/", data);
  },

  getProfile: async (): Promise<UserProfile> => {
    const response = await axiosInstance.get("profile/me/");
    return unwrap<UserProfile>(response);
  },

  updateProfile: async (data: Partial<UserProfile>): Promise<UserProfile> => {
    const response = await axiosInstance.put("profile/me/", data);
    return unwrap<UserProfile>(response);
  },
};
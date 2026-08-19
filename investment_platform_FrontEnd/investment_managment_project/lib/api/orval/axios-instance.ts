import axios, { AxiosInstance } from "axios";

// baseURL شامل /api/v1/ می‌شود تا service ها مسیر کوتاه بنویسند
const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";
const API_BASE = `${BASE_URL}/api/v1`;

const axiosInstance: AxiosInstance = axios.create({
  baseURL: API_BASE,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 15000,
});

// ── Request interceptor ───────────────────────────────────────────────────────
axiosInstance.interceptors.request.use(
  (config) => {
    if (typeof window !== "undefined") {
      try {
        const raw = localStorage.getItem("auth-storage");
        if (raw) {
          const parsed = JSON.parse(raw);
          const token = parsed?.state?.accessToken;
          if (token) {
            config.headers.Authorization = `Bearer ${token}`;
          }
        }
      } catch {
        // نادیده بگیر
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ── Response interceptor ──────────────────────────────────────────────────────
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      const authEndpoints = [
        "/auth/login/",
        "/auth/register/",
        "/auth/otp/",
        "/auth/password/",
        "/auth/refresh/",
      ];

      const isAuthEndpoint = authEndpoints.some((ep) =>
        originalRequest.url?.includes(ep)
      );

      if (isAuthEndpoint) {
        return Promise.reject(error);
      }

      try {
        const raw = localStorage.getItem("auth-storage");
        if (!raw) {
          window.location.href = "/login";
          return Promise.reject(error);
        }

        const parsed = JSON.parse(raw);
        const refreshToken = parsed?.state?.refreshToken;

        if (!refreshToken) {
          window.location.href = "/login";
          return Promise.reject(error);
        }

        // refresh با آدرس کامل
        const { data } = await axios.post(
          `${BASE_URL}/api/v1/auth/refresh/`,
          { refresh: refreshToken }
        );

        const updatedState = {
          ...parsed,
          state: {
            ...parsed.state,
            accessToken: data.access,
            ...(data.refresh ? { refreshToken: data.refresh } : {}),
          },
        };
        localStorage.setItem("auth-storage", JSON.stringify(updatedState));

        originalRequest.headers.Authorization = `Bearer ${data.access}`;
        return axiosInstance(originalRequest);
      } catch {
        localStorage.removeItem("auth-storage");
        window.location.href = "/login";
        return Promise.reject(error);
      }
    }

    return Promise.reject(error);
  }
);

// هم default هم named export تا سازگاری کامل باشد
export { axiosInstance };
export default axiosInstance;
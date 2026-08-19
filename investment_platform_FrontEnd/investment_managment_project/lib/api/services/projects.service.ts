import axiosInstance from "@/lib/api/orval/axios-instance";

// ── Types (دقیقاً منطبق با بک‌اند) ────────────────────────────────────────────

export type BackendProjectStatus =
  | "DRAFT" | "PENDING_REVIEW" | "NEEDS_REVISION" | "APPROVED"
  | "REJECTED" | "FUNDING" | "FUNDING_COMPLETED" | "FUNDING_FAILED"
  | "ACTIVE" | "PROFIT_CALCULATION" | "PROFIT_DISTRIBUTED"
  | "COMPLETED" | "ARCHIVED" | "CANCELED";

export type BackendCategoryEnum =
  | "TECHNOLOGY" | "AGRICULTURE" | "HEALTH"
  | "INDUSTRY" | "SERVICES" | "OTHER";

export interface ProjectOwner {
  id: string;
  username: string;
  phone_number: string;
}

export interface ProjectDocument {
  id: string;
  uploader: ProjectOwner | null;
  title: string;
  doc_type: "LEGAL" | "FINANCIAL" | "TECHNICAL" | "OTHER";
  doc_type_display: string;
  file_url: string | null;
  file_size_display: string;
  file_extension: string;
  created_at: string;
}

// داده کامل پروژه از بک‌اند
export interface BackendProject {
  id: string;
  owner: ProjectOwner;
  title: string;
  description: string;
  category: BackendCategoryEnum | null;
  category_display: string;
  cover_image_url: string | null;       // ← جدید
  required_budget: string;
  raised_amount: string;
  min_investment_amount: string;
  max_investment_amount: string | null; // ← جدید
  profit_rate_percentage: string | null;
  start_date: string;
  end_date: string;
  remaining_days: number;               // ← جدید
  status: BackendProjectStatus;
  status_display: string;
  funding_percentage: string;
  is_funding_complete: boolean;
  investors_count: number;              // ← جدید
  documents: ProjectDocument[];         // ← جدید (فقط در detail)
  created_at: string;
  updated_at: string;
}

export interface PaginatedProjects {
  count: number;
  next: string | null;
  previous: string | null;
  total_pages: number;
  current_page: number;
  results: BackendProject[];
}

export interface ProjectListParams {
  page?: number;
  page_size?: number;
  q?: string;
  status?: BackendProjectStatus;
  category?: BackendCategoryEnum;
  min_profit_rate?: number;
  ordering?: string;
}

// ── Helper ────────────────────────────────────────────────────────────────────
interface ApiResponse<T> { success: boolean; data: T; }

function unwrap<T>(response: { data: ApiResponse<T> | T }): T {
  const p = response.data;
  if (p && typeof p === "object" && "data" in p && "success" in p) {
    return (p as ApiResponse<T>).data;
  }
  return p as T;
}

// ── Service ───────────────────────────────────────────────────────────────────
export const projectsService = {
  getProjects: async (params?: ProjectListParams): Promise<PaginatedProjects> => {
    const res = await axiosInstance.get("/projects/", { params });
    return unwrap<PaginatedProjects>(res);
  },

  getProjectById: async (id: string): Promise<BackendProject> => {
    const res = await axiosInstance.get(`/projects/${id}/`);
    return unwrap<BackendProject>(res);
  },

  createProject: async (data: FormData): Promise<BackendProject> => {
    const res = await axiosInstance.post("/projects/", data, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return unwrap<BackendProject>(res);
  },

  updateProject: async (id: string, data: FormData | object): Promise<BackendProject> => {
    const isFormData = data instanceof FormData;
    const res = await axiosInstance.patch(`/projects/${id}/`, data, {
      headers: isFormData ? { "Content-Type": "multipart/form-data" } : {},
    });
    return unwrap<BackendProject>(res);
  },

  deleteProject: async (id: string): Promise<void> => {
    await axiosInstance.delete(`/projects/${id}/`);
  },

  changeStatus: async (
    id: string,
    to_status: BackendProjectStatus,
    reason?: string,
  ): Promise<BackendProject> => {
    const res = await axiosInstance.post(`/projects/${id}/change_status/`, {
      to_status, reason,
    });
    return unwrap<BackendProject>(res);
  },

  uploadDocument: async (
    id: string,
    data: { title: string; doc_type: string; file: File },
  ): Promise<ProjectDocument> => {
    const formData = new FormData();
    formData.append("title", data.title);
    formData.append("doc_type", data.doc_type);
    formData.append("file", data.file);
    const res = await axiosInstance.post(`/projects/${id}/documents/`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return unwrap<ProjectDocument>(res);
  },
};
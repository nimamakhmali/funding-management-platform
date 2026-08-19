import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  projectsService,
  ProjectListParams,
  BackendProject,
  PaginatedProjects,
  BackendProjectStatus,
} from "@/lib/api/services/projects.service";

export const PROJECT_KEYS = {
  all: ["projects"] as const,
  list: (params?: ProjectListParams) => ["projects", "list", params] as const,
  detail: (id: string) => ["projects", "detail", id] as const,
};

// ── لیست پروژه‌ها ─────────────────────────────────────────────────────────────
export function useProjects(params?: ProjectListParams) {
  return useQuery<PaginatedProjects>({
    queryKey: PROJECT_KEYS.list(params),
    queryFn: () => projectsService.getProjects(params),
    staleTime: 2 * 60 * 1000,
    placeholderData: (prev) => prev,
  });
}

// ── جزئیات پروژه ──────────────────────────────────────────────────────────────
export function useProjectDetail(id: string) {
  return useQuery<BackendProject>({
    queryKey: PROJECT_KEYS.detail(id),
    queryFn: () => projectsService.getProjectById(id),
    enabled: !!id,
    staleTime: 2 * 60 * 1000,
  });
}

// ── تغییر وضعیت (ادمین) ───────────────────────────────────────────────────────
export function useChangeProjectStatus(projectId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      to_status, reason,
    }: { to_status: BackendProjectStatus; reason?: string }) =>
      projectsService.changeStatus(projectId, to_status, reason),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: PROJECT_KEYS.detail(projectId) });
      qc.invalidateQueries({ queryKey: PROJECT_KEYS.all });
    },
  });
}
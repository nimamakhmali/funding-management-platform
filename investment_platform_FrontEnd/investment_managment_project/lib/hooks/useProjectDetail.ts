import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ownerDashboardService } from "@/lib/api/services/owner-dashboard.service";
import { projectsService } from "@/lib/api/services/projects.service";

export const PROJECT_DETAIL_KEY = (id: string) =>
  ["project", "detail", id] as const;

export function useProjectDetail(id: string | null) {
  return useQuery({
    queryKey: PROJECT_DETAIL_KEY(id ?? ""),
    queryFn: () => ownerDashboardService.getProjectDetail(id!),
    enabled: !!id,
    staleTime: 2 * 60 * 1000,
  });
}

export function useDeleteProject() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => projectsService.deleteProject(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["owner", "my-projects"] });
      queryClient.invalidateQueries({ queryKey: ["owner", "dashboard"] });
    },
  });
}
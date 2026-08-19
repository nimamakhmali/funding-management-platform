"use client";

import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

import {
  CreateProjectFormValues,
  createProjectResolver,
} from "@/lib/validation/create-project.validation";
import { projectsService } from "@/lib/api/services/projects.service";
import { OWNER_DASHBOARD_KEY } from "@/lib/hooks/useOwnerDashboard";

import ProjectInformationSection from "./ProjectInformationSection";
import ProjectFinanceSection from "./ProjectFinanceSection";
import ProjectScheduleSection from "./ProjectScheduleSection";
import ProjectDocumentsSection from "./ProjectDocumentsSection";

// ── mapping دسته‌بندی فرانت → بک‌اند ─────────────────────────────────────────
const CATEGORY_MAP: Record<string, string> = {
  real_estate: "OTHER",
  technology: "TECHNOLOGY",
  industry: "INDUSTRY",
  agriculture: "AGRICULTURE",
};

// ── تبدیل فرم به FormData برای ارسال به بک‌اند ───────────────────────────────
function buildFormData(data: CreateProjectFormValues): FormData {
  const fd = new FormData();

  // فیلدهای متنی - mapping نام فیلد فرانت → بک‌اند
  fd.append("title", data.projectName);
  fd.append("description", data.fullDesc);
  fd.append("category", CATEGORY_MAP[data.category] ?? "OTHER");
  fd.append("required_budget", String(data.targetAmount));
  fd.append("min_investment_amount", String(data.minInvest));
  fd.append("start_date", data.startDate);
  fd.append("end_date", data.endDate);

  // فایل cover_image (اگر وجود داشت)
  if (data.documents && data.documents.length > 0) {
    fd.append("cover_image", data.documents[0]);
  }

  return fd;
}

export default function CreateNewProjectForm() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const {
    control,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<CreateProjectFormValues>({
    resolver: createProjectResolver,
    defaultValues: {
      projectName: "",
      category: "",
      shortDesc: "",
      fullDesc: "",
      targetAmount: 0,
      minInvest: 0,
      startDate: "",
      endDate: "",
      duration: 0,
      documents: [],
    },
  });

  // ── mutation ایجاد پروژه ──────────────────────────────────────────────────
  const createMutation = useMutation({
    mutationFn: (formData: FormData) =>
      projectsService.createProject(formData),
    onSuccess: (createdProject) => {
      // بازنشانی کش داشبورد و لیست پروژه‌ها
      queryClient.invalidateQueries({ queryKey: OWNER_DASHBOARD_KEY });
      queryClient.invalidateQueries({
        queryKey: ["owner", "my-projects"],
      });
      // redirect به صفحه جزئیات پروژه
      router.push(`/project-details?id=${createdProject.id}`);
    },
  });

  // ── submit نهایی ──────────────────────────────────────────────────────────
  const onSubmit = (data: CreateProjectFormValues) => {
    createMutation.mutate(buildFormData(data));
  };

  // ── ذخیره پیش‌نویس ───────────────────────────────────────────────────────
  const onSaveDraft = handleSubmit((data) => {
    // بک‌اند به صورت پیش‌فرض وضعیت DRAFT ایجاد می‌کند
    createMutation.mutate(buildFormData(data));
  });

  const isPending = createMutation.isPending || isSubmitting;

  return (
    <div className="flex flex-1 flex-col p-6 lg:p-10 max-w-5xl mx-auto w-full">
      <div className="overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm dark:border-[#2d283e] dark:bg-[#1e1a2e]">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="divide-y divide-gray-100 dark:divide-[#2d283e]"
        >
          <ProjectInformationSection control={control} />
          <ProjectFinanceSection control={control} />
          <ProjectScheduleSection control={control} />
          <ProjectDocumentsSection control={control} />

          {/* خطای کلی */}
          {createMutation.isError && (
            <div className="px-8 py-3 text-sm text-red-500 bg-red-50 dark:bg-red-900/20">
              خطا در ثبت پروژه. لطفاً دوباره تلاش کنید.
            </div>
          )}

          {/* دکمه‌ها */}
          <div className="flex justify-end gap-4 bg-gray-50 p-6 lg:p-8 dark:bg-white/5">
            <button
              type="button"
              onClick={onSaveDraft}
              disabled={isPending}
              className="h-11 rounded-lg border border-gray-200 px-6 text-text-main disabled:opacity-50 dark:border-[#3d384e]"
            >
              ذخیره پیش‌نویس
            </button>

            <button
              type="submit"
              disabled={isPending}
              className="h-11 rounded-lg bg-primary px-8 text-white shadow-lg shadow-primary/30 disabled:opacity-50"
            >
              {isPending ? "در حال ثبت..." : "ثبت پروژه"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
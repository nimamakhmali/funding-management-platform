import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const toNumber = (val: unknown) => {
  if (typeof val === "number") return val;
  if (typeof val === "string") {
    const cleaned = val.replace(/,/g, "").trim();
    const num = Number(cleaned);
    return isNaN(num) ? val : num;
  }
  return val;
};

export const createProject = z.object({
  projectName: z
    .string()
    .min(1, "نام پروژه الزامی است")
    .min(3, "نام پروژه باید حداقل ۳ کاراکتر باشد")
    .max(100, "نام پروژه نمی‌تواند بیشتر از ۱۰۰ کاراکتر باشد"),

  category: z.string().min(1, "دسته بندی پروژه الزامی است"),

  shortDesc: z
    .string()
    .min(1, "توضیح کوتاه الزامی است")
    .min(10, "توضیح کوتاه باید حداقل ۱۰ کاراکتر باشد")
    .max(250, "حداکثر ۲۵۰ کاراکتر مجاز است"),

  fullDesc: z
    .string()
    .min(1, "توضیحات کامل الزامی است")
    .min(30, "توضیحات کامل باید حداقل ۳۰ کاراکتر باشد"),

  targetAmount: z.preprocess(
    toNumber,
    z
      .number({ invalid_type_error: "مبلغ باید عدد باشد" })
      .min(1, "مبلغ مورد نیاز الزامی است"),
  ),

  minInvest: z.preprocess(
    toNumber,
    z
      .number({ invalid_type_error: "حداقل سرمایه‌گذاری باید عدد باشد" })
      .min(1, "حداقل سرمایه‌گذاری الزامی است"),
  ),

  startDate: z.string().min(1, "تاریخ شروع الزامی است"),

  endDate: z.string().min(1, "تاریخ پایان الزامی است"),

  duration: z.preprocess(
    toNumber,
    z
      .number({ invalid_type_error: "مدت باید عدد باشد" })
      .min(1, "حداقل یک ماه")
      .max(60, "حداکثر ۶۰ ماه"),
  ),

  // ── فیلد جدید: تصویر cover (اختیاری) ─────────────────────────────────────
  coverImage: z
    .instanceof(File)
    .optional()
    .nullable()
    .refine(
      (f) => !f || f.size <= 5 * 1024 * 1024,
      "حجم تصویر نباید بیشتر از ۵ مگابایت باشد",
    )
    .refine(
      (f) => !f || ["image/jpeg", "image/png", "image/webp"].includes(f.type),
      "فقط فرمت JPG، PNG و WEBP مجاز است",
    ),

  // ── اسناد (اختیاری — بک‌اند جداگانه آپلود می‌کند) ───────────────────────
  documents: z
    .array(z.instanceof(File))
    .max(5, "حداکثر ۵ فایل مجاز است")
    .optional()
    .default([]),
});

export type CreateProjectFormValues = z.infer<typeof createProject>;
export const createProjectResolver = zodResolver(createProject);
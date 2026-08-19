import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

export const createProject = z.object({
  projectName: z
    .string()
    .min(1, "نام پروژه الزامی است")
    .min(3, "نام پروژه باید حداقل ۳ کاراکتر باشد")
    .max(100, "نام پروژه نمی‌تواند بیشتر از ۱۰۰ کاراکتر باشد"),

  category: z
    .string()
    .min(1, "دسته بندی پروژه الزامی است"),

  shortDesc: z
    .string()
    .min(1, "توضیح کوتاه الزامی است")
    .min(10, "توضیح کوتاه باید حداقل ۱۰ کاراکتر باشد")
    .max(250, "حداکثر ۲۵۰ کاراکتر مجاز است"),

  fullDesc: z
    .string()
    .min(1, "توضیحات کامل الزامی است")
    .min(30, "توضیحات کامل باید حداقل ۳۰ کاراکتر باشد"),

  targetAmount: z
    .number({
      required_error: "مبلغ مورد نیاز الزامی است",
    })
    .min(1000000, "حداقل مبلغ یک میلیون تومان است"),

  minInvest: z
    .number({
      required_error: "حداقل سرمایه گذاری الزامی است",
    })
    .min(10000, "حداقل سرمایه گذاری باید بیشتر از ۱۰ هزار تومان باشد"),

  startDate: z
    .string()
    .min(1, "تاریخ شروع الزامی است"),

  endDate: z
    .string()
    .min(1, "تاریخ پایان الزامی است"),

  duration: z
    .number({
      required_error: "مدت تامین مالی الزامی است",
    })
    .min(1, "حداقل یک ماه")
    .max(60, "حداکثر ۶۰ ماه"),

  documents: z
  .array(z.instanceof(File))
  .min(1, "حداقل یک فایل باید بارگذاری شود")
  .max(5, "حداکثر ۵ فایل مجاز است"),
});

export type CreateProjectFormValues =
  z.infer<typeof createProject>;

export const createProjectResolver =
  zodResolver(createProject);
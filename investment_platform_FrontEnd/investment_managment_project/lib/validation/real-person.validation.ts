import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const passwordSchema = z.string().superRefine((value, ctx) => {
  if (!value) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "رمز عبور الزامی است",
    });
    return;
  }

  if (value.length < 8) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "رمز عبور باید حداقل ۸ کاراکتر باشد",
    });
  }

  if (value.length > 64) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "رمز عبور نباید بیشتر از ۶۴ کاراکتر باشد",
    });
  }

  if (!/[A-Z]/.test(value)) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "رمز عبور باید حداقل یک حرف بزرگ انگلیسی داشته باشد",
    });
  }

  if (!/[a-z]/.test(value)) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "رمز عبور باید حداقل یک حرف کوچک انگلیسی داشته باشد",
    });
  }

  if (!/\d/.test(value)) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "رمز عبور باید حداقل یک عدد داشته باشد",
    });
  }

  if (!/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(value)) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "رمز عبور باید حداقل یک کاراکتر ویژه داشته باشد",
    });
  }
});

export const realPersonSchema = z
  .object({
    firstName: z
      .string()
      .min(1, "نام الزامی است")
      .min(2, "نام باید حداقل ۲ کاراکتر باشد")
      .max(50, "نام نمی‌تواند بیشتر از ۵۰ کاراکتر باشد")
      .regex(
        /^[\u0600-\u06FF\s]+$/,
        "نام فقط می‌تواند شامل حروف فارسی باشد"
      ),

    lastName: z
      .string()
      .min(1, "نام خانوادگی الزامی است")
      .min(2, "نام خانوادگی باید حداقل ۲ کاراکتر باشد")
      .max(50, "نام خانوادگی نمی‌تواند بیشتر از ۵۰ کاراکتر باشد")
      .regex(
        /^[\u0600-\u06FF\s]+$/,
        "نام خانوادگی فقط می‌تواند شامل حروف فارسی باشد"
      ),

    nationalityCode: z
      .string()
      .min(1, "کد ملی الزامی است")
      .length(10, "کد ملی باید ۱۰ رقمی باشد")
      .regex(/^\d{10}$/, "کد ملی باید شامل ۱۰ رقم باشد"),

    dateOfBirth: z
      .string()
      .min(1, "تاریخ تولد الزامی است"),

    email: z
      .string()
      .min(1, "ایمیل الزامی است")
      .email("فرمت ایمیل معتبر نیست"),

    password: passwordSchema,

    confirmPassword: z
      .string()
      .min(1, "تکرار رمز عبور الزامی است"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "رمز عبور و تکرار آن یکسان نیست",
  });

export type RealPersonFormValues = z.infer<typeof realPersonSchema>;

export const realPersonResolver = zodResolver(realPersonSchema);
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
      message: "رمز عبور نمی‌تواند بیشتر از ۶۴ کاراکتر باشد",
    });
  }

  if (!/[A-Z]/.test(value)) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "حداقل یک حرف بزرگ انگلیسی (A-Z) وارد کنید",
    });
  }

  if (!/[a-z]/.test(value)) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "حداقل یک حرف کوچک انگلیسی (a-z) وارد کنید",
    });
  }

  if (!/[0-9]/.test(value)) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "حداقل یک عدد (0-9) وارد کنید",
    });
  }

  if (!/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(value)) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "حداقل یک کاراکتر ویژه مانند !@#$%^&* وارد کنید",
    });
  }
});

export const completeInformationSchema = z
  .object({
    legal_entity_subtype: z.enum([
      "non-governmental",
      "governmental",
      "educational",
    ]),

    companyNameFn: z
      .string()
      .min(1, "نام شرکت الزامی است")
      .min(2, "نام شرکت باید حداقل ۲ کاراکتر باشد")
      .max(100, "نام شرکت نمی‌تواند بیشتر از ۱۰۰ کاراکتر باشد")
      .regex(
        /^[\u0600-\u06FF\s\-.]+$/,
        "نام شرکت فقط می‌تواند شامل حروف فارسی باشد"
      ),

    companyNameEn: z
      .string()
      .min(1, "نام شرکت لاتین الزامی است")
      .min(2, "نام شرکت لاتین باید حداقل ۲ کاراکتر باشد")
      .max(100, "نام شرکت لاتین نمی‌تواند بیشتر از ۱۰۰ کاراکتر باشد")
      .regex(
        /^[a-zA-Z\s\-.]+$/,
        "نام شرکت لاتین فقط می‌تواند شامل حروف انگلیسی باشد"
      ),

    CeoNameFn: z
      .string()
      .min(1, "نام مدیرعامل الزامی است")
      .min(2, "نام مدیرعامل باید حداقل ۲ کاراکتر باشد")
      .max(50, "نام مدیرعامل نمی‌تواند بیشتر از ۵۰ کاراکتر باشد")
      .regex(
        /^[\u0600-\u06FF\s]+$/,
        "نام مدیرعامل فقط می‌تواند شامل حروف فارسی باشد"
      ),

    managerNameFa: z
      .string()
      .min(1, "نام خانوادگی مدیر الزامی است")
      .min(2, "نام خانوادگی مدیر باید حداقل ۲ کاراکتر باشد")
      .max(50, "نام خانوادگی مدیر نمی‌تواند بیشتر از ۵۰ کاراکتر باشد")
      .regex(
        /^[\u0600-\u06FF\s]+$/,
        "نام خانوادگی مدیر فقط می‌تواند شامل حروف فارسی باشد"
      ),

    country: z.string().min(1, "انتخاب کشور الزامی است"),

    province: z.string().min(1, "استان الزامی است"),

    city: z.string().min(1, "شهر الزامی است"),

    postalCode: z
      .string()
      .length(10, "کد پستی باید ۱۰ رقمی باشد")
      .regex(/^\d{10}$/, "کد پستی معتبر نیست"),

    phone: z.string().min(1, "شماره تلفن الزامی است"),

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

export type CompleteInformationFormValues = z.infer<
  typeof completeInformationSchema
>;

export const completeInformationResolver =
  zodResolver(completeInformationSchema);
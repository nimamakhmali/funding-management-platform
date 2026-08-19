import { z } from "zod";

const mobileRegex = /^09\d{9}$/;

export const signupSchema = z.object({
  mobile: z
    .string()
    .min(1, "شماره موبایل الزامی است")
    .regex(
      mobileRegex,
      "شماره موبایل باید 11 رقم و با 09 شروع شود"
    ),

  role: z.enum(["investor", "executor"], {
    message: "نقش کاربری را انتخاب کنید",
  }),

  terms: z.literal(true, {
    errorMap: () => ({
      message: "پذیرش قوانین الزامی است",
    }),
  }),
});

export const signupOtpSchema = z.object({
  otp: z
    .string()
    .min(6, "کد تایید باید ۶ رقم باشد")
    .max(6, "کد تایید باید ۶ رقم باشد"),
});

export type SignupFormData = z.infer<
  typeof signupSchema
>;

export type SignupOtpFormData = z.infer<
  typeof signupOtpSchema
>;


export const loginSchema = z.object({
  username: z.string().min(1, "نام کاربری الزامی است"),
  password: z.string().min(1, "رمز عبور الزامی است"),
  rememberMe: z.boolean().optional(),
});


export const forgotPasswordSchema = z.object({
  mobile: z
    .string()
    .min(1, "شماره موبایل الزامی است")
    .regex(/^09\d{9}$/, "شماره موبایل معتبر نیست"),
});


export const resetPasswordSchema = z
  .object({
    password: z
      .string()
      .min(8, "رمز عبور باید حداقل ۸ کاراکتر باشد"),

    confirmPassword: z
      .string()
      .min(8, "تکرار رمز عبور الزامی است"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "رمز عبور و تکرار آن یکسان نیست",
    path: ["confirmPassword"],
  });
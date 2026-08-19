import { z } from "zod";

export const settingsSchema = z.object({
  firstName: z.string().min(1, "نام الزامی است"),
  lastName: z.string().min(1, "نام خانوادگی الزامی است"),
  company: z.string().optional(),
  email: z.string().email(),
  mobile: z.string(),

  language: z.enum(["fa", "en"]),

  theme: z.enum(["light", "dark"]),

  twoFactor: z.boolean(),
});

export type SettingsFormValues = z.infer<typeof settingsSchema>;
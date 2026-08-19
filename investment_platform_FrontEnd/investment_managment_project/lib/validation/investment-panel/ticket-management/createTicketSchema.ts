import { z } from "zod";

export const createTicketSchema = z.object({
  title: z
    .string()
    .min(1, "وارد کردن عنوان تیکت الزامی است")
    .max(120, "عنوان تیکت نمی‌تواند بیش از ۱۲۰ کاراکتر باشد"),
  message: z
    .string()
    .min(1, "وارد کردن متن پیام الزامی است")
    .min(10, "متن پیام باید حداقل ۱۰ کاراکتر باشد"),
  attachment: z.array(z.any()).optional(),
  priority: z.enum(["low", "medium", "high"]).optional(),
});

export type CreateTicketValues = z.infer<typeof createTicketSchema>;

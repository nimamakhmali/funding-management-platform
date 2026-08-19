import { z } from "zod";

export const replySchema = z.object({
  message: z
    .string()
    .min(1, "وارد کردن متن پیام الزامی است")
    .min(2, "متن پیام بسیار کوتاه است"),
});

export type ReplyValues = z.infer<typeof replySchema>;

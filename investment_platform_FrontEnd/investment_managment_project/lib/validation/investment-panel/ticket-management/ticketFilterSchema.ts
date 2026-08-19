import { z } from "zod";

export const ticketFilterSchema = z.object({
  search: z.string().optional(),
  status: z.enum(["all", "open", "in_progress", "closed"]).default("all"),
  timeRange: z
    .enum(["all", "today", "last_week", "last_month"])
    .default("all"),
});

export type TicketFilterValues = z.infer<typeof ticketFilterSchema>;

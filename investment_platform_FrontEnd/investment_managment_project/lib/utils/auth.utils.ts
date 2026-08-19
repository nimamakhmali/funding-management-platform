/**
 * تبدیل شماره موبایل ایرانی به فرمت +98 مورد نیاز بک‌اند
 * ورودی: 09123456789 یا 9123456789 یا +989123456789
 * خروجی: +989123456789
 */
export function normalizePhoneNumber(phone: string): string {
  const cleaned = phone.trim().replace(/\s|-/g, "");

  if (cleaned.startsWith("+98")) {
    return cleaned;
  }
  if (cleaned.startsWith("0098")) {
    return "+" + cleaned.slice(2);
  }
  if (cleaned.startsWith("09")) {
    return "+98" + cleaned.slice(1);
  }
  if (cleaned.startsWith("9") && cleaned.length === 10) {
    return "+98" + cleaned;
  }
  return cleaned;
}

/**
 * نقش فرانت را به نقش بک‌اند تبدیل می‌کند
 */
export function mapRoleToApi(
  role: "investor" | "executor"
): "INVESTOR" | "PROJECT_OWNER" {
  const map: Record<string, "INVESTOR" | "PROJECT_OWNER"> = {
    investor: "INVESTOR",
    executor: "PROJECT_OWNER",
  };
  return map[role] ?? "INVESTOR";
}

/**
 * نقش بک‌اند را به مسیر داشبورد مناسب تبدیل می‌کند
 */
export function getRoleDashboardPath(role: string): string {
  const paths: Record<string, string> = {
    INVESTOR: "/invest-dashboard",
    PROJECT_OWNER: "/project-owner-dashboard",
    ENTREPRENEUR: "/project-owner-dashboard",
    ADMIN: "/admin-dashboard",
  };
  return paths[role] ?? "/invest-dashboard";
}

/**
 * decode ساده JWT بدون کتابخانه خارجی
 */
export function decodeJwtPayload(token: string): Record<string, unknown> | null {
  try {
    const base64 = token.split(".")[1];
    const json = atob(base64.replace(/-/g, "+").replace(/_/g, "/"));
    return JSON.parse(json);
  } catch {
    return null;
  }
}

/**
 * استخراج پیام خطا از پاسخ بک‌اند
 * بک‌اند از قالب {"success": false, "error": "..."} استفاده می‌کند
 * که error می‌تواند رشته یا شیء (خطای اعتبارسنجی فیلدها) باشد
 */
export function extractErrorMessage(data: unknown): string {
  if (typeof data !== "object" || data === null) return "";

  const obj = data as Record<string, unknown>;

  if (typeof obj.error === "string") return obj.error;

  if (typeof obj.error === "object" && obj.error !== null) {
    const errors = Object.values(obj.error);
    if (errors.length > 0) {
      const first = errors[0];
      if (typeof first === "string") return first;
      if (Array.isArray(first) && first.length > 0) return String(first[0]);
    }
  }

  if (typeof obj.errors === "object" && obj.errors !== null) {
    const vals = Object.values(obj.errors);
    if (vals.length > 0) {
      const first = vals[0];
      if (typeof first === "string") return first;
      if (Array.isArray(first) && first.length > 0) return String(first[0]);
    }
  }

  if (typeof obj.message === "string") return obj.message;

  if (typeof obj.detail === "string") return obj.detail;

  return "";
}
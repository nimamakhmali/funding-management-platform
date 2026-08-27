const BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

/**
 * URL تصویر را به URL کامل تبدیل می‌کند.
 * اگر URL نسبی باشد، base را اضافه می‌کند.
 * اگر null/undefined باشد، fallback برمی‌گرداند.
 */
export function resolveImageUrl(
  url: string | null | undefined,
  fallback = "/images/img-1.png"
): string {
  if (!url) return fallback;
  if (url.startsWith("http://") || url.startsWith("https://")) return url;
  // URL نسبی — base اضافه کن
  return `${BASE_URL}${url.startsWith("/") ? "" : "/"}${url}`;
}
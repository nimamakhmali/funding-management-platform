
import type { Metadata } from "next";
import localFont from "next/font/local";
import { QueryProvider } from "@/lib/providers/QueryProvider";
import "./globals.css";
import { Toaster } from "sonner";



const vazirFont = localFont({
  src: [
    {
      path: "./fonts/Vazirmatn-Thin.woff2",
      weight: "100",
      style: "normal",
    },
    {
      path: "./fonts/Vazirmatn-ExtraLight.woff2",
      weight: "200",
      style: "normal",
    },
    {
      path: "./fonts/Vazirmatn-Light.woff2",
      weight: "300",
      style: "normal",
    },
    {
      path: "./fonts/Vazirmatn-Regular.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "./fonts/Vazirmatn-Medium.woff2",
      weight: "500",
      style: "normal",
    },
    {
      path: "./fonts/Vazirmatn-SemiBold.woff2",
      weight: "600",
      style: "normal",
    },
    {
      path: "./fonts/Vazirmatn-Bold.woff2",
      weight: "700",
      style: "normal",
    },
    {
      path: "./fonts/Vazirmatn-ExtraBold.woff2",
      weight: "800",
      style: "normal",
    },
    {
      path: "./fonts/Vazirmatn-Black.woff2",
      weight: "900",
      style: "normal",
    },
  ],
  display: "swap",
  variable: "--font-vazir",
  fallback: [
    "Tahoma",
    "Segoe UI",
    "system-ui",
    "-apple-system",
    "BlinkMacSystemFont",
    "sans-serif",
  ],
  preload: true,
});

export const metadata: Metadata = {
  title: {
    template: "%s | مدیریت سرمایه گذاری",
    default: " مدیریت سرمایه گذاری",
  },
  description:
    "این پلتفرم برای مدیریت سرمایه گذاری، تحلیل بازار و بررسی دارایی‌ها طراحی شده است.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    
    <html
      lang="fa"
      dir="rtl"
      
      className={`${vazirFont.variable} ${vazirFont.className}`}
    >
      <body>
        <QueryProvider>{children}</QueryProvider>
        
        <Toaster position="top-center" richColors />
      </body>
    </html>
    
  );
}
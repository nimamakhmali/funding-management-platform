
export const notifications: NotificationCard[] = [
  {
    title: "نقص در مدارک مالی",
    description:
      "لطفاً صورت‌های مالی سال گذشته را با مهر و امضای رسمی حسابرس مجدداً بارگذاری کنید. تصویر فعلی ناخوانا است.",
    time: "۲ ساعت پیش",

    badge: {
      text: "نیاز به اصلاح",
      className:
        "text-[10px] font-bold text-primary px-2 py-0.5 rounded-full shadow-sm",
    },

    className:
      "bg-primary-50/50 border-primary-100 border-r-primary-400",
  },

  {
    title: "تأیید اولیه طرح",
    description:
      "طرح توجیهی شما توسط کمیته فنی بررسی و کلیات آن مورد تأیید قرار گرفت.",
    time: "۱ روز پیش",

    badge: {
      text: "اطلاع‌رسانی",
      className:
        "text-[10px] font-bold text-primary px-2 py-0.5 rounded-full",
    },

    className:
      "bg-white border-gray-100 border-r-primary",
  },
];
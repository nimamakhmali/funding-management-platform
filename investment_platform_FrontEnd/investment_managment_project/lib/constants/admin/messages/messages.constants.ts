import {
  Message,
  MessageFilterType,
  MessageStatus,
} from "@/lib/types/admin/messages/message.types";

export const MESSAGE_FILTER_TABS: {
  label: string;
  value: MessageFilterType;
}[] = [
  {
    label: "همه پیام ها",
    value: "all",
  },
  {
    label: "خوانده نشده",
    value: "unread",
  },
  {
    label: "آرشیو",
    value: "archived",
  },
];

export const MESSAGE_STATUS_CONFIG: Record<
  MessageStatus,
  {
    label: string;
    color: string;
  }
> = {
  unread: {
    label: "خوانده نشده",
    color: "text-primary",
  },
  read: {
    label: "خوانده شده",
    color: "text-success",
  },
  archived: {
    label: "آرشیو",
    color: "text-gray-500",
  },
};

export const MOCK_MESSAGES: Message[] = [
  {
    id: "1",
    title: "تاییدیه مدارک هویتی",
    preview:
      "مدارک ارسالی شما با موفقیت بررسی شد...",
    body:
      "با خوشحالی به اطلاع شما می‌رسانیم که مدارک هویتی و اسناد شرکت شما مورد تایید قرار گرفت.",

    status: "read",

    senderType: "admin",

    senderName: "مدیریت سامانه",

    senderEmail: "admin@platform.com",

    createdAt: "2026-07-08T14:30:00",

    updatedAt: "2026-07-08T14:30:00",

    replyCount: 0,
  },

  {
    id: "2",
    title: "مشکل در درگاه پرداخت",

    preview:
      "تیکت شماره 4920 شما بررسی شد...",

    body:
      "مشکل گزارش شده توسط تیم فنی بررسی شد و برطرف گردید.",

    status: "unread",

    senderType: "support",

    senderName: "پشتیبانی فنی",

    senderEmail: "support@platform.com",

    createdAt: "2026-07-07T09:20:00",

    updatedAt: "2026-07-07T09:20:00",

    replyCount: 2,
  },

  {
    id: "3",

    title: "بروزرسانی قوانین",

    preview:
      "قوانین پلتفرم بروزرسانی شده است...",

    body:
      "لطفاً آخرین نسخه قوانین استفاده از سامانه را مطالعه نمایید.",

    status: "archived",

    senderType: "system",

    senderName: "اطلاعیه سیستم",

    senderEmail: "system@platform.com",

    createdAt: "2026-07-01T10:00:00",

    updatedAt: "2026-07-01T10:00:00",

    replyCount: 0,
  },
];
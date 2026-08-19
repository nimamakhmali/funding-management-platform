import { TicketDetail } from "@/lib/types/investment-panel/ticket-management/TicketDetail";

export const ticketDetail: TicketDetail = {
  id: "#T-1024",
  subject: "مشکل در برداشت وجه",
  status: "in_progress",
  statusLabel: "در حال بررسی",
  priority: "high",
  createdAt: "۱۴۰۳/۰۸/۱۲ - ۱۰:۳۰",
  createdDateTime: "2024-11-02T10:30:00",
  updatedAt: "۵ دقیقه پیش",
  messages: [
    {
      id: "m1",
      sender: "user",
      authorName: "علی محمدی",
      time: "۱۰:۳۰",
      dateTime: "2024-11-02T10:30:00",
      text: "سلام، من دیروز درخواست برداشت وجه به مبلغ ۵۰ میلیون ریال دادم ولی هنوز واریز نشده. وضعیت در پنل «در انتظار» زده شده. لطفاً پیگیری کنید.",
      attachment: {
        name: "Screenshot-1403.png",
        size: "245 KB",
        type: "image",
      },
    },
    {
      id: "m2",
      sender: "agent",
      authorName: "پشتیبانی (سارا)",
      time: "۱۰:۳۵",
      dateTime: "2024-11-02T10:35:00",
      text: "سلام آقای محمدی، وقت بخیر. در حال بررسی تراکنش شما با واحد مالی هستم. لطفاً چند لحظه شکیبا باشید تا نتیجه را به اطلاع شما برسانم.",
    },
    {
      id: "m3",
      sender: "agent",
      authorName: "پشتیبانی (سارا)",
      time: "۱۰:۴۵",
      dateTime: "2024-11-02T10:45:00",
      text: "بررسی انجام شد. مشکل از سمت درگاه بانکی بوده و هم‌اکنون برطرف شده است. وجه تا ساعاتی دیگر به حساب شما واریز خواهد شد. آیا مورد دیگری هست که بتوانم کمکتان کنم؟",
    },
  ],
};

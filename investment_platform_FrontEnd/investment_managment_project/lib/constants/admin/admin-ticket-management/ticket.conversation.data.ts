import { TicketConversationData } from
 "@/lib/types/admin/admin-ticket-management/ticket.conversation.types";


export const ticketConversationMock:
TicketConversationData =
{

id:"#TK-8492",

title:
"خطا در برداشت وجه از کیف پول",

category:
"بخش مالی",

createdAt:
"۱۴۰۲/۰۷/۲۵ - ساعت ۱۰:۳۰",


messages:[

{
id:"1",

author:{
name:"رضا احمدی",
type:"customer"
},

createdAt:"۱۰:۳۰ ق.ظ",

message:
"سلام، خسته نباشید. من دیروز تلاش کردم مبلغ ۵ میلیون تومان از کیف پولم برداشت کنم اما با پیام خطا مواجه شدم. مبلغ از حساب من کسر شده اما به حساب بانکی واریز نشده است."
},


{
id:"2",

author:{
name:"علی محمدی",
type:"agent"
},

createdAt:"۱۰:۴۵ ق.ظ",

message:
"سلام آقای احمدی عزیز. از مشکلی که پیش آمده پوزش می‌طلبیم. در حال بررسی تراکنش‌های شبکه بانکی هستیم. لطفا اسکرین‌شات رسید تراکنش را ارسال کنید."
}

]

};
import { TicketData } from "@/lib/types/admin/admin-ticket-management/ticket.userInfo";

export const ticketSidebarMock:
TicketData =
{

user:{

id:"#USR-۷۷۲۱",

name:"رضا احمدی",

level:"طلایی",

openTickets:1,

avatar:""

},


statuses:[

{
label:"در انتظار پاسخ",
value:"pending"
},

{
label:"در حال بررسی",
value:"processing"
},

{
label:"بسته شده",
value:"closed"
}

],


assignees:[

{
id:1,
name:"حمید محمدی",
department:"بخش فنی"
},

{
id:2,
name:"مریم سلیمانی",
department:"مدیر مالی"
}

]

};
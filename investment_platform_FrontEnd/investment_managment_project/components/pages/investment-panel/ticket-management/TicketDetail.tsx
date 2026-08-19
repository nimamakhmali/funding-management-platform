"use client";

import { useState } from "react";

import { TicketDetail as TicketDetailType } from "@/lib/types/investment-panel/ticket-management/TicketDetail";

import TicketDetailHeader from "./TicketDetailHeader";
import TicketChat from "./TicketChat";
import TicketReplyBox from "./TicketReplyBox";

export default function TicketDetail({
  ticket,
}: {
  ticket: TicketDetailType;
}) {
  const [messages, setMessages] = useState(ticket.messages);

  const handleSend = (text: string) => {
    setMessages((prev) => [
      ...prev,
      {
        id: `m-${prev.length + 1}`,
        sender: "user",
        authorName: "علی محمدی",
        time: "اکنون",
        dateTime: new Date().toISOString(),
        text,
      },
    ]);
  };

  return (
    <div className="mx-auto flex w-full max-w-[1600px] flex-1 flex-col">
      <TicketDetailHeader ticket={ticket} />

      <div className="relative flex flex-1 flex-col overflow-hidden rounded-xl border border-border bg-surface shadow-sm">
        <TicketChat messages={messages} />
        <TicketReplyBox onSend={handleSend} />
      </div>
    </div>
  );
}

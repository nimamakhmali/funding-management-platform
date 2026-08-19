import { TicketMessage } from "@/lib/types/investment-panel/ticket-management/TicketDetail";
import TicketMessageBubble from "./TicketMessageBubble";

export default function TicketChat({ messages }: { messages: TicketMessage[] }) {
  return (
    <section
      aria-label="تاریخچه گفتگوی تیکت"
      className="chat-scroll flex-1 space-y-6 overflow-y-auto bg-surface p-4 md:p-6"
    >
      <div className="my-4 flex justify-center">
        <span className="rounded-full bg-gray-100 px-3 py-1 text-xs text-gray-500">
          امروز
        </span>
      </div>

      {messages.map((message) => (
        <TicketMessageBubble key={message.id} message={message} />
      ))}
    </section>
  );
}

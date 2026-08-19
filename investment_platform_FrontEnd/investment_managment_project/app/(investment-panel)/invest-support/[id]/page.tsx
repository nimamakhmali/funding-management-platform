// app/(investment-panel)/invest-support/[id]/page.tsx
import type { Metadata } from "next";
import TicketDetailWrapper from "@/components/pages/investment-panel/ticket-management/TicketDetailWrapper";

type Props = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  return {
    title: `جزئیات تیکت ${id} | پنل سرمایه‌گذاری`,
    description: `مشاهده و پیگیری گفتگوهای تیکت پشتیبانی ${id}`,
  };
}

export default async function Page({ params }: Props) {
  const { id } = await params;
  return <TicketDetailWrapper id={id} />;
}
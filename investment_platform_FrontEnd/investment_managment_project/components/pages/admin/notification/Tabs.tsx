"use client";

import Link from "next/link";
import { useSelectedLayoutSegment } from "next/navigation";
import { notifications } from "@/lib/constants/admin/notification/notification";
import { getTabs } from "@/lib/constants/admin/notification/notificationTabs";
import { getNotificationStats } from "./notification-stats";

export default function Tabs() {
  const segment = useSelectedLayoutSegment();

  const stats = getNotificationStats();

const tabs = getTabs(stats);



  return (
    <nav className="border-b border-slate-200">
      <ul className="flex gap-8 overflow-x-auto">

        {tabs.map((tab) => {

          const active = segment === tab.segment;

          return (
            <li key={tab.href}>
              <Link
                href={tab.href}
                className={`
                  relative
                  flex
                  items-center
                  gap-2
                  border-b-2
                  pb-4
                  text-sm
                  font-semibold
                  transition-all
                  ${
                    active
                      ? "border-primary text-primary"
                      : "border-transparent text-slate-500 hover:text-slate-900"
                  }
                `}
              >
                {tab.title}

                {tab.badge ? (
                  <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs text-primary">
                    {tab.badge}
                  </span>
                ) : null}
              </Link>
            </li>
          );

        })}
      </ul>
    </nav>
  );
}
"use client";

import Link from "next/link";
import { useSelectedLayoutSegment } from "next/navigation";

const tabs = [
  {
    title: "همه",
    href: "/notification",
    segment: null,
  },
  {
    title: "خوانده نشده",
    href: "/notification/unread",
    segment: "unread",
  },
  {
    title: "سیستمی",
    href: "/notification/system",
    segment: "system",
  },
];

export default function ContentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const segment = useSelectedLayoutSegment();

  return (
    <div className="p-6">
      <nav className="mb-6 border-b border-gray-200">
        <ul className="flex gap-6 overflow-x-auto">
          {tabs.map((tab) => {
            const active = segment === tab.segment;

            return (
              <li key={tab.href}>
                <Link
                  href={tab.href}
                  className={`
                    relative
                    block
                    border-b-2
                    pb-4
                    text-sm
                    font-semibold
                    transition-colors
                    duration-200
                    ${
                      active
                        ? "border-primary text-primary"
                        : "border-transparent text-gray-500 hover:text-gray-900"
                    }
                  `}
                >
                  {tab.title}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {children}
    </div>
  );
}
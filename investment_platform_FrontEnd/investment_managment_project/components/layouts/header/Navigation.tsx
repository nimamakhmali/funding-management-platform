"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { navLinks } from "@/lib/constants/navLinks";

export default function Navigation() {
  const pathname = usePathname();

  return (
    <nav className="hidden md:flex items-center gap-3">
      {navLinks.map((link) => {
        const isActive =
          pathname === link.href ||
          pathname.startsWith(`${link.href}/`);

        return (
          <Link
            key={link.href}
            href={link.href}
            className={`
              text-sm font-medium px-2 py-1.5 rounded-md
              ${
                isActive
                  ? "text-primary font-semibold"
                  : "text-text-muted hover:text-primary"
              }
            `}
          >
            {link.label}
          </Link>
        );
      })}
    </nav>
  );
}
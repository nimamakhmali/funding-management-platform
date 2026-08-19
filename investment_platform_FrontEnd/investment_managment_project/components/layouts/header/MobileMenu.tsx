"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { navLinks } from "@/lib/constants/navLinks";

type Props = {
  isOpen: boolean;
  onClose: () => void;
};

export default function MobileMenu({ isOpen, onClose }: Props) {
  const pathname = usePathname();

  return (
    <div
      className={`
        md:hidden fixed top-14 left-0 w-full
        bg-surface border-b border-border shadow-lg
        transition-all duration-300 ease-out
        ${
          isOpen
            ? "opacity-100 translate-y-0 visible"
            : "opacity-0 -translate-y-2 invisible"
        }
      `}
    >
      <div className="flex flex-col p-5 gap-3">

        {navLinks.map((link) => {
          const isActive =
            pathname === link.href ||
            pathname.startsWith(`${link.href}/`);

          return (
            <Link
              key={link.href}
              href={link.href}
              onClick={onClose}
              className={`
                text-sm px-3 py-2 rounded-md text-center
                ${
                  isActive
                    ? "text-primary bg-primary/10"
                    : "text-text-muted hover:text-primary hover:bg-surface-hover"
                }
              `}
            >
              {link.label}
            </Link>
          );
        })}

        <div className="h-px bg-border my-2" />

        <Link
          href="/login"
          onClick={onClose}
          className="text-sm px-3 py-2 rounded-md text-center text-text-muted hover:text-primary hover:bg-surface-hover"
        >
          ورود
        </Link>

        <Link
          href="/sign-up"
          onClick={onClose}
          className="text-sm px-3 py-2 rounded-md text-center bg-primary text-white hover:bg-primary-dark"
        >
          ثبت‌نام
        </Link>
      </div>
    </div>
  );
}
"use client";

import Link from "next/link";
import { useEffect } from "react";
import { usePathname } from "next/navigation";
import Navigation from "./Navigation";
import MobileMenu from "./MobileMenu";
import { useMenu } from "@/lib/hooks/useMenu";
import { Infinity } from "lucide-react";
import { X } from "lucide-react";
import { Menu } from "lucide-react";

export default function Header() {
  const pathname = usePathname();

  const { isOpenMenu, toggleMenu, closeMenu } = useMenu();

  useEffect(() => {
    closeMenu();
  }, [pathname]);

  return (
    <header className="sticky top-0 z-50 w-full bg-surface/80 backdrop-blur-md border-b border-border">
      <div className="max-w-7xl mx-auto px-4 h-14 flex items-center justify-between">

        <Link href="/" className="flex items-center gap-2">
          <div className="w-7 h-7 bg-primary rounded-md flex items-center justify-center text-white">
            <Infinity />
          </div>

          <span className="text-base font-semibold">لگو</span>
        </Link>

        <Navigation />

        <div className="hidden md:flex items-center gap-2">
          <Link href="/login" className="px-3 py-1.5 text-sm">
            ورود
          </Link>

          <Link
            href="/sign-up"
            className="px-3 py-1.5 text-sm font-medium text-white bg-primary rounded-md"
          >
            ثبت‌نام
          </Link>
        </div>

        <button
          onClick={toggleMenu}
          className="md:hidden p-2"
          aria-label="menu"
        >
          {isOpenMenu ? <X size={20} /> : <Menu size={20} />}
        </button>

        <MobileMenu
          isOpen={isOpenMenu}
          onClose={closeMenu}
        />
      </div>
    </header>
  );
}
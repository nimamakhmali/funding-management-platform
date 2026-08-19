
import {
  FaInstagram,
  FaLinkedin,
  FaTelegram,
  FaWhatsapp,
} from "react-icons/fa";

export type FooterLink = {
  id: string;
  label: string;
  href: string;
};

export type FooterSection = {
  id: string;
  title: string;
  links: FooterLink[];
};

export const footerSections: FooterSection[] = [
  {
    id: "quick-access",
    title: "دسترسی سریع",
    links: [
      {
        id: "about-us",
        label: "درباره ما",
        href: "/about-us",
      },
      {
        id: "login",
        label: "ورود / ثبت نام",
        href: "/login",
      },
      {
        id: "projects",
        label: "پروژه‌های فعال",
        href: "/projects",
      },
    ],
  },
  {
    id: "legal",
    title: "قانونی",
    links: [
      {
        id: "privacy",
        label: "حریم خصوصی",
        href: "/",
      },
      {
        id: "terms",
        label: "شرایط استفاده",
        href: "/",
      },
      {
        id: "transparency",
        label: "گزارش‌های شفافیت",
        href: "/",
      },
    ],
  },
];

export type SocialLink = {
  id: string;
  label: string;
  href: string;
  Icon: React.ComponentType;
};

export const socialLinks: SocialLink[] = [
  {
    id: "telegram",
    label: "تلگرام",
    href: "https://t.me/your_channel",
    Icon: FaTelegram,
  },
  {
    id: "instagram",
    label: "اینستاگرام",
    href: "https://instagram.com/your_username",
    Icon: FaInstagram ,
  },
  {
    id: "linkedin",
    label: "لینکدین",
    href: "https://linkedin.com/company/your_company",
    Icon: FaLinkedin,
  },
  {
    id: "whatsapp",
    label: "واتس‌اپ",
    href: "https://wa.me/989120000000",
    Icon: FaWhatsapp,
  },
];
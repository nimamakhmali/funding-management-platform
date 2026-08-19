'use client'
import { Sidebar} from '../types/sidebar-types';
import {
  Folder,
  WalletCards,
  HelpCircle,
  BookDashed,
  TrendingUpDown,
  ClipboardClock
} from 'lucide-react';

export const SIDEBARE_ITEMS: Sidebar[] = [
  {
    id: 'dashboard-12',
    href: "/invest-dashboard",
    title: "داشبورد",
    icon: BookDashed,
  },
  {
    id: 'projects-1',
    href: "/invest-project",
    title: "پروژه ها",
    icon: Folder,
     subItems: [
      { id: "investment-projects",
        title: "سرمایه گذاری در پروژه",
        href: "/invest-project/investment-projects", 
      },
    ]
  },
  {
    id: "wallet-2",
    href: "/invest-wallet",
    title: "کیف پول",
    icon: WalletCards,
  },
{
  id:"profit-loss",
  href: "/profit-report",
  title: "سود و زیان",
  icon: TrendingUpDown
},

{
  id:"transactions",
  href: "/transaction-history",
  title: "تاریخچه تراکنش ها",
  icon: ClipboardClock
},
  
  {
    id: 'support-4',
    href: '/invest-support',
    title: "پشتیبانی",
    icon: HelpCircle,
  },
];


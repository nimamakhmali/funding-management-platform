// data/investmentStats.ts
import { TrendingUp, BarChart2, Minus, Minimize } from 'lucide-react';
import { Cards } from '../types/card-types';
export const INVEST_CARD: Cards[] = [
  {
     id: 'card-1',
    title: 'کل سرمایه‌گذاری',
    value: '۵۰,۰۰۰,۰۰۰,۰۰۰',
    unit: 'تومان',
    growth: '۲.۱٪+',
    icon: TrendingUp,
    label: 'نسبت به ماه قبل',
    color: 'primary',
  },
  {
     id: 'card-2',
    title: 'میانگین بازدهی',
    value: '۱۲.۵٪',
    unit: '',
    growth: '۰.۵٪+',
    icon: BarChart2,
    label: 'رشد پایدار',
    color: 'primary',
  },
  {
     id: 'card-3',
    title: 'سود محقق شده',
    value: '۴۵۰,۰۰۰,۰۰۰',
    unit: 'تومان',
    growth: '۵.۳٪+',
    icon: BarChart2,
    label: 'عملکرد عالی',
    color: 'primary',
  },
  {
     id: 'card-4',
    title: 'پروژه‌های فعال',
    value: '۸',
    unit: 'مورد',
    growth: '',
    icon: Minus,
    label: 'بدون تغییر',
    color: 'primary',
  },
];
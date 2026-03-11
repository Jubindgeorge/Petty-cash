import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export interface Company {
  id: string;
  name: string;
  logo: string;
  address: string;
  phone: string;
  email: string;
  primaryColor: string;
  accentColor: string;
  fontFamily: string;
}

export interface VoucherData {
  voucherNo: string;
  date: string;
  paidTo: string;
  description: string;
  amount: number;
  accountCode: string;
  approvedBy: string;
  receivedBy: string;
}

export const COMPANIES: Company[] = [
  {
    id: 'jimmy',
    name: 'Jimmy Aventus FZE',
    logo: 'https://raw.githubusercontent.com/Jubindgeorge/stock-manager/refs/heads/main/pdflogo.png',
    address: 'Q1-006 008B, Sharjah Airport International Free Zone, Sharjah, UAE',
    phone: '+971 56 368 9970',
    email: 'accounts@jimmyaventus.com',
    primaryColor: 'bg-purple-700',
    accentColor: 'text-purple-700',
    fontFamily: 'font-sans',
  },
  {
    id: 'hekayat',
    name: 'Hekayat Attar & Al Oud Perfumes Trading LLC',
    logo: 'https://raw.githubusercontent.com/Jubindgeorge/stock-manager/refs/heads/main/banner.png',
    address: 'Shop 7, Corniche Road, Al Majarrah, Sharjah, UAE',
    phone: '+971 52 968 3102',
    email: 'info@hekayatattar.com',
    primaryColor: 'bg-zinc-900',
    accentColor: 'text-zinc-900',
    fontFamily: 'font-serif',
  },
];

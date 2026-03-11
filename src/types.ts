import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function numberToWords(num: number): string {
  const ones = ['', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine'];
  const tens = ['', '', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety'];
  const teens = ['ten', 'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen'];

  function convert_hundreds(num: number): string {
    if (num > 99) {
      return ones[Math.floor(num / 100)] + " hundred " + convert_tens(num % 100);
    } else {
      return convert_tens(num);
    }
  }

  function convert_tens(num: number): string {
    if (num < 10) return ones[num];
    else if (num >= 10 && num < 20) return teens[num - 10];
    else {
      return tens[Math.floor(num / 10)] + " " + ones[num % 10];
    }
  }

  function convert(num: number): string {
    if (num === 0) return "";
    if (num < 1000) return convert_hundreds(num);
    if (num < 1000000) return convert(Math.floor(num / 1000)) + " thousand " + convert_hundreds(num % 1000);
    if (num < 1000000000) return convert(Math.floor(num / 1000000)) + " million " + convert(num % 1000000);
    return convert(Math.floor(num / 1000000000)) + " billion " + convert(num % 1000000000);
  }

  if (num === 0) return "zero dirhams only";

  const wholePart = Math.floor(num);
  const decimalPart = Math.round((num - wholePart) * 100);

  let result = "";
  if (wholePart > 0) {
    result = convert(wholePart).trim() + " dirhams";
  } else if (decimalPart > 0) {
    result = "zero dirhams";
  }

  if (decimalPart > 0) {
    result += " and " + convert_tens(decimalPart).trim() + " fils";
  }
  
  return result.trim() + " only";
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

import { Cairo, Tajawal } from 'next/font/google';

const cairo = Cairo({
  variable: '--font-cairo',
  subsets: ['arabic'],
  weight: ['200', '300', '400', '500', '600', '700', '800', '900', '1000'],
  display: 'swap',
});

const tajawal = Tajawal({
  variable: '--font-tajawal',
  subsets: ['arabic'],
  weight: ['400', '500'],
  display: 'swap',
});

// semantic mapping for Arabic
export const fontVariables = `${cairo.variable} ${tajawal.variable}`;
export const fontClassNames = 'ar-fonts'; // used below to scope CSS vars

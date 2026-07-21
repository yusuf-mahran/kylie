import { Roboto, Amiri } from 'next/font/google';

const roboto = Roboto({
  variable: '--font-roboto',
  subsets: ['latin'],
  weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
  display: 'swap',
});

const amiri = Amiri({
  variable: '--font-amiri',
  subsets: ['latin'],
  weight: ['400', '700'],
  display: 'swap',
});

export const fontVariables = `${roboto.variable} ${amiri.variable}`;
export const fontClassNames = 'en-fonts';

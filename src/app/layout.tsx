import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Kylie',
  description: 'متجر مستحضرات تجميل راقي — كايلي',
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html className={`min-h-full antialiased`}>
      <body className="min-h-full flex flex-col overflow-x-hidden">
        <div className="mx-auto w-full max-w-[2180px] xl:px-8 px-4">
          {children}
        </div>
      </body>
    </html>
  );
}

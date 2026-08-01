import type { Metadata } from 'next';
import Navbar from '@/components/shared/navigation/Navbar';
import Footer from '@/components/shared/navigation/Footer';

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
    <div className="mx-auto w-full max-w-[2180px] xl:px-8 px-4">
      <Navbar />
      <div className="w-full -mt-1">{children}</div>
      <Footer />
    </div>
  );
}

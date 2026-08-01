import type { Metadata } from 'next';
export const metadata: Metadata = {
  title: 'Kylie',
  description: 'متجر مستحضرات تجميل راقي — كايلي',
};

export default async function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="w-full min-h-dvh p-3 bg-surface">{children}</div>;
}

import Hero from '@/components/landing/Hero';

export default function HomePage() {
  return (
    <div className="w-full min-h-dvh bg-background text-foreground space-y-4">
      <Hero />
      <Hero />
    </div>
  );
}

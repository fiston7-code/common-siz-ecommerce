// app/page.tsx
import Hero from '@/components/Hero';
import DeliveryInfo from '@/components/DeliveryInfo';
import HowItWorks from '@/components/HowItWorks';


export default function Home() {
  return (
    <main className="min-h-screen">
      <Hero />
      <HowItWorks />
      <DeliveryInfo />
    </main>
  );
}
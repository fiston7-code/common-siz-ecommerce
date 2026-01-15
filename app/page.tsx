// app/page.tsx
import Hero from '@/components/Hero';
import Categories from '@/components/Categories';
import DeliveryInfo from '@/components/DeliveryInfo';


export default function Home() {
  return (
    <main className="min-h-screen">
      <Hero />
      <Categories />
      <DeliveryInfo />
    </main>
  );
}
// app/page.tsx
import Hero from '@/components/Hero';
import DeliveryInfo from '@/components/DeliveryInfo';
import HowItWorks from '@/components/HowItWorks';
import TestimonialSection from '@/components/TestimonialSection'
import { createClient } from '@supabase/supabase-js';


export default async function Home() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
  const { data: testimonials, error } = await supabase
    .from('testimonials')
    .select('*')
    .eq('is_visible', true)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Erreur lors du chargement des témoignages:', error);
  }

  return (
    <main className="min-h-screen">
      <Hero />
      <HowItWorks />
      <DeliveryInfo />
      <TestimonialSection testimonials={testimonials || []} />
    </main>
  );
}
// app/admin/settings/page.tsx
import { cookies } from 'next/headers';
import { verifyToken } from '@/lib/auth';
import { redirect } from 'next/navigation';
import SettingsForm from '@/components/admin/SettingsForm';
import { createAdminClient } from '@/lib/server';

export default async function SettingsPage() {
  // Récupérer l'admin connecté depuis le token
  const cookieStore = await cookies();
  const token = cookieStore.get('admin_token')?.value;

  if (!token) {
    redirect('/admin/login');
  }

  const payload = verifyToken(token);

  if (!payload) {
    redirect('/admin/login');
  }

  // Récupérer les infos complètes de l'admin depuis la DB
  const supabase = await createAdminClient();
  const { data: admin } = await supabase
    .from('admins')
    .select('id, email, name, role')
    .eq('id', payload.id)
    .single();

  if (!admin) {
    redirect('/admin/login');
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Paramètres</h1>
        <p className="text-gray-600 mt-2">Gérez vos informations personnelles</p>
      </div>

      <SettingsForm admin={admin} />
    </div>
  );
}
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { verifyToken } from '@/lib/auth';
import { createAdminClient } from '@/lib/server';
import { UserCircle, Mail, Phone, MapPin, ShoppingBag, Calendar } from 'lucide-react';

export default async function CustomersPage() {
  // ✅ Vérifier l'authentification JWT
  const cookieStore = await cookies();
  const token = cookieStore.get('admin_token')?.value;

  if (!token) {
    redirect('/admin/login');
  }

  const payload = verifyToken(token);

  if (!payload) {
    redirect('/admin/login');
  }

  // ✅ Vérifier le rôle super_admin (directement depuis le payload)
  if (payload.role !== 'super_admin') {
    redirect('/admin/dashboard');
  }

  // ✅ Récupérer les clients avec leurs commandes
  const supabase = await createAdminClient();

  const { data: customers } = await supabase
    .from('profiles')
    .select(`
      id,
      full_name,
      email,
      phone,
      address,
      created_at,
      orders:orders(id, total_price, created_at)
    `)
    .order('created_at', { ascending: false });

  const customersWithStats = customers?.map(customer => ({
    ...customer,
    totalOrders: customer.orders?.length || 0,
    totalSpent: customer.orders?.reduce((sum, order) => sum + order.total_price, 0) || 0,
    lastOrder: customer.orders?.[0]?.created_at || null,
  })) || [];

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Clients</h1>
        <p className="text-gray-600 mt-2">Gérez vos clients et consultez leur historique</p>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total clients</p>
              <p className="text-2xl font-bold text-gray-900 mt-2">{customersWithStats.length}</p>
            </div>
            <UserCircle className="w-12 h-12 text-blue-500" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Clients actifs</p>
              <p className="text-2xl font-bold text-gray-900 mt-2">
                {customersWithStats.filter(c => c.totalOrders > 0).length}
              </p>
            </div>
            <ShoppingBag className="w-12 h-12 text-green-500" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Revenus totaux</p>
              <p className="text-2xl font-bold text-gray-900 mt-2">
                {customersWithStats.reduce((sum, c) => sum + c.totalSpent, 0).toLocaleString('fr-FR')} FC
              </p>
            </div>
            <Calendar className="w-12 h-12 text-purple-500" />
          </div>
        </div>
      </div>

      {/* Liste des clients */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left py-4 px-6 text-sm font-semibold text-gray-600">Client</th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-gray-600">Contact</th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-gray-600">Adresse</th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-gray-600">Commandes</th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-gray-600">Total dépensé</th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-gray-600">Dernière commande</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {customersWithStats.map((customer) => (
                <tr key={customer.id} className="hover:bg-gray-50 transition">
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <UserCircle className="w-6 h-6 text-blue-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{customer.full_name || 'Sans nom'}</p>
                        <p className="text-sm text-gray-500">
                          Inscrit le {new Date(customer.created_at).toLocaleDateString('fr-FR')}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Mail className="w-4 h-4" />
                        {customer.email}
                      </div>
                      {customer.phone && (
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Phone className="w-4 h-4" />
                          {customer.phone}
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    {customer.address ? (
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <MapPin className="w-4 h-4" />
                        {customer.address}
                      </div>
                    ) : (
                      <span className="text-sm text-gray-400">Non renseignée</span>
                    )}
                  </td>
                  <td className="py-4 px-6">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                      {customer.totalOrders}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <p className="font-semibold text-gray-900">
                      {customer.totalSpent.toLocaleString('fr-FR')} FC
                    </p>
                  </td>
                  <td className="py-4 px-6 text-sm text-gray-600">
                    {customer.lastOrder
                      ? new Date(customer.lastOrder).toLocaleDateString('fr-FR')
                      : 'Jamais'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
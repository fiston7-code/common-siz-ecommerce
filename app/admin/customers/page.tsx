import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { verifyToken } from '@/lib/auth';
import { createAdminClient } from '@/lib/server';
import { UserCircle, Mail, Phone, MapPin, ShoppingBag, Calendar } from 'lucide-react';
import { Order } from '@/types';
import { formatPrice } from '@/lib/currency/converter';
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

  // ✅ Vérifier le rôle super_admin
  if (payload.role !== 'super_admin') {
    redirect('/admin/dashboard');
  }

  // ✅ Récupérer tous les clients uniques depuis les commandes
  const supabase = await createAdminClient();

  const { data: orders } = await supabase
    .from('orders')
    .select('customer_name, customer_phone, customer_whatsapp, customer_email, total, created_at')
    .order('created_at', { ascending: false });

  // Grouper les commandes par client (basé sur le téléphone comme identifiant unique)
  const customersMap = new Map();

  orders?.forEach(order => {
    const key = order.customer_phone; // Utiliser le téléphone comme identifiant unique
    
    if (!customersMap.has(key)) {
      customersMap.set(key, {
        customer_name: order.customer_name,
        customer_phone: order.customer_phone,
        customer_whatsapp: order.customer_whatsapp,
        customer_email: order.customer_email,
        orders: [],
        created_at: order.created_at,
      });
    }
    
      customersMap.get(key).orders.push({
        total: order.total,
        created_at: order.created_at,
      });
    });
  
  type CustomerOrder = {
    total: number;
    created_at: string;
  };

  // Convertir en tableau et calculer les statistiques
  const customersWithStats = Array.from(customersMap.values()).map(customer => ({
    ...customer,
    totalOrders: customer.orders.length,
    totalSpent: customer.orders.reduce((sum: number, order: CustomerOrder) => sum + order.total, 0),
    lastOrder: customer.orders[0]?.created_at || null,
    firstOrder: customer.orders[customer.orders.length - 1]?.created_at || null,
  }));

  // Trier par nombre de commandes (décroissant)
  customersWithStats.sort((a, b) => b.totalOrders - a.totalOrders);

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
                {formatPrice(customersWithStats.reduce((sum, c) => sum + c.totalSpent, 0), 'FC')}
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
                <th className="text-left py-4 px-6 text-sm font-semibold text-gray-600">Commandes</th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-gray-600">Total dépensé</th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-gray-600">Dernière commande</th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-gray-600">Première commande</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {customersWithStats.map((customer, index) => (
                <tr key={`${customer.customer_phone}-${index}`} className="hover:bg-gray-50 transition">
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <UserCircle className="w-6 h-6 text-blue-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{customer.customer_name || 'Sans nom'}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="space-y-1">
                      {customer.customer_email && (
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Mail className="w-4 h-4" />
                          {customer.customer_email}
                        </div>
                      )}
                      {customer.customer_phone && (
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Phone className="w-4 h-4" />
                          {customer.customer_phone}
                        </div>
                      )}
                      {customer.customer_whatsapp && (
                        <div className="flex items-center gap-2 text-sm text-green-600">
                          <Phone className="w-4 h-4" />
                          WhatsApp: {customer.customer_whatsapp}
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                      {customer.totalOrders}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <p className="font-semibold text-gray-900">
                      {formatPrice(customer.totalSpent, 'FC')}
                    </p>
                  </td>
                  <td className="py-4 px-6 text-sm text-gray-600">
                    {customer.lastOrder
                      ? new Date(customer.lastOrder).toLocaleDateString('fr-FR')
                      : 'Jamais'}
                  </td>
                  <td className="py-4 px-6 text-sm text-gray-600">
                    {customer.firstOrder
                      ? new Date(customer.firstOrder).toLocaleDateString('fr-FR')
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
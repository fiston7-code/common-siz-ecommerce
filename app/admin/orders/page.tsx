'use client';

import { useEffect, useState } from 'react';
import { RefreshCw } from 'lucide-react';
import OrderDetailsModal from './OrderDetailsModal';

// 1️⃣ Interface TypeScript pour une commande
interface Order {
  id: string;
  order_number: string;
  customer_id: string | null;
  
  // Infos client
  customer_name: string;
  customer_phone: string;
  customer_whatsapp: string | null;
  customer_email: string | null;
  customer_type: 'individual' | 'business';
  company_name: string | null;
  
  // Adresse livraison
  delivery_commune: string;
  delivery_quartier: string;
  delivery_avenue: string;
  delivery_reference: string | null;
  delivery_landmark: string | null;
  delivery_instructions: string | null;
  
  // Montants
  subtotal: number;
  shipping_cost: number | null;
  total: number | null;
  final_total: number | null;
  pricing_confirmed: boolean;
  
  // Statut
  status: 'pending' | 'called' | 'confirmed' | 'preparing' | 'shipped' | 'delivered' | 'cancelled';
  payment_method: string;
  delivery_type: 'standard' | 'express' | null;
  
  // Notes
  customer_notes: string | null;
  admin_notes: string | null;
  cancellation_reason: string | null;
  confirmed_by: string | null;
  
  // Dates
  confirmed_at: string | null;
  shipped_at: string | null;
  delivered_at: string | null;
  cancelled_at: string | null;
  created_at: string;
  updated_at: string;
}

// 5️⃣ Couleurs pour les différents statuts
const statusColors: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  called: 'bg-orange-100 text-orange-800 border-orange-200',
  confirmed: 'bg-blue-100 text-blue-800 border-blue-200',
  preparing: 'bg-purple-100 text-purple-800 border-purple-200',
  shipped: 'bg-teal-100 text-teal-800 border-teal-200',
  delivered: 'bg-green-100 text-green-800 border-green-200',
  cancelled: 'bg-red-100 text-red-800 border-red-200',
};



export default function OrdersPage() {
  // 2️⃣ States React pour gérer les données
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);

  // 3️⃣ Charger les commandes au démarrage
  useEffect(() => {
    loadOrders();
  }, []);

  // 4️⃣ Fonction pour récupérer les commandes depuis l'API
  const loadOrders = async () => {
    try {
      setLoading(true);
      setError('');

      const response = await fetch('/api/admin/orders', {
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('Erreur lors du chargement');
      }

      const data = await response.json();
      setOrders(data.orders);

    } catch (err) {
      console.error('Erreur:', err);
      setError('Impossible de charger les commandes');
    } finally {
      setLoading(false);
    }
  };

  // 4️⃣ bis - Fonction pour changer le statut d'une commande
  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    try {
      const response = await fetch(`/api/admin/orders/${orderId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la mise à jour');
      }

      const data = await response.json();

      // Mettre à jour la commande dans la liste locale
      setOrders(prevOrders =>
        prevOrders.map(order =>
          order.id === orderId ? { ...order, status: newStatus as Order['status'] } : order
        )
      );

      console.log('✅ Statut mis à jour:', data);

    } catch (err) {
      console.error('Erreur:', err);
      alert('Impossible de mettre à jour le statut');
    }
  };

      // Écouter les mises à jour depuis le modal
useEffect(() => {
  const handleOrderUpdated = () => {
    loadOrders();
  }
  
  window.addEventListener('orderUpdated', handleOrderUpdated);
  
  return () => {
    window.removeEventListener('orderUpdated', handleOrderUpdated);
  };
}, []);

  // 7️⃣ Affichage pendant le chargement
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Chargement des commandes...</p>
        </div>
      </div>
    );
  }

  // 8️⃣ Affichage en cas d'erreur
  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6">
        <p className="text-red-800">{error}</p>
        <button
          onClick={loadOrders}
          className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
        >
          Réessayer
        </button>
      </div>
    );
  }

  // 9️⃣ Rendu principal
  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Commandes</h1>
          <p className="text-gray-500 mt-1">
            {orders.length} commande{orders.length > 1 ? 's' : ''} au total
          </p>
        </div>

        <button
          onClick={loadOrders}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <RefreshCw className="w-4 h-4" />
          Actualiser
        </button>
      </div>

      {/* Liste des commandes */}
      {orders.length === 0 ? (
        <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
          <p className="text-gray-500">Aucune commande pour le moment</p>
        </div>
      ) : (
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    N° Commande
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Client
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Téléphone
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Montant
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Statut
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Date
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {orders.map((order) => (
                  <tr
                    key={order.id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                   <td className="px-6 py-4 whitespace-nowrap">
  <button
    onClick={() => setSelectedOrderId(order.id)}
    className="text-sm font-mono text-blue-600 hover:text-blue-800 hover:underline transition-colors"
  >
    #{order.order_number}
  </button>
</td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">
                        {order.customer_name}
                      </div>
                      <div className="text-xs text-gray-500">
                        {order.delivery_commune}, {order.delivery_quartier}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-gray-900">
                        {order.customer_phone}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-gray-900">
                          {((order.final_total || order.total || order.subtotal || 0) / 100).toFixed(2)} fc
                        </span>
                        {!order.pricing_confirmed && (
                          <span className="text-xs bg-orange-100 text-orange-800 px-2 py-0.5 rounded">
                            À confirmer
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <select
                        value={order.status}
                        onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                        className={`px-3 py-1.5 text-xs font-medium rounded-lg border-2 cursor-pointer transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                          statusColors[order.status] || 'bg-gray-100 text-gray-800 border-gray-200'
                        }`}
                      >
                        <option value="pending">En attente</option>
                        <option value="called">Appelé</option>
                        <option value="confirmed">Confirmée</option>
                        <option value="preparing">En préparation</option>
                        <option value="shipped">Expédiée</option>
                        <option value="delivered">Livrée</option>
                        <option value="cancelled">Annulée</option>
                      </select>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(order.created_at).toLocaleDateString('fr-FR', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      )}

      {/* Modal pour les détails de la commande */}
        {selectedOrderId && (
          <OrderDetailsModal
            orderId={selectedOrderId}
            onClose={() => setSelectedOrderId(null)}
          />
        )}
      </div>
    );
  }
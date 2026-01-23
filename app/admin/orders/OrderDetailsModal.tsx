'use client';

import { X, Package, MapPin, Phone, Mail, CreditCard, Calendar, User, Building2,CheckCircle2 } from 'lucide-react';
import { useEffect, useState } from 'react';

interface OrderItem {
  id: string;
  product_id: string;
  product_name: string;
  quantity: number;
  unit_price: number;
  total_price: number;
}

interface OrderDetails {
  id: string;
  order_number: string;
  
  // Client
  customer_name: string;
  customer_phone: string;
  customer_whatsapp: string | null;
  customer_email: string | null;
  customer_type: 'individual' | 'business';
  company_name: string | null;
  
  // Livraison
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
  status: string;
  payment_method: string;
  delivery_type: 'standard' | 'express' | null;
  
  // Notes
  customer_notes: string | null;
  admin_notes: string | null;
  
  // Dates
  created_at: string;
  confirmed_at: string | null;
  
  // Produits
  items: OrderItem[];
}

interface OrderDetailsModalProps {
  orderId: string;
  onClose: () => void;
}

export default function OrderDetailsModal({ orderId, onClose }: OrderDetailsModalProps) {
  const [order, setOrder] = useState<OrderDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [updatingStatus, setUpdatingStatus] = useState(false);

  // Charger les détails de la commande
  useEffect(() => {
    loadOrderDetails();
  }, [orderId]);

  const loadOrderDetails = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/admin/orders/${orderId}/details`, {
        credentials: 'include',
      });

      if (!response.ok) throw new Error('Erreur de chargement');

      const data = await response.json();
      setOrder(data.order);
    } catch (err) {
      console.error('Erreur:', err);
      setError('Impossible de charger les détails');
    } finally {
      setLoading(false);
    }
  };


const updateStatus = async (newStatus: string) => {
  try {
    setUpdatingStatus(true);
    const response = await fetch(`/api/admin/orders/${orderId}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ status: newStatus }),
    });

    if (!response.ok) throw new Error('Erreur de mise à jour');

    const data = await response.json();
    setOrder(data.order);
    
    // Notifier le parent pour rafraîchir la liste
    window.dispatchEvent(new Event('orderUpdated'));
    
  } catch (err) {
    console.error('Erreur:', err);
    alert('Erreur lors de la mise à jour du statut');
  } finally {
    setUpdatingStatus(false);
  }
};

const getStatusColor = (status: string) => {
  const colors = {
    pending: 'bg-yellow-100 text-yellow-800',
    confirmed: 'bg-blue-100 text-blue-800',
    preparing: 'bg-purple-100 text-purple-800',
    shipped: 'bg-indigo-100 text-indigo-800',
    delivered: 'bg-green-100 text-green-800',
    cancelled: 'bg-red-100 text-red-800',
  };
  return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800';
};

const getStatusLabel = (status: string) => {
  const labels = {
    pending: '⏳ En attente',
    confirmed: '✅ Confirmée',
    preparing: '📦 En préparation',
    shipped: '🚚 Expédiée',
    delivered: '✅ Livrée',
    cancelled: '❌ Annulée',
  };
  return labels[status as keyof typeof labels] || status;
};

  // Fermer avec ESC
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div
          className="relative bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header
          <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gray-50">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                Commande #{order?.order_number || '...'}
              </h2>
              <p className="text-sm text-gray-500 mt-1">
                {order?.created_at && new Date(order.created_at).toLocaleDateString('fr-FR', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
            >
              <X className="w-6 h-6 text-gray-500" />
            </button>
          </div> */}


          {/* Header */}
<div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gray-50">
  <div className="flex-1">
    <div className="flex items-center gap-4">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">
          Commande #{order?.order_number || '...'}
        </h2>
        <p className="text-sm text-gray-500 mt-1">
          {order?.created_at && new Date(order.created_at).toLocaleDateString('fr-FR', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
          })}
        </p>
      </div>
      
      {/* Dropdown de statut */}
      {order && (
        <div className="ml-4">
          <select
            value={order.status}
            onChange={(e) => updateStatus(e.target.value)}
            disabled={updatingStatus}
            className={`px-3 py-2 rounded-lg text-sm font-medium border-2 transition-colors cursor-pointer ${getStatusColor(order.status)} ${
              updatingStatus ? 'opacity-50 cursor-not-allowed' : 'hover:opacity-80'
            }`}
          >
            <option value="pending">⏳ En attente</option>
            <option value="confirmed">✅ Confirmée</option>
            <option value="preparing">📦 En préparation</option>
            <option value="shipped">🚚 Expédiée</option>
            <option value="delivered">✅ Livrée</option>
            <option value="cancelled">❌ Annulée</option>
          </select>
        </div>
      )}
    </div>
  </div>
  
  <button
    onClick={onClose}
    className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
  >
    <X className="w-6 h-6 text-gray-500" />
  </button>
</div>

          {/* Content */}
          <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
              </div>
            ) : error ? (
              <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
                <p className="text-red-800">{error}</p>
              </div>
            ) : order ? (
              <div className="space-y-6">
                {/* Produits */}
                <section>
                  <div className="flex items-center gap-2 mb-4">
                    <Package className="w-5 h-5 text-blue-600" />
                    <h3 className="text-lg font-semibold text-gray-900">Produits commandés</h3>
                  </div>
                  <div className="bg-gray-50 rounded-lg border border-gray-200 overflow-hidden">
                    <table className="w-full">
                      <thead className="bg-gray-100 border-b border-gray-200">
                        <tr>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                            Produit
                          </th>
                          <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">
                            Quantité
                          </th>
                          <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                            Prix unitaire
                          </th>
                          <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                            Total
                          </th>
                        </tr>
                      </thead>
                      {/* <tbody className="divide-y divide-gray-200">
                        {order.items.map((item) => (
                          <tr key={item.id}>
                            <td className="px-4 py-3 text-sm text-gray-900">
                              {item.product_name}
                            </td>
                            <td className="px-4 py-3 text-sm text-gray-600 text-center">
                              ×{item.quantity}
                            </td>
                            <td className="px-4 py-3 text-sm text-gray-900 text-right">
                              {(item.unit_price / 100).toFixed(2)} fc
                            </td>
                            <td className="px-4 py-3 text-sm font-medium text-gray-900 text-right">
                              {(item.total_price / 100).toFixed(2)} fc
                            </td>
                          </tr>
                        ))}
                      </tbody> */}

                      <tbody className="divide-y divide-gray-200">
  {order.items && order.items.length > 0 ? (
    order.items.map((item) => (
      <tr key={item.id}>
        <td className="px-4 py-3 text-sm text-gray-900">
          {item.product_name}
        </td>
        <td className="px-4 py-3 text-sm text-gray-600 text-center">
          ×{item.quantity}
        </td>
        <td className="px-4 py-3 text-sm text-gray-900 text-right">
          {(item.unit_price / 100).toFixed(2)} fc
        </td>
        <td className="px-4 py-3 text-sm font-medium text-gray-900 text-right">
          {(item.total_price / 100).toFixed(2)} fc
        </td>
      </tr>
    ))
  ) : (
    <tr>
      <td colSpan={4} className="px-4 py-8 text-center text-sm text-gray-500">
        Aucun produit dans cette commande
      </td>
    </tr>
  )}
</tbody>
                    </table>
                  </div>
                </section>

                {/* Montants */}
                <section className="bg-blue-50 rounded-lg border border-blue-200 p-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Sous-total</span>
                      <span className="font-medium text-gray-900">
                        {(order.subtotal / 100).toFixed(2)} fc
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Frais de livraison</span>
                      <span className="font-medium text-gray-900">
                        {order.shipping_cost ? `${(order.shipping_cost / 100).toFixed(2)} fc` : 'À définir'}
                      </span>
                    </div>
                    <div className="border-t border-blue-300 pt-2 flex justify-between">
                      <span className="font-semibold text-gray-900">Total</span>
                      <span className="text-lg font-bold text-blue-600">
                        {((order.final_total || order.total || order.subtotal) / 100).toFixed(2)} fc
                      </span>
                    </div>
                    {!order.pricing_confirmed && (
                      <div className="bg-orange-100 border border-orange-200 rounded px-3 py-2 text-xs text-orange-800">
                        ⚠️ Prix à confirmer après appel client
                      </div>
                    )}
                  </div>
                </section>

                <div className="grid md:grid-cols-2 gap-6">
                  {/* Informations client */}
                  <section>
                    <div className="flex items-center gap-2 mb-4">
                      <User className="w-5 h-5 text-blue-600" />
                      <h3 className="text-lg font-semibold text-gray-900">Client</h3>
                    </div>
                    <div className="space-y-3 bg-gray-50 rounded-lg p-4 border border-gray-200">
                      <div className="flex items-start gap-3">
                        {order.customer_type === 'business' ? (
                          <Building2 className="w-4 h-4 text-gray-400 mt-1" />
                        ) : (
                          <User className="w-4 h-4 text-gray-400 mt-1" />
                        )}
                        <div>
                          <p className="text-sm font-medium text-gray-900">
                            {order.customer_name}
                          </p>
                          {order.company_name && (
                            <p className="text-xs text-gray-500">{order.company_name}</p>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Phone className="w-4 h-4 text-gray-400" />
                        <p className="text-sm text-gray-900">{order.customer_phone}</p>
                      </div>
                      {order.customer_whatsapp && (
                        <div className="flex items-center gap-3">
                          <Phone className="w-4 h-4 text-green-500" />
                          <p className="text-sm text-gray-900">{order.customer_whatsapp}</p>
                        </div>
                      )}
                      {order.customer_email && (
                        <div className="flex items-center gap-3">
                          <Mail className="w-4 h-4 text-gray-400" />
                          <p className="text-sm text-gray-900">{order.customer_email}</p>
                        </div>
                      )}
                    </div>
                  </section>

                  {/* Adresse de livraison */}
                  <section>
                    <div className="flex items-center gap-2 mb-4">
                      <MapPin className="w-5 h-5 text-blue-600" />
                      <h3 className="text-lg font-semibold text-gray-900">Livraison</h3>
                    </div>
                    <div className="space-y-2 bg-gray-50 rounded-lg p-4 border border-gray-200">
                      <p className="text-sm text-gray-900">
                        <span className="font-medium">Commune :</span> {order.delivery_commune}
                      </p>
                      <p className="text-sm text-gray-900">
                        <span className="font-medium">Quartier :</span> {order.delivery_quartier}
                      </p>
                      <p className="text-sm text-gray-900">
                        <span className="font-medium">Avenue :</span> {order.delivery_avenue}
                      </p>
                      {order.delivery_reference && (
                        <p className="text-sm text-gray-600">
                          Référence : {order.delivery_reference}
                        </p>
                      )}
                      {order.delivery_landmark && (
                        <p className="text-sm text-gray-600">
                          Point de repère : {order.delivery_landmark}
                        </p>
                      )}
                      {order.delivery_instructions && (
                        <div className="mt-3 pt-3 border-t border-gray-200">
                          <p className="text-xs text-gray-500 mb-1">Instructions :</p>
                          <p className="text-sm text-gray-900">{order.delivery_instructions}</p>
                        </div>
                      )}
                      {order.delivery_type && (
                        <div className="mt-2">
                          <span className={`inline-block px-2 py-1 text-xs rounded ${
                            order.delivery_type === 'express'
                              ? 'bg-red-100 text-red-800'
                              : 'bg-gray-100 text-gray-800'
                          }`}>
                            {order.delivery_type === 'express' ? '⚡ Express' : 'Standard'}
                          </span>
                        </div>
                      )}
                    </div>
                  </section>
                </div>

                {/* Notes */}
                {(order.customer_notes || order.admin_notes) && (
                  <section>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Notes</h3>
                    <div className="space-y-3">
                      {order.customer_notes && (
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                          <p className="text-xs font-medium text-blue-800 mb-2">💬 Note du client</p>
                          <p className="text-sm text-gray-900">{order.customer_notes}</p>
                        </div>
                      )}
                      {order.admin_notes && (
                        <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                          <p className="text-xs font-medium text-purple-800 mb-2">📝 Note admin</p>
                          <p className="text-sm text-gray-900">{order.admin_notes}</p>
                        </div>
                      )}
                    </div>
                  </section>
                )}

                {/* Informations de paiement */}
                <section>
                  <div className="flex items-center gap-2 mb-4">
                    <CreditCard className="w-5 h-5 text-blue-600" />
                    <h3 className="text-lg font-semibold text-gray-900">Paiement</h3>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                    <p className="text-sm text-gray-900">
                      Mode de paiement : <span className="font-medium">
                        {order.payment_method === 'cash_on_delivery' ? 'Paiement à la livraison' : order.payment_method}
                      </span>
                    </p>
                  </div>
                </section>
              </div>
            ) : null}
          </div>

          {/* Footer */}
          {/* <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200 bg-gray-50">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Fermer
            </button>
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              Modifier le prix
            </button>
          </div> */}

          {/* Footer */}
<div className="flex items-center justify-between p-6 border-t border-gray-200 bg-gray-50">
  <div className="flex items-center gap-2">
    {order && !order.pricing_confirmed && (
      <button
        onClick={() => {
          // TODO: Ouvrir modal de confirmation de prix
          alert('Fonctionnalité à venir : Confirmer le prix');
        }}
        className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
      >
        <CheckCircle2 className="w-4 h-4" />
        Confirmer le prix
      </button>
    )}
  </div>
  
  <div className="flex items-center gap-3">
    <button
      onClick={onClose}
      className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
    >
      Fermer
    </button>
  </div>
</div>
        </div>
      </div>
    </div>
  );
}
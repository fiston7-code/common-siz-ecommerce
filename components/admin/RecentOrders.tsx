import React from 'react';
import { ShoppingBag, Clock } from 'lucide-react';
import Link from 'next/link';

interface RecentOrder {
  id: string;
  totalPrice: number;
  status: string;
  createdAt: string;
  customerName: string;
  customerEmail: string;
  itemsCount: number;
}

interface RecentOrdersProps {
  orders: RecentOrder[];
}

const statusConfig: Record<string, { label: string; color: string; bg: string }> = {
  pending: { label: 'En attente', color: 'text-yellow-700', bg: 'bg-yellow-100' },
  processing: { label: 'En traitement', color: 'text-blue-700', bg: 'bg-blue-100' },
  shipped: { label: 'Expédiée', color: 'text-purple-700', bg: 'bg-purple-100' },
  delivered: { label: 'Livrée', color: 'text-green-700', bg: 'bg-green-100' },
  cancelled: { label: 'Annulée', color: 'text-red-700', bg: 'bg-red-100' },
  completed: { label: 'Terminée', color: 'text-green-700', bg: 'bg-green-100' },
};

export default function RecentOrders({ orders }: RecentOrdersProps) {
  if (orders.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Commandes récentes
        </h3>
        <div className="text-center py-8">
          <ShoppingBag className="w-12 h-12 text-gray-400 mx-auto mb-2" />
          <p className="text-gray-500 text-sm">Aucune commande récente</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">
          Commandes récentes
        </h3>
        <Clock className="w-5 h-5 text-gray-400" />
      </div>
      <div className="space-y-3">
        {orders.map((order) => {
          const config = statusConfig[order.status] || statusConfig.pending;
          const orderDate = new Date(order.createdAt);
          
          return (
            <div
              key={order.id}
              className="flex items-center gap-4 p-3 rounded-lg hover:bg-gray-50 transition-colors border border-gray-100"
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <p className="font-medium text-gray-900">
                    {order.customerName}
                  </p>
                  <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${config.bg} ${config.color}`}>
                    {config.label}
                  </span>
                </div>
                <p className="text-sm text-gray-500 truncate">
                  {order.customerEmail}
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  {orderDate.toLocaleDateString('fr-FR', {
                    day: '2-digit',
                    month: 'short',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </p>
              </div>
              <div className="text-right">
                <p className="font-bold text-gray-900">
                  {order.totalPrice.toFixed(2)}€
                </p>
                <p className="text-xs text-gray-500">
                  {order.itemsCount} article{order.itemsCount > 1 ? 's' : ''}
                </p>
              </div>
            </div>
          );
        })}
      </div>
      <Link
        href="/admin/orders"
        className="block mt-4 text-center text-sm text-blue-600 hover:text-blue-700 font-medium"
      >
        Voir toutes les commandes →
      </Link>
    </div>
  );
}
import React from 'react';
import { AlertTriangle, Package } from 'lucide-react';
import Link from 'next/link';

interface LowStockProduct {
  id: string;
  name: string;
  imageUrl: string | null;
  stockQuantity: number;
  stockThreshold: number;
  category: string;
}

interface LowStockAlertProps {
  products: LowStockProduct[];
}

export default function LowStockAlert({ products }: LowStockAlertProps) {
  if (products.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Alertes stock bas
        </h3>
        <div className="text-center py-8">
          <Package className="w-12 h-12 text-gray-400 mx-auto mb-2" />
          <p className="text-gray-500 text-sm">Tous les stocks sont OK</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">
          Alertes stock bas
        </h3>
        <div className="flex items-center gap-1 px-2 py-1 bg-red-100 rounded-full">
          <AlertTriangle className="w-4 h-4 text-red-600" />
          <span className="text-sm font-medium text-red-600">
            {products.length}
          </span>
        </div>
      </div>
      <div className="space-y-3">
        {products.map((product) => (
          <div
            key={product.id}
            className="flex items-center gap-3 p-3 rounded-lg border border-red-100 bg-red-50"
          >
            <div className="flex-shrink-0 w-10 h-10 bg-white rounded-lg overflow-hidden">
              {product.imageUrl ? (
                <img
                  src={product.imageUrl}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <Package className="w-5 h-5 text-gray-400" />
                </div>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-gray-900 truncate">
                {product.name}
              </p>
              <p className="text-xs text-gray-500">{product.category}</p>
            </div>
            <div className="text-right">
              <p className="text-sm font-bold text-red-600">
                {product.stockQuantity} unités
              </p>
              <p className="text-xs text-gray-500">
                Seuil: {product.stockThreshold}
              </p>
            </div>
          </div>
        ))}
      </div>
      <Link
        href="/admin/products"
        className="block mt-4 text-center text-sm text-blue-600 hover:text-blue-700 font-medium"
      >
        Gérer les stocks →
      </Link>
    </div>
  );
}
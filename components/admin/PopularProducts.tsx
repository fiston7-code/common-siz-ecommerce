import React from 'react';
import { Package, TrendingUp } from 'lucide-react';

interface PopularProduct {
  id: string;
  name: string;
  imageUrl: string | null;
  price: number;
  orderCount: number;
  totalSold: number;
  totalRevenue: number;
}

interface PopularProductsProps {
  products: PopularProduct[];
}

export default function PopularProducts({ products }: PopularProductsProps) {
  if (products.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Produits populaires
        </h3>
        <div className="text-center py-8">
          <Package className="w-12 h-12 text-gray-400 mx-auto mb-2" />
          <p className="text-gray-500 text-sm">Aucune vente enregistrée</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">
          Produits populaires
        </h3>
        <TrendingUp className="w-5 h-5 text-green-600" />
      </div>
      <div className="space-y-4">
        {products.map((product, index) => (
          <div
            key={product.id}
            className="flex items-center gap-4 p-3 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
              <span className="text-sm font-bold text-blue-600">
                {index + 1}
              </span>
            </div>
            <div className="flex-shrink-0 w-12 h-12 bg-gray-100 rounded-lg overflow-hidden">
              {product.imageUrl ? (
                <img
                  src={product.imageUrl}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <Package className="w-6 h-6 text-gray-400" />
                </div>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-gray-900 truncate">
                {product.name}
              </p>
              <p className="text-sm text-gray-500">
                {product.totalSold} vendus • {product.orderCount} commandes
              </p>
            </div>
            <div className="text-right">
              <p className="font-semibold text-gray-900">
                {product.totalRevenue.toFixed(2)}€
              </p>
              <p className="text-xs text-gray-500">revenus</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
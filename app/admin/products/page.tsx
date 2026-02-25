'use client';

import { useState, useEffect } from 'react';
import { Package, Plus, Search, Edit2, Trash2, Eye, EyeOff, AlertTriangle, Image } from 'lucide-react';
import ProductModal from './ProductModal';
import { ExchangeRateManager } from '@/components/admin/ExchangeRateManager'

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  brand: string;
  specifications: Record<string, unknown>;
  images: Array<{url: string, is_primary: boolean}>
  image_url: string;
  stock_quantity: number;
  stock_threshold: number;
  is_available: boolean;
  created_at: string;
  updated_at: string;
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);



  


   
  

  const loadProducts = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/products', {
        credentials: 'include',
      });

      if (!response.ok) throw new Error('Erreur de chargement');

      const data = await response.json();
      setProducts(data.products || []);
    } catch (err) {
      console.error('Erreur:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);


  const handleDelete = async (id: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce produit ?')) return;

    try {
      const response = await fetch(`/api/admin/products/${id}`, {
        method: 'DELETE',
        credentials: 'include',
      });

      if (!response.ok) throw new Error('Erreur de suppression');

      loadProducts();
    } catch (err) {
      console.error('Erreur:', err);
      alert('Erreur lors de la suppression');
    }
  };

  const handleToggleAvailable = async (product: Product) => {
    try {
      const response = await fetch(`/api/admin/products/${product.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ is_available: !product.is_available }),
      });

      if (!response.ok) throw new Error('Erreur de mise à jour');

      loadProducts();
    } catch (err) {
      console.error('Erreur:', err);
      alert('Erreur lors de la mise à jour');
    }
  };

  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.brand?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || product.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const getCategoryLabel = (category: string) => {
    const labels: Record<string, string> = {
      smartphones: '📱 Smartphones',
      laptops: '💻 Laptops',
      accessories: '🎧 Accessoires',
      tablets: '📲 Tablettes',
    };
    return labels[category] || category;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Chargement des produits...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
                  <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Gestion du taux de change</h1>
      
      <ExchangeRateManager 
        mode="edit" 
        showHistory={true} 
      />
    </div>
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-blue-100 rounded-lg">
                <Package className="w-6 h-6 text-blue-600" />
              </div>
              
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Gestion des produits</h1>
                <p className="text-sm text-gray-500">{products.length} produit(s) au total</p>
              </div>


  
            </div>
   
            <button
              onClick={() => {
                setEditingProduct(null);
                setModalOpen(true);
              }}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="w-5 h-5" />
              Nouveau produit
            </button>
          </div>
        </div>

        {/* Filtres */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Rechercher un produit..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">Toutes les catégories</option>
              <option value="smartphones">📱 Smartphones</option>
              <option value="laptops">💻 Laptops</option>
              <option value="accessories">🎧 Accessoires</option>
              <option value="tablets">📲 Tablettes</option>
            </select>
          </div>
        </div>

        {/* Liste des produits */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map((product) => (
            <div key={product.id} className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow">
  {/* Image */}
  <div className="h-48 bg-gray-200 relative">
    {(product.images?.find(img => img.is_primary)?.url || product.images?.[0]?.url || product.image_url) ? (
      <img 
      src={product.images?.find(img => img.is_primary)?.url || product.images?.[0]?.url || product.image_url} 
      alt={product.name} 
      className="w-full h-full object-cover" 
    />
    ) : (
      <div className="w-full h-full flex items-center justify-center">
        <Package className="w-16 h-16 text-gray-400" />
      </div>
    )}
                {!product.is_available && (
                  <div className="absolute top-2 right-2 px-2 py-1 bg-red-500 text-white text-xs rounded">
                    Indisponible
                  </div>
                )}
                {product.stock_quantity <= product.stock_threshold && (
                  <div className="absolute top-2 left-2 px-2 py-1 bg-orange-500 text-white text-xs rounded flex items-center gap-1">
                    <AlertTriangle className="w-3 h-3" />
                    Stock faible
                  </div>
                )}
              </div>

              {/* Contenu */}
              <div className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg text-gray-900">{product.name}</h3>
                    {product.brand && (
                      <p className="text-xs text-gray-500">{product.brand}</p>
                    )}
                  </div>
                  <span className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded">
                    {getCategoryLabel(product.category)}
                  </span>
                </div>
                
                <p className="text-gray-600 text-sm line-clamp-2 mb-3">
                  {product.description || 'Aucune description'}
                </p>
                
                <div className="flex items-center justify-between mb-3">
                  <span className="text-lg font-bold text-blue-600">
                    {(product.price / 100).toFixed(2)} fc
                  </span>
                  <span className={`text-sm ${product.stock_quantity > product.stock_threshold ? 'text-green-600' : 'text-orange-600'}`}>
                    Stock: {product.stock_quantity}
                  </span>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleToggleAvailable(product)}
                    className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg transition-colors text-sm ${
                      product.is_available
                        ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        : 'bg-green-100 text-green-700 hover:bg-green-200'
                    }`}
                  >
                    {product.is_available ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    {product.is_available ? 'Masquer' : 'Activer'}
                  </button>
                  <button
                    onClick={() => {
                      setEditingProduct(product);
                      setModalOpen(true);
                    }}
                    className="p-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(product.id)}
                    className="p-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredProducts.length === 0 && (
          <div className="text-center py-12">
            <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">Aucun produit trouvé</p>
          </div>
        )}
      </div>

      {/* Modal d'ajout/modification */}
      {modalOpen && (
        <ProductModal
          product={editingProduct}
          onClose={() => {
            setModalOpen(false);
            setEditingProduct(null);
          }}
          onSave={() => {
            setModalOpen(false);
            setEditingProduct(null);
            loadProducts();
          }}
        />
      )}
    </div>
  );
}
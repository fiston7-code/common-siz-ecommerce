'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import StatsCard from '@/components/admin/StatsCard';
import RevenueChart from '@/components/admin/RevenueChart';
import PopularProducts from '@/components/admin/PopularProducts';
import LowStockAlert from '@/components/admin/LowStockAlert';
import RecentOrders from '@/components/admin/RecentOrders';
import {
  ShoppingCart,
  DollarSign,
  Package,
  Clock,
} from 'lucide-react';

// ✅ Types adaptés aux composants
interface PopularProduct {
  id: string;
  name: string;
  price: number;
  imageUrl?: string;
  orderCount: number;
  totalSold: number;
  totalRevenue: number;
}

interface LowStockProduct {
  id: string;
  name: string;
  stock: number;
  stockQuantity: number;
  stockThreshold: number;
  price: number;
  imageUrl?: string;
  category: string;  // ✅ Rendu obligatoire
}

interface RecentOrder {
  id: string;
  order_number: string;
  customer_name: string;
  customer_email: string;
  total_price: number;
  status: string;
  created_at: string;
  items_count?: number;
}

interface OrderStatus {
  status: string;
  count: number;
}

interface DashboardData {
  stats: {
    totalOrders: number;
    pendingOrders: number;
    completedOrders: number;
    totalProducts: number;
    totalRevenue: number;
    monthlyRevenue: number;
    lowStockProducts: number;
  };
  revenueByDay: Array<{
    date: string;
    revenue: number;
    ordersCount: number;
  }>;
  popularProducts: PopularProduct[];
  lowStockProducts: LowStockProduct[];
  recentOrders: RecentOrder[];
  ordersByStatus: OrderStatus[];
}

export default function AdminDashboardPage() {
  const router = useRouter();
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      const response = await fetch('/api/admin/dashboard', {
        credentials: 'include',
      });

      if (response.status === 401) {
        router.push('/admin/login');
        return;
      }

      if (!response.ok) {
        throw new Error('Erreur de chargement');
      }

      const dashboardData = await response.json();
      setData(dashboardData);
    } catch (error) {
      console.error('Erreur:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement du tableau de bord...</p>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-600">Erreur de chargement des données</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Tableau de bord
          </h1>
          <p className="text-gray-600 mt-1">
            Vue d'ensemble de votre boutique
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatsCard
            title="Revenus totaux"
            value={`${data.stats.totalRevenue.toLocaleString('fr-FR')} FC`}
            icon={DollarSign}
            iconColor="text-green-600"
            iconBgColor="bg-green-100"
          />
          <StatsCard
            title="Commandes totales"
            value={data.stats.totalOrders}
            icon={ShoppingCart}
            iconColor="text-blue-600"
            iconBgColor="bg-blue-100"
          />
          <StatsCard
            title="Commandes en attente"
            value={data.stats.pendingOrders}
            icon={Clock}
            iconColor="text-yellow-600"
            iconBgColor="bg-yellow-100"
          />
          <StatsCard
            title="Produits"
            value={data.stats.totalProducts}
            icon={Package}
            iconColor="text-purple-600"
            iconBgColor="bg-purple-100"
          />
        </div>

        {/* Revenue Chart */}
        <div className="mb-8">
          <RevenueChart data={data.revenueByDay} />
        </div>

        {/* Grid 2 colonnes */}
       <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
  <PopularProducts products={data.popularProducts as any[]} /> 
  <LowStockAlert products={data.lowStockProducts as any[]} />
</div>

        {/* Recent Orders */}
        <RecentOrders orders={data.recentOrders as any[]} />
      </div>
    </div>
  );
}



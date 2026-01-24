import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/db';
import { verifyToken } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get('admin_token')?.value;
    
    if (!token) {
      return NextResponse.json({ error: 'Non authentifié' }, { status: 401 });
    }

    const payload = verifyToken(token);
    if (!payload) {
      return NextResponse.json({ error: 'Token invalide' }, { status: 401 });
    }

    // 1. STATISTIQUES GÉNÉRALES
    const [
      { count: totalOrders },
      { count: pendingOrders },
      { count: completedOrders },
      { count: totalProducts },
      { count: lowStockProducts },
    ] = await Promise.all([
      supabaseAdmin.from('orders').select('*', { count: 'exact', head: true }),
      supabaseAdmin.from('orders').select('*', { count: 'exact', head: true }).eq('status', 'pending'),
      supabaseAdmin.from('orders').select('*', { count: 'exact', head: true }).eq('status', 'completed'),
      supabaseAdmin.from('products').select('*', { count: 'exact', head: true }),
      supabaseAdmin.from('products').select('*', { count: 'exact', head: true }).filter('stock_quantity', 'lte', 'stock_threshold'),
    ]);

    // Revenus totaux
    const { data: completedOrdersData } = await supabaseAdmin
      .from('orders')
      .select('total_price')
      .eq('status', 'completed');

    const totalRevenue = completedOrdersData?.reduce((sum, order) => sum + (order.total_price || 0), 0) || 0;

    // Revenus mensuels (30 derniers jours)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const { data: monthlyOrdersData } = await supabaseAdmin
      .from('orders')
      .select('total_price')
      .eq('status', 'completed')
      .gte('created_at', thirtyDaysAgo.toISOString());

    const monthlyRevenue = monthlyOrdersData?.reduce((sum, order) => sum + (order.total_price || 0), 0) || 0;

    // 2. REVENUS PAR JOUR (30 derniers jours)
    const { data: revenueData } = await supabaseAdmin
      .from('orders')
      .select('created_at, total_price')
      .eq('status', 'completed')
      .gte('created_at', thirtyDaysAgo.toISOString())
      .order('created_at', { ascending: true });

    // Grouper par jour
    const revenueByDay = (revenueData || []).reduce((acc: any[], order) => {
      const date = new Date(order.created_at).toISOString().split('T')[0];
      const existing = acc.find(item => item.date === date);
      
      if (existing) {
        existing.revenue += order.total_price || 0;
        existing.ordersCount += 1;
      } else {
        acc.push({
          date,
          revenue: order.total_price || 0,
          ordersCount: 1,
        });
      }
      
      return acc;
    }, []);

    // 3. PRODUITS POPULAIRES (Top 5)
    const { data: orderItemsData } = await supabaseAdmin
      .from('order_items')
      .select(`
        product_id,
        quantity,
        price,
        order_id,
        orders!inner (
          status
        )
      `)
      .eq('orders.status', 'completed');

    // Grouper par produit
    const productStats = (orderItemsData || []).reduce((acc: any, item) => {
      if (!acc[item.product_id]) {
        acc[item.product_id] = {
          productId: item.product_id,
          totalSold: 0,
          totalRevenue: 0,
          orderCount: 0,
        };
      }
      
      acc[item.product_id].totalSold += item.quantity;
      acc[item.product_id].totalRevenue += (item.price * item.quantity);
      acc[item.product_id].orderCount += 1;
      
      return acc;
    }, {});

    // Récupérer les détails des produits
    const topProductIds = Object.values(productStats)
      .sort((a: any, b: any) => b.totalSold - a.totalSold)
      .slice(0, 5)
      .map((p: any) => p.productId);

    const { data: topProductsDetails } = await supabaseAdmin
      .from('products')
      .select('id, name, image_url, price')
      .in('id', topProductIds);

    const popularProducts = topProductsDetails?.map(product => ({
      ...product,
      ...(productStats[product.id] || {}),
    })) || [];

    // 4. PRODUITS EN STOCK BAS
    const { data: lowStockData } = await supabaseAdmin
      .from('products')
      .select('id, name, image_url, stock_quantity, stock_threshold, category')
      .filter('stock_quantity', 'lte', 'stock_threshold')
      .order('stock_quantity', { ascending: true })
      .limit(10);

    // 5. COMMANDES RÉCENTES
    const { data: recentOrdersData } = await supabaseAdmin
      .from('orders')
      .select(`
        id,
        total_price,
        status,
        created_at,
        customer_name,
        customer_email,
        order_items (count)
      `)
      .order('created_at', { ascending: false })
      .limit(10);

    const recentOrders = recentOrdersData?.map(order => ({
      id: order.id,
      totalPrice: order.total_price,
      status: order.status,
      createdAt: order.created_at,
      customerName: order.customer_name,
      customerEmail: order.customer_email,
      itemsCount: order.order_items?.[0]?.count || 0,
    })) || [];

    // 6. RÉPARTITION PAR STATUT
    const { data: allOrders } = await supabaseAdmin
      .from('orders')
      .select('status, total_price');

    const ordersByStatus = (allOrders || []).reduce((acc: any[], order) => {
      const existing = acc.find(item => item.status === order.status);
      
      if (existing) {
        existing.count += 1;
        existing.totalAmount += order.total_price || 0;
      } else {
        acc.push({
          status: order.status,
          count: 1,
          totalAmount: order.total_price || 0,
        });
      }
      
      return acc;
    }, []);

    return NextResponse.json({
      stats: {
        totalOrders: totalOrders || 0,
        pendingOrders: pendingOrders || 0,
        completedOrders: completedOrders || 0,
        totalProducts: totalProducts || 0,
        totalRevenue,
        monthlyRevenue,
        lowStockProducts: lowStockProducts || 0,
      },
      revenueByDay,
      popularProducts,
      lowStockProducts: lowStockData || [],
      recentOrders,
      ordersByStatus,
    });

  } catch (error) {
    console.error('Erreur GET dashboard:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des statistiques' },
      { status: 500 }
    );
  }
}
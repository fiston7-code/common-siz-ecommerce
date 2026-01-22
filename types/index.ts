export interface Admin {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'super_admin';
  is_active: boolean;
  last_login: string | null;
  created_at: string;
  updated_at: string;
}

export interface Product {
  id: string;
  name: string;
  description: string | null;
  price: number;
  category: string;
  image_url: string | null;
  stock: number;
  is_available: boolean;
  created_at: string;
  updated_at: string;
}

export interface Order {
  id: string;
  customer_name: string;
  customer_phone: string;
  delivery_address: string;
  delivery_zone: string;
  total_amount: number;
  status: 'pending' | 'confirmed' | 'preparing' | 'out_for_delivery' | 'delivered' | 'cancelled';
  payment_method: 'cash' | 'mobile_money';
  notes: string | null;
  created_at: string;
  updated_at: string;
  items?: OrderItem[];
}

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string;
  quantity: number;
  unit_price: number;
  product?: Product;
}

export interface Stats {
  revenue: {
    today: number;
    week: number;
    month: number;
    total: number;
  };
  orders: {
    pending: number;
    confirmed: number;
    delivered_this_month: number;
    total: number;
  };
  products: {
    total: number;
    out_of_stock: number;
  };
  top_products: Array<{
    product_id: string;
    product_name: string;
    total_quantity: number;
    total_revenue: number;
  }>;
}
import {
  Product,
  Order,
  Enquiry,
  AdminUser,
  DashboardStats,
  ProductCategory,
  OrderStatus,
  PaymentMethod,
  PaymentStatus,
} from '../types';

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

const authHeaders = (token?: string) => {
  const authToken = token || localStorage.getItem('ponivraa_admin_token') || '';
  return {
    'Content-Type': 'application/json',
    ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}),
  };
};

export const api = {
  // PRODUCTS
  async getProducts(category?: ProductCategory | 'All', search?: string, includeHidden = false): Promise<Product[]> {
    const params = new URLSearchParams();
    if (category && category !== 'All') params.append('category', category);
    if (search) params.append('search', search);
    if (includeHidden) params.append('includeHidden', 'true');

    const res = await fetch(`${API_BASE}/products?${params.toString()}`);
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to fetch products');
    return data.data || [];
  },

  async getProductById(id: string): Promise<Product> {
    const res = await fetch(`${API_BASE}/products/${id}`);
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to fetch product');
    return data.data;
  },

  async createProduct(productData: Partial<Product>, token?: string): Promise<Product> {
    const res = await fetch(`${API_BASE}/products`, {
      method: 'POST',
      headers: authHeaders(token),
      body: JSON.stringify(productData),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to create product');
    return data.data;
  },

  async updateProduct(id: string, productData: Partial<Product>, token?: string): Promise<Product> {
    const res = await fetch(`${API_BASE}/products/${id}`, {
      method: 'PUT',
      headers: authHeaders(token),
      body: JSON.stringify(productData),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to update product');
    return data.data;
  },

  async deleteProduct(id: string, token?: string): Promise<void> {
    const res = await fetch(`${API_BASE}/products/${id}`, {
      method: 'DELETE',
      headers: authHeaders(token),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to delete product');
  },

  // IMAGE UPLOAD
  async uploadImage(file: File, token?: string): Promise<string> {
    const formData = new FormData();
    formData.append('image', file);

    const authToken = token || localStorage.getItem('ponivraa_admin_token') || '';
    const res = await fetch(`${API_BASE}/upload`, {
      method: 'POST',
      headers: authToken ? { Authorization: `Bearer ${authToken}` } : {},
      body: formData,
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Image upload failed');
    return data.url;
  },

  // ORDERS
  async createOrder(orderPayload: {
    customerName: string;
    phone: string;
    email?: string;
    address: string;
    pincode: string;
    products: Array<{ productId?: string; name: string; category?: string; selectedVariant?: string; price: number; quantity: number; image?: string }>;
    totalAmount: number;
    paymentMethod?: PaymentMethod;
    notes?: string;
  }): Promise<{ order: Order; whatsappUrl: string }> {
    const res = await fetch(`${API_BASE}/orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(orderPayload),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to place order');
    return { order: data.data, whatsappUrl: data.whatsappUrl };
  },

  async submitPaymentVerification(
    orderId: string,
    payload: {
      transactionId: string;
      paymentMethod?: PaymentMethod;
      paymentNotes?: string;
    }
  ): Promise<{ order: Order; whatsappUrl: string }> {
    const res = await fetch(`${API_BASE}/orders/${encodeURIComponent(orderId)}/verify-payment`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to submit payment verification');
    return { order: data.data, whatsappUrl: data.whatsappUrl };
  },

  async updatePaymentStatus(id: string, paymentStatus: PaymentStatus, token?: string): Promise<Order> {
    const res = await fetch(`${API_BASE}/orders/${id}/payment-status`, {
      method: 'PATCH',
      headers: authHeaders(token),
      body: JSON.stringify({ paymentStatus }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to update payment status');
    return data.data;
  },

  async trackOrder(query: string): Promise<Order[]> {
    const res = await fetch(`${API_BASE}/orders/track?query=${encodeURIComponent(query)}`);
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Order not found');
    return data.data || [];
  },

  async getAllOrders(status?: string, search?: string, token?: string): Promise<Order[]> {
    const params = new URLSearchParams();
    if (status && status !== 'All') params.append('status', status);
    if (search) params.append('search', search);

    const res = await fetch(`${API_BASE}/orders?${params.toString()}`, {
      headers: authHeaders(token),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to fetch orders');
    return data.data || [];
  },

  async updateOrderStatus(id: string, status: OrderStatus, token?: string): Promise<Order> {
    const res = await fetch(`${API_BASE}/orders/${id}/status`, {
      method: 'PATCH',
      headers: authHeaders(token),
      body: JSON.stringify({ status }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to update order status');
    return data.data;
  },

  async deleteOrder(id: string, token?: string): Promise<void> {
    const res = await fetch(`${API_BASE}/orders/${id}`, {
      method: 'DELETE',
      headers: authHeaders(token),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to delete order');
  },

  async getDashboardStats(token?: string): Promise<DashboardStats> {
    const res = await fetch(`${API_BASE}/orders/dashboard/stats`, {
      headers: authHeaders(token),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to fetch dashboard stats');
    return data.data;
  },

  // ENQUIRIES
  async createEnquiry(payload: { name: string; phone: string; email: string; message: string }): Promise<Enquiry> {
    const res = await fetch(`${API_BASE}/enquiries`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to submit enquiry');
    return data.data;
  },

  async getAllEnquiries(token?: string): Promise<{ enquiries: Enquiry[]; unreadCount: number }> {
    const res = await fetch(`${API_BASE}/enquiries`, {
      headers: authHeaders(token),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to fetch enquiries');
    return { enquiries: data.data || [], unreadCount: data.unreadCount || 0 };
  },

  async toggleEnquiryRead(id: string, isRead: boolean, token?: string): Promise<Enquiry> {
    const res = await fetch(`${API_BASE}/enquiries/${id}/read`, {
      method: 'PATCH',
      headers: authHeaders(token),
      body: JSON.stringify({ isRead }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to toggle enquiry');
    return data.data;
  },

  async deleteEnquiry(id: string, token?: string): Promise<void> {
    const res = await fetch(`${API_BASE}/enquiries/${id}`, {
      method: 'DELETE',
      headers: authHeaders(token),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to delete enquiry');
  },

  // AUTH
  async loginAdmin(email: string, password: string): Promise<AdminUser> {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Invalid admin credentials');
    return data.data;
  },

  async getAdminMe(token?: string): Promise<AdminUser> {
    const res = await fetch(`${API_BASE}/auth/me`, {
      headers: authHeaders(token),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to fetch profile');
    return data.data;
  },
};


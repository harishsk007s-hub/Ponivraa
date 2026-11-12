export type ProductCategory = 'Mango' | 'Honey' | 'Guava';

export type HoneyWeight = '250 g' | '350 g' | '500 g' | '1 kg';

export interface ProductVariant {
  weight: HoneyWeight;
  price: number;
  stockQuantity: number;
  inStock: boolean;
}

export interface Product {
  _id: string;
  name: string;
  category: ProductCategory;
  price: number;
  description: string;
  image: string;
  stockQuantity: number;
  variants?: ProductVariant[];
  inStock: boolean;
  isVisible: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedVariant?: string; // e.g. '500 g' or 'kg'
  unitPrice: number;
}

export interface OrderedProduct {
  productId?: string;
  name: string;
  category?: string;
  selectedVariant?: string;
  price: number;
  quantity: number;
  image?: string;
}

export type OrderStatus =
  | 'PENDING'
  | 'Placed'
  | 'Packed'
  | 'Shipped'
  | 'Out for Delivery'
  | 'Delivered'
  | 'Cancelled';

export type PaymentMethod = 'UPI' | 'Bank Transfer';
export type PaymentStatus = 'Pending Payment' | 'Payment Verification' | 'Paid';

export interface Order {
  _id: string;
  orderId: string;
  customerName: string;
  phone: string;
  email?: string;
  address: string;
  pincode: string;
  products: OrderedProduct[];
  totalAmount: number;
  status: OrderStatus;
  paymentMethod?: PaymentMethod;
  paymentStatus?: PaymentStatus;
  transactionId?: string;
  paymentVerificationNotes?: string;
  notes?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface Enquiry {
  _id: string;
  name: string;
  phone: string;
  email: string;
  message: string;
  isRead: boolean;
  createdAt: string;
}

export interface AdminUser {
  _id: string;
  name: string;
  email: string;
  token?: string;
}

export interface DashboardStats {
  totalProducts: number;
  outOfStockProducts: number;
  totalOrders: number;
  pendingOrders: number;
  deliveredOrders: number;
  cancelledOrders: number;
  totalRevenue: number;
  recentOrders: Order[];
}

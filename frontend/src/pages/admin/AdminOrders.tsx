import React, { useEffect, useState } from 'react';
import {
  ShoppingBag,
  Search,
  Filter,
  Trash2,
  Calendar,
  Phone,
  MapPin,
  Clock,
  Package,
  MessageCircle,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  ExternalLink,
} from 'lucide-react';
import { Order, OrderStatus, PaymentStatus } from '../../types';
import { api } from '../../api';
import { useAuth } from '../../context/AuthContext';
import { getWhatsAppUrl } from '../../utils/whatsapp';

const STATUS_LIST: OrderStatus[] = [
  'Placed',
  'Packed',
  'Shipped',
  'Out for Delivery',
  'Delivered',
  'Cancelled',
];

const PAYMENT_STATUS_LIST: PaymentStatus[] = [
  'Pending Payment',
  'Payment Verification',
  'Paid',
];

export const AdminOrders: React.FC = () => {
  const { token } = useAuth();

  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Selected Order for detail modal
  const [activeOrder, setActiveOrder] = useState<Order | null>(null);

  const loadOrders = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await api.getAllOrders(
        statusFilter === 'All' ? undefined : statusFilter,
        searchQuery ? searchQuery : undefined,
        token || undefined
      );
      setOrders(data);
    } catch (err: any) {
      console.error('Failed to load orders:', err);
      setError(err.message || 'Error loading orders');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, [statusFilter, searchQuery]);

  const handleStatusChange = async (orderId: string, newStatus: OrderStatus) => {
    try {
      const updated = await api.updateOrderStatus(orderId, newStatus, token || undefined);
      setOrders((prev) =>
        prev.map((o) => (o._id === orderId ? { ...o, status: updated.status } : o))
      );
      if (activeOrder && activeOrder._id === orderId) {
        setActiveOrder({ ...activeOrder, status: updated.status });
      }
    } catch (err: any) {
      alert(`Status update failed: ${err.message}`);
    }
  };

  const handlePaymentStatusChange = async (orderId: string, newPaymentStatus: PaymentStatus) => {
    try {
      const updated = await api.updatePaymentStatus(orderId, newPaymentStatus, token || undefined);
      setOrders((prev) =>
        prev.map((o) => (o._id === orderId ? { ...o, paymentStatus: updated.paymentStatus } : o))
      );
      if (activeOrder && activeOrder._id === orderId) {
        setActiveOrder({ ...activeOrder, paymentStatus: updated.paymentStatus });
      }
    } catch (err: any) {
      alert(`Payment status update failed: ${err.message}`);
    }
  };

  const handleDelete = async (orderId: string, displayId: string) => {
    if (!window.confirm(`Delete order ${displayId}? This action cannot be reversed.`)) return;

    try {
      await api.deleteOrder(orderId, token || undefined);
      setOrders((prev) => prev.filter((o) => o._id !== orderId));
      if (activeOrder && activeOrder._id === orderId) {
        setActiveOrder(null);
      }
    } catch (err: any) {
      alert(`Delete order failed: ${err.message}`);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-darktext">
            Customer Orders
          </h1>
          <p className="text-xs text-gray-500 mt-0.5">
            Process packing, update delivery milestones, and coordinate dispatch
          </p>
        </div>

        <button
          onClick={loadOrders}
          className="p-2.5 rounded-xl bg-white border border-gray-200 text-gray-600 hover:text-primary hover:border-primary transition-colors text-xs font-semibold shadow-sm self-start sm:self-auto flex items-center gap-1.5"
        >
          <RefreshCw className="w-4 h-4" />
          <span>Refresh Orders</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Status Filters */}
        <div className="flex items-center flex-wrap gap-2 w-full md:w-auto">
          {['All', ...STATUS_LIST].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                statusFilter === st
                  ? 'bg-primary text-white shadow-sm'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {st}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative w-full md:w-64">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search Order ID, name, phone..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3.5 py-2 rounded-xl border border-gray-200 text-xs bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden">
        {loading ? (
          <div className="py-20 text-center space-y-2">
            <div className="w-8 h-8 border-3 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-xs text-gray-500">Loading orders...</p>
          </div>
        ) : error ? (
          <div className="p-8 text-center text-rose-700 text-xs font-bold">{error}</div>
        ) : orders.length === 0 ? (
          <div className="p-12 text-center text-gray-500 text-xs space-y-3">
            <ShoppingBag className="w-10 h-10 text-gray-300 mx-auto" />
            <p>No orders found matching the filter criteria.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-gray-50 text-gray-500 uppercase text-[10px] font-bold tracking-wider border-b border-gray-200">
                <tr>
                  <th className="py-3 px-4">Order ID & Date</th>
                  <th className="py-3 px-4">Customer</th>
                  <th className="py-3 px-4">Address / Pincode</th>
                  <th className="py-3 px-4">Crate Items</th>
                  <th className="py-3 px-4">Total Amount</th>
                  <th className="py-3 px-4">Payment</th>
                  <th className="py-3 px-4">Fulfillment Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 font-medium">
                {orders.map((o) => (
                  <tr key={o._id} className="hover:bg-gray-50 transition-colors">
                    {/* Order ID & Date */}
                    <td className="py-3.5 px-4">
                      <span className="font-mono font-bold text-primary block text-sm">
                        {o.orderId}
                      </span>
                      <span className="text-[10px] text-gray-400">
                        {new Date(o.createdAt).toLocaleDateString('en-IN', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                        })}
                      </span>
                    </td>

                    {/* Customer Info */}
                    <td className="py-3.5 px-4">
                      <span className="font-bold text-darktext block">{o.customerName}</span>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <span className="text-gray-500 text-[11px]">{o.phone}</span>
                        <a
                          href={`https://wa.me/91${o.phone.replace(/\D/g, '')}?text=${encodeURIComponent(
                            `Hello ${o.customerName}, this is Ponivraa Farm Dispatch regarding your order ${o.orderId}.`
                          )}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[#25D366] hover:scale-110 transition-transform"
                          title="Message Customer on WhatsApp"
                        >
                          <MessageCircle className="w-3.5 h-3.5 fill-[#25D366]" />
                        </a>
                      </div>
                    </td>

                    {/* Address */}
                    <td className="py-3.5 px-4 max-w-xs">
                      <p className="text-[11px] text-gray-600 line-clamp-1">{o.address}</p>
                      <span className="text-[10px] text-gray-400 font-mono">Pincode: {o.pincode}</span>
                    </td>

                    {/* Products */}
                    <td className="py-3.5 px-4">
                      <button
                        onClick={() => setActiveOrder(o)}
                        className="text-primary hover:underline text-xs font-bold block"
                      >
                        {o.products.length} fruit {o.products.length > 1 ? 'varieties' : 'variety'}
                      </button>
                      <span className="text-[10px] text-gray-400">
                        {o.products.map((p) => `${p.name} (${p.quantity}kg)`).join(', ')}
                      </span>
                    </td>

                    {/* Total Amount */}
                    <td className="py-3.5 px-4 font-extrabold text-accent text-sm">
                      Rs. {o.totalAmount}
                    </td>

                    {/* Payment Status Dropdown */}
                    <td className="py-3.5 px-4">
                      <select
                        value={o.paymentStatus || 'Pending Payment'}
                        onChange={(e) =>
                          handlePaymentStatusChange(o._id, e.target.value as PaymentStatus)
                        }
                        className={`text-xs font-bold rounded-lg px-2.5 py-1 border transition-colors ${
                          o.paymentStatus === 'Paid'
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-300'
                            : o.paymentStatus === 'Payment Verification'
                            ? 'bg-amber-50 text-amber-700 border-amber-300'
                            : 'bg-rose-50 text-rose-700 border-rose-300'
                        }`}
                      >
                        {PAYMENT_STATUS_LIST.map((pst) => (
                          <option key={pst} value={pst}>
                            {pst}
                          </option>
                        ))}
                      </select>
                      <div className="text-[10px] text-gray-400 mt-0.5">
                        {o.paymentMethod || 'UPI'}
                        {o.transactionId && ` • UTR: ${o.transactionId}`}
                      </div>
                    </td>

                    {/* Status Dropdown */}
                    <td className="py-3.5 px-4">
                      <select
                        value={o.status}
                        onChange={(e) =>
                          handleStatusChange(o._id, e.target.value as OrderStatus)
                        }
                        className={`text-xs font-bold rounded-lg px-2.5 py-1 border transition-colors ${
                          o.status === 'Delivered'
                            ? 'bg-lightgreen text-primary border-emerald-300'
                            : o.status === 'Cancelled'
                            ? 'bg-rose-50 text-rose-700 border-rose-300'
                            : 'bg-secondary text-primary border-yellow-300'
                        }`}
                      >
                        {STATUS_LIST.map((st) => (
                          <option key={st} value={st}>
                            {st}
                          </option>
                        ))}
                      </select>
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => setActiveOrder(o)}
                          className="px-2.5 py-1 rounded-lg text-primary bg-lightgreen hover:bg-emerald-200 text-xs font-bold"
                        >
                          Details
                        </button>
                        <button
                          onClick={() => handleDelete(o._id, o.orderId)}
                          className="p-1.5 rounded-lg text-gray-400 hover:text-rose-600 hover:bg-rose-50"
                          title="Delete Order"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ORDER DETAILS MODAL */}
      {activeOrder && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-darktext/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-gray-200 shadow-2xl max-w-xl w-full p-6 sm:p-8 space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-gray-100">
              <div>
                <span className="text-[10px] text-gray-400 uppercase font-bold tracking-wider block">
                  Order Details
                </span>
                <span className="font-mono text-xl font-bold text-primary">
                  {activeOrder.orderId}
                </span>
              </div>
              <button
                onClick={() => setActiveOrder(null)}
                className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100"
              >
                ✕
              </button>
            </div>

            {/* Customer Information */}
            <div className="bg-gray-50 rounded-2xl p-4 text-xs space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-400 font-semibold">Customer Name:</span>
                <span className="font-bold text-darktext">{activeOrder.customerName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400 font-semibold">Phone:</span>
                <span className="font-bold text-darktext">{activeOrder.phone}</span>
              </div>
              {activeOrder.email && (
                <div className="flex justify-between">
                  <span className="text-gray-400 font-semibold">Email:</span>
                  <span className="font-medium text-darktext">{activeOrder.email}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-gray-400 font-semibold">Delivery Address:</span>
                <span className="font-bold text-darktext text-right max-w-xs">{activeOrder.address}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400 font-semibold">Pincode:</span>
                <span className="font-bold text-darktext">{activeOrder.pincode}</span>
              </div>
              {activeOrder.notes && (
                <div className="flex justify-between pt-1 border-t border-gray-200">
                  <span className="text-gray-400 font-semibold">Customer Note:</span>
                  <span className="font-medium text-primary">{activeOrder.notes}</span>
                </div>
              )}
            </div>

            {/* Payment Information */}
            <div className="bg-lightgreen/20 border border-lightgreen-border rounded-2xl p-4 text-xs space-y-2">
              <span className="text-[10px] font-bold text-primary uppercase tracking-wider block">
                Payment Verification Information
              </span>
              <div className="flex justify-between">
                <span className="text-gray-500 font-medium">Payment Mode:</span>
                <span className="font-bold text-darktext">{activeOrder.paymentMethod || 'UPI'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500 font-medium">Payment Status:</span>
                <span
                  className={`font-bold px-2 py-0.5 rounded text-[11px] ${
                    activeOrder.paymentStatus === 'Paid'
                      ? 'bg-emerald-100 text-emerald-800'
                      : activeOrder.paymentStatus === 'Payment Verification'
                      ? 'bg-amber-100 text-amber-800'
                      : 'bg-rose-100 text-rose-800'
                  }`}
                >
                  {activeOrder.paymentStatus || 'Pending Payment'}
                </span>
              </div>
              {activeOrder.transactionId && (
                <div className="flex justify-between">
                  <span className="text-gray-500 font-medium">Transaction ID / UTR:</span>
                  <span className="font-mono font-bold text-darktext select-all">
                    {activeOrder.transactionId}
                  </span>
                </div>
              )}
              {activeOrder.paymentVerificationNotes && (
                <div className="flex justify-between">
                  <span className="text-gray-500 font-medium">Customer Notes:</span>
                  <span className="font-medium text-darktext">
                    {activeOrder.paymentVerificationNotes}
                  </span>
                </div>
              )}
            </div>

            {/* Ordered Fruit Items */}
            <div className="space-y-3">
              <h4 className="font-bold text-xs uppercase tracking-wider text-gray-500">
                Ordered Produce
              </h4>
              <div className="divide-y divide-gray-100 bg-cream rounded-2xl p-4">
                {activeOrder.products.map((item, idx) => (
                  <div key={idx} className="py-2.5 flex items-center justify-between text-xs">
                    <div>
                      <span className="font-bold text-darktext block">{item.name}</span>
                      <span className="text-gray-500">{item.quantity} kg @ Rs. {item.price}/kg</span>
                    </div>
                    <span className="font-bold text-darktext">
                      Rs. {item.price * item.quantity}
                    </span>
                  </div>
                ))}
                <div className="pt-3 flex justify-between items-center text-sm font-extrabold text-darktext">
                  <span>Total Amount</span>
                  <span className="text-accent text-base">Rs. {activeOrder.totalAmount}</span>
                </div>
              </div>
            </div>

            {/* Status Update Quick Selectors Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5 uppercase tracking-wide">
                  Fulfillment Status
                </label>
                <select
                  value={activeOrder.status}
                  onChange={(e) =>
                    handleStatusChange(activeOrder._id, e.target.value as OrderStatus)
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs font-bold focus:ring-2 focus:ring-primary focus:outline-none bg-white"
                >
                  {STATUS_LIST.map((st) => (
                    <option key={st} value={st}>
                      {st}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5 uppercase tracking-wide">
                  Payment Status
                </label>
                <select
                  value={activeOrder.paymentStatus || 'Pending Payment'}
                  onChange={(e) =>
                    handlePaymentStatusChange(activeOrder._id, e.target.value as PaymentStatus)
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs font-bold focus:ring-2 focus:ring-primary focus:outline-none bg-white"
                >
                  {PAYMENT_STATUS_LIST.map((pst) => (
                    <option key={pst} value={pst}>
                      {pst}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
              <a
                href={`https://wa.me/91${activeOrder.phone.replace(/\D/g, '')}?text=${encodeURIComponent(
                  `Hello ${activeOrder.customerName}, Ponivraa Farm here! Your order ${activeOrder.orderId} is currently ${activeOrder.status}.`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs text-[#25D366] font-bold hover:underline"
              >
                <MessageCircle className="w-4 h-4 fill-[#25D366]" />
                <span>Message Customer on WhatsApp</span>
              </a>

              <button
                onClick={() => setActiveOrder(null)}
                className="px-4 py-2 bg-primary text-white text-xs font-bold rounded-xl"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};


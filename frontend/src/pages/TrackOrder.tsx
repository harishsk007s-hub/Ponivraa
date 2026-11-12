import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Search,
  Truck,
  Package,
  Calendar,
  Phone,
  MapPin,
  Clock,
  MessageCircle,
  AlertCircle,
  CheckCircle2,
  RefreshCw,
  CreditCard,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { Order } from '../types';
import { api } from '../api';
import { OrderTracker } from '../components/OrderTracker';
import { PaymentInstructions } from '../components/PaymentInstructions';
import { getWhatsAppUrl, DISPLAY_PHONE } from '../utils/whatsapp';

export const TrackOrder: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialQuery = searchParams.get('query') || '';

  const [query, setQuery] = useState(initialQuery);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [searched, setSearched] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async (searchStr?: string) => {
    const q = (searchStr !== undefined ? searchStr : query).trim();
    if (!q) {
      setError('Please enter your Order ID (e.g. PON-...) or 10-digit Phone Number');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      setSearched(true);
      const results = await api.trackOrder(q);
      setOrders(results);

      // Update URL query param
      setSearchParams({ query: q });
    } catch (err: any) {
      console.error('Tracking search error:', err);
      setOrders([]);
      setError(err.message || `No orders found for "${q}". Please check your Order ID or phone number.`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (initialQuery) {
      handleSearch(initialQuery);
    }
  }, []);

  return (
    <div className="min-h-screen bg-cream py-10 sm:py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto space-y-3 mb-10">
          <div className="inline-flex items-center gap-1.5 bg-lightgreen text-primary text-xs font-bold px-3 py-1 rounded-full border border-lightgreen-border uppercase tracking-wider">
            <Truck className="w-3.5 h-3.5 text-accent" />
            <span>Farm Dispatch Tracker</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-darktext">
            Track Your Farm Produce Order
          </h1>
          <p className="text-xs sm:text-sm text-gray-600 leading-relaxed font-light">
            Enter your Order ID (e.g. PON-20261029-XXXX) or registered phone number to track packing, shipping, and delivery status.
          </p>
        </div>

        {/* Search Input Box */}
        <div className="bg-white p-5 sm:p-7 rounded-3xl border border-gray-200 shadow-sm mb-10">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSearch();
            }}
            className="flex flex-col sm:flex-row gap-3"
          >
            <div className="relative flex-1">
              <Search className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                required
                placeholder="Enter Order ID or 10-digit Phone Number"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3.5 rounded-2xl border border-gray-200 bg-cream text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:bg-white transition-all font-medium"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="bg-primary hover:bg-primary-hover text-white font-bold text-sm px-8 py-3.5 rounded-2xl shadow transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Searching...</span>
                </>
              ) : (
                <>
                  <Search className="w-4 h-4" />
                  <span>Track Status</span>
                </>
              )}
            </button>
          </form>

          {/* Quick Demo Hint */}
          <div className="mt-3 flex items-center justify-between text-[11px] text-gray-400">
            <span>Example: Try demo ID <button type="button" onClick={() => { setQuery('PON-DEMO-001'); handleSearch('PON-DEMO-001'); }} className="text-primary font-bold underline">PON-DEMO-001</button></span>
            <span>Alagarkovil Dispatch Hub</span>
          </div>
        </div>

        {/* Results Section */}
        {error && (
          <div className="bg-rose-50 border border-rose-200 rounded-2xl p-6 text-center space-y-3 mb-8">
            <div className="w-10 h-10 bg-rose-100 text-rose-700 rounded-full flex items-center justify-center mx-auto">
              <AlertCircle className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-sm text-rose-900">Order Not Located</h3>
            <p className="text-xs text-rose-700 max-w-md mx-auto">{error}</p>
            <div className="pt-2">
              <a
                href={getWhatsAppUrl(`Hello Ponivraa, I am trying to track my order for: ${query}`)}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs text-accent font-bold hover:underline"
              >
                <MessageCircle className="w-3.5 h-3.5" />
                <span>Contact WhatsApp Support for Assistance</span>
              </a>
            </div>
          </div>
        )}

        {searched && orders.length > 0 && (
          <div className="space-y-8">
            {orders.map((order) => (
              <div
                key={order._id}
                className="bg-white rounded-3xl border border-gray-200 shadow-sm p-6 sm:p-8 space-y-6"
              >
                {/* Order Top Bar */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-gray-100">
                  <div>
                    <span className="text-[11px] text-gray-400 uppercase font-bold tracking-wider block">
                      Order Reference
                    </span>
                    <span className="font-mono text-xl sm:text-2xl font-extrabold text-primary">
                      {order.orderId}
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                    <span className="text-xs text-gray-500 flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" />
                      <span>{new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                    </span>

                    {/* Order Fulfillment Status */}
                    <span className="bg-secondary text-primary font-bold text-xs px-3 py-1 rounded-full border border-yellow-300">
                      {order.status}
                    </span>

                    {/* Payment Status Badge */}
                    {order.paymentStatus === 'Paid' ? (
                      <span className="bg-emerald-50 text-emerald-700 font-bold text-xs px-3 py-1 rounded-full border border-emerald-300 flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Paid</span>
                      </span>
                    ) : order.paymentStatus === 'Payment Verification' ? (
                      <span className="bg-amber-50 text-amber-700 font-bold text-xs px-3 py-1 rounded-full border border-amber-300 flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-amber-600" />
                        <span>Payment Verification</span>
                      </span>
                    ) : (
                      <span className="bg-rose-50 text-rose-700 font-bold text-xs px-3 py-1 rounded-full border border-rose-300 flex items-center gap-1">
                        <AlertCircle className="w-3.5 h-3.5 text-rose-600" />
                        <span>Pending Payment</span>
                      </span>
                    )}
                  </div>
                </div>

                {/* Visual Stepper Tracker */}
                <div className="py-2">
                  <h3 className="font-bold text-xs uppercase tracking-wider text-gray-400 mb-2">
                    Fulfillment Milestones
                  </h3>
                  <OrderTracker status={order.status} />
                </div>

                {/* Ordered Products Breakdown */}
                <div className="border-t border-gray-100 pt-6">
                  <h3 className="font-bold text-sm text-darktext mb-3 flex items-center gap-2">
                    <Package className="w-4 h-4 text-primary" />
                    <span>Harvest Crate Items</span>
                  </h3>
                  <div className="bg-cream rounded-2xl p-4 divide-y divide-gray-200">
                    {order.products.map((item, idx) => {
                      const isHoney = item.category === 'Honey' || (item.selectedVariant && item.selectedVariant !== 'kg');
                      const unitText = isHoney
                        ? (item.selectedVariant ? `${item.quantity} x ${item.selectedVariant}` : `${item.quantity} units`)
                        : `${item.quantity} kg`;
                      return (
                        <div key={idx} className="py-2.5 flex items-center justify-between text-xs">
                          <div className="flex items-center gap-3">
                            {item.image && (
                              <img
                                src={item.image}
                                alt={item.name}
                                className="w-10 h-10 rounded-lg object-cover bg-white border border-gray-200"
                              />
                            )}
                            <div>
                              <span className="font-bold text-darktext block">{item.name}</span>
                              <span className="text-gray-500">{unitText} @ ₹{item.price}</span>
                            </div>
                          </div>
                          <span className="font-extrabold text-darktext text-sm">
                            ₹{item.price * item.quantity}
                          </span>
                        </div>
                      );
                    })}

                    <div className="pt-3 flex justify-between items-center text-sm font-extrabold text-darktext">
                      <span>Total Invoice Amount</span>
                      <span className="text-accent text-lg">₹{order.totalAmount}</span>
                    </div>
                  </div>
                </div>

                {/* Payment & Transaction Information */}
                <div className="border-t border-gray-100 pt-6">
                  <div className="bg-cream rounded-2xl p-4 border border-gray-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                    <div>
                      <span className="font-bold text-darktext block mb-0.5">
                        Payment Method: {order.paymentMethod || 'UPI / QR Scanner'}
                      </span>
                      <p className="text-gray-500">
                        Status:{' '}
                        <strong
                          className={
                            order.paymentStatus === 'Paid'
                              ? 'text-emerald-700'
                              : order.paymentStatus === 'Payment Verification'
                              ? 'text-amber-700'
                              : 'text-rose-600'
                          }
                        >
                          {order.paymentStatus || 'Pending Payment'}
                        </strong>
                        {order.transactionId && (
                          <span className="ml-2 font-mono text-[11px] text-gray-700">
                            (Ref: {order.transactionId})
                          </span>
                        )}
                      </p>
                    </div>

                    {order.paymentStatus !== 'Paid' && (
                      <span className="text-[11px] font-bold text-primary bg-white px-3 py-1.5 rounded-xl border border-primary/20 shadow-xs">
                        Action Required: Complete Online Payment
                      </span>
                    )}
                  </div>

                  {/* If payment is not yet verified or paid, embed payment instructions */}
                  {order.paymentStatus !== 'Paid' && (
                    <div className="mt-4">
                      <PaymentInstructions
                        order={order}
                        onPaymentUpdated={(updated) => {
                          setOrders((prev) =>
                            prev.map((o) => (o._id === updated._id ? updated : o))
                          );
                        }}
                      />
                    </div>
                  )}
                </div>

                {/* Delivery Information */}
                <div className="border-t border-gray-100 pt-6 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-gray-600">
                  <div className="bg-gray-50 p-4 rounded-xl space-y-1">
                    <span className="font-bold text-darktext block mb-1">Customer Details</span>
                    <p className="font-medium text-darktext">{order.customerName}</p>
                    <p className="flex items-center gap-1.5 text-gray-500">
                      <Phone className="w-3.5 h-3.5 text-primary" />
                      <span>{order.phone}</span>
                    </p>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-xl space-y-1">
                    <span className="font-bold text-darktext block mb-1">Destination Address</span>
                    <p>{order.address}</p>
                    <p className="text-gray-500">Pincode: {order.pincode}</p>
                  </div>
                </div>

                {/* WhatsApp Dispatch Link */}
                <div className="pt-2 flex justify-end">
                  <a
                    href={getWhatsAppUrl(`Hello Ponivraa, regarding order ${order.orderId} (Status: ${order.status}), could you please share the delivery ETA?`)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-xs font-bold text-accent hover:underline"
                  >
                    <MessageCircle className="w-4 h-4 fill-accent" />
                    <span>Enquire ETA on WhatsApp ({DISPLAY_PHONE})</span>
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};


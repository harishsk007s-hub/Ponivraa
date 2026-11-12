import React, { useEffect, useState } from 'react';
import { useParams, useLocation, Link } from 'react-router-dom';
import {
  CheckCircle2,
  MessageCircle,
  Truck,
  Package,
  ShoppingBag,
  Clock,
  AlertCircle,
} from 'lucide-react';
import { Order } from '../types';
import { api } from '../api';
import { getOrderConfirmationWhatsAppUrl, DISPLAY_PHONE } from '../utils/whatsapp';
import { PaymentInstructions } from '../components/PaymentInstructions';

export const OrderConfirmation: React.FC = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const location = useLocation();

  const [order, setOrder] = useState<Order | null>(
    (location.state as any)?.order || null
  );
  const [whatsappUrl, setWhatsappUrl] = useState<string>(
    (location.state as any)?.whatsappUrl || ''
  );
  const [loading, setLoading] = useState<boolean>(!order);

  useEffect(() => {
    const fetchOrderDetails = async () => {
      if (order || !orderId) return;
      try {
        setLoading(true);
        const results = await api.trackOrder(orderId);
        if (results && results.length > 0) {
          setOrder(results[0]);
        }
      } catch (err) {
        console.error('Could not fetch order:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrderDetails();
  }, [orderId, order]);

  // Compute WhatsApp URL if not passed in location state
  const finalWhatsappUrl =
    whatsappUrl ||
    (order
      ? getOrderConfirmationWhatsAppUrl(
          order.orderId,
          order.customerName,
          order.phone,
          order.address,
          order.products.map((p) => ({
            name: p.name,
            quantity: p.quantity,
            price: p.price,
            category: p.category,
            selectedVariant: p.selectedVariant,
          })),
          order.totalAmount,
          order.pincode
        )
      : '');

  if (loading) {
    return (
      <div className="min-h-[70vh] bg-cream flex items-center justify-center p-4">
        <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream py-12 sm:py-16">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl border border-gray-200 shadow-md p-6 sm:p-10 space-y-8">
          {/* Top Success Badge */}
          <div className="text-center space-y-3">
            <div
              className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto shadow-inner ${
                order?.paymentStatus === 'Paid'
                  ? 'bg-lightgreen text-primary'
                  : order?.paymentStatus === 'Payment Verification'
                  ? 'bg-amber-100 text-amber-700'
                  : 'bg-orange-50 text-accent'
              }`}
            >
              {order?.paymentStatus === 'Paid' ? (
                <CheckCircle2 className="w-10 h-10 stroke-[2.2]" />
              ) : order?.paymentStatus === 'Payment Verification' ? (
                <Clock className="w-10 h-10 stroke-[2.2]" />
              ) : (
                <AlertCircle className="w-10 h-10 stroke-[2.2]" />
              )}
            </div>
            <span
              className={`inline-block text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full ${
                order?.paymentStatus === 'Paid'
                  ? 'bg-lightgreen text-primary'
                  : order?.paymentStatus === 'Payment Verification'
                  ? 'bg-amber-100 text-amber-800'
                  : 'bg-orange-100 text-accent'
              }`}
            >
              {order?.paymentStatus === 'Paid'
                ? 'Harvest Order Paid & Confirmed'
                : order?.paymentStatus === 'Payment Verification'
                ? 'Payment Under Verification'
                : 'Order Placed — Online Payment Required'}
            </span>
            <h1 className="font-serif text-3xl sm:text-4xl font-bold text-darktext">
              {order?.paymentStatus === 'Paid'
                ? 'Thank You for Supporting Local Farmers!'
                : order?.paymentStatus === 'Payment Verification'
                ? 'Payment Verification in Progress'
                : 'Complete Your Online Payment'}
            </h1>
            <p className="text-xs sm:text-sm text-gray-600 max-w-md mx-auto">
              {order?.paymentStatus === 'Paid'
                ? 'Your payment is confirmed. Our packing team in Alagarkovil is preparing your fruit and honey crate.'
                : 'To finalize your order, please complete the online payment via UPI or Bank Transfer below. No cash on delivery.'}
            </p>
          </div>

          {/* Highlighted Order ID Box */}
          <div className="bg-cream rounded-2xl p-5 border border-dashed border-primary/30 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wide block">
                Your Order ID
              </span>
              <span className="font-mono text-xl sm:text-2xl font-extrabold text-primary">
                {order?.orderId || orderId}
              </span>
            </div>
            <Link
              to={`/track-order?query=${order?.orderId || orderId}`}
              className="inline-flex items-center gap-1.5 bg-primary text-white text-xs font-bold px-4 py-2.5 rounded-xl hover:bg-primary-hover transition-colors shadow-sm cursor-pointer"
            >
              <Truck className="w-4 h-4" />
              <span>Track Live Status</span>
            </Link>
          </div>

          {/* ONLINE PAYMENT & VERIFICATION INSTRUCTIONS */}
          {order && (
            <PaymentInstructions
              order={order}
              onPaymentUpdated={(updatedOrder, newWhatsappUrl) => {
                setOrder(updatedOrder);
                if (newWhatsappUrl) setWhatsappUrl(newWhatsappUrl);
              }}
            />
          )}

          {/* WhatsApp Notification CTA Button */}
          <div className="bg-secondary/40 border border-secondary rounded-2xl p-5 text-center space-y-3">
            <h3 className="font-bold text-sm text-darktext">
              Share Order & Payment Screenshot on WhatsApp
            </h3>
            <p className="text-xs text-gray-600 max-w-md mx-auto">
              Send your order details and payment screenshot directly to our farm dispatch desk at {DISPLAY_PHONE} for priority dispatch.
            </p>
            {finalWhatsappUrl && (
              <a
                href={finalWhatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#1fb355] text-white font-bold text-sm px-6 py-3.5 rounded-xl shadow transition-transform transform active:scale-95 cursor-pointer"
              >
                <MessageCircle className="w-4 h-4 fill-white" />
                <span>Open Order in WhatsApp (+91 80982 02289)</span>
              </a>
            )}
          </div>

          {/* Order Summary Details */}
          {order && (
            <div className="border-t border-gray-100 pt-6 space-y-6">
              <h3 className="font-bold text-base text-darktext flex items-center gap-2">
                <Package className="w-4 h-4 text-primary" />
                <span>Package Breakdown</span>
              </h3>

              {/* Items Table */}
              <div className="bg-cream rounded-2xl p-4 border border-gray-100 divide-y divide-gray-200">
                {order.products.map((item, idx) => {
                  const isHoney = item.category === 'Honey' || (item.selectedVariant && item.selectedVariant !== 'kg');
                  const unitText = isHoney ? item.selectedVariant || 'Jar' : `${item.quantity} kg`;
                  return (
                    <div key={idx} className="py-2.5 flex items-center justify-between text-xs">
                      <div>
                        <span className="font-bold text-darktext block">{item.name}</span>
                        <span className="text-gray-500">
                          {unitText} @ ₹{item.price}
                        </span>
                      </div>
                      <span className="font-extrabold text-darktext text-sm">
                        ₹{item.price * item.quantity}
                      </span>
                    </div>
                  );
                })}

                <div className="pt-3 flex justify-between items-center text-sm font-extrabold text-darktext">
                  <span>Total Payable</span>
                  <span className="text-accent text-lg">₹{order.totalAmount}</span>
                </div>
              </div>

              {/* Delivery Meta */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-gray-600 bg-white p-4 rounded-xl border border-gray-100">
                <div>
                  <span className="font-bold text-darktext block mb-1">Customer & Contact</span>
                  <p>{order.customerName}</p>
                  <p className="text-gray-500">{order.phone}</p>
                </div>
                <div>
                  <span className="font-bold text-darktext block mb-1">Delivery Destination</span>
                  <p>{order.address}</p>
                  <p className="text-gray-500">Pincode: {order.pincode}</p>
                </div>
              </div>
            </div>
          )}

          {/* Back Home CTA */}
          <div className="text-center pt-4">
            <Link
              to="/products"
              className="inline-flex items-center gap-2 text-xs font-bold text-primary hover:underline cursor-pointer"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Continue Shopping Fresh Harvest</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

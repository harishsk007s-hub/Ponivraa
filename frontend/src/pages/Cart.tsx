import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ShoppingBag,
  Trash2,
  Plus,
  Minus,
  ArrowRight,
  Truck,
  Phone,
  User,
  MapPin,
  Mail,
  Home as HomeIcon,
  Building,
  QrCode,
  Copy,
  Check,
  Building2,
  Smartphone,
  ShieldCheck,
  AlertCircle,
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { api } from '../api';
import { PaymentMethod } from '../types';
import { getOrderConfirmationWhatsAppUrl } from '../utils/whatsapp';
import { PAYMENT_CONFIG } from '../utils/paymentConfig';

export const Cart: React.FC = () => {
  const { cart, updateQuantity, removeFromCart, totalAmount, clearCart } = useCart();
  const navigate = useNavigate();

  // Form Fields
  const [customerName, setCustomerName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [streetAddress, setStreetAddress] = useState('');
  const [city, setCity] = useState('');
  const [stateName, setStateName] = useState('Tamil Nadu');
  const [pincode, setPincode] = useState('');
  const [deliveryNote, setDeliveryNote] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('UPI');
  const [copiedField, setCopiedField] = useState<string | null>(null);

  // Validation Errors
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const handleCopy = (text: string, fieldName: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldName);
    setTimeout(() => setCopiedField(null), 2500);
  };

  const normalizePhone = (raw: string) => {
    let clean = raw.replace(/\D/g, '');
    if (clean.length === 12 && clean.startsWith('91')) {
      clean = clean.substring(2);
    } else if (clean.length === 11 && clean.startsWith('0')) {
      clean = clean.substring(1);
    }
    return clean;
  };

  // VALIDATION RULES
  const validateField = (field: string, val: string) => {
    switch (field) {
      case 'customerName':
        if (!val.trim()) return 'Customer name is required';
        break;
      case 'phone': {
        const clean = normalizePhone(val);
        if (!/^[6-9]\d{9}$/.test(clean)) {
          return 'Enter a valid 10-digit mobile number';
        }
        break;
      }
      case 'email':
        if (val.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val.trim())) {
          return 'Enter a valid email address';
        }
        break;
      case 'streetAddress':
        if (!val.trim() || val.trim().length < 3) {
          return 'Street / house address is required';
        }
        break;
      case 'city':
        if (!val.trim()) return 'City is required';
        break;
      case 'stateName':
        if (!val.trim()) return 'State is required';
        break;
      case 'pincode': {
        const cleanPin = val.replace(/\D/g, '');
        if (!/^[1-9]\d{5}$/.test(cleanPin)) {
          return 'Enter a valid 6-digit pincode';
        }
        break;
      }
      default:
        break;
    }
    return '';
  };

  const handleBlur = (field: string, val: string) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    const err = validateField(field, val);
    setErrors((prev) => ({ ...prev, [field]: err }));
  };

  const fullAddress = `${streetAddress.trim()}, ${city.trim()}, ${stateName.trim()}`;

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setServerError(null);

    // Validate all fields
    const nameErr = validateField('customerName', customerName);
    const phoneErr = validateField('phone', phone);
    const emailErr = validateField('email', email);
    const streetErr = validateField('streetAddress', streetAddress);
    const cityErr = validateField('city', city);
    const pinErr = validateField('pincode', pincode);

    const allErrors: Record<string, string> = {
      customerName: nameErr,
      phone: phoneErr,
      email: emailErr,
      streetAddress: streetErr,
      city: cityErr,
      pincode: pinErr,
    };

    setErrors(allErrors);
    setTouched({
      customerName: true,
      phone: true,
      email: true,
      streetAddress: true,
      city: true,
      pincode: true,
    });

    const hasErrors = Object.values(allErrors).some((err) => Boolean(err));
    if (hasErrors) {
      setServerError('Please fill in the required fields highlighted below to place your order.');
      return;
    }

    try {
      setIsSubmitting(true);

      const cleanPhone = normalizePhone(phone);
      const cleanPincode = pincode.replace(/\D/g, '');

      const orderPayload = {
        customerName: customerName.trim(),
        phone: cleanPhone,
        email: email.trim() ? email.trim() : undefined,
        address: fullAddress,
        pincode: cleanPincode,
        products: cart.map((item) => ({
          productId: item.product._id,
          name: item.product.name,
          category: item.product.category,
          selectedVariant: item.selectedVariant || 'kg',
          price: item.unitPrice || item.product.price,
          quantity: item.quantity,
          image: item.product.image,
        })),
        totalAmount,
        paymentMethod,
        notes: deliveryNote.trim(),
      };

      const result = await api.createOrder(orderPayload);

      // Generate WhatsApp order confirmation URL in React frontend using dynamic order details
      const whatsappUrl = getOrderConfirmationWhatsAppUrl(
        result.order.orderId,
        result.order.customerName,
        result.order.phone,
        result.order.address,
        result.order.products,
        result.order.totalAmount,
        result.order.pincode
      );

      // Clear cart
      clearCart();

      // Scroll smoothly to top and navigate to confirmation & payment page
      window.scrollTo({ top: 0, behavior: 'smooth' });
      navigate(`/order-confirmation/${result.order.orderId}`, {
        state: { order: result.order, whatsappUrl },
      });
    } catch (err: any) {
      console.error('Order placement failed:', err);
      setServerError(err.message || 'Failed to place order. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };


  return (
    <div className="min-h-screen bg-cream py-10 sm:py-14">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-darktext">
            Review Your Farm Basket
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">
            Free shipping across Tamil Nadu. Farm fresh harvest delivered straight to your door.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left: Cart Items List */}
          <div className="lg:col-span-7 space-y-4">
            <div className="bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden p-6">
              <h2 className="text-base font-bold text-darktext mb-4 pb-3 border-b border-gray-100 flex items-center justify-between">
                <span>Selected Produce ({cart.length} varieties)</span>
                <span className="text-xs text-primary font-semibold">100% Tree Ripened</span>
              </h2>

              <div className="divide-y divide-gray-100">
                {cart.map((item) => {
                  const cartKey = item.selectedVariant
                    ? `${item.product._id}__${item.selectedVariant}`
                    : item.product._id;
                  const itemPrice = item.unitPrice || item.product.price;
                  const isHoney = item.product.category === 'Honey';

                  return (
                    <div key={cartKey} className="py-4 flex gap-4 items-center">
                      <img
                        src={item.product.image}
                        alt={item.product.name}
                        className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl object-cover bg-cream border border-gray-100 shrink-0"
                      />

                      <div className="flex-1 min-w-0">
                        <Link
                          to={`/products/${item.product._id}`}
                          className="font-bold text-sm text-darktext hover:text-primary transition-colors block truncate"
                        >
                          {item.product.name}
                        </Link>

                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="text-xs text-gray-500">₹{itemPrice}</span>
                          {item.selectedVariant && (
                            <span className="text-[11px] font-bold text-accent bg-orange-50 px-2 py-0.5 rounded border border-orange-200">
                              {item.selectedVariant}
                            </span>
                          )}
                        </div>

                        {/* Quantity Stepper */}
                        <div className="flex items-center gap-3 mt-3">
                          <div className="flex items-center border border-gray-200 rounded-lg bg-cream px-1 py-0.5">
                            <button
                              type="button"
                              onClick={() => updateQuantity(cartKey, item.quantity - 1)}
                              className="p-1 text-gray-600 hover:text-primary transition-colors cursor-pointer"
                              aria-label="Decrease quantity"
                            >
                              <Minus className="w-3.5 h-3.5" />
                            </button>
                            <span className="w-9 text-center text-xs font-bold text-darktext">
                              {item.quantity} {isHoney ? 'Jar' : 'kg'}
                            </span>
                            <button
                              type="button"
                              onClick={() => updateQuantity(cartKey, item.quantity + 1)}
                              className="p-1 text-gray-600 hover:text-primary transition-colors cursor-pointer"
                              aria-label="Increase quantity"
                            >
                              <Plus className="w-3.5 h-3.5" />
                            </button>
                          </div>

                          <button
                            type="button"
                            onClick={() => removeFromCart(cartKey)}
                            className="text-gray-400 hover:text-rose-600 p-1 transition-colors cursor-pointer"
                            title="Remove item"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      <div className="text-right shrink-0">
                        <span className="text-sm sm:text-base font-extrabold text-accent">
                          ₹{itemPrice * item.quantity}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="bg-lightgreen border border-lightgreen-border rounded-2xl p-4 flex items-center gap-3 text-xs text-[#1B4332]">
              <Truck className="w-5 h-5 text-accent shrink-0" />
              <span>
                <strong>Free Delivery Across Tamil Nadu:</strong> Harvest packed with natural cushioning in safe fruit crates.
              </span>
            </div>
          </div>

          {/* Right: Customer Checkout Details Form */}
          <div className="lg:col-span-5">
            <div className="bg-white rounded-3xl border border-gray-200 shadow-sm p-6 sm:p-8 space-y-6">
              <h2 className="text-lg font-serif font-bold text-darktext pb-3 border-b border-gray-100">
                Customer Delivery Information
              </h2>

              {serverError && (
                <div className="bg-rose-50 border border-rose-200 text-rose-700 text-xs p-3 rounded-xl font-semibold">
                  {serverError}
                </div>
              )}

              <form onSubmit={handleSubmitOrder} className="space-y-4">
                {/* Full Name */}
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1 uppercase tracking-wide">
                    Full Name *
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      required
                      placeholder="e.g. Varsha Ramanathan"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      onBlur={() => handleBlur('customerName', customerName)}
                      className={`w-full pl-9 pr-3.5 py-2.5 rounded-xl border text-xs focus:ring-2 focus:ring-primary focus:outline-none ${
                        touched.customerName && errors.customerName
                          ? 'border-rose-400 bg-rose-50/20'
                          : 'border-gray-200'
                      }`}
                    />
                  </div>
                  {touched.customerName && errors.customerName && (
                    <span className="text-[11px] text-rose-600 mt-1 block font-medium">
                      {errors.customerName}
                    </span>
                  )}
                </div>

                {/* Phone Number */}
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1 uppercase tracking-wide">
                    Phone Number (10 Digits) *
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="tel"
                      required
                      maxLength={10}
                      placeholder="e.g. 9345468234"
                      value={phone}
                      onChange={(e) => {
                        const val = e.target.value.replace(/\D/g, '');
                        setPhone(val);
                      }}
                      onBlur={() => handleBlur('phone', phone)}
                      className={`w-full pl-9 pr-3.5 py-2.5 rounded-xl border text-xs focus:ring-2 focus:ring-primary focus:outline-none ${
                        touched.phone && errors.phone
                          ? 'border-rose-400 bg-rose-50/20'
                          : 'border-gray-200'
                      }`}
                    />
                  </div>
                  {touched.phone && errors.phone && (
                    <span className="text-[11px] text-rose-600 mt-1 block font-medium">
                      {errors.phone}
                    </span>
                  )}
                  <span className="text-[10px] text-gray-400 mt-0.5 block">
                    Must start with 6, 7, 8, or 9 (numbers only, no spaces or symbols).
                  </span>
                </div>

                {/* Email Address - Optional */}
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1 uppercase tracking-wide">
                    Email Address (Optional)
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="email"
                      placeholder="e.g. varsha@gmail.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      onBlur={() => handleBlur('email', email)}
                      className={`w-full pl-9 pr-3.5 py-2.5 rounded-xl border text-xs focus:ring-2 focus:ring-primary focus:outline-none ${
                        touched.email && errors.email
                          ? 'border-rose-400 bg-rose-50/20'
                          : 'border-gray-200'
                      }`}
                    />
                  </div>
                  {touched.email && errors.email && (
                    <span className="text-[11px] text-rose-600 mt-1 block font-medium">
                      {errors.email}
                    </span>
                  )}
                  <span className="text-[10px] text-gray-400 mt-0.5 block">
                    Optional: Order confirmation is sent directly to your phone & WhatsApp.
                  </span>
                </div>

                {/* House / Street Address */}
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1 uppercase tracking-wide">
                    House / Street Address *
                  </label>
                  <div className="relative">
                    <HomeIcon className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                    <textarea
                      required
                      rows={2}
                      placeholder="Flat/House No., Street name, Apartment / Landmark"
                      value={streetAddress}
                      onChange={(e) => setStreetAddress(e.target.value)}
                      onBlur={() => handleBlur('streetAddress', streetAddress)}
                      className={`w-full pl-9 pr-3.5 py-2 rounded-xl border text-xs focus:ring-2 focus:ring-primary focus:outline-none resize-none ${
                        touched.streetAddress && errors.streetAddress
                          ? 'border-rose-400 bg-rose-50/20'
                          : 'border-gray-200'
                      }`}
                    />
                  </div>
                  {touched.streetAddress && errors.streetAddress && (
                    <span className="text-[11px] text-rose-600 mt-1 block font-medium">
                      {errors.streetAddress}
                    </span>
                  )}
                </div>

                {/* City & State Grid */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1 uppercase tracking-wide">
                      City *
                    </label>
                    <div className="relative">
                      <Building className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        required
                        placeholder="e.g. Madurai"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        onBlur={() => handleBlur('city', city)}
                        className={`w-full pl-9 pr-3 py-2.5 rounded-xl border text-xs focus:ring-2 focus:ring-primary focus:outline-none ${
                          touched.city && errors.city
                            ? 'border-rose-400 bg-rose-50/20'
                            : 'border-gray-200'
                        }`}
                      />
                    </div>
                    {touched.city && errors.city && (
                      <span className="text-[11px] text-rose-600 mt-1 block font-medium">
                        {errors.city}
                      </span>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1 uppercase tracking-wide">
                      State *
                    </label>
                    <input
                      type="text"
                      required
                      value={stateName}
                      onChange={(e) => setStateName(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-xs focus:ring-2 focus:ring-primary focus:outline-none bg-gray-50 font-medium"
                    />
                  </div>
                </div>

                {/* Pincode */}
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1 uppercase tracking-wide">
                    Pincode (6 Digits) *
                  </label>
                  <div className="relative">
                    <MapPin className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      required
                      maxLength={6}
                      placeholder="e.g. 625002"
                      value={pincode}
                      onChange={(e) => {
                        const val = e.target.value.replace(/\D/g, '');
                        setPincode(val);
                      }}
                      onBlur={() => handleBlur('pincode', pincode)}
                      className={`w-full pl-9 pr-3.5 py-2.5 rounded-xl border text-xs focus:ring-2 focus:ring-primary focus:outline-none ${
                        touched.pincode && errors.pincode
                          ? 'border-rose-400 bg-rose-50/20'
                          : 'border-gray-200'
                      }`}
                    />
                  </div>
                  {touched.pincode && errors.pincode && (
                    <span className="text-[11px] text-rose-600 mt-1 block font-medium">
                      {errors.pincode}
                    </span>
                  )}
                </div>

                {/* Renamed Field: Special Note / Delivery Note */}
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Special Note / Delivery Note
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Please deliver in the morning"
                    value={deliveryNote}
                    onChange={(e) => setDeliveryNote(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-gray-200 text-xs focus:ring-2 focus:ring-primary focus:outline-none"
                  />
                </div>

                {/* Payment Method Selector - Online Payment Only (No COD) */}
                <div className="pt-4 border-t border-gray-100 space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide">
                      Online Payment Method *
                    </label>
                    <span className="text-[11px] font-bold text-rose-600 bg-rose-50 border border-rose-200 px-2.5 py-0.5 rounded-full">
                      No Cash on Delivery
                    </span>
                  </div>

                  <div className="space-y-2">
                    <label
                      className={`flex items-center gap-3 p-3 rounded-2xl border text-xs cursor-pointer transition-all ${
                        paymentMethod === 'UPI'
                          ? 'border-primary bg-primary/5 ring-1 ring-primary'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="UPI"
                        checked={paymentMethod === 'UPI'}
                        onChange={() => setPaymentMethod('UPI')}
                        className="text-primary focus:ring-primary h-4 w-4"
                      />
                      <div className="flex-1">
                        <span className="font-bold text-darktext block">
                          UPI / QR Code Scan & Pay
                        </span>
                        <span className="text-gray-500 text-[11px]">
                          Google Pay, PhonePe, Paytm, BHIM, CRED
                        </span>
                      </div>
                    </label>

                    <label
                      className={`flex items-center gap-3 p-3 rounded-2xl border text-xs cursor-pointer transition-all ${
                        paymentMethod === 'Bank Transfer'
                          ? 'border-primary bg-primary/5 ring-1 ring-primary'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="Bank Transfer"
                        checked={paymentMethod === 'Bank Transfer'}
                        onChange={() => setPaymentMethod('Bank Transfer')}
                        className="text-primary focus:ring-primary h-4 w-4"
                      />
                      <div className="flex-1">
                        <span className="font-bold text-darktext block">
                          Bank Transfer (NEFT / IMPS)
                        </span>
                        <span className="text-gray-500 text-[11px]">
                          ICICI Bank direct transfer
                        </span>
                      </div>
                    </label>
                  </div>

                  {/* Immediate Payment Details Preview on Checkout Screen */}
                  {paymentMethod === 'UPI' ? (
                    <div className="bg-[#F4FAF5] p-3.5 rounded-2xl border border-[#C8E6C9] space-y-2.5 text-xs">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5 font-bold text-[#1B4332]">
                          <QrCode className="w-4 h-4 text-primary" />
                          <span>Official Farm UPI Scanner</span>
                        </div>
                        <span className="text-[10px] bg-white border border-[#C8E6C9] text-primary px-2 py-0.5 rounded-md font-semibold">
                          Kishore M
                        </span>
                      </div>

                      <div className="flex items-center gap-3 bg-white p-2.5 rounded-xl border border-[#C8E6C9]">
                        <img
                          src={PAYMENT_CONFIG.qrImage}
                          alt="Ponivraa Farm QR Code"
                          className="w-16 h-16 object-contain rounded-lg border border-gray-100 shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <span className="text-[10px] text-gray-500 block uppercase font-bold">
                            UPI ID (Copy & Pay)
                          </span>
                          <span className="font-mono text-xs font-bold text-darktext block truncate">
                            {PAYMENT_CONFIG.upiId}
                          </span>
                          <button
                            type="button"
                            onClick={() => handleCopy(PAYMENT_CONFIG.upiId, 'upi-cart')}
                            className="inline-flex items-center gap-1 text-[11px] font-bold text-primary hover:underline mt-1 cursor-pointer"
                          >
                            {copiedField === 'upi-cart' ? (
                              <>
                                <Check className="w-3 h-3 text-emerald-600" />
                                <span className="text-emerald-600">Copied!</span>
                              </>
                            ) : (
                              <>
                                <Copy className="w-3 h-3" />
                                <span>Copy UPI ID</span>
                              </>
                            )}
                          </button>
                        </div>
                      </div>
                      <p className="text-[10px] text-[#2D5A32]">
                        Click <strong>Place Order & Pay Online</strong> to open the full payment verification and WhatsApp confirmation screen.
                      </p>
                    </div>
                  ) : (
                    <div className="bg-[#F4FAF5] p-3.5 rounded-2xl border border-[#C8E6C9] space-y-2 text-xs">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5 font-bold text-[#1B4332]">
                          <Building2 className="w-4 h-4 text-primary" />
                          <span>ICICI Bank Transfer Details</span>
                        </div>
                        <span className="text-[10px] bg-white border border-[#C8E6C9] text-primary px-2 py-0.5 rounded-md font-semibold">
                          Kishore M
                        </span>
                      </div>

                      <div className="bg-white p-2.5 rounded-xl border border-[#C8E6C9] space-y-1.5 text-[11px]">
                        <div className="flex justify-between items-center">
                          <span className="text-gray-500">Account No:</span>
                          <div className="flex items-center gap-1.5 font-mono font-bold text-darktext">
                            <span>{PAYMENT_CONFIG.bankDetails.accountNumber}</span>
                            <button
                              type="button"
                              onClick={() => handleCopy(PAYMENT_CONFIG.bankDetails.accountNumber, 'acc-cart')}
                              className="p-1 hover:text-primary cursor-pointer"
                              title="Copy Account Number"
                            >
                              {copiedField === 'acc-cart' ? (
                                <Check className="w-3 h-3 text-emerald-600" />
                              ) : (
                                <Copy className="w-3 h-3 text-gray-500" />
                              )}
                            </button>
                          </div>
                        </div>

                        <div className="flex justify-between items-center">
                          <span className="text-gray-500">IFSC Code:</span>
                          <div className="flex items-center gap-1.5 font-mono font-bold text-darktext">
                            <span>{PAYMENT_CONFIG.bankDetails.ifscCode}</span>
                            <button
                              type="button"
                              onClick={() => handleCopy(PAYMENT_CONFIG.bankDetails.ifscCode, 'ifsc-cart')}
                              className="p-1 hover:text-primary cursor-pointer"
                              title="Copy IFSC Code"
                            >
                              {copiedField === 'ifsc-cart' ? (
                                <Check className="w-3 h-3 text-emerald-600" />
                              ) : (
                                <Copy className="w-3 h-3 text-gray-500" />
                              )}
                            </button>
                          </div>
                        </div>

                        <div className="flex justify-between items-center">
                          <span className="text-gray-500">Branch:</span>
                          <span className="font-semibold text-darktext">
                            {PAYMENT_CONFIG.bankDetails.branch}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Cost Breakdown */}
                <div className="pt-4 border-t border-gray-100 space-y-2 text-xs">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal</span>
                    <span>₹{totalAmount}</span>
                  </div>
                  <div className="flex justify-between text-primary font-semibold">
                    <span>Farm Delivery</span>
                    <span>FREE across Tamil Nadu</span>
                  </div>
                  <div className="flex justify-between text-base font-extrabold text-darktext pt-2 border-t border-gray-100">
                    <span>Total Amount</span>
                    <span className="text-accent text-xl">₹{totalAmount}</span>
                  </div>
                </div>

                {serverError && (
                  <div className="bg-rose-50 border border-rose-200 text-rose-700 text-xs p-3 rounded-xl font-semibold flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{serverError}</span>
                  </div>
                )}

                {/* Place Order Button - Always enabled and clickable */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-4 px-4 bg-primary hover:bg-primary-hover disabled:bg-gray-400 text-white font-bold text-sm rounded-xl shadow-lg transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer active:scale-95"
                >
                  {isSubmitting ? (
                    <span>Placing Order & Loading Payment...</span>
                  ) : (
                    <>
                      <span>Place Order & Pay Online</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>

              <div className="text-center pt-1 text-[11px] text-gray-400">
                100% Secure Online Payment via UPI & Bank Transfer • Verified Dispatch
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

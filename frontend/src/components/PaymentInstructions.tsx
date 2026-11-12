import React, { useState } from 'react';
import {
  QrCode,
  Copy,
  Check,
  Download,
  Building2,
  Smartphone,
  ShieldCheck,
  Clock,
  AlertCircle,
  CheckCircle2,
  Send,
  Info,
} from 'lucide-react';
import { PAYMENT_CONFIG } from '../utils/paymentConfig';
import { PaymentMethod, PaymentStatus, Order } from '../types';
import { api } from '../api';

interface PaymentInstructionsProps {
  order: Order;
  onPaymentUpdated?: (updatedOrder: Order, whatsappUrl?: string) => void;
}

export const PaymentInstructions: React.FC<PaymentInstructionsProps> = ({
  order,
  onPaymentUpdated,
}) => {
  const [activeTab, setActiveTab] = useState<PaymentMethod>(
    order.paymentMethod || 'UPI'
  );
  const [copiedField, setCopiedField] = useState<string | null>(null);

  // Verification Form State
  const [transactionId, setTransactionId] = useState(order.transactionId || '');
  const [paymentNotes, setPaymentNotes] = useState(
    order.paymentVerificationNotes || ''
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [verificationError, setVerificationError] = useState<string | null>(null);
  const [verificationSuccess, setVerificationSuccess] = useState<string | null>(
    null
  );

  const paymentStatus: PaymentStatus = order.paymentStatus || 'Pending Payment';

  const handleCopy = (text: string, fieldName: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldName);
    setTimeout(() => {
      setCopiedField(null);
    }, 2500);
  };

  const handleDownloadQR = () => {
    const link = document.createElement('a');
    link.href = PAYMENT_CONFIG.qrImage;
    link.download = `Ponivraa-UPI-QR-${order.orderId.replace(/[^a-zA-Z0-9]/g, '')}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleSubmitVerification = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!transactionId.trim()) {
      setVerificationError('Please enter your UPI UTR number or bank transaction reference ID');
      return;
    }

    try {
      setIsSubmitting(true);
      setVerificationError(null);

      const result = await api.submitPaymentVerification(order.orderId, {
        transactionId: transactionId.trim(),
        paymentMethod: activeTab,
        paymentNotes: paymentNotes.trim(),
      });

      setVerificationSuccess(
        'Payment details submitted successfully! Our team is verifying your payment.'
      );

      if (onPaymentUpdated) {
        onPaymentUpdated(result.order, result.whatsappUrl);
      }
    } catch (err: any) {
      console.error('Payment verification failed:', err);
      setVerificationError(
        err.message || 'Failed to submit payment details. Please try again.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden">
      {/* Top Header & Payment Status Bar */}
      <div className="bg-gradient-to-r from-cream via-white to-cream border-b border-gray-200 p-5 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider block mb-1">
              Payment Requirement
            </span>
            <div className="flex items-center gap-2">
              <span className="text-xl sm:text-2xl font-extrabold text-darktext">
                Amount Due: ₹{order.totalAmount}
              </span>
              <span className="text-xs bg-lightgreen text-primary font-bold px-2.5 py-0.5 rounded-full border border-lightgreen-border">
                No COD
              </span>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Orders are dispatched only after online payment verification.
            </p>
          </div>

          {/* Payment Status Badge */}
          <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block sm:text-right">
              Payment Status
            </span>
            {paymentStatus === 'Paid' ? (
              <span className="inline-flex items-center gap-1.5 bg-emerald-50 text-emerald-700 border border-emerald-300 font-bold text-xs sm:text-sm px-3.5 py-1.5 rounded-xl shadow-xs">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Paid & Verified</span>
              </span>
            ) : paymentStatus === 'Payment Verification' ? (
              <span className="inline-flex items-center gap-1.5 bg-amber-50 text-amber-700 border border-amber-300 font-bold text-xs sm:text-sm px-3.5 py-1.5 rounded-xl shadow-xs animate-pulse">
                <Clock className="w-4 h-4 text-amber-600" />
                <span>Payment Verification</span>
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 bg-rose-50 text-rose-700 border border-rose-300 font-bold text-xs sm:text-sm px-3.5 py-1.5 rounded-xl shadow-xs">
                <AlertCircle className="w-4 h-4 text-rose-600" />
                <span>Pending Payment</span>
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="p-5 sm:p-7 space-y-6">
        {/* Payment Method Selector Tabs */}
        <div>
          <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
            Select Online Payment Method
          </label>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setActiveTab('UPI')}
              className={`p-3.5 rounded-2xl border text-left flex items-center gap-3 transition-all cursor-pointer ${
                activeTab === 'UPI'
                  ? 'border-primary bg-primary/5 ring-2 ring-primary/20 shadow-xs'
                  : 'border-gray-200 hover:border-gray-300 bg-white'
              }`}
            >
              <div
                className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                  activeTab === 'UPI'
                    ? 'bg-primary text-white'
                    : 'bg-gray-100 text-gray-600'
                }`}
              >
                <Smartphone className="w-5 h-5" />
              </div>
              <div>
                <span className="font-bold text-xs text-darktext block">
                  UPI / QR Scanner
                </span>
                <span className="text-[11px] text-gray-500">
                  GPay, PhonePe, Paytm, BHIM
                </span>
              </div>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('Bank Transfer')}
              className={`p-3.5 rounded-2xl border text-left flex items-center gap-3 transition-all cursor-pointer ${
                activeTab === 'Bank Transfer'
                  ? 'border-primary bg-primary/5 ring-2 ring-primary/20 shadow-xs'
                  : 'border-gray-200 hover:border-gray-300 bg-white'
              }`}
            >
              <div
                className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                  activeTab === 'Bank Transfer'
                    ? 'bg-primary text-white'
                    : 'bg-gray-100 text-gray-600'
                }`}
              >
                <Building2 className="w-5 h-5" />
              </div>
              <div>
                <span className="font-bold text-xs text-darktext block">
                  Bank Transfer
                </span>
                <span className="text-[11px] text-gray-500">
                  ICICI Bank (NEFT / IMPS)
                </span>
              </div>
            </button>
          </div>
        </div>

        {/* TAB 1: UPI & QR Scanner */}
        {activeTab === 'UPI' && (
          <div className="bg-cream rounded-2xl p-5 border border-gray-200 space-y-5">
            <div className="flex items-center gap-2 text-primary font-bold text-xs">
              <QrCode className="w-4 h-4 text-accent" />
              <span>Scan & Pay via any UPI App</span>
            </div>

            {/* Instruction Steps */}
            <ol className="text-xs text-gray-600 space-y-1.5 list-decimal list-inside bg-white p-3.5 rounded-xl border border-gray-100">
              <li>Open Google Pay, PhonePe, Paytm, BHIM, or any UPI app.</li>
              <li>Scan the QR code below or copy our UPI ID.</li>
              <li>
                Pay the exact amount: <strong className="text-accent font-extrabold">₹{order.totalAmount}</strong>
              </li>
              <li>Copy the 12-digit UPI UTR / Reference number and submit below.</li>
            </ol>

            {/* QR Code and Actions Card */}
            <div className="bg-white rounded-2xl p-4 sm:p-5 border border-gray-200 flex flex-col sm:flex-row items-center gap-5">
              {/* QR Image Box */}
              <div className="relative group shrink-0">
                <div className="w-44 h-44 sm:w-48 sm:h-48 rounded-2xl bg-white border-2 border-primary/20 p-2 shadow-sm flex items-center justify-center">
                  <img
                    src={PAYMENT_CONFIG.qrImage}
                    onError={(e) => {
                      // Fallback to secondary image location or online generator if needed
                      const target = e.currentTarget;
                      if (!target.src.includes(PAYMENT_CONFIG.qrImageFallback)) {
                        target.src = PAYMENT_CONFIG.qrImageFallback;
                      }
                    }}
                    alt="Ponivraa Farm UPI QR Code"
                    className="w-full h-full object-contain rounded-xl"
                  />
                </div>
                <div className="text-center mt-1.5">
                  <span className="text-[10px] text-gray-400 font-semibold uppercase tracking-wider">
                    Scan with any UPI App
                  </span>
                </div>
              </div>

              {/* UPI ID & Download Section */}
              <div className="flex-1 w-full space-y-3.5 text-center sm:text-left">
                <div>
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">
                    Official Farm UPI ID
                  </span>
                  <div className="mt-1 flex items-center justify-center sm:justify-start gap-2 bg-cream px-3 py-2 rounded-xl border border-gray-200">
                    <span className="font-mono font-bold text-xs sm:text-sm text-darktext select-all break-all">
                      {PAYMENT_CONFIG.upiId}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleCopy(PAYMENT_CONFIG.upiId, 'upi')}
                      className="p-1.5 rounded-lg bg-white border border-gray-200 hover:bg-gray-50 text-gray-600 transition-colors shrink-0 cursor-pointer"
                      title="Copy UPI ID"
                    >
                      {copiedField === 'upi' ? (
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>
                  {copiedField === 'upi' && (
                    <span className="text-[10px] text-emerald-600 font-bold mt-1 block">
                      UPI ID copied to clipboard!
                    </span>
                  )}
                </div>

                <div className="text-xs text-gray-500">
                  <span>Payee Name: </span>
                  <strong className="text-darktext font-semibold">{PAYMENT_CONFIG.upiName}</strong>
                </div>

                <div className="pt-1">
                  <button
                    type="button"
                    onClick={handleDownloadQR}
                    className="inline-flex items-center justify-center gap-2 w-full sm:w-auto px-4 py-2.5 bg-white border border-gray-300 hover:border-primary text-darktext text-xs font-bold rounded-xl transition-all shadow-xs cursor-pointer active:scale-95"
                  >
                    <Download className="w-3.5 h-3.5 text-primary" />
                    <span>Download QR Code</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: Bank Transfer Details */}
        {activeTab === 'Bank Transfer' && (
          <div className="bg-cream rounded-2xl p-5 border border-gray-200 space-y-4">
            <div className="flex items-center gap-2 text-primary font-bold text-xs">
              <Building2 className="w-4 h-4 text-accent" />
              <span>Direct ICICI Bank Transfer Details</span>
            </div>

            <p className="text-xs text-gray-600">
              Transfer <strong className="text-accent font-extrabold">₹{order.totalAmount}</strong> via NEFT, IMPS, or RTGS to our official farm account:
            </p>

            <div className="bg-white rounded-2xl p-4 border border-gray-200 divide-y divide-gray-100 text-xs">
              {/* Account Holder */}
              <div className="py-2.5 flex items-center justify-between">
                <span className="text-gray-500 font-medium">Account Holder:</span>
                <span className="font-bold text-darktext">
                  {PAYMENT_CONFIG.bankDetails.accountHolder}
                </span>
              </div>

              {/* Bank Name */}
              <div className="py-2.5 flex items-center justify-between">
                <span className="text-gray-500 font-medium">Bank Name:</span>
                <span className="font-bold text-darktext">
                  {PAYMENT_CONFIG.bankDetails.bankName}
                </span>
              </div>

              {/* Account Number */}
              <div className="py-2.5 flex items-center justify-between gap-2">
                <span className="text-gray-500 font-medium">Account Number:</span>
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-darktext select-all">
                    {PAYMENT_CONFIG.bankDetails.accountNumber}
                  </span>
                  <button
                    type="button"
                    onClick={() =>
                      handleCopy(PAYMENT_CONFIG.bankDetails.accountNumber, 'accNo')
                    }
                    className="p-1 rounded bg-cream border border-gray-200 hover:bg-gray-100 text-gray-600 transition-colors cursor-pointer"
                    title="Copy Account Number"
                  >
                    {copiedField === 'accNo' ? (
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>
              </div>

              {/* IFSC Code */}
              <div className="py-2.5 flex items-center justify-between gap-2">
                <span className="text-gray-500 font-medium">IFSC Code:</span>
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-darktext select-all">
                    {PAYMENT_CONFIG.bankDetails.ifscCode}
                  </span>
                  <button
                    type="button"
                    onClick={() =>
                      handleCopy(PAYMENT_CONFIG.bankDetails.ifscCode, 'ifsc')
                    }
                    className="p-1 rounded bg-cream border border-gray-200 hover:bg-gray-100 text-gray-600 transition-colors cursor-pointer"
                    title="Copy IFSC Code"
                  >
                    {copiedField === 'ifsc' ? (
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>
              </div>

              {/* Branch */}
              <div className="py-2.5 flex items-center justify-between">
                <span className="text-gray-500 font-medium">Branch:</span>
                <span className="font-bold text-darktext">
                  {PAYMENT_CONFIG.bankDetails.branch}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* STEP 2: PAYMENT VERIFICATION FORM */}
        <div className="border-t border-gray-100 pt-5">
          <div className="bg-lightgreen/30 border border-lightgreen-border rounded-2xl p-5 space-y-4">
            <div className="flex items-start gap-2.5">
              <ShieldCheck className="w-5 h-5 text-primary shrink-0 mt-0.5" />
              <div>
                <h4 className="font-bold text-xs sm:text-sm text-darktext uppercase tracking-wide">
                  Submit Payment Verification
                </h4>
                <p className="text-xs text-gray-600 mt-0.5">
                  After completing your transfer, enter the 12-digit UPI UTR number or Bank Transaction Reference ID below so we can verify your payment and dispatch your harvest crate.
                </p>
              </div>
            </div>

            {verificationError && (
              <div className="bg-rose-50 border border-rose-200 text-rose-700 text-xs p-3 rounded-xl font-medium">
                {verificationError}
              </div>
            )}

            {verificationSuccess && (
              <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs p-3.5 rounded-xl font-medium flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{verificationSuccess}</span>
              </div>
            )}

            {/* If order is already paid */}
            {paymentStatus === 'Paid' ? (
              <div className="bg-white p-4 rounded-xl border border-emerald-200 text-xs space-y-1">
                <span className="font-bold text-emerald-700 block">
                  Payment Verified & Completed
                </span>
                <p className="text-gray-600">
                  Transaction Reference: <strong className="font-mono text-darktext">{order.transactionId || 'Verified by Admin'}</strong>
                </p>
                <p className="text-gray-500">Your harvest crate is approved for dispatch!</p>
              </div>
            ) : (
              <form onSubmit={handleSubmitVerification} className="space-y-3.5 bg-white p-4 rounded-2xl border border-gray-200">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    UPI UTR / Bank Transaction Reference ID *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 412345678901 or ICICI reference number"
                    value={transactionId}
                    onChange={(e) => setTransactionId(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs font-mono font-medium focus:ring-2 focus:ring-primary focus:outline-none bg-gray-50/50"
                  />
                  <span className="text-[10px] text-gray-400 mt-0.5 block">
                    Found in your UPI App (GPay/PhonePe/Paytm) transaction details as "UPI Ref ID" or "UTR".
                  </span>
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Payment Notes / Remarks (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Paid from HDFC account / Varsha's GPay"
                    value={paymentNotes}
                    onChange={(e) => setPaymentNotes(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-gray-200 text-xs focus:ring-2 focus:ring-primary focus:outline-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting || !transactionId.trim()}
                  className="w-full py-3 px-4 bg-primary hover:bg-primary-hover disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-bold text-xs rounded-xl shadow transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95"
                >
                  {isSubmitting ? (
                    <span>Verifying Transaction...</span>
                  ) : (
                    <>
                      <Send className="w-3.5 h-3.5" />
                      <span>Submit Payment for Verification</span>
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};


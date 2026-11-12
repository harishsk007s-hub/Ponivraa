import React from 'react';
import { Check, Clock, Package, Truck, Navigation, Home, AlertCircle } from 'lucide-react';
import { OrderStatus } from '../types';

interface OrderTrackerProps {
  status: OrderStatus;
}

const STAGES: Array<{ key: OrderStatus; label: string; icon: React.FC<{ className?: string }> }> = [
  { key: 'Placed', label: 'Order Placed', icon: Clock },
  { key: 'Packed', label: 'Freshly Packed', icon: Package },
  { key: 'Shipped', label: 'Shipped from Farm', icon: Truck },
  { key: 'Out for Delivery', label: 'Out for Delivery', icon: Navigation },
  { key: 'Delivered', label: 'Delivered to Door', icon: Home },
];

export const OrderTracker: React.FC<OrderTrackerProps> = ({ status }) => {
  if (status === 'Cancelled') {
    return (
      <div className="bg-rose-50 border border-rose-200 rounded-2xl p-6 text-center">
        <div className="w-12 h-12 bg-rose-100 text-rose-700 rounded-full flex items-center justify-center mx-auto mb-3">
          <AlertCircle className="w-6 h-6" />
        </div>
        <h4 className="text-base font-bold text-rose-900">Order Cancelled</h4>
        <p className="text-xs text-rose-700 mt-1 max-w-md mx-auto">
          This order was cancelled. If you have questions or wish to replace the order, please get in touch with our farm team on WhatsApp.
        </p>
      </div>
    );
  }

  const currentIndex = STAGES.findIndex((s) => s.key === status);

  return (
    <div className="py-6 px-2 sm:px-4">
      {/* Progress Bar Container */}
      <div className="relative">
        {/* Connecting Background Line */}
        <div className="absolute top-5 left-6 right-6 h-1 bg-gray-200 -z-0" />

        {/* Active Line Fill */}
        <div
          className="absolute top-5 left-6 h-1 bg-primary transition-all duration-500 -z-0"
          style={{
            width: `${Math.max(0, (currentIndex / (STAGES.length - 1)) * 100)}%`,
          }}
        />

        {/* Steps */}
        <div className="relative z-10 flex justify-between items-start">
          {STAGES.map((stage, idx) => {
            const isCompleted = idx < currentIndex;
            const isCurrent = idx === currentIndex;
            const IconComponent = stage.icon;

            return (
              <div key={stage.key} className="flex flex-col items-center text-center flex-1">
                {/* Node Circle */}
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${
                    isCompleted
                      ? 'bg-primary text-white shadow-md'
                      : isCurrent
                      ? 'bg-accent text-white ring-4 ring-orange-100 shadow-lg scale-110'
                      : 'bg-white text-gray-400 border-2 border-gray-200'
                  }`}
                >
                  {isCompleted ? (
                    <Check className="w-5 h-5 stroke-[2.5]" />
                  ) : (
                    <IconComponent className="w-5 h-5" />
                  )}
                </div>

                {/* Stage Label */}
                <span
                  className={`mt-3 text-xs font-bold leading-tight max-w-[80px] sm:max-w-none ${
                    isCurrent
                      ? 'text-accent'
                      : isCompleted
                      ? 'text-primary'
                      : 'text-gray-400 font-medium'
                  }`}
                >
                  {stage.label}
                </span>

                {/* Status Indicator */}
                {isCurrent && (
                  <span className="mt-1 inline-block text-[10px] font-semibold text-accent bg-orange-50 px-2 py-0.5 rounded-full border border-orange-200">
                    Current
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};


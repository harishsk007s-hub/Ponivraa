import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, MessageCircle, Plus, Minus, Check, Eye } from 'lucide-react';
import { Product, HoneyWeight } from '../types';
import { useCart } from '../context/CartContext';
import { getProductWhatsAppUrl } from '../utils/whatsapp';

interface ProductCardProps {
  product: Product;
}

const DEFAULT_HONEY_VARIANTS = [
  { weight: '250 g' as HoneyWeight, price: 240, stockQuantity: 20, inStock: true },
  { weight: '350 g' as HoneyWeight, price: 320, stockQuantity: 15, inStock: true },
  { weight: '500 g' as HoneyWeight, price: 450, stockQuantity: 20, inStock: true },
  { weight: '1 kg' as HoneyWeight, price: 850, stockQuantity: 10, inStock: true },
];

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const isHoney = product.category === 'Honey';

  // Honey variants setup
  const variants = isHoney
    ? product.variants && product.variants.length > 0
      ? product.variants
      : DEFAULT_HONEY_VARIANTS
    : [];

  const [selectedWeight, setSelectedWeight] = useState<HoneyWeight>(
    variants[0] ? variants[0].weight : '250 g'
  );
  const [quantity, setQuantity] = useState(1);
  const [isAdded, setIsAdded] = useState(false);

  const { addToCart } = useCart();

  // Find active variant if Honey
  const activeVariant = isHoney ? variants.find((v) => v.weight === selectedWeight) : null;

  // Determine active price and stock
  const currentPrice = isHoney && activeVariant ? activeVariant.price : product.price;
  const currentStock = isHoney && activeVariant ? activeVariant.stockQuantity : product.stockQuantity;
  const isAvailable = product.inStock && currentStock > 0;

  const handleIncrement = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (quantity < currentStock) {
      setQuantity((prev) => prev + 1);
    }
  };

  const handleDecrement = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (quantity > 1) {
      setQuantity((prev) => prev - 1);
    }
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isAvailable) return;
    addToCart(product, quantity, isHoney ? selectedWeight : 'kg', currentPrice);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 1500);
  };

  const whatsappOrderUrl = getProductWhatsAppUrl(
    product.name,
    quantity,
    currentPrice,
    isHoney ? selectedWeight : `${quantity} KG`,
    isHoney
  );

  return (
    <div className="bg-white rounded-2xl overflow-hidden border border-[#C8E6C9] shadow-sm hover:shadow-xl hover:border-primary transition-all duration-300 flex flex-col group">
      {/* Image & Badges Container */}
      <Link to={`/products/${product._id}`} className="relative block overflow-hidden aspect-[4/3] bg-[#F4FAF5]">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />

        {/* Category Pill */}
        <div className="absolute top-3 left-3">
          <span className="bg-white/95 backdrop-blur-sm text-primary font-bold text-xs px-2.5 py-1 rounded-full shadow-sm tracking-wide border border-[#C8E6C9]">
            {product.category}
          </span>
        </div>

        {/* Stock Status Badge */}
        <div className="absolute top-3 right-3">
          {isAvailable ? (
            <span className="bg-lightgreen text-primary border border-lightgreen-border font-semibold text-xs px-2.5 py-1 rounded-full shadow-sm">
              In Stock {isHoney ? `(${currentStock} jars)` : `(${currentStock} kg)`}
            </span>
          ) : (
            <span className="bg-rose-50 text-rose-700 border border-rose-200 font-semibold text-xs px-2.5 py-1 rounded-full shadow-sm">
              Out of Stock
            </span>
          )}
        </div>

        {/* Quick View Overlay button on desktop */}
        <div className="absolute inset-0 bg-primary/20 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center pointer-events-none">
          <span className="bg-white text-primary text-xs font-bold px-3.5 py-2 rounded-full shadow-md flex items-center gap-1.5 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-200">
            <Eye className="w-3.5 h-3.5" />
            <span>View Harvest Details</span>
          </span>
        </div>
      </Link>

      {/* Product Content */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Title */}
          <Link
            to={`/products/${product._id}`}
            className="block text-lg font-bold text-darktext hover:text-primary transition-colors line-clamp-1 leading-snug"
          >
            {product.name}
          </Link>

          {/* Description */}
          <p className="text-xs text-gray-600 mt-2 line-clamp-2 leading-relaxed">
            {product.description}
          </p>

          {/* HONEY WEIGHT VARIANT SELECTOR */}
          {isHoney && variants.length > 0 && (
            <div className="mt-4 pt-3 border-t border-gray-100">
              <span className="text-[11px] font-bold text-gray-600 block mb-1.5 uppercase tracking-wide">
                Select Weight Variant:
              </span>
              <div className="grid grid-cols-4 gap-1.5">
                {variants.map((v) => (
                  <button
                    key={v.weight}
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedWeight(v.weight);
                      setQuantity(1);
                    }}
                    className={`py-1.5 px-1 text-center rounded-lg text-xs font-bold transition-all ${
                      selectedWeight === v.weight
                        ? 'bg-accent text-white shadow-sm ring-2 ring-accent/30'
                        : 'bg-cream text-gray-700 hover:bg-lightgreen hover:text-primary border border-gray-200'
                    }`}
                  >
                    <span>{v.weight}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Price & Quantity Selector */}
        <div className="mt-5 pt-4 border-t border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div>
              <span className="text-xs text-gray-500 block font-medium">
                {isHoney ? `Price (${selectedWeight})` : 'Price per kg'}
              </span>
              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-extrabold text-accent">
                  ₹{currentPrice}
                </span>
                <span className="text-xs text-gray-500 font-semibold">
                  {isHoney ? ` / ${selectedWeight}` : ' / kg'}
                </span>
              </div>
            </div>

            {/* Quantity Stepper */}
            {isAvailable && (
              <div className="flex items-center border border-gray-200 rounded-lg bg-cream px-1 py-1">
                <button
                  type="button"
                  onClick={handleDecrement}
                  disabled={quantity <= 1}
                  className="p-1 rounded text-gray-600 hover:text-primary hover:bg-white disabled:opacity-30 transition-colors"
                  aria-label="Decrease quantity"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="w-8 text-center text-xs font-bold text-darktext">
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={handleIncrement}
                  disabled={quantity >= currentStock}
                  className="p-1 rounded text-gray-600 hover:text-primary hover:bg-white disabled:opacity-30 transition-colors"
                  aria-label="Increase quantity"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {/* Add to Cart Button */}
            {isAvailable ? (
              <button
                type="button"
                onClick={handleAddToCart}
                className={`w-full py-2.5 px-3 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-all duration-200 shadow-sm ${
                  isAdded
                    ? 'bg-primary text-white'
                    : 'bg-primary hover:bg-primary-hover text-white active:scale-95'
                }`}
              >
                {isAdded ? (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    <span>Added</span>
                  </>
                ) : (
                  <>
                    <ShoppingBag className="w-3.5 h-3.5" />
                    <span>Add to Cart</span>
                  </>
                )}
              </button>
            ) : (
              <button
                type="button"
                disabled
                className="w-full py-2.5 px-3 rounded-xl font-bold text-xs bg-gray-100 text-gray-400 cursor-not-allowed border border-gray-200"
              >
                Out of Stock
              </button>
            )}

            {/* WhatsApp Order / Enquiry Button */}
            <a
              href={whatsappOrderUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-2.5 px-3 rounded-xl font-bold text-xs bg-accent hover:bg-accent-hover text-white flex items-center justify-center gap-1.5 transition-all duration-200 shadow-sm active:scale-95"
            >
              <MessageCircle className="w-3.5 h-3.5 fill-white" />
              <span>{isAvailable ? 'WhatsApp' : 'Enquire'}</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

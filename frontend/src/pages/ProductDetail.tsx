import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  ArrowLeft,
  ShoppingBag,
  MessageCircle,
  ShieldCheck,
  Truck,
  Sprout,
  Plus,
  Minus,
  Check,
  Award,
} from 'lucide-react';
import { Product, HoneyWeight } from '../types';
import { api } from '../api';
import { useCart } from '../context/CartContext';
import { getProductWhatsAppUrl } from '../utils/whatsapp';

const DEFAULT_HONEY_VARIANTS = [
  { weight: '250 g' as HoneyWeight, price: 240, stockQuantity: 20, inStock: true },
  { weight: '350 g' as HoneyWeight, price: 320, stockQuantity: 15, inStock: true },
  { weight: '500 g' as HoneyWeight, price: 450, stockQuantity: 20, inStock: true },
  { weight: '1 kg' as HoneyWeight, price: 850, stockQuantity: 10, inStock: true },
];

export const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [selectedWeight, setSelectedWeight] = useState<HoneyWeight>('250 g');
  const [quantity, setQuantity] = useState<number>(1);
  const [isAdded, setIsAdded] = useState<boolean>(false);

  const { addToCart } = useCart();

  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) return;
      try {
        setLoading(true);
        setError(null);
        const data = await api.getProductById(id);
        setProduct(data);
        if (data.category === 'Honey' && data.variants && data.variants.length > 0) {
          setSelectedWeight(data.variants[0].weight);
        }
      } catch (err: any) {
        console.error('Error fetching product detail:', err);
        setError(err.message || 'Product not found');
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center bg-cream">
        <div className="text-center space-y-3">
          <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs text-gray-500 font-semibold">Loading harvest details...</p>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center bg-cream p-4">
        <div className="bg-white p-8 rounded-3xl border border-gray-200 text-center max-w-md shadow-sm space-y-4">
          <p className="text-sm font-bold text-rose-700">{error || 'Product not found'}</p>
          <Link
            to="/products"
            className="inline-flex items-center gap-2 bg-primary text-white text-xs font-bold px-5 py-2.5 rounded-xl hover:bg-primary-hover transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Products Catalog</span>
          </Link>
        </div>
      </div>
    );
  }

  const isHoney = product.category === 'Honey';
  const variants = isHoney
    ? product.variants && product.variants.length > 0
      ? product.variants
      : DEFAULT_HONEY_VARIANTS
    : [];

  const activeVariant = isHoney ? variants.find((v) => v.weight === selectedWeight) : null;
  const currentPrice = isHoney && activeVariant ? activeVariant.price : product.price;
  const currentStock = isHoney && activeVariant ? activeVariant.stockQuantity : product.stockQuantity;
  const isAvailable = product.inStock && currentStock > 0;

  const handleIncrement = () => {
    if (quantity < currentStock) {
      setQuantity((prev) => prev + 1);
    }
  };

  const handleDecrement = () => {
    if (quantity > 1) {
      setQuantity((prev) => prev - 1);
    }
  };

  const handleAddToCart = () => {
    if (!isAvailable) return;
    addToCart(product, quantity, isHoney ? selectedWeight : 'kg', currentPrice);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 1500);
  };

  const whatsappUrl = getProductWhatsAppUrl(
    product.name,
    quantity,
    currentPrice,
    isHoney ? selectedWeight : `${quantity} KG`,
    isHoney
  );

  return (
    <div className="min-h-screen bg-cream py-10 sm:py-14">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb & Back Link */}
        <div className="mb-6">
          <Link
            to="/products"
            className="inline-flex items-center gap-2 text-xs font-bold text-gray-600 hover:text-primary transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to All Produce</span>
          </Link>
        </div>

        {/* Main Product Card */}
        <div className="bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 p-6 sm:p-10 lg:p-12">
            {/* Left: Large Product Image */}
            <div className="lg:col-span-6">
              <div className="relative rounded-2xl overflow-hidden aspect-[4/3] sm:aspect-square bg-cream border border-gray-100 shadow-inner">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />

                <div className="absolute top-4 left-4 flex gap-2">
                  <span className="bg-white/95 backdrop-blur-sm text-primary font-bold text-xs px-3 py-1 rounded-full shadow border border-[#C8E6C9]">
                    {product.category}
                  </span>
                  <span className="bg-secondary text-primary font-bold text-xs px-3 py-1 rounded-full shadow border border-yellow-300">
                    Alagarkovil Harvest
                  </span>
                </div>

                <div className="absolute top-4 right-4">
                  {isAvailable ? (
                    <span className="bg-lightgreen text-primary border border-lightgreen-border font-bold text-xs px-3 py-1 rounded-full shadow-sm">
                      In Stock {isHoney ? `(${currentStock} jars)` : `(${currentStock} kg available)`}
                    </span>
                  ) : (
                    <span className="bg-rose-50 text-rose-700 border border-rose-200 font-bold text-xs px-3 py-1 rounded-full shadow-sm">
                      Out of Stock
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Right: Product Details & Purchase Form */}
            <div className="lg:col-span-6 flex flex-col justify-between space-y-6">
              <div>
                <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary bg-lightgreen px-2.5 py-1 rounded-full uppercase tracking-wider mb-2 border border-lightgreen-border">
                  <Sprout className="w-3.5 h-3.5 text-accent" />
                  <span>100% Naturally Grown</span>
                </div>

                <h1 className="font-serif text-2xl sm:text-4xl font-bold text-darktext tracking-tight leading-tight">
                  {product.name}
                </h1>

                {/* Price Display */}
                <div className="mt-4 flex items-baseline gap-2">
                  <span className="text-3xl sm:text-4xl font-extrabold text-accent">
                    ₹{currentPrice}
                  </span>
                  <span className="text-sm font-semibold text-gray-500">
                    {isHoney ? `per ${selectedWeight} jar` : 'per kg'}
                  </span>
                  <span className="ml-3 text-xs text-gray-400 font-medium">(Taxes inclusive)</span>
                </div>

                {/* HONEY WEIGHT VARIANT SELECTOR */}
                {isHoney && variants.length > 0 && (
                  <div className="mt-6 p-4 bg-cream rounded-2xl border border-gray-200 space-y-2">
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide">
                      Select Honey Weight Variant:
                    </label>
                    <div className="grid grid-cols-4 gap-2">
                      {variants.map((v) => (
                        <button
                          key={v.weight}
                          type="button"
                          onClick={() => {
                            setSelectedWeight(v.weight);
                            setQuantity(1);
                          }}
                          className={`py-2 px-2 text-center rounded-xl text-xs font-bold transition-all cursor-pointer ${
                            selectedWeight === v.weight
                              ? 'bg-accent text-white shadow-md ring-2 ring-accent/30'
                              : 'bg-white text-gray-700 hover:bg-lightgreen hover:text-primary border border-gray-200'
                          }`}
                        >
                          <span className="block">{v.weight}</span>
                          <span className="text-[10px] opacity-90 block mt-0.5">₹{v.price}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Description */}
                <div className="mt-6 space-y-3 text-sm text-gray-700 leading-relaxed border-t border-b border-gray-100 py-6">
                  <h3 className="font-bold text-xs uppercase tracking-wider text-gray-400">
                    Harvest & Flavor Profile
                  </h3>
                  <p>{product.description}</p>
                </div>

                {/* Quantity Selection */}
                {isAvailable ? (
                  <div className="mt-6">
                    <label className="block text-xs font-bold text-gray-700 mb-2 uppercase tracking-wide">
                      Select Quantity {isHoney ? '(Jars)' : '(in kg)'}
                    </label>
                    <div className="flex items-center gap-4">
                      <div className="flex items-center border-2 border-gray-200 rounded-xl bg-cream px-2 py-1.5">
                        <button
                          type="button"
                          onClick={handleDecrement}
                          disabled={quantity <= 1}
                          className="p-1.5 rounded-lg text-gray-600 hover:text-primary hover:bg-white disabled:opacity-30 transition-colors cursor-pointer"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <span className="w-12 text-center text-base font-extrabold text-darktext">
                          {quantity}
                        </span>
                        <button
                          type="button"
                          onClick={handleIncrement}
                          disabled={quantity >= currentStock}
                          className="p-1.5 rounded-lg text-gray-600 hover:text-primary hover:bg-white disabled:opacity-30 transition-colors cursor-pointer"
                          aria-label="Increase quantity"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="text-xs text-gray-500">
                        Total: <strong className="text-darktext text-sm">₹{currentPrice * quantity}</strong>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="mt-6 bg-rose-50 border border-rose-200 rounded-2xl p-4">
                    <p className="text-xs font-bold text-rose-800">
                      Currently harvest exhausted. Enquire below on WhatsApp to reserve the next branch harvest batch.
                    </p>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {isAvailable ? (
                    <button
                      type="button"
                      onClick={handleAddToCart}
                      className={`w-full py-3.5 px-4 rounded-xl font-bold text-sm flex items-center justify-center gap-2 shadow-sm transition-all duration-200 cursor-pointer ${
                        isAdded
                          ? 'bg-primary text-white'
                          : 'bg-primary hover:bg-primary-hover text-white active:scale-95'
                      }`}
                    >
                      {isAdded ? (
                        <>
                          <Check className="w-4 h-4" />
                          <span>Added to Cart</span>
                        </>
                      ) : (
                        <>
                          <ShoppingBag className="w-4 h-4" />
                          <span>Add to Cart ({quantity} {isHoney ? 'Jar' : 'kg'})</span>
                        </>
                      )}
                    </button>
                  ) : (
                    <button
                      type="button"
                      disabled
                      className="w-full py-3.5 px-4 rounded-xl font-bold text-sm bg-gray-100 text-gray-400 cursor-not-allowed border border-gray-200"
                    >
                      Out of Stock
                    </button>
                  )}

                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-3.5 px-4 rounded-xl font-bold text-sm bg-accent hover:bg-accent-hover text-white flex items-center justify-center gap-2 shadow-sm transition-all duration-200 active:scale-95 cursor-pointer"
                  >
                    <MessageCircle className="w-4 h-4 fill-white" />
                    <span>{isAvailable ? 'Order via WhatsApp' : 'Enquire on WhatsApp'}</span>
                  </a>
                </div>
              </div>

              {/* Delivery info banner */}
              <div className="mt-8 pt-6 border-t border-gray-100 grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs text-gray-600">
                <div className="flex items-center gap-2.5">
                  <Truck className="w-4 h-4 text-accent shrink-0" />
                  <span>Free delivery across Tamil Nadu</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <ShieldCheck className="w-4 h-4 text-primary shrink-0" />
                  <span>Carbide-Free guarantee</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Award className="w-4 h-4 text-primary shrink-0" />
                  <span>Farm direct packing</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

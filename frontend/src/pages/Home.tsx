import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ArrowRight,
  MessageCircle,
  ShieldCheck,
  Award,
  Sparkles,
  Truck,
  Sprout,
  HeartHandshake,
  CheckCircle2,
  TrendingUp,
  ShoppingBag,
} from 'lucide-react';
import { Product } from '../types';
import { api } from '../api';
import { ProductCard } from '../components/ProductCard';
import { getWhatsAppUrl } from '../utils/whatsapp';

export const Home: React.FC = () => {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        setLoading(true);
        const data = await api.getProducts();
        // Take first 4 items as curated featured harvest
        setFeaturedProducts(data.slice(0, 4));
      } catch (err) {
        console.error('Failed to load featured harvest:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchFeatured();
  }, []);

  return (
    <div className="min-h-screen bg-cream">
      {/* 1. HERO SECTION - Fresh Nature Light Green */}
      <section className="relative bg-gradient-to-b from-[#EBF7EE] via-[#F4FAF5] to-[#FDFBF7] text-darktext border-b border-[#C8E6C9] overflow-hidden py-16 sm:py-24 lg:py-28">
        <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#388E3C_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />
        <div className="absolute top-1/4 right-5 w-96 h-96 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-5 left-5 w-80 h-80 bg-secondary/30 rounded-full blur-3xl pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 bg-white/90 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-[#C8E6C9] text-primary text-xs font-semibold tracking-wider uppercase shadow-sm">
                <Sprout className="w-3.5 h-3.5 text-primary" />
                <span>Alagarkovil Organic Foothills, Tamil Nadu</span>
              </div>

              <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-[#1B4332] leading-tight">
                Pure. Natural.{' '}
                <span className="text-primary block lg:inline">Straight from the Soil.</span>
              </h1>

              {/* Home page main description */}
              <p className="text-base sm:text-lg text-[#2D5A32] max-w-2xl mx-auto lg:mx-0 leading-relaxed font-normal">
                Farm-fresh mangoes straight from our very own farm in Alagarkovil. Bringing together 25+ years of traditional farming wisdom and Gen Z innovation to deliver naturally grown, delicious mangoes right to your doorstep.
              </p>

              {/* Action Buttons using React Router navigation */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-4">
                <button
                  type="button"
                  onClick={() => navigate('/products')}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-primary hover:bg-primary-hover text-white font-bold text-sm px-7 py-4 rounded-xl shadow-md transition-all duration-200 transform hover:-translate-y-0.5 active:scale-95 cursor-pointer"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>Shop Fresh Produce</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <a
                  href={getWhatsAppUrl('Hello Ponivraa, I would like to order fresh farm harvest directly.')}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-white hover:bg-[#E8F5E9] text-[#1B4332] border-2 border-[#C8E6C9] hover:border-primary font-bold text-sm px-7 py-4 rounded-xl shadow-sm transition-all duration-200 transform hover:-translate-y-0.5 active:scale-95"
                >
                  <MessageCircle className="w-4 h-4 fill-primary text-primary" />
                  <span>Order via WhatsApp</span>
                </a>
              </div>

              {/* Trust Micro-Metrics */}
              <div className="pt-6 border-t border-[#C8E6C9] grid grid-cols-3 gap-4 max-w-lg mx-auto lg:mx-0 text-left">
                <div>
                  <span className="block font-serif text-2xl font-bold text-primary">25+</span>
                  <span className="text-[11px] text-[#4A7C59] uppercase font-semibold">Years Experience</span>
                </div>
                <div>
                  <span className="block font-serif text-2xl font-bold text-primary">0%</span>
                  <span className="text-[11px] text-[#4A7C59] uppercase font-semibold">Chemical Free</span>
                </div>
                <div>
                  <span className="block font-serif text-2xl font-bold text-primary">100%</span>
                  <span className="text-[11px] text-[#4A7C59] uppercase font-semibold">Natural</span>
                </div>
              </div>
            </div>

            {/* Right Hero Image Composition */}
            <div className="lg:col-span-5 relative">
              <div className="relative mx-auto max-w-md lg:max-w-none">
                <div className="rounded-3xl overflow-hidden shadow-xl border-4 border-white aspect-[4/4] bg-[#E8F5E9]">
                  <img
                    src="/hero-mangoes.jpg"
                    alt="Fresh Alagarkovil Farm Mangoes"
                    className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-700"
                  />
                </div>

                {/* Floating Farm Badge: Carbide-Free */}
                <div className="absolute -bottom-5 -left-5 bg-white text-darktext p-4 rounded-2xl shadow-xl border border-[#C8E6C9] flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#E8F5E9] flex items-center justify-center text-primary">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xs font-bold block text-primary">Carbide-Free</span>
                    <span className="text-[10px] text-gray-500 font-medium">100% Naturally Ripened</span>
                  </div>
                </div>

                <div className="absolute -top-4 -right-4 bg-secondary text-primary font-bold text-xs py-2.5 px-4 rounded-2xl shadow-lg border border-yellow-300 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-accent" />
                  <span>Fresh Harvest Batch</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. FREE DELIVERY BANNER - Nature Light Green Banner */}
      <section className="bg-[#E8F5E9] border-y border-[#C8E6C9] py-3.5 px-4 text-center">
        <div className="max-w-7xl mx-auto flex items-center justify-center gap-3 text-[#1B4332] font-bold text-xs sm:text-sm tracking-wide">
          <Truck className="w-5 h-5 text-primary animate-bounce" />
          <span>Free Delivery Across Tamil Nadu</span>
          <span className="hidden md:inline text-[#A5D6A7]">|</span>
          <span className="hidden md:inline font-semibold text-[#2D5A32]">Orders dispatched directly from farm in eco-crates</span>
        </div>
      </section>

      {/* 3. WHY CHOOSE US SECTION */}
      <section className="py-16 sm:py-20 lg:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-14">
          <div className="inline-flex items-center gap-1.5 bg-[#E8F5E9] text-primary text-xs font-bold px-3 py-1 rounded-full border border-[#C8E6C9] uppercase tracking-wider">
            <Sprout className="w-3.5 h-3.5 text-primary" />
            <span>Rooted in Quality</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#1B4332]">
            Why Discerning Families Choose Ponivraa
          </h2>
          <p className="text-sm text-[#2D5A32] leading-relaxed">
            We bypass middlemen, corporate cold storage, and chemical ripening agents. Every crate represents authentic agricultural stewardship.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
          <div className="bg-white p-6 rounded-2xl border border-[#C8E6C9]/60 shadow-sm hover:shadow-md hover:border-primary transition-all text-center space-y-3">
            <div className="w-12 h-12 rounded-xl bg-[#E8F5E9] text-primary flex items-center justify-center mx-auto">
              <Award className="w-6 h-6 text-primary" />
            </div>
            <h3 className="font-bold text-base text-[#1B4332]">25+ Years Expertise</h3>
            <p className="text-xs text-gray-600 leading-relaxed">
              Generations of deep agrarian wisdom cultivating South Tamil Nadu’s most celebrated soil.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-[#C8E6C9]/60 shadow-sm hover:shadow-md hover:border-primary transition-all text-center space-y-3">
            <div className="w-12 h-12 rounded-xl bg-[#E8F5E9] text-primary flex items-center justify-center mx-auto">
              <ShieldCheck className="w-6 h-6 text-primary" />
            </div>
            <h3 className="font-bold text-base text-[#1B4332]">0% Chemical Free</h3>
            <p className="text-xs text-gray-600 leading-relaxed">
              Zero chemical fertilizers, no synthetic pesticides, and strictly no carbide ripening chambers.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-[#C8E6C9]/60 shadow-sm hover:shadow-md hover:border-primary transition-all text-center space-y-3">
            <div className="w-12 h-12 rounded-xl bg-[#E8F5E9] text-primary flex items-center justify-center mx-auto">
              <Sprout className="w-6 h-6 text-primary" />
            </div>
            <h3 className="font-bold text-base text-[#1B4332]">Natural</h3>
            <p className="text-xs text-gray-600 leading-relaxed">
              Tree-ripened naturally using traditional organic farm compost and pure hillside spring water.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-[#C8E6C9]/60 shadow-sm hover:shadow-md hover:border-primary transition-all text-center space-y-3">
            <div className="w-12 h-12 rounded-xl bg-[#E8F5E9] text-primary flex items-center justify-center mx-auto">
              <TrendingUp className="w-6 h-6 text-primary" />
            </div>
            <h3 className="font-bold text-base text-[#1B4332]">D2C Direct Model</h3>
            <p className="text-xs text-gray-600 leading-relaxed">
              Direct-to-consumer delivery straight from orchard branches to your doorstep within hours of picking.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-[#C8E6C9]/60 shadow-sm hover:shadow-md hover:border-primary transition-all text-center space-y-3">
            <div className="w-12 h-12 rounded-xl bg-[#E8F5E9] text-primary flex items-center justify-center mx-auto">
              <HeartHandshake className="w-6 h-6 text-primary" />
            </div>
            <h3 className="font-bold text-base text-[#1B4332]">No Middlemen</h3>
            <p className="text-xs text-gray-600 leading-relaxed">
              Fair, transparent pricing that directly benefits farming families while giving you pure harvest value.
            </p>
          </div>
        </div>
      </section>

      {/* 4. FEATURED PRODUCTS PREVIEW (Directs to /products) */}
      <section className="py-16 bg-white border-y border-[#C8E6C9]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
            <div>
              <div className="inline-flex items-center gap-1.5 bg-[#E8F5E9] text-primary font-bold text-xs px-3 py-1 rounded-full uppercase tracking-wider mb-2 border border-[#C8E6C9]">
                <Sparkles className="w-3.5 h-3.5 text-primary" />
                <span>Harvest Catalog Preview</span>
              </div>
              <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#1B4332]">
                Featured Farm Harvest
              </h2>
              <p className="text-xs sm:text-sm text-[#2D5A32] mt-1">
                Explore our best-selling mangoes, raw hill honey varieties, and crisp native guavas.
              </p>
            </div>

            <Link
              to="/products"
              className="inline-flex items-center gap-2 text-xs font-bold text-primary hover:text-primary-hover hover:underline"
            >
              <span>View All Products</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="bg-cream rounded-2xl h-80 animate-pulse border border-[#C8E6C9]" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredProducts.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          )}

          <div className="text-center mt-10">
            <Link
              to="/products"
              className="inline-flex items-center gap-2 bg-primary hover:bg-primary-hover text-white font-bold text-xs px-8 py-3.5 rounded-xl shadow-md transition-colors"
            >
              <span>Explore Complete Fruit & Honey Catalog</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* 5. TRADITION MEETS GEN Z INNOVATION SECTION - Nature Light Green Card */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-br from-[#E8F5E9] via-[#F4FAF5] to-[#EAF5EC] border-2 border-[#C8E6C9] text-darktext rounded-3xl overflow-hidden shadow-lg">
          <div className="grid grid-cols-1 lg:grid-cols-12 items-center">
            <div className="lg:col-span-7 p-8 sm:p-12 lg:p-16 space-y-6">
              <div className="inline-flex items-center gap-2 bg-white px-3.5 py-1.5 rounded-full text-primary text-xs font-semibold tracking-wider uppercase border border-[#C8E6C9] shadow-sm">
                <Sparkles className="w-3.5 h-3.5 text-primary" />
                <span>Agricultural Evolution</span>
              </div>

              <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[#1B4332] leading-tight">
                Where 25-Year Farming Tradition Meets Gen Z Tech Innovation
              </h2>

              <p className="text-[#2D5A32] text-sm sm:text-base leading-relaxed font-normal">
                For over two decades, our elders nurtured the orchards of Alagarkovil following timeless soil wisdom. Today, the new generation bridges the gap between field and family table — bringing seamless digital tracking, instant WhatsApp ordering, temperature-safe logistics, and zero-compromise purity.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="flex items-start gap-3 bg-white p-4 rounded-xl border border-[#C8E6C9] shadow-sm">
                  <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-bold text-sm text-[#1B4332]">Smart Orchard Grading</h4>
                    <p className="text-xs text-[#2D5A32] mt-0.5">Every fruit is hand-inspected for natural sweetness and skin integrity.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 bg-white p-4 rounded-xl border border-[#C8E6C9] shadow-sm">
                  <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-bold text-sm text-[#1B4332]">Direct WhatsApp Sync</h4>
                    <p className="text-xs text-[#2D5A32] mt-0.5">Real-time confirmation with our harvest dispatch team at +91 80982 02289.</p>
                  </div>
                </div>
              </div>

              <div className="pt-2">
                <Link
                  to="/about"
                  className="inline-flex items-center gap-2 bg-primary hover:bg-primary-hover text-white font-bold text-sm px-6 py-3 rounded-xl transition-colors shadow-sm"
                >
                  <span>Read The Ponivraa Story</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

            <div className="lg:col-span-5 h-full min-h-[340px] lg:min-h-[500px] relative">
              <img
                src="https://images.unsplash.com/photo-1591073113125-e46713c829ed?auto=format&fit=crop&w=900&q=85"
                alt="Ponivraa Farm Mango Harvest"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* 6. CUSTOMER REVIEWS & TRUST SECTION */}
      <section className="py-16 bg-[#F4FAF5] border-t border-[#C8E6C9]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto space-y-2 mb-12">
            <h3 className="font-serif text-2xl sm:text-3xl font-bold text-[#1B4332]">
              Our 100% Tree-to-Table Promise
            </h3>
            <p className="text-xs sm:text-sm text-[#2D5A32]">
              Tested by nature, trusted by thousands of families across Tamil Nadu.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-7 rounded-2xl border border-[#C8E6C9] shadow-sm flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-center gap-1 text-primary">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Award key={s} className="w-4 h-4 fill-primary" />
                  ))}
                </div>
                <p className="text-sm text-gray-700 italic leading-relaxed">
                  "The Alphonso mangoes and Gulkand honey from Ponivraa brought back the genuine childhood taste we haven’t found in supermarkets. Truly sweet and completely chemical free."
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-gray-100 flex items-center justify-between">
                <div>
                  <span className="font-bold text-sm text-[#1B4332] block">Dr. S. Sundararajan</span>
                  <span className="text-xs text-gray-500">Madurai</span>
                </div>
                <span className="text-[11px] font-semibold text-primary bg-[#E8F5E9] px-2 py-0.5 rounded-full border border-[#C8E6C9]">
                  Verified Order
                </span>
              </div>
            </div>

            <div className="bg-white p-7 rounded-2xl border border-[#C8E6C9] shadow-sm flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-center gap-1 text-primary">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Award key={s} className="w-4 h-4 fill-primary" />
                  ))}
                </div>
                <p className="text-sm text-gray-700 italic leading-relaxed">
                  "Ordering via WhatsApp is effortless. Received crisp country guavas and honey jars carefully wrapped in eco-crates without a single scratch. Outstanding direct farm initiative."
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-gray-100 flex items-center justify-between">
                <div>
                  <span className="font-bold text-sm text-[#1B4332] block">Kavitha Narayanan</span>
                  <span className="text-xs text-gray-500">Chennai</span>
                </div>
                <span className="text-[11px] font-semibold text-primary bg-[#E8F5E9] px-2 py-0.5 rounded-full border border-[#C8E6C9]">
                  Verified Order
                </span>
              </div>
            </div>

            <div className="bg-white p-7 rounded-2xl border border-[#C8E6C9] shadow-sm flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-center gap-1 text-primary">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Award key={s} className="w-4 h-4 fill-primary" />
                  ))}
                </div>
                <p className="text-sm text-gray-700 italic leading-relaxed">
                  "Knowing that the money goes directly to farming families in Alagarkovil makes every bite sweeter. The Banganapalli sweetness and fig honey are unparalleled."
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-gray-100 flex items-center justify-between">
                <div>
                  <span className="font-bold text-sm text-[#1B4332] block">R. Rajesh Kumar</span>
                  <span className="text-xs text-gray-500">Coimbatore</span>
                </div>
                <span className="text-[11px] font-semibold text-primary bg-[#E8F5E9] px-2 py-0.5 rounded-full border border-[#C8E6C9]">
                  Verified Order
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 7. QUICK ACTION FOOTER CTA */}
      <section className="py-12 bg-[#E8F5E9] border-t border-[#C8E6C9] text-center">
        <div className="max-w-4xl mx-auto px-4 space-y-4">
          <h3 className="font-serif text-2xl font-bold text-[#1B4332]">
            Ready to Taste Pure Farm Fresh Harvest?
          </h3>
          <p className="text-xs text-[#2D5A32] max-w-lg mx-auto">
            Order directly from our farm in Alagarkovil or track an existing harvest order in real time.
          </p>
          <div className="flex flex-wrap justify-center gap-3 pt-2">
            <Link
              to="/products"
              className="bg-primary hover:bg-primary-hover text-white text-xs font-bold px-6 py-3 rounded-xl shadow transition-colors"
            >
              Browse All Products
            </Link>
            <Link
              to="/track-order"
              className="bg-white hover:bg-gray-50 text-[#1B4332] border border-[#C8E6C9] text-xs font-bold px-6 py-3 rounded-xl shadow-sm transition-colors"
            >
              Track Your Order
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

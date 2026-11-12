import React from 'react';
import { Link } from 'react-router-dom';
import {
  Sprout,
  HeartHandshake,
  ShieldCheck,
  MapPin,
  Phone,
  Mail,
  MessageCircle,
  ExternalLink,
  ArrowRight,
  Sun,
  Droplets,
  Truck,
  CheckCircle2,
} from 'lucide-react';
import {
  BRAND_EMAIL,
  DISPLAY_PHONE,
  FARM_LOCATION,
  GOOGLE_MAPS_LINK,
  getWhatsAppUrl,
  WHATSAPP_PHONE,
} from '../utils/whatsapp';

export const About: React.FC = () => {
  return (
    <div className="min-h-screen bg-cream">
      {/* Hero Header - Light Green Nature Palette */}
      <section className="bg-gradient-to-b from-[#EBF7EE] via-[#F4FAF5] to-[#FDFBF7] text-darktext py-16 sm:py-20 relative overflow-hidden border-b border-[#C8E6C9]">
        <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#388E3C_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative text-center">
          <div className="inline-flex items-center gap-2 bg-white px-3.5 py-1.5 rounded-full text-primary text-xs font-semibold uppercase tracking-wider mb-4 border border-[#C8E6C9] shadow-sm">
            <Sprout className="w-3.5 h-3.5 text-primary" />
            <span>Cultivating Purity in South Tamil Nadu</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-5xl font-bold tracking-tight text-[#1B4332]">
            The Ponivraa Heritage
          </h1>
          <p className="mt-4 text-[#2D5A32] max-w-2xl mx-auto text-sm sm:text-base leading-relaxed font-normal">
            Founded on the foothills of Alagarkovil, we unite quarter of a century of agrarian expertise with an uncompromising pledge to deliver clean, unadulterated fruit and honey harvests.
          </p>
        </div>
      </section>

      {/* Main Brand Story Section */}
      <section className="py-16 sm:py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Image composition */}
          <div className="lg:col-span-5 relative">
            <div className="rounded-3xl overflow-hidden shadow-xl aspect-[4/5] bg-[#E8F5E9] border-4 border-white">
              <img
                src="https://images.unsplash.com/photo-1601493700631-2b16ec4b4716?auto=format&fit=crop&w=900&q=85"
                alt="Alagarkovil Mango Orchard"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute -bottom-6 -right-6 bg-secondary text-primary p-5 rounded-2xl shadow-xl border border-yellow-300 max-w-xs">
              <span className="block font-serif text-3xl font-extrabold text-accent">25+ Years</span>
              <span className="text-xs font-bold text-darktext mt-0.5 block">
                Continuous Farming Lineage in Alagarkovil
              </span>
            </div>
          </div>

          {/* Narrative */}
          <div className="lg:col-span-7 space-y-5">
            <div className="inline-flex items-center gap-1.5 bg-[#E8F5E9] text-primary text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider border border-[#C8E6C9]">
              <span>Authentic Agrarian Roots</span>
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#1B4332]">
              Born from the Sacred Soil of Alagarkovil
            </h2>
            <p className="text-sm text-gray-700 leading-relaxed">
              Nestled at the base of the sacred Alagar hills in Madurai district, our groves have been tended with reverence for more than 25 years. The unique microclimate — marked by warm sunny days, cool hillside evenings, and rich mineral-dense red loam soil — creates the optimal conditions for slow-matured, intensely sweet fruit and pure hill honey.
            </p>
            <p className="text-sm text-gray-700 leading-relaxed">
              For decades, traditional fruit supply chains forced honest farmers to sell at steep discounts to middlemen, while consumers in cities paid inflated prices for fruits artificially ripened with hazardous chemicals. Ponivraa was founded to shatter this archaic system.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
              <div className="bg-white p-4 rounded-xl border border-[#C8E6C9]/60 shadow-sm flex items-start gap-3">
                <Sun className="w-5 h-5 text-accent shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-xs text-[#1B4332] uppercase">Carbide-Free</h4>
                  <p className="text-xs text-gray-500 mt-1">Fruits mature naturally without calcium carbide or toxic ripening agents.</p>
                </div>
              </div>

              <div className="bg-white p-4 rounded-xl border border-[#C8E6C9]/60 shadow-sm flex items-start gap-3">
                <Droplets className="w-5 h-5 text-accent shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-xs text-[#1B4332] uppercase">Pure Hill Aquifers</h4>
                  <p className="text-xs text-gray-500 mt-1">Nourished by pristine groundwater descending from the Alagar hillside.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Direct-From-Farmer Model & Support Local Farmers */}
      <section className="py-16 bg-white border-y border-[#C8E6C9]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto space-y-3 mb-14">
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#1B4332]">
              The Direct-from-Farmer Movement
            </h2>
            <p className="text-sm text-[#2D5A32] leading-relaxed">
              Every order you place with Ponivraa empowers agricultural families in South Tamil Nadu, guaranteeing dignified wages and keeping agrarian heritage thriving.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Pillar 1 */}
            <div className="bg-[#F4FAF5] p-8 rounded-2xl border border-[#C8E6C9] text-center space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-[#E8F5E9] text-primary flex items-center justify-center mx-auto border border-[#C8E6C9]">
                <HeartHandshake className="w-7 h-7 text-primary" />
              </div>
              <h3 className="font-bold text-lg text-[#1B4332]">Zero Middlemen Markups</h3>
              <p className="text-xs text-gray-600 leading-relaxed">
                100% of fair value flows directly to the farmers who tend the land day and night.
              </p>
            </div>

            {/* Pillar 2 */}
            <div className="bg-[#F4FAF5] p-8 rounded-2xl border border-[#C8E6C9] text-center space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-[#E8F5E9] text-primary flex items-center justify-center mx-auto border border-[#C8E6C9]">
                <ShieldCheck className="w-7 h-7 text-primary" />
              </div>
              <h3 className="font-bold text-lg text-[#1B4332]">0% Chemical Guarantee</h3>
              <p className="text-xs text-gray-600 leading-relaxed">
                No harmful ripening chemicals, no artificial shine, and no wax coating. Just naturally fresh mangoes for your whole family, from kids to elders.
              </p>
            </div>

            {/* Pillar 3 */}
            <div className="bg-[#F4FAF5] p-8 rounded-2xl border border-[#C8E6C9] text-center space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-[#E8F5E9] text-primary flex items-center justify-center mx-auto border border-[#C8E6C9]">
                <Truck className="w-7 h-7 text-primary" />
              </div>
              <h3 className="font-bold text-lg text-[#1B4332]">Safe Delivery Across India</h3>
              <p className="text-xs text-gray-600 leading-relaxed">
                Fresh mangoes, carefully packed and safely delivered to your doorstep anywhere in India, with their natural freshness and taste preserved.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Farm Location & Direct Contacts */}
      <section className="py-16 sm:py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl border border-[#C8E6C9] shadow-sm p-8 sm:p-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7 space-y-5">
              <div className="inline-flex items-center gap-1.5 bg-[#E8F5E9] text-primary font-bold text-xs px-3 py-1 rounded-full uppercase tracking-wider border border-[#C8E6C9]">
                <MapPin className="w-3.5 h-3.5 text-primary" />
                <span>Farm Grounds</span>
              </div>
              <h3 className="font-serif text-3xl font-bold text-[#1B4332]">
                Visit Us at Alagarkovil, Tamil Nadu
              </h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                We take immense pride in transparency. Our farm gates in Alagarkovil welcome visitors during harvest seasons. Contact our team to book farm tours or place immediate bulk fruit reservations.
              </p>

              <div className="space-y-3 pt-2 text-sm text-gray-700">
                <div className="flex items-center gap-3">
                  <MapPin className="w-5 h-5 text-primary shrink-0" />
                  <span>{FARM_LOCATION}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="w-5 h-5 text-primary shrink-0" />
                  <a href={`tel:${WHATSAPP_PHONE}`} className="hover:text-primary font-semibold">
                    {DISPLAY_PHONE}
                  </a>
                </div>
                <div className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-primary shrink-0" />
                  <a href={`mailto:${BRAND_EMAIL}`} className="hover:text-primary font-semibold">
                    {BRAND_EMAIL}
                  </a>
                </div>
              </div>

              <div className="flex flex-wrap gap-4 pt-4">
                <a
                  href={getWhatsAppUrl('Hello Ponivraa team, I would like to enquire about your farm in Alagarkovil.')}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-primary hover:bg-primary-hover text-white font-bold text-sm px-6 py-3.5 rounded-xl shadow transition-colors"
                >
                  <MessageCircle className="w-4 h-4 fill-white" />
                  <span>Connect on WhatsApp</span>
                </a>

                <a
                  href={GOOGLE_MAPS_LINK}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-[#F4FAF5] hover:bg-[#E8F5E9] text-[#1B4332] font-bold text-sm px-6 py-3.5 rounded-xl border border-[#C8E6C9] transition-colors"
                >
                  <ExternalLink className="w-4 h-4 text-primary" />
                  <span>Open Google Maps</span>
                </a>
              </div>
            </div>

            <div className="lg:col-span-5 bg-[#F4FAF5] rounded-2xl p-6 border border-[#C8E6C9] space-y-4">
              <h4 className="font-bold text-base text-[#1B4332]">Farm Fresh Highlights</h4>
              <ul className="space-y-2.5 text-xs text-gray-700">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-primary" />
                  <span>Same-day harvest packing at orchard dispatch center</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-primary" />
                  <span>Cushioned corrugated fruit boxes for zero impact</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-primary" />
                  <span>Direct phone coordination with farm team</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-primary" />
                  <span>Free delivery across Tamil Nadu</span>
                </li>
              </ul>
              <div className="pt-2">
                <Link
                  to="/products"
                  className="w-full inline-flex items-center justify-center gap-2 bg-primary text-white text-xs font-bold py-3 rounded-xl hover:bg-primary-hover transition-colors shadow-sm"
                >
                  <span>Browse Today's Harvest</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

import React from 'react';
import { Link } from 'react-router-dom';
import {
  MapPin,
  Phone,
  Mail,
  MessageCircle,
  ExternalLink,
  ShieldCheck,
  Sprout,
  HeartHandshake,
  Clock,
  ArrowRight,
} from 'lucide-react';
import {
  BRAND_EMAIL,
  DISPLAY_PHONE,
  FARM_LOCATION,
  GOOGLE_MAPS_LINK,
  getWhatsAppUrl,
  WHATSAPP_PHONE,
} from '../utils/whatsapp';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-[#F4FAF5] text-darktext border-t-4 border-primary">
      {/* Top Value Banner */}
      <div className="bg-[#E8F5E9] py-6 border-b border-[#C8E6C9]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-3">
              <div className="w-10 h-10 rounded-full bg-white border border-[#C8E6C9] flex items-center justify-center text-primary shadow-sm">
                <Sprout className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h4 className="font-bold text-sm text-[#1B4332]">Direct From Soil</h4>
                <p className="text-xs text-[#2D5A32]">Foothill orchards in Alagarkovil, Tamil Nadu</p>
              </div>
            </div>

            <div className="flex items-center justify-center md:justify-start gap-3">
              <div className="w-10 h-10 rounded-full bg-white border border-[#C8E6C9] flex items-center justify-center text-primary shadow-sm">
                <HeartHandshake className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h4 className="font-bold text-sm text-[#1B4332]">Direct-to-Consumer</h4>
                <p className="text-xs text-[#2D5A32]">Zero middlemen, fair pricing for local farmers</p>
              </div>
            </div>

            <div className="flex items-center justify-center md:justify-start gap-3">
              <div className="w-10 h-10 rounded-full bg-white border border-[#C8E6C9] flex items-center justify-center text-primary shadow-sm">
                <Clock className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h4 className="font-bold text-sm text-[#1B4332]">Daybreak Harvest</h4>
                <p className="text-xs text-[#2D5A32]">Delivered at peak natural sweetness and freshness</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links with React Router Link */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand Info */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full overflow-hidden bg-white border border-[#C8E6C9] flex items-center justify-center shadow-sm">
                <img
                  src="/logo.jpg"
                  alt="Ponivraa Logo"
                  className="w-full h-full object-contain"
                />
              </div>
              <div>
                <span className="font-serif text-2xl font-bold tracking-tight text-[#1B4332] block">
                  Ponivraa
                </span>
                <span className="text-[10px] font-semibold tracking-wider uppercase text-primary">
                  Pure • Natural • Straight from Soil
                </span>
              </div>
            </div>
            <p className="text-[#2D5A32] text-sm leading-relaxed">
              Rooted in the fertile soil of Alagarkovil, Tamil Nadu. Backed by 25+ years of dedicated farming experience, bringing naturally grown mangoes, pure raw honey, and native guavas straight to your dining table.
            </p>
            <div className="pt-2">
              <a
                href={getWhatsAppUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-primary hover:bg-primary-hover text-white px-4 py-2 rounded-xl text-xs font-semibold shadow-sm transition-all duration-200 cursor-pointer"
              >
                <MessageCircle className="w-4 h-4 fill-white" />
                <span>Chat: {DISPLAY_PHONE}</span>
              </a>
            </div>
          </div>

          {/* Quick Navigation Links */}
          <div>
            <h3 className="text-[#1B4332] font-bold mb-4 tracking-wider uppercase text-xs">
              Navigation
            </h3>
            <ul className="space-y-2.5 text-sm text-[#2D5A32]">
              <li>
                <Link
                  to="/"
                  className="hover:text-[#1B4332] hover:underline transition-colors flex items-center gap-1.5"
                >
                  <ArrowRight className="w-3.5 h-3.5 text-primary" />
                  <span>Home</span>
                </Link>
              </li>
              <li>
                <Link
                  to="/about"
                  className="hover:text-[#1B4332] hover:underline transition-colors flex items-center gap-1.5"
                >
                  <ArrowRight className="w-3.5 h-3.5 text-primary" />
                  <span>About Ponivraa</span>
                </Link>
              </li>
              <li>
                <Link
                  to="/products"
                  className="hover:text-[#1B4332] hover:underline transition-colors flex items-center gap-1.5"
                >
                  <ArrowRight className="w-3.5 h-3.5 text-primary" />
                  <span>All Products</span>
                </Link>
              </li>
              <li>
                <Link
                  to="/track-order"
                  className="hover:text-[#1B4332] hover:underline transition-colors flex items-center gap-1.5"
                >
                  <ArrowRight className="w-3.5 h-3.5 text-primary" />
                  <span>Track Your Order</span>
                </Link>
              </li>
              <li>
                <Link
                  to="/contact"
                  className="hover:text-[#1B4332] hover:underline transition-colors flex items-center gap-1.5"
                >
                  <ArrowRight className="w-3.5 h-3.5 text-primary" />
                  <span>Contact & Visit Farm</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Harvest Categories: ONLY Mango, Honey, Guava */}
          <div>
            <h3 className="text-[#1B4332] font-bold mb-4 tracking-wider uppercase text-xs">
              Farm Harvest
            </h3>
            <ul className="space-y-2.5 text-sm text-[#2D5A32]">
              <li>
                <Link
                  to="/products?category=Mango"
                  className="hover:text-[#1B4332] hover:underline transition-colors flex items-center gap-1.5"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-primary"></span>
                  <span>South Farm Mangoes (Alphonso, Banganapalli, Kallaamai)</span>
                </Link>
              </li>
              <li>
                <Link
                  to="/products?category=Honey"
                  className="hover:text-[#1B4332] hover:underline transition-colors flex items-center gap-1.5"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-primary"></span>
                  <span>Pure Raw Hill Honey (Gulkand, Fig, Dry Fruits, Hill Honey)</span>
                </Link>
              </li>
              <li>
                <Link
                  to="/products?category=Guava"
                  className="hover:text-[#1B4332] hover:underline transition-colors flex items-center gap-1.5"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-primary"></span>
                  <span>Alagarkovil White & Pink Guavas (Koyya)</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Farm Contact Details */}
          <div>
            <h3 className="text-[#1B4332] font-bold mb-4 tracking-wider uppercase text-xs">
              Farm Contact
            </h3>
            <ul className="space-y-3 text-sm text-[#2D5A32]">
              <li className="flex items-start gap-2.5">
                <MapPin className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                <div>
                  <span className="block font-medium text-[#1B4332]">{FARM_LOCATION}</span>
                  <a
                    href={GOOGLE_MAPS_LINK}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-xs text-primary hover:underline mt-1 font-semibold"
                  >
                    <span>View on Google Maps</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-primary shrink-0" />
                <a href={`tel:${WHATSAPP_PHONE}`} className="hover:text-[#1B4332] transition-colors">
                  {DISPLAY_PHONE}
                </a>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-primary shrink-0" />
                <a href={`mailto:${BRAND_EMAIL}`} className="hover:text-[#1B4332] transition-colors">
                  {BRAND_EMAIL}
                </a>
              </li>
              <li className="pt-2 border-t border-[#C8E6C9]">
                <Link
                  to="/admin"
                  className="inline-flex items-center gap-1.5 text-xs text-[#2E7D32] hover:text-[#1B4332] font-semibold"
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-primary" />
                  <span>Admin Management Panel</span>
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-[#C8E6C9] flex flex-col sm:flex-row items-center justify-between text-xs text-[#4A7C59] gap-4">
          <p>
            © {new Date().getFullYear()} Ponivraa. All rights reserved. Cultivated with integrity in Alagarkovil, Tamil Nadu.
          </p>
          <div className="flex items-center space-x-6 font-medium">
            <span>0% Chemicals</span>
            <span>•</span>
            <span>Naturally Ripened</span>
            <span>•</span>
            <span>Direct to Consumer</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

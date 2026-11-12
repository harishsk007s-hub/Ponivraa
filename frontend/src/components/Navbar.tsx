import React, { useState, useRef } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import {
  ShoppingBag,
  Menu,
  X,
  MessageCircle,
  ShieldCheck,
  Sprout,
  ChevronDown,
  ChevronRight,
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { getWhatsAppUrl } from '../utils/whatsapp';

const PRODUCT_CATEGORIES = [
  {
    name: 'Mango',
    path: '/products?category=Mango',
    description: 'Alphonso, Banganapalli, Kallaamai',
  },
  {
    name: 'Honey',
    path: '/products?category=Honey',
    description: 'Raw Hill, Gulkand, Fig, Dry Fruits',
  },
  {
    name: 'Guava',
    path: '/products?category=Guava',
    description: 'Fresh Country White & Pink',
  },
];

export const Navbar: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileCategoriesOpen, setMobileCategoriesOpen] = useState(true);
  const [isProductsDropdownOpen, setIsProductsDropdownOpen] = useState(false);

  const dropdownTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const { totalItems } = useCart();
  const location = useLocation();

  const handleMouseEnter = () => {
    if (dropdownTimeoutRef.current) {
      clearTimeout(dropdownTimeoutRef.current);
      dropdownTimeoutRef.current = null;
    }
    setIsProductsDropdownOpen(true);
  };

  const handleMouseLeave = () => {
    dropdownTimeoutRef.current = setTimeout(() => {
      setIsProductsDropdownOpen(false);
    }, 120);
  };

  const isProductsActive = location.pathname.startsWith('/products');

  return (
    <header className="sticky top-0 z-50 bg-[#F4FAF5] text-darktext shadow-sm border-b border-[#C8E6C9] backdrop-blur-md transition-all duration-200">
      {/* Top micro banner */}
      <div className="bg-[#E8F5E9] text-xs py-1.5 px-4 text-center text-[#1E4620] border-b border-[#C8E6C9]">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-1.5 mx-auto sm:mx-0 font-medium">
            <Sprout className="w-3.5 h-3.5 text-primary" />
            <span>Farm-Fresh Harvest from Alagarkovil, Tamil Nadu • 0% Chemicals</span>
          </div>
          <div className="hidden sm:flex items-center gap-4 text-[#2E7D32]">
            <NavLink
              to="/track-order"
              className="hover:text-[#1B4332] font-semibold transition-colors"
            >
              Track Order
            </NavLink>
            <span className="text-[#A5D6A7]">|</span>
            <Link
              to="/admin"
              className="flex items-center gap-1 hover:text-[#1B4332] transition-colors text-xs font-semibold"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-primary" />
              <span>Admin Portal</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Brand Logo */}
          <Link
            to="/"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-3 group"
          >
            <div className="w-12 h-12 rounded-full overflow-hidden bg-white border-2 border-[#C8E6C9] flex items-center justify-center shadow-sm group-hover:scale-105 group-hover:border-primary transition-all duration-200">
              <img
                src="/logo.jpg"
                alt="Ponivraa Logo"
                className="w-full h-full object-contain"
              />
            </div>
            <div className="flex flex-col">
              <span className="font-serif text-2xl font-bold tracking-tight text-[#1B4332] leading-none">
                Ponivraa
              </span>
              <span className="text-[11px] font-semibold tracking-widest uppercase text-primary mt-1">
                Farm-Fresh • Alagarkovil
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center space-x-1 lg:space-x-2">
            {/* Home */}
            <NavLink
              to="/"
              end
              className={({ isActive }) =>
                `px-3.5 py-2 rounded-xl text-sm font-semibold transition-all duration-150 ${
                  isActive
                    ? 'bg-[#E8F5E9] text-[#1B4332] shadow-sm font-bold ring-1 ring-[#C8E6C9]'
                    : 'text-[#2D5A32] hover:text-[#1B4332] hover:bg-[#E8F5E9]'
                }`
              }
            >
              Home
            </NavLink>

            {/* About */}
            <NavLink
              to="/about"
              className={({ isActive }) =>
                `px-3.5 py-2 rounded-xl text-sm font-semibold transition-all duration-150 ${
                  isActive
                    ? 'bg-[#E8F5E9] text-[#1B4332] shadow-sm font-bold ring-1 ring-[#C8E6C9]'
                    : 'text-[#2D5A32] hover:text-[#1B4332] hover:bg-[#E8F5E9]'
                }`
              }
            >
              About
            </NavLink>

            {/* Products with Hover Dropdown Card */}
            <div
              className="relative"
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            >
              <NavLink
                to="/products"
                className={() =>
                  `px-3.5 py-2 rounded-xl text-sm font-semibold inline-flex items-center gap-1.5 transition-all duration-150 ${
                    isProductsActive || isProductsDropdownOpen
                      ? 'bg-[#E8F5E9] text-[#1B4332] shadow-sm font-bold ring-1 ring-[#C8E6C9]'
                      : 'text-[#2D5A32] hover:text-[#1B4332] hover:bg-[#E8F5E9]'
                  }`
                }
              >
                <span>Products</span>
                <ChevronDown
                  className={`w-3.5 h-3.5 transition-transform duration-200 ${
                    isProductsDropdownOpen ? 'rotate-180 text-primary' : 'text-[#4A7C59]'
                  }`}
                />
              </NavLink>

              {/* Clean White Dropdown Card with Soft Shadow and Rounded Corners */}
              {isProductsDropdownOpen && (
                <div className="absolute top-full left-0 pt-2 w-64 z-50">
                  <div className="bg-white rounded-2xl shadow-xl border border-[#C8E6C9] p-2 text-darktext ring-1 ring-black/5">
                    <div className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-[#4A7C59] border-b border-[#E8F5E9] mb-1 flex items-center justify-between">
                      <span>Harvest Categories</span>
                      <span className="text-primary text-[10px] font-medium">Alagarkovil</span>
                    </div>

                    <div className="space-y-0.5">
                      {PRODUCT_CATEGORIES.map((cat) => (
                        <Link
                          key={cat.name}
                          to={cat.path}
                          onClick={() => setIsProductsDropdownOpen(false)}
                          className="flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold text-[#2D5A32] hover:bg-[#E8F5E9] hover:text-[#1B4332] transition-all duration-150 group/item cursor-pointer"
                        >
                          <div className="flex items-center gap-2.5">
                            <span className="w-2 h-2 rounded-full bg-primary group-hover/item:scale-125 transition-transform" />
                            <div>
                              <span className="font-bold block text-[#1B4332] group-hover/item:text-primary">
                                {cat.name}
                              </span>
                              <span className="text-[10px] text-gray-500 block font-normal">
                                {cat.description}
                              </span>
                            </div>
                          </div>
                          <ChevronRight className="w-3.5 h-3.5 text-gray-400 group-hover/item:text-primary group-hover/item:translate-x-0.5 transition-all shrink-0" />
                        </Link>
                      ))}
                    </div>

                    <div className="border-t border-[#E8F5E9] mt-1.5 pt-1.5">
                      <Link
                        to="/products"
                        onClick={() => setIsProductsDropdownOpen(false)}
                        className="flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold text-primary hover:bg-[#E8F5E9] transition-colors cursor-pointer"
                      >
                        <span>View All Products</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Track Order */}
            <NavLink
              to="/track-order"
              className={({ isActive }) =>
                `px-3.5 py-2 rounded-xl text-sm font-semibold transition-all duration-150 ${
                  isActive
                    ? 'bg-[#E8F5E9] text-[#1B4332] shadow-sm font-bold ring-1 ring-[#C8E6C9]'
                    : 'text-[#2D5A32] hover:text-[#1B4332] hover:bg-[#E8F5E9]'
                }`
              }
            >
              Track Order
            </NavLink>

            {/* Contact */}
            <NavLink
              to="/contact"
              className={({ isActive }) =>
                `px-3.5 py-2 rounded-xl text-sm font-semibold transition-all duration-150 ${
                  isActive
                    ? 'bg-[#E8F5E9] text-[#1B4332] shadow-sm font-bold ring-1 ring-[#C8E6C9]'
                    : 'text-[#2D5A32] hover:text-[#1B4332] hover:bg-[#E8F5E9]'
                }`
              }
            >
              Contact
            </NavLink>
          </nav>

          {/* Right Action Buttons */}
          <div className="hidden md:flex items-center space-x-3">
            {/* WhatsApp Direct Action */}
            <a
              href={getWhatsAppUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-primary hover:bg-primary-hover text-white px-4 py-2.5 rounded-xl text-sm font-semibold shadow-sm transition-all duration-200 active:scale-95"
            >
              <MessageCircle className="w-4 h-4 fill-white" />
              <span>WhatsApp Order</span>
            </a>

            {/* Cart Icon */}
            <Link
              to="/cart"
              className="relative p-2.5 rounded-xl text-[#1B4332] hover:bg-[#E8F5E9] border border-transparent hover:border-[#C8E6C9] transition-colors"
              title="Shopping Cart"
            >
              <ShoppingBag className="w-6 h-6" />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-accent text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center shadow">
                  {totalItems}
                </span>
              )}
            </Link>
          </div>

          {/* Mobile Right Controls */}
          <div className="flex items-center space-x-2 md:hidden">
            <Link
              to="/cart"
              className="relative p-2 rounded-xl text-[#1B4332] hover:bg-[#E8F5E9]"
              aria-label="View Cart"
            >
              <ShoppingBag className="w-6 h-6" />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-accent text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </Link>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-[#1B4332] hover:bg-[#E8F5E9] focus:outline-none"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#F4FAF5] border-t border-[#C8E6C9] px-4 pt-3 pb-6 space-y-2">
          {/* Home */}
          <NavLink
            to="/"
            end
            onClick={() => setMobileMenuOpen(false)}
            className={({ isActive }) =>
              `w-full text-left block px-3 py-2.5 rounded-xl text-base font-semibold transition-colors ${
                isActive
                  ? 'bg-[#E8F5E9] text-[#1B4332] font-bold ring-1 ring-[#C8E6C9]'
                  : 'text-[#2D5A32] hover:bg-[#E8F5E9] hover:text-[#1B4332]'
              }`
            }
          >
            Home
          </NavLink>

          {/* About */}
          <NavLink
            to="/about"
            onClick={() => setMobileMenuOpen(false)}
            className={({ isActive }) =>
              `w-full text-left block px-3 py-2.5 rounded-xl text-base font-semibold transition-colors ${
                isActive
                  ? 'bg-[#E8F5E9] text-[#1B4332] font-bold ring-1 ring-[#C8E6C9]'
                  : 'text-[#2D5A32] hover:bg-[#E8F5E9] hover:text-[#1B4332]'
              }`
            }
          >
            About
          </NavLink>

          {/* Products with expandable accordion on Mobile */}
          <div className="space-y-1">
            <div className="flex items-center justify-between rounded-xl overflow-hidden bg-[#E8F5E9] border border-[#C8E6C9]">
              <NavLink
                to="/products"
                onClick={() => setMobileMenuOpen(false)}
                className={() =>
                  `flex-1 text-left px-3 py-2.5 text-base font-semibold transition-colors ${
                    isProductsActive
                      ? 'text-[#1B4332] font-bold'
                      : 'text-[#2D5A32] hover:text-[#1B4332]'
                  }`
                }
              >
                Products
              </NavLink>

              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setMobileCategoriesOpen(!mobileCategoriesOpen);
                }}
                className="px-3.5 py-2.5 text-[#2D5A32] hover:text-[#1B4332] hover:bg-[#D5EED8] transition-colors"
                aria-label="Toggle Products Submenu"
              >
                <ChevronDown
                  className={`w-4 h-4 transition-transform duration-200 ${
                    mobileCategoriesOpen ? 'rotate-180 text-primary' : ''
                  }`}
                />
              </button>
            </div>

            {/* Expandable sublinks: Mango, Honey, Guava */}
            {mobileCategoriesOpen && (
              <div className="pl-4 pr-1 py-1.5 space-y-1 bg-white rounded-xl border border-[#C8E6C9] my-1">
                {PRODUCT_CATEGORIES.map((cat) => (
                  <NavLink
                    key={cat.name}
                    to={cat.path}
                    onClick={() => setMobileMenuOpen(false)}
                    className={() => {
                      const isActiveSub =
                        location.pathname === '/products' &&
                        location.search.includes(`category=${cat.name}`);
                      return `block px-3 py-2 rounded-lg text-sm font-semibold transition-colors flex items-center justify-between ${
                        isActiveSub
                          ? 'bg-[#E8F5E9] text-[#1B4332] font-bold'
                          : 'text-[#2D5A32] hover:bg-[#E8F5E9] hover:text-[#1B4332]'
                      }`;
                    }}
                  >
                    <div className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                      <span>{cat.name}</span>
                    </div>
                    <span className="text-[10px] text-gray-500 font-normal">
                      {cat.name === 'Mango' ? 'Fresh' : cat.name === 'Honey' ? 'Raw' : 'Country'}
                    </span>
                  </NavLink>
                ))}

                <NavLink
                  to="/products"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3 py-1.5 text-xs text-primary hover:underline font-bold border-t border-gray-100 pt-2"
                >
                  View All Products →
                </NavLink>
              </div>
            )}
          </div>

          {/* Track Order */}
          <NavLink
            to="/track-order"
            onClick={() => setMobileMenuOpen(false)}
            className={({ isActive }) =>
              `w-full text-left block px-3 py-2.5 rounded-xl text-base font-semibold transition-colors ${
                isActive
                  ? 'bg-[#E8F5E9] text-[#1B4332] font-bold ring-1 ring-[#C8E6C9]'
                  : 'text-[#2D5A32] hover:bg-[#E8F5E9] hover:text-[#1B4332]'
              }`
            }
          >
            Track Order
          </NavLink>

          {/* Contact */}
          <NavLink
            to="/contact"
            onClick={() => setMobileMenuOpen(false)}
            className={({ isActive }) =>
              `w-full text-left block px-3 py-2.5 rounded-xl text-base font-semibold transition-colors ${
                isActive
                  ? 'bg-[#E8F5E9] text-[#1B4332] font-bold ring-1 ring-[#C8E6C9]'
                  : 'text-[#2D5A32] hover:bg-[#E8F5E9] hover:text-[#1B4332]'
              }`
            }
          >
            Contact
          </NavLink>

          {/* WhatsApp & Admin Portal Links */}
          <div className="pt-3 border-t border-[#C8E6C9] space-y-2">
            <a
              href={getWhatsAppUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full bg-primary hover:bg-primary-hover text-white py-2.5 rounded-xl font-semibold text-sm shadow-sm"
            >
              <MessageCircle className="w-4 h-4 fill-white" />
              <span>Order via WhatsApp (+91 80982 02289)</span>
            </a>

            <Link
              to="/admin"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-center gap-2 text-xs text-[#2E7D32] hover:text-[#1B4332] py-1.5 font-semibold"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Admin Login Portal</span>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};

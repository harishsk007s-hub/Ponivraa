import React, { useState } from 'react';
import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  MessageSquare,
  LogOut,
  ExternalLink,
  Sprout,
  ShieldCheck,
  Menu,
  X,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const AdminLayout: React.FC = () => {
  const { admin, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/admin/login', { replace: true });
  };

  const navItems = [
    { label: 'Dashboard', path: '/admin', end: true, icon: LayoutDashboard },
    { label: 'Products', path: '/admin/products', end: false, icon: Package },
    { label: 'Orders', path: '/admin/orders', end: false, icon: ShoppingBag },
    { label: 'Enquiries', path: '/admin/enquiries', end: false, icon: MessageSquare },
  ];

  return (
    <div className="min-h-screen bg-[#FDFBF7] flex flex-col font-sans">
      {/* Top Admin Navigation Header - Nature Light Green Theme */}
      <header className="bg-[#F4FAF5] text-darktext border-b border-[#C8E6C9] sticky top-0 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Left Brand */}
            <div className="flex items-center gap-3">
              <Link to="/admin" className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-full overflow-hidden bg-white border border-[#C8E6C9] flex items-center justify-center shadow-sm">
                  <img
                    src="/logo.jpg"
                    alt="Ponivraa Logo"
                    className="w-full h-full object-contain"
                  />
                </div>
                <div>
                  <span className="font-serif font-bold text-lg leading-none block text-[#1B4332]">Ponivraa</span>
                  <span className="text-[10px] text-primary font-semibold tracking-wider uppercase">
                    Admin Portal
                  </span>
                </div>
              </Link>
            </div>

            {/* Desktop Navigation Tabs */}
            <nav className="hidden md:flex items-center space-x-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    end={item.end}
                    className={({ isActive }) =>
                      `px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-colors ${
                        isActive
                          ? 'bg-[#E8F5E9] text-[#1B4332] shadow-sm ring-1 ring-[#C8E6C9]'
                          : 'text-[#2D5A32] hover:text-[#1B4332] hover:bg-[#E8F5E9]'
                      }`
                    }
                  >
                    <Icon className="w-4 h-4 text-primary" />
                    <span>{item.label}</span>
                  </NavLink>
                );
              })}
            </nav>

            {/* Right Admin Profile & Actions */}
            <div className="hidden md:flex items-center gap-4">
              <Link
                to="/"
                target="_blank"
                className="text-xs text-[#2D5A32] hover:text-[#1B4332] flex items-center gap-1 font-semibold transition-colors"
                title="View Live Storefront"
              >
                <span>View Store</span>
                <ExternalLink className="w-3.5 h-3.5 text-primary" />
              </Link>

              <div className="h-4 w-px bg-[#C8E6C9]" />

              <div className="flex items-center gap-3">
                <div className="text-right">
                  <span className="block text-xs font-bold text-[#1B4332] leading-none">
                    {admin?.name || 'Admin'}
                  </span>
                  <span className="text-[10px] text-[#4A7C59]">
                    {admin?.email}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={handleLogout}
                  className="p-2 rounded-xl bg-[#E8F5E9] hover:bg-rose-100 text-[#2D5A32] hover:text-rose-700 transition-colors border border-[#C8E6C9]"
                  title="Logout"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Mobile Hamburger */}
            <div className="md:hidden flex items-center gap-2">
              <button
                onClick={() => setMobileNavOpen(!mobileNavOpen)}
                className="p-2 text-[#1B4332] hover:bg-[#E8F5E9] rounded-xl"
              >
                {mobileNavOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile dropdown */}
        {mobileNavOpen && (
          <div className="md:hidden bg-[#F4FAF5] px-4 pt-2 pb-4 space-y-1 border-t border-[#C8E6C9]">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  end={item.end}
                  onClick={() => setMobileNavOpen(false)}
                  className={({ isActive }) =>
                    `block px-3 py-2 rounded-xl text-sm font-bold flex items-center gap-2 ${
                      isActive ? 'bg-[#E8F5E9] text-[#1B4332] ring-1 ring-[#C8E6C9]' : 'text-[#2D5A32]'
                    }`
                  }
                >
                  <Icon className="w-4 h-4 text-primary" />
                  <span>{item.label}</span>
                </NavLink>
              );
            })}

            <div className="pt-3 border-t border-[#C8E6C9] flex items-center justify-between">
              <Link
                to="/"
                onClick={() => setMobileNavOpen(false)}
                className="text-xs text-[#2D5A32] flex items-center gap-1 font-semibold"
              >
                <span>View Store</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </Link>
              <button
                onClick={handleLogout}
                className="text-xs text-rose-600 font-bold flex items-center gap-1"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        )}
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Outlet />
      </main>
    </div>
  );
};

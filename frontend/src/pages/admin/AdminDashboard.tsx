import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Package,
  ShoppingBag,
  Clock,
  CheckCircle2,
  AlertTriangle,
  TrendingUp,
  MessageSquare,
  ArrowRight,
  Plus,
  RefreshCw,
  ExternalLink,
} from 'lucide-react';
import { DashboardStats, Enquiry } from '../../types';
import { api } from '../../api';
import { useAuth } from '../../context/AuthContext';

export const AdminDashboard: React.FC = () => {
  const { token } = useAuth();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);
      const [statsData, enquiryData] = await Promise.all([
        api.getDashboardStats(token || undefined),
        api.getAllEnquiries(token || undefined),
      ]);
      setStats(statsData);
      setEnquiries(enquiryData.enquiries.slice(0, 5));
    } catch (err: any) {
      console.error('Failed to load dashboard:', err);
      setError(err.message || 'Error loading dashboard metrics');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, [token]);

  if (loading) {
    return (
      <div className="py-20 text-center space-y-3">
        <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-xs text-gray-500 font-semibold">Loading farm dashboard...</p>
      </div>
    );
  }

  if (error || !stats) {
    return (
      <div className="bg-rose-50 border border-rose-200 text-rose-700 p-6 rounded-2xl text-center space-y-3">
        <p className="text-sm font-bold">{error || 'Dashboard could not be loaded'}</p>
        <button
          onClick={fetchDashboardData}
          className="bg-primary text-white text-xs font-bold px-4 py-2 rounded-xl"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Top Welcome & Quick Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-darktext">
            Farm Operations Dashboard
          </h1>
          <p className="text-xs text-gray-500 mt-0.5">
            Real-time status of crops, orders, and customer enquiries in Alagarkovil
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={fetchDashboardData}
            className="p-2 rounded-xl bg-white border border-gray-200 text-gray-600 hover:text-primary hover:border-primary transition-colors text-xs font-semibold flex items-center gap-1.5 shadow-sm"
            title="Refresh statistics"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Refresh</span>
          </button>

          <Link
            to="/admin/products"
            className="inline-flex items-center gap-1.5 bg-primary hover:bg-primary-hover text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Manage Produce</span>
          </Link>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Total Products */}
        <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs text-gray-500 font-bold uppercase tracking-wider block">
              Total Products
            </span>
            <span className="text-2xl font-serif font-bold text-darktext mt-1 block">
              {stats.totalProducts}
            </span>
            <span className="text-[11px] text-gray-400 mt-1 block">
              In farm database
            </span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-lightgreen text-primary flex items-center justify-center">
            <Package className="w-6 h-6" />
          </div>
        </div>

        {/* Total Orders */}
        <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs text-gray-500 font-bold uppercase tracking-wider block">
              Total Orders
            </span>
            <span className="text-2xl font-serif font-bold text-darktext mt-1 block">
              {stats.totalOrders}
            </span>
            <span className="text-[11px] text-gray-400 mt-1 block">
              Registered customers
            </span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-secondary text-primary flex items-center justify-center">
            <ShoppingBag className="w-6 h-6 text-accent" />
          </div>
        </div>

        {/* Pending Orders */}
        <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs text-gray-500 font-bold uppercase tracking-wider block">
              Pending Orders
            </span>
            <span className="text-2xl font-serif font-bold text-amber-600 mt-1 block">
              {stats.pendingOrders}
            </span>
            <span className="text-[11px] text-gray-400 mt-1 block">
              Needs packing/shipping
            </span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center border border-amber-200">
            <Clock className="w-6 h-6" />
          </div>
        </div>

        {/* Delivered Orders */}
        <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs text-gray-500 font-bold uppercase tracking-wider block">
              Delivered
            </span>
            <span className="text-2xl font-serif font-bold text-primary mt-1 block">
              {stats.deliveredOrders}
            </span>
            <span className="text-[11px] text-gray-400 mt-1 block">
              Completed successfully
            </span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-lightgreen text-primary flex items-center justify-center">
            <CheckCircle2 className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Secondary Metrics row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-orange-50 text-accent flex items-center justify-center border border-orange-200">
              <TrendingUp className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs text-gray-500 font-bold uppercase">Total Order Value</span>
              <span className="text-xl font-bold text-darktext block">Rs. {stats.totalRevenue}</span>
            </div>
          </div>
          <span className="text-xs font-semibold text-primary bg-lightgreen px-2.5 py-1 rounded-full">
            Tamil Nadu Farm Sales
          </span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center border border-rose-200">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs text-gray-500 font-bold uppercase">Out of Stock Crops</span>
              <span className="text-xl font-bold text-rose-600 block">{stats.outOfStockProducts}</span>
            </div>
          </div>
          <Link
            to="/admin/products"
            className="text-xs font-bold text-primary hover:underline flex items-center gap-1"
          >
            <span>Update stock</span>
            <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
      </div>

      {/* Tables Row: Recent Orders & Recent Enquiries */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Recent Orders (8 cols) */}
        <div className="lg:col-span-8 bg-white rounded-3xl border border-gray-200 shadow-sm p-6 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-gray-100">
            <div>
              <h3 className="font-serif font-bold text-lg text-darktext">Recent Customer Orders</h3>
              <span className="text-xs text-gray-400">Latest produce purchases</span>
            </div>
            <Link
              to="/admin/orders"
              className="text-xs font-bold text-primary hover:underline flex items-center gap-1"
            >
              <span>View All</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {stats.recentOrders && stats.recentOrders.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="text-gray-400 uppercase text-[10px] font-bold tracking-wider border-b border-gray-100">
                    <th className="pb-3">Order ID</th>
                    <th className="pb-3">Customer</th>
                    <th className="pb-3">Items</th>
                    <th className="pb-3">Total</th>
                    <th className="pb-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 font-medium">
                  {stats.recentOrders.map((o) => (
                    <tr key={o._id} className="hover:bg-gray-50 transition-colors">
                      <td className="py-3 font-mono font-bold text-primary">
                        {o.orderId}
                      </td>
                      <td className="py-3">
                        <span className="font-bold text-darktext block">{o.customerName}</span>
                        <span className="text-gray-400 text-[11px]">{o.phone}</span>
                      </td>
                      <td className="py-3 text-gray-600">
                        {o.products.length} fruit {o.products.length > 1 ? 'types' : 'type'}
                      </td>
                      <td className="py-3 font-bold text-accent">
                        Rs. {o.totalAmount}
                      </td>
                      <td className="py-3">
                        <span
                          className={`inline-block px-2.5 py-0.5 rounded-full font-bold text-[10px] ${
                            o.status === 'Delivered'
                              ? 'bg-lightgreen text-primary'
                              : o.status === 'Cancelled'
                              ? 'bg-rose-50 text-rose-700'
                              : 'bg-secondary text-primary'
                          }`}
                        >
                          {o.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-xs text-gray-400 py-6 text-center">No orders registered yet.</p>
          )}
        </div>

        {/* Recent Enquiries (4 cols) */}
        <div className="lg:col-span-4 bg-white rounded-3xl border border-gray-200 shadow-sm p-6 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-gray-100">
            <div>
              <h3 className="font-serif font-bold text-lg text-darktext">Recent Enquiries</h3>
              <span className="text-xs text-gray-400">Contact form messages</span>
            </div>
            <Link
              to="/admin/enquiries"
              className="text-xs font-bold text-primary hover:underline flex items-center gap-1"
            >
              <span>View All</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {enquiries.length > 0 ? (
            <div className="space-y-3">
              {enquiries.map((enq) => (
                <div
                  key={enq._id}
                  className={`p-3 rounded-xl border text-xs space-y-1.5 transition-colors ${
                    enq.isRead
                      ? 'bg-gray-50 border-gray-200'
                      : 'bg-amber-50/60 border-amber-200'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-darktext">{enq.name}</span>
                    {!enq.isRead && (
                      <span className="bg-amber-500 text-white text-[9px] font-bold px-1.5 py-0.2 rounded">
                        NEW
                      </span>
                    )}
                  </div>
                  <p className="text-gray-600 line-clamp-2 leading-relaxed">
                    {enq.message}
                  </p>
                  <span className="text-[10px] text-gray-400 block">
                    Phone: {enq.phone}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-gray-400 py-6 text-center">No enquiries received yet.</p>
          )}
        </div>
      </div>
    </div>
  );
};


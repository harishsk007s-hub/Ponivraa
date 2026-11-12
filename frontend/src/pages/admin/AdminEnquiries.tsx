import React, { useEffect, useState } from 'react';
import {
  MessageSquare,
  Mail,
  Phone,
  Calendar,
  CheckCircle2,
  Trash2,
  MessageCircle,
  RefreshCw,
  Search,
} from 'lucide-react';
import { Enquiry } from '../../types';
import { api } from '../../api';
import { useAuth } from '../../context/AuthContext';

export const AdminEnquiries: React.FC = () => {
  const { token } = useAuth();

  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [unreadCount, setUnreadCount] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [searchQuery, setSearchQuery] = useState<string>('');
  const [filterRead, setFilterRead] = useState<'all' | 'unread' | 'read'>('all');

  const loadEnquiries = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await api.getAllEnquiries(token || undefined);
      setEnquiries(res.enquiries);
      setUnreadCount(res.unreadCount);
    } catch (err: any) {
      console.error('Failed to load enquiries:', err);
      setError(err.message || 'Error fetching enquiries');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEnquiries();
  }, []);

  const handleToggleRead = async (id: string, currentRead: boolean) => {
    try {
      const updated = await api.toggleEnquiryRead(id, !currentRead, token || undefined);
      setEnquiries((prev) =>
        prev.map((e) => (e._id === id ? { ...e, isRead: updated.isRead } : e))
      );
      setUnreadCount((prev) => (currentRead ? prev + 1 : Math.max(0, prev - 1)));
    } catch (err: any) {
      alert(`Toggle failed: ${err.message}`);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!window.confirm(`Delete enquiry from "${name}"?`)) return;

    try {
      await api.deleteEnquiry(id, token || undefined);
      setEnquiries((prev) => prev.filter((e) => e._id !== id));
    } catch (err: any) {
      alert(`Delete failed: ${err.message}`);
    }
  };

  const filteredEnquiries = enquiries.filter((e) => {
    if (filterRead === 'unread' && e.isRead) return false;
    if (filterRead === 'read' && !e.isRead) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        e.name.toLowerCase().includes(q) ||
        e.email.toLowerCase().includes(q) ||
        e.phone.includes(q) ||
        e.message.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-darktext">
            Customer Enquiries
          </h1>
          <p className="text-xs text-gray-500 mt-0.5">
            Correspondence submitted via the farm contact form ({unreadCount} unread)
          </p>
        </div>

        <button
          onClick={loadEnquiries}
          className="p-2.5 rounded-xl bg-white border border-gray-200 text-gray-600 hover:text-primary hover:border-primary transition-colors text-xs font-semibold shadow-sm self-start sm:self-auto flex items-center gap-1.5"
        >
          <RefreshCw className="w-4 h-4" />
          <span>Refresh</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Read / Unread toggle */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setFilterRead('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
              filterRead === 'all'
                ? 'bg-primary text-white shadow-sm'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            All Messages ({enquiries.length})
          </button>
          <button
            onClick={() => setFilterRead('unread')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
              filterRead === 'unread'
                ? 'bg-amber-500 text-white shadow-sm'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            Unread ({unreadCount})
          </button>
          <button
            onClick={() => setFilterRead('read')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
              filterRead === 'read'
                ? 'bg-primary text-white shadow-sm'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            Read
          </button>
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search message text, name, phone..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3.5 py-2 rounded-xl border border-gray-200 text-xs bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
      </div>

      {/* Enquiries List */}
      <div className="space-y-4">
        {loading ? (
          <div className="py-20 text-center space-y-2 bg-white rounded-3xl border border-gray-200">
            <div className="w-8 h-8 border-3 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-xs text-gray-500">Loading messages...</p>
          </div>
        ) : error ? (
          <div className="p-8 text-center text-rose-700 text-xs font-bold bg-white rounded-3xl border border-gray-200">
            {error}
          </div>
        ) : filteredEnquiries.length === 0 ? (
          <div className="p-12 text-center text-gray-500 text-xs space-y-3 bg-white rounded-3xl border border-gray-200">
            <MessageSquare className="w-10 h-10 text-gray-300 mx-auto" />
            <p>No enquiries found.</p>
          </div>
        ) : (
          filteredEnquiries.map((enq) => (
            <div
              key={enq._id}
              className={`bg-white rounded-2xl border p-5 sm:p-6 transition-all duration-200 shadow-sm ${
                enq.isRead ? 'border-gray-200' : 'border-amber-300 bg-amber-50/20 shadow-md'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-gray-100">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm ${
                      enq.isRead ? 'bg-gray-100 text-gray-600' : 'bg-accent text-white'
                    }`}
                  >
                    {enq.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-darktext text-sm">{enq.name}</span>
                      {!enq.isRead && (
                        <span className="bg-amber-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded uppercase">
                          New Enquiry
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-3 text-xs text-gray-500 mt-0.5">
                      <span className="flex items-center gap-1">
                        <Mail className="w-3 h-3 text-gray-400" />
                        <a href={`mailto:${enq.email}`} className="hover:text-primary">
                          {enq.email}
                        </a>
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Phone className="w-3 h-3 text-gray-400" />
                        <a href={`tel:${enq.phone}`} className="hover:text-primary">
                          {enq.phone}
                        </a>
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-start sm:self-auto text-xs text-gray-400">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>
                    {new Date(enq.createdAt).toLocaleDateString('en-IN', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>
                </div>
              </div>

              {/* Message Content */}
              <div className="py-4 text-xs sm:text-sm text-gray-700 leading-relaxed">
                <p className="whitespace-pre-line">{enq.message}</p>
              </div>

              {/* Action Buttons */}
              <div className="pt-3 border-t border-gray-100 flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <a
                    href={`https://wa.me/91${enq.phone.replace(/\D/g, '')}?text=${encodeURIComponent(
                      `Hello ${enq.name}, thank you for contacting Ponivraa Farm regarding your enquiry: "${enq.message.slice(0, 50)}..."`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 bg-[#25D366] hover:bg-[#20ba59] text-white text-xs font-bold px-3 py-1.5 rounded-lg shadow-sm transition-colors"
                  >
                    <MessageCircle className="w-3.5 h-3.5 fill-white" />
                    <span>Reply on WhatsApp</span>
                  </a>

                  <a
                    href={`mailto:${enq.email}?subject=Response to Ponivraa Farm Enquiry&body=Hello ${enq.name},`}
                    className="inline-flex items-center gap-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-bold px-3 py-1.5 rounded-lg transition-colors"
                  >
                    <Mail className="w-3.5 h-3.5" />
                    <span>Send Email</span>
                  </a>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleToggleRead(enq._id, enq.isRead)}
                    className="text-xs text-gray-500 hover:text-primary font-bold px-2 py-1 rounded hover:bg-gray-100"
                  >
                    {enq.isRead ? 'Mark as Unread' : 'Mark as Read'}
                  </button>

                  <button
                    onClick={() => handleDelete(enq._id, enq.name)}
                    className="p-1.5 text-gray-400 hover:text-rose-600 hover:bg-rose-50 rounded"
                    title="Delete message"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};


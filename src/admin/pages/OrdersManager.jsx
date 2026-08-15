import React, { useState, useEffect, useMemo } from 'react';
import { 
  ShoppingCart, Search, Filter, Eye, CheckCircle2, Clock, XCircle, AlertCircle, Phone, MapPin, Calendar, FileText, Check 
} from 'lucide-react';
import { useCMS } from '../../context/CMSContext';
import { getCmsTableData, saveCmsItem, logActivity } from '../../services/cmsService';

export default function OrdersManager({ adminEmail }) {
  const { refreshAllData } = useCMS();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [selectedScreenshotModal, setSelectedScreenshotModal] = useState(null);
  const [toastMsg, setToastMsg] = useState('');

  const showToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(''), 3000);
  };

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const data = await getCmsTableData('orders', []);
      setOrders(data || []);
    } catch (err) {
      console.error('Error fetching orders:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const filteredOrders = useMemo(() => {
    return orders.filter((o) => {
      const matchSearch = !searchQuery ||
        (o.customer_name && o.customer_name.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (o.mobile_number && o.mobile_number.includes(searchQuery)) ||
        (o.order_id && o.order_id.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchStatus = statusFilter === 'All' || o.payment_status === statusFilter || o.order_status === statusFilter;

      return matchSearch && matchStatus;
    });
  }, [orders, searchQuery, statusFilter]);

  const handleUpdateOrderStatus = async (orderObj, newStatus) => {
    try {
      const updated = {
        ...orderObj,
        payment_status: newStatus,
        order_status: newStatus === 'Payment Received' ? 'Processing' : newStatus
      };
      await saveCmsItem('orders', updated);
      await logActivity(adminEmail, 'UPDATED', 'Orders', `Order ${orderObj.order_id} status set to ${newStatus}`);
      fetchOrders();
      refreshAllData();
      showToast(`Order ${orderObj.order_id} updated to ${newStatus}`);
    } catch (err) {
      alert('Error updating order status: ' + err.message);
    }
  };

  const statusOptions = [
    'Payment Verification Pending',
    'Payment Received',
    'Processing',
    'Completed',
    'Cancelled'
  ];

  return (
    <div className="space-y-6 font-sans">
      
      {toastMsg && (
        <div className="fixed bottom-5 right-5 z-50 bg-[#008744] text-white px-5 py-3 rounded-xl shadow-2xl font-bold text-xs flex items-center gap-2 animate-bounce">
          <Check className="w-4 h-4" /> {toastMsg}
        </div>
      )}

      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-6 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight flex items-center gap-2">
            <ShoppingCart className="w-6 h-6 text-emerald-400" /> Customer Orders &amp; Payment Screenshots
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Manage customer WhatsApp submissions, payment screenshots, order amounts, and status.
          </p>
        </div>

        <button
          onClick={fetchOrders}
          className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs shadow self-start sm:self-auto"
        >
          Refresh Orders
        </button>
      </div>

      {/* Search & Filter Controls */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Search by Order ID, Name, Phone..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-950 text-white placeholder-slate-500 text-xs rounded-xl py-2.5 pl-9 pr-3 border border-slate-800 focus:outline-none focus:border-emerald-500"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <span className="text-xs font-bold text-slate-400">Filter Status:</span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-slate-950 text-white text-xs font-bold rounded-xl py-2.5 px-3 border border-slate-800"
          >
            <option value="All">All Order Statuses</option>
            {statusOptions.map((opt) => (
              <option key={opt} value={opt}>{opt}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Orders Cards List (Mobile-First Layout) */}
      {filteredOrders.length === 0 ? (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-12 text-center text-slate-500">
          <ShoppingCart className="w-12 h-12 text-slate-700 mx-auto mb-3" />
          <p className="font-bold text-sm text-slate-300">No customer orders recorded yet.</p>
          <p className="text-xs mt-1">When customers submit checkout orders on WhatsApp, their details will appear here.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredOrders.map((ord) => (
            <div key={ord.id} className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-5 shadow-xl space-y-4 font-sans">
              
              {/* Order Header: Order ID & Date */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-black uppercase px-2.5 py-1 rounded bg-purple-950 border border-purple-800 text-purple-300">
                    {ord.order_id}
                  </span>
                  <span className="text-xs font-bold text-white">{ord.customer_name}</span>
                </div>

                <div className="flex items-center gap-2 text-xs text-slate-400">
                  <Calendar className="w-3.5 h-3.5 text-slate-500" />
                  <span>{ord.created_at ? new Date(ord.created_at).toLocaleString() : 'N/A'}</span>
                </div>
              </div>

              {/* Order Details Grid */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                {/* Left Column: Customer & Amount */}
                <div className="md:col-span-7 space-y-2 text-xs text-slate-300">
                  <div className="flex items-center gap-2">
                    <Phone className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                    <span className="font-bold text-white">{ord.mobile_number}</span>
                  </div>

                  {ord.location && (
                    <div className="flex items-center gap-2">
                      <MapPin className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                      <span>{ord.location}</span>
                    </div>
                  )}

                  <div className="pt-1 flex items-baseline gap-2">
                    <span className="text-slate-400">Total Amount:</span>
                    <span className="text-base font-black text-emerald-400">₹{ord.total_amount || 0}</span>
                  </div>
                </div>

                {/* Right Column: Payment Screenshot Preview & Status Select */}
                <div className="md:col-span-5 flex flex-col sm:flex-row items-center justify-end gap-3">
                  
                  {/* Screenshot Thumbnail */}
                  {ord.payment_screenshot_url ? (
                    <button
                      onClick={() => setSelectedScreenshotModal(ord.payment_screenshot_url)}
                      className="w-full sm:w-28 h-20 bg-slate-950 rounded-xl border border-slate-700 overflow-hidden relative group shrink-0 flex items-center justify-center"
                    >
                      <img src={ord.payment_screenshot_url} alt="Payment Screenshot" className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white text-[10px] font-bold transition-opacity">
                        <Eye className="w-4 h-4" /> View
                      </div>
                    </button>
                  ) : (
                    <span className="text-[11px] text-slate-500 bg-slate-950 p-2.5 rounded-xl border border-slate-800 text-center w-full sm:w-auto">
                      No Screenshot Uploaded
                    </span>
                  )}

                  {/* Status Dropdown */}
                  <div className="w-full sm:w-auto shrink-0">
                    <label className="block text-[10px] font-bold text-slate-400 mb-1">Update Status:</label>
                    <select
                      value={ord.payment_status || 'Payment Verification Pending'}
                      onChange={(e) => handleUpdateOrderStatus(ord, e.target.value)}
                      className={`w-full bg-slate-950 text-xs font-black rounded-xl p-2.5 border transition-all ${
                        ord.payment_status === 'Payment Received' || ord.payment_status === 'Completed'
                          ? 'border-emerald-700 text-emerald-300'
                          : ord.payment_status === 'Cancelled'
                          ? 'border-red-800 text-red-300'
                          : 'border-amber-700 text-amber-300'
                      }`}
                    >
                      {statusOptions.map((opt) => (
                        <option key={opt} value={opt}>{opt}</option>
                      ))}
                    </select>
                  </div>

                </div>
              </div>

            </div>
          ))}
        </div>
      )}

      {/* SCREENSHOT FULL MODAL */}
      {selectedScreenshotModal && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-4 shadow-2xl space-y-3 font-sans">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <h3 className="font-bold text-white text-sm">Payment Screenshot Proof</h3>
              <button onClick={() => setSelectedScreenshotModal(null)} className="text-slate-400 hover:text-white font-bold">✕</button>
            </div>
            <div className="max-h-[75vh] overflow-y-auto rounded-xl border border-slate-800 bg-slate-950 p-2">
              <img src={selectedScreenshotModal} alt="Payment Screenshot Full" className="w-full h-auto object-contain rounded-lg" />
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

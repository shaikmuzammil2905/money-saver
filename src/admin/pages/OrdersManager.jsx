import React, { useState, useEffect, useMemo } from 'react';
import { 
  ShoppingCart, Search, Filter, Eye, CheckCircle2, Clock, XCircle, AlertCircle, Phone, MapPin, Calendar, FileText, Check, Globe, MessageCircle 
} from 'lucide-react';
import { useCMS } from '../../context/CMSContext';
import { getCmsTableData, saveCmsItem, logActivity } from '../../services/cmsService';

export default function OrdersManager({ adminEmail }) {
  const { refreshAllData } = useCMS();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  
  // Date Filters
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');

  // Modals
  const [selectedScreenshotModal, setSelectedScreenshotModal] = useState(null);
  const [selectedOrderDetailsModal, setSelectedOrderDetailsModal] = useState(null);
  const [toastMsg, setToastMsg] = useState('');

  const showToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(''), 3000);
  };

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const data = await getCmsTableData('orders', [], 'created_at');
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

  // Filter & Group Orders by Date
  const groupedOrders = useMemo(() => {
    const sorted = [...orders].sort((a, b) => new Date(b.created_at || 0) - new Date(a.created_at || 0));

    const filtered = sorted.filter((o) => {
      const matchSearch = !searchQuery ||
        (o.customer_name && o.customer_name.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (o.mobile_number && o.mobile_number.includes(searchQuery)) ||
        (o.order_id && o.order_id.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchStatus = statusFilter === 'All' || o.payment_status === statusFilter || o.order_status === statusFilter;

      let matchDate = true;
      if (fromDate) {
        matchDate = matchDate && o.created_at && new Date(o.created_at) >= new Date(fromDate);
      }
      if (toDate) {
        const endOfDay = new Date(toDate);
        endOfDay.setHours(23, 59, 59, 999);
        matchDate = matchDate && o.created_at && new Date(o.created_at) <= endOfDay;
      }

      return matchSearch && matchStatus && matchDate;
    });

    // Group by Date
    const groups = {};
    filtered.forEach((ord) => {
      const dateStr = ord.created_at 
        ? new Date(ord.created_at).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
        : 'Unknown Date';

      if (!groups[dateStr]) {
        groups[dateStr] = [];
      }
      groups[dateStr].push(ord);
    });

    return groups;
  }, [orders, searchQuery, statusFilter, fromDate, toDate]);

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
            <ShoppingCart className="w-6 h-6 text-emerald-400" /> Customer Orders &amp; Payment Verification
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Date range filtering, date-grouped order cards, WhatsApp source tags, and complete popup detail views.
          </p>
        </div>

        <button
          onClick={fetchOrders}
          disabled={loading}
          className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs shadow self-start sm:self-auto"
        >
          Refresh Orders
        </button>
      </div>

      {/* FROM DATE & TO DATE CALENDAR FILTER BAR */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-xl flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Search by Order ID, Name, Phone..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-950 text-white placeholder-slate-500 text-xs rounded-xl py-2.5 pl-9 pr-3 border border-slate-800 focus:outline-none focus:border-emerald-500"
          />
        </div>

        {/* Date Filter Range Controls */}
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          <div className="flex items-center gap-1.5 text-xs text-slate-300">
            <Calendar className="w-4 h-4 text-purple-400 shrink-0" />
            <span className="font-bold">From:</span>
            <input
              type="date"
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
              className="bg-slate-950 text-white text-xs font-bold rounded-xl py-2 px-2.5 border border-slate-800 cursor-pointer"
            />
          </div>

          <div className="flex items-center gap-1.5 text-xs text-slate-300">
            <span className="font-bold">To:</span>
            <input
              type="date"
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
              className="bg-slate-950 text-white text-xs font-bold rounded-xl py-2 px-2.5 border border-slate-800 cursor-pointer"
            />
          </div>

          {(fromDate || toDate) && (
            <button
              onClick={() => { setFromDate(''); setToDate(''); }}
              className="text-xs font-bold text-red-400 hover:underline"
            >
              Clear Date Filter
            </button>
          )}

          {/* Status Dropdown */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-slate-950 text-white text-xs font-bold rounded-xl py-2.5 px-3 border border-slate-800"
          >
            <option value="All">All Statuses</option>
            {statusOptions.map((opt) => (
              <option key={opt} value={opt}>{opt}</option>
            ))}
          </select>
        </div>
      </div>

      {/* DATE GROUPED COMPACT ORDER CARDS (MOBILE OPTIMIZED: 4+ CARDS FIT PER SCREEN) */}
      {Object.keys(groupedOrders).length === 0 ? (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-12 text-center text-slate-500">
          <ShoppingCart className="w-12 h-12 text-slate-700 mx-auto mb-3" />
          <p className="font-bold text-sm text-slate-300">No customer orders found for this date selection.</p>
          <p className="text-xs mt-1">When customers submit checkout orders on WhatsApp, their details appear here.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {Object.entries(groupedOrders).map(([dateStr, itemsList]) => (
            <div key={dateStr} className="space-y-3">
              
              {/* ORDER DATE GROUPING COLORED HEADING BOX */}
              <div className="bg-gradient-to-r from-emerald-950 via-slate-900 to-purple-950 border border-emerald-800/60 rounded-xl px-4 py-2.5 flex items-center justify-between shadow-lg">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-emerald-400" />
                  <h3 className="font-black text-white text-sm sm:text-base tracking-tight">
                    {dateStr} — <span className="text-emerald-300">{String(itemsList.length).padStart(2, '0')} Orders</span>
                  </h3>
                </div>
                <span className="text-[11px] font-bold text-slate-400 bg-slate-950 px-2.5 py-0.5 rounded-full border border-slate-800">
                  Newest First
                </span>
              </div>

              {/* COMPACT ORDER CARDS GRID (COMPACT MOBILE DESIGN) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                {itemsList.map((ord) => {
                  const paymentSource = ord.source || (ord.payment_screenshot_url ? 'WhatsApp' : 'Website');
                  return (
                    <div key={ord.id} className="bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-xl p-3.5 shadow-md flex flex-col justify-between space-y-3 font-sans transition-all">
                      
                      <div className="space-y-2">
                        {/* Order Top Bar */}
                        <div className="flex items-center justify-between gap-1">
                          <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded bg-purple-950 border border-purple-800 text-purple-300 truncate">
                            {ord.order_id}
                          </span>

                          <span className={`text-[9px] font-black px-2 py-0.5 rounded flex items-center gap-1 ${
                            paymentSource === 'WhatsApp' ? 'bg-emerald-950 text-emerald-300 border border-emerald-800' : 'bg-blue-950 text-blue-300 border border-blue-800'
                          }`}>
                            {paymentSource === 'WhatsApp' ? <MessageCircle className="w-2.5 h-2.5" /> : <Globe className="w-2.5 h-2.5" />}
                            <span>{paymentSource}</span>
                          </span>
                        </div>

                        {/* Customer Info & Amount */}
                        <div>
                          <h4 className="font-extrabold text-white text-sm truncate">{ord.customer_name}</h4>
                          <p className="text-slate-400 text-xs font-semibold">{ord.mobile_number}</p>
                          {ord.location && (
                            <p className="text-slate-500 text-[11px] truncate mt-0.5">{ord.location}</p>
                          )}
                        </div>

                        <div className="flex items-baseline justify-between pt-1 border-t border-slate-800/60">
                          <span className="text-xs text-slate-400 font-medium">Amount:</span>
                          <span className="text-base font-black text-emerald-400">₹{ord.total_amount || 0}</span>
                        </div>
                      </div>

                      {/* Card Footer: Status & VIEW Modal Button */}
                      <div className="pt-2 border-t border-slate-800 flex items-center justify-between gap-2">
                        <select
                          value={ord.payment_status || 'Payment Verification Pending'}
                          onChange={(e) => handleUpdateOrderStatus(ord, e.target.value)}
                          className="flex-1 bg-slate-950 text-[10px] font-black rounded-lg p-1.5 border border-slate-800 text-amber-300 truncate"
                        >
                          {statusOptions.map((opt) => (
                            <option key={opt} value={opt}>{opt}</option>
                          ))}
                        </select>

                        <button
                          onClick={() => setSelectedOrderDetailsModal(ord)}
                          className="px-3 py-1.5 rounded-lg bg-emerald-950 hover:bg-emerald-900 border border-emerald-700 text-emerald-300 font-extrabold text-xs flex items-center gap-1 shrink-0"
                        >
                          <Eye className="w-3.5 h-3.5" /> VIEW
                        </button>
                      </div>

                    </div>
                  );
                })}
              </div>

            </div>
          ))}
        </div>
      )}

      {/* FULL ORDER DETAILS POPUP MODAL */}
      {selectedOrderDetailsModal && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-5 shadow-2xl space-y-4 font-sans my-6">
            
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div>
                <span className="text-[10px] font-black text-purple-300 bg-purple-950 border border-purple-800 px-2 py-0.5 rounded">
                  {selectedOrderDetailsModal.order_id}
                </span>
                <h3 className="font-extrabold text-white text-base mt-1">Complete Order Details</h3>
              </div>
              <button onClick={() => setSelectedOrderDetailsModal(null)} className="text-slate-400 hover:text-white font-bold text-base">✕</button>
            </div>

            <div className="space-y-3 text-xs text-slate-300 bg-slate-950 p-4 rounded-xl border border-slate-800">
              <div className="flex justify-between py-1 border-b border-slate-800/60">
                <span className="text-slate-400 font-medium">Customer Name:</span>
                <span className="font-bold text-white">{selectedOrderDetailsModal.customer_name}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-800/60">
                <span className="text-slate-400 font-medium">Mobile Number:</span>
                <span className="font-bold text-emerald-400">{selectedOrderDetailsModal.mobile_number}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-800/60">
                <span className="text-slate-400 font-medium">Location:</span>
                <span className="font-semibold text-white">{selectedOrderDetailsModal.location || 'N/A'}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-800/60">
                <span className="text-slate-400 font-medium">Total Amount:</span>
                <span className="font-black text-emerald-400 text-sm">₹{selectedOrderDetailsModal.total_amount || 0}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-800/60">
                <span className="text-slate-400 font-medium">Payment Status:</span>
                <span className="font-bold text-amber-300">{selectedOrderDetailsModal.payment_status || 'Pending'}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-800/60">
                <span className="text-slate-400 font-medium">Order Date / Time:</span>
                <span className="font-medium text-slate-300">
                  {selectedOrderDetailsModal.created_at ? new Date(selectedOrderDetailsModal.created_at).toLocaleString() : 'N/A'}
                </span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-slate-400 font-medium">Order Source:</span>
                <span className="font-bold text-blue-400">{selectedOrderDetailsModal.source || 'WhatsApp / Website'}</span>
              </div>
            </div>

            {/* Payment Screenshot Proof */}
            {selectedOrderDetailsModal.payment_screenshot_url && (
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-300">Payment Screenshot Proof:</label>
                <div
                  onClick={() => setSelectedScreenshotModal(selectedOrderDetailsModal.payment_screenshot_url)}
                  className="h-36 rounded-xl border border-slate-700 bg-slate-950 overflow-hidden relative cursor-pointer group flex items-center justify-center"
                >
                  <img src={selectedOrderDetailsModal.payment_screenshot_url} alt="Screenshot" className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-white text-xs font-bold">
                    Click to Enlarge
                  </div>
                </div>
              </div>
            )}

            <div className="pt-2">
              <button
                onClick={() => setSelectedOrderDetailsModal(null)}
                className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs"
              >
                Close Popup
              </button>
            </div>

          </div>
        </div>
      )}

      {/* SCREENSHOT FULL MODAL */}
      {selectedScreenshotModal && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex items-center justify-center p-4">
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

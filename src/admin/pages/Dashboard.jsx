import React, { useEffect, useState, useMemo } from 'react';
import { 
  Package, Tag, Layers, Home, ShoppingCart, Users, Activity, ExternalLink, Plus, RefreshCw, CheckCircle, Eye, ArrowUpRight, Calendar, Filter 
} from 'lucide-react';
import { useCMS } from '../../context/CMSContext';
import { getActivityLogs, getCmsTableData } from '../../services/cmsService';
import { getCustomerOrders } from '../../services/orderService';

export default function Dashboard({ onNavigate }) {
  const { products, offerItems, categories, homeItems, refreshAllData, loading } = useCMS();
  const [logs, setLogs] = useState([]);
  const [orders, setOrders] = useState([]);
  const [visits, setVisits] = useState([]);
  const [selectedDate, setSelectedDate] = useState('');
  const [fetchingLogs, setFetchingLogs] = useState(false);

  const loadDashboardDetails = async () => {
    setFetchingLogs(true);
    try {
      const [activityData, orderData, visitData] = await Promise.all([
        getActivityLogs(10),
        getCustomerOrders(''),
        getCmsTableData('analytics_visits', [], 'visited_at')
      ]);
      setLogs(activityData);
      setOrders(orderData || []);
      setVisits(visitData || []);
    } catch (err) {
      console.error('Dashboard load error:', err);
    } finally {
      setFetchingLogs(false);
    }
  };

  useEffect(() => {
    loadDashboardDetails();
  }, []);

  // Format Selected Date Display (e.g. 16-Aug-2026)
  const selectedDateFormatted = useMemo(() => {
    if (!selectedDate) return null;
    const d = new Date(selectedDate);
    const day = String(d.getDate()).padStart(2, '0');
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const month = monthNames[d.getMonth()];
    const year = d.getFullYear();
    return `${day}-${month}-${year}`;
  }, [selectedDate]);

  // Date Filtered Statistics
  const filteredOrdersCount = useMemo(() => {
    if (!selectedDate) return orders.length;
    return orders.filter((o) => {
      if (!o.created_at) return false;
      return new Date(o.created_at).toISOString().slice(0, 10) === selectedDate;
    }).length;
  }, [orders, selectedDate]);

  const filteredVisitsCount = useMemo(() => {
    if (!selectedDate) return visits.length;
    return visits.filter((v) => {
      if (!v.visited_at) return false;
      return new Date(v.visited_at).toISOString().slice(0, 10) === selectedDate;
    }).length;
  }, [visits, selectedDate]);

  const totalProductsCount = products.length;
  const activeProductsCount = products.filter((p) => p.is_active !== false).length;
  const totalOffersCount = offerItems.length;
  const totalCategoriesCount = categories.length;

  const todayStr = new Date().toISOString().slice(0, 10);
  const todayVisitsCount = visits.filter(v => v.visited_at && new Date(v.visited_at).toISOString().slice(0, 10) === todayStr).length;

  const stats = [
    { label: 'Number of Categories', count: totalCategoriesCount, active: categories.filter(c => c.is_active).length, icon: Layers, color: 'from-purple-600 to-pink-600', link: 'categories' },
    { label: 'Number of Products', count: totalProductsCount, active: activeProductsCount, icon: Package, color: 'from-blue-600 to-indigo-600', link: 'products' },
    { label: 'Offer Products', count: totalOffersCount, active: offerItems.filter(o => o.is_active).length, icon: Tag, color: 'from-red-600 to-amber-600', link: 'offers' },
    { label: selectedDate ? 'Orders on Selected Date' : 'Total Orders', count: filteredOrdersCount, active: orders.filter(o => o.orderStatus === 'New').length, icon: ShoppingCart, color: 'from-[#008744] to-emerald-700', link: 'orders' },
    { label: selectedDate ? 'Visitors on Selected Date' : "Today's Visitors Count", count: selectedDate ? filteredVisitsCount : todayVisitsCount, active: visits.length, icon: Users, color: 'from-teal-600 to-cyan-600', link: 'visitors' }
  ];

  return (
    <div className="space-y-6 font-sans">
      
      {/* Top Banner & Quick Actions */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-black text-white tracking-tight flex items-center gap-2">
              Admin CMS Dashboard
            </h1>
            <p className="text-slate-400 text-xs sm:text-sm mt-1">
              Realtime database statistics from Supabase. Select a date to filter date-based statistics.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 shrink-0">
            <button
              onClick={() => { refreshAllData(); loadDashboardDetails(); }}
              disabled={loading || fetchingLogs}
              className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs flex items-center gap-1.5 transition-colors"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${(loading || fetchingLogs) ? 'animate-spin' : ''}`} /> Refresh Data
            </button>
            <a
              href="/"
              target="_blank"
              rel="noreferrer"
              className="px-4 py-2 rounded-xl bg-[#008744] hover:bg-emerald-600 text-white font-bold text-xs flex items-center gap-1.5 shadow-md transition-colors"
            >
              <Eye className="w-4 h-4" /> View Public Site <ArrowUpRight className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

        {/* DATE CALENDAR PICKER AT TOP OF DASHBOARD */}
        <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs font-black uppercase text-slate-400 tracking-wider block">Dashboard Date Calendar Filter</span>
              {selectedDateFormatted ? (
                <span className="text-sm font-black text-amber-300">
                  Selected Date: {selectedDateFormatted}
                </span>
              ) : (
                <span className="text-xs text-slate-400 font-medium">Viewing all real database statistics (No specific date selected)</span>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="bg-slate-900 text-white text-xs font-bold rounded-xl py-2 px-3 border border-slate-700 cursor-pointer focus:outline-none focus:border-amber-500"
            />
            {selectedDate && (
              <button
                onClick={() => setSelectedDate('')}
                className="px-3 py-2 rounded-xl bg-red-950 text-red-300 border border-red-800 text-xs font-bold hover:bg-red-900 transition-colors"
              >
                Reset Date
              </button>
            )}
          </div>
        </div>

      </div>

      {/* Analytics Cards Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
        {stats.map((stat, idx) => {
          const IconComp = stat.icon;
          return (
            <div
              key={idx}
              onClick={() => onNavigate(stat.link)}
              className="bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-2xl p-4 sm:p-5 shadow-lg cursor-pointer transition-all hover:scale-[1.02] group"
            >
              <div className="flex items-center justify-between mb-3">
                <div className={`p-2.5 rounded-xl bg-gradient-to-tr ${stat.color} text-white shadow-md`}>
                  <IconComp className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 bg-emerald-950/60 border border-emerald-800/60 px-2 py-0.5 rounded-full">
                  {stat.active} Active
                </span>
              </div>
              <p className="text-2xl sm:text-3xl font-black text-white">{stat.count}</p>
              <h3 className="text-xs font-bold text-slate-400 mt-1 flex items-center justify-between group-hover:text-white transition-colors">
                {stat.label} <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
              </h3>
            </div>
          );
        })}
      </div>

      {/* Main Grid: Recent Activity & Quick Navigation */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Recent Change Audit Log */}
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-2xl p-5 sm:p-6 shadow-xl">
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-800">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Activity className="w-5 h-5 text-[#e50914]" /> Recent Admin Activity
            </h2>
            <button
              onClick={() => onNavigate('activity')}
              className="text-xs font-bold text-[#008744] hover:underline"
            >
              View Full Audit Log →
            </button>
          </div>

          {logs.length === 0 ? (
            <div className="text-center py-10 text-slate-500 text-xs font-medium">
              No recent changes logged yet.
            </div>
          ) : (
            <div className="divide-y divide-slate-800/80">
              {logs.map((log) => (
                <div key={log.id} className="py-3 flex items-start justify-between gap-3 text-xs">
                  <div>
                    <span className="font-semibold text-slate-200">{log.admin_email}</span>{' '}
                    <span className="px-2 py-0.5 rounded bg-slate-800 text-amber-300 font-bold uppercase text-[10px]">
                      {log.action}
                    </span>{' '}
                    in <span className="text-slate-300 font-bold">{log.section}</span>
                    {log.item_name && (
                      <p className="text-slate-400 font-medium mt-0.5">Item: "{log.item_name}"</p>
                    )}
                  </div>
                  <span className="text-[10px] text-slate-500 shrink-0 font-medium">
                    {new Date(log.created_at).toLocaleString()}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Quick Shortcut Panels */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 sm:p-6 shadow-xl space-y-4">
          <h2 className="text-base font-bold text-white flex items-center gap-2 pb-3 border-b border-slate-800">
            <Plus className="w-5 h-5 text-[#008744]" /> CMS Management Quick Links
          </h2>

          <div className="space-y-2">
            <button
              onClick={() => onNavigate('products')}
              className="w-full text-left p-3 rounded-xl bg-slate-950 border border-slate-800 hover:border-slate-700 text-slate-200 hover:text-white text-xs font-bold flex items-center justify-between group transition-all"
            >
              <span>Manage Products</span>
              <span className="text-[#008744] group-hover:translate-x-1 transition-transform">→</span>
            </button>

            <button
              onClick={() => onNavigate('home')}
              className="w-full text-left p-3 rounded-xl bg-slate-950 border border-slate-800 hover:border-slate-700 text-slate-200 hover:text-white text-xs font-bold flex items-center justify-between group transition-all"
            >
              <span>Edit Homepage Sections</span>
              <span className="text-[#008744] group-hover:translate-x-1 transition-transform">→</span>
            </button>

            <button
              onClick={() => onNavigate('offers')}
              className="w-full text-left p-3 rounded-xl bg-slate-950 border border-slate-800 hover:border-slate-700 text-slate-200 hover:text-white text-xs font-bold flex items-center justify-between group transition-all"
            >
              <span>Manage Offers & Top Slide</span>
              <span className="text-[#008744] group-hover:translate-x-1 transition-transform">→</span>
            </button>

            <button
              onClick={() => onNavigate('cart')}
              className="w-full text-left p-3 rounded-xl bg-slate-950 border border-slate-800 hover:border-slate-700 text-slate-200 hover:text-white text-xs font-bold flex items-center justify-between group transition-all"
            >
              <span>Cart & WhatsApp Messages</span>
              <span className="text-[#008744] group-hover:translate-x-1 transition-transform">→</span>
            </button>

            <button
              onClick={() => onNavigate('settings')}
              className="w-full text-left p-3 rounded-xl bg-slate-950 border border-slate-800 hover:border-slate-700 text-slate-200 hover:text-white text-xs font-bold flex items-center justify-between group transition-all"
            >
              <span>Website Logo & Settings</span>
              <span className="text-[#008744] group-hover:translate-x-1 transition-transform">→</span>
            </button>

            <button
              onClick={() => onNavigate('media')}
              className="w-full text-left p-3 rounded-xl bg-slate-950 border border-slate-800 hover:border-slate-700 text-slate-200 hover:text-white text-xs font-bold flex items-center justify-between group transition-all"
            >
              <span>Cloudinary Media Library</span>
              <span className="text-[#008744] group-hover:translate-x-1 transition-transform">→</span>
            </button>
          </div>
        </div>

      </div>

    </div>
  );
}

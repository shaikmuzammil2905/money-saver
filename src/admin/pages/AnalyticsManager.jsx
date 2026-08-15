import React, { useState, useEffect } from 'react';
import { 
  BarChart3, Calendar, Eye, Smartphone, Monitor, Tablet, ArrowUpRight, Filter, RefreshCw 
} from 'lucide-react';
import { getAnalyticsMetrics } from '../../services/cmsService';

export default function AnalyticsManager() {
  const [dateRangeMode, setDateRangeMode] = useState('7days'); // 'today', 'yesterday', '7days', '30days', 'custom'
  const [fromDate, setFromDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() - 7);
    return d.toISOString().slice(0, 10);
  });
  const [toDate, setToDate] = useState(() => new Date().toISOString().slice(0, 10));

  const [loading, setLoading] = useState(true);
  const [metrics, setMetrics] = useState({
    todayVisits: 0,
    yesterdayVisits: 0,
    last7DaysVisits: 0,
    last30DaysVisits: 0,
    rangeVisits: 0,
    uniqueVisitors: 0,
    pageViews: 0,
    topPages: [],
    deviceBreakdown: { mobile: 0, desktop: 0, tablet: 0 }
  });

  const fetchMetrics = async () => {
    setLoading(true);
    let start = fromDate;
    let end = toDate;

    const now = new Date();
    if (dateRangeMode === 'today') {
      start = now.toISOString().slice(0, 10);
      end = start;
    } else if (dateRangeMode === 'yesterday') {
      const y = new Date(now);
      y.setDate(now.getDate() - 1);
      start = y.toISOString().slice(0, 10);
      end = start;
    } else if (dateRangeMode === '7days') {
      const d7 = new Date(now);
      d7.setDate(now.getDate() - 7);
      start = d7.toISOString().slice(0, 10);
      end = now.toISOString().slice(0, 10);
    } else if (dateRangeMode === '30days') {
      const d30 = new Date(now);
      d30.setDate(now.getDate() - 30);
      start = d30.toISOString().slice(0, 10);
      end = now.toISOString().slice(0, 10);
    }

    try {
      const data = await getAnalyticsMetrics(start, end);
      setMetrics(data);
    } catch (err) {
      console.error('Error loading analytics metrics:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMetrics();
  }, [dateRangeMode, fromDate, toDate]);

  const totalDeviceVisits = (metrics.deviceBreakdown.mobile || 0) + (metrics.deviceBreakdown.desktop || 0) + (metrics.deviceBreakdown.tablet || 0) || 1;
  const mobilePct = Math.round(((metrics.deviceBreakdown.mobile || 0) / totalDeviceVisits) * 100);
  const desktopPct = Math.round(((metrics.deviceBreakdown.desktop || 0) / totalDeviceVisits) * 100);
  const tabletPct = Math.round(((metrics.deviceBreakdown.tablet || 0) / totalDeviceVisits) * 100);

  return (
    <div className="space-y-6 font-sans">
      
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-6 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight flex items-center gap-2">
            <BarChart3 className="w-6 h-6 text-emerald-400" /> Website Visitor Analytics
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Privacy-compliant visitor tracking, pageviews, device distribution, and traffic metrics.
          </p>
        </div>

        <button
          onClick={fetchMetrics}
          className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs flex items-center gap-2 shadow self-start sm:self-auto"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} /> Refresh Data
        </button>
      </div>

      {/* Date Range Selection Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-xl space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-black text-white uppercase tracking-wider flex items-center gap-1.5">
            <Calendar className="w-4 h-4 text-emerald-400" /> Date Range Filter
          </span>
          <span className="text-[10px] text-slate-400 font-mono">
            {fromDate} → {toDate}
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {['today', 'yesterday', '7days', '30days', 'custom'].map((mode) => (
            <button
              key={mode}
              onClick={() => setDateRangeMode(mode)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold capitalize transition-all ${
                dateRangeMode === mode
                  ? 'bg-[#008744] text-white shadow-md'
                  : 'bg-slate-950 text-slate-400 hover:bg-slate-800 border border-slate-800'
              }`}
            >
              {mode === '7days' ? 'Last 7 Days' : mode === '30days' ? 'Last 30 Days' : mode}
            </button>
          ))}
        </div>

        {dateRangeMode === 'custom' && (
          <div className="flex flex-col sm:flex-row items-center gap-3 pt-2 border-t border-slate-800/80">
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <label className="text-xs font-bold text-slate-300">From Date:</label>
              <input
                type="date"
                value={fromDate}
                onChange={(e) => setFromDate(e.target.value)}
                className="bg-slate-950 text-white text-xs font-bold rounded-xl py-2 px-3 border border-slate-800"
              />
            </div>
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <label className="text-xs font-bold text-slate-300">To Date:</label>
              <input
                type="date"
                value={toDate}
                onChange={(e) => setToDate(e.target.value)}
                className="bg-slate-950 text-white text-xs font-bold rounded-xl py-2 px-3 border border-slate-800"
              />
            </div>
          </div>
        )}
      </div>

      {/* Analytics KPI Stat Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-xl">
          <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Today's Visitors</span>
          <div className="text-2xl sm:text-3xl font-black text-emerald-400 mt-1">
            {metrics.todayVisits.toLocaleString()}
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-xl">
          <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Yesterday's Visitors</span>
          <div className="text-2xl sm:text-3xl font-black text-amber-400 mt-1">
            {metrics.yesterdayVisits.toLocaleString()}
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-xl">
          <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Unique Session Visitors</span>
          <div className="text-2xl sm:text-3xl font-black text-cyan-400 mt-1">
            {metrics.uniqueVisitors.toLocaleString()}
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-xl">
          <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Total Page Views</span>
          <div className="text-2xl sm:text-3xl font-black text-purple-400 mt-1">
            {metrics.pageViews.toLocaleString()}
          </div>
        </div>
      </div>

      {/* Device Breakdown & Top Pages Grid */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
        
        {/* Device Breakdown Card */}
        <div className="md:col-span-5 bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
          <h2 className="text-sm font-black text-white uppercase tracking-wider flex items-center gap-2 border-b border-slate-800 pb-3">
            <Smartphone className="w-4 h-4 text-sky-400" /> Device Distribution
          </h2>

          <div className="space-y-4 pt-1">
            {/* Mobile */}
            <div>
              <div className="flex justify-between text-xs font-bold text-white mb-1">
                <span className="flex items-center gap-1.5"><Smartphone className="w-3.5 h-3.5 text-sky-400" /> Mobile Devices</span>
                <span>{mobilePct}% ({metrics.deviceBreakdown.mobile || 0})</span>
              </div>
              <div className="w-full h-2 rounded-full bg-slate-950 overflow-hidden">
                <div style={{ width: `${mobilePct}%` }} className="h-full bg-sky-500 rounded-full transition-all"></div>
              </div>
            </div>

            {/* Desktop */}
            <div>
              <div className="flex justify-between text-xs font-bold text-white mb-1">
                <span className="flex items-center gap-1.5"><Monitor className="w-3.5 h-3.5 text-purple-400" /> Desktop Computers</span>
                <span>{desktopPct}% ({metrics.deviceBreakdown.desktop || 0})</span>
              </div>
              <div className="w-full h-2 rounded-full bg-slate-950 overflow-hidden">
                <div style={{ width: `${desktopPct}%` }} className="h-full bg-purple-500 rounded-full transition-all"></div>
              </div>
            </div>

            {/* Tablet */}
            <div>
              <div className="flex justify-between text-xs font-bold text-white mb-1">
                <span className="flex items-center gap-1.5"><Tablet className="w-3.5 h-3.5 text-emerald-400" /> Tablets</span>
                <span>{tabletPct}% ({metrics.deviceBreakdown.tablet || 0})</span>
              </div>
              <div className="w-full h-2 rounded-full bg-slate-950 overflow-hidden">
                <div style={{ width: `${tabletPct}%` }} className="h-full bg-emerald-500 rounded-full transition-all"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Top Pages Card */}
        <div className="md:col-span-7 bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
          <h2 className="text-sm font-black text-white uppercase tracking-wider flex items-center gap-2 border-b border-slate-800 pb-3">
            <Eye className="w-4 h-4 text-amber-400" /> Top Visited Pages
          </h2>

          {metrics.topPages.length === 0 ? (
            <p className="text-xs text-slate-500 py-6 text-center">No visitor pageview records found for this period.</p>
          ) : (
            <div className="space-y-2">
              {metrics.topPages.map((pg, idx) => (
                <div key={idx} className="flex items-center justify-between p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs">
                  <span className="font-mono text-slate-200 truncate">{pg.path}</span>
                  <span className="font-black text-emerald-400 shrink-0 ml-2">{pg.views.toLocaleString()} views</span>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>

    </div>
  );
}

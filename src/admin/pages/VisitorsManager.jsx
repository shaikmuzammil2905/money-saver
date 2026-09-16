import React, { useState, useEffect, useMemo } from 'react';
import { 
  Eye, Search, Users, Calendar, MapPin, Phone, RefreshCw, Layers, Monitor, Smartphone, Globe, Shield, User, Clock, ArrowUpRight
} from 'lucide-react';
import { getCmsTableData } from '../../services/cmsService';

const DEFAULT_SEED_VISITS = [
  {
    id: 'visit_demo_1',
    session_id: 'sess_9823a1',
    path: '/ott-plans',
    device_type: 'Mobile (iOS)',
    ip_address: '103.156.42.18',
    referrer: 'WhatsApp Broadcast',
    visited_at: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
    user_name: 'Rahul Sharma',
    user_phone: '9876543210'
  },
  {
    id: 'visit_demo_2',
    session_id: 'sess_4412b9',
    path: '/offers',
    device_type: 'Desktop (Chrome/Windows)',
    ip_address: '157.32.19.45',
    referrer: 'Google Search',
    visited_at: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
    user_name: 'Priya Verma',
    user_phone: '9123456789'
  },
  {
    id: 'visit_demo_3',
    session_id: 'sess_7721c4',
    path: '/fiber',
    device_type: 'Mobile (Android)',
    ip_address: '49.207.18.99',
    referrer: 'Direct Visit',
    visited_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    user_name: '',
    user_phone: ''
  }
];

export default function VisitorsManager({ adminEmail }) {
  const [visits, setVisits] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDateFilter, setSelectedDateFilter] = useState('');
  const [selectedDeviceFilter, setSelectedDeviceFilter] = useState('All');

  const fetchVisitorData = async () => {
    setLoading(true);
    try {
      const [visitData, userData] = await Promise.all([
        getCmsTableData('analytics_visits', DEFAULT_SEED_VISITS, 'created_at'),
        getCmsTableData('users', [], 'created_at')
      ]);
      setVisits(visitData && visitData.length > 0 ? visitData : DEFAULT_SEED_VISITS);
      setUsers(userData || []);
    } catch (err) {
      console.error('Error fetching visitor data:', err);
      setVisits(DEFAULT_SEED_VISITS);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVisitorData();
  }, []);

  // Filter & Group Visitors by Date
  const groupedVisitors = useMemo(() => {
    const list = Array.isArray(visits) ? [...visits] : [];
    // Sort descending by visited_at timestamp
    list.sort((a, b) => new Date(b.visited_at || 0).getTime() - new Date(a.visited_at || 0).getTime());

    const groups = {};

    list.forEach((v) => {
      const dateStr = v.visited_at 
        ? new Date(v.visited_at).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) 
        : 'Today';
      
      if (selectedDateFilter) {
        const selStr = new Date(selectedDateFilter).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
        if (dateStr !== selStr) return;
      }

      if (selectedDeviceFilter !== 'All') {
        const dev = (v.device_type || '').toLowerCase();
        if (selectedDeviceFilter === 'Mobile' && !dev.includes('mobile') && !dev.includes('ios') && !dev.includes('android')) return;
        if (selectedDeviceFilter === 'Desktop' && (dev.includes('mobile') || dev.includes('ios') || dev.includes('android'))) return;
      }

      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const matchPath = (v.path || '').toLowerCase().includes(query);
        const matchDevice = (v.device_type || '').toLowerCase().includes(query);
        const matchSession = (v.session_id || '').toLowerCase().includes(query);
        const matchIp = (v.ip_address || v.ip || '').toLowerCase().includes(query);
        const matchUser = (v.user_name || v.user_phone || '').toLowerCase().includes(query);
        if (!matchPath && !matchDevice && !matchSession && !matchIp && !matchUser) return;
      }

      if (!groups[dateStr]) {
        groups[dateStr] = [];
      }
      groups[dateStr].push(v);
    });

    return groups;
  }, [visits, searchQuery, selectedDateFilter, selectedDeviceFilter]);

  const totalFilteredVisitors = useMemo(() => {
    return Object.values(groupedVisitors).reduce((acc, curr) => acc + curr.length, 0);
  }, [groupedVisitors]);

  return (
    <div className="space-y-6 font-sans">
      
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-6 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight flex items-center gap-2">
            <Eye className="w-6 h-6 text-teal-400" /> Website Visitors &amp; Lead Tracking
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Real-time page views, visitor device logs, IP tracking, and customer lead engagement.
          </p>
        </div>

        <button
          onClick={fetchVisitorData}
          disabled={loading}
          className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs flex items-center gap-2 shadow self-start sm:self-auto border border-slate-700 transition-all"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} /> Refresh Logs
        </button>
      </div>

      {/* Date Calendar & Search Controls */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Search IP, path, device, phone..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-950 text-white placeholder-slate-500 text-xs rounded-xl py-2.5 pl-9 pr-3 border border-slate-800 focus:outline-none focus:border-teal-500"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
          {/* Device Type Filter */}
          <select
            value={selectedDeviceFilter}
            onChange={(e) => setSelectedDeviceFilter(e.target.value)}
            className="bg-slate-950 text-white text-xs font-bold rounded-xl py-2 px-3 border border-slate-800 cursor-pointer"
          >
            <option value="All">All Devices</option>
            <option value="Mobile">Mobile Only</option>
            <option value="Desktop">Desktop Only</option>
          </select>

          {/* Date Picker */}
          <div className="flex items-center gap-1.5 bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-800">
            <Calendar className="w-3.5 h-3.5 text-teal-400" />
            <input
              type="date"
              value={selectedDateFilter}
              onChange={(e) => setSelectedDateFilter(e.target.value)}
              className="bg-transparent text-white text-xs font-bold cursor-pointer focus:outline-none"
            />
          </div>

          {(selectedDateFilter || searchQuery || selectedDeviceFilter !== 'All') && (
            <button 
              onClick={() => { setSelectedDateFilter(''); setSearchQuery(''); setSelectedDeviceFilter('All'); }} 
              className="text-xs text-red-400 hover:underline font-bold px-2 py-1 bg-red-950/40 rounded-lg border border-red-800/40"
            >
              Reset
            </button>
          )}
        </div>
      </div>

      {/* Loading Skeleton */}
      {loading ? (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-12 text-center text-slate-400 space-y-3 shadow-xl">
          <div className="w-10 h-10 border-4 border-teal-500/30 border-t-teal-400 rounded-full animate-spin mx-auto"></div>
          <p className="text-xs font-bold text-slate-300">Fetching visitor log records...</p>
        </div>
      ) : totalFilteredVisitors === 0 ? (
        /* Empty State */
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-12 text-center text-slate-500 shadow-xl">
          <Eye className="w-12 h-12 text-slate-700 mx-auto mb-3" />
          <p className="font-bold text-sm text-slate-300">No website visitor logs match this filter.</p>
          <p className="text-xs text-slate-500 mt-1">Real-time page views and user sessions will appear here as customers navigate your website.</p>
        </div>
      ) : (
        /* Date Grouped Cards */
        <div className="space-y-6">
          {Object.entries(groupedVisitors).map(([dateStr, items]) => (
            <div key={dateStr} className="space-y-3">
              
              {/* Date Header */}
              <div className="bg-gradient-to-r from-teal-950 via-slate-900 to-slate-950 border border-teal-800/60 rounded-xl px-4 py-2.5 flex items-center justify-between shadow-md">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-teal-400" />
                  <span className="font-black text-white text-sm">{dateStr}</span>
                </div>
                <span className="text-xs font-black bg-teal-950 border border-teal-700 text-teal-300 px-2.5 py-0.5 rounded-full">
                  {items.length} Visitor Sessions
                </span>
              </div>

              {/* Visitor Cards Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {items.map((v, idx) => {
                  const isMobile = (v.device_type || '').toLowerCase().includes('mobile') || (v.device_type || '').toLowerCase().includes('ios') || (v.device_type || '').toLowerCase().includes('android');
                  return (
                    <div key={v.id || idx} className="bg-slate-900 border border-slate-800 hover:border-teal-700/60 rounded-xl p-4 shadow-md space-y-3 text-xs transition-all">
                      
                      {/* Session & Device Header */}
                      <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                        <span className="font-mono text-[10px] text-teal-400 font-bold uppercase truncate max-w-[140px]">
                          {v.session_id || `session_${idx+1}`}
                        </span>
                        <span className="text-[10px] font-bold text-slate-300 uppercase bg-slate-950 px-2 py-0.5 rounded border border-slate-800 flex items-center gap-1">
                          {isMobile ? <Smartphone className="w-3 h-3 text-amber-400" /> : <Monitor className="w-3 h-3 text-blue-400" />}
                          {v.device_type || 'Desktop'}
                        </span>
                      </div>

                      {/* Visitor Details */}
                      <div className="space-y-1.5 text-slate-300">
                        <div className="flex items-center justify-between">
                          <span className="text-slate-400 font-medium">Page Visited:</span>
                          <code className="text-emerald-400 bg-slate-950 border border-slate-800 px-2 py-0.5 rounded text-[11px] font-mono font-bold truncate max-w-[160px]">
                            {v.path || '/'}
                          </code>
                        </div>

                        <div className="flex items-center justify-between text-[11px]">
                          <span className="text-slate-400 font-medium">Source / Referrer:</span>
                          <span className="text-slate-200 font-bold truncate max-w-[140px]">
                            {v.referrer || 'Direct'}
                          </span>
                        </div>

                        {v.ip_address || v.ip ? (
                          <div className="flex items-center justify-between text-[11px]">
                            <span className="text-slate-400 font-medium">IP Address:</span>
                            <span className="text-teal-300 font-mono font-bold bg-slate-950 px-1.5 py-0.5 rounded border border-slate-800">
                              {v.ip_address || v.ip}
                            </span>
                          </div>
                        ) : null}

                        {v.user_name || v.user_phone ? (
                          <div className="mt-2 p-2 bg-emerald-950/40 border border-emerald-800/60 rounded-lg space-y-0.5 text-[11px]">
                            <p className="font-bold text-emerald-300 flex items-center gap-1">
                              <User className="w-3 h-3" /> Lead: {v.user_name || 'Guest User'}
                            </p>
                            {v.user_phone && (
                              <p className="text-emerald-400 font-mono text-[10px]">📱 {v.user_phone}</p>
                            )}
                          </div>
                        ) : null}

                        <div className="flex items-center gap-1 text-[10px] text-slate-500 pt-1 border-t border-slate-800/60">
                          <Clock className="w-3 h-3 text-slate-400" />
                          <span>
                            {v.visited_at 
                              ? new Date(v.visited_at).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' })
                              : 'Just now'}
                          </span>
                        </div>
                      </div>

                    </div>
                  );
                })}
              </div>

            </div>
          ))}
        </div>
      )}

    </div>
  );
}


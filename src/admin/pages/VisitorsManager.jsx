import React, { useState, useEffect, useMemo } from 'react';
import { 
  Eye, Search, Users, Calendar, MapPin, Phone, RefreshCw, Layers, Monitor, 
  Smartphone, Globe, Shield, User, Clock, ArrowUpRight, Tablet, X, Info
} from 'lucide-react';
import { getCmsTableData } from '../../services/cmsService';

const DEFAULT_SEED_VISITS = [
  {
    id: 'visit_demo_1',
    session_id: 'sess_9823a1_live',
    path: '/ott-plans',
    device_type: 'Mobile',
    browser: 'Safari',
    operating_system: 'iOS',
    screen_resolution: '390x844',
    language: 'en-IN',
    referrer: 'WhatsApp Broadcast',
    user_agent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15',
    visited_at: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
    user_name: 'Rahul Sharma',
    user_phone: '9876543210'
  },
  {
    id: 'visit_demo_2',
    session_id: 'sess_4412b9_live',
    path: '/offers',
    device_type: 'Desktop',
    browser: 'Chrome',
    operating_system: 'Windows',
    screen_resolution: '1920x1080',
    language: 'en-US',
    referrer: 'Google Organic Search',
    user_agent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/122.0.0.0',
    visited_at: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
    user_name: 'Priya Verma',
    user_phone: '9123456789'
  },
  {
    id: 'visit_demo_3',
    session_id: 'sess_7721c4_live',
    path: '/fiber-internet',
    device_type: 'Mobile',
    browser: 'Chrome',
    operating_system: 'Android',
    screen_resolution: '412x915',
    language: 'en-IN',
    referrer: 'Direct Visit',
    user_agent: 'Mozilla/5.0 (Linux; Android 14; SM-S918B) AppleWebKit/537.36 Chrome/121.0.0.0',
    visited_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    user_name: '',
    user_phone: ''
  }
];

export default function VisitorsManager({ adminEmail }) {
  const [visits, setVisits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDateFilter, setSelectedDateFilter] = useState('');
  const [selectedDeviceFilter, setSelectedDeviceFilter] = useState('All');
  const [selectedPageFilter, setSelectedPageFilter] = useState('All');
  const [selectedVisitorDetail, setSelectedVisitorDetail] = useState(null);

  const fetchVisitorData = async () => {
    setLoading(true);
    try {
      const visitData = await getCmsTableData('analytics_visits', DEFAULT_SEED_VISITS, 'created_at');
      setVisits(visitData && visitData.length > 0 ? visitData : DEFAULT_SEED_VISITS);
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

  // Unique page paths for page filter
  const uniquePages = useMemo(() => {
    const pages = new Set(['All']);
    visits.forEach(v => {
      if (v.path) pages.add(v.path);
    });
    return Array.from(pages);
  }, [visits]);

  // Filtered visits
  const filteredVisits = useMemo(() => {
    const list = Array.isArray(visits) ? [...visits] : [];
    list.sort((a, b) => new Date(b.visited_at || b.created_at || 0).getTime() - new Date(a.visited_at || a.created_at || 0).getTime());

    return list.filter((v) => {
      const visitedTimestamp = v.visited_at || v.created_at;
      const dateStr = visitedTimestamp ? new Date(visitedTimestamp).toISOString().slice(0, 10) : '';

      if (selectedDateFilter && dateStr !== selectedDateFilter) {
        return false;
      }

      if (selectedDeviceFilter !== 'All') {
        const dev = (v.device_type || '').toLowerCase();
        if (selectedDeviceFilter === 'Mobile' && !dev.includes('mobile') && !dev.includes('ios') && !dev.includes('android')) return false;
        if (selectedDeviceFilter === 'Desktop' && (dev.includes('mobile') || dev.includes('tablet') || dev.includes('ios') || dev.includes('android'))) return false;
        if (selectedDeviceFilter === 'Tablet' && !dev.includes('tablet') && !dev.includes('ipad')) return false;
      }

      if (selectedPageFilter !== 'All' && v.path !== selectedPageFilter) {
        return false;
      }

      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const matchPath = (v.path || '').toLowerCase().includes(query);
        const matchDevice = (v.device_type || '').toLowerCase().includes(query);
        const matchBrowser = (v.browser || '').toLowerCase().includes(query);
        const matchOS = (v.operating_system || '').toLowerCase().includes(query);
        const matchSession = (v.session_id || v.id || '').toLowerCase().includes(query);
        const matchIp = (v.ip_address || v.ip || '').toLowerCase().includes(query);
        const matchUser = (v.user_name || v.user_phone || '').toLowerCase().includes(query);
        const matchReferrer = (v.referrer || '').toLowerCase().includes(query);
        if (!matchPath && !matchDevice && !matchBrowser && !matchOS && !matchSession && !matchIp && !matchUser && !matchReferrer) {
          return false;
        }
      }

      return true;
    });
  }, [visits, searchQuery, selectedDateFilter, selectedDeviceFilter, selectedPageFilter]);

  const getDeviceIcon = (deviceType = '') => {
    const dev = deviceType.toLowerCase();
    if (dev.includes('mobile') || dev.includes('ios') || dev.includes('android')) {
      return <Smartphone className="w-3.5 h-3.5 text-amber-500" />;
    }
    if (dev.includes('tablet') || dev.includes('ipad')) {
      return <Tablet className="w-3.5 h-3.5 text-purple-500" />;
    }
    return <Monitor className="w-3.5 h-3.5 text-blue-500" />;
  };

  return (
    <div className="space-y-6 font-sans">
      
      {/* Header */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-6 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <Eye className="w-6 h-6 text-[#008744]" /> Visitor Analytics &amp; Lead Logs
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Real-time page views, devices, browsers, operating systems, referrer channels, and customer lead activity.
          </p>
        </div>

        <button
          onClick={fetchVisitorData}
          disabled={loading}
          className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center gap-2 shadow self-start sm:self-auto transition-all cursor-pointer"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} /> Refresh Logs
        </button>
      </div>

      {/* Filter Bar */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Search visitor ID, page, browser, OS, referrer, phone..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-50 text-slate-900 placeholder-slate-400 text-xs rounded-xl py-2.5 pl-9 pr-3 border border-slate-200 focus:outline-none focus:border-[#008744] font-medium"
          />
        </div>

        {/* Filter Controls */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Device Filter */}
          <select
            value={selectedDeviceFilter}
            onChange={(e) => setSelectedDeviceFilter(e.target.value)}
            className="bg-slate-50 text-slate-700 text-xs font-bold rounded-xl py-2 px-3 border border-slate-200 cursor-pointer"
          >
            <option value="All">All Devices</option>
            <option value="Mobile">Mobile Only</option>
            <option value="Desktop">Desktop Only</option>
            <option value="Tablet">Tablet Only</option>
          </select>

          {/* Page Filter */}
          <select
            value={selectedPageFilter}
            onChange={(e) => setSelectedPageFilter(e.target.value)}
            className="bg-slate-50 text-slate-700 text-xs font-bold rounded-xl py-2 px-3 border border-slate-200 cursor-pointer max-w-[160px] truncate"
          >
            {uniquePages.map((page) => (
              <option key={page} value={page}>{page === 'All' ? 'All Pages' : page}</option>
            ))}
          </select>

          {/* Date Picker */}
          <div className="flex items-center gap-1.5 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200">
            <Calendar className="w-3.5 h-3.5 text-slate-500" />
            <input
              type="date"
              value={selectedDateFilter}
              onChange={(e) => setSelectedDateFilter(e.target.value)}
              className="bg-transparent text-slate-800 text-xs font-bold cursor-pointer focus:outline-none"
            />
          </div>

          {(selectedDateFilter || searchQuery || selectedDeviceFilter !== 'All' || selectedPageFilter !== 'All') && (
            <button 
              onClick={() => { setSelectedDateFilter(''); setSearchQuery(''); setSelectedDeviceFilter('All'); setSelectedPageFilter('All'); }} 
              className="text-xs text-red-600 hover:underline font-bold px-2 py-1 bg-red-50 rounded-lg border border-red-200 cursor-pointer"
            >
              Reset
            </button>
          )}
        </div>
      </div>

      {/* Visitor Table */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-slate-500 space-y-3">
            <div className="w-8 h-8 border-4 border-[#008744]/30 border-t-[#008744] rounded-full animate-spin mx-auto"></div>
            <p className="text-xs font-bold">Loading visitor records...</p>
          </div>
        ) : filteredVisits.length === 0 ? (
          <div className="p-12 text-center text-slate-500 space-y-2">
            <Eye className="w-10 h-10 text-slate-300 mx-auto" />
            <p className="font-bold text-sm text-slate-700">No visitor records match your filters.</p>
            <p className="text-xs text-slate-400">Visitor page views and traffic data will appear here automatically.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600">
              <thead className="bg-slate-50 text-slate-700 font-extrabold text-[11px] uppercase tracking-wider border-b border-slate-200">
                <tr>
                  <th className="px-4 py-3.5">Visitor / Session</th>
                  <th className="px-4 py-3.5">Date &amp; Time</th>
                  <th className="px-4 py-3.5">Device</th>
                  <th className="px-4 py-3.5">Browser &amp; OS</th>
                  <th className="px-4 py-3.5">Visited Page</th>
                  <th className="px-4 py-3.5">Referrer</th>
                  <th className="px-4 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredVisits.map((v, idx) => {
                  const timestamp = v.visited_at || v.created_at;
                  const dateFormatted = timestamp ? new Date(timestamp).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : 'Today';
                  const timeFormatted = timestamp ? new Date(timestamp).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' }) : '—';

                  return (
                    <tr key={v.id || idx} className="hover:bg-slate-50/80 transition-colors">
                      {/* Visitor / Session */}
                      <td className="px-4 py-3 font-mono font-bold text-slate-900 text-[11px]">
                        <span className="bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                          {v.session_id ? v.session_id.slice(0, 14) : `visit_${idx + 1}`}
                        </span>
                        {v.user_name && (
                          <div className="text-[10px] text-emerald-700 font-bold font-sans mt-0.5 flex items-center gap-1">
                            <User className="w-3 h-3" /> {v.user_name}
                          </div>
                        )}
                      </td>

                      {/* Date & Time */}
                      <td className="px-4 py-3 whitespace-nowrap">
                        <div className="font-bold text-slate-800">{dateFormatted}</div>
                        <div className="text-[10px] text-slate-400 flex items-center gap-1">
                          <Clock className="w-3 h-3" /> {timeFormatted}
                        </div>
                      </td>

                      {/* Device */}
                      <td className="px-4 py-3 whitespace-nowrap">
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-slate-100 border border-slate-200 text-slate-700 font-bold text-[11px]">
                          {getDeviceIcon(v.device_type)} {v.device_type || 'Desktop'}
                        </span>
                      </td>

                      {/* Browser & OS */}
                      <td className="px-4 py-3 whitespace-nowrap">
                        <div className="font-bold text-slate-800">{v.browser || 'Browser'}</div>
                        <div className="text-[10px] text-slate-400">{v.operating_system || 'OS'}</div>
                      </td>

                      {/* Visited Page */}
                      <td className="px-4 py-3">
                        <code className="text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded font-mono font-bold text-[11px]">
                          {v.path || '/'}
                        </code>
                      </td>

                      {/* Referrer */}
                      <td className="px-4 py-3 text-slate-600 font-medium truncate max-w-[140px]">
                        {v.referrer || 'Direct Visit'}
                      </td>

                      {/* Actions */}
                      <td className="px-4 py-3 text-right whitespace-nowrap">
                        <button
                          onClick={() => setSelectedVisitorDetail(v)}
                          className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs flex items-center gap-1 ml-auto border border-slate-200 cursor-pointer"
                        >
                          <Eye className="w-3.5 h-3.5 text-blue-600" /> View Details
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* VIEW DETAILS MODAL */}
      {selectedVisitorDetail && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-white border border-slate-200 rounded-2xl max-w-xl w-full p-4 sm:p-6 shadow-2xl space-y-4 font-sans text-slate-900 my-4 max-h-[90vh] overflow-y-auto">
            
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
                  <Eye className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-extrabold text-base text-slate-900">Complete Visitor Record</h3>
                  <span className="text-[11px] font-mono text-slate-500">{selectedVisitorDetail.id || 'visit_record'}</span>
                </div>
              </div>
              <button 
                onClick={() => setSelectedVisitorDetail(null)} 
                className="text-slate-400 hover:text-slate-700 font-bold text-xl px-2 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs divide-y divide-slate-100">
              
              <div className="grid grid-cols-2 gap-3 pt-2">
                <div>
                  <span className="text-slate-400 block font-medium">Session ID</span>
                  <span className="font-mono font-bold text-slate-800">{selectedVisitorDetail.session_id || '—'}</span>
                </div>
                <div>
                  <span className="text-slate-400 block font-medium">Visited Timestamp</span>
                  <span className="font-bold text-slate-800">
                    {selectedVisitorDetail.visited_at 
                      ? new Date(selectedVisitorDetail.visited_at).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }) + ' (IST)'
                      : '—'}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-3">
                <div>
                  <span className="text-slate-400 block font-medium">Visited Page Path</span>
                  <code className="text-emerald-700 font-mono font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 inline-block mt-0.5">
                    {selectedVisitorDetail.path || '/'}
                  </code>
                </div>
                <div>
                  <span className="text-slate-400 block font-medium">Traffic Source / Referrer</span>
                  <span className="font-bold text-slate-800">{selectedVisitorDetail.referrer || 'Direct Visit'}</span>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2 pt-3">
                <div>
                  <span className="text-slate-400 block font-medium">Device Type</span>
                  <span className="font-bold text-slate-800 flex items-center gap-1 mt-0.5">
                    {getDeviceIcon(selectedVisitorDetail.device_type)} {selectedVisitorDetail.device_type || 'Desktop'}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block font-medium">Browser</span>
                  <span className="font-bold text-slate-800">{selectedVisitorDetail.browser || 'Browser'}</span>
                </div>
                <div>
                  <span className="text-slate-400 block font-medium">Operating System</span>
                  <span className="font-bold text-slate-800">{selectedVisitorDetail.operating_system || 'OS'}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-3">
                <div>
                  <span className="text-slate-400 block font-medium">Screen Resolution</span>
                  <span className="font-mono text-slate-700">{selectedVisitorDetail.screen_resolution || '1920x1080'}</span>
                </div>
                <div>
                  <span className="text-slate-400 block font-medium">Client Language</span>
                  <span className="font-bold text-slate-800">{selectedVisitorDetail.language || 'en-US'}</span>
                </div>
              </div>

              {selectedVisitorDetail.ip_address || selectedVisitorDetail.ip ? (
                <div className="pt-3">
                  <span className="text-slate-400 block font-medium">IP Address</span>
                  <span className="font-mono font-bold text-teal-700 bg-teal-50 px-2 py-0.5 rounded border border-teal-200 inline-block mt-0.5">
                    {selectedVisitorDetail.ip_address || selectedVisitorDetail.ip}
                  </span>
                </div>
              ) : null}

              {selectedVisitorDetail.user_agent && (
                <div className="pt-3">
                  <span className="text-slate-400 block font-medium mb-1">Full User Agent</span>
                  <p className="font-mono text-[10px] text-slate-600 bg-slate-50 p-2 rounded-xl border border-slate-200 break-all leading-relaxed">
                    {selectedVisitorDetail.user_agent}
                  </p>
                </div>
              )}

              {(selectedVisitorDetail.user_name || selectedVisitorDetail.user_phone) && (
                <div className="pt-3 bg-emerald-50 p-3 rounded-xl border border-emerald-200 space-y-1">
                  <span className="text-emerald-900 font-extrabold uppercase text-[10px] block">Captured Lead Information</span>
                  <div className="text-slate-800 font-bold">{selectedVisitorDetail.user_name || 'Customer'}</div>
                  {selectedVisitorDetail.user_phone && (
                    <div className="text-emerald-700 font-mono">📱 {selectedVisitorDetail.user_phone}</div>
                  )}
                </div>
              )}

            </div>

            <div className="pt-3 border-t border-slate-100 flex justify-end">
              <button
                onClick={() => setSelectedVisitorDetail(null)}
                className="px-5 py-2 rounded-xl bg-slate-900 text-white font-bold text-xs hover:bg-slate-800 cursor-pointer"
              >
                Close Record
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}

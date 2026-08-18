import React, { useState, useEffect, useMemo } from 'react';
import { 
  Eye, Search, Users, Calendar, MapPin, Phone, RefreshCw, Layers 
} from 'lucide-react';
import { getCmsTableData } from '../../services/cmsService';

export default function VisitorsManager({ adminEmail }) {
  const [visits, setVisits] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDateFilter, setSelectedDateFilter] = useState('');

  const fetchVisitorData = async () => {
    setLoading(true);
    try {
      const [visitData, userData] = await Promise.all([
        getCmsTableData('analytics_visits', [], 'visited_at'),
        getCmsTableData('users', [], 'created_at')
      ]);
      setVisits(visitData || []);
      setUsers(userData || []);
    } catch (err) {
      console.error('Error fetching visitor data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVisitorData();
  }, []);

  // Filter & Group Visitors by Date
  const groupedVisitors = useMemo(() => {
    const list = [...visits].reverse();
    const groups = {};

    list.forEach((v) => {
      const dateStr = v.visited_at ? new Date(v.visited_at).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : 'Unknown Date';
      
      if (selectedDateFilter) {
        const selStr = new Date(selectedDateFilter).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
        if (dateStr !== selStr) return;
      }

      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const matchPath = (v.path || '').toLowerCase().includes(query);
        const matchDevice = (v.device_type || '').toLowerCase().includes(query);
        const matchSession = (v.session_id || '').toLowerCase().includes(query);
        if (!matchPath && !matchDevice && !matchSession) return;
      }

      if (!groups[dateStr]) {
        groups[dateStr] = [];
      }
      groups[dateStr].push(v);
    });

    return groups;
  }, [visits, searchQuery, selectedDateFilter]);

  return (
    <div className="space-y-6 font-sans">
      
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-6 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight flex items-center gap-2">
            <Eye className="w-6 h-6 text-teal-400" /> Website Visitors &amp; Lead Tracking
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Track non-purchasing visitors and registered leads grouped by date.
          </p>
        </div>

        <button
          onClick={fetchVisitorData}
          disabled={loading}
          className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs flex items-center gap-2 shadow self-start sm:self-auto"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} /> Refresh Visitors
        </button>
      </div>

      {/* Date Calendar & Search Controls */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Search visitor session, path, device..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-950 text-white placeholder-slate-500 text-xs rounded-xl py-2.5 pl-9 pr-3 border border-slate-800 focus:outline-none focus:border-teal-500"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Calendar className="w-4 h-4 text-slate-400" />
          <input
            type="date"
            value={selectedDateFilter}
            onChange={(e) => setSelectedDateFilter(e.target.value)}
            className="bg-slate-950 text-white text-xs font-bold rounded-xl py-2 px-3 border border-slate-800 cursor-pointer"
          />
          {selectedDateFilter && (
            <button onClick={() => setSelectedDateFilter('')} className="text-xs text-red-400 hover:underline font-bold">Clear</button>
          )}
        </div>
      </div>

      {/* Date Grouped Cards */}
      {Object.keys(groupedVisitors).length === 0 ? (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-12 text-center text-slate-500">
          <Eye className="w-12 h-12 text-slate-700 mx-auto mb-3" />
          <p className="font-bold text-sm text-slate-300">No website visitor logs recorded for this filter.</p>
          <p className="text-xs mt-1">Real page views and registered visitor sessions will appear here dynamically.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {Object.entries(groupedVisitors).map(([dateStr, items]) => (
            <div key={dateStr} className="space-y-3">
              
              {/* Date Grouping Colored Box */}
              <div className="bg-gradient-to-r from-teal-900/80 to-slate-900 border border-teal-800/60 rounded-xl px-4 py-2.5 flex items-center justify-between shadow-md">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-teal-400" />
                  <span className="font-black text-white text-sm">{dateStr}</span>
                </div>
                <span className="text-xs font-black bg-teal-950 border border-teal-700 text-teal-300 px-2.5 py-0.5 rounded-full">
                  {items.length} Visitors Recorded
                </span>
              </div>

              {/* Visitor Cards Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {items.map((v) => (
                  <div key={v.id} className="bg-slate-900 border border-slate-800 rounded-xl p-3.5 shadow-md space-y-2 text-xs">
                    <div className="flex items-center justify-between border-b border-slate-800/60 pb-2">
                      <span className="font-mono text-[10px] text-teal-400 font-bold uppercase truncate max-w-[140px]">
                        {v.session_id || 'Session'}
                      </span>
                      <span className="text-[10px] font-bold text-slate-400 uppercase bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
                        {v.device_type || 'Desktop'}
                      </span>
                    </div>

                    <div className="space-y-1 text-slate-300">
                      <p className="font-semibold text-white truncate">
                        Viewed Path: <code className="text-emerald-400 bg-slate-950 px-1.5 py-0.5 rounded text-[11px]">{v.path || '/'}</code>
                      </p>
                      <p className="text-[11px] text-slate-400 truncate">
                        Referrer: {v.referrer || 'Direct'}
                      </p>
                      <p className="text-[10px] text-slate-500 pt-1">
                        Time: {v.visited_at ? new Date(v.visited_at).toLocaleTimeString() : 'N/A'}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

            </div>
          ))}
        </div>
      )}

    </div>
  );
}

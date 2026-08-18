import React, { useState, useMemo } from 'react';
import { 
  Users, Search, UserCheck, Shield, MapPin, Phone, Mail, Calendar, Power, Check 
} from 'lucide-react';
import { useCMS } from '../../context/CMSContext';

export default function MembersManager({ adminEmail }) {
  const { members, saveCmsItem, logActivity, refreshAllData } = useCMS();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [toastMsg, setToastMsg] = useState('');

  const showToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(''), 3000);
  };

  // Group Users by Registration Date
  const groupedMembers = useMemo(() => {
    const sorted = [...members].sort((a, b) => new Date(b.registration_date || 0) - new Date(a.registration_date || 0));

    const filtered = sorted.filter((m) => {
      const matchQuery = !searchQuery || 
        (m.full_name && m.full_name.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (m.mobile_number && m.mobile_number.includes(searchQuery)) ||
        (m.email && m.email.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (m.location && m.location.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchStatus = statusFilter === 'All' || m.account_status === statusFilter;
      return matchQuery && matchStatus;
    });

    const groups = {};
    filtered.forEach((m) => {
      const dateStr = m.registration_date 
        ? new Date(m.registration_date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
        : 'Unknown Date';

      if (!groups[dateStr]) {
        groups[dateStr] = [];
      }
      groups[dateStr].push(m);
    });

    return groups;
  }, [members, searchQuery, statusFilter]);

  const handleToggleUserStatus = async (userObj) => {
    try {
      const newStatus = userObj.account_status === 'Disabled' ? 'Active' : 'Disabled';
      const updated = { ...userObj, account_status: newStatus };
      await saveCmsItem('users', updated);
      await logActivity(adminEmail, 'UPDATED', 'Members', `${userObj.full_name || userObj.mobile_number} set to ${newStatus}`);
      refreshAllData();
      showToast(`User Account set to ${newStatus}`);
    } catch (err) {
      alert('Error updating user status: ' + err.message);
    }
  };

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
            <Users className="w-6 h-6 text-cyan-400" /> Registered Website Members ({members.length})
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Registered customer accounts grouped by registration date.
          </p>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Search by Name, Mobile, Email, Location..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-950 text-white placeholder-slate-500 text-xs rounded-xl py-2.5 pl-9 pr-3 border border-slate-800 focus:outline-none focus:border-cyan-500"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <span className="text-xs font-bold text-slate-400">Status:</span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-slate-950 text-white text-xs font-bold rounded-xl py-2 px-3 border border-slate-800"
          >
            <option value="All">All Users</option>
            <option value="Active">Active Only</option>
            <option value="Disabled">Disabled Only</option>
          </select>
        </div>
      </div>

      {/* Date Grouped User Cards */}
      {Object.keys(groupedMembers).length === 0 ? (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-12 text-center text-slate-500">
          <UserCheck className="w-12 h-12 text-slate-700 mx-auto mb-3" />
          <p className="font-bold text-sm text-slate-300">No registered members found</p>
          <p className="text-xs mt-1">Registered customers will appear here automatically when they sign up.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {Object.entries(groupedMembers).map(([dateStr, usersList]) => (
            <div key={dateStr} className="space-y-3">
              
              {/* DATE GROUPING COLORED HEADING BOX */}
              <div className="bg-gradient-to-r from-cyan-950 via-slate-900 to-slate-900 border border-cyan-800/60 rounded-xl px-4 py-2.5 flex items-center justify-between shadow-md">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-cyan-400" />
                  <h3 className="font-black text-white text-sm sm:text-base">
                    Registered — <span className="text-cyan-300">{dateStr}</span> ({usersList.length} Members)
                  </h3>
                </div>
              </div>

              {/* Members Cards Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {usersList.map((m) => (
                  <div key={m.id} className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-xl space-y-3 font-sans">
                    <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                      <div>
                        <h4 className="font-black text-white text-base">{m.full_name || 'Customer'}</h4>
                        <span className="text-[10px] font-bold text-cyan-400 bg-cyan-950/60 border border-cyan-800/60 px-2 py-0.5 rounded-full">
                          Registered Member
                        </span>
                      </div>
                      <button
                        onClick={() => handleToggleUserStatus(m)}
                        className={`px-2.5 py-1 rounded-xl text-[10px] font-black border flex items-center gap-1 ${
                          m.account_status !== 'Disabled'
                            ? 'bg-emerald-950 border-emerald-700 text-emerald-300'
                            : 'bg-red-950 border-red-800 text-red-300'
                        }`}
                      >
                        <Power className="w-3 h-3" />
                        <span>{m.account_status || 'Active'}</span>
                      </button>
                    </div>

                    <div className="space-y-2 text-xs text-slate-300">
                      <div className="flex items-center gap-2">
                        <Phone className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                        <span className="font-bold text-white">{m.mobile_number || 'N/A'}</span>
                      </div>

                      <div className="flex items-center gap-2">
                        <Mail className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                        <span className="truncate">{m.email || 'No email provided'}</span>
                      </div>

                      <div className="flex items-center gap-2">
                        <MapPin className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                        <span className="truncate">{m.location || 'Location not specified'}</span>
                      </div>
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

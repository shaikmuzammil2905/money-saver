import React, { useState, useEffect } from 'react';
import { X, User, Phone, MapPin, Package, Clock, CheckCircle2, AlertCircle, Edit2, LogOut, ChevronRight } from 'lucide-react';
import { getCustomerOrders, saveUserProfile } from '../services/orderService';

export default function CustomerProfileModal({ isOpen, onClose, user, onLogout, onUpdateUser }) {
  const [activeTab, setActiveTab] = useState('orders'); // 'orders' or 'profile'
  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(false);

  // Edit State
  const [isEditing, setIsEditing] = useState(false);
  const [fullName, setFullName] = useState('');
  const [location, setLocation] = useState('');

  useEffect(() => {
    if (user) {
      setFullName(user.fullName || '');
      setLocation(user.location || '');
      loadOrders();
    }
  }, [user, isOpen]);

  const loadOrders = async () => {
    if (!user?.mobileNumber) return;
    setLoadingOrders(true);
    const fetched = await getCustomerOrders(user.mobileNumber);
    setOrders(fetched || []);
    setLoadingOrders(false);
  };

  if (!isOpen) return null;

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    const updated = {
      ...user,
      fullName: fullName.trim() || user.fullName,
      location: location.trim() || user.location
    };
    await saveUserProfile(updated);
    if (onUpdateUser) onUpdateUser(updated);
    setIsEditing(false);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden font-sans">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm transition-opacity animate-fadeIn" 
        onClick={onClose}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-lg bg-white shadow-2xl flex flex-col justify-between">
          
          {/* Header */}
          <div className="p-4 sm:p-6 bg-slate-950 text-white flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#008744] flex items-center justify-center font-extrabold text-white text-base">
                {user?.fullName?.charAt(0)?.toUpperCase() || 'C'}
              </div>
              <div>
                <h2 className="text-base font-bold">{user?.fullName || 'Customer Profile'}</h2>
                <p className="text-xs text-slate-400">📞 {user?.mobileNumber}</p>
              </div>
            </div>
            <button 
              onClick={onClose}
              className="p-1.5 rounded-full hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Tabs */}
          <div className="flex border-b border-slate-200 bg-slate-50">
            <button
              onClick={() => setActiveTab('orders')}
              className={`flex-1 py-3 text-xs font-bold transition-all border-b-2 flex items-center justify-center gap-1.5 ${
                activeTab === 'orders'
                  ? 'border-[#e50914] text-[#e50914] bg-white'
                  : 'border-transparent text-slate-500 hover:text-slate-900'
              }`}
            >
              <Package className="w-4 h-4" />
              <span>Order History ({orders.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('profile')}
              className={`flex-1 py-3 text-xs font-bold transition-all border-b-2 flex items-center justify-center gap-1.5 ${
                activeTab === 'profile'
                  ? 'border-[#e50914] text-[#e50914] bg-white'
                  : 'border-transparent text-slate-500 hover:text-slate-900'
              }`}
            >
              <User className="w-4 h-4" />
              <span>Account Details</span>
            </button>
          </div>

          {/* Body Content */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
            
            {/* ORDERS TAB */}
            {activeTab === 'orders' && (
              <div className="space-y-4">
                {loadingOrders ? (
                  <div className="text-center py-12 text-slate-400 text-xs font-bold">
                    Loading your orders...
                  </div>
                ) : orders.length === 0 ? (
                  <div className="text-center py-12 space-y-3">
                    <Package className="w-16 h-16 text-slate-300 mx-auto" />
                    <h3 className="text-base font-bold text-slate-700">You haven't placed any orders yet</h3>
                    <p className="text-xs text-slate-500 max-w-xs mx-auto">
                      Explore our high-speed Fiber plans, OTT subscriptions, and mobile gadgets to place your first order!
                    </p>
                  </div>
                ) : (
                  orders.map((ord) => (
                    <div key={ord.orderId} className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-3 shadow-sm">
                      
                      {/* Top Order ID & Status */}
                      <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                        <div>
                          <span className="text-xs font-black text-slate-900 font-mono">
                            {ord.orderId}
                          </span>
                          <p className="text-[10px] text-slate-400">
                            {new Date(ord.createdAt).toLocaleString()}
                          </p>
                        </div>

                        <span className={`text-[10px] font-black px-2.5 py-1 rounded-full border ${
                          ord.paymentStatus === 'Payment Verification Pending'
                            ? 'bg-amber-50 text-amber-700 border-amber-200'
                            : 'bg-red-50 text-red-700 border-red-200'
                        }`}>
                          {ord.paymentStatus}
                        </span>
                      </div>

                      {/* Items List */}
                      <div className="space-y-1.5">
                        {ord.items?.map((it, idx) => (
                          <div key={idx} className="flex justify-between text-xs text-slate-700">
                            <span className="font-semibold line-clamp-1 flex-1 pr-2">
                              {it.title} (x{it.quantity})
                            </span>
                            <span className="font-black text-slate-900 shrink-0">
                              ₹{(it.price * it.quantity).toLocaleString()}
                            </span>
                          </div>
                        ))}
                      </div>

                      {/* Footer Total */}
                      <div className="pt-2 border-t border-slate-200 flex justify-between items-center text-xs font-bold">
                        <span className="text-slate-500">Total Amount</span>
                        <span className="text-sm font-black text-[#008744]">
                          ₹{ord.totalAmount?.toLocaleString()}
                        </span>
                      </div>

                      {ord.paymentScreenshotUrl && (
                        <div className="pt-2">
                          <p className="text-[11px] font-bold text-slate-700 mb-1 flex items-center gap-1">
                            <span>📷 Payment Screenshot Proof:</span>
                          </p>
                          <div 
                            className="relative w-full max-w-xs h-36 bg-slate-900 rounded-xl overflow-hidden border border-slate-300 shadow-sm cursor-pointer group"
                            onClick={() => window.open(ord.paymentScreenshotUrl, '_blank')}
                            title="Click to view full size"
                          >
                            <img
                              src={ord.paymentScreenshotUrl}
                              alt="Payment Proof Screenshot"
                              className="w-full h-full object-contain group-hover:scale-105 transition-transform"
                            />
                            <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs font-bold">
                              Click to view full size 🔍
                            </div>
                          </div>
                        </div>
                      )}

                    </div>
                  ))
                )}
              </div>
            )}

            {/* PROFILE TAB */}
            {activeTab === 'profile' && (
              <div className="space-y-6">
                {!isEditing ? (
                  <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-black text-slate-900">Personal Information</h3>
                      <button
                        onClick={() => setIsEditing(true)}
                        className="text-xs font-bold text-[#e50914] flex items-center gap-1 hover:underline"
                      >
                        <Edit2 className="w-3.5 h-3.5" /> Edit Profile
                      </button>
                    </div>

                    <div className="space-y-3 text-xs">
                      <div>
                        <span className="text-slate-400 block font-medium">Full Name</span>
                        <span className="text-slate-900 font-extrabold text-sm">{user?.fullName}</span>
                      </div>

                      <div>
                        <span className="text-slate-400 block font-medium">Mobile Number</span>
                        <span className="text-slate-900 font-extrabold text-sm">{user?.mobileNumber}</span>
                      </div>

                      <div>
                        <span className="text-slate-400 block font-medium">Delivery Address / Location</span>
                        <span className="text-slate-900 font-semibold leading-relaxed block mt-0.5">{user?.location}</span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <form onSubmit={handleSaveProfile} className="bg-slate-50 border border-slate-200 rounded-2xl p-5 space-y-4">
                    <h3 className="text-sm font-black text-slate-900">Update Profile Details</h3>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Full Name</label>
                      <input
                        type="text"
                        required
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        className="w-full bg-white text-xs rounded-xl py-2 px-3 border border-slate-200 focus:outline-none focus:border-[#008744]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Delivery Address</label>
                      <textarea
                        rows={3}
                        required
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        className="w-full bg-white text-xs rounded-xl py-2 px-3 border border-slate-200 focus:outline-none focus:border-[#008744]"
                      />
                    </div>

                    <div className="flex gap-2">
                      <button
                        type="submit"
                        className="flex-1 py-2.5 rounded-xl bg-[#008744] text-white font-bold text-xs shadow hover:bg-emerald-700"
                      >
                        Save Changes
                      </button>
                      <button
                        type="button"
                        onClick={() => setIsEditing(false)}
                        className="px-4 py-2.5 rounded-xl bg-slate-200 text-slate-700 font-bold text-xs"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                )}

                {/* Logout Button */}
                <button
                  onClick={onLogout}
                  className="w-full py-3 px-4 rounded-2xl border border-red-200 bg-red-50 hover:bg-red-100 text-red-600 font-extrabold text-xs transition-colors flex items-center justify-center gap-2"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Logout Account</span>
                </button>

              </div>
            )}

          </div>

        </div>
      </div>
    </div>
  );
}

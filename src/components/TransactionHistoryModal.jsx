import React, { useState, useEffect } from 'react';
import { 
  X, 
  Receipt, 
  Calendar, 
  Clock, 
  CheckCircle2, 
  ChevronRight, 
  MessageCircle, 
  User, 
  Phone, 
  MapPin, 
  Mail, 
  CreditCard, 
  Package, 
  ExternalLink,
  ArrowLeft
} from 'lucide-react';
import { getCustomerTransactions, formatWhatsAppOrderMessage } from '../services/orderService';
import { useCMS } from '../context/CMSContext';

export default function TransactionHistoryModal({ 
  isOpen, 
  onClose, 
  customerPhone = '' 
}) {
  const { cartSettings } = useCMS();
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTransaction, setSelectedTransaction] = useState(null);

  const cleanWhatsAppNumber = () => {
    let rawNum = cartSettings?.whatsapp_number || '916305151531';
    let clean = String(rawNum).replace(/\D/g, '');
    if (!clean.startsWith('91') && clean.length === 10) clean = '91' + clean;
    return clean || '916305151531';
  };

  useEffect(() => {
    if (!isOpen) {
      setSelectedTransaction(null);
      return;
    }
    const loadTxns = async () => {
      setLoading(true);
      try {
        const phone = customerPhone || localStorage.getItem('customerPhone') || '';
        const list = await getCustomerTransactions(phone);
        setTransactions(list || []);
      } catch (err) {
        console.error('Failed to load transaction history:', err);
      } finally {
        setLoading(false);
      }
    };
    loadTxns();
  }, [isOpen, customerPhone]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden font-sans">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-slate-950/75 backdrop-blur-sm transition-opacity" 
        onClick={onClose}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-6 sm:pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col justify-between">
          
          {/* Header */}
          <div className="p-4 sm:p-5 bg-slate-950 text-white flex items-center justify-between">
            <div className="flex items-center gap-2">
              {selectedTransaction ? (
                <button 
                  onClick={() => setSelectedTransaction(null)}
                  className="p-1 rounded-lg hover:bg-slate-800 text-slate-300 hover:text-white mr-1 cursor-pointer"
                  title="Back to Transactions List"
                >
                  <ArrowLeft className="w-5 h-5" />
                </button>
              ) : (
                <Receipt className="w-5 h-5 text-[#008744]" />
              )}
              <h2 className="text-base sm:text-lg font-bold">
                {selectedTransaction ? 'Order Details' : 'Transaction History'}
              </h2>
            </div>
            <button 
              onClick={onClose}
              className="p-1.5 rounded-full hover:bg-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Content Body */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
            
            {loading ? (
              <div className="py-20 text-center space-y-3">
                <div className="w-8 h-8 border-3 border-[#008744] border-t-transparent rounded-full animate-spin mx-auto" />
                <p className="text-xs font-bold text-slate-500">Loading your transactions...</p>
              </div>
            ) : selectedTransaction ? (
              /* DETAIL VIEW */
              <div className="space-y-4">
                
                {/* Header Status Card */}
                <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 text-center space-y-2">
                  <div className="w-10 h-10 bg-[#008744] text-white rounded-full flex items-center justify-center mx-auto shadow-md">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <h3 className="font-black text-slate-900 text-base">Payment Successful</h3>
                  <div className="inline-block bg-white px-3 py-1 rounded-lg border border-emerald-300 text-xs font-mono font-bold text-slate-800">
                    Order ID: {selectedTransaction.orderId}
                  </div>
                </div>

                {/* Product Details */}
                <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-3">
                  <h4 className="text-xs font-black uppercase text-slate-700 tracking-wider flex items-center gap-1.5">
                    <Package className="w-4 h-4 text-slate-500" /> Product Details
                  </h4>
                  <div className="space-y-2 divide-y divide-slate-200/60">
                    {Array.isArray(selectedTransaction.items) && selectedTransaction.items.length > 0 ? (
                      selectedTransaction.items.map((it, idx) => (
                        <div key={idx} className="pt-2 first:pt-0 flex items-center justify-between text-xs">
                          <div>
                            <p className="font-bold text-slate-900">{it.title || 'Product'}</p>
                            <p className="text-[11px] text-slate-500">Qty: {it.quantity || 1}</p>
                          </div>
                          <span className="font-black text-slate-900">
                            ₹{(Number(it.price) || 0) * (Number(it.quantity) || 1)}
                          </span>
                        </div>
                      ))
                    ) : (
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-bold text-slate-900">OTT Subscription Plan</span>
                        <span className="font-black text-slate-900">₹{selectedTransaction.totalAmount}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Customer Details */}
                <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-2.5 text-xs">
                  <h4 className="text-xs font-black uppercase text-slate-700 tracking-wider flex items-center gap-1.5 mb-2">
                    <User className="w-4 h-4 text-slate-500" /> Customer Details
                  </h4>
                  <div className="flex items-center justify-between text-slate-600">
                    <span>Name:</span>
                    <strong className="text-slate-900">{selectedTransaction.customerName || '—'}</strong>
                  </div>
                  <div className="flex items-center justify-between text-slate-600">
                    <span>Mobile:</span>
                    <strong className="text-slate-900 font-mono">{selectedTransaction.mobileNumber || '—'}</strong>
                  </div>
                  {selectedTransaction.email && (
                    <div className="flex items-center justify-between text-slate-600">
                      <span>Email:</span>
                      <strong className="text-slate-900">{selectedTransaction.email}</strong>
                    </div>
                  )}
                  {selectedTransaction.location && (
                    <div className="flex items-center justify-between text-slate-600">
                      <span>Location:</span>
                      <strong className="text-slate-900">{selectedTransaction.location}</strong>
                    </div>
                  )}
                </div>

                {/* Payment Details */}
                <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-2.5 text-xs">
                  <h4 className="text-xs font-black uppercase text-slate-700 tracking-wider flex items-center gap-1.5 mb-2">
                    <CreditCard className="w-4 h-4 text-slate-500" /> Payment Details
                  </h4>
                  <div className="flex items-center justify-between text-slate-600">
                    <span>Total Amount:</span>
                    <strong className="text-[#008744] text-sm font-black">₹{selectedTransaction.totalAmount}</strong>
                  </div>
                  <div className="flex items-center justify-between text-slate-600">
                    <span>Payment Status:</span>
                    <span className="px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 font-bold text-[11px]">
                      {selectedTransaction.paymentStatus || 'Successful'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-slate-600">
                    <span>Transaction ID:</span>
                    <strong className="text-slate-800 font-mono text-[11px] truncate max-w-[180px]">
                      {selectedTransaction.transactionId || '—'}
                    </strong>
                  </div>
                  <div className="flex items-center justify-between text-slate-600">
                    <span>Date &amp; Time:</span>
                    <strong className="text-slate-800">
                      {selectedTransaction.paymentDate} at {selectedTransaction.paymentTime}
                    </strong>
                  </div>
                  <div className="flex items-center justify-between text-slate-600">
                    <span>Payment Method:</span>
                    <strong className="text-slate-800">{selectedTransaction.paymentMethod || 'Razorpay / UPI'}</strong>
                  </div>
                </div>

                {/* WhatsApp Action Button */}
                <div className="pt-2">
                  <a
                    href={`https://api.whatsapp.com/send?phone=${cleanWhatsAppNumber()}&text=${encodeURIComponent(formatWhatsAppOrderMessage(selectedTransaction))}`}
                    target="_blank"
                    rel="noreferrer"
                    className="w-full py-3 px-4 rounded-xl bg-[#008744] hover:bg-[#007038] text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>Get Instant Activation on WhatsApp</span>
                  </a>
                </div>

              </div>
            ) : transactions.length === 0 ? (
              /* EMPTY STATE */
              <div className="py-20 text-center space-y-3 text-slate-500">
                <Receipt className="w-12 h-12 text-slate-300 mx-auto" />
                <h4 className="font-black text-slate-800 text-sm">No Transactions Yet</h4>
                <p className="text-xs text-slate-400 max-w-xs mx-auto">
                  When you complete an order and payment is verified, your order details will be saved here.
                </p>
              </div>
            ) : (
              /* LIST VIEW */
              <div className="space-y-3">
                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  Verified Transactions ({transactions.length})
                </p>
                {transactions.map((tx) => (
                  <div 
                    key={tx.orderId}
                    className="bg-white border border-slate-200 hover:border-slate-300 rounded-2xl p-4 space-y-3 shadow-sm transition-all"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <span className="font-mono text-xs font-black text-slate-900">
                          {tx.orderId}
                        </span>
                        <div className="flex items-center gap-2 text-[11px] text-slate-500 mt-0.5">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" /> {tx.paymentDate || 'Today'}
                          </span>
                          <span>•</span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" /> {tx.paymentTime || ''}
                          </span>
                        </div>
                      </div>
                      <span className="text-sm font-black text-[#008744]">
                        ₹{tx.totalAmount}
                      </span>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
                      <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-bold">
                        {tx.paymentStatus || 'Successful'}
                      </span>
                      <button
                        onClick={() => setSelectedTransaction(tx)}
                        className="font-bold text-xs text-blue-600 hover:text-blue-700 flex items-center gap-1 cursor-pointer"
                      >
                        View Details <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

          </div>

          {/* Footer */}
          <div className="p-4 bg-slate-50 border-t border-slate-200">
            <button
              onClick={onClose}
              className="w-full py-2.5 rounded-xl border border-slate-300 text-slate-700 font-bold text-xs hover:bg-white transition-all cursor-pointer"
            >
              Close
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}

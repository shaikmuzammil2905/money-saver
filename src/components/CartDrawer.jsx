import React, { useState, useEffect } from 'react';
import { 
  X, 
  ShoppingBag, 
  Trash2, 
  CheckCircle2, 
  ArrowRight, 
  ShieldCheck, 
  Lock, 
  AlertCircle,
  MessageCircle,
  Tag,
  CreditCard
} from 'lucide-react';
import { DEFAULT_PAYMENT_CONFIG } from '../config/payment';
import { useCMS } from '../context/CMSContext';

// Helper to load Razorpay script on demand
const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    if (typeof window !== 'undefined' && window.Razorpay) {
      resolve(true);
      return;
    }
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

export default function CartDrawer({
  isOpen,
  onClose,
  cartItems = [],
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  user,
  onOpenAuthModal
}) {
  const { cartSettings, validateCoupon } = useCMS();
  const [paymentConfig, setPaymentConfig] = useState(cartSettings || DEFAULT_PAYMENT_CONFIG);

  // Coupon State
  const [couponCodeInput, setCouponCodeInput] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [couponDiscount, setCouponDiscount] = useState(0);
  const [couponMsg, setCouponMsg] = useState('');
  const [couponError, setCouponError] = useState('');
  const [applyingCoupon, setApplyingCoupon] = useState(false);

  // Customer Form State
  const [customerName, setCustomerName] = useState(() => {
    return localStorage.getItem('customerName') || '';
  });
  const [customerPhone, setCustomerPhone] = useState(() => {
    return localStorage.getItem('customerPhone') || '';
  });
  const [customerLocation, setCustomerLocation] = useState(() => {
    return localStorage.getItem('customerLocation') || '';
  });
  const [customerEmail, setCustomerEmail] = useState(() => {
    return localStorage.getItem('customerEmail') || '';
  });

  const [detectingLocation, setDetectingLocation] = useState(false);
  const [locationError, setLocationError] = useState('');
  const [paymentError, setPaymentError] = useState('');
  
  // Checkout & Payment State
  const [orderSubmitting, setOrderSubmitting] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [confirmedOrderId, setConfirmedOrderId] = useState('');

  // 1. Synchronize payment config
  useEffect(() => {
    if (cartSettings) {
      setPaymentConfig(cartSettings);
    }
  }, [cartSettings]);

  // 2. Autofill user data if logged in
  useEffect(() => {
    if (user) {
      if (user.fullName && !customerName) {
        setCustomerName(user.fullName);
        localStorage.setItem('customerName', user.fullName);
      }
      if (user.mobileNumber && !customerPhone) {
        setCustomerPhone(user.mobileNumber);
        localStorage.setItem('customerPhone', user.mobileNumber);
      }
      if (user.location && !customerLocation) {
        setCustomerLocation(user.location);
        localStorage.setItem('customerLocation', user.location);
      }
      if (user.email && !customerEmail) {
        setCustomerEmail(user.email);
        localStorage.setItem('customerEmail', user.email);
      }
    }
  }, [user]);

  // Calculations
  const subtotal = cartItems.reduce((acc, item) => acc + (Number(item.price) || 0) * (Number(item.quantity) || 1), 0);
  const totalOriginal = cartItems.reduce((acc, item) => acc + (Number(item.originalPrice) || Number(item.price) || 0) * (Number(item.quantity) || 1), 0);
  const totalSavings = Math.max(0, totalOriginal - subtotal);
  const finalPayableAmount = Math.max(0, subtotal - couponDiscount);

  // 3. Auto-revalidate applied coupon when cart items or subtotal change
  useEffect(() => {
    if (appliedCoupon && validateCoupon) {
      validateCoupon(appliedCoupon.code, subtotal, cartItems)
        .then((res) => {
          if (res.valid) {
            setCouponDiscount(res.discount);
          } else {
            setAppliedCoupon(null);
            setCouponDiscount(0);
            setCouponError(res.message);
          }
        })
        .catch(() => {
          setAppliedCoupon(null);
          setCouponDiscount(0);
        });
    }
  }, [cartItems, subtotal, appliedCoupon, validateCoupon]);

  // ALL HOOKS ARE ABOVE THIS LINE. Moving isOpen check here ensures strict compliance with Rules of Hooks!
  if (!isOpen) return null;

  const handleApplyCoupon = async (e) => {
    e?.preventDefault();
    if (!couponCodeInput.trim() || !validateCoupon) return;
    setApplyingCoupon(true);
    setCouponError('');
    setCouponMsg('');

    try {
      const res = await validateCoupon(couponCodeInput, subtotal, cartItems);
      if (res.valid) {
        setAppliedCoupon(res.coupon);
        setCouponDiscount(res.discount);
        setCouponMsg(res.message);
      } else {
        setAppliedCoupon(null);
        setCouponDiscount(0);
        setCouponError(res.message);
      }
    } catch (err) {
      setCouponError('Coupon invalid or expired');
    } finally {
      setApplyingCoupon(false);
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setCouponDiscount(0);
    setCouponCodeInput('');
    setCouponMsg('');
    setCouponError('');
  };

  const handleNameChange = (val) => {
    setCustomerName(val);
    localStorage.setItem('customerName', val);
  };
  const handlePhoneChange = (val) => {
    setCustomerPhone(val);
    localStorage.setItem('customerPhone', val);
  };
  const handleLocationChange = (val) => {
    setCustomerLocation(val);
    localStorage.setItem('customerLocation', val);
  };
  const handleEmailChange = (val) => {
    setCustomerEmail(val);
    localStorage.setItem('customerEmail', val);
  };

  // Location Auto-Detection via Browser Geolocation API + Nominatim Reverse Geocoding
  const handleDetectLocation = () => {
    setDetectingLocation(true);
    setLocationError('');

    if (!navigator.geolocation) {
      setLocationError('Geolocation is not supported by your browser.');
      setDetectingLocation(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        try {
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1`,
            {
              headers: {
                'Accept-Language': 'en',
                'User-Agent': 'OTTMoneySaver/1.0'
              }
            }
          );
          if (!response.ok) throw new Error('Geocoding request failed');
          const data = await response.json();
          
          if (data && data.address) {
            const addr = data.address;
            const area = addr.suburb || addr.neighbourhood || addr.residential || addr.road || addr.village || '';
            const city = addr.city || addr.town || addr.city_district || addr.county || '';
            const state = addr.state || '';
            
            const parts = [area, city, state].map(p => p.trim()).filter(Boolean);
            const readableAddress = parts.join(', ');
            
            if (readableAddress) {
              handleLocationChange(readableAddress);
            } else {
              handleLocationChange(`${latitude.toFixed(4)}, ${longitude.toFixed(4)}`);
            }
          } else {
            handleLocationChange(`${latitude.toFixed(4)}, ${longitude.toFixed(4)}`);
          }
        } catch (err) {
          console.error('Reverse geocoding error:', err);
          setLocationError('Unable to detect your location. Please enter manually.');
        } finally {
          setDetectingLocation(false);
        }
      },
      (error) => {
        console.error('Geolocation error:', error);
        setLocationError('Unable to detect location. Please enter manually.');
        setDetectingLocation(false);
      },
      { enableHighAccuracy: true, timeout: 8000 }
    );
  };

  // Razorpay Checkout Integration
  const handlePayWithRazorpay = async () => {
    setPaymentError('');

    if (cartItems.length === 0) {
      alert('Your cart is empty.');
      return;
    }
    if (!customerName.trim()) {
      alert('Please enter your full name.');
      return;
    }
    const phoneTrimmed = customerPhone.trim();
    if (!phoneTrimmed || !/^\d{10}$/.test(phoneTrimmed)) {
      alert('Please enter a valid 10-digit mobile number.');
      return;
    }
    if (!customerLocation.trim()) {
      alert('Please enter your delivery location.');
      return;
    }

    setOrderSubmitting(true);

    try {
      // 1. Ensure Razorpay Checkout SDK is loaded
      const isLoaded = await loadRazorpayScript();
      if (!isLoaded) {
        throw new Error('Razorpay SDK failed to load. Please check your internet connection.');
      }

      // 2. Call backend serverless API to create trusted Razorpay order
      const response = await fetch('/api/create-razorpay-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: cartItems,
          couponCode: appliedCoupon?.code || '',
          customerName: customerName.trim(),
          customerPhone: customerPhone.trim(),
          customerEmail: customerEmail.trim(),
          customerLocation: customerLocation.trim()
        })
      });

      const orderData = await response.json();
      if (!response.ok || !orderData.orderId) {
        throw new Error(orderData.error || 'Failed to create order on server');
      }

      // 3. Open Razorpay Modal
      const options = {
        key: orderData.keyId,
        amount: orderData.amount,
        currency: orderData.currency || 'INR',
        name: 'OTTMoneySaver',
        description: `Order ${orderData.appOrderId}`,
        image: '/image.png',
        order_id: orderData.orderId,
        prefill: {
          name: customerName.trim(),
          contact: customerPhone.trim(),
          email: customerEmail.trim() || ''
        },
        theme: {
          color: '#008744'
        },
        handler: async function (paymentResponse) {
          try {
            // 4. Verify payment signature on backend
            const verifyRes = await fetch('/api/verify-razorpay-payment', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                razorpay_order_id: paymentResponse.razorpay_order_id,
                razorpay_payment_id: paymentResponse.razorpay_payment_id,
                razorpay_signature: paymentResponse.razorpay_signature,
                appOrderId: orderData.appOrderId
              })
            });

            const verifyResult = await verifyRes.json();
            if (verifyResult.success) {
              setPaymentSuccess(true);
              setConfirmedOrderId(orderData.appOrderId);
              onClearCart();
            } else {
              setPaymentError('Payment verification failed. Please contact support.');
            }
          } catch (vErr) {
            console.error('Payment verification error:', vErr);
            setPaymentError('Payment verification error. Please reach out to customer care.');
          } finally {
            setOrderSubmitting(false);
          }
        },
        modal: {
          ondismiss: function () {
            setOrderSubmitting(false);
          }
        }
      };

      if (window.Razorpay) {
        const rzp = new window.Razorpay(options);
        rzp.on('payment.failed', function (failResp) {
          console.error('Razorpay payment failed:', failResp.error);
          setPaymentError(failResp.error?.description || 'Payment was unsuccessful. Please try again.');
          setOrderSubmitting(false);
        });
        rzp.open();
      } else {
        throw new Error('Razorpay SDK not available on window.');
      }

    } catch (err) {
      console.error('Razorpay flow error:', err);
      setPaymentError(err.message || 'Unable to initiate Razorpay payment. Please try again.');
      setOrderSubmitting(false);
    }
  };

  const cleanWhatsAppNumber = () => {
    let rawNum = cartSettings?.whatsapp_number || paymentConfig?.whatsappNumber || '916305151531';
    let clean = String(rawNum).replace(/\D/g, '');
    if (!clean.startsWith('91') && clean.length === 10) clean = '91' + clean;
    return clean || '916305151531';
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
          
          {/* Drawer Header */}
          <div className="p-4 sm:p-6 bg-slate-950 text-white flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-[#008744]" />
              <h2 className="text-lg font-bold">Shopping Cart ({cartItems.reduce((a, b) => a + (Number(b.quantity) || 1), 0)})</h2>
            </div>
            <button 
              onClick={onClose}
              className="p-1.5 rounded-full hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Drawer Body */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
            
            {/* Payment Success View */}
            {paymentSuccess ? (
              <div className="py-12 px-4 text-center space-y-4">
                <div className="w-16 h-16 bg-emerald-100 text-[#008744] rounded-full flex items-center justify-center mx-auto shadow-inner">
                  <CheckCircle2 className="w-10 h-10" />
                </div>
                <h3 className="text-xl font-extrabold text-slate-900">Payment Successful!</h3>
                <p className="text-xs text-slate-600">
                  Your order has been verified and confirmed.
                </p>
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl inline-block text-xs font-mono font-bold text-slate-800">
                  Order ID: {confirmedOrderId}
                </div>
                
                <div className="pt-4 space-y-2">
                  <a
                    href={`https://api.whatsapp.com/send?phone=${cleanWhatsAppNumber()}&text=${encodeURIComponent(`Hello OTTMoneySaver, my order ${confirmedOrderId} has been paid successfully. Please send activation details.`)}`}
                    target="_blank"
                    rel="noreferrer"
                    className="w-full py-3 px-4 rounded-xl bg-[#008744] hover:bg-[#007038] text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md transition-all"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>Get Instant Activation on WhatsApp</span>
                  </a>

                  <button
                    onClick={() => {
                      setPaymentSuccess(false);
                      onClose();
                    }}
                    className="w-full py-2.5 px-4 rounded-xl border border-slate-200 text-slate-700 font-bold text-xs hover:bg-slate-50 transition-all"
                  >
                    Continue Shopping
                  </button>
                </div>
              </div>
            ) : cartItems.length === 0 ? (
              /* Empty Cart State */
              <div className="h-full flex flex-col items-center justify-center text-center text-slate-500 py-16 space-y-3">
                <ShoppingBag className="w-16 h-16 text-slate-300 mx-auto" />
                <p className="font-extrabold text-base text-slate-700">Your cart is empty</p>
                <p className="text-xs text-slate-500 max-w-xs">Start shopping and add your favorite products to place an order!</p>
              </div>
            ) : (
              <>
                {/* 1. Cart Items List */}
                <div className="space-y-3">
                  <h3 className="text-xs font-black text-slate-400 uppercase tracking-wider">Cart Items</h3>
                  {cartItems.map((item) => (
                    <div key={item.id || item.productId} className="flex gap-3 p-3 bg-slate-50 rounded-2xl border border-slate-200/80 items-center shadow-sm">
                      <img 
                        src={item.image || '/image.png'} 
                        alt={item.title || item.name} 
                        className="w-14 h-14 rounded-xl object-contain bg-white p-1 border border-slate-100 shrink-0" 
                      />
                      <div className="flex-1 min-w-0">
                        <h4 className="text-xs font-bold text-slate-900 line-clamp-1">{item.title || item.name}</h4>
                        <p className="text-[11px] text-slate-500 line-clamp-1">{item.subtitle || item.variantName || ''}</p>
                        
                        <div className="flex items-baseline gap-1.5 mt-1">
                          <span className="text-xs font-black text-slate-900">₹{(Number(item.price) || 0).toLocaleString()}</span>
                          {item.originalPrice && (
                            <span className="text-[10px] text-slate-400 line-through">₹{Number(item.originalPrice).toLocaleString()}</span>
                          )}
                        </div>
                      </div>

                      {/* Quantity Controls */}
                      <div className="flex flex-col items-end gap-1.5 shrink-0">
                        <button 
                          onClick={() => onRemoveItem(item.id)}
                          className="text-slate-400 hover:text-red-600 p-1 transition-colors"
                          title="Remove item"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                        
                        <div className="flex items-center border border-slate-300 rounded-lg bg-white overflow-hidden text-xs">
                          <button 
                            onClick={() => onUpdateQuantity(item.id, Math.max(1, (Number(item.quantity) || 1) - 1))}
                            className="px-2 py-0.5 text-slate-600 hover:bg-slate-100 font-bold"
                          >
                            -
                          </button>
                          <span className="px-2 font-black text-slate-900">{item.quantity}</span>
                          <button 
                            onClick={() => onUpdateQuantity(item.id, (Number(item.quantity) || 1) + 1)}
                            className="px-2 py-0.5 text-slate-600 hover:bg-slate-100 font-bold"
                          >
                            +
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* 2. Customer Details Section */}
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-200/60 pb-1.5">
                    <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider">Customer Details</h3>
                    {!user ? (
                      <button
                        onClick={() => onOpenAuthModal && onOpenAuthModal('register')}
                        className="text-[11px] font-bold text-[#e50914] hover:underline flex items-center gap-1"
                      >
                        <Lock className="w-3.5 h-3.5" /> Login / Register
                      </button>
                    ) : (
                      <span className="text-[10px] font-extrabold text-[#008744] bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                        Logged In ✅
                      </span>
                    )}
                  </div>

                  <div className="space-y-3 text-xs">
                    {/* Full Name Input */}
                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">
                        Full Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        placeholder="Enter your full name"
                        value={customerName}
                        onChange={(e) => handleNameChange(e.target.value)}
                        className="w-full bg-white text-xs rounded-xl py-2.5 px-3 border border-slate-200 focus:outline-none focus:border-[#008744] transition-all"
                      />
                    </div>

                    {/* Phone Input */}
                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">
                        Mobile Number <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="tel"
                        maxLength={10}
                        placeholder="Enter 10-digit mobile number"
                        value={customerPhone}
                        onChange={(e) => handlePhoneChange(e.target.value.replace(/\D/g, ''))}
                        className="w-full bg-white text-xs rounded-xl py-2.5 px-3 border border-slate-200 focus:outline-none focus:border-[#008744] transition-all"
                      />
                    </div>

                    {/* Delivery Location Section */}
                    <div>
                      <div className="flex justify-between items-center mb-1.5">
                        <label className="block text-[11px] font-bold text-slate-700">
                          Delivery Location / Address <span className="text-red-500">*</span>
                        </label>
                        <button
                          type="button"
                          onClick={handleDetectLocation}
                          disabled={detectingLocation}
                          className="text-[10px] font-bold text-[#008744] hover:text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 px-2 py-0.5 rounded-lg transition-all flex items-center gap-1 active:scale-95"
                        >
                          📍 {detectingLocation ? 'Detecting...' : 'Enable Auto Location'}
                        </button>
                      </div>

                      <input
                        type="text"
                        required
                        placeholder="City, Area, Address, Pincode (e.g. Hyderabad, Kukatpally 500072)"
                        value={customerLocation}
                        onChange={(e) => handleLocationChange(e.target.value)}
                        className="w-full bg-white text-xs rounded-xl py-2.5 px-3 border border-slate-200 focus:outline-none focus:border-[#008744] transition-all font-medium text-slate-900 shadow-sm"
                      />

                      {locationError && (
                        <p className="text-[10px] text-amber-700 bg-amber-50 border border-amber-200 p-2 rounded-xl font-semibold mt-1.5">
                          ℹ️ {locationError}
                        </p>
                      )}
                    </div>

                    {/* Email Input */}
                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">
                        Email Address <span className="text-slate-400 font-normal">(Optional)</span>
                      </label>
                      <input
                        type="email"
                        placeholder="Enter email address"
                        value={customerEmail}
                        onChange={(e) => handleEmailChange(e.target.value)}
                        className="w-full bg-white text-xs rounded-xl py-2.5 px-3 border border-slate-200 focus:outline-none focus:border-[#008744] transition-all font-medium text-slate-900 shadow-sm"
                      />
                    </div>
                  </div>
                </div>

                {/* 3. Order Summary & Price Breakdown */}
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
                  <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider">Order Summary</h3>

                  {totalSavings > 0 && (
                    <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold p-2.5 rounded-xl flex items-center justify-between">
                      <span>🎉 Total Savings:</span>
                      <span className="text-xs font-black text-[#008744]">₹{totalSavings.toLocaleString()}</span>
                    </div>
                  )}

                  <div className="space-y-1.5 text-xs text-slate-600">
                    <div className="flex justify-between">
                      <span>Subtotal</span>
                      <span className="font-bold text-slate-900">₹{subtotal.toLocaleString()}</span>
                    </div>

                    {/* Coupon Input & Discount Row */}
                    <div className="pt-2 pb-1 border-t border-slate-200 space-y-2">
                      {!appliedCoupon ? (
                        <form onSubmit={handleApplyCoupon} className="flex gap-2">
                          <div className="relative flex-1">
                            <Tag className="w-3.5 h-3.5 absolute left-3 top-3 text-slate-400" />
                            <input
                              type="text"
                              placeholder="Have a Coupon Code?"
                              value={couponCodeInput}
                              onChange={(e) => setCouponCodeInput(e.target.value.toUpperCase())}
                              className="w-full bg-white text-xs rounded-xl py-2 pl-8 pr-3 border border-slate-200 font-mono uppercase focus:outline-none focus:border-[#008744]"
                            />
                          </div>
                          <button
                            type="submit"
                            disabled={applyingCoupon || !couponCodeInput.trim()}
                            className="px-4 py-2 rounded-xl bg-[#008744] hover:bg-[#007038] disabled:bg-slate-300 text-white font-bold text-xs shadow-sm transition-all shrink-0"
                          >
                            {applyingCoupon ? 'Checking...' : 'Apply'}
                          </button>
                        </form>
                      ) : (
                        <div className="p-2.5 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center justify-between">
                          <div className="flex items-center gap-1.5 text-xs font-bold text-[#008744]">
                            <Tag className="w-3.5 h-3.5" />
                            <span>Coupon "{appliedCoupon.code}" Applied!</span>
                          </div>
                          <button
                            type="button"
                            onClick={handleRemoveCoupon}
                            className="text-[10px] text-red-600 hover:underline font-bold"
                          >
                            Remove
                          </button>
                        </div>
                      )}

                      {couponError && (
                        <div className="p-2 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-bold">
                          ⚠️ {couponError}
                        </div>
                      )}
                      {couponMsg && !couponError && (
                        <p className="text-[11px] text-emerald-700 font-bold">✅ {couponMsg}</p>
                      )}
                    </div>

                    {couponDiscount > 0 && (
                      <div className="flex justify-between text-emerald-700 font-bold">
                        <span>Coupon Discount</span>
                        <span>-₹{couponDiscount.toLocaleString()}</span>
                      </div>
                    )}

                    <div className="flex justify-between text-base font-black text-slate-900 pt-2 border-t border-slate-200">
                      <span>Final Amount</span>
                      <span className="text-[#008744] text-lg font-black">₹{finalPayableAmount.toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                {/* Error Banner */}
                {paymentError && (
                  <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-xl text-xs font-bold flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{paymentError}</span>
                  </div>
                )}
              </>
            )}

          </div>

          {/* Drawer Footer Actions */}
          {!paymentSuccess && cartItems.length > 0 && (
            <div className="p-4 sm:p-6 bg-slate-50 border-t border-slate-200 space-y-3 shrink-0">
              
              <div className="flex items-center justify-center gap-2 text-[11px] text-slate-500 font-semibold">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>100% Secure Payment (Cards, UPI, NetBanking)</span>
              </div>

              {/* Pay Button */}
              <button
                onClick={handlePayWithRazorpay}
                disabled={orderSubmitting}
                className="w-full py-4 px-6 rounded-2xl bg-[#008744] hover:bg-[#007038] disabled:bg-emerald-800 disabled:opacity-80 text-white font-black text-base shadow-xl shadow-emerald-700/30 active:scale-95 transition-all flex items-center justify-center gap-2 group cursor-pointer"
              >
                <CreditCard className="w-5 h-5 stroke-[2.5]" />
                <span>
                  {orderSubmitting 
                    ? 'Processing...' 
                    : `Pay ₹${finalPayableAmount.toLocaleString()}`}
                </span>
                {!orderSubmitting && <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />}
              </button>

              <button
                onClick={onClearCart}
                className="w-full py-1 text-xs text-slate-500 hover:text-red-600 transition-colors text-center font-medium cursor-pointer"
              >
                Clear Cart
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}

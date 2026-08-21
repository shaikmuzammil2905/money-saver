import React, { useState, useEffect } from 'react';
import { 
  X, 
  ShoppingBag, 
  Plus, 
  Minus, 
  Trash2, 
  CheckCircle2, 
  ArrowRight, 
  Upload, 
  Image as ImageIcon, 
  ExternalLink, 
  ShieldCheck, 
  Lock, 
  AlertCircle,
  MessageCircle,
  QrCode
} from 'lucide-react';
import { getPaymentConfig } from '../services/paymentConfig';
import { DEFAULT_PAYMENT_CONFIG } from '../config/payment';
import { createOrder, uploadPaymentScreenshot } from '../services/orderService';
import { useCMS } from '../context/CMSContext';

export default function CartDrawer({
  isOpen,
  onClose,
  cartItems,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  user,
  onOpenAuthModal
}) {
  const { cartSettings, whatsAppTemplate } = useCMS();
  const [paymentConfig, setPaymentConfig] = useState(cartSettings || DEFAULT_PAYMENT_CONFIG);

  // Independent fields state
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

  const [isEditingLocation, setIsEditingLocation] = useState(false);
  const [detectingLocation, setDetectingLocation] = useState(false);
  const [locationError, setLocationError] = useState('');

  const [screenshotFile, setScreenshotFile] = useState(null);
  const [screenshotPreview, setScreenshotPreview] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const [submitValidationMsg, setSubmitValidationMsg] = useState('');
  
  const [orderSubmitting, setOrderSubmitting] = useState(false);
  const [submitButtonText, setSubmitButtonText] = useState('');
  const [createdOrder, setCreatedOrder] = useState(null);

  useEffect(() => {
    if (cartSettings) {
      setPaymentConfig(cartSettings);
    }
  }, [cartSettings]);

  // Autofill fields when user logs in/registers, but only if they are currently empty
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

  if (!isOpen) return null;

  const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const totalOriginal = cartItems.reduce((acc, item) => acc + (item.originalPrice || item.price) * item.quantity, 0);
  const totalSavings = totalOriginal - subtotal;

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
      setLocationError('Geolocation is not supported by your browser. Please enter location manually.');
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
          setLocationError('Unable to detect your location. Please enter your location manually.');
        } finally {
          setDetectingLocation(false);
        }
      },
      (error) => {
        console.error('Geolocation error:', error);
        setLocationError('Unable to detect your location. Please enter your location manually.');
        setDetectingLocation(false);
      },
      { enableHighAccuracy: true, timeout: 8000 }
    );
  };

  // Handle Screenshot File Selection
  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    setUploadError('');
    setSubmitValidationMsg('');

    if (!file) return;

    // Validate file type
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!validTypes.includes(file.type.toLowerCase())) {
      setUploadError('Invalid file type. Please upload JPG, PNG, or WEBP image.');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setUploadError('File size is too large. Maximum size is 5MB.');
      return;
    }

    setScreenshotFile(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      setScreenshotPreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveScreenshot = () => {
    setScreenshotFile(null);
    setScreenshotPreview(null);
    setUploadError('');
    setSubmitValidationMsg('');
  };

  // Payment Status Logic
  const currentPaymentStatus = (screenshotPreview || screenshotFile)
    ? 'Payment Success'
    : 'Payment Pending';

  // Handle Open Payment Link (GPay / PhonePe Direct UPI Launch with pre-filled amount)
  const handleOpenPaymentApp = (type) => {
    const upiId = paymentConfig?.upiId || DEFAULT_PAYMENT_CONFIG.upiId;
    const amount = subtotal || 0;
    const payeeName = 'OTTMoneySaver';
    
    // Standard UPI Link prefilling exact payee & cart subtotal amount
    const standardUpiUrl = `upi://pay?pa=${encodeURIComponent(upiId)}&pn=${encodeURIComponent(payeeName)}&am=${amount}&cu=INR&tn=OTTMoneySaver%20Order`;
    
    let targetUrl = standardUpiUrl;
    if (type === 'gpay') {
      targetUrl = `tez://upi/pay?pa=${encodeURIComponent(upiId)}&pn=${encodeURIComponent(payeeName)}&am=${amount}&cu=INR`;
    } else if (type === 'phonepe') {
      targetUrl = `phonepe://pay?pa=${encodeURIComponent(upiId)}&pn=${encodeURIComponent(payeeName)}&am=${amount}&cu=INR`;
    }

    try {
      window.location.href = targetUrl;
      setTimeout(() => {
        window.location.href = standardUpiUrl;
      }, 500);
    } catch (err) {
      window.open(standardUpiUrl, '_blank');
    }
  };

  // Submit Order & Open WhatsApp (Progressive Enhancement Flow)
  const handleCheckoutAndSubmit = async () => {
    setSubmitValidationMsg('');

    // 1. Validation Checks
    if (cartItems.length === 0) {
      alert('Your cart is empty.');
      return;
    }
    if (!customerName.trim()) {
      alert('Please enter your name.');
      return;
    }
    const phoneTrimmed = customerPhone.trim();
    if (!phoneTrimmed || !/^\d{10}$/.test(phoneTrimmed)) {
      alert('Please enter a valid 10-digit mobile number.');
      return;
    }
    if (!customerLocation.trim()) {
      alert('Please enter your location.');
      return;
    }
    if (!screenshotFile) {
      setSubmitValidationMsg('Please upload your payment screenshot to continue.');
      return;
    }

    setOrderSubmitting(true);
    setSubmitButtonText('Preparing Order...');

    try {
      // 2. Generate unique Order ID
      const orderDate = new Date().toISOString().slice(0, 10).replace(/-/g, '');
      const orderId = `OMS-${orderDate}-${Math.floor(1000 + Math.random() * 9000)}`;

      // 3. Generate Automated WhatsApp Order Message Content
      let productsText = '';
      cartItems.forEach((item, index) => {
        productsText += `${index + 1}. *${item.title}*\n   Qty: ${item.quantity}\n   Price: ₹${item.price.toLocaleString()}\n\n`;
      });

      // 4. Upload to Supabase Storage and get Public URL
      let uploadedScreenshotUrl = null;
      setIsUploading(true);
      try {
        uploadedScreenshotUrl = await uploadPaymentScreenshot(screenshotFile);
      } catch (uploadErr) {
        console.warn('Supabase storage upload failed:', uploadErr);
      } finally {
        setIsUploading(false);
      }

      const screenshotText = (uploadedScreenshotUrl && !uploadedScreenshotUrl.startsWith('data:'))
        ? uploadedScreenshotUrl
        : 'Attached separately (please attach manually in chat)';

      let msg = '';
      if (whatsAppTemplate) {
        msg = whatsAppTemplate
          .replace(/{PRODUCTS}/g, productsText.trim())
          .replace(/{CUSTOMER_NAME}/g, customerName.trim())
          .replace(/{CUSTOMER_PHONE}/g, customerPhone.trim())
          .replace(/{CUSTOMER_LOCATION}/g, customerLocation.trim())
          .replace(/{CUSTOMER_EMAIL}/g, customerEmail.trim() || 'N/A')
          .replace(/{TOTAL}/g, subtotal.toLocaleString())
          .replace(/{ORDER_ID}/g, orderId)
          .replace(/{PAYMENT_SCREENSHOT}/g, screenshotText);
      } else {
        msg = `🛒 *OTTMoneySaver Order*\nOrder ID: *${orderId}*\n\nName: ${customerName.trim()}\nMobile: ${customerPhone.trim()}\nLocation: ${customerLocation.trim()}\n\n*Products:*\n${productsText}\n*Total:* ₹${subtotal.toLocaleString()}\n\nPayment Screenshot:\n${screenshotText}`;
      }

      // Create local Order Record
      const orderPayload = {
        orderId,
        customerName: customerName.trim(),
        mobileNumber: customerPhone.trim(),
        location: customerLocation.trim(),
        items: cartItems,
        subtotal,
        totalOriginal,
        totalSavings,
        totalAmount: subtotal,
        paymentStatus: currentPaymentStatus,
        paymentScreenshotUrl: uploadedScreenshotUrl
      };
      const savedOrder = await createOrder(orderPayload);
      setCreatedOrder(savedOrder);

      // Launch WhatsApp Directly to 916305151531
      let rawNum = cartSettings?.whatsapp_number || paymentConfig?.whatsappNumber || '916305151531';
      let cleanNum = String(rawNum).replace(/\D/g, '');
      if (!cleanNum.startsWith('91') && cleanNum.length === 10) {
        cleanNum = '91' + cleanNum;
      }
      if (!cleanNum) cleanNum = '916305151531';

      const encodedMsg = encodeURIComponent(msg);
      const whatsappUrl = `https://api.whatsapp.com/send?phone=${cleanNum}&text=${encodedMsg}`;

      setOrderSubmitting(false);
      setSubmitButtonText('');

      // Direct location redirect opens WhatsApp app directly on mobile and WhatsApp Web on desktop
      window.location.href = whatsappUrl;

    } catch (err) {
      console.error('Order submission error:', err);
      setOrderSubmitting(false);
      setSubmitButtonText('');
      alert('Order created, but encountered an issue launching WhatsApp. Please contact support at 6305151531.');
    }
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
              <h2 className="text-lg font-bold">Shopping Cart ({cartItems.reduce((a, b) => a + b.quantity, 0)})</h2>
            </div>
            <button 
              onClick={onClose}
              className="p-1.5 rounded-full hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Drawer Body (Items + Checkout Steps) */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
            
            {/* Empty Cart State */}
            {cartItems.length === 0 ? (
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
                    <div key={item.id} className="flex gap-3 p-3 bg-slate-50 rounded-2xl border border-slate-200/80 items-center shadow-sm">
                      <img 
                        src={item.image} 
                        alt={item.title} 
                        className="w-14 h-14 rounded-xl object-contain bg-white p-1 border border-slate-100 shrink-0" 
                      />
                      <div className="flex-1 min-w-0">
                        <h4 className="text-xs font-bold text-slate-900 line-clamp-1">{item.title}</h4>
                        <p className="text-[11px] text-slate-500 line-clamp-1">{item.subtitle}</p>
                        
                        <div className="flex items-baseline gap-1.5 mt-1">
                          <span className="text-xs font-black text-slate-900">₹{item.price.toLocaleString()}</span>
                          {item.originalPrice && (
                            <span className="text-[10px] text-slate-400 line-through">₹{item.originalPrice.toLocaleString()}</span>
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
                            onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                            className="px-2 py-0.5 text-slate-600 hover:bg-slate-100 font-bold"
                          >
                            -
                          </button>
                          <span className="px-2 font-black text-slate-900">{item.quantity}</span>
                          <button 
                            onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
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
                        onClick={() => onOpenAuthModal('register')}
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

                    {/* Location Section */}
                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <label className="block text-[11px] font-bold text-slate-700">
                          Location <span className="text-red-500">*</span>
                        </label>
                        <button
                          type="button"
                          onClick={() => setIsEditingLocation(!isEditingLocation)}
                          className="text-[11px] font-bold text-[#e50914] hover:underline active:scale-95 transition-all"
                        >
                          {isEditingLocation ? 'Done' : 'Edit'}
                        </button>
                      </div>

                      {!isEditingLocation ? (
                        <div className="bg-white rounded-xl p-2.5 border border-slate-200 flex items-center justify-between">
                          <span className={`text-xs font-semibold ${customerLocation ? 'text-slate-900' : 'text-slate-400'}`}>
                            {customerLocation || '[ Enter Area, City, State ]'}
                          </span>
                          <button
                            type="button"
                            onClick={() => setIsEditingLocation(true)}
                            className="text-[10px] font-bold text-[#008744] bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200 shrink-0 ml-2"
                          >
                            Edit Location
                          </button>
                        </div>
                      ) : (
                        <div className="space-y-2 mt-1">
                          <input
                            type="text"
                            placeholder="Area, City, State"
                            value={customerLocation}
                            onChange={(e) => handleLocationChange(e.target.value)}
                            className="w-full bg-white text-xs rounded-xl py-2.5 px-3 border border-slate-200 focus:outline-none focus:border-[#008744] transition-all"
                          />
                          <div className="flex justify-end">
                            <button
                              type="button"
                              onClick={handleDetectLocation}
                              disabled={detectingLocation}
                              className="text-[10px] text-slate-500 hover:text-[#008744] font-medium underline flex items-center gap-1"
                            >
                              📍 {detectingLocation ? 'Detecting...' : 'Auto-fill current location via GPS'}
                            </button>
                          </div>
                        </div>
                      )}

                      {locationError && (
                        <p className="text-[10px] text-red-600 font-bold mt-1">{locationError}</p>
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
                        className="w-full bg-white text-xs rounded-xl py-2.5 px-3 border border-slate-200 focus:outline-none focus:border-[#008744] transition-all"
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
                    <div className="flex justify-between text-base font-black text-slate-900 pt-2 border-t border-slate-200">
                      <span>Final Amount</span>
                      <span className="text-[#008744] text-lg">₹{subtotal.toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                {/* 4. Payment Section (Configurable GPay & PhonePe Direct Launch) */}
                <div className="p-4 bg-slate-900 text-white rounded-2xl space-y-3 shadow-md">
                  <h3 className="text-xs font-black text-slate-200 uppercase tracking-wider flex items-center justify-between">
                    <span>Pay Using</span>
                    <span className="text-[10px] text-amber-400 font-mono">UPI ID: {paymentConfig?.upiId || DEFAULT_PAYMENT_CONFIG.upiId}</span>
                  </h3>

                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => handleOpenPaymentApp('gpay')}
                      className="py-2.5 px-3 rounded-xl bg-white text-slate-900 hover:bg-slate-100 font-extrabold text-xs shadow flex items-center justify-center gap-1.5 transition-all active:scale-95"
                    >
                      <span className="text-blue-600 font-black">G</span>
                      <span className="text-red-500 font-black">P</span>
                      <span className="text-amber-500 font-black">a</span>
                      <span className="text-emerald-600 font-black">y</span>
                      <ExternalLink className="w-3 h-3 text-slate-400" />
                    </button>

                    <button
                      onClick={() => handleOpenPaymentApp('phonepe')}
                      className="py-2.5 px-3 rounded-xl bg-[#5f259f] text-white hover:bg-[#4d1d82] font-extrabold text-xs shadow flex items-center justify-center gap-1.5 transition-all active:scale-95"
                    >
                      <span>PhonePe</span>
                      <ExternalLink className="w-3 h-3 text-white/70" />
                    </button>
                  </div>
                </div>

                {/* 5. Payment Screenshot Upload */}
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
                  <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider flex items-center justify-between">
                    <span>Upload Payment Screenshot <span className="text-red-500">*</span></span>
                    <span className="text-[10px] text-slate-500 font-normal">JPG, PNG, WEBP</span>
                  </h3>

                  {/* Submission Validation Message ONLY displayed if submit was clicked and file missing */}
                  {submitValidationMsg && (
                    <div className="p-2.5 bg-red-50 border border-red-200 rounded-xl text-red-600 text-xs font-bold flex items-center gap-1.5 animate-pulse">
                      <AlertCircle className="w-4 h-4 shrink-0" />
                      <span>{submitValidationMsg}</span>
                    </div>
                  )}

                  {uploadError && (
                    <div className="p-2.5 bg-red-50 border border-red-200 rounded-xl text-red-600 text-xs font-semibold">
                      {uploadError}
                    </div>
                  )}

                  {!screenshotPreview ? (
                    <label className="border-2 border-dashed border-slate-300 hover:border-[#008744] bg-white rounded-xl p-4 flex flex-col items-center justify-center text-center cursor-pointer transition-colors">
                      <Upload className="w-6 h-6 text-slate-400 mb-1" />
                      <span className="text-xs font-bold text-slate-700">Click to Upload Payment Proof</span>
                      <span className="text-[10px] text-slate-400 mt-0.5">Proof image for faster verification (Max 5MB)</span>
                      <input
                        type="file"
                        accept="image/jpeg,image/png,image/webp"
                        onChange={handleFileChange}
                        className="hidden"
                      />
                    </label>
                  ) : (
                    <div className="space-y-2">
                      <div className="relative w-full h-32 rounded-xl bg-slate-900 overflow-hidden flex items-center justify-center border border-slate-200">
                        <img
                          src={screenshotPreview}
                          alt="Payment Screenshot Preview"
                          className="max-h-full max-w-full object-contain"
                        />
                        <button
                          onClick={handleRemoveScreenshot}
                          className="absolute top-2 right-2 bg-red-600 text-white p-1 rounded-full shadow hover:bg-red-700"
                          title="Remove Screenshot"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="flex justify-between items-center text-xs">
                        <span className="text-[#008744] font-bold flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Screenshot Selected
                        </span>
                        <label className="text-xs font-bold text-[#e50914] cursor-pointer hover:underline">
                          Replace Image
                          <input
                            type="file"
                            accept="image/jpeg,image/png,image/webp"
                            onChange={handleFileChange}
                            className="hidden"
                          />
                        </label>
                      </div>
                    </div>
                  )}
                </div>

                {/* 6. Payment Status Display */}
                <div className="p-3.5 rounded-2xl border bg-slate-900 text-white flex items-center justify-between text-xs font-bold shadow-md">
                  <span className="text-slate-300">Payment Status:</span>
                  <span className={`px-3 py-1 rounded-full text-xs font-black shadow-sm transition-all ${
                    currentPaymentStatus === 'Payment Success'
                      ? 'bg-[#008744] text-white'
                      : 'bg-red-500 text-white'
                  }`}>
                    {currentPaymentStatus === 'Payment Success' ? 'Payment Success ✅' : 'Payment Pending'}
                  </span>
                </div>
              </>
            )}

          </div>

          {/* Drawer Footer Actions */}
          {cartItems.length > 0 && (
            <div className="p-4 sm:p-6 bg-slate-50 border-t border-slate-200 space-y-3 shrink-0">
              
              <p className="text-[11px] text-slate-500 text-center font-medium">
                After payment, verify details, upload payment screenshot, and click the button to send your order on WhatsApp.
              </p>

              {/* Submit Order Button */}
              <button
                onClick={handleCheckoutAndSubmit}
                disabled={orderSubmitting || isUploading}
                className="w-full py-4 px-6 rounded-2xl bg-[#008744] hover:bg-[#007038] disabled:bg-emerald-800 disabled:opacity-85 text-white font-black text-base shadow-xl shadow-emerald-700/30 active:scale-95 transition-all flex items-center justify-center gap-2 group"
              >
                <MessageCircle className="w-5 h-5 stroke-[2.5]" />
                <span>
                  {orderSubmitting 
                    ? (submitButtonText || 'Preparing Order...') 
                    : 'Submit Order'}
                </span>
                {!orderSubmitting && <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />}
              </button>

              <button
                onClick={onClearCart}
                className="w-full py-1 text-xs text-slate-500 hover:text-red-600 transition-colors text-center font-medium"
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

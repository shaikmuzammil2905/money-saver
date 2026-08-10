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
import { createOrder, uploadPaymentScreenshot } from '../services/orderService';

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
  const [paymentConfig, setPaymentConfig] = useState(null);
  const [screenshotFile, setScreenshotFile] = useState(null);
  const [screenshotPreview, setScreenshotPreview] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const [orderSubmitting, setOrderSubmitting] = useState(false);
  const [createdOrder, setCreatedOrder] = useState(null);

  useEffect(() => {
    getPaymentConfig().then((cfg) => setPaymentConfig(cfg));
  }, []);

  if (!isOpen) return null;

  const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const totalOriginal = cartItems.reduce((acc, item) => acc + (item.originalPrice || item.price) * item.quantity, 0);
  const totalSavings = totalOriginal - subtotal;

  // Handle Screenshot File Selection
  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    setUploadError('');

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
  };

  // Payment Status Logic
  const currentPaymentStatus = (screenshotPreview || screenshotFile)
    ? 'Payment Verification Pending'
    : 'Payment Pending';

  // Handle Open Payment Link (GPay / PhonePe)
  const handleOpenPaymentApp = (type) => {
    if (!paymentConfig) return;
    const url = type === 'gpay' ? paymentConfig.gpayLink : paymentConfig.phonepeLink;
    
    try {
      window.open(url, '_blank');
    } catch (err) {
      alert(`Could not open payment link directly. Please transfer to UPI ID: ${paymentConfig.upiId}`);
    }
  };

  // Submit Order & Open WhatsApp
  const handleCheckoutAndSubmit = async () => {
    // 1. Enforce Authentication Gate
    if (!user) {
      onOpenAuthModal('login');
      return;
    }

    setOrderSubmitting(true);

    try {
      // Upload screenshot if present
      let uploadedScreenshotUrl = null;
      if (screenshotFile) {
        setIsUploading(true);
        uploadedScreenshotUrl = await uploadPaymentScreenshot(screenshotFile);
        setIsUploading(false);
      }

      // Create Order Record via orderService
      const orderPayload = {
        customerName: user.fullName,
        mobileNumber: user.mobileNumber,
        location: user.location,
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

      // Generate Automated WhatsApp Order Message
      let msg = `*OTTMoneySaver Order*\n`;
      msg += `Order ID: *${savedOrder.orderId}*\n\n`;
      
      msg += `*Customer Details*\n`;
      msg += `Name: ${user.fullName}\n`;
      msg += `Mobile: ${user.mobileNumber}\n`;
      msg += `Location: ${user.location}\n\n`;

      msg += `*Order Summary*\n`;
      cartItems.forEach((item, index) => {
        msg += `${index + 1}. *${item.title}*\n   Qty: ${item.quantity} x ₹${item.price.toLocaleString()} = ₹${(item.price * item.quantity).toLocaleString()}\n`;
      });

      msg += `\nSubtotal: ₹${subtotal.toLocaleString()}\n`;
      if (totalSavings > 0) {
        msg += `Total Savings: ₹${totalSavings.toLocaleString()}\n`;
      }
      msg += `*Total Amount:* ₹${subtotal.toLocaleString()}\n\n`;

      msg += `*Payment Details*\n`;
      msg += `Payment Status: *${currentPaymentStatus}*\n`;
      if (uploadedScreenshotUrl) {
        msg += `Payment Proof: ${uploadedScreenshotUrl.substring(0, 80)}...\n`;
      }

      const whatsappNumber = paymentConfig?.whatsappNumber || '916305151531';
      const encodedMsg = encodeURIComponent(msg);
      const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodedMsg}`;

      setTimeout(() => {
        window.open(whatsappUrl, '_blank');
        setOrderSubmitting(false);
      }, 1000);

    } catch (err) {
      console.error('Order submission error:', err);
      setOrderSubmitting(false);
      alert('Order created, but encountered an issue opening WhatsApp. Please contact support.');
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
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider">Customer Details</h3>
                    {!user ? (
                      <button
                        onClick={() => onOpenAuthModal('register')}
                        className="text-xs font-bold text-[#e50914] hover:underline flex items-center gap-1"
                      >
                        <Lock className="w-3 h-3" /> Login / Register
                      </button>
                    ) : (
                      <span className="text-[10px] font-extrabold text-[#008744] bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                        Logged In ✅
                      </span>
                    )}
                  </div>

                  {user ? (
                    <div className="text-xs text-slate-600 space-y-1">
                      <p><span className="font-bold text-slate-800">Name:</span> {user.fullName}</p>
                      <p><span className="font-bold text-slate-800">Mobile:</span> {user.mobileNumber}</p>
                      <p><span className="font-bold text-slate-800">Location:</span> {user.location}</p>
                    </div>
                  ) : (
                    <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-amber-800 text-xs font-semibold">
                      Please login or register to complete your order details.
                    </div>
                  )}
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
                    <div className="flex justify-between text-[#008744]">
                      <span>Delivery Charge</span>
                      <span className="font-extrabold">FREE</span>
                    </div>
                    <div className="flex justify-between text-base font-black text-slate-900 pt-2 border-t border-slate-200">
                      <span>Final Amount</span>
                      <span className="text-[#008744] text-lg">₹{subtotal.toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                {/* 4. Payment Section (Configurable GPay & PhonePe) */}
                <div className="p-4 bg-slate-900 text-white rounded-2xl space-y-3 shadow-md">
                  <h3 className="text-xs font-black text-slate-200 uppercase tracking-wider flex items-center justify-between">
                    <span>Pay Using</span>
                    <span className="text-[10px] text-amber-400 font-mono">UPI ID: {paymentConfig?.upiId || '6305151531@ybl'}</span>
                  </h3>

                  <div className="grid grid-cols-2 gap-2">
                    {/* GPay Button */}
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

                    {/* PhonePe Button */}
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
                    <span>Upload Payment Screenshot</span>
                    <span className="text-[10px] text-slate-500 font-normal">JPG, PNG, WEBP</span>
                  </h3>

                  {uploadError && (
                    <div className="p-2.5 bg-red-50 border border-red-200 rounded-xl text-red-600 text-xs font-semibold">
                      {uploadError}
                    </div>
                  )}

                  {!screenshotPreview ? (
                    <label className="border-2 border-dashed border-slate-300 hover:border-[#008744] bg-white rounded-xl p-4 flex flex-col items-center justify-center text-center cursor-pointer transition-colors">
                      <Upload className="w-6 h-6 text-slate-400 mb-1" />
                      <span className="text-xs font-bold text-slate-700">Click to Upload Payment Proof</span>
                      <span className="text-[10px] text-slate-400 mt-0.5">Proof image for faster verification</span>
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
                        <span className="text-emerald-700 font-bold flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Screenshot Uploaded
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
                <div className="p-3 rounded-xl border bg-slate-900 text-white flex items-center justify-between text-xs font-bold shadow">
                  <span className="text-slate-300">Payment Status:</span>
                  <span className={`px-2.5 py-1 rounded-full text-[11px] font-black ${
                    currentPaymentStatus === 'Payment Verification Pending'
                      ? 'bg-amber-400 text-slate-950'
                      : 'bg-red-500 text-white'
                  }`}>
                    {currentPaymentStatus}
                  </span>
                </div>
              </>
            )}

          </div>

          {/* Drawer Footer Actions */}
          {cartItems.length > 0 && (
            <div className="p-4 sm:p-6 bg-slate-50 border-t border-slate-200 space-y-3 shrink-0">
              
              <p className="text-[11px] text-slate-500 text-center font-medium">
                After payment, upload your payment screenshot and send your order through WhatsApp.
              </p>

              {/* Open WhatsApp Order Button */}
              <button
                onClick={handleCheckoutAndSubmit}
                disabled={orderSubmitting || isUploading}
                className="w-full py-4 px-6 rounded-2xl bg-[#008744] hover:bg-[#007038] text-white font-black text-base shadow-xl shadow-emerald-700/30 active:scale-95 transition-all flex items-center justify-center gap-2 group"
              >
                <MessageCircle className="w-5 h-5 fill-current" />
                <span>
                  {orderSubmitting ? 'Processing Order...' : 'Open WhatsApp Order'}
                </span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
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

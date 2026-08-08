import React from 'react';
import { X, ShoppingBag, Plus, Minus, Trash2, MessageCircle, ArrowRight, ShieldCheck } from 'lucide-react';

export default function CartDrawer({ isOpen, onClose, cartItems, onUpdateQuantity, onRemoveItem, onClearCart }) {
  if (!isOpen) return null;

  const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const totalOriginal = cartItems.reduce((acc, item) => acc + (item.originalPrice || item.price) * item.quantity, 0);
  const totalSavings = totalOriginal - subtotal;

  const handleWhatsAppCheckout = () => {
    let text = `*New Order Inquiry from OTTMoneySaver*\n\n`;
    cartItems.forEach((item, index) => {
      text += `${index + 1}. *${item.title}* (${item.subtitle || ''})\n   Qty: ${item.quantity} x ₹${item.price} = ₹${item.price * item.quantity}\n`;
    });
    text += `\n*Total Amount:* ₹${subtotal.toLocaleString()}`;
    if (totalSavings > 0) {
      text += ` (You Saved ₹${totalSavings.toLocaleString()}!)`;
    }
    text += `\n\nDelivery Address: Hyderabad, Telangana\nCall / Contact: 6305151531`;

    const encodedText = encodeURIComponent(text);
    window.open(`https://wa.me/916305151531?text=${encodedText}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden font-sans">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm transition-opacity animate-fadeIn" 
        onClick={onClose}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col justify-between">
          
          {/* Header */}
          <div className="p-4 sm:p-6 bg-slate-950 text-white flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-brand-green" />
              <h2 className="text-lg font-bold">Your Shopping Cart ({cartItems.reduce((a, b) => a + b.quantity, 0)})</h2>
            </div>
            <button 
              onClick={onClose}
              className="p-1.5 rounded-full hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
            {cartItems.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center text-slate-500 py-12">
                <ShoppingBag className="w-16 h-16 text-slate-300 mb-3" />
                <p className="font-bold text-base text-slate-700">Your cart is empty</p>
                <p className="text-xs text-slate-500 mt-1">Explore our smart deals and add items!</p>
              </div>
            ) : (
              cartItems.map((item) => (
                <div key={item.id} className="flex gap-4 p-3 bg-slate-50 rounded-2xl border border-slate-200/80 items-center">
                  <img 
                    src={item.image} 
                    alt={item.title} 
                    className="w-16 h-16 rounded-xl object-contain bg-white p-1 border border-slate-100 shrink-0" 
                  />
                  <div className="flex-1">
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
                  <div className="flex flex-col items-end gap-2 shrink-0">
                    <button 
                      onClick={() => onRemoveItem(item.id)}
                      className="text-slate-400 hover:text-brand-red p-1 transition-colors"
                      title="Remove item"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                    
                    <div className="flex items-center border border-slate-300 rounded-lg bg-white overflow-hidden text-xs">
                      <button 
                        onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                        className="px-2 py-1 text-slate-600 hover:bg-slate-100"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="px-2 font-bold text-slate-900">{item.quantity}</span>
                      <button 
                        onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                        className="px-2 py-1 text-slate-600 hover:bg-slate-100"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer & Order Checkout */}
          {cartItems.length > 0 && (
            <div className="p-4 sm:p-6 bg-slate-50 border-t border-slate-200 space-y-4">
              {/* Savings banner */}
              {totalSavings > 0 && (
                <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold p-2.5 rounded-xl flex items-center justify-between">
                  <span>🎉 Total Savings:</span>
                  <span>₹{totalSavings.toLocaleString()}</span>
                </div>
              )}

              <div className="space-y-1.5 text-xs text-slate-600">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-bold text-slate-900">₹{subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-emerald-600">
                  <span>Delivery Charge</span>
                  <span className="font-bold">FREE</span>
                </div>
                <div className="flex justify-between text-base font-black text-slate-900 pt-2 border-t border-slate-200">
                  <span>Total Amount</span>
                  <span className="text-brand-green">₹{subtotal.toLocaleString()}</span>
                </div>
              </div>

              {/* WhatsApp Checkout Button */}
              <button
                onClick={handleWhatsAppCheckout}
                className="w-full py-3.5 px-4 rounded-xl bg-brand-green hover:bg-brand-greenHover text-white font-extrabold text-sm shadow-lg shadow-brand-green/30 transition-all flex items-center justify-center gap-2 group"
              >
                <MessageCircle className="w-5 h-5 fill-current" />
                <span>Order via WhatsApp (6305151531)</span>
              </button>

              <button
                onClick={onClearCart}
                className="w-full py-1 text-xs text-slate-500 hover:text-brand-red transition-colors text-center"
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

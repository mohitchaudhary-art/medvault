import React, { useState } from 'react';
import { usePharmacyStore } from '../../store/usePharmacyStore';
import { X, ShoppingBag, Plus, Minus, Trash2, CheckCircle2, ArrowRight, Truck } from 'lucide-react';

export const CartDrawer: React.FC = () => {
  const { cart, isCartOpen, toggleCart, updateQuantity, removeFromCart, checkout } = usePharmacyStore();
  const [address, setAddress] = useState('B-402, Green Glen Layout, Bellandur, Bengaluru');
  const [orderPlaced, setOrderPlaced] = useState(false);

  if (!isCartOpen) return null;

  const totalAmount = cart.reduce((sum, item) => sum + item.medicine.price * item.quantity, 0);

  const handleCheckoutSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    checkout(address);
    setOrderPlaced(true);
    setTimeout(() => {
      setOrderPlaced(false);
      toggleCart();
    }, 3500);
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-slate-950/80 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-md bg-slate-900 border-l border-slate-800 h-full flex flex-col justify-between shadow-2xl text-slate-100 p-6">
        
        {/* Top Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-cyan-400" />
            <h3 className="text-lg font-bold">Your Medicine Basket</h3>
          </div>
          <button onClick={toggleCart} className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Cart Items List */}
        <div className="flex-1 overflow-y-auto py-4 space-y-3">
          {orderPlaced ? (
            <div className="text-center py-12 space-y-4">
              <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto animate-bounce" />
              <h4 className="text-lg font-bold text-white">Order Placed Successfully!</h4>
              <p className="text-xs text-slate-400">Dispatching via MedVault Express 2-Hour Courier.</p>
            </div>
          ) : cart.length === 0 ? (
            <div className="text-center py-12 space-y-2 text-slate-400">
              <ShoppingBag className="w-12 h-12 text-slate-700 mx-auto" />
              <p className="text-sm font-semibold">Your medicine cart is empty</p>
              <p className="text-xs">Browse formulations in the pharmacy catalog.</p>
            </div>
          ) : (
            cart.map((item) => (
              <div key={item.medicine.id} className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-xs flex items-center justify-between gap-3">
                <img src={item.medicine.imageUrl} alt={item.medicine.name} className="w-12 h-12 rounded-lg object-cover border" />
                <div className="flex-1">
                  <p className="font-bold text-white line-clamp-1">{item.medicine.name}</p>
                  <p className="text-[10px] text-cyan-400 font-semibold">₹{item.medicine.price} / unit</p>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex items-center border border-slate-800 rounded-lg bg-slate-900">
                    <button
                      onClick={() => updateQuantity(item.medicine.id, item.quantity - 1)}
                      className="p-1 text-slate-400 hover:text-white"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="px-2 font-bold text-white">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.medicine.id, item.quantity + 1)}
                      className="p-1 text-slate-400 hover:text-white"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>
                  <button
                    onClick={() => removeFromCart(item.medicine.id)}
                    className="p-1 text-rose-400 hover:bg-rose-500/10 rounded"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer Checkout */}
        {cart.length > 0 && !orderPlaced && (
          <form onSubmit={handleCheckoutSubmit} className="border-t border-slate-800 pt-4 space-y-4 text-xs">
            <div>
              <label className="block font-medium text-slate-300 mb-1">Delivery Address</label>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                required
              />
            </div>

            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-400 font-medium">Total Amount Payable</span>
              <span className="font-extrabold text-white text-lg">₹{totalAmount}</span>
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-xl gradient-bg font-semibold text-white text-sm shadow-lg shadow-cyan-500/25 hover:opacity-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Place Express Medicine Order (₹{totalAmount})</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        )}

      </div>
    </div>
  );
};

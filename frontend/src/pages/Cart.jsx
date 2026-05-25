import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';

export default function Cart() {
  const { cartItems, removeFromCart, updateQuantity, cartTotal } = useCart();

  const shipping = cartTotal > 100000 ? 0 : 500;
  const tax = cartTotal * 0.03;
  const total = cartTotal + shipping + tax;

  return (
    <>
      <Navbar />
      <main className="max-w-screen-2xl mx-auto px-4 sm:px-8 md:px-24 py-12 md:py-20">
        {/* Breadcrumb / Header */}
        <div className="mb-10 md:mb-16">
          <h1 className="font-display-lg text-display-lg text-on-surface mb-4">Your Shopping Bag</h1>
          <p className="font-body-md text-on-surface-variant max-w-lg">Review your selection of artisanal heritage textiles, curated for timeless elegance.</p>
        </div>

        {cartItems.length === 0 ? (
          <div className="text-center py-20 border border-dashed border-stone-200">
            <h2 className="font-headline-md text-stone-500 mb-6">Your bag is empty</h2>
            <Link to="/shop" className="bg-primary text-white px-12 py-4 font-label-caps text-label-caps uppercase tracking-widest hover:bg-stone-900 transition-all">
              Discover Collections
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-20">
            {/* Product List Area */}
            <div className="lg:col-span-8 space-y-8 md:space-y-12">
              {cartItems.map((item) => (
                <div key={item.cartId || item.id} className="flex flex-row gap-4 sm:gap-8 pb-8 sm:pb-12 border-b border-stone-200">
                  <div className="w-24 sm:w-48 aspect-[3/4] bg-stone-100 overflow-hidden flex-shrink-0">
                    <img 
                      className="w-full h-full object-cover" 
                      src={item.image_url || "https://lh3.googleusercontent.com/aida-public/AB6AXuBWSJkgOMNQcxB23wGvoZA24-fHWy1miwFy8S-DWusLUW7poLC5blz0X7ZZitQTf7eE6ZyquUmoHsLfyBZU5C0KkKcjS31IH5N1Zh0_Lq4qW6NnAfz_108PkhWrqppHRxKWnTjPysSra4FPowOKPh6PJ8kg3TdtKpV_D1GgdD07oBpxCk8Nq2lgd4Ga1No_hGdIENXcH6uCwEIfsS4oQC9VH43PDJozJSGQVA0f0Mk25jLFrcWYAo9zzg11gg5U5RT7c6Ggjc8AkRIy"} 
                      alt={item.name}
                    />
                  </div>
                  <div className="flex-grow flex flex-col justify-between py-1">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-headline-sm text-headline-sm text-on-surface mb-2">{item.name}</h3>
                        <p className="font-label-caps text-label-caps text-on-surface-variant uppercase mb-4">
                          {item.category} | {item.color || 'Artisanal Blend'} | Size: {item.size || 'M'}
                        </p>
                      </div>
                      <div className="font-headline-sm text-headline-sm text-on-surface">PKR {item.price.toLocaleString()}</div>
                    </div>
                    <div className="flex justify-between items-center mt-8">
                      <div className="flex items-center border border-stone-300 px-4 py-2 gap-6">
                        <button 
                          onClick={() => updateQuantity(item.cartId || item.id, item.quantity - 1)}
                          className="hover:text-primary transition-colors"
                        >
                          <span className="material-symbols-outlined text-sm">remove</span>
                        </button>
                        <span className="font-body-md">{item.quantity}</span>
                        <button 
                          onClick={() => updateQuantity(item.cartId || item.id, item.quantity + 1)}
                          className="hover:text-primary transition-colors"
                        >
                          <span className="material-symbols-outlined text-sm">add</span>
                        </button>
                      </div>
                      <button 
                        onClick={() => removeFromCart(item.cartId || item.id)}
                        className="text-stone-400 hover:text-error transition-colors flex items-center gap-2"
                      >
                        <span className="material-symbols-outlined text-xl">delete</span>
                        <span className="font-label-caps text-label-caps uppercase">Remove</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
              
              {/* Continue Shopping */}
              <Link className="inline-flex items-center gap-4 group mt-12" to="/shop">
                <span className="material-symbols-outlined group-hover:-translate-x-2 transition-transform">arrow_back</span>
                <span className="font-label-caps text-label-caps uppercase tracking-widest border-b border-transparent group-hover:border-primary transition-all">Continue Shopping</span>
              </Link>
            </div>

            {/* Summary Area */}
            <div className="lg:col-span-4">
              <div className="bg-white p-6 sm:p-10 border border-stone-100 shadow-sm sticky top-32">
                <h2 className="font-headline-sm text-headline-sm text-on-surface mb-10">Order Summary</h2>
                <div className="space-y-6 mb-10 border-b border-stone-100 pb-10">
                  <div className="flex justify-between font-body-md">
                    <span className="text-on-surface-variant">Subtotal</span>
                    <span className="text-on-surface">PKR {cartTotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between font-body-md">
                    <span className="text-on-surface-variant">Shipping</span>
                    <span className="text-on-surface">{shipping === 0 ? 'FREE' : `PKR ${shipping}`}</span>
                  </div>
                  <div className="flex justify-between font-body-md">
                    <span className="text-on-surface-variant">Tax Estimate (3%)</span>
                    <span className="text-on-surface">PKR {tax.toLocaleString()}</span>
                  </div>
                </div>
                <div className="flex justify-between items-center mb-10">
                  <span className="font-headline-sm text-headline-sm">Total</span>
                  <span className="font-headline-md text-headline-md text-primary">PKR {total.toLocaleString()}</span>
                </div>
                <Link to="/checkout" className="block text-center w-full bg-primary text-white py-5 font-label-caps text-label-caps uppercase tracking-[0.2em] hover:bg-[#4a4842] transition-colors mb-6">
                  Proceed to Checkout
                </Link>
                <div className="flex flex-col gap-4">
                  <div className="flex items-center gap-3 text-stone-400">
                    <span className="material-symbols-outlined text-lg">verified_user</span>
                    <span className="text-[10px] uppercase tracking-widest font-body-md">Secure SSL Encrypted Checkout</span>
                  </div>
                  <div className="flex items-center gap-3 text-stone-400">
                    <span className="material-symbols-outlined text-lg">local_shipping</span>
                    <span className="text-[10px] uppercase tracking-widest font-body-md">Complimentary shipping on orders above PKR 100,000</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
      <Footer />
    </>
  );
}


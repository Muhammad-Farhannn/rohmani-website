import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../supabaseClient';

export default function Checkout() {
  const navigate = useNavigate();
  const { cartItems, cartTotal, clearCart } = useCart();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    phoneNumber: '',
    address: '',
    city: '',
    postalCode: ''
  });

  useEffect(() => {
    if (user) {
      const fetchProfile = async () => {
        try {
          const { data, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', user.id)
            .single();
          
          if (data) {
            setFormData(prev => ({
              ...prev,
              fullName: data.full_name || '',
              phoneNumber: data.phone_number || '',
              address: data.address || ''
            }));
          }
        } catch (err) {
          console.error('Error fetching profile:', err);
        }
      };
      fetchProfile();
    }
  }, [user]);

  const shipping = cartTotal > 100000 ? 0 : 500;
  const tax = cartTotal * 0.03;
  const total = cartTotal + shipping + tax;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (cartItems.length === 0) {
      alert('Your cart is empty');
      return;
    }
    
    setLoading(true);
    try {
      const fullAddress = `${formData.address}, ${formData.city}, ${formData.postalCode}`;
      
      if (user) {
        const { error: profileError } = await supabase
          .from('profiles')
          .upsert({
            id: user.id,
            full_name: formData.fullName,
            phone_number: formData.phoneNumber,
            address: fullAddress
          });
        if (profileError) console.error('Profile update error:', profileError);
      }

      const orderData = {
        user_id: user?.id || null,
        items: cartItems.map(item => ({
          product_id: item.id,
          quantity: item.quantity,
          price: item.price
        })),
        total_amount: total,
        shipping_address: {
          ...formData,
          full_address: fullAddress
        }
      };

      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData)
      });

      const result = await response.json();
      if (!response.ok) throw new Error(result.error || 'Failed to place order');

      clearCart();
      alert('Order placed successfully!');
      navigate('/dashboard');
    } catch (err) {
      alert('Checkout failed: ' + err.message);
    } finally {
      setLoading(false);
    }
  };
  return (
    <>
      <Navbar />
      <main className="max-w-[1440px] mx-auto px-4 sm:px-8 md:px-16 py-section-gap mt-16">
        <div className="mb-unit-lg">
          <h1 className="font-display-lg text-display-lg text-on-surface mb-2">Checkout</h1>
          <p className="font-body-md text-on-surface-variant max-w-xl">Complete your order of curated premium textiles. Impeccable craft and heritage delivered to your doorstep.</p>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-unit-lg items-start">
          {/* Left Side: Accordion Flow */}
          <div className="lg:col-span-8 space-y-unit-md">
            {/* Step 1: Shipping Information */}
            <div className="checkout-step pb-unit-lg border-b-[0.5px] border-outline-variant">
              <div className="flex items-center gap-unit-md mb-unit-lg">
                <span className="font-label-caps text-label-caps w-8 h-8 rounded-full border border-primary flex items-center justify-center text-primary">01</span>
                <h2 className="font-headline-sm text-headline-sm">Shipping Information</h2>
              </div>
              <form id="checkout-form" onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-unit-md">
                <div className="space-y-unit-xs">
                  <label className="font-label-caps text-label-caps text-on-surface-variant uppercase">Full Name</label>
                  <input 
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    className="w-full bg-transparent border-b border-outline-variant py-2 focus:border-primary outline-none transition-colors font-body-md" 
                    placeholder="Ahmad Ali" 
                    type="text"
                    required
                  />
                </div>
                <div className="space-y-unit-xs">
                  <label className="font-label-caps text-label-caps text-on-surface-variant uppercase">Phone Number</label>
                  <input 
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleInputChange}
                    className="w-full bg-transparent border-b border-outline-variant py-2 focus:border-primary outline-none transition-colors font-body-md" 
                    placeholder="+92 300 1234567" 
                    type="tel"
                    required
                  />
                </div>
                <div className="md:col-span-2 space-y-unit-xs">
                  <label className="font-label-caps text-label-caps text-on-surface-variant uppercase">Street Address</label>
                  <input 
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    className="w-full bg-transparent border-b border-outline-variant py-2 focus:border-primary outline-none transition-colors font-body-md" 
                    placeholder="Plot 123, Street 5, Phase VI, DHA" 
                    type="text"
                    required
                  />
                </div>
                <div className="space-y-unit-xs">
                  <label className="font-label-caps text-label-caps text-on-surface-variant uppercase">City</label>
                  <input 
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    className="w-full bg-transparent border-b border-outline-variant py-2 focus:border-primary outline-none transition-colors font-body-md" 
                    placeholder="Karachi" 
                    type="text"
                    required
                  />
                </div>
                <div className="space-y-unit-xs">
                  <label className="font-label-caps text-label-caps text-on-surface-variant uppercase">Postal Code</label>
                  <input 
                    name="postalCode"
                    value={formData.postalCode}
                    onChange={handleInputChange}
                    className="w-full bg-transparent border-b border-outline-variant py-2 focus:border-primary outline-none transition-colors font-body-md" 
                    placeholder="75500" 
                    type="text"
                    required
                  />
                </div>
              </form>
            </div>
            {/* Step 2: Payment Method */}
            <div className="checkout-step py-unit-lg border-b-[0.5px] border-outline-variant">
              <div className="flex items-center gap-unit-md mb-unit-lg">
                <span className="font-label-caps text-label-caps w-8 h-8 rounded-full border border-primary flex items-center justify-center text-primary">02</span>
                <h2 className="font-headline-sm text-headline-sm">Payment Method</h2>
              </div>
              <div className="space-y-4">
                {/* Card Payment */}
                <div className="p-6 border border-primary bg-white rounded-lg">
                  <label className="flex items-center gap-4 cursor-pointer mb-6">
                    <input defaultChecked className="text-primary focus:ring-primary w-4 h-4 border-outline" name="payment" type="radio"/>
                    <span className="font-body-lg font-semibold">Credit / Debit Card</span>
                    <div className="ml-auto flex gap-2">
                      <span className="material-symbols-outlined text-on-surface-variant">credit_card</span>
                    </div>
                  </label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-unit-md">
                    <div className="md:col-span-2 space-y-unit-xs">
                      <label className="font-label-caps text-label-caps text-on-surface-variant uppercase">Card Number</label>
                      <input className="w-full bg-transparent border-b border-outline-variant py-2 focus:border-primary outline-none transition-colors font-body-md" placeholder="0000 0000 0000 0000" type="text"/>
                    </div>
                    <div className="space-y-unit-xs">
                      <label className="font-label-caps text-label-caps text-on-surface-variant uppercase">Expiry Date</label>
                      <input className="w-full bg-transparent border-b border-outline-variant py-2 focus:border-primary outline-none transition-colors font-body-md" placeholder="MM / YY" type="text"/>
                    </div>
                    <div className="space-y-unit-xs">
                      <label className="font-label-caps text-label-caps text-on-surface-variant uppercase">CVV</label>
                      <input className="w-full bg-transparent border-b border-outline-variant py-2 focus:border-primary outline-none transition-colors font-body-md" placeholder="123" type="text"/>
                    </div>
                  </div>
                </div>
                {/* Bank Transfer */}
                <div className="p-6 border border-outline-variant bg-surface-container-lowest hover:border-primary transition-colors rounded-lg">
                  <label className="flex items-center gap-4 cursor-pointer">
                    <input className="text-primary focus:ring-primary w-4 h-4 border-outline" name="payment" type="radio"/>
                    <span className="font-body-lg">Direct Bank Transfer</span>
                    <span className="material-symbols-outlined text-on-surface-variant ml-auto">account_balance</span>
                  </label>
                </div>
                {/* COD */}
                <div className="p-6 border border-outline-variant bg-surface-container-lowest hover:border-primary transition-colors rounded-lg">
                  <label className="flex items-center gap-4 cursor-pointer">
                    <input className="text-primary focus:ring-primary w-4 h-4 border-outline" name="payment" type="radio"/>
                    <span className="font-body-lg">Cash on Delivery</span>
                    <span className="material-symbols-outlined text-on-surface-variant ml-auto">payments</span>
                  </label>
                </div>
              </div>
            </div>
            {/* Step 3: Review */}
            <div className="checkout-step py-unit-lg border-b-[0.5px] border-outline-variant">
              <div className="flex items-center gap-unit-md mb-unit-md">
                <span className="font-label-caps text-label-caps w-8 h-8 rounded-full border border-outline-variant flex items-center justify-center text-outline">03</span>
                <h2 className="font-headline-sm text-headline-sm opacity-50">Review Order</h2>
              </div>
            </div>
          </div>
          {/* Right Side: Order Summary */}
          <div className="lg:col-span-4 lg:sticky lg:top-32 space-y-unit-md">
            <div className="bg-primary-container p-unit-lg rounded-lg border border-outline-variant/30">
              <h3 className="font-headline-sm text-headline-sm mb-unit-lg">Order Summary</h3>
              <div className="space-y-unit-md mb-unit-lg">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex gap-unit-md">
                    <div className="w-20 h-24 bg-surface-dim overflow-hidden flex-shrink-0">
                      <img className="w-full h-full object-cover" src={item.image_url || "https://placeholder.com/150"} alt={item.name} />
                    </div>
                    <div className="flex-1 space-y-1">
                      <p className="font-serif text-body-md font-bold text-on-surface">{item.name}</p>
                      <p className="font-body-md text-on-surface-variant text-sm">{item.quantity} x PKR {item.price.toLocaleString()}</p>
                      <p className="font-body-md font-semibold mt-1">PKR {(item.price * item.quantity).toLocaleString()}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="border-t border-outline-variant pt-unit-md space-y-3">
                <div className="flex justify-between font-body-md text-on-surface-variant">
                  <span>Subtotal</span>
                  <span>PKR {cartTotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between font-body-md text-on-surface-variant">
                  <span>Shipping</span>
                  <span>PKR {shipping.toLocaleString()}</span>
                </div>
                <div className="flex justify-between font-body-md text-on-surface-variant">
                  <span>Taxes</span>
                  <span>PKR {tax.toLocaleString()}</span>
                </div>
                <div className="flex justify-between font-body-lg font-bold text-on-surface pt-3 border-t border-outline-variant">
                  <span>Total</span>
                  <span>PKR {total.toLocaleString()}</span>
                </div>
              </div>
              <div className="mt-unit-lg">
                <button 
                  form="checkout-form"
                  type="submit"
                  disabled={loading || cartItems.length === 0}
                  className="w-full bg-primary text-white py-5 font-label-caps text-label-caps uppercase tracking-widest hover:bg-[#4d4b45] transition-all duration-300 shadow-md disabled:opacity-50"
                >
                  {loading ? 'Processing...' : 'Place Order'}
                </button>
              </div>
              <p className="text-center text-[10px] text-on-surface-variant mt-unit-md font-label-caps uppercase opacity-60">
                Secure SSL Encrypted Checkout
              </p>
            </div>
            <div className="p-unit-md border border-outline-variant/30 rounded-lg flex items-center gap-4 bg-surface-bright">
              <span className="material-symbols-outlined text-primary">verified</span>
              <p className="text-xs font-body-md text-on-surface-variant italic">"Impeccable craft and timely heritage. Every piece is guaranteed for lifetime luxury."</p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

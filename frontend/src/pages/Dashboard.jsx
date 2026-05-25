import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../supabaseClient';
import axios from 'axios';

export default function Dashboard() {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const [isEditing, setIsEditing] = useState(false);
  const [isEditingAddress, setIsEditingAddress] = useState(false);
  const [profile, setProfile] = useState({
    full_name: '',
    phone_number: '',
    preferred_collection: '',
    address: ''
  });
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    const fetchProfileAndOrders = async () => {
      setLoading(true);
      try {
        // Fetch Profile
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();

        if (profileError && profileError.code !== 'PGRST116') {
          console.error('Error fetching profile:', profileError);
        } else if (profileData) {
          setProfile({
            ...profile,
            ...profileData,
            address: profileData.address || ''
          });
        }

        // Fetch Orders from Backend API (instead of direct Supabase)
        // This ensures we get both DB and local fallback orders
        const response = await axios.get(`/api/orders?user_id=${user.id}`);
        setOrders(response.data || []);
      } catch (err) {
        console.error('Error in dashboard initialization:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfileAndOrders();
  }, [user, navigate]);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .upsert({
          id: user.id,
          ...profile,
          created_at: profile.created_at || new Date().toISOString()
        });

      if (error) throw error;
      setIsEditing(false);
      alert('Profile updated successfully');
    } catch (err) {
      alert('Error updating profile: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateAddress = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Create a clean object with only the fields we want to save
      const updateData = {
        id: user.id,
        full_name: profile.full_name || '',
        phone_number: profile.phone_number || '',
        preferred_collection: profile.preferred_collection || '',
        address: profile.address || ''
      };

      const { error } = await supabase
        .from('profiles')
        .upsert(updateData);

      if (error) {
        console.error('Supabase error:', error);
        throw error;
      }
      
      setIsEditingAddress(false);
      alert('Address updated successfully');
    } catch (err) {
      console.error('Update failed:', err);
      alert(`Update Failed: ${err.message || 'Unknown error'}. 
      
IMPORTANT: Please ensure you have added the 'address' column to your 'profiles' table in Supabase.`);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAddress = async () => {
    if (!window.confirm('Are you sure you want to remove this address?')) return;
    setLoading(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ address: '' })
        .eq('id', user.id);

      if (error) throw error;
      setProfile({ ...profile, address: '' });
      alert('Address removed successfully');
    } catch (err) {
      console.error('Delete failed:', err);
      alert(`Delete Failed: ${err.message || 'Unknown error'}. 
      
Please ensure your Supabase 'profiles' table has an 'address' column.`);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await signOut();
    navigate('/login');
  };

  if (loading && !profile.full_name) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <>
      <Navbar />
      <main className="max-w-[1440px] mx-auto px-4 sm:px-8 md:px-16 py-8 md:py-20 flex flex-col md:flex-row gap-8 md:gap-16">
        <aside className="w-full md:w-64 flex-shrink-0">
          <div className="md:sticky md:top-32 space-y-6 md:space-y-12">
            <div className="space-y-2">
              <h2 className="hidden md:block font-label-caps text-label-caps text-primary uppercase">Account Menu</h2>
              <nav className="flex flex-row md:flex-col overflow-x-auto no-scrollbar gap-6 md:gap-0 md:space-y-4 pb-4 md:pb-0 border-b md:border-none border-stone-200">
                <button 
                  onClick={() => setActiveTab('profile')}
                  className={`flex items-center space-x-2 md:space-x-3 pb-1 w-fit flex-shrink-0 group transition-all ${activeTab === 'profile' ? 'text-stone-900 border-b border-[#D4AF37]' : 'text-stone-500 hover:text-stone-900'}`}
                >
                  <span className="material-symbols-outlined text-[20px] md:text-[24px]">person</span>
                  <span className="font-serif text-xs md:text-sm tracking-widest uppercase">Profile</span>
                </button>
                <button 
                  onClick={() => setActiveTab('orders')}
                  className={`flex items-center space-x-2 md:space-x-3 pb-1 w-fit flex-shrink-0 group transition-all ${activeTab === 'orders' ? 'text-stone-900 border-b border-[#D4AF37]' : 'text-stone-500 hover:text-stone-900'}`}
                >
                  <span className="material-symbols-outlined text-[20px] md:text-[24px]">shopping_cart</span>
                  <span className="font-serif text-xs md:text-sm tracking-widest uppercase">Orders</span>
                </button>
                <button 
                  onClick={() => setActiveTab('addresses')}
                  className={`flex items-center space-x-2 md:space-x-3 pb-1 w-fit flex-shrink-0 group transition-all ${activeTab === 'addresses' ? 'text-stone-900 border-b border-[#D4AF37]' : 'text-stone-500 hover:text-stone-900'}`}
                >
                  <span className="material-symbols-outlined text-[20px] md:text-[24px]">location_on</span>
                  <span className="font-serif text-xs md:text-sm tracking-widest uppercase">Addresses</span>
                </button>
                <button 
                  onClick={handleLogout}
                  className="flex items-center space-x-2 md:space-x-3 text-error pb-1 hover:opacity-70 transition-opacity flex-shrink-0 md:pt-8 md:mt-8 md:border-t md:border-stone-200"
                >
                  <span className="material-symbols-outlined text-[20px] md:text-[24px]">logout</span>
                  <span className="font-serif text-xs md:text-sm tracking-widest uppercase">Logout</span>
                </button>
              </nav>
            </div>
          </div>
        </aside>

        <section className="flex-1 space-y-8 md:space-y-12">
          {activeTab === 'profile' && (
            <div className="space-y-12">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-stone-100 pb-8 w-full">
                <div>
                  <span className="font-label-caps text-label-caps text-primary uppercase">Member Profile</span>
                  <h1 className="font-display-lg text-2xl md:text-display-lg text-stone-900 mt-2">
                    {isEditing ? 'Update Your Details' : `Welcome Back, ${profile.full_name || user?.email.split('@')[0]}`}
                  </h1>
                </div>
                <button 
                  onClick={() => setIsEditing(!isEditing)}
                  className="px-8 py-3 bg-stone-900 text-white font-label-caps text-xs uppercase tracking-[0.2em] hover:bg-stone-800 transition-colors duration-300 w-full md:w-auto text-center"
                >
                  {isEditing ? 'Cancel' : 'Edit Profile'}
                </button>
              </div>

              {isEditing ? (
                <form onSubmit={handleUpdateProfile} className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10">
                  <div className="space-y-2">
                    <label className="font-label-caps text-[10px] text-stone-400 uppercase tracking-widest">Full Name</label>
                    <input 
                      type="text"
                      className="w-full text-body-lg font-headline-md border-b border-stone-100 pb-2 text-stone-800 focus:border-primary outline-none bg-transparent"
                      value={profile.full_name}
                      onChange={(e) => setProfile({...profile, full_name: e.target.value})}
                      placeholder="Enter full name"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="font-label-caps text-[10px] text-stone-400 uppercase tracking-widest">Email Address</label>
                    <div className="text-body-lg font-headline-md border-b border-stone-100 pb-2 text-stone-300 cursor-not-allowed">
                      {user?.email}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="font-label-caps text-[10px] text-stone-400 uppercase tracking-widest">Phone Number</label>
                    <input 
                      type="text"
                      className="w-full text-body-lg font-headline-md border-b border-stone-100 pb-2 text-stone-800 focus:border-primary outline-none bg-transparent"
                      value={profile.phone_number}
                      onChange={(e) => setProfile({...profile, phone_number: e.target.value})}
                      placeholder="+92 300 1234567"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="font-label-caps text-[10px] text-stone-400 uppercase tracking-widest">Preferred Collection</label>
                    <select 
                      className="w-full text-body-lg font-headline-md border-b border-stone-100 pb-2 text-stone-800 focus:border-primary outline-none bg-transparent appearance-none"
                      value={profile.preferred_collection}
                      onChange={(e) => setProfile({...profile, preferred_collection: e.target.value})}
                    >
                      <option value="">Select a collection</option>
                      <option value="Classic Unstitched Fabrics">Classic Unstitched Fabrics</option>
                      <option value="Pret Collection">Pret Collection</option>
                      <option value="Winter Edition">Winter Edition</option>
                      <option value="Artisan Series">Artisan Series</option>
                    </select>
                  </div>
                  <div className="md:col-span-2 pt-4">
                    <button 
                      type="submit"
                      disabled={loading}
                      className="bg-primary text-white px-12 py-4 font-label-caps text-label-caps uppercase tracking-widest hover:bg-stone-900 transition-all disabled:opacity-50"
                    >
                      {loading ? 'Saving Changes...' : 'Save Profile Changes'}
                    </button>
                  </div>
                </form>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10">
                  <div className="space-y-2 group">
                    <label className="font-label-caps text-[10px] text-stone-400 uppercase tracking-widest">Full Name</label>
                    <div className="text-body-lg font-headline-md border-b border-stone-100 pb-2 text-stone-800">{profile.full_name || 'Not set'}</div>
                  </div>
                  <div className="space-y-2 group">
                    <label className="font-label-caps text-[10px] text-stone-400 uppercase tracking-widest">Email Address</label>
                    <div className="text-body-lg font-headline-md border-b border-stone-100 pb-2 text-stone-800">{user?.email}</div>
                  </div>
                  <div className="space-y-2 group">
                    <label className="font-label-caps text-[10px] text-stone-400 uppercase tracking-widest">Phone Number</label>
                    <div className="text-body-lg font-headline-md border-b border-stone-100 pb-2 text-stone-800">{profile.phone_number || 'Not set'}</div>
                  </div>
                  <div className="space-y-2 group">
                    <label className="font-label-caps text-[10px] text-stone-400 uppercase tracking-widest">Preferred Collection</label>
                    <div className="text-body-lg font-headline-md border-b border-stone-100 pb-2 text-stone-800">{profile.preferred_collection || 'Not set'}</div>
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'orders' && (
            <div className="space-y-8 animate-fade-in">
              <div className="flex justify-between items-center border-b border-stone-100 pb-4">
                <h2 className="font-headline-md text-stone-900">Your Orders</h2>
              </div>
              {orders.length === 0 ? (
                <div className="text-center py-12 border border-dashed border-stone-200">
                  <p className="text-stone-500 font-body-md">You haven't placed any orders yet.</p>
                  <Link to="/shop" className="text-primary underline mt-2 inline-block font-label-caps text-xs">Start Shopping</Link>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="border-b border-stone-200">
                        <th className="pb-6 font-label-caps text-[10px] text-stone-400 uppercase tracking-widest">Order ID</th>
                        <th className="pb-6 font-label-caps text-[10px] text-stone-400 uppercase tracking-widest">Date</th>
                        <th className="pb-6 font-label-caps text-[10px] text-stone-400 uppercase tracking-widest">Items</th>
                        <th className="pb-6 font-label-caps text-[10px] text-stone-400 uppercase tracking-widest">Status</th>
                        <th className="pb-6 font-label-caps text-[10px] text-stone-400 uppercase tracking-widest">Total</th>
                        <th className="pb-6 font-label-caps text-[10px] text-stone-400 uppercase tracking-widest text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="text-stone-700">
                      {orders.map((order) => (
                        <tr key={order.id} className="border-b border-stone-50 group hover:bg-stone-50/50 transition-colors">
                          <td className="py-4 md:py-8 font-serif">#RAT-{order.id}</td>
                          <td className="py-4 md:py-8 font-body-md">{new Date(order.created_at).toLocaleDateString()}</td>
                          <td className="py-4 md:py-8">
                            {order.order_items && order.order_items.length > 0 ? (
                              <div className="flex flex-col gap-2">
                                {order.order_items.map(item => (
                                  <div key={item.id} className="flex items-center gap-2">
                                    {item.products?.image_url && (
                                      <img src={item.products.image_url} alt={item.products.name} className="w-8 h-10 object-cover" />
                                    )}
                                    <span className="text-xs">{item.products?.name || 'Unknown'} (x{item.quantity})</span>
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <span className="text-xs text-stone-400">No items details</span>
                            )}
                          </td>
                          <td className="py-4 md:py-8">
                            <span className={`px-3 py-1 text-[10px] font-label-caps uppercase rounded-full ${
                              order.status === 'delivered' ? 'bg-green-50 text-green-700' : 'bg-stone-100 text-stone-600'
                            }`}>
                              {order.status}
                            </span>
                          </td>
                          <td className="py-4 md:py-8 font-serif">PKR {order.total_amount.toLocaleString()}</td>
                          <td className="py-4 md:py-8 text-right">
                            <button className="text-primary hover:underline underline-offset-4 font-label-caps text-[10px] uppercase">Details</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {activeTab === 'addresses' && (
            <div className="space-y-8 animate-fade-in">
              <div className="flex justify-between items-center border-b border-stone-100 pb-4">
                <h2 className="font-headline-md text-stone-900">Saved Addresses</h2>
                {!profile.address && !isEditingAddress && (
                  <button 
                    onClick={() => setIsEditingAddress(true)}
                    className="text-xs font-label-caps text-primary uppercase border-b border-primary pb-1"
                  >
                    Add New Address
                  </button>
                )}
              </div>

              {isEditingAddress ? (
                <form onSubmit={handleUpdateAddress} className="max-w-xl space-y-6">
                  <div className="space-y-2">
                    <label className="font-label-caps text-[10px] text-stone-400 uppercase tracking-widest">Full Shipping Address</label>
                    <textarea 
                      className="w-full text-body-lg font-headline-md border border-stone-100 p-4 text-stone-800 focus:border-primary outline-none bg-transparent min-h-[100px] md:min-h-[150px]"
                      value={profile.address}
                      onChange={(e) => setProfile({...profile, address: e.target.value})}
                      placeholder="Street address, City, Province, Postal Code"
                      required
                    />
                  </div>
                  <div className="flex gap-4">
                    <button 
                      type="submit"
                      className="bg-primary text-white px-8 py-3 font-label-caps text-xs uppercase tracking-widest hover:bg-stone-900 transition-all"
                    >
                      Save Address
                    </button>
                    <button 
                      type="button"
                      onClick={() => setIsEditingAddress(false)}
                      className="border border-stone-200 px-8 py-3 font-label-caps text-xs uppercase tracking-widest hover:bg-stone-50 transition-all"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              ) : profile.address ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="border border-stone-100 p-8 space-y-4 relative group">
                    <div className="flex justify-between items-start">
                      <span className="bg-primary-container px-3 py-1 text-[8px] font-label-caps uppercase tracking-widest">Default Shipping</span>
                    </div>
                    <div className="space-y-1">
                      <p className="font-headline-sm text-stone-800">{profile.full_name || 'Valued Member'}</p>
                      <p className="text-stone-500 font-body-md leading-relaxed whitespace-pre-line">
                        {profile.address}
                      </p>
                    </div>
                    <div className="flex gap-4 pt-4">
                      <button 
                        onClick={() => setIsEditingAddress(true)}
                        className="text-[10px] font-label-caps text-stone-400 hover:text-stone-900 uppercase"
                      >
                        Edit
                      </button>
                      <button 
                        onClick={handleDeleteAddress}
                        className="text-[10px] font-label-caps text-stone-400 hover:text-error uppercase"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12 border border-dashed border-stone-200">
                  <p className="text-stone-500 font-body-md mb-4">No shipping addresses saved.</p>
                  <button 
                    onClick={() => setIsEditingAddress(true)}
                    className="text-primary underline font-label-caps text-xs uppercase"
                  >
                    Add your first address
                  </button>
                </div>
              )}
            </div>
          )}
        </section>
      </main>
      <Footer />
    </>
  );
}


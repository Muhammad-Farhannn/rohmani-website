import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { supabase } from '../../supabaseClient';

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const response = await axios.get('/api/admin/stats', {
        headers: { Authorization: `Bearer ${session.access_token}` }
      });
      setStats(response.data);
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="min-h-[240px] flex items-center justify-center">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
  </div>;

  const cards = [
    { title: 'Total Products', value: stats?.totalProducts, icon: 'inventory_2', color: 'bg-blue-500' },
    { title: 'Total Orders', value: stats?.totalOrders, icon: 'shopping_cart', color: 'bg-green-500' },
    { title: 'Revenue', value: `PKR ${stats?.totalRevenue.toLocaleString()}`, icon: 'payments', color: 'bg-purple-500' },
    { title: 'Avg Order Value', value: `PKR ${(stats?.totalRevenue / stats?.totalOrders || 0).toLocaleString(undefined, {maximumFractionDigits: 0})}`, icon: 'trending_up', color: 'bg-orange-500' },
  ];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((card) => (
          <div key={card.title} className="bg-white p-6 rounded-2xl border border-outline-variant shadow-sm hover:shadow-md transition-all group">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-label-caps text-on-surface-variant uppercase tracking-wider mb-2">{card.title}</p>
                <h3 className="text-3xl font-display-md text-primary">{card.value}</h3>
              </div>
              <div className={`${card.color} p-3 rounded-xl text-white group-hover:scale-110 transition-transform`}>
                <span className="material-symbols-outlined">{card.icon}</span>
              </div>
            </div>
            <div className="mt-4 flex items-center text-xs text-green-600 font-medium">
              <span className="material-symbols-outlined text-sm mr-1">trending_up</span>
              <span>12% increase from last month</span>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Orders Table */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-outline-variant shadow-sm overflow-hidden">
          <div className="p-6 border-b border-outline-variant flex justify-between items-center">
            <h3 className="text-lg font-display-md text-primary">Recent Orders</h3>
            <button 
              onClick={() => navigate('/admin/orders')}
              className="text-sm font-label-caps text-primary hover:underline"
            >
              View All
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-surface-container-low border-b border-outline-variant">
                  <th className="px-6 py-4 text-xs font-label-caps text-on-surface-variant uppercase tracking-wider">Order ID</th>
                  <th className="px-6 py-4 text-xs font-label-caps text-on-surface-variant uppercase tracking-wider">Date</th>
                  <th className="px-6 py-4 text-xs font-label-caps text-on-surface-variant uppercase tracking-wider">Total</th>
                  <th className="px-6 py-4 text-xs font-label-caps text-on-surface-variant uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant">
                {stats?.recentOrders.length > 0 ? stats.recentOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-surface-container-lowest transition-colors">
                    <td className="px-6 py-4 text-sm font-medium text-primary">#RAT-{order.id}</td>
                    <td className="px-6 py-4 text-sm text-on-surface-variant">{new Date(order.created_at).toLocaleDateString()}</td>
                    <td className="px-6 py-4 text-sm font-semibold text-primary">PKR {order.total_amount?.toLocaleString()}</td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-label-caps uppercase tracking-wider ${
                        order.status === 'completed' ? 'bg-green-100 text-green-700' : 
                        order.status === 'pending' ? 'bg-yellow-100 text-yellow-700' : 
                        'bg-blue-100 text-blue-700'
                      }`}>
                        {order.status}
                      </span>
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan="4" className="px-6 py-10 text-center text-on-surface-variant text-sm">No recent orders found</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-2xl border border-outline-variant shadow-sm p-6">
          <h3 className="text-lg font-display-md text-primary mb-6">Quick Actions</h3>
          <div className="space-y-4">
            <button 
              onClick={() => navigate('/admin/products/new')}
              className="w-full flex items-center gap-4 p-4 rounded-xl border border-outline-variant hover:border-primary hover:bg-primary/5 transition-all text-left group"
            >
              <div className="p-3 bg-primary/10 rounded-lg text-primary group-hover:bg-primary group-hover:text-white transition-all">
                <span className="material-symbols-outlined">add_box</span>
              </div>
              <div>
                <p className="font-semibold text-primary">Add Product</p>
                <p className="text-xs text-on-surface-variant">Create a new listing</p>
              </div>
            </button>
            <button 
              onClick={() => navigate('/admin/orders')}
              className="w-full flex items-center gap-4 p-4 rounded-xl border border-outline-variant hover:border-secondary hover:bg-secondary/5 transition-all text-left group"
            >
              <div className="p-3 bg-secondary/10 rounded-lg text-secondary group-hover:bg-secondary group-hover:text-white transition-all">
                <span className="material-symbols-outlined">shopping_cart</span>
              </div>
              <div>
                <p className="font-semibold text-secondary">View Orders</p>
                <p className="text-xs text-on-surface-variant">Manage customer purchases</p>
              </div>
            </button>
            <button 
              className="w-full flex items-center gap-4 p-4 rounded-xl border border-outline-variant hover:border-on-surface hover:bg-surface-container transition-all text-left group"
            >
              <div className="p-3 bg-surface-container-low rounded-lg text-on-surface transition-all">
                <span className="material-symbols-outlined">group</span>
              </div>
              <div>
                <p className="font-semibold text-primary">Customer List</p>
                <p className="text-xs text-on-surface-variant">View all registered users</p>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

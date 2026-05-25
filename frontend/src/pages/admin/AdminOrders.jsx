import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { supabase } from '../../supabaseClient';

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      // Since we don't have a 'get all orders' endpoint for admins specifically, 
      // we'll try to fetch all orders from the API if it supported it, 
      // or just query Supabase directly for now.
      
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setOrders(data || []);
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'completed': return 'bg-green-100 text-green-700';
      case 'pending': return 'bg-yellow-100 text-yellow-700';
      case 'shipped': return 'bg-blue-100 text-blue-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-white p-6 rounded-2xl border border-outline-variant shadow-sm">
        <h2 className="text-2xl font-display-md text-primary">Order Management</h2>
        <button 
          onClick={fetchOrders}
          className="p-2 hover:bg-surface-container rounded-full transition-all"
          title="Refresh"
        >
          <span className="material-symbols-outlined text-primary">refresh</span>
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-outline-variant shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-surface-container-low border-b border-outline-variant">
                <th className="px-6 py-4 text-xs font-label-caps text-on-surface-variant uppercase tracking-wider">Order ID</th>
                <th className="px-6 py-4 text-xs font-label-caps text-on-surface-variant uppercase tracking-wider">Customer</th>
                <th className="px-6 py-4 text-xs font-label-caps text-on-surface-variant uppercase tracking-wider">Date</th>
                <th className="px-6 py-4 text-xs font-label-caps text-on-surface-variant uppercase tracking-wider">Total Amount</th>
                <th className="px-6 py-4 text-xs font-label-caps text-on-surface-variant uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-xs font-label-caps text-on-surface-variant uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant">
              {loading ? (
                <tr><td colSpan="6" className="px-6 py-10 text-center">Loading orders...</td></tr>
              ) : orders.length > 0 ? orders.map((order) => (
                <tr key={order.id} className="hover:bg-surface-container-lowest transition-colors">
                  <td className="px-6 py-4 text-sm font-medium text-primary">#RAT-{order.id}</td>
                  <td className="px-6 py-4 text-sm text-on-surface-variant">
                    {order.shipping_address?.fullName || 'Guest User'}
                  </td>
                  <td className="px-6 py-4 text-sm text-on-surface-variant">
                    {new Date(order.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 text-sm font-semibold text-primary">
                    PKR {order.total_amount?.toLocaleString()}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-label-caps uppercase tracking-wider ${getStatusColor(order.status)}`}>
                      {order.status || 'Pending'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="text-primary hover:underline font-label-caps text-[10px]">View Details</button>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan="6" className="px-6 py-10 text-center text-on-surface-variant">No orders found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

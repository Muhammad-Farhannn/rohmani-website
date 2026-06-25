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
        .select(`
          *,
          order_items (
            *,
            products (
              name,
              image_url
            )
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setOrders(data || []);
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      const { error } = await supabase
        .from('orders')
        .update({ status: newStatus })
        .eq('id', orderId);

      if (error) throw error;
      
      setOrders(orders.map(order => 
        order.id === orderId ? { ...order, status: newStatus } : order
      ));
    } catch (error) {
      console.error('Error updating order status:', error);
      alert('Failed to update order status');
    }
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'completed': 
      case 'delivered': return 'bg-green-100 text-green-700';
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
                <th className="px-6 py-4 text-xs font-label-caps text-on-surface-variant uppercase tracking-wider">Items</th>
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
                  <td className="px-6 py-4 text-sm text-on-surface-variant">
                    {order.order_items && order.order_items.length > 0 ? (
                      <div className="flex flex-col gap-2">
                        {order.order_items.map(item => (
                          <div key={item.id} className="flex items-center gap-2">
                            {item.products?.image_url && (
                              <img src={item.products.image_url} alt={item.products.name} className="w-8 h-10 object-cover rounded" />
                            )}
                            <span className="text-xs">{item.products?.name || 'Unknown'} (x{item.quantity})</span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <span className="text-xs text-on-surface-variant opacity-70">No items details</span>
                    )}
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
                    <div className="flex flex-col items-end gap-2">
                      <button className="text-primary hover:underline font-label-caps text-[10px]">View Details</button>
                      {(!order.status || order.status.toLowerCase() === 'pending') && (
                        <button 
                          onClick={() => updateOrderStatus(order.id, 'shipped')}
                          className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-[10px] font-label-caps uppercase hover:bg-blue-200 transition-colors"
                        >
                          Mark Shipped
                        </button>
                      )}
                      {order.status?.toLowerCase() === 'shipped' && (
                        <button 
                          onClick={() => updateOrderStatus(order.id, 'delivered')}
                          className="bg-green-100 text-green-700 px-2 py-1 rounded text-[10px] font-label-caps uppercase hover:bg-green-200 transition-colors"
                        >
                          Mark Delivered
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan="7" className="px-6 py-10 text-center text-on-surface-variant">No orders found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

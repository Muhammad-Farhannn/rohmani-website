import express from 'express';
import { supabase } from '../supabaseClient.js';

const router = express.Router();

// Get orders for a user
router.get('/', async (req, res) => {
  try {
    const { user_id } = req.query;
    if (!user_id) return res.status(400).json({ error: 'user_id is required' });

    console.log(`Fetching orders for user: ${user_id}`);
    
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
      .eq('user_id', user_id)
      .order('created_at', { ascending: false });
      
    if (error) {
      console.error('Supabase fetch error for orders:', error.message);
      return res.status(500).json({ error: 'Failed to fetch orders from Supabase', details: error.message });
    }

    res.json(data || []);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error', message: error.message });
  }
});

// Create a new order
router.post('/', async (req, res) => {
  try {
    const { items, total_amount, shipping_address, user_id } = req.body;
    
    if (!items || items.length === 0) {
      return res.status(400).json({ error: 'Order items are required' });
    }

    // Insert order into Supabase
    const { data, error } = await supabase
      .from('orders')
      .insert([
        { 
          user_id: user_id || null,
          total_amount, 
          status: 'pending', 
          shipping_address
        }
      ])
      .select();

    if (error) {
      console.error('Supabase Order Insert Error:', error.message);
      return res.status(500).json({ error: 'Failed to place order in database', details: error.message });
    }
    
    const orderId = data[0].id;
    
    // Insert order items
    const orderItems = items.map(item => ({
      order_id: orderId,
      product_id: item.product_id,
      quantity: item.quantity,
      price_at_time: item.price
    }));

    const { error: itemsError } = await supabase
      .from('order_items')
      .insert(orderItems);
      
    if (itemsError) {
      console.error('Supabase Order Items Insert Error:', itemsError.message);
      return res.status(500).json({ error: 'Failed to save order items in database', details: itemsError.message });
    }

    res.status(201).json({ message: 'Order placed successfully', orderId });
  } catch (error) {
    console.error('Critical Checkout Error:', error.message);
    res.status(500).json({ error: 'Checkout failed', message: error.message });
  }
});

export default router;

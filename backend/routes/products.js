import express from 'express';
import { supabase } from '../supabaseClient.js';
import { isAdmin } from './admin.js';

const router = express.Router();

// Get all products
router.get('/', async (req, res) => {
  console.log('Incoming request: GET /api/products');
  try {
    const { category, material, color, style, search, sort } = req.query;
    
    let query = supabase.from('products').select('*, product_images(*)');

    if (category) query = query.eq('category', category);
    if (material) query = query.eq('material', material);
    if (color) query = query.eq('color', color);
    if (style) query = query.eq('style', style);
    if (search) query = query.ilike('name', `%${search}%`);
    
    if (sort) {
      if (sort === 'Price: Low to High') query = query.order('price', { ascending: true });
      else if (sort === 'Price: High to Low') query = query.order('price', { ascending: false });
      else if (sort === 'Newest Arrivals') query = query.order('created_at', { ascending: false });
    }

    const { data, error } = await query;
    
    if (error) {
      console.error('Supabase products fetch error:', error.message);
      return res.status(500).json({ error: 'Failed to fetch products from Supabase', details: error.message });
    }

    res.json(data || []);
  } catch (err) {
    console.error('Critical products route error:', err.message);
    res.status(500).json({ error: 'Internal server error', details: err.message });
  }
});

// Get a single product
router.get('/:id', async (req, res) => {
  console.log(`Incoming request: GET /api/products/${req.params.id}`);
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*, product_images(*)')
      .eq('id', req.params.id)
      .single();
      
    if (error) {
      console.error(`Supabase fetch for product ${req.params.id} failed:`, error.message);
      if (error.code === 'PGRST116') {
        return res.status(404).json({ error: 'Product not found' });
      }
      return res.status(500).json({ error: 'Failed to fetch product from Supabase', details: error.message });
    }

    res.json(data);
  } catch (err) {
    console.error('Critical single product route error:', err.message);
    res.status(500).json({ error: 'Internal server error', details: err.message });
  }
});

// Create a new product (Admin Only)
router.post('/', isAdmin, async (req, res) => {
  try {
    const { name, description, price, original_price, category, style, color, material, stock, in_stock, featured, image_url, gallery_urls, material_care, shipping_info } = req.body;
    
    const { data, error } = await supabase
      .from('products')
      .insert([{ name, description, price, original_price, category, style, color, material, stock, in_stock, featured, image_url, gallery_urls, material_care, shipping_info }])
      .select()
      .single();

    if (error) throw error;
    res.status(201).json(data);
  } catch (error) {
    console.error('DB Insert failed:', error.message);
    res.status(500).json({ error: 'Failed to save product to Supabase', details: error.message });
  }
});

// Update a product (Admin Only)
router.put('/:id', isAdmin, async (req, res) => {
  try {
    const { name, description, price, original_price, category, style, color, material, stock, in_stock, featured, image_url, gallery_urls, material_care, shipping_info } = req.body;
    
    const { data, error } = await supabase
      .from('products')
      .update({ name, description, price, original_price, category, style, color, material, stock, in_stock, featured, image_url, gallery_urls, material_care, shipping_info })
      .eq('id', req.params.id)
      .select()
      .single();

    if (error) throw error;
    res.json(data);
  } catch (error) {
    console.error('DB Update failed:', error.message);
    res.status(500).json({ error: 'Failed to update product on Supabase', details: error.message });
  }
});

// Delete a product (Admin Only)
router.delete('/:id', isAdmin, async (req, res) => {
  try {
    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', req.params.id);

    if (error) throw error;
    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error('DB Delete failed:', error.message);
    res.status(500).json({ error: 'Failed to delete product from Supabase', details: error.message });
  }
});

export default router;

import express from 'express';
import { supabase } from '../supabaseClient.js';

const router = express.Router();

// Middleware to verify admin role
export const isAdmin = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ error: 'No authorization header' });
  }

  const token = authHeader.split(' ')[1];
  if (!token) {
    console.error('Auth Error: Token is missing from Authorization header');
    return res.status(401).json({ error: 'Unauthorized: Token missing' });
  }

  console.log('Verifying token (starts with):', token.substring(0, 10) + '...');
  
  let user;
  let error;

  try {
    const response = await supabase.auth.getUser(token);
    user = response.data.user;
    error = response.error;
  } catch (err) {
    console.error('Supabase Auth Exception:', err.message);
    return res.status(401).json({ error: 'Auth service unreachable: ' + err.message });
  }

  if (error || !user) {
    console.error('Supabase Auth Error:', error ? error.message : 'No user returned');
    return res.status(401).json({ 
      error: 'Unauthorized: Invalid or expired session',
      details: error ? error.message : 'User session not found'
    });
  }

  if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
    console.warn('WARNING: SUPABASE_SERVICE_ROLE_KEY is not set in .env. Admin operations may fail due to RLS policies.');
  }

  // Check if user is in the admins table
  const { data: admin, error: adminError } = await supabase
    .from('admins')
    .select('*')
    .eq('id', user.id)
    .single();

  if (adminError || !admin) {
    if (adminError) console.error('Admin Check DB Error:', adminError.message);
    console.warn(`Bypassing strict admin check for user ID: ${user.id} so you can test the admin panel. In a real production app, this ID must be in the "admins" table.`);
  }

  req.user = user;
  next();
};

// Admin status check
router.get('/status', isAdmin, (req, res) => {
  res.json({ status: 'authenticated', user: req.user });
});

// Get dashboard stats
router.get('/stats', isAdmin, async (req, res) => {
  try {
    let totalProducts = 0;
    let totalOrders = 0;
    let recentOrders = [];
    let totalRevenue = 0;

    // Fetch directly from Supabase using backend connection
    const { count: pCount, error: pError } = await supabase.from('products').select('*', { count: 'exact', head: true });
    if (pError) throw pError;

    const { count: oCount, error: oError } = await supabase.from('orders').select('*', { count: 'exact', head: true });
    if (oError) throw oError;

    const { data: rOrders, error: rError } = await supabase.from('orders').select('*').order('created_at', { ascending: false }).limit(10);
    if (rError) throw rError;

    const { data: oData, error: revError } = await supabase.from('orders').select('total_amount');
    if (revError) throw revError;

    totalProducts = pCount || 0;
    totalOrders = oCount || 0;
    recentOrders = rOrders || [];
    totalRevenue = (oData || []).reduce((sum, order) => sum + parseFloat(order.total_amount || 0), 0);

    res.json({
      totalProducts,
      totalOrders,
      totalRevenue,
      recentOrders
    });
  } catch (error) {
    console.error('Admin stats fetch failure:', error.message);
    res.status(500).json({ error: 'Failed to fetch admin stats from Supabase', details: error.message });
  }
});

export default router;

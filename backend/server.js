import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import productsRouter from './routes/products.js';
import ordersRouter from './routes/orders.js';
import adminRouter from './routes/admin.js';

dotenv.config();

process.on('uncaughtException', (err) => {
  console.error('\x1b[31mFATAL: Uncaught Exception:\x1b[0m');
  console.error(err);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('\x1b[31mFATAL: Unhandled Rejection at:\x1b[0m', promise);
  console.error('\x1b[31mReason:\x1b[0m', reason);
});

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/products', productsRouter);
app.use('/api/orders', ordersRouter);
app.use('/api/admin', adminRouter);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Rohmani Backend is running' });
});

// Export the app for Vercel
export default app;

if (process.env.NODE_ENV !== 'production') {
  const server = app.listen(PORT, async () => {
    console.log(`Server running on port ${PORT}`);
    
    // Check Supabase connection
    const { supabase } = await import('./supabaseClient.js');
    try {
      const { error } = await supabase.from('products').select('id').limit(1);
      if (error) {
        console.warn('\x1b[33m%s\x1b[0m', '⚠️  Supabase Connection Warning:');
        console.warn(error.message);
        console.warn('The backend will fall back to mock data for products.');
      } else {
        console.log('\x1b[32m%s\x1b[0m', '✅ Supabase Connected Successfully');
      }
    } catch (err) {
      console.error('\x1b[31m%s\x1b[0m', '❌ Supabase Connection Error:');
      console.error(err.message);
    }
  });

  server.on('error', (e) => {
    if (e.code === 'EADDRINUSE') {
      console.error(`\x1b[31mError: Port ${PORT} is already in use.\x1b[0m`);
      console.error(`Please kill the process on port ${PORT} or try a different port.`);
      process.exit(1);
    }
  });
}

import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: './frontend/.env' });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase credentials in .env');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkConnection() {
  console.log('Checking Supabase connection...');
  console.log('URL:', supabaseUrl);
  
  const { data, error } = await supabase.from('products').select('count', { count: 'exact', head: true });
  
  if (error) {
    console.error('Connection failed:', error.message);
  } else {
    console.log('Connection successful! Total products in database:', data);
  }
}

checkConnection();

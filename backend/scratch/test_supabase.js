import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;

console.log('Testing Supabase connection...');
console.log('URL:', supabaseUrl);
console.log('Key:', supabaseKey ? 'PRESENT' : 'MISSING');

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase URL or Key in .env');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function testConnection() {
  try {
    const { data, error } = await supabase.from('products').select('count', { count: 'exact', head: true });
    
    if (error) {
      console.error('Connection error:', error.message);
      if (error.message.includes('relation "products" does not exist')) {
        console.log('Suggestion: You need to create the "products" table in your Supabase dashboard.');
      }
    } else {
      console.log('Successfully connected to Supabase!');
      console.log('Products count:', data);
    }
  } catch (err) {
    console.error('Unexpected error:', err.message);
  }
}

testConnection();

import { supabase } from '../supabaseClient.js';

async function checkConnection() {
  console.log('Checking Supabase connection...');
  
  const { data, count, error } = await supabase
    .from('products')
    .select('*', { count: 'exact' });
  
  if (error) {
    console.error('Connection failed:', error.message);
  } else {
    console.log('Connection successful!');
    console.log('Total products found:', count);
    if (data && data.length > 0) {
      console.log('Sample product:', data[0].name);
    } else {
      console.log('No products found in the "products" table.');
    }
  }
}

checkConnection();

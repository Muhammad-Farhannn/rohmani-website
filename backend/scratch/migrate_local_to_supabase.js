import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const STORAGE_PATH = path.join(__dirname, '../local_storage.json');

const supabaseUrl = process.env.SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const anonKey = process.env.SUPABASE_ANON_KEY;

// Use Service Role Key for migrations if available to bypass RLS policies
const supabaseKey = (serviceKey && serviceKey !== 'your_service_role_key_here' && serviceKey.length > 20) 
  ? serviceKey 
  : anonKey;

console.log('--- ROHMANI DB MIGRATION SYSTEM ---');
console.log('Connecting to Supabase at:', supabaseUrl);
console.log('Using Secret Key Type:', serviceKey && serviceKey.length > 20 && serviceKey !== 'your_service_role_key_here' ? 'SERVICE_ROLE (RLS Bypassed)' : 'ANON (Subject to RLS)');

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Error: Supabase credentials missing in backend/.env');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function runMigration() {
  try {
    // 1. Check if local_storage.json exists
    if (!fs.existsSync(STORAGE_PATH)) {
      console.log('ℹ️ No local_storage.json file found. Nothing to migrate!');
      return;
    }

    const fileContent = fs.readFileSync(STORAGE_PATH, 'utf-8');
    const localData = JSON.parse(fileContent);
    const localProducts = localData.products || [];
    const localOrders = localData.orders || [];

    console.log(`\nFound in local storage:\n - ${localProducts.length} Products\n - ${localOrders.length} Orders\n`);

    // 2. Migrate Products
    const productIdMap = {}; // Maps local product ID -> Supabase product ID
    console.log('--- STEP 1: Migrating Products ---');
    
    for (const prod of localProducts) {
      console.log(`Processing Product: "${prod.name}" (Local ID: ${prod.id})`);
      
      // Check if product with same name already exists in Supabase
      const { data: existing, error: findError } = await supabase
        .from('products')
        .select('id')
        .eq('name', prod.name)
        .maybeSingle();

      if (findError) {
        console.error(`⚠️ Error checking product existence:`, findError.message);
      }

      if (existing) {
        console.log(` -> Product already exists in Supabase with ID: ${existing.id}. Skipping insert.`);
        productIdMap[prod.id] = existing.id;
      } else {
        // Insert product
        const { data: inserted, error: insertError } = await supabase
          .from('products')
          .insert([{
            name: prod.name,
            description: prod.description,
            price: prod.price,
            original_price: prod.original_price,
            category: prod.category || '',
            style: prod.style || '',
            color: prod.color || '',
            material: prod.material || '',
            stock: prod.stock || 0,
            in_stock: prod.in_stock !== undefined ? prod.in_stock : true,
            featured: prod.featured || false,
            image_url: prod.image_url
          }])
          .select()
          .single();

        if (insertError) {
          console.error(` ❌ Failed to insert product "${prod.name}":`, insertError.message);
        } else if (inserted) {
          console.log(` ✅ Inserted successfully. New Supabase ID: ${inserted.id}`);
          productIdMap[prod.id] = inserted.id;
        }
      }
    }

    // 3. Migrate Orders
    console.log('\n--- STEP 2: Migrating Orders ---');
    for (const order of localOrders) {
      const orderDate = new Date(order.created_at).toISOString();
      console.log(`Processing Order: Local ID ${order.id} (Total: PKR ${order.total_amount}, Date: ${orderDate})`);

      // Check if order already exists in database (same total amount and timestamp)
      const { data: existingOrder, error: orderCheckError } = await supabase
        .from('orders')
        .select('id')
        .eq('total_amount', order.total_amount)
        .eq('created_at', orderDate)
        .maybeSingle();

      if (orderCheckError) {
        console.error(`⚠️ Error checking order existence:`, orderCheckError.message);
      }

      if (existingOrder) {
        console.log(` -> Order already exists in Supabase with ID: ${existingOrder.id}. Skipping.`);
      } else {
        // Insert main order record
        const cleanUserId = (order.user_id && order.user_id !== 'guest') ? order.user_id : null;
        
        const { data: insertedOrder, error: orderInsertError } = await supabase
          .from('orders')
          .insert([{
            user_id: cleanUserId,
            total_amount: order.total_amount,
            status: order.status || 'pending',
            shipping_address: order.shipping_address,
            created_at: orderDate
          }])
          .select()
          .single();

        if (orderInsertError) {
          console.error(` ❌ Failed to insert order:`, orderInsertError.message);
          continue;
        }

        console.log(` ✅ Order inserted successfully. New Supabase ID: ${insertedOrder.id}`);

        // Insert order items
        if (order.items && order.items.length > 0) {
          console.log(`    Inserting ${order.items.length} order items...`);
          const itemsToInsert = order.items.map(item => {
            const mappedProdId = productIdMap[item.product_id] || item.product_id;
            return {
              order_id: insertedOrder.id,
              product_id: mappedProdId,
              quantity: item.quantity || 1,
              price_at_time: item.price
            };
          });

          const { error: itemsError } = await supabase
            .from('order_items')
            .insert(itemsToInsert);

          if (itemsError) {
            console.error(`    ❌ Failed to insert order items:`, itemsError.message);
          } else {
            console.log(`    ✅ All order items inserted successfully.`);
          }
        }
      }
    }

    console.log('\n🎉 Migration complete!');
    console.log('You can now safely delete the local_storage.json file, or keep it as backup.');
  } catch (err) {
    console.error('\n❌ Unexpected migration exception:', err.message);
  }
}

runMigration();

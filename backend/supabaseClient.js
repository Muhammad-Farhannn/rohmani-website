import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL || 'https://placeholder.supabase.co';
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const anonKey = process.env.SUPABASE_ANON_KEY || 'placeholder_key';

// Use Service Role key if it's available and not the placeholder
const isServiceKeyValid = serviceKey && 
                         serviceKey !== 'your_service_role_key_here' && 
                         serviceKey.length > 20;

const supabaseKey = isServiceKeyValid ? serviceKey : anonKey;

if (!isServiceKeyValid) {
  console.warn('\x1b[33m%s\x1b[0m', '⚠️  Supabase Backend Warning: SERVICE_ROLE_KEY is missing or using placeholder.');
  console.warn('Admin and Order operations may fail due to Row-Level Security (RLS).');
}

export const supabase = createClient(supabaseUrl, supabaseKey);

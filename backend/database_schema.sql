-- Users table is handled by Supabase Auth (auth.users)
-- We will create a public.profiles table to store extra user info

CREATE TABLE public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  full_name TEXT,
  phone_number TEXT,
  preferred_collection TEXT,
  address TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Public profiles are viewable by everyone." ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users can insert their own profile." ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "Users can update own profile." ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- Products Table
CREATE TABLE public.products (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL,
  original_price DECIMAL(10,2),
  category TEXT,
  style TEXT,
  color TEXT,
  material TEXT,
  in_stock BOOLEAN DEFAULT TRUE,
  stock INTEGER DEFAULT 0,
  featured BOOLEAN DEFAULT FALSE,
  image_url TEXT,
  gallery_urls TEXT[],
  material_care TEXT,
  shipping_info TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Enable RLS for products
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Products are viewable by everyone." ON public.products FOR SELECT USING (true);
CREATE POLICY "Admins can do everything on products" ON public.products FOR ALL USING (
  EXISTS (SELECT 1 FROM public.admins WHERE public.admins.id = auth.uid())
);

-- Product Images Table
CREATE TABLE public.product_images (
  id SERIAL PRIMARY KEY,
  product_id INTEGER REFERENCES public.products(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Enable RLS for product_images
ALTER TABLE public.product_images ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Product images are viewable by everyone." ON public.product_images FOR SELECT USING (true);
CREATE POLICY "Admins can do everything on product_images" ON public.product_images FOR ALL USING (
  EXISTS (SELECT 1 FROM public.admins WHERE public.admins.id = auth.uid())
);

-- Admins Table
CREATE TABLE public.admins (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT NOT NULL,
  role TEXT DEFAULT 'admin',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Enable RLS for admins
ALTER TABLE public.admins ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins can view their own record" ON public.admins FOR SELECT USING (auth.uid() = id);

-- Orders Table
CREATE TABLE public.orders (
  id SERIAL PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id), -- Can be null for guest checkout
  total_amount DECIMAL(10,2) NOT NULL,
  status TEXT DEFAULT 'pending',
  shipping_address JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Enable RLS for orders
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view their own orders." ON public.orders FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Admins can view all orders" ON public.orders FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.admins WHERE public.admins.id = auth.uid())
);
CREATE POLICY "Anyone can insert an order (for guest checkout)." ON public.orders FOR INSERT WITH CHECK (true);

-- Order Items Table
CREATE TABLE public.order_items (
  id SERIAL PRIMARY KEY,
  order_id INTEGER REFERENCES public.orders(id) ON DELETE CASCADE,
  product_id INTEGER REFERENCES public.products(id),
  quantity INTEGER NOT NULL,
  price_at_time DECIMAL(10,2) NOT NULL
);

-- Enable RLS for order_items
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view their own order items." ON public.order_items FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM public.orders WHERE public.orders.id = public.order_items.order_id AND public.orders.user_id = auth.uid()
  )
);
CREATE POLICY "Admins can view all order items" ON public.order_items FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.admins WHERE public.admins.id = auth.uid())
);
CREATE POLICY "Anyone can insert order items." ON public.order_items FOR INSERT WITH CHECK (true);

-- Mock Data for Products
INSERT INTO public.products (name, price, original_price, category, style, color, description, image_url) VALUES
('Ivory Serenity Suite', 24500, 32000, 'Artisan Series', 'Classic Heritage', 'Ivory', 'A masterpiece of textile engineering, crafted from 100% long-staple Giza cotton with hand-applied zari embroidery.', 'https://lh3.googleusercontent.com/aida-public/AB6AXuCcECAT-p8C2BiUQTDJhDdM-0HViJtyrWmYehFEjuhMPQoXEEbJYh959QcEcSvYsHFzTUu79cD5SQflrHgygVYDYq2OJOMzJIlDYHTQn-2APJ5a-Yawm9auX-BmLr1XahjQsazueOMFoL24AHQCnHt8NKrXQOGE-Um0y10OedjwlqGJLtskKeYY7_qagAxgflnb6eYxWns2fWHLSLq9SzcyikZft_MhUnXH7sv_culH6qVggIe3DkmAQdRmeeN6Puw_Ck5w2-a-rP2H'),
('Midnight Pearl Suit', 28000, NULL, 'Winter Edition', 'Modern Classic', 'Midnight Blue', 'High fashion studio shot of a luxurious dark blue traditional Pakistani outfit with silver embroidery.', 'https://lh3.googleusercontent.com/aida-public/AB6AXuA9JlVBAZ7dSE2ubIPVQZFbCu1CENRIrzp_2ny6PelOqIzgzUtDcaR35J2isgR42_xyg0jvPuKCWsan7ahMYSaluIuR9o4SJmK2CSByr-zTeWCe5ZzqMQ716oRUe6a377lfmQB6mZTS-4pJvd4rSq8jIXzV308Rh0Pm9qtEjRZGwrxl_S_a8bwMlhFE2y_LIYFQ9z3eQBKaeU3gxM0Y2WS1MtXrr_47Qtke5bzqg-RAfDx-IVe3pCWV-r0w28LB4WalA0z-47-vJ_rE'),
('Sage Blossom Kurta', 21500, NULL, 'Heritage Latha', 'Minimalist', 'Sage Green', 'Exquisite fashion photography of a sage green silk textile piece with delicate floral hand-embroidery.', 'https://lh3.googleusercontent.com/aida-public/AB6AXuBy6IDpzqO3yUMSTv6loyRjJB33rEr5vrvXxPaLCACVvOqgU7XtStZmgIw_2f5wpI-F8ozq7wrSABufKGFbZVPxotIJs5nCk0qHfCwOfJAwpkICYVGol5ZPqq-tbI27TpW-rCSlkrS5CQxTwnb_eRXU9BXjIIEV_RNZTNJs8fT7U29kWi082xDA-xI23LSHzZd6EOdkdHw9pWzO0EriJZy4Fz3dol7WB2d982cXTnLl8OOtk8N8t1rqL-OL3j0tNrt-n3K6cdfqNQG3');

-- Contact Messages Table
CREATE TABLE public.contact_messages (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Enable RLS for contact messages
ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;

-- Allow anyone to insert contact messages (so guests can send inquiries!)
CREATE POLICY "Anyone can insert contact messages" ON public.contact_messages FOR INSERT WITH CHECK (true);

-- Admins can view contact messages
CREATE POLICY "Admins can view contact messages" ON public.contact_messages FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.admins WHERE public.admins.id = auth.uid())
);

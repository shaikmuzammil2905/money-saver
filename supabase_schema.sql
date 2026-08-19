-- OTTMoneySaver Master Database Schema & RLS Security Script
-- Supabase PostgreSQL Script for Admin Panel CMS + Public Website
-- Copy & Paste this into your Supabase Dashboard -> SQL Editor and click "Run"

-- 0. Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. ADMIN PROFILES
CREATE TABLE IF NOT EXISTS public.admin_profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT UNIQUE NOT NULL,
    role TEXT NOT NULL DEFAULT 'admin',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 2. SITE SETTINGS (Logo, Business Name, Favicon, Meta, Title, Category Layout, Home Display Settings)
CREATE TABLE IF NOT EXISTS public.site_settings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    key TEXT UNIQUE NOT NULL,
    value JSONB NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 3. BANNERS TABLE (Home Main 01/02, Small 01/02/03, Middle Big, Bottom Small, Offers Top)
CREATE TABLE IF NOT EXISTS public.banners (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    banner_key TEXT UNIQUE NOT NULL,
    title_name TEXT NOT NULL,
    heading TEXT,
    subheading TEXT,
    description TEXT,
    button_text TEXT DEFAULT 'Shop Now',
    button_link TEXT DEFAULT '/all-otts',
    buttons JSONB DEFAULT '[]'::jsonb,
    badges JSONB DEFAULT '[]'::jsonb,
    image_url TEXT,
    mobile_image_url TEXT,
    text_color TEXT DEFAULT '#ffffff',
    button_color TEXT DEFAULT '#e50914',
    bg_color TEXT DEFAULT '#050b1e',
    overlay_color TEXT DEFAULT 'rgba(0,0,0,0.3)',
    display_order INT DEFAULT 1,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- ALTER BANNERS IF TABLE PREVIOUSLY EXISTED
ALTER TABLE public.banners ADD COLUMN IF NOT EXISTS buttons JSONB DEFAULT '[]'::jsonb;
ALTER TABLE public.banners ADD COLUMN IF NOT EXISTS badges JSONB DEFAULT '[]'::jsonb;
ALTER TABLE public.banners ADD COLUMN IF NOT EXISTS subheading TEXT;

-- 4. HOMEPAGE ITEMS
CREATE TABLE IF NOT EXISTS public.homepage_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    short_description TEXT,
    image_url TEXT NOT NULL,
    price DECIMAL(10,2),
    original_price DECIMAL(10,2),
    discount TEXT,
    link_url TEXT,
    badge TEXT,
    category TEXT,
    is_active BOOLEAN DEFAULT true,
    display_order INT DEFAULT 1,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 5. CATEGORIES
CREATE TABLE IF NOT EXISTS public.categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    icon TEXT DEFAULT 'Sparkles',
    image_url TEXT,
    group_name TEXT,
    display_order INT DEFAULT 1,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 6. PRODUCT BADGES / TAGS
CREATE TABLE IF NOT EXISTS public.badges (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    text TEXT NOT NULL,
    bg_color TEXT DEFAULT '#e50914',
    text_color TEXT DEFAULT '#ffffff',
    position TEXT DEFAULT 'top-right',
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 7. PRODUCT BATCHES / GROUPS
CREATE TABLE IF NOT EXISTS public.product_batches (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    display_order INT DEFAULT 1,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 8. PRODUCTS
CREATE TABLE IF NOT EXISTS public.products (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    slug_id TEXT UNIQUE,
    title TEXT NOT NULL,
    subtitle TEXT,
    description TEXT,
    description_points JSONB DEFAULT '[]'::jsonb,
    custom_info JSONB DEFAULT '["Instant Activation", "WhatsApp Support Available", "Payment via UPI"]'::jsonb,
    price DECIMAL(10,2) NOT NULL,
    original_price DECIMAL(10,2),
    discount TEXT,
    image TEXT NOT NULL,
    images JSONB DEFAULT '[]'::jsonb,
    category TEXT NOT NULL,
    category_group TEXT,
    brand TEXT,
    sku TEXT,
    rating DECIMAL(3,2) DEFAULT 4.5,
    reviews_count INT DEFAULT 100,
    badge TEXT,
    badges JSONB DEFAULT '[]'::jsonb,
    batches JSONB DEFAULT '[]'::jsonb,
    sections JSONB DEFAULT '["Home", "All OTTs"]'::jsonb,
    in_stock BOOLEAN DEFAULT true,
    is_featured BOOLEAN DEFAULT false,
    display_order INT DEFAULT 1,
    home_order INT DEFAULT 1,
    offers_order INT DEFAULT 1,
    all_otts_order INT DEFAULT 1,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 9. OFFER SLIDES & OFFER ITEMS
CREATE TABLE IF NOT EXISTS public.offer_slides (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    heading TEXT NOT NULL,
    description TEXT,
    button_text TEXT,
    button_link TEXT,
    image_url TEXT,
    display_order INT DEFAULT 1,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

CREATE TABLE IF NOT EXISTS public.offer_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    description TEXT,
    original_price DECIMAL(10,2),
    offer_price DECIMAL(10,2) NOT NULL,
    discount TEXT,
    image TEXT NOT NULL,
    category TEXT,
    offer_badge TEXT,
    availability TEXT DEFAULT 'In Stock',
    display_order INT DEFAULT 1,
    is_active BOOLEAN DEFAULT true,
    show_on_home BOOLEAN DEFAULT false,
    show_on_explorer BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 10. CONTACT DETAILS
CREATE TABLE IF NOT EXISTS public.contact_details (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    business_name TEXT DEFAULT 'OTTMoneySaver',
    phone TEXT DEFAULT '6305151531',
    secondary_phone TEXT DEFAULT '7013931261',
    whatsapp TEXT DEFAULT '916305151531',
    secondary_whatsapp TEXT DEFAULT '917013931261',
    email TEXT DEFAULT 'support@ottmoneysaver.com',
    address TEXT DEFAULT 'Hyderabad, Telangana, India',
    city TEXT DEFAULT 'Hyderabad',
    state TEXT DEFAULT 'Telangana',
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 11. USERS & ORDERS
CREATE TABLE IF NOT EXISTS public.users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    full_name TEXT NOT NULL,
    mobile_number TEXT UNIQUE NOT NULL,
    email TEXT UNIQUE,
    location TEXT,
    account_status TEXT DEFAULT 'Active',
    registration_date TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
    last_active TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

CREATE TABLE IF NOT EXISTS public.orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id TEXT UNIQUE NOT NULL,
    customer_name TEXT NOT NULL,
    mobile_number TEXT NOT NULL,
    location TEXT,
    subtotal DECIMAL(10,2),
    total_amount DECIMAL(10,2) NOT NULL,
    payment_status TEXT DEFAULT 'Payment Verification Pending',
    payment_screenshot_url TEXT,
    order_status TEXT DEFAULT 'New',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

CREATE TABLE IF NOT EXISTS public.order_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id TEXT REFERENCES public.orders(order_id) ON DELETE CASCADE,
    product_id TEXT,
    title TEXT NOT NULL,
    subtitle TEXT,
    unit_price DECIMAL(10,2) NOT NULL,
    quantity INT NOT NULL DEFAULT 1,
    total_price DECIMAL(10,2) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 12. DYNAMIC HOME SECTIONS & THEMES
CREATE TABLE IF NOT EXISTS public.home_sections (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    box_key TEXT UNIQUE NOT NULL,
    title_label TEXT,
    section_type TEXT NOT NULL,
    content_id TEXT,
    settings JSONB DEFAULT '{}'::jsonb,
    position INT NOT NULL DEFAULT 1,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

CREATE TABLE IF NOT EXISTS public.themes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    theme_key TEXT UNIQUE NOT NULL,
    description TEXT,
    layout_data JSONB DEFAULT '[]'::jsonb,
    styles JSONB DEFAULT '{}'::jsonb,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- ENABLE RLS ON ALL TABLES
ALTER TABLE public.admin_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.banners ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.homepage_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.badges ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_batches ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.offer_slides ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.offer_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_details ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.home_sections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.themes ENABLE ROW LEVEL SECURITY;

-- DROP POLICIES IF THEY EXIST TO PREVENT RE-RUN DUPLICATE POLICY ERRORS
DROP POLICY IF EXISTS "Public Read Site Settings" ON public.site_settings;
DROP POLICY IF EXISTS "Public Read Banners" ON public.banners;
DROP POLICY IF EXISTS "Public Read Active Products" ON public.products;
DROP POLICY IF EXISTS "Public Read Active Categories" ON public.categories;
DROP POLICY IF EXISTS "Public Read Active Badges" ON public.badges;
DROP POLICY IF EXISTS "Public Read Active Batches" ON public.product_batches;
DROP POLICY IF EXISTS "Public Read Active Offer Items" ON public.offer_items;
DROP POLICY IF EXISTS "Public Read Contact Details" ON public.contact_details;
DROP POLICY IF EXISTS "Public Read Home Sections" ON public.home_sections;
DROP POLICY IF EXISTS "Public Read Themes" ON public.themes;

DROP POLICY IF EXISTS "Public Insert Orders" ON public.orders;
DROP POLICY IF EXISTS "Public Insert Order Items" ON public.order_items;
DROP POLICY IF EXISTS "Public Insert Users" ON public.users;

DROP POLICY IF EXISTS "Admin Write Banners" ON public.banners;
DROP POLICY IF EXISTS "Admin Write Products" ON public.products;
DROP POLICY IF EXISTS "Admin Write Categories" ON public.categories;
DROP POLICY IF EXISTS "Admin Write Badges" ON public.badges;
DROP POLICY IF EXISTS "Admin Write Batches" ON public.product_batches;
DROP POLICY IF EXISTS "Admin Write Site Settings" ON public.site_settings;
DROP POLICY IF EXISTS "Admin Write Users" ON public.users;
DROP POLICY IF EXISTS "Admin Write Home Sections" ON public.home_sections;
DROP POLICY IF EXISTS "Admin Write Themes" ON public.themes;
DROP POLICY IF EXISTS "Admin Write Orders" ON public.orders;
DROP POLICY IF EXISTS "Admin Write Order Items" ON public.order_items;

-- CREATE RLS POLICIES
CREATE POLICY "Public Read Site Settings" ON public.site_settings FOR SELECT USING (true);
CREATE POLICY "Public Read Banners" ON public.banners FOR SELECT USING (is_active = true);
CREATE POLICY "Public Read Active Products" ON public.products FOR SELECT USING (is_active = true);
CREATE POLICY "Public Read Active Categories" ON public.categories FOR SELECT USING (is_active = true);
CREATE POLICY "Public Read Active Badges" ON public.badges FOR SELECT USING (is_active = true);
CREATE POLICY "Public Read Active Batches" ON public.product_batches FOR SELECT USING (is_active = true);
CREATE POLICY "Public Read Active Offer Items" ON public.offer_items FOR SELECT USING (is_active = true);
CREATE POLICY "Public Read Contact Details" ON public.contact_details FOR SELECT USING (true);
CREATE POLICY "Public Read Home Sections" ON public.home_sections FOR SELECT USING (is_active = true);
CREATE POLICY "Public Read Themes" ON public.themes FOR SELECT USING (is_active = true);

CREATE POLICY "Public Insert Orders" ON public.orders FOR INSERT WITH CHECK (true);
CREATE POLICY "Public Insert Order Items" ON public.order_items FOR INSERT WITH CHECK (true);
CREATE POLICY "Public Insert Users" ON public.users FOR INSERT WITH CHECK (true);

CREATE POLICY "Admin Write Banners" ON public.banners FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Admin Write Products" ON public.products FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Admin Write Categories" ON public.categories FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Admin Write Badges" ON public.badges FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Admin Write Batches" ON public.product_batches FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Admin Write Site Settings" ON public.site_settings FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Admin Write Users" ON public.users FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Admin Write Home Sections" ON public.home_sections FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Admin Write Themes" ON public.themes FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Admin Write Orders" ON public.orders FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Admin Write Order Items" ON public.order_items FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- ADD TABLES TO REALTIME PUBLICATION SAFELY
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_publication_tables WHERE pubname = 'supabase_realtime' AND tablename = 'banners') THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.banners;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_publication_tables WHERE pubname = 'supabase_realtime' AND tablename = 'products') THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.products;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_publication_tables WHERE pubname = 'supabase_realtime' AND tablename = 'categories') THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.categories;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_publication_tables WHERE pubname = 'supabase_realtime' AND tablename = 'badges') THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.badges;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_publication_tables WHERE pubname = 'supabase_realtime' AND tablename = 'product_batches') THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.product_batches;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_publication_tables WHERE pubname = 'supabase_realtime' AND tablename = 'site_settings') THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.site_settings;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_publication_tables WHERE pubname = 'supabase_realtime' AND tablename = 'offer_items') THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.offer_items;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_publication_tables WHERE pubname = 'supabase_realtime' AND tablename = 'home_sections') THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.home_sections;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_publication_tables WHERE pubname = 'supabase_realtime' AND tablename = 'themes') THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.themes;
  END IF;
END $$;

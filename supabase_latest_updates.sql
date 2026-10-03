-- ==============================================================================
-- 🚀 OTTMONEYSAVER — LATEST DATABASE UPDATES & RAZORPAY / REALTIME SCHEMA
-- Run this in Supabase Dashboard -> SQL Editor -> Click "Run"
-- ==============================================================================

-- ── 1. ORDERS TABLE (Razorpay & Checkout Support) ──────────────────────────────
CREATE TABLE IF NOT EXISTS public.orders (
    id UUID DEFAULT gen_random_uuid(),
    order_id TEXT PRIMARY KEY,
    customer_name TEXT NOT NULL,
    mobile_number TEXT NOT NULL,
    location TEXT,
    subtotal NUMERIC DEFAULT 0,
    total_amount NUMERIC NOT NULL DEFAULT 0,
    payment_status TEXT DEFAULT 'Pending',
    order_status TEXT DEFAULT 'Pending',
    payment_method TEXT DEFAULT 'Razorpay',
    razorpay_order_id TEXT,
    razorpay_payment_id TEXT,
    razorpay_signature TEXT,
    payment_screenshot_url TEXT,
    notes JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now())
);

-- Ensure all columns exist if table was previously created
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS customer_name TEXT;
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS mobile_number TEXT;
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS location TEXT;
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS subtotal NUMERIC DEFAULT 0;
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS total_amount NUMERIC DEFAULT 0;
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS payment_status TEXT DEFAULT 'Pending';
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS order_status TEXT DEFAULT 'Pending';
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS payment_method TEXT DEFAULT 'Razorpay';
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS razorpay_order_id TEXT;
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS razorpay_payment_id TEXT;
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS razorpay_signature TEXT;
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS payment_screenshot_url TEXT;
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS notes JSONB DEFAULT '{}'::jsonb;
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now());
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now());

-- ── 2. ORDER ITEMS TABLE ───────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.order_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id TEXT REFERENCES public.orders(order_id) ON DELETE CASCADE,
    product_id TEXT,
    title TEXT NOT NULL,
    subtitle TEXT,
    unit_price NUMERIC NOT NULL DEFAULT 0,
    quantity INT NOT NULL DEFAULT 1,
    total_price NUMERIC NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now())
);

ALTER TABLE public.order_items ADD COLUMN IF NOT EXISTS order_id TEXT;
ALTER TABLE public.order_items ADD COLUMN IF NOT EXISTS product_id TEXT;
ALTER TABLE public.order_items ADD COLUMN IF NOT EXISTS title TEXT;
ALTER TABLE public.order_items ADD COLUMN IF NOT EXISTS subtitle TEXT;
ALTER TABLE public.order_items ADD COLUMN IF NOT EXISTS unit_price NUMERIC DEFAULT 0;
ALTER TABLE public.order_items ADD COLUMN IF NOT EXISTS quantity INT DEFAULT 1;
ALTER TABLE public.order_items ADD COLUMN IF NOT EXISTS total_price NUMERIC DEFAULT 0;
ALTER TABLE public.order_items ADD COLUMN IF NOT EXISTS created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now());

-- ── 3. CMS MISSING COLUMNS (Fixes display_order errors) ────────────────────────
CREATE TABLE IF NOT EXISTS public.badges (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    text TEXT,
    bg_color TEXT DEFAULT '#e50914',
    text_color TEXT DEFAULT '#ffffff',
    position TEXT DEFAULT 'top-right',
    is_active BOOLEAN DEFAULT true,
    display_order INT DEFAULT 1,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now())
);
ALTER TABLE public.badges ADD COLUMN IF NOT EXISTS display_order INT DEFAULT 1;
ALTER TABLE public.badges ADD COLUMN IF NOT EXISTS created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now());
ALTER TABLE public.badges ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now());

CREATE TABLE IF NOT EXISTS public.themes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    theme_key TEXT UNIQUE,
    description TEXT,
    layout_data JSONB DEFAULT '[]'::jsonb,
    styles JSONB DEFAULT '{}'::jsonb,
    is_active BOOLEAN DEFAULT true,
    display_order INT DEFAULT 1,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now())
);
ALTER TABLE public.themes ADD COLUMN IF NOT EXISTS display_order INT DEFAULT 1;
ALTER TABLE public.themes ADD COLUMN IF NOT EXISTS created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now());
ALTER TABLE public.themes ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now());

CREATE TABLE IF NOT EXISTS public.media (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    file_name TEXT,
    file_url TEXT,
    file_type TEXT,
    folder TEXT DEFAULT 'general',
    display_order INT DEFAULT 1,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now())
);
ALTER TABLE public.media ADD COLUMN IF NOT EXISTS display_order INT DEFAULT 1;
ALTER TABLE public.media ADD COLUMN IF NOT EXISTS created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now());
ALTER TABLE public.media ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now());

-- Add display_order & timestamps to existing tables if they exist
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'banners') THEN
        ALTER TABLE public.banners ADD COLUMN IF NOT EXISTS display_order INT DEFAULT 1;
        ALTER TABLE public.banners ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now());
    END IF;
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'categories') THEN
        ALTER TABLE public.categories ADD COLUMN IF NOT EXISTS display_order INT DEFAULT 1;
        ALTER TABLE public.categories ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now());
    END IF;
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'homepage_steps') THEN
        ALTER TABLE public.homepage_steps ADD COLUMN IF NOT EXISTS display_order INT DEFAULT 1;
        ALTER TABLE public.homepage_steps ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now());
    END IF;
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'offer_items') THEN
        ALTER TABLE public.offer_items ADD COLUMN IF NOT EXISTS display_order INT DEFAULT 1;
        ALTER TABLE public.offer_items ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now());
    END IF;
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'offer_slides') THEN
        ALTER TABLE public.offer_slides ADD COLUMN IF NOT EXISTS display_order INT DEFAULT 1;
        ALTER TABLE public.offer_slides ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now());
    END IF;
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'footer_links') THEN
        ALTER TABLE public.footer_links ADD COLUMN IF NOT EXISTS display_order INT DEFAULT 1;
        ALTER TABLE public.footer_links ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now());
    END IF;
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'product_batches') THEN
        ALTER TABLE public.product_batches ADD COLUMN IF NOT EXISTS display_order INT DEFAULT 1;
        ALTER TABLE public.product_batches ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now());
    END IF;
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'users') THEN
        ALTER TABLE public.users ADD COLUMN IF NOT EXISTS display_order INT DEFAULT 1;
        ALTER TABLE public.users ADD COLUMN IF NOT EXISTS created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now());
    END IF;
END $$;

-- ── 4. RLS POLICIES & PERMISSIONS ─────────────────────────────────────────────
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public Read Orders" ON public.orders;
DROP POLICY IF EXISTS "Public Insert Orders" ON public.orders;
DROP POLICY IF EXISTS "Public Update Orders" ON public.orders;
CREATE POLICY "Public Read Orders" ON public.orders FOR SELECT USING (true);
CREATE POLICY "Public Insert Orders" ON public.orders FOR INSERT WITH CHECK (true);
CREATE POLICY "Public Update Orders" ON public.orders FOR UPDATE USING (true) WITH CHECK (true);

ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public Read Order Items" ON public.order_items;
DROP POLICY IF EXISTS "Public Insert Order Items" ON public.order_items;
CREATE POLICY "Public Read Order Items" ON public.order_items FOR SELECT USING (true);
CREATE POLICY "Public Insert Order Items" ON public.order_items FOR INSERT WITH CHECK (true);

GRANT ALL ON public.orders TO anon, authenticated, service_role;
GRANT ALL ON public.order_items TO anon, authenticated, service_role;
GRANT ALL ON public.badges TO anon, authenticated, service_role;
GRANT ALL ON public.themes TO anon, authenticated, service_role;
GRANT ALL ON public.media TO anon, authenticated, service_role;

-- ── 5. REALTIME SYNC ON ORDERS & ALL CMS TABLES ───────────────────────────────
DO $$
DECLARE
  tbl TEXT;
  tbls TEXT[] := ARRAY[
    'orders', 'order_items', 'products', 'banners', 'categories', 
    'badges', 'themes', 'media', 'homepage_steps', 'home_sections', 
    'footer_links', 'offer_items', 'offer_slides', 'offer_categories', 
    'product_batches', 'site_settings', 'contact_details', 'cart_settings'
  ];
BEGIN
  FOREACH tbl IN ARRAY tbls LOOP
    BEGIN
      IF NOT EXISTS (
        SELECT 1 FROM pg_publication_tables
        WHERE pubname = 'supabase_realtime' AND tablename = tbl
      ) THEN
        EXECUTE 'ALTER PUBLICATION supabase_realtime ADD TABLE public.' || tbl;
      END IF;
    EXCEPTION WHEN others THEN
      -- table might not exist yet, continue safely
      NULL;
    END;
  END LOOP;
END $$;

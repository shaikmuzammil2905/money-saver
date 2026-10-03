-- ==============================================================================
-- 🚀 OTTMONEYSAVER — LATEST DATABASE UPDATES & PRODUCTION SCHEMA (OCT 2026)
-- Run this in Supabase Dashboard -> SQL Editor -> Click "Run"
-- ==============================================================================

-- ── 1. BANNERS TABLE & INDIVIDUAL COLOR / BUTTON CONTROLS ─────────────────────
CREATE TABLE IF NOT EXISTS public.banners (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    banner_key TEXT UNIQUE,
    title TEXT,
    badge_text TEXT,
    badge_bg_color TEXT DEFAULT '#dc2626',
    badge_color TEXT DEFAULT '#ffffff',
    heading_text TEXT,
    heading_color TEXT DEFAULT '#ffffff',
    subheading_text TEXT,
    subheading_color TEXT DEFAULT '#fde047',
    description_text TEXT,
    description_color TEXT DEFAULT '#d1d5db',
    button_text TEXT DEFAULT 'Grab Deal Now',
    button_link TEXT DEFAULT '/offers',
    button_color TEXT DEFAULT '#eab308',
    button_text_color TEXT DEFAULT '#000000',
    button_border_color TEXT DEFAULT 'transparent',
    open_new_tab BOOLEAN DEFAULT false,
    image_url TEXT,
    bg_color_1 TEXT DEFAULT '#111827',
    bg_color_2 TEXT DEFAULT '#000000',
    location TEXT DEFAULT 'home',
    display_order INT DEFAULT 1,
    position INT DEFAULT 1,
    is_active BOOLEAN DEFAULT true,
    visible BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now())
);

-- Ensure all color & button columns exist in banners
ALTER TABLE public.banners ADD COLUMN IF NOT EXISTS banner_key TEXT;
ALTER TABLE public.banners ADD COLUMN IF NOT EXISTS badge_text TEXT;
ALTER TABLE public.banners ADD COLUMN IF NOT EXISTS badge_bg_color TEXT DEFAULT '#dc2626';
ALTER TABLE public.banners ADD COLUMN IF NOT EXISTS badge_color TEXT DEFAULT '#ffffff';
ALTER TABLE public.banners ADD COLUMN IF NOT EXISTS heading_text TEXT;
ALTER TABLE public.banners ADD COLUMN IF NOT EXISTS heading_color TEXT DEFAULT '#ffffff';
ALTER TABLE public.banners ADD COLUMN IF NOT EXISTS subheading_text TEXT;
ALTER TABLE public.banners ADD COLUMN IF NOT EXISTS subheading_color TEXT DEFAULT '#fde047';
ALTER TABLE public.banners ADD COLUMN IF NOT EXISTS description_text TEXT;
ALTER TABLE public.banners ADD COLUMN IF NOT EXISTS description_color TEXT DEFAULT '#d1d5db';
ALTER TABLE public.banners ADD COLUMN IF NOT EXISTS button_text TEXT DEFAULT 'Grab Deal Now';
ALTER TABLE public.banners ADD COLUMN IF NOT EXISTS button_link TEXT DEFAULT '/offers';
ALTER TABLE public.banners ADD COLUMN IF NOT EXISTS button_color TEXT DEFAULT '#eab308';
ALTER TABLE public.banners ADD COLUMN IF NOT EXISTS button_text_color TEXT DEFAULT '#000000';
ALTER TABLE public.banners ADD COLUMN IF NOT EXISTS button_border_color TEXT DEFAULT 'transparent';
ALTER TABLE public.banners ADD COLUMN IF NOT EXISTS open_new_tab BOOLEAN DEFAULT false;
ALTER TABLE public.banners ADD COLUMN IF NOT EXISTS image_url TEXT;
ALTER TABLE public.banners ADD COLUMN IF NOT EXISTS bg_color_1 TEXT DEFAULT '#111827';
ALTER TABLE public.banners ADD COLUMN IF NOT EXISTS bg_color_2 TEXT DEFAULT '#000000';
ALTER TABLE public.banners ADD COLUMN IF NOT EXISTS location TEXT DEFAULT 'home';
ALTER TABLE public.banners ADD COLUMN IF NOT EXISTS display_order INT DEFAULT 1;
ALTER TABLE public.banners ADD COLUMN IF NOT EXISTS position INT DEFAULT 1;
ALTER TABLE public.banners ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT true;
ALTER TABLE public.banners ADD COLUMN IF NOT EXISTS visible BOOLEAN DEFAULT true;
ALTER TABLE public.banners ADD COLUMN IF NOT EXISTS created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now());
ALTER TABLE public.banners ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now());

-- ── 2. HOME SECTIONS (BOX ORDERING & CONTROLS) ────────────────────────────────
CREATE TABLE IF NOT EXISTS public.home_sections (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    box_key TEXT UNIQUE,
    title TEXT,
    subtitle TEXT,
    badge_text TEXT,
    section_type TEXT DEFAULT 'FEATURED_DEALS',
    category_filter TEXT,
    product_limit INT DEFAULT 8,
    view_all_link TEXT DEFAULT '/offers',
    display_order INT DEFAULT 1,
    position INT DEFAULT 1,
    is_active BOOLEAN DEFAULT true,
    visible BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now())
);

ALTER TABLE public.home_sections ADD COLUMN IF NOT EXISTS box_key TEXT;
ALTER TABLE public.home_sections ADD COLUMN IF NOT EXISTS title TEXT;
ALTER TABLE public.home_sections ADD COLUMN IF NOT EXISTS subtitle TEXT;
ALTER TABLE public.home_sections ADD COLUMN IF NOT EXISTS badge_text TEXT;
ALTER TABLE public.home_sections ADD COLUMN IF NOT EXISTS section_type TEXT DEFAULT 'FEATURED_DEALS';
ALTER TABLE public.home_sections ADD COLUMN IF NOT EXISTS category_filter TEXT;
ALTER TABLE public.home_sections ADD COLUMN IF NOT EXISTS product_limit INT DEFAULT 8;
ALTER TABLE public.home_sections ADD COLUMN IF NOT EXISTS view_all_link TEXT DEFAULT '/offers';
ALTER TABLE public.home_sections ADD COLUMN IF NOT EXISTS display_order INT DEFAULT 1;
ALTER TABLE public.home_sections ADD COLUMN IF NOT EXISTS position INT DEFAULT 1;
ALTER TABLE public.home_sections ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT true;
ALTER TABLE public.home_sections ADD COLUMN IF NOT EXISTS visible BOOLEAN DEFAULT true;
ALTER TABLE public.home_sections ADD COLUMN IF NOT EXISTS created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now());
ALTER TABLE public.home_sections ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now());

-- ── 3. COUPONS TABLE (IST COMPLIANT & UNIQUE CODES) ───────────────────────────
CREATE TABLE IF NOT EXISTS public.coupons (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code TEXT UNIQUE NOT NULL,
    discount_type TEXT DEFAULT 'percentage',
    discount_value NUMERIC(10,2) NOT NULL DEFAULT 0,
    min_order_amount NUMERIC(10,2) DEFAULT 0,
    max_discount_amount NUMERIC(10,2),
    starts_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now()),
    expires_at TIMESTAMP WITH TIME ZONE,
    usage_limit INT,
    usage_count INT DEFAULT 0,
    applicable_categories TEXT[] DEFAULT ARRAY[]::TEXT[],
    applicable_products TEXT[] DEFAULT ARRAY[]::TEXT[],
    is_active BOOLEAN DEFAULT true,
    enabled BOOLEAN DEFAULT true,
    status TEXT DEFAULT 'ACTIVE',
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now())
);

ALTER TABLE public.coupons ADD COLUMN IF NOT EXISTS code TEXT;
ALTER TABLE public.coupons ADD COLUMN IF NOT EXISTS discount_type TEXT DEFAULT 'percentage';
ALTER TABLE public.coupons ADD COLUMN IF NOT EXISTS discount_value NUMERIC(10,2) DEFAULT 0;
ALTER TABLE public.coupons ADD COLUMN IF NOT EXISTS min_order_amount NUMERIC(10,2) DEFAULT 0;
ALTER TABLE public.coupons ADD COLUMN IF NOT EXISTS max_discount_amount NUMERIC(10,2);
ALTER TABLE public.coupons ADD COLUMN IF NOT EXISTS starts_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now());
ALTER TABLE public.coupons ADD COLUMN IF NOT EXISTS expires_at TIMESTAMP WITH TIME ZONE;
ALTER TABLE public.coupons ADD COLUMN IF NOT EXISTS usage_limit INT;
ALTER TABLE public.coupons ADD COLUMN IF NOT EXISTS usage_count INT DEFAULT 0;
ALTER TABLE public.coupons ADD COLUMN IF NOT EXISTS applicable_categories TEXT[] DEFAULT ARRAY[]::TEXT[];
ALTER TABLE public.coupons ADD COLUMN IF NOT EXISTS applicable_products TEXT[] DEFAULT ARRAY[]::TEXT[];
ALTER TABLE public.coupons ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT true;
ALTER TABLE public.coupons ADD COLUMN IF NOT EXISTS enabled BOOLEAN DEFAULT true;
ALTER TABLE public.coupons ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'ACTIVE';
ALTER TABLE public.coupons ADD COLUMN IF NOT EXISTS notes TEXT;
ALTER TABLE public.coupons ADD COLUMN IF NOT EXISTS created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now());
ALTER TABLE public.coupons ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now());

-- Ensure unique code constraint
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'coupons_code_unique'
    ) THEN
        ALTER TABLE public.coupons ADD CONSTRAINT coupons_code_unique UNIQUE (code);
    END IF;
EXCEPTION WHEN OTHERS THEN
    NULL;
END $$;

-- ── 4. ORDERS TABLE (Razorpay & Checkout Support) ──────────────────────────────
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

-- ── 5. ORDER ITEMS TABLE ───────────────────────────────────────────────────────
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

-- ── 6. BADGES, THEMES, MEDIA, SITE SETTINGS TABLES ────────────────────────────
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

CREATE TABLE IF NOT EXISTS public.site_settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    setting_key TEXT UNIQUE NOT NULL,
    setting_value JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now())
);

-- Ensure display_order exists across all dynamic CMS tables
DO $$
BEGIN
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

-- ── 7. RLS POLICIES & PERMISSIONS ─────────────────────────────────────────────
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

ALTER TABLE public.banners ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public Read Banners" ON public.banners;
DROP POLICY IF EXISTS "Public Write Banners" ON public.banners;
CREATE POLICY "Public Read Banners" ON public.banners FOR SELECT USING (true);
CREATE POLICY "Public Write Banners" ON public.banners FOR ALL USING (true) WITH CHECK (true);

ALTER TABLE public.home_sections ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public Read Home Sections" ON public.home_sections;
DROP POLICY IF EXISTS "Public Write Home Sections" ON public.home_sections;
CREATE POLICY "Public Read Home Sections" ON public.home_sections FOR SELECT USING (true);
CREATE POLICY "Public Write Home Sections" ON public.home_sections FOR ALL USING (true) WITH CHECK (true);

ALTER TABLE public.coupons ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public Read Coupons" ON public.coupons;
DROP POLICY IF EXISTS "Public Write Coupons" ON public.coupons;
CREATE POLICY "Public Read Coupons" ON public.coupons FOR SELECT USING (true);
CREATE POLICY "Public Write Coupons" ON public.coupons FOR ALL USING (true) WITH CHECK (true);

ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public Read Settings" ON public.site_settings;
DROP POLICY IF EXISTS "Public Write Settings" ON public.site_settings;
CREATE POLICY "Public Read Settings" ON public.site_settings FOR SELECT USING (true);
CREATE POLICY "Public Write Settings" ON public.site_settings FOR ALL USING (true) WITH CHECK (true);

GRANT ALL ON public.orders TO anon, authenticated, service_role;
GRANT ALL ON public.order_items TO anon, authenticated, service_role;
GRANT ALL ON public.banners TO anon, authenticated, service_role;
GRANT ALL ON public.home_sections TO anon, authenticated, service_role;
GRANT ALL ON public.coupons TO anon, authenticated, service_role;
GRANT ALL ON public.badges TO anon, authenticated, service_role;
GRANT ALL ON public.themes TO anon, authenticated, service_role;
GRANT ALL ON public.media TO anon, authenticated, service_role;
GRANT ALL ON public.site_settings TO anon, authenticated, service_role;

-- ── 8. SUPABASE REALTIME REPLICATION ──────────────────────────────────────────
DO $$
DECLARE
  tbl TEXT;
  tbls TEXT[] := ARRAY[
    'orders', 'order_items', 'products', 'banners', 'categories', 
    'badges', 'themes', 'media', 'homepage_steps', 'home_sections', 
    'footer_links', 'offer_items', 'offer_slides', 'offer_categories', 
    'product_batches', 'site_settings', 'contact_details', 'cart_settings',
    'coupons'
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
      NULL;
    END;
  END LOOP;
END $$;

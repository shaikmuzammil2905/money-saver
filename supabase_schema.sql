-- ==============================================================================
-- 🚀 OTTMONEYSAVER — COMPLETE DATABASE SCHEMA & REALTIME SYNC (LATEST UPDATE)
-- ==============================================================================
-- Instructions:
-- 1. Open your Supabase Dashboard: https://supabase.com/dashboard
-- 2. Select your Project -> Click "SQL Editor" on the left menu.
-- 3. Create a "New Query", paste this ENTIRE script, and click "Run".
-- ==============================================================================

-- 1. Enable Required Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ==============================================================================
-- 2. ADMIN PROFILES & AUTHENTICATION TABLE
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.admin_profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID UNIQUE,
    email TEXT UNIQUE NOT NULL,
    role TEXT DEFAULT 'admin',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now())
);

-- Insert/Upsert Primary Admin Email
INSERT INTO public.admin_profiles (email, role)
VALUES ('fixyourmobiles7@gmail.com', 'admin')
ON CONFLICT (email) DO NOTHING;

-- Admin Password Reset Tokens Table
CREATE TABLE IF NOT EXISTS public.admin_password_resets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email TEXT NOT NULL,
    token_hash TEXT NOT NULL,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    used BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now())
);
CREATE INDEX IF NOT EXISTS idx_admin_resets_hash ON public.admin_password_resets(token_hash);

-- ==============================================================================
-- 3. PRODUCTS TABLE (FULL ATTRIBUTES & CATALOG)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
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
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now())
);

-- Safely add missing columns to products table if it already existed
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS slug_id TEXT;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS description_points JSONB DEFAULT '[]'::jsonb;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS custom_info JSONB DEFAULT '["Instant Activation", "WhatsApp Support Available", "Payment via UPI"]'::jsonb;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS badges JSONB DEFAULT '[]'::jsonb;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS batches JSONB DEFAULT '[]'::jsonb;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS sections JSONB DEFAULT '["Home", "All OTTs"]'::jsonb;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS home_order INT DEFAULT 1;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS offers_order INT DEFAULT 1;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS all_otts_order INT DEFAULT 1;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS display_order INT DEFAULT 1;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT true;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now());

-- ==============================================================================
-- 4. BANNERS TABLE (HERO & PROMO BANNERS)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.banners (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    banner_key TEXT UNIQUE,
    title_name TEXT,
    heading TEXT NOT NULL,
    subheading TEXT,
    description TEXT,
    button_text TEXT,
    button_link TEXT,
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
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now())
);

ALTER TABLE public.banners ADD COLUMN IF NOT EXISTS buttons JSONB DEFAULT '[]'::jsonb;
ALTER TABLE public.banners ADD COLUMN IF NOT EXISTS badges JSONB DEFAULT '[]'::jsonb;
ALTER TABLE public.banners ADD COLUMN IF NOT EXISTS display_order INT DEFAULT 1;
ALTER TABLE public.banners ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now());

-- ==============================================================================
-- 5. CATEGORIES TABLE
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    slug TEXT UNIQUE,
    icon TEXT,
    image_url TEXT,
    group_name TEXT,
    display_order INT DEFAULT 1,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now())
);

ALTER TABLE public.categories ADD COLUMN IF NOT EXISTS display_order INT DEFAULT 1;
ALTER TABLE public.categories ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now());

-- ==============================================================================
-- 6. BADGES TABLE
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.badges (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    text TEXT,
    bg_color TEXT DEFAULT '#e50914',
    text_color TEXT DEFAULT '#ffffff',
    position TEXT DEFAULT 'top-right',
    display_order INT DEFAULT 1,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now())
);

ALTER TABLE public.badges ADD COLUMN IF NOT EXISTS display_order INT DEFAULT 1;
ALTER TABLE public.badges ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now());

-- ==============================================================================
-- 7. THEMES TABLE (VISUAL BUILDER)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.themes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    theme_key TEXT UNIQUE,
    description TEXT,
    layout_data JSONB DEFAULT '[]'::jsonb,
    styles JSONB DEFAULT '{}'::jsonb,
    display_order INT DEFAULT 1,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now())
);

ALTER TABLE public.themes ADD COLUMN IF NOT EXISTS display_order INT DEFAULT 1;
ALTER TABLE public.themes ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now());

-- ==============================================================================
-- 8. HOME SECTIONS (DYNAMIC HOMEPAGE LAYOUT BUILDER)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.home_sections (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    box_key TEXT UNIQUE,
    title_label TEXT,
    section_type TEXT NOT NULL,
    content_id TEXT,
    settings JSONB DEFAULT '{}'::jsonb,
    position INT DEFAULT 1,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now())
);

ALTER TABLE public.home_sections ADD COLUMN IF NOT EXISTS position INT DEFAULT 1;
ALTER TABLE public.home_sections ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT true;
ALTER TABLE public.home_sections ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now());

-- ==============================================================================
-- 9. HOMEPAGE STEPS ("HOW TO ORDER" GUIDE)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.homepage_steps (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    step_number INT NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    icon_name TEXT,
    image_url TEXT,
    display_order INT DEFAULT 1,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now())
);

ALTER TABLE public.homepage_steps ADD COLUMN IF NOT EXISTS display_order INT DEFAULT 1;
ALTER TABLE public.homepage_steps ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now());

-- ==============================================================================
-- 10. OFFERS & PROMOTIONS (ITEMS, SLIDES, CATEGORIES)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.offer_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    description TEXT,
    original_price DECIMAL(10,2),
    offer_price DECIMAL(10,2) NOT NULL,
    discount TEXT,
    image TEXT,
    category TEXT,
    offer_badge TEXT,
    availability TEXT DEFAULT 'In Stock',
    display_order INT DEFAULT 1,
    show_on_home BOOLEAN DEFAULT true,
    show_on_explorer BOOLEAN DEFAULT true,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now())
);

CREATE TABLE IF NOT EXISTS public.offer_slides (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    heading TEXT NOT NULL,
    description TEXT,
    button_text TEXT,
    button_link TEXT,
    image_url TEXT,
    display_order INT DEFAULT 1,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now())
);

CREATE TABLE IF NOT EXISTS public.offer_categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    heading TEXT,
    description TEXT,
    image_url TEXT,
    display_order INT DEFAULT 1,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now())
);

ALTER TABLE public.offer_items ADD COLUMN IF NOT EXISTS display_order INT DEFAULT 1;
ALTER TABLE public.offer_items ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now());
ALTER TABLE public.offer_slides ADD COLUMN IF NOT EXISTS display_order INT DEFAULT 1;
ALTER TABLE public.offer_slides ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now());

-- ==============================================================================
-- 11. FOOTER LINKS & PRODUCT BATCHES
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.footer_links (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    section_name TEXT NOT NULL,
    heading TEXT,
    link_text TEXT NOT NULL,
    link_url TEXT NOT NULL,
    display_order INT DEFAULT 1,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now())
);

CREATE TABLE IF NOT EXISTS public.product_batches (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    slug TEXT UNIQUE,
    display_order INT DEFAULT 1,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now())
);

ALTER TABLE public.footer_links ADD COLUMN IF NOT EXISTS display_order INT DEFAULT 1;
ALTER TABLE public.footer_links ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now());
ALTER TABLE public.product_batches ADD COLUMN IF NOT EXISTS display_order INT DEFAULT 1;
ALTER TABLE public.product_batches ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now());

-- ==============================================================================
-- 12. MEDIA LIBRARY TABLE
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.media (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    file_name TEXT,
    file_url TEXT NOT NULL,
    public_id TEXT,
    file_size BIGINT,
    file_type TEXT,
    category TEXT DEFAULT 'general',
    display_order INT DEFAULT 1,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now())
);

ALTER TABLE public.media ADD COLUMN IF NOT EXISTS display_order INT DEFAULT 1;
ALTER TABLE public.media ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now());

-- ==============================================================================
-- 13. SITE SETTINGS & CONFIGURATIONS (KEY-VALUE CMS STORE)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.site_settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    key TEXT UNIQUE NOT NULL,
    value JSONB NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now())
);

CREATE TABLE IF NOT EXISTS public.cart_settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    gpay_link TEXT,
    phonepe_link TEXT,
    upi_id TEXT,
    whatsapp_number TEXT,
    whatsapp_number_secondary TEXT,
    phone_number TEXT,
    phone_number_secondary TEXT,
    business_location TEXT,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now())
);

CREATE TABLE IF NOT EXISTS public.contact_details (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    business_name TEXT,
    phone TEXT,
    secondary_phone TEXT,
    whatsapp TEXT,
    secondary_whatsapp TEXT,
    email TEXT,
    address TEXT,
    city TEXT,
    state TEXT,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now())
);

CREATE TABLE IF NOT EXISTS public.whatsapp_templates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    template_key TEXT UNIQUE,
    template_text TEXT NOT NULL,
    available_variables JSONB DEFAULT '[]'::jsonb,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now())
);

-- ==============================================================================
-- 14. CUSTOMERS & USERS TABLE
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    full_name TEXT,
    mobile_number TEXT UNIQUE,
    email TEXT UNIQUE,
    location TEXT,
    is_active BOOLEAN DEFAULT true,
    display_order INT DEFAULT 1,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now())
);

ALTER TABLE public.users ADD COLUMN IF NOT EXISTS display_order INT DEFAULT 1;
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now());

-- ==============================================================================
-- 15. ORDERS & ORDER ITEMS TABLES
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id TEXT UNIQUE NOT NULL,
    customer_name TEXT,
    mobile_number TEXT,
    location TEXT,
    subtotal DECIMAL(10,2),
    total_amount DECIMAL(10,2) NOT NULL,
    payment_status TEXT DEFAULT 'Payment Verification Pending',
    payment_screenshot_url TEXT,
    order_status TEXT DEFAULT 'New',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now())
);

CREATE TABLE IF NOT EXISTS public.order_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id TEXT REFERENCES public.orders(order_id) ON DELETE CASCADE,
    product_id TEXT,
    title TEXT NOT NULL,
    subtitle TEXT,
    unit_price DECIMAL(10,2) NOT NULL,
    quantity INT DEFAULT 1,
    total_price DECIMAL(10,2) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now())
);

-- ==============================================================================
-- 16. COUPONS & DISCOUNTS TABLE
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.coupons (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code TEXT UNIQUE NOT NULL,
    discount_type TEXT DEFAULT 'fixed',
    discount_value DECIMAL(10,2) NOT NULL,
    min_order_amount DECIMAL(10,2) DEFAULT 0,
    duration_value INT DEFAULT 30,
    duration_unit TEXT DEFAULT 'Days',
    expires_at TIMESTAMP WITH TIME ZONE,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now())
);

-- ==============================================================================
-- 17. ACTIVITY LOGS & ANALYTICS
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.activity_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    admin_email TEXT,
    action TEXT,
    section TEXT,
    item_name TEXT,
    details JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now())
);

CREATE TABLE IF NOT EXISTS public.analytics_visits (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    path TEXT,
    referrer TEXT,
    user_agent TEXT,
    ip_address TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now())
);

-- ==============================================================================
-- 18. ROW LEVEL SECURITY (RLS) POLICIES ON ALL TABLES
-- ==============================================================================
DO $$
DECLARE
  tbl TEXT;
  tbls TEXT[] := ARRAY[
    'admin_profiles', 'admin_password_resets', 'products', 'banners', 'categories', 'badges', 'themes',
    'home_sections', 'homepage_steps', 'offer_items', 'offer_slides', 'offer_categories',
    'footer_links', 'product_batches', 'media', 'site_settings', 'cart_settings',
    'contact_details', 'whatsapp_templates', 'users', 'orders', 'order_items',
    'coupons', 'activity_logs', 'analytics_visits'
  ];
BEGIN
  FOREACH tbl IN ARRAY tbls LOOP
    BEGIN
      EXECUTE 'ALTER TABLE public.' || tbl || ' ENABLE ROW LEVEL SECURITY;';
      EXECUTE 'DROP POLICY IF EXISTS "Public Read ' || tbl || '" ON public.' || tbl || ';';
      EXECUTE 'DROP POLICY IF EXISTS "Admin Write ' || tbl || '" ON public.' || tbl || ';';
      EXECUTE 'CREATE POLICY "Public Read ' || tbl || '" ON public.' || tbl || ' FOR SELECT USING (true);';
      EXECUTE 'CREATE POLICY "Admin Write ' || tbl || '" ON public.' || tbl || ' FOR ALL USING (true) WITH CHECK (true);';
    EXCEPTION WHEN others THEN
      RAISE NOTICE 'Skipping policy on %: %', tbl, SQLERRM;
    END;
  END LOOP;
END $$;

-- ==============================================================================
-- 19. REALTIME PUBLICATION (INSTANT SYNC TO FRONTEND)
-- ==============================================================================
DO $$
DECLARE
  tbl TEXT;
  tbls TEXT[] := ARRAY[
    'admin_password_resets', 'products', 'banners', 'categories', 'badges', 'themes',
    'home_sections', 'homepage_steps', 'offer_items', 'offer_slides', 'offer_categories',
    'footer_links', 'product_batches', 'media', 'site_settings', 'cart_settings',
    'contact_details', 'whatsapp_templates', 'users', 'orders', 'order_items', 'coupons'
  ];
BEGIN
  FOREACH tbl IN ARRAY tbls LOOP
    BEGIN
      IF NOT EXISTS (
        SELECT 1 FROM pg_publication_tables
        WHERE pubname = 'supabase_realtime' AND tablename = tbl
      ) THEN
        EXECUTE 'ALTER PUBLICATION supabase_realtime ADD TABLE public.' || tbl;
        RAISE NOTICE 'Added % to supabase_realtime', tbl;
      END IF;
    EXCEPTION WHEN others THEN
      RAISE NOTICE 'Skipping realtime on %: %', tbl, SQLERRM;
    END;
  END LOOP;
END $$;

-- ==============================================================================
-- 20. GRANT TABLE PERMISSIONS TO ANON, AUTHENTICATED & SERVICE ROLES
-- ==============================================================================
DO $$
DECLARE
  tbl TEXT;
  tbls TEXT[] := ARRAY[
    'admin_profiles', 'admin_password_resets', 'products', 'banners', 'categories', 'badges', 'themes',
    'home_sections', 'homepage_steps', 'offer_items', 'offer_slides', 'offer_categories',
    'footer_links', 'product_batches', 'media', 'site_settings', 'cart_settings',
    'contact_details', 'whatsapp_templates', 'users', 'orders', 'order_items',
    'coupons', 'activity_logs', 'analytics_visits'
  ];
BEGIN
  FOREACH tbl IN ARRAY tbls LOOP
    BEGIN
      EXECUTE 'GRANT ALL ON public.' || tbl || ' TO anon;';
      EXECUTE 'GRANT ALL ON public.' || tbl || ' TO authenticated;';
      EXECUTE 'GRANT ALL ON public.' || tbl || ' TO service_role;';
    EXCEPTION WHEN others THEN
      RAISE NOTICE 'Skipping grant on %: %', tbl, SQLERRM;
    END;
  END LOOP;
END $$;

-- ==============================================================================
-- 🎉 COMPLETED: All tables, columns, RLS policies, and realtime sync are configured!
-- ==============================================================================

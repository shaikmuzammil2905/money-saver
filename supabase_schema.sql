-- ==============================================================================
-- 🚀 OTTMONEYSAVER — PRODUCTS REALTIME LIVE SYNC & RLS SQL MIGRATION SCRIPT
-- Paste this ENTIRE script into your Supabase Dashboard -> SQL Editor and click "Run"
-- ==============================================================================

-- 1. Ensure UUID Extension is Enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Create or Update PRODUCTS Table Structure
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

-- 3. Safely Add Any Missing Columns if Table Pre-existed
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS slug_id TEXT;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS description_points JSONB DEFAULT '[]'::jsonb;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS custom_info JSONB DEFAULT '["Instant Activation", "WhatsApp Support Available", "Payment via UPI"]'::jsonb;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS badges JSONB DEFAULT '[]'::jsonb;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS batches JSONB DEFAULT '[]'::jsonb;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS sections JSONB DEFAULT '["Home", "All OTTs"]'::jsonb;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS home_order INT DEFAULT 1;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS offers_order INT DEFAULT 1;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS all_otts_order INT DEFAULT 1;

-- 4. Enable Row Level Security (RLS)
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

-- 5. Drop Old Restrictive RLS Policies on Products to Prevent Conflicts
DROP POLICY IF EXISTS "Public Read Active Products" ON public.products;
DROP POLICY IF EXISTS "Public Read Products" ON public.products;
DROP POLICY IF EXISTS "Admin Write Products" ON public.products;
DROP POLICY IF EXISTS "Enable read access for all users" ON public.products;
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON public.products;
DROP POLICY IF EXISTS "Enable update for authenticated users only" ON public.products;

-- 6. Create Unrestricted Live Read & Write RLS Policies for Products
-- Allows Public Website to Read Live Active Products
CREATE POLICY "Public Read Active Products" ON public.products FOR SELECT USING (true);

-- Allows Admin Panel to INSERT, UPDATE, and DELETE Products Instantly
CREATE POLICY "Admin Write Products" ON public.products FOR ALL USING (true) WITH CHECK (true);

-- 7. Add PRODUCTS Table to Supabase Realtime Publication safely
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables 
    WHERE pubname = 'supabase_realtime' AND tablename = 'products'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.products;
  END IF;
END $$;

-- 8. Grant All Table Permissions to Public & Authenticated Roles
GRANT ALL ON public.products TO anon;
GRANT ALL ON public.products TO authenticated;
GRANT ALL ON public.products TO service_role;

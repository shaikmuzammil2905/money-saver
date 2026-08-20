-- ==============================================================================
-- 🔧 OTTMONEYSAVER — FIX MISSING COLUMNS & ENABLE REALTIME SYNC
-- Paste this ENTIRE script into Supabase Dashboard -> SQL Editor and click Run
-- This fixes: "column X.display_order does not exist" errors
-- This ensures: Admin changes reflect instantly on main website
-- ==============================================================================

-- ── BADGES TABLE ──────────────────────────────────────────────────────────────
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
ALTER TABLE public.badges ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public Read Badges" ON public.badges;
DROP POLICY IF EXISTS "Admin Write Badges" ON public.badges;
CREATE POLICY "Public Read Badges" ON public.badges FOR SELECT USING (true);
CREATE POLICY "Admin Write Badges" ON public.badges FOR ALL USING (true) WITH CHECK (true);
GRANT ALL ON public.badges TO anon;
GRANT ALL ON public.badges TO authenticated;
GRANT ALL ON public.badges TO service_role;

-- ── THEMES TABLE ──────────────────────────────────────────────────────────────
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
ALTER TABLE public.themes ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public Read Themes" ON public.themes;
DROP POLICY IF EXISTS "Admin Write Themes" ON public.themes;
CREATE POLICY "Public Read Themes" ON public.themes FOR SELECT USING (true);
CREATE POLICY "Admin Write Themes" ON public.themes FOR ALL USING (true) WITH CHECK (true);
GRANT ALL ON public.themes TO anon;
GRANT ALL ON public.themes TO authenticated;
GRANT ALL ON public.themes TO service_role;

-- ── USERS TABLE ───────────────────────────────────────────────────────────────
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS display_order INT DEFAULT 1;
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now());

-- ── MEDIA TABLE ───────────────────────────────────────────────────────────────
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
ALTER TABLE public.media ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public Read Media" ON public.media;
DROP POLICY IF EXISTS "Admin Write Media" ON public.media;
CREATE POLICY "Public Read Media" ON public.media FOR SELECT USING (true);
CREATE POLICY "Admin Write Media" ON public.media FOR ALL USING (true) WITH CHECK (true);
GRANT ALL ON public.media TO anon;
GRANT ALL ON public.media TO authenticated;
GRANT ALL ON public.media TO service_role;

-- ── BANNERS TABLE ─────────────────────────────────────────────────────────────
ALTER TABLE public.banners ADD COLUMN IF NOT EXISTS display_order INT DEFAULT 1;
ALTER TABLE public.banners ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now());

-- ── CATEGORIES TABLE ──────────────────────────────────────────────────────────
ALTER TABLE public.categories ADD COLUMN IF NOT EXISTS display_order INT DEFAULT 1;
ALTER TABLE public.categories ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now());

-- ── HOMEPAGE_STEPS TABLE ──────────────────────────────────────────────────────
ALTER TABLE public.homepage_steps ADD COLUMN IF NOT EXISTS display_order INT DEFAULT 1;
ALTER TABLE public.homepage_steps ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now());

-- ── OFFER_ITEMS TABLE ─────────────────────────────────────────────────────────
ALTER TABLE public.offer_items ADD COLUMN IF NOT EXISTS display_order INT DEFAULT 1;
ALTER TABLE public.offer_items ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now());

-- ── OFFER_SLIDES TABLE ────────────────────────────────────────────────────────
ALTER TABLE public.offer_slides ADD COLUMN IF NOT EXISTS display_order INT DEFAULT 1;
ALTER TABLE public.offer_slides ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now());

-- ── FOOTER_LINKS TABLE ────────────────────────────────────────────────────────
ALTER TABLE public.footer_links ADD COLUMN IF NOT EXISTS display_order INT DEFAULT 1;
ALTER TABLE public.footer_links ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now());

-- ── PRODUCT_BATCHES TABLE ─────────────────────────────────────────────────────
ALTER TABLE public.product_batches ADD COLUMN IF NOT EXISTS display_order INT DEFAULT 1;
ALTER TABLE public.product_batches ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now());

-- ==============================================================================
-- ENABLE REALTIME ON ALL CMS TABLES
-- This makes admin changes appear instantly on the main website
-- ==============================================================================
DO $$
DECLARE
  tbl TEXT;
  tbls TEXT[] := ARRAY[
    'products', 'banners', 'categories', 'badges', 'themes',
    'media', 'homepage_steps', 'home_sections', 'footer_links',
    'offer_items', 'offer_slides', 'offer_categories', 'product_batches',
    'site_settings', 'contact_details', 'cart_settings', 'whatsapp_templates'
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
      RAISE NOTICE 'Skipping % - table may not exist yet: %', tbl, SQLERRM;
    END;
  END LOOP;
END $$;

-- ==============================================================================
-- SUCCESS: Run this script once to fix all column errors
-- Admin panel changes will now reflect on main website in real-time
-- ==============================================================================

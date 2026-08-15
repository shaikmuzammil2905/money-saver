-- OTTMoneySaver Master Database Schema & RLS Security Script
-- Supabase PostgreSQL Script for Admin Panel CMS + Public Website

-- Enable UUID extension
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
    banner_key TEXT UNIQUE NOT NULL, -- 'home_main_1', 'home_main_2', 'home_small_1', 'home_small_2', 'home_small_3', 'home_middle_big', 'home_bottom_small', 'offers_top'
    title_name TEXT NOT NULL,
    heading TEXT,
    subheading TEXT,
    description TEXT,
    button_text TEXT DEFAULT 'Shop Now',
    button_link TEXT DEFAULT '/all-otts',
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

-- Legacy Compatibility View/Table for Homepage Slides
CREATE TABLE IF NOT EXISTS public.homepage_slides (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    slide_key TEXT UNIQUE DEFAULT 'second_slide',
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

-- 7. PRODUCT BATCHES / GROUPS (Best Seller, Trending, Top Picks, etc.)
CREATE TABLE IF NOT EXISTS public.product_batches (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    display_order INT DEFAULT 1,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 8. PRODUCTS (Full Schema with Multi-Section Assignment & Per-Section Orders)
CREATE TABLE IF NOT EXISTS public.products (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    slug_id TEXT UNIQUE,
    title TEXT NOT NULL,
    subtitle TEXT,
    description TEXT,
    description_points JSONB DEFAULT '[]'::jsonb, -- Array of vertical points
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
    badges JSONB DEFAULT '[]'::jsonb, -- Assigned badges array
    batches JSONB DEFAULT '[]'::jsonb, -- Assigned batches array
    sections JSONB DEFAULT '["Home", "All OTTs"]'::jsonb, -- 'Home', 'Offers', 'All OTTs'
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

-- 10. EASY 10 STEP GUIDE
CREATE TABLE IF NOT EXISTS public.homepage_steps (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    step_number INT NOT NULL,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    icon_name TEXT DEFAULT 'HelpCircle',
    image_url TEXT,
    display_order INT DEFAULT 1,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 11. CONTACT DETAILS
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

-- 12. FOOTER LINKS
CREATE TABLE IF NOT EXISTS public.footer_links (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    section_name TEXT NOT NULL,
    heading TEXT,
    link_text TEXT NOT NULL,
    link_url TEXT NOT NULL,
    display_order INT DEFAULT 1,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 13. CART SETTINGS & WHATSAPP TEMPLATES
CREATE TABLE IF NOT EXISTS public.cart_settings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    gpay_link TEXT DEFAULT 'upi://pay?pa=6305151531@ybl&pn=OTTMoneySaver&cu=INR',
    phonepe_link TEXT DEFAULT 'upi://pay?pa=6305151531@ybl&pn=OTTMoneySaver&cu=INR',
    upi_id TEXT DEFAULT '6305151531@ybl',
    whatsapp_number TEXT DEFAULT '916305151531',
    whatsapp_number_secondary TEXT DEFAULT '917013931261',
    phone_number TEXT DEFAULT '6305151531',
    phone_number_secondary TEXT DEFAULT '7013931261',
    business_location TEXT DEFAULT 'Hyderabad, Telangana, India',
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

CREATE TABLE IF NOT EXISTS public.whatsapp_templates (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    template_key TEXT UNIQUE DEFAULT 'order_checkout',
    template_text TEXT NOT NULL,
    available_variables JSONB DEFAULT '["{PRODUCTS}", "{CUSTOMER_NAME}", "{CUSTOMER_PHONE}", "{CUSTOMER_LOCATION}", "{CUSTOMER_EMAIL}", "{TOTAL}", "{ORDER_ID}", "{PAYMENT_SCREENSHOT}"]'::jsonb,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 14. MEDIA LIBRARY
CREATE TABLE IF NOT EXISTS public.media (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    file_name TEXT NOT NULL,
    file_url TEXT NOT NULL,
    public_id TEXT,
    file_size INT,
    file_type TEXT,
    category TEXT DEFAULT 'general',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 15. ACTIVITY LOGS
CREATE TABLE IF NOT EXISTS public.activity_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    admin_email TEXT NOT NULL,
    action TEXT NOT NULL,
    section TEXT NOT NULL,
    item_name TEXT,
    details JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 16. USERS / MEMBERS
CREATE TABLE IF NOT EXISTS public.users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    full_name TEXT NOT NULL,
    mobile_number TEXT UNIQUE NOT NULL,
    email TEXT UNIQUE,
    location TEXT,
    account_status TEXT DEFAULT 'Active', -- 'Active', 'Disabled'
    registration_date TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
    last_active TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 17. ORDERS & ORDER ITEMS
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

-- 18. WEBSITE VISITOR ANALYTICS
CREATE TABLE IF NOT EXISTS public.analytics_visits (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    session_id TEXT NOT NULL,
    path TEXT NOT NULL,
    device_type TEXT DEFAULT 'desktop', -- 'mobile', 'desktop', 'tablet'
    referrer TEXT,
    visited_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- ==================================================
-- RLS POLICIES
-- ==================================================
ALTER TABLE public.admin_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.banners ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.homepage_slides ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.homepage_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.badges ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_batches ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.offer_slides ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.offer_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.homepage_steps ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_details ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.footer_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cart_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.whatsapp_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.media ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activity_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.analytics_visits ENABLE ROW LEVEL SECURITY;

-- PUBLIC READ POLICIES
CREATE POLICY "Public Read Site Settings" ON public.site_settings FOR SELECT USING (true);
CREATE POLICY "Public Read Banners" ON public.banners FOR SELECT USING (is_active = true);
CREATE POLICY "Public Read Active Products" ON public.products FOR SELECT USING (is_active = true);
CREATE POLICY "Public Read Active Categories" ON public.categories FOR SELECT USING (is_active = true);
CREATE POLICY "Public Read Active Badges" ON public.badges FOR SELECT USING (is_active = true);
CREATE POLICY "Public Read Active Batches" ON public.product_batches FOR SELECT USING (is_active = true);
CREATE POLICY "Public Read Active Offer Items" ON public.offer_items FOR SELECT USING (is_active = true);
CREATE POLICY "Public Read Contact Details" ON public.contact_details FOR SELECT USING (true);
CREATE POLICY "Public Read Cart Settings" ON public.cart_settings FOR SELECT USING (true);

-- PUBLIC INSERT POLICIES
CREATE POLICY "Public Insert Orders" ON public.orders FOR INSERT WITH CHECK (true);
CREATE POLICY "Public Insert Order Items" ON public.order_items FOR INSERT WITH CHECK (true);
CREATE POLICY "Public Insert Users" ON public.users FOR INSERT WITH CHECK (true);
CREATE POLICY "Public Insert Analytics Visits" ON public.analytics_visits FOR INSERT WITH CHECK (true);

-- ALL ACCESS POLICIES (Supabase client full operational access)
CREATE POLICY "Full Access Banners" ON public.banners FOR ALL USING (true);
CREATE POLICY "Full Access Products" ON public.products FOR ALL USING (true);
CREATE POLICY "Full Access Categories" ON public.categories FOR ALL USING (true);
CREATE POLICY "Full Access Badges" ON public.badges FOR ALL USING (true);
CREATE POLICY "Full Access Batches" ON public.product_batches FOR ALL USING (true);
CREATE POLICY "Full Access Site Settings" ON public.site_settings FOR ALL USING (true);
CREATE POLICY "Full Access Users" ON public.users FOR ALL USING (true);

-- REALTIME PUBLICATION
ALTER PUBLICATION supabase_realtime ADD TABLE public.banners;
ALTER PUBLICATION supabase_realtime ADD TABLE public.products;
ALTER PUBLICATION supabase_realtime ADD TABLE public.categories;
ALTER PUBLICATION supabase_realtime ADD TABLE public.badges;
ALTER PUBLICATION supabase_realtime ADD TABLE public.product_batches;
ALTER PUBLICATION supabase_realtime ADD TABLE public.site_settings;
ALTER PUBLICATION supabase_realtime ADD TABLE public.offer_items;

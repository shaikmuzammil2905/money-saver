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

-- 2. SITE SETTINGS (Logo, Business Name, Favicon, Meta, Title, etc.)
CREATE TABLE IF NOT EXISTS public.site_settings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    key TEXT UNIQUE NOT NULL,
    value JSONB NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 3. HOMEPAGE SLIDES (2nd Slide, Hero slides)
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

-- 5. HOMEPAGE CATEGORIES & LAYOUT
CREATE TABLE IF NOT EXISTS public.homepage_categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    image_url TEXT,
    link_url TEXT,
    category_slug TEXT,
    columns_count INT DEFAULT 4,
    display_order INT DEFAULT 1,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 6. EASY 10 STEP GUIDE
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

-- 7. CONTACT DETAILS
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

-- 8. FOOTER LINKS
CREATE TABLE IF NOT EXISTS public.footer_links (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    section_name TEXT NOT NULL, -- 'Quick Links', 'Customer Support', 'Contact Us'
    heading TEXT,
    link_text TEXT NOT NULL,
    link_url TEXT NOT NULL,
    display_order INT DEFAULT 1,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 9. CATEGORIES
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

-- 10. PRODUCTS
CREATE TABLE IF NOT EXISTS public.products (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    slug_id TEXT UNIQUE,
    title TEXT NOT NULL,
    subtitle TEXT,
    description TEXT,
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
    in_stock BOOLEAN DEFAULT true,
    is_featured BOOLEAN DEFAULT false,
    display_order INT DEFAULT 1,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 11. OFFERS SLIDES
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

-- 12. OFFER CATEGORIES
CREATE TABLE IF NOT EXISTS public.offer_categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    heading TEXT,
    description TEXT,
    image_url TEXT,
    display_order INT DEFAULT 1,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 13. OFFER ITEMS
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

-- 14. CART SETTINGS (Payment links, WhatsApp numbers)
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

-- 15. WHATSAPP TEMPLATES
CREATE TABLE IF NOT EXISTS public.whatsapp_templates (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    template_key TEXT UNIQUE DEFAULT 'order_checkout',
    template_text TEXT NOT NULL,
    available_variables JSONB DEFAULT '["{PRODUCTS}", "{CUSTOMER_NAME}", "{CUSTOMER_PHONE}", "{CUSTOMER_LOCATION}", "{CUSTOMER_EMAIL}", "{TOTAL}", "{ORDER_ID}", "{PAYMENT_SCREENSHOT}"]'::jsonb,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 16. MEDIA
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

-- 17. ACTIVITY LOGS
CREATE TABLE IF NOT EXISTS public.activity_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    admin_email TEXT NOT NULL,
    action TEXT NOT NULL,
    section TEXT NOT NULL,
    item_name TEXT,
    details JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 18. ORDERS & ORDER ITEMS & USERS
CREATE TABLE IF NOT EXISTS public.users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    full_name TEXT,
    mobile_number TEXT UNIQUE,
    email TEXT UNIQUE,
    location TEXT,
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


-- ==================================================
-- ROW LEVEL SECURITY (RLS) & AUTHORIZATION
-- ==================================================

-- Helper Function to check if current user is Admin
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean AS $$
BEGIN
  IF auth.uid() IS NULL THEN
    RETURN false;
  END IF;
  
  RETURN EXISTS (
    SELECT 1 FROM public.admin_profiles
    WHERE user_id = auth.uid() OR lower(email) = lower(auth.jwt() ->> 'email')
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Enable RLS on all tables
ALTER TABLE public.admin_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.homepage_slides ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.homepage_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.homepage_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.homepage_steps ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_details ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.footer_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.offer_slides ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.offer_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.offer_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cart_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.whatsapp_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.media ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activity_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;

-- PUBLIC READ POLICIES (Allow public reading for active CMS content)
CREATE POLICY "Public Read Active Homepage Slides" ON public.homepage_slides FOR SELECT USING (is_active = true OR public.is_admin());
CREATE POLICY "Public Read Active Homepage Items" ON public.homepage_items FOR SELECT USING (is_active = true OR public.is_admin());
CREATE POLICY "Public Read Active Homepage Categories" ON public.homepage_categories FOR SELECT USING (is_active = true OR public.is_admin());
CREATE POLICY "Public Read Active Homepage Steps" ON public.homepage_steps FOR SELECT USING (is_active = true OR public.is_admin());
CREATE POLICY "Public Read Contact Details" ON public.contact_details FOR SELECT USING (true);
CREATE POLICY "Public Read Active Footer Links" ON public.footer_links FOR SELECT USING (is_active = true OR public.is_admin());
CREATE POLICY "Public Read Active Categories" ON public.categories FOR SELECT USING (is_active = true OR public.is_admin());
CREATE POLICY "Public Read Active Products" ON public.products FOR SELECT USING (is_active = true OR public.is_admin());
CREATE POLICY "Public Read Active Offer Slides" ON public.offer_slides FOR SELECT USING (is_active = true OR public.is_admin());
CREATE POLICY "Public Read Active Offer Categories" ON public.offer_categories FOR SELECT USING (is_active = true OR public.is_admin());
CREATE POLICY "Public Read Active Offer Items" ON public.offer_items FOR SELECT USING (is_active = true OR public.is_admin());
CREATE POLICY "Public Read Cart Settings" ON public.cart_settings FOR SELECT USING (true);
CREATE POLICY "Public Read WhatsApp Templates" ON public.whatsapp_templates FOR SELECT USING (true);
CREATE POLICY "Public Read Site Settings" ON public.site_settings FOR SELECT USING (true);

-- PUBLIC INSERT POLICIES FOR CUSTOMERS
CREATE POLICY "Public Insert Orders" ON public.orders FOR INSERT WITH CHECK (true);
CREATE POLICY "Public Insert Order Items" ON public.order_items FOR INSERT WITH CHECK (true);
CREATE POLICY "Public Insert Users" ON public.users FOR INSERT WITH CHECK (true);

-- ADMIN FULL ACCESS POLICIES (INSERT, UPDATE, DELETE for Admins)
CREATE POLICY "Admin Full Access Admin Profiles" ON public.admin_profiles FOR ALL USING (public.is_admin() OR auth.uid() = user_id);
CREATE POLICY "Admin Full Access Site Settings" ON public.site_settings FOR ALL USING (public.is_admin());
CREATE POLICY "Admin Full Access Homepage Slides" ON public.homepage_slides FOR ALL USING (public.is_admin());
CREATE POLICY "Admin Full Access Homepage Items" ON public.homepage_items FOR ALL USING (public.is_admin());
CREATE POLICY "Admin Full Access Homepage Categories" ON public.homepage_categories FOR ALL USING (public.is_admin());
CREATE POLICY "Admin Full Access Homepage Steps" ON public.homepage_steps FOR ALL USING (public.is_admin());
CREATE POLICY "Admin Full Access Contact Details" ON public.contact_details FOR ALL USING (public.is_admin());
CREATE POLICY "Admin Full Access Footer Links" ON public.footer_links FOR ALL USING (public.is_admin());
CREATE POLICY "Admin Full Access Categories" ON public.categories FOR ALL USING (public.is_admin());
CREATE POLICY "Admin Full Access Products" ON public.products FOR ALL USING (public.is_admin());
CREATE POLICY "Admin Full Access Offer Slides" ON public.offer_slides FOR ALL USING (public.is_admin());
CREATE POLICY "Admin Full Access Offer Categories" ON public.offer_categories FOR ALL USING (public.is_admin());
CREATE POLICY "Admin Full Access Offer Items" ON public.offer_items FOR ALL USING (public.is_admin());
CREATE POLICY "Admin Full Access Cart Settings" ON public.cart_settings FOR ALL USING (public.is_admin());
CREATE POLICY "Admin Full Access WhatsApp Templates" ON public.whatsapp_templates FOR ALL USING (public.is_admin());
CREATE POLICY "Admin Full Access Media" ON public.media FOR ALL USING (public.is_admin());
CREATE POLICY "Admin Full Access Activity Logs" ON public.activity_logs FOR ALL USING (public.is_admin());
CREATE POLICY "Admin Full Access Orders" ON public.orders FOR ALL USING (public.is_admin());
CREATE POLICY "Admin Full Access Order Items" ON public.order_items FOR ALL USING (public.is_admin());
CREATE POLICY "Admin Full Access Users" ON public.users FOR ALL USING (public.is_admin());

-- ENABLE REALTIME ON PUBLIC TABLES
ALTER PUBLICATION supabase_realtime ADD TABLE public.homepage_slides;
ALTER PUBLICATION supabase_realtime ADD TABLE public.homepage_items;
ALTER PUBLICATION supabase_realtime ADD TABLE public.homepage_categories;
ALTER PUBLICATION supabase_realtime ADD TABLE public.homepage_steps;
ALTER PUBLICATION supabase_realtime ADD TABLE public.contact_details;
ALTER PUBLICATION supabase_realtime ADD TABLE public.footer_links;
ALTER PUBLICATION supabase_realtime ADD TABLE public.categories;
ALTER PUBLICATION supabase_realtime ADD TABLE public.products;
ALTER PUBLICATION supabase_realtime ADD TABLE public.offer_slides;
ALTER PUBLICATION supabase_realtime ADD TABLE public.offer_categories;
ALTER PUBLICATION supabase_realtime ADD TABLE public.offer_items;
ALTER PUBLICATION supabase_realtime ADD TABLE public.cart_settings;
ALTER PUBLICATION supabase_realtime ADD TABLE public.whatsapp_templates;
ALTER PUBLICATION supabase_realtime ADD TABLE public.site_settings;

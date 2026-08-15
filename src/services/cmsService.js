// OTTMoneySaver Central CMS Database Service Layer
import { supabase } from './supabase';
import { ALL_PRODUCTS, PRIMARY_CATEGORIES, SHOP_BY_CATEGORIES, VALUE_PROPOSITIONS, FEATURED_DEALS } from '../data/products';
import { DEFAULT_PAYMENT_CONFIG } from '../config/payment';

// ==================================================
// ACTIVITY LOGGING SERVICE
// ==================================================
export async function logActivity(adminEmail, action, section, itemName = '', details = {}) {
  if (!supabase) return;
  try {
    await supabase.from('activity_logs').insert({
      admin_email: adminEmail || 'Admin',
      action,
      section,
      item_name: itemName,
      details,
      created_at: new Date().toISOString()
    });
  } catch (err) {
    console.warn('Activity logging warning:', err.message);
  }
}

export async function getActivityLogs(limit = 50) {
  if (!supabase) return [];
  try {
    const { data, error } = await supabase
      .from('activity_logs')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) throw error;
    return data || [];
  } catch (err) {
    console.error('Error fetching activity logs:', err);
    return [];
  }
}

// ==================================================
// DEFAULT SEED DATA HELPERS FOR ALL 8 BANNERS
// ==================================================
export const DEFAULT_BANNERS = [
  {
    banner_key: 'home_main_1',
    title_name: 'Home Main Banner 01',
    heading: 'SAVE MONEY. ENJOY MORE.',
    subheading: 'BIG SAVINGS!',
    description: 'OTT subscriptions, high-speed fiber internet, mobiles & gadgets — all at smart prices.',
    button_text: 'Explore Deals',
    button_link: 'offers',
    image_url: '/hero-products-showcase.png',
    mobile_image_url: '/hero-products-showcase.png',
    text_color: '#ffffff',
    button_color: '#e50914',
    bg_color: '#050b1e',
    overlay_color: 'rgba(168,85,247,0.25)',
    display_order: 1,
    is_active: true
  },
  {
    banner_key: 'home_main_2',
    title_name: 'Home Main Banner 02 (2nd Slide)',
    heading: 'SAVE MORE. ENJOY MORE.',
    subheading: 'MEGA DEALS!',
    description: 'Up to 75% Off Premium Electronics, OTT Subscriptions & High-Speed Fiber Internet.',
    button_text: 'Shop Now',
    button_link: 'mobiles',
    image_url: '/hero-products-showcase.png',
    mobile_image_url: '/hero-products-showcase.png',
    text_color: '#ffffff',
    button_color: '#ec4899',
    bg_color: '#0c051a',
    overlay_color: 'rgba(236,72,153,0.3)',
    display_order: 2,
    is_active: true
  },
  {
    banner_key: 'home_small_1',
    title_name: 'Home Small Banner 01',
    heading: 'OTT & Fiber Broadband Bundles',
    subheading: 'MEGA DISCOUNT CARNIVAL',
    description: 'Get 12+ Premium OTT Apps & 200 Mbps Unlimited Fiber Internet',
    button_text: 'Explore Bundles',
    button_link: 'fiber',
    image_url: 'https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85?w=600&auto=format&fit=crop&q=80',
    mobile_image_url: 'https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85?w=600&auto=format&fit=crop&q=80',
    text_color: '#ffffff',
    button_color: '#ffffff',
    bg_color: '#dc2626',
    overlay_color: 'rgba(0,0,0,0.2)',
    display_order: 3,
    is_active: true
  },
  {
    banner_key: 'home_small_2',
    title_name: 'Home Small Banner 02',
    heading: 'Netflix 4K UHD & Prime Video',
    subheading: 'LIMITED TIME DEAL',
    description: 'Multi-screen Ultra HD Playback with Instant Digital Activation',
    button_text: 'Get Subscriptions',
    button_link: 'ott-plans',
    image_url: 'https://images.unsplash.com/photo-1522869635100-9f4c5e86aa37?w=600&auto=format&fit=crop&q=80',
    mobile_image_url: 'https://images.unsplash.com/photo-1522869635100-9f4c5e86aa37?w=600&auto=format&fit=crop&q=80',
    text_color: '#ffffff',
    button_color: '#e50914',
    bg_color: '#0f172a',
    overlay_color: 'rgba(0,0,0,0.3)',
    display_order: 4,
    is_active: true
  },
  {
    banner_key: 'home_small_3',
    title_name: 'Home Small Banner 03',
    heading: '5G Mobiles & ANC Earbuds',
    subheading: 'SMART GADGET FEST',
    description: 'Shop Sony IMX OIS Camera Phones, Smartwatches & ANC Earbuds',
    button_text: 'Shop Gadgets',
    button_link: 'mobiles',
    image_url: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&auto=format&fit=crop&q=80',
    mobile_image_url: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&auto=format&fit=crop&q=80',
    text_color: '#ffffff',
    button_color: '#10b981',
    bg_color: '#064e3b',
    overlay_color: 'rgba(0,0,0,0.2)',
    display_order: 5,
    is_active: true
  },
  {
    banner_key: 'home_middle_big',
    title_name: 'Home Middle Big Banner',
    heading: '12-in-1 Mega Subscription Pack',
    subheading: 'ULTIMATE SAVINGS BUNDLE',
    description: 'Single dashboard access for Netflix, Prime, Hotstar, ZEE5, SonyLIV & 7 more apps.',
    button_text: 'Claim Offer',
    button_link: 'ott-plans',
    image_url: 'https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85?w=1200&auto=format&fit=crop&q=80',
    mobile_image_url: 'https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85?w=800&auto=format&fit=crop&q=80',
    text_color: '#ffffff',
    button_color: '#008744',
    bg_color: '#090518',
    overlay_color: 'rgba(0,0,0,0.4)',
    display_order: 6,
    is_active: true
  },
  {
    banner_key: 'home_bottom_small',
    title_name: 'Home Bottom Small Banner',
    heading: '24/7 Priority WhatsApp Customer Support',
    subheading: 'INSTANT ASSISTANCE',
    description: 'Need help with plan selection or payment verification? Chat with our live team.',
    button_text: 'Chat on WhatsApp',
    button_link: 'contact',
    image_url: 'https://images.unsplash.com/photo-1534536281715-e28d76689b4d?w=600&auto=format&fit=crop&q=80',
    mobile_image_url: 'https://images.unsplash.com/photo-1534536281715-e28d76689b4d?w=600&auto=format&fit=crop&q=80',
    text_color: '#ffffff',
    button_color: '#25d366',
    bg_color: '#022c22',
    overlay_color: 'rgba(0,0,0,0.2)',
    display_order: 7,
    is_active: true
  },
  {
    banner_key: 'offers_top',
    title_name: 'Offers Top Banner',
    heading: 'Mega Savings Festival — Up to 75% OFF!',
    subheading: 'EXCLUSIVE DEALS',
    description: 'Exclusive discounted subscriptions, high-speed fiber internet bundles, and smart gadget deals.',
    button_text: 'Shop Featured Offers',
    button_link: 'offers',
    image_url: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=1200&auto=format&fit=crop&q=80',
    mobile_image_url: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=800&auto=format&fit=crop&q=80',
    text_color: '#ffffff',
    button_color: '#e50914',
    bg_color: '#1e1b4b',
    overlay_color: 'rgba(0,0,0,0.3)',
    display_order: 8,
    is_active: true
  }
];

export const DEFAULT_OFFER_SLIDES = [
  {
    heading: 'Mega Savings Festival — Up to 75% OFF!',
    description: 'Exclusive discounted subscriptions, high-speed fiber internet bundles, and smart gadget deals.',
    button_text: 'Shop Featured Offers',
    button_link: 'offers',
    image_url: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=1200&auto=format&fit=crop&q=80',
    display_order: 1,
    is_active: true
  }
];

export const DEFAULT_OFFER_ITEMS = [
  {
    name: 'Netflix Premium 4K UHD 1 Year Pack',
    description: '1 Year Ultra HD 4K streaming access on up to 4 screens simultaneously.',
    original_price: 2499,
    offer_price: 999,
    discount: '60% OFF',
    image: 'https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85?w=800&auto=format&fit=crop&q=80',
    category: 'OTT Platforms',
    offer_badge: 'Mega Deal',
    availability: 'In Stock',
    display_order: 1,
    is_active: true,
    show_on_home: true,
    show_on_explorer: true
  },
  {
    name: '12-in-1 Ultimate OTT Subscription Combo',
    description: 'Includes Netflix, Prime, Hotstar, ZEE5, SonyLIV & 7 more apps in a single account.',
    original_price: 3999,
    offer_price: 999,
    discount: '75% OFF',
    image: 'https://images.unsplash.com/photo-1522869635100-9f4c5e86aa37?w=800&auto=format&fit=crop&q=80',
    category: 'OTT Platforms',
    offer_badge: 'Best Seller',
    availability: 'In Stock',
    display_order: 2,
    is_active: true,
    show_on_home: true,
    show_on_explorer: true
  }
];

export const DEFAULT_BADGES = [
  { name: 'Best Seller', text: 'Best Seller', bg_color: '#e50914', text_color: '#ffffff', position: 'top-right', is_active: true },
  { name: 'Hot Deal', text: 'Hot Deal', bg_color: '#f59e0b', text_color: '#000000', position: 'top-right', is_active: true },
  { name: 'Offer', text: '75% OFF', bg_color: '#10b981', text_color: '#ffffff', position: 'top-left', is_active: true },
  { name: 'New', text: 'New Arrival', bg_color: '#3b82f6', text_color: '#ffffff', position: 'top-left', is_active: true }
];

export const DEFAULT_BATCHES = [
  { name: 'Best Seller', slug: 'best-seller', display_order: 1, is_active: true },
  { name: 'Top Picks', slug: 'top-picks', display_order: 2, is_active: true },
  { name: 'New Arrivals', slug: 'new-arrivals', display_order: 3, is_active: true },
  { name: 'Trending', slug: 'trending', display_order: 4, is_active: true }
];

export const DEFAULT_HOMEPAGE_STEPS = [
  { step_number: 1, title: 'Browse Products or Plans', description: 'Explore our wide selection of OTT subscriptions, Fiber Internet packages, smart gadgets & mobile accessories.', icon_name: 'Search', display_order: 1, is_active: true },
  { step_number: 2, title: 'Select & Add to Cart', description: 'Choose your desired product or plan duration and click Add to Cart or Quick Order.', icon_name: 'ShoppingCart', display_order: 2, is_active: true },
  { step_number: 3, title: 'Fill Customer Details', description: 'Provide your name, phone number, and location in the order drawer.', icon_name: 'UserCheck', display_order: 3, is_active: true },
  { step_number: 4, title: 'Make Payment via UPI', description: 'Pay conveniently using Google Pay, PhonePe, or direct UPI ID shown during checkout.', icon_name: 'CreditCard', display_order: 4, is_active: true },
  { step_number: 5, title: 'Upload Payment Screenshot', description: 'Attach your payment proof screenshot directly in the website checkout drawer.', icon_name: 'Upload', display_order: 5, is_active: true },
  { step_number: 6, title: 'Send Order on WhatsApp', description: 'Click "Place Order via WhatsApp". A pre-formatted message with order details will open automatically.', icon_name: 'MessageCircle', display_order: 6, is_active: true },
  { step_number: 7, title: 'Instant Verification', description: 'Our team verifies your payment screenshot within 5 to 15 minutes.', icon_name: 'CheckCircle', display_order: 7, is_active: true },
  { step_number: 8, title: 'Activation / Shipping', description: 'OTT login credentials or SIM/activation details are delivered to your WhatsApp. Physical items shipped with tracking.', icon_name: 'Zap', display_order: 8, is_active: true },
  { step_number: 9, title: '24/7 Customer Support', description: 'Enjoy uninterrupted service with dedicated support via WhatsApp and phone.', icon_name: 'Headphones', display_order: 9, is_active: true },
  { step_number: 10, title: 'Renew & Save More', description: 'Renew your subscription anytime at exclusive OTTMoneySaver discounted rates!', icon_name: 'Sparkles', display_order: 10, is_active: true }
];

export const DEFAULT_CONTACT_DETAILS = {
  business_name: 'OTTMoneySaver',
  phone: '6305151531',
  secondary_phone: '7013931261',
  whatsapp: '916305151531',
  secondary_whatsapp: '917013931261',
  email: 'support@ottmoneysaver.com',
  address: 'Hyderabad, Telangana, India',
  city: 'Hyderabad',
  state: 'Telangana'
};

export const DEFAULT_FOOTER_LINKS = [
  { section_name: 'Quick Links', heading: 'Quick Links', link_text: 'Home', link_url: 'home', display_order: 1, is_active: true },
  { section_name: 'Quick Links', heading: 'Quick Links', link_text: 'OTT Plans', link_url: 'ott-plans', display_order: 2, is_active: true },
  { section_name: 'Quick Links', heading: 'Quick Links', link_text: 'Fiber Internet', link_url: 'fiber', display_order: 3, is_active: true },
  { section_name: 'Quick Links', heading: 'Quick Links', link_text: 'Mobiles & Gadgets', link_url: 'mobiles', display_order: 4, is_active: true },
  { section_name: 'Quick Links', heading: 'Quick Links', link_text: 'Electronics', link_url: 'electronics', display_order: 5, is_active: true },
  { section_name: 'Quick Links', heading: 'Quick Links', link_text: 'All Offers', link_url: 'offers', display_order: 6, is_active: true },
  { section_name: 'Customer Support', heading: 'Customer Support', link_text: 'Contact Us', link_url: 'contact', display_order: 1, is_active: true },
  { section_name: 'Customer Support', heading: 'Customer Support', link_text: 'How to Order', link_url: 'home', display_order: 2, is_active: true }
];

export const DEFAULT_WHATSAPP_TEMPLATE = `Hello OTTMoneySaver,

I would like to order:
{PRODUCTS}

Customer Name: {CUSTOMER_NAME}
Mobile: {CUSTOMER_PHONE}
Location: {CUSTOMER_LOCATION}
Email: {CUSTOMER_EMAIL}

Total Amount: ₹{TOTAL}
Order ID: {ORDER_ID}
Payment Screenshot: {PAYMENT_SCREENSHOT}

Thank you!`;

export const DEFAULT_SITE_SETTINGS = {
  business_name: 'OTTMoneySaver',
  logo_url: '/image.png',
  favicon_url: '/favicon.ico',
  phone: '6305151531',
  whatsapp: '916305151531',
  email: 'support@ottmoneysaver.com',
  address: 'Hyderabad, Telangana, India',
  website_title: 'OTTMoneySaver — Save Big on OTT, Fiber & Smart Gadgets',
  meta_description: 'Buy discounted OTT platform subscriptions, high-speed fiber internet plans, and smart gadgets at lowest prices.',
  category_layout_style: 'grid',
  home_display_settings: {
    display_count: 8,
    selected_item_ids: []
  },
  social_links: {
    facebook: '',
    instagram: '',
    twitter: '',
    youtube: ''
  }
};

// ==================================================
// GENERAL CMS FETCH / MUTATION HELPERS WITH AUTO SEEDING
// ==================================================

/**
 * Fetch table items or seed if empty
 */
export async function getCmsTableData(tableName, defaultItems = []) {
  if (!supabase) return defaultItems;
  try {
    const { data, error } = await supabase
      .from(tableName)
      .select('*')
      .order('display_order', { ascending: true });

    if (error) {
      console.warn(`Supabase fetch error for ${tableName}:`, error.message);
      return defaultItems;
    }

    if (!data || data.length === 0) {
      if (defaultItems && defaultItems.length > 0) {
        console.log(`Auto-seeding empty table: ${tableName}`);
        const { data: seeded, error: seedErr } = await supabase
          .from(tableName)
          .insert(defaultItems)
          .select();

        if (!seedErr && seeded) return seeded;
      }
      return defaultItems;
    }

    return data;
  } catch (err) {
    console.error(`Exception reading ${tableName}:`, err);
    return defaultItems;
  }
}

/**
 * Single Record Fetcher (e.g. contact_details, cart_settings, site_settings)
 */
export async function getCmsSingleRecord(tableName, defaultObj = {}) {
  if (!supabase) return defaultObj;
  try {
    const { data, error } = await supabase.from(tableName).select('*').limit(1).single();
    if (!error && data) return data;

    if ((error?.code === 'PGRST116' || !data) && Object.keys(defaultObj).length > 0) {
      const { data: inserted, error: insertErr } = await supabase
        .from(tableName)
        .insert(defaultObj)
        .select()
        .single();
      if (!insertErr && inserted) return inserted;
    }
  } catch (err) {
    console.warn(`Single record fetch warning for ${tableName}:`, err.message);
  }
  return defaultObj;
}

/**
 * Generic Upsert / Save row
 */
export async function saveCmsItem(tableName, itemData) {
  if (!supabase) throw new Error('Supabase client not configured.');

  const payload = {
    ...itemData,
    updated_at: new Date().toISOString()
  };

  const { data, error } = await supabase
    .from(tableName)
    .upsert(payload)
    .select()
    .single();

  if (error) throw error;
  return data;
}

/**
 * Generic Delete row
 */
export async function deleteCmsItem(tableName, id) {
  if (!supabase) throw new Error('Supabase client not configured.');

  const { error } = await supabase
    .from(tableName)
    .delete()
    .eq('id', id);

  if (error) throw error;
  return true;
}

/**
 * Update Row Display Order / Reorder Helper
 */
export async function updateDisplayOrder(tableName, items, orderField = 'display_order') {
  if (!supabase || !items || items.length === 0) return;

  try {
    for (let index = 0; index < items.length; index++) {
      const item = items[index];
      await supabase
        .from(tableName)
        .update({ [orderField]: index + 1, updated_at: new Date().toISOString() })
        .eq('id', item.id);
    }
  } catch (err) {
    console.error(`Error updating order for ${tableName}:`, err);
  }
}

// ==================================================
// ANONYMOUS VISITOR ANALYTICS SERVICES
// ==================================================
export async function logPageView(path = window.location.pathname) {
  if (!supabase) return;
  try {
    let sessionId = sessionStorage.getItem('oms_session_id');
    if (!sessionId) {
      sessionId = `sess_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
      sessionStorage.setItem('oms_session_id', sessionId);
    }

    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    const isTablet = /iPad|Tablet/i.test(navigator.userAgent);
    const deviceType = isTablet ? 'tablet' : isMobile ? 'mobile' : 'desktop';

    await supabase.from('analytics_visits').insert({
      session_id: sessionId,
      path,
      device_type: deviceType,
      referrer: document.referrer || 'Direct',
      visited_at: new Date().toISOString()
    });
  } catch (err) {
    console.warn('Analytics pageview log error:', err.message);
  }
}

export async function getAnalyticsMetrics(fromDate, toDate) {
  if (!supabase) {
    return {
      todayVisits: 0,
      yesterdayVisits: 0,
      last7DaysVisits: 0,
      last30DaysVisits: 0,
      rangeVisits: 0,
      uniqueVisitors: 0,
      pageViews: 0,
      topPages: [],
      deviceBreakdown: { mobile: 0, desktop: 0, tablet: 0 }
    };
  }

  try {
    let query = supabase.from('analytics_visits').select('*');

    if (fromDate) {
      query = query.gte('visited_at', new Date(fromDate).toISOString());
    }
    if (toDate) {
      const endOfDay = new Date(toDate);
      endOfDay.setHours(23, 59, 59, 999);
      query = query.lte('visited_at', endOfDay.toISOString());
    }

    const { data: visits, error } = await query;
    if (error) throw error;

    const allVisits = visits || [];
    const now = new Date();
    const todayStr = now.toISOString().slice(0, 10);

    const yesterday = new Date(now);
    yesterday.setDate(now.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().slice(0, 10);

    const d7 = new Date(now);
    d7.setDate(now.getDate() - 7);

    const d30 = new Date(now);
    d30.setDate(now.getDate() - 30);

    let todayCount = 0;
    let yesterdayCount = 0;
    let last7Count = 0;
    let last30Count = 0;

    const uniqueSessions = new Set();
    const pageCounts = {};
    const deviceCounts = { mobile: 0, desktop: 0, tablet: 0 };

    allVisits.forEach((v) => {
      const vDate = new Date(v.visited_at);
      const vDateStr = vDate.toISOString().slice(0, 10);

      if (vDateStr === todayStr) todayCount++;
      if (vDateStr === yesterdayStr) yesterdayCount++;
      if (vDate >= d7) last7Count++;
      if (vDate >= d30) last30Count++;

      if (v.session_id) uniqueSessions.add(v.session_id);

      const path = v.path || '/';
      pageCounts[path] = (pageCounts[path] || 0) + 1;

      const device = (v.device_type || 'desktop').toLowerCase();
      deviceCounts[device] = (deviceCounts[device] || 0) + 1;
    });

    const topPages = Object.entries(pageCounts)
      .map(([path, views]) => ({ path, views }))
      .sort((a, b) => b.views - a.views)
      .slice(0, 10);

    return {
      todayVisits: todayCount,
      yesterdayVisits: yesterdayCount,
      last7DaysVisits: last7Count,
      last30DaysVisits: last30Count,
      rangeVisits: allVisits.length,
      uniqueVisitors: uniqueSessions.size,
      pageViews: allVisits.length,
      topPages,
      deviceBreakdown: deviceCounts
    };
  } catch (err) {
    console.error('Error fetching analytics metrics:', err);
    return {
      todayVisits: 0,
      yesterdayVisits: 0,
      last7DaysVisits: 0,
      last30DaysVisits: 0,
      rangeVisits: 0,
      uniqueVisitors: 0,
      pageViews: 0,
      topPages: [],
      deviceBreakdown: { mobile: 0, desktop: 0, tablet: 0 }
    };
  }
}

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
// DEFAULT SEED DATA HELPERS
// ==================================================
export const DEFAULT_HOMEPAGE_SLIDES = [
  {
    slide_key: 'second_slide',
    heading: 'Special OTT Combo Bundles — Save Up To 75%',
    description: 'Get Netflix, Prime Video, Disney+ Hotstar & 9 more apps in a single affordable subscription package!',
    button_text: 'Explore All OTT Offers',
    button_link: 'offers',
    image_url: 'https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85?w=1200&auto=format&fit=crop&q=80',
    display_order: 1,
    is_active: true
  }
];

export const DEFAULT_HOMEPAGE_ITEMS = FEATURED_DEALS.map((deal, idx) => ({
  title: deal.title,
  short_description: deal.subtitle,
  image_url: deal.image,
  price: deal.price,
  original_price: deal.originalPrice,
  discount: deal.discount,
  link_url: 'offers',
  badge: deal.badge,
  category: deal.category,
  is_active: true,
  display_order: idx + 1
}));

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
  },
  {
    name: 'boAt Rockerz 550 Wireless Headphones',
    description: 'Over-ear Bluetooth headphones with 20H playback & 50mm drivers.',
    original_price: 2999,
    offer_price: 1499,
    discount: '50% OFF',
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80',
    category: 'Mobile / Gadgets',
    offer_badge: 'Hot Deal',
    availability: 'In Stock',
    display_order: 3,
    is_active: true,
    show_on_home: true,
    show_on_explorer: true
  }
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
      // If table is empty, attempt auto-seed if defaults provided
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

    // Seed single record if missing
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
export async function updateDisplayOrder(tableName, items) {
  if (!supabase || !items || items.length === 0) return;

  try {
    const updates = items.map((item, index) => ({
      id: item.id,
      display_order: index + 1,
      updated_at: new Date().toISOString()
    }));

    for (const update of updates) {
      await supabase.from(tableName).update({ display_order: update.display_order }).eq('id', update.id);
    }
  } catch (err) {
    console.error(`Error updating order for ${tableName}:`, err);
  }
}

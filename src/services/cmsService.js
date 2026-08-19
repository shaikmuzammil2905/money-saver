// OTTMoneySaver Central CMS Database Service Layer
import { supabase } from './supabase.js';
import { ALL_PRODUCTS, PRIMARY_CATEGORIES, SHOP_BY_CATEGORIES, VALUE_PROPOSITIONS, FEATURED_DEALS } from '../data/products.js';
import { DEFAULT_PAYMENT_CONFIG } from '../config/payment.js';

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

export const DEFAULT_HOME_SECTIONS = [
  {
    box_key: 'box_1',
    title_label: '1st Banner (Hero Carousel)',
    section_type: 'banner',
    content_id: 'home_main_1',
    position: 1,
    is_active: true
  },
  {
    box_key: 'box_2',
    title_label: 'Product Categories Cards',
    section_type: 'categories',
    content_id: 'all',
    position: 2,
    is_active: true
  },
  {
    box_key: 'box_3',
    title_label: '2nd Banner (Promo Slider)',
    section_type: 'banner',
    content_id: 'home_small_1',
    position: 3,
    is_active: true
  },
  {
    box_key: 'box_4',
    title_label: 'Featured Deals Section',
    section_type: 'featured_deals',
    content_id: 'featured',
    position: 4,
    is_active: true
  },
  {
    box_key: 'box_5',
    title_label: 'Selectable Theme 01 (Offer Highlights)',
    section_type: 'theme',
    content_id: 'theme_1',
    position: 5,
    is_active: true
  },
  {
    box_key: 'box_6',
    title_label: 'How To Order Guide',
    section_type: 'steps',
    content_id: 'steps_10',
    position: 6,
    is_active: true
  },
  {
    box_key: 'box_7',
    title_label: 'Why Choose Us',
    section_type: 'why_choose_us',
    content_id: 'value_props',
    position: 7,
    is_active: true
  },
  {
    box_key: 'box_8',
    title_label: '3rd Banner (Middle Big)',
    section_type: 'banner',
    content_id: 'home_middle_big',
    position: 8,
    is_active: true
  },
  {
    box_key: 'box_9',
    title_label: 'Selectable Theme 02 (Notice Alert Box)',
    section_type: 'theme',
    content_id: 'theme_2',
    position: 9,
    is_active: true
  },
  {
    box_key: 'box_10',
    title_label: 'Need Help Section',
    section_type: 'guidance',
    content_id: 'contact_help',
    position: 10,
    is_active: true
  }
];

export const DEFAULT_THEMES = [
  {
    name: 'Theme 01 — Special Offer Highlights',
    theme_key: 'theme_1',
    description: 'Visual banner with bold heading, offer text, custom button link, and border styling.',
    layout_data: [
      { id: 'b1', type: 'heading', content: '🔥 Exclusive Member Deals & Bundles', fontSize: '24px', fontWeight: 'bold', textColor: '#ffffff', alignment: 'center' },
      { id: 'b2', type: 'paragraph', content: 'Get up to 75% instant discount on 12-in-1 OTT combos, high speed fiber internet, and premium gadgets.', fontSize: '14px', textColor: '#cbd5e1', alignment: 'center' },
      { id: 'b3', type: 'button', content: 'Claim Discount Now', linkUrl: 'offers', buttonColor: '#e50914', textColor: '#ffffff', border: true, borderRadius: '12px', alignment: 'center' }
    ],
    styles: { bgColor: '#0f172a', borderColor: '#e50914', borderWidth: '2px', borderRadius: '16px', padding: '24px' },
    is_active: true
  },
  {
    name: 'Theme 02 — Notice Alert & Guidance Box',
    theme_key: 'theme_2',
    description: 'Custom notification box with green accent highlight and direct support link.',
    layout_data: [
      { id: 'b1', type: 'heading', content: '⚡ Instant Digital Activation Support', fontSize: '20px', fontWeight: 'bold', textColor: '#10b981', alignment: 'left' },
      { id: 'b2', type: 'paragraph', content: 'All OTT subscriptions are activated instantly within 5 to 15 minutes after payment screenshot verification.', fontSize: '13px', textColor: '#e2e8f0', alignment: 'left' },
      { id: 'b3', type: 'button', content: 'Chat with Live Support', linkUrl: 'contact', buttonColor: '#10b981', textColor: '#ffffff', border: false, borderRadius: '8px', alignment: 'left' }
    ],
    styles: { bgColor: '#062016', borderColor: '#10b981', borderWidth: '1px', borderRadius: '12px', padding: '20px' },
    is_active: true
  }
];

// ==================================================
// GENERAL CMS FETCH / MUTATION HELPERS WITH AUTO SEEDING
// ==================================================
// GENERAL CMS FETCH / MUTATION HELPERS WITH AUTO SEEDING & SUPABASE FALLBACK
// Cache for initialized tables in Supabase
let initializedTablesCache = null;

async function isTableInitializedInSupabase(tableName) {
  if (initializedTablesCache && initializedTablesCache.includes(tableName)) {
    return true;
  }
  try {
    const { data } = await supabase.from('site_settings').select('*').eq('key', 'initialized_tables').maybeSingle();
    if (data && Array.isArray(data.value)) {
      initializedTablesCache = data.value;
      return data.value.includes(tableName);
    }
  } catch (e) {
    console.warn('Initialized tables check warning:', e.message);
  }
  return false;
}

async function markTableInitializedInSupabase(tableName) {
  try {
    const current = initializedTablesCache || [];
    if (!current.includes(tableName)) {
      const updated = [...current, tableName];
      initializedTablesCache = updated;
      await supabase.from('site_settings').upsert({
        key: 'initialized_tables',
        value: updated,
        updated_at: new Date().toISOString()
      });
    }
  } catch (e) {
    console.warn('Mark table initialized warning:', e.message);
  }
}

// Fallback persistence layer using Supabase site_settings table when PostgREST schema cache is missing table
async function getFallbackTableData(tableName, defaultItems = [], orderColumn = 'display_order') {
  try {
    const key = `cms_table_${tableName}`;
    const { data, error } = await supabase
      .from('site_settings')
      .select('*')
      .eq('key', key)
      .maybeSingle();

    if (!error && data && Array.isArray(data.value)) {
      const items = [...data.value];
      const sortField = tableName === 'home_sections' ? 'position' : orderColumn;
      items.sort((a, b) => (a[sortField] || 0) - (b[sortField] || 0));
      return items;
    }

    if (defaultItems && defaultItems.length > 0) {
      const seeded = defaultItems.map((item, idx) => ({
        id: item.id || `seed_${Date.now()}_${idx}`,
        ...item,
        position: item.position || idx + 1,
        display_order: item.display_order || idx + 1
      }));
      await supabase.from('site_settings').upsert({
        key,
        value: seeded,
        updated_at: new Date().toISOString()
      }, { onConflict: 'key' });
      return seeded;
    }

    return [];
  } catch (err) {
    console.warn(`Fallback fetch error for ${tableName}:`, err);
    return defaultItems || [];
  }
}

async function saveFallbackCmsItem(tableName, itemData) {
  const key = `cms_table_${tableName}`;
  const current = await getFallbackTableData(tableName, []);
  let updated = [...current];

  const targetId = itemData.id || itemData.box_key || itemData.banner_key || itemData.theme_key;
  const existingIdx = updated.findIndex(i => 
    (i.id && i.id === targetId) || 
    (i.box_key && itemData.box_key && i.box_key === itemData.box_key) || 
    (i.banner_key && itemData.banner_key && i.banner_key === itemData.banner_key) || 
    (i.theme_key && itemData.theme_key && i.theme_key === itemData.theme_key)
  );

  const finalItem = {
    id: itemData.id || (existingIdx >= 0 && updated[existingIdx].id ? updated[existingIdx].id : `id_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`),
    ...itemData,
    updated_at: new Date().toISOString()
  };

  if (existingIdx >= 0) {
    updated[existingIdx] = { ...updated[existingIdx], ...finalItem };
  } else {
    updated.push(finalItem);
  }

  const { error } = await supabase.from('site_settings').upsert({
    key,
    value: updated,
    updated_at: new Date().toISOString()
  }, { onConflict: 'key' });

  if (error) throw new Error(`Supabase save failed: ${error.message}`);
  return finalItem;
}

async function deleteFallbackCmsItem(tableName, id) {
  const key = `cms_table_${tableName}`;
  const current = await getFallbackTableData(tableName, []);
  const updated = current.filter(i => i.id !== id && i.box_key !== id && i.banner_key !== id && i.theme_key !== id);

  const { error } = await supabase.from('site_settings').upsert({
    key,
    value: updated,
    updated_at: new Date().toISOString()
  }, { onConflict: 'key' });

  if (error) throw new Error(`Supabase delete failed: ${error.message}`);
  return true;
}

async function updateFallbackDisplayOrder(tableName, items, orderField = 'display_order') {
  const key = `cms_table_${tableName}`;
  const reordered = items.map((item, idx) => ({
    ...item,
    [orderField]: idx + 1,
    updated_at: new Date().toISOString()
  }));

  await supabase.from('site_settings').upsert({
    key,
    value: reordered,
    updated_at: new Date().toISOString()
  }, { onConflict: 'key' });
}

async function migrateLegacySiteSettingsToTable(tableName) {
  try {
    const key = `cms_table_${tableName}`;
    const { data: settingRow } = await supabase
      .from('site_settings')
      .select('*')
      .eq('key', key)
      .maybeSingle();

    if (settingRow && Array.isArray(settingRow.value) && settingRow.value.length > 0) {
      console.log(`Migrating ${settingRow.value.length} legacy items from site_settings to real table '${tableName}'...`);
      for (const item of settingRow.value) {
        await supabase.from(tableName).upsert(item);
      }
      await supabase.from('site_settings').delete().eq('key', key);
      console.log(`✅ Data migration to real table '${tableName}' completed!`);
    }
  } catch (err) {
    console.warn(`Data migration notice for '${tableName}':`, err.message);
  }
}

/**
 * Fetch table items or seed if empty on first-time setup only.
 * Deleted items will NEVER be re-seeded!
 */
export async function getCmsTableData(tableName, defaultItems = [], orderColumn = 'display_order') {
  if (!supabase) return defaultItems;
  try {
    const isPositionOrder = tableName === 'home_sections';
    const sortField = isPositionOrder ? 'position' : orderColumn;

    const { data, error } = await supabase
      .from(tableName)
      .select('*')
      .order(sortField, { ascending: true });

    if (error) {
      if (error.code === 'PGRST205' || error.message?.includes('schema cache')) {
        return await getFallbackTableData(tableName, defaultItems, orderColumn);
      }
      console.warn(`Supabase fetch error for ${tableName}:`, error.message);
      return await getFallbackTableData(tableName, defaultItems, orderColumn);
    }

    // Auto-migrate legacy data from site_settings to table if available
    await migrateLegacySiteSettingsToTable(tableName);

    const initKey = `oms_table_initialized_${tableName}`;
    const wasInitializedInLocal = localStorage.getItem(initKey) === 'true';
    const wasInitializedInDb = await isTableInitializedInSupabase(tableName);
    const wasInitialized = wasInitializedInLocal || wasInitializedInDb;

    if (!data || data.length === 0) {
      // ONLY perform first-time initial seed if table has NEVER been initialized
      if (!wasInitialized && defaultItems && defaultItems.length > 0) {
        console.log(`First-time initial seeding for empty table: ${tableName}`);
        const { data: seeded, error: seedErr } = await supabase
          .from(tableName)
          .insert(defaultItems)
          .select();

        if (!seedErr && seeded && seeded.length > 0) {
          localStorage.setItem(initKey, 'true');
          await markTableInitializedInSupabase(tableName);
          return seeded;
        }
      }
      localStorage.setItem(initKey, 'true');
      await markTableInitializedInSupabase(tableName);
      return [];
    }

    localStorage.setItem(initKey, 'true');
    await markTableInitializedInSupabase(tableName);
    return data;
  } catch (err) {
    console.error(`Exception reading ${tableName}:`, err);
    return await getFallbackTableData(tableName, defaultItems, orderColumn);
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

  let options = undefined;
  if (tableName === 'site_settings' || (itemData.key && !itemData.id)) {
    options = { onConflict: 'key' };
  } else if (tableName === 'products' && itemData.slug_id && !itemData.id) {
    options = { onConflict: 'slug_id' };
  } else if (tableName === 'banners' && itemData.banner_key && !itemData.id) {
    options = { onConflict: 'banner_key' };
  } else if (tableName === 'themes' && itemData.theme_key && !itemData.id) {
    options = { onConflict: 'theme_key' };
  } else if (tableName === 'home_sections' && itemData.box_key && !itemData.id) {
    options = { onConflict: 'box_key' };
  } else if (tableName === 'categories' && itemData.slug && !itemData.id) {
    options = { onConflict: 'slug' };
  }

  try {
    const { data, error } = await supabase
      .from(tableName)
      .upsert(payload, options)
      .select()
      .single();

    if (error) {
      if (error.code === 'PGRST205' || error.message?.includes('schema cache')) {
        return await saveFallbackCmsItem(tableName, payload);
      }
      throw new Error(`Supabase save error (${error.code || 'ERR'}): ${error.message}`);
    }
    return data;
  } catch (err) {
    if (err.message?.includes('schema cache') || err.code === 'PGRST205') {
      return await saveFallbackCmsItem(tableName, payload);
    }
    throw err;
  }
}

/**
 * Generic Delete row
 */
export async function deleteCmsItem(tableName, id) {
  if (!supabase) throw new Error('Supabase client not configured.');

  try {
    const { error } = await supabase
      .from(tableName)
      .delete()
      .eq('id', id);

    // Clean fallback key as well so deleted items never return
    await deleteFallbackCmsItem(tableName, id).catch(() => {});

    if (error) {
      if (error.code === 'PGRST205' || error.message?.includes('schema cache')) {
        return await deleteFallbackCmsItem(tableName, id);
      }
      throw new Error(`Supabase delete error: ${error.message}`);
    }
    return true;
  } catch (err) {
    if (err.message?.includes('schema cache') || err.code === 'PGRST205') {
      return await deleteFallbackCmsItem(tableName, id);
    }
    throw err;
  }
}

/**
 * Update Row Display Order / Reorder Helper
 */
export async function updateDisplayOrder(tableName, items, orderField = 'display_order') {
  if (!supabase || !items || items.length === 0) return;

  try {
    const isPositionOrder = tableName === 'home_sections';
    const fieldToUpdate = isPositionOrder ? 'position' : orderField;

    for (let index = 0; index < items.length; index++) {
      const item = items[index];
      if (item.id) {
        const { error } = await supabase
          .from(tableName)
          .update({ [fieldToUpdate]: index + 1, updated_at: new Date().toISOString() })
          .eq('id', item.id);
        
        if (error && (error.code === 'PGRST205' || error.message?.includes('schema cache'))) {
          return await updateFallbackDisplayOrder(tableName, items, fieldToUpdate);
        }
      }
    }
  } catch (err) {
    const isPositionOrder = tableName === 'home_sections';
    const fieldToUpdate = isPositionOrder ? 'position' : orderField;
    await updateFallbackDisplayOrder(tableName, items, fieldToUpdate);
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

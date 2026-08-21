import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { supabase } from '../services/supabase';
import {
  getCmsTableData,
  getCmsSingleRecord,
  saveCmsItem,
  deleteCmsItem,
  updateDisplayOrder,
  logActivity,
  DEFAULT_BANNERS,
  DEFAULT_BADGES,
  DEFAULT_BATCHES,
  DEFAULT_HOMEPAGE_STEPS,
  DEFAULT_CONTACT_DETAILS,
  DEFAULT_FOOTER_LINKS,
  DEFAULT_OFFER_SLIDES,
  DEFAULT_OFFER_ITEMS,
  DEFAULT_WHATSAPP_TEMPLATE,
  DEFAULT_SITE_SETTINGS,
  DEFAULT_HOME_SECTIONS,
  DEFAULT_THEMES
} from '../services/cmsService';
import { ALL_PRODUCTS, PRIMARY_CATEGORIES, VALUE_PROPOSITIONS } from '../data/products';
import { DEFAULT_PAYMENT_CONFIG } from '../config/payment';

export const DEFAULT_MAIN_CATEGORIES = [
  { id: 'mc_1', name: 'All Products', icon: 'Sparkles', image_url: '', link_url: 'view-all', is_active: true, display_order: 1 },
  { id: 'mc_2', name: 'HEllo', icon: 'Sparkles', image_url: '', link_url: 'offers', is_active: true, display_order: 2 },
  { id: 'mc_3', name: 'OTT Platforms', icon: 'Tv', image_url: '', link_url: 'ott-plans', is_active: true, display_order: 3 },
  { id: 'mc_4', name: 'Internet Fiber', icon: 'Globe', image_url: '', link_url: 'fiber', is_active: true, display_order: 4 },
  { id: 'mc_5', name: 'Mobile / Gadgets', icon: 'Smartphone', image_url: '', link_url: 'mobiles', is_active: true, display_order: 5 },
  { id: 'mc_6', name: 'Other Products', icon: 'Laptop', image_url: '', link_url: 'electronics', is_active: true, display_order: 6 },
];

export const DEFAULT_SUB_CATEGORIES = [
  { id: 'sc_1', name: 'Smartphones', icon: 'Smartphone', image: 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=300&auto=format&fit=crop&q=80', is_active: true, display_order: 1 },
  { id: 'sc_2', name: 'Smartwatches', icon: 'Watch', image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=300&auto=format&fit=crop&q=80', is_active: true, display_order: 2 },
  { id: 'sc_3', name: 'Earbuds', icon: 'Radio', image: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=300&auto=format&fit=crop&q=80', is_active: true, display_order: 3 },
  { id: 'sc_4', name: 'Neckbands', icon: 'Headphones', image: 'https://images.unsplash.com/photo-1572536147248-ac59a8abfa4b?w=300&auto=format&fit=crop&q=80', is_active: true, display_order: 4 },
  { id: 'sc_5', name: 'Speakers', icon: 'Speaker', image: 'https://images.unsplash.com/photo-1545454675-3531b543be5d?w=300&auto=format&fit=crop&q=80', is_active: true, display_order: 5 },
  { id: 'sc_6', name: 'Headphones', icon: 'Headphones', image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300&auto=format&fit=crop&q=80', is_active: true, display_order: 6 },
  { id: 'sc_7', name: 'Power Banks', icon: 'BatteryCharging', image: 'https://images.unsplash.com/photo-1609592424089-98048f07a049?w=300&auto=format&fit=crop&q=80', is_active: true, display_order: 7 },
  { id: 'sc_8', name: 'Chargers', icon: 'Zap', image: 'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=300&auto=format&fit=crop&q=80', is_active: true, display_order: 8 },
  { id: 'sc_9', name: 'Smart TVs', icon: 'Tv', image: 'https://images.unsplash.com/photo-1593784991095-a205069470b6?w=300&auto=format&fit=crop&q=80', is_active: true, display_order: 9 },
  { id: 'sc_10', name: 'Laptops', icon: 'Laptop', image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=300&auto=format&fit=crop&q=80', is_active: true, display_order: 10 }
];

export const DEFAULT_SUPPORT_CARDS = [
  { id: 'sup_1', title: 'Call Us', value: '6305151531', link: 'tel:6305151531', icon: 'Phone', color: '#0f172a', is_active: true, display_order: 1 },
  { id: 'sup_2', title: 'WhatsApp Us', value: '6305151531 / 7013931261', link: 'https://wa.me/916305151531', icon: 'MessageCircle', color: '#059669', is_active: true, display_order: 2 },
  { id: 'sup_3', title: 'Email Us', value: 'Ottmoneysaver@gmail.com', link: 'mailto:Ottmoneysaver@gmail.com', icon: 'Mail', color: '#0284c7', is_active: true, display_order: 3 },
  { id: 'sup_4', title: 'Chat on WhatsApp', value: '24/7 Live Agent Support', link: 'https://wa.me/916305151531', icon: 'MessageSquare', color: '#059669', is_active: true, display_order: 4 }
];

export const DEFAULT_CONTACT_PAGE_CARDS = [
  { id: 'cpc_1', title: 'PHONE HOTLINE', value: '6305151531', subtitle: 'Mon - Sun: 24 Hours Active', link: 'tel:6305151531', icon: 'Phone', color: '#e50914', is_active: true },
  { id: 'cpc_2', title: 'WHATSAPP CHAT', value: 'Instant Chat →', subtitle: 'Average reply in 2 mins', link: 'https://wa.me/916305151531', icon: 'MessageCircle', color: '#059669', is_active: true },
  { id: 'cpc_3', title: 'OFFICE LOCATION', value: 'Hyderabad, Telangana', subtitle: 'India - 500001', link: '', icon: 'MapPin', color: '#d97706', is_active: true },
  { id: 'cpc_4', title: 'SUPPORT HOURS', value: '24/7 Everyday', subtitle: 'Including Holidays', link: '', icon: 'Clock', color: '#0284c7', is_active: true }
];

export const DEFAULT_FAQS = [
  {
    id: 'faq_1',
    q: 'How fast do I receive my OTT subscription login details?',
    a: 'All OTT subscriptions are activated instantly within 5 to 15 minutes of order placement via WhatsApp and SMS.',
    is_active: true,
    display_order: 1
  },
  {
    id: 'faq_2',
    q: 'Are the high-speed fiber internet plans truly unlimited?',
    a: 'Yes, all our high-speed broadband fiber plans offer 100% truly unlimited data downloads and uploads with symmetric gigabit speeds.',
    is_active: true,
    display_order: 2
  },
  {
    id: 'faq_3',
    q: 'What is your customer support contact number?',
    a: 'You can reach our dedicated support team 24/7 at +91 6305151531 or chat directly via WhatsApp.',
    is_active: true,
    display_order: 3
  },
  {
    id: 'faq_4',
    q: 'Do smartphones & gadgets come with official brand warranty?',
    a: 'Yes, 100% of physical products and mobile devices sold on OTTMoneySaver come with original manufacturer GST invoice and brand warranty.',
    is_active: true,
    display_order: 4
  }
];

const CMSContext = createContext(null);

export function CMSProvider({ children }) {
  // --- CMS STATE ---
  const [products, setProducts] = useState([]);
  const [banners, setBanners] = useState([]);
  const [categories, setCategories] = useState([]);
  const [mainCategories, setMainCategories] = useState(DEFAULT_MAIN_CATEGORIES);
  const [subCategories, setSubCategories] = useState(DEFAULT_SUB_CATEGORIES);
  const [supportCards, setSupportCards] = useState(DEFAULT_SUPPORT_CARDS);
  const [contactCards, setContactCards] = useState(DEFAULT_CONTACT_PAGE_CARDS);
  const [faqs, setFaqs] = useState(DEFAULT_FAQS);
  const [badges, setBadges] = useState([]);
  const [batches, setBatches] = useState([]);
  const [members, setMembers] = useState([]);
  const [homeItems, setHomeItems] = useState([]);
  const [homeSlides, setHomeSlides] = useState([]);
  const [homeSections, setHomeSections] = useState([]);
  const [themes, setThemes] = useState([]);
  const [homeSteps, setHomeSteps] = useState([]);
  const [contactDetails, setContactDetails] = useState(DEFAULT_CONTACT_DETAILS);
  const [footerLinks, setFooterLinks] = useState([]);
  const [offerSlides, setOfferSlides] = useState([]);
  const [offerCategories, setOfferCategories] = useState([]);
  const [offerItems, setOfferItems] = useState([]);
  const [cartSettings, setCartSettings] = useState(DEFAULT_PAYMENT_CONFIG);
  const [whatsAppTemplate, setWhatsAppTemplate] = useState(DEFAULT_WHATSAPP_TEMPLATE);
  const [siteSettings, setSiteSettings] = useState(DEFAULT_SITE_SETTINGS);
  const [mediaList, setMediaList] = useState([]);
  const [loading, setLoading] = useState(true);

  // --- FETCH ALL CMS DATA FROM SUPABASE ---
  const refreshAllData = useCallback(async () => {
    try {
      setLoading(true);

      // Convert local products to initial format if database is completely empty
      const mappedDefaultProducts = ALL_PRODUCTS.map((p, idx) => ({
        slug_id: p.id,
        title: p.title,
        subtitle: p.subtitle || '',
        description: p.description || '',
        description_points: [
          'High quality 4K UHD playback support',
          'Instant digital activation via WhatsApp',
          '24/7 dedicated customer support'
        ],
        custom_info: ['Instant Activation', 'WhatsApp Support Available', 'Payment via UPI'],
        price: p.price,
        original_price: p.originalPrice || p.price,
        discount: p.discount || '',
        image: p.image,
        images: p.images || [p.image],
        category: p.category,
        category_group: p.categoryGroup || p.category,
        badge: p.badge || '',
        badges: p.badge ? [{ name: p.badge, text: p.badge, bg_color: '#e50914' }] : [],
        batches: ['Best Seller'],
        sections: ['Home', 'All OTTs'],
        in_stock: p.inStock !== false,
        is_featured: p.badge === 'Hot Deal' || p.badge === 'Top OTT Deal' || idx < 4,
        display_order: idx + 1,
        home_order: idx + 1,
        offers_order: idx + 1,
        all_otts_order: idx + 1,
        is_active: true
      }));

      const mappedDefaultCategories = PRIMARY_CATEGORIES.map((c, idx) => ({
        name: c.name,
        slug: c.id,
        icon: c.icon || 'Sparkles',
        group_name: c.group || c.name,
        display_order: idx + 1,
        is_active: true
      }));

      // Parallel fetches from Supabase PostgreSQL tables
      const [
        prods,
        bnrs,
        cats,
        bdgs,
        btchs,
        usersList,
        hSections,
        hSlides,
        hItems,
        tThemes,
        steps,
        contact,
        footer,
        oSlides,
        oCats,
        oItems,
        cart,
        waTemp,
        sSettings,
        media
      ] = await Promise.all([
        getCmsTableData('products', mappedDefaultProducts, 'display_order'),
        getCmsTableData('banners', DEFAULT_BANNERS, 'display_order'),
        getCmsTableData('categories', mappedDefaultCategories, 'display_order'),
        getCmsTableData('badges', DEFAULT_BADGES, 'created_at'),
        getCmsTableData('product_batches', DEFAULT_BATCHES, 'display_order'),
        getCmsTableData('users', [], 'created_at'),
        getCmsTableData('home_sections', DEFAULT_HOME_SECTIONS, 'position'),
        getCmsTableData('homepage_slides', [], 'display_order'),
        getCmsTableData('homepage_items', [], 'display_order'),
        getCmsTableData('themes', DEFAULT_THEMES, 'created_at'),
        getCmsTableData('homepage_steps', DEFAULT_HOMEPAGE_STEPS, 'display_order'),
        getCmsSingleRecord('contact_details', DEFAULT_CONTACT_DETAILS),
        getCmsTableData('footer_links', DEFAULT_FOOTER_LINKS, 'display_order'),
        getCmsTableData('offer_slides', DEFAULT_OFFER_SLIDES, 'display_order'),
        getCmsTableData('offer_categories', [], 'display_order'),
        getCmsTableData('offer_items', DEFAULT_OFFER_ITEMS, 'display_order'),
        getCmsSingleRecord('cart_settings', DEFAULT_PAYMENT_CONFIG),
        getCmsSingleRecord('whatsapp_templates', { template_key: 'order_checkout', template_text: DEFAULT_WHATSAPP_TEMPLATE }),
        getCmsSingleRecord('site_settings', { key: 'global_config', value: DEFAULT_SITE_SETTINGS }),
        getCmsTableData('media', [], 'created_at')
      ]);

      setProducts(prods || []);
      setBanners(bnrs || []);
      setCategories(cats || []);
      setBadges(bdgs || []);
      setBatches(btchs || []);
      setMembers(usersList || []);
      setHomeSections(hSections || []);
      setHomeSlides(hSlides || []);
      setHomeItems(hItems || []);
      setThemes(tThemes || []);
      setHomeSteps(steps || []);
      if (contact) setContactDetails(contact);
      setFooterLinks(footer || []);
      setOfferSlides(oSlides || []);
      setOfferCategories(oCats || []);
      setOfferItems(oItems || []);
      if (cart) setCartSettings(cart);
      if (waTemp?.template_text) setWhatsAppTemplate(waTemp.template_text);
      if (sSettings) {
        const rawConfig = sSettings || {};
        const siteConfig = (rawConfig.value && typeof rawConfig.value === 'object')
          ? { ...rawConfig, ...rawConfig.value }
          : rawConfig;

        setSiteSettings(siteConfig);
        if (Array.isArray(siteConfig.main_categories)) setMainCategories(siteConfig.main_categories);
        if (Array.isArray(siteConfig.sub_categories)) setSubCategories(siteConfig.sub_categories);
        if (Array.isArray(siteConfig.support_cards)) setSupportCards(siteConfig.support_cards);
        if (Array.isArray(siteConfig.contact_cards)) setContactCards(siteConfig.contact_cards);
        if (Array.isArray(siteConfig.faqs)) setFaqs(siteConfig.faqs);
      }
      setMediaList(media || []);

    } catch (err) {
      console.error('Error refreshing CMS data:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshAllData();
  }, [refreshAllData]);

  // --- SUPABASE REALTIME LISTENER FOR ALL TABLES ---
  useEffect(() => {
    if (!supabase) return;

    const channel = supabase
      .channel('cms-realtime-sync')
      .on('postgres_changes', { event: '*', schema: 'public' }, () => {
        refreshAllData();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [refreshAllData]);

  // --- OPTIMISTIC STATE MUTATION HELPERS ---
  const handleSaveCmsItem = useCallback(async (tableName, itemData) => {
    const saved = await saveCmsItem(tableName, itemData);
    if (!saved) return saved;

    const upsertInList = (list) => {
      const targetId = saved.id || saved.slug_id || saved.slug || saved.slide_key || saved.banner_key || saved.theme_key || saved.box_key;
      const idx = list.findIndex(i => 
        (saved.id && i.id === saved.id) ||
        (saved.slug_id && i.slug_id === saved.slug_id) ||
        (saved.slug && i.slug === saved.slug) ||
        (saved.slide_key && i.slide_key === saved.slide_key) ||
        (saved.banner_key && i.banner_key === saved.banner_key) ||
        (saved.theme_key && i.theme_key === saved.theme_key) ||
        (saved.box_key && i.box_key === saved.box_key) ||
        (targetId && (i.id === targetId || i.slug_id === targetId))
      );
      if (idx >= 0) {
        const next = [...list];
        next[idx] = { ...next[idx], ...saved };
        return next;
      }
      return [...list, saved];
    };

    switch (tableName) {
      case 'products':
        setProducts(prev => upsertInList(prev));
        break;
      case 'banners':
        setBanners(prev => upsertInList(prev));
        break;
      case 'categories':
        setCategories(prev => upsertInList(prev));
        break;
      case 'badges':
        setBadges(prev => upsertInList(prev));
        break;
      case 'product_batches':
        setBatches(prev => upsertInList(prev));
        break;
      case 'users':
        setMembers(prev => upsertInList(prev));
        break;
      case 'home_sections':
        setHomeSections(prev => upsertInList(prev));
        break;
      case 'homepage_slides':
        setHomeSlides(prev => upsertInList(prev));
        break;
      case 'homepage_items':
        setHomeItems(prev => upsertInList(prev));
        break;
      case 'themes':
        setThemes(prev => upsertInList(prev));
        break;
      case 'homepage_steps':
        setHomeSteps(prev => upsertInList(prev));
        break;
      case 'contact_details':
        setContactDetails(prev => ({ ...prev, ...saved }));
        break;
      case 'footer_links':
        setFooterLinks(prev => upsertInList(prev));
        break;
      case 'offer_slides':
        setOfferSlides(prev => upsertInList(prev));
        break;
      case 'offer_categories':
        setOfferCategories(prev => upsertInList(prev));
        break;
      case 'offer_items':
        setOfferItems(prev => upsertInList(prev));
        break;
      case 'cart_settings':
        setCartSettings(prev => ({ ...prev, ...saved }));
        break;
      case 'whatsapp_templates':
        if (saved.template_text) setWhatsAppTemplate(saved.template_text);
        break;
      case 'site_settings':
        if (saved.value) {
          const merged = { ...(siteSettings || {}), ...saved.value };
          setSiteSettings(merged);
          if (Array.isArray(saved.value.main_categories)) setMainCategories(saved.value.main_categories);
          if (Array.isArray(saved.value.sub_categories)) setSubCategories(saved.value.sub_categories);
          if (Array.isArray(saved.value.support_cards)) setSupportCards(saved.value.support_cards);
          if (Array.isArray(saved.value.contact_cards)) setContactCards(saved.value.contact_cards);
          if (Array.isArray(saved.value.faqs)) setFaqs(saved.value.faqs);
        }
        break;
      case 'media':
        setMediaList(prev => upsertInList(prev));
        break;
      default:
        break;
    }

    return saved;
  }, []);

  const handleDeleteCmsItem = useCallback(async (tableName, id) => {
    const res = await deleteCmsItem(tableName, id);
    const filterOut = (list) => list.filter(i => i.id !== id && i.slug_id !== id && i.banner_key !== id && i.theme_key !== id && i.box_key !== id);

    switch (tableName) {
      case 'products':
        setProducts(prev => filterOut(prev));
        break;
      case 'banners':
        setBanners(prev => filterOut(prev));
        break;
      case 'categories':
        setCategories(prev => filterOut(prev));
        break;
      case 'badges':
        setBadges(prev => filterOut(prev));
        break;
      case 'product_batches':
        setBatches(prev => filterOut(prev));
        break;
      case 'users':
        setMembers(prev => filterOut(prev));
        break;
      case 'home_sections':
        setHomeSections(prev => filterOut(prev));
        break;
      case 'homepage_slides':
        setHomeSlides(prev => prev.filter(i => i.id !== id && i.slide_key !== id));
        break;
      case 'homepage_items':
        setHomeItems(prev => prev.filter(i => i.id !== id));
        break;
      case 'themes':
        setThemes(prev => filterOut(prev));
        break;
      case 'homepage_steps':
        setHomeSteps(prev => filterOut(prev));
        break;
      case 'footer_links':
        setFooterLinks(prev => filterOut(prev));
        break;
      case 'offer_slides':
        setOfferSlides(prev => filterOut(prev));
        break;
      case 'offer_categories':
        setOfferCategories(prev => filterOut(prev));
        break;
      case 'offer_items':
        setOfferItems(prev => filterOut(prev));
        break;
      case 'media':
        setMediaList(prev => filterOut(prev));
        break;
      default:
        break;
    }

    return res;
  }, []);

  const handleUpdateDisplayOrder = useCallback(async (tableName, items, orderField = 'display_order') => {
    switch (tableName) {
      case 'products':
        setProducts([...items]);
        break;
      case 'banners':
        setBanners([...items]);
        break;
      case 'categories':
        setCategories([...items]);
        break;
      case 'home_sections':
        setHomeSections([...items]);
        break;
      case 'offer_items':
        setOfferItems([...items]);
        break;
      case 'offer_slides':
        setOfferSlides([...items]);
        break;
      case 'homepage_steps':
        setHomeSteps([...items]);
        break;
      case 'footer_links':
        setFooterLinks([...items]);
        break;
      default:
        break;
    }
    return await updateDisplayOrder(tableName, items, orderField);
  }, []);

  // --- PUBLIC ACTIVE PRODUCTS HELPER ---
  // Public website consumes active products transformed into UI format
  const activePublicProducts = products
    .filter((p) => p.is_active !== false)
    .sort((a, b) => (a.display_order || 999) - (b.display_order || 999))
    .map((p) => ({
      id: p.id || p.slug_id,
      slug_id: p.slug_id || p.id,
      db_id: p.id,
      title: p.title,
      subtitle: p.subtitle,
      description: p.description,
      descriptionPoints: Array.isArray(p.description_points) 
        ? p.description_points 
        : (p.description ? p.description.split('\n').filter(Boolean) : []),
      customInfo: Array.isArray(p.custom_info) && p.custom_info.length > 0 
        ? p.custom_info 
        : ['Instant Activation', 'WhatsApp Support Available', 'Payment via UPI'],
      price: Number(p.price),
      originalPrice: Number(p.original_price || p.price),
      discount: p.discount,
      image: p.image,
      images: Array.isArray(p.images) ? p.images : [p.image],
      category: p.category,
      categoryGroup: p.category_group || p.category,
      badge: p.badge,
      badges: Array.isArray(p.badges) ? p.badges : (p.badge ? [{ name: p.badge, text: p.badge, bg_color: '#e50914' }] : []),
      batches: Array.isArray(p.batches) ? p.batches : ['Best Seller'],
      sections: Array.isArray(p.sections) ? p.sections : ['Home', 'All OTTs'],
      inStock: p.in_stock !== false,
      isFeatured: p.is_featured,
      displayOrder: p.display_order || 1,
      homeOrder: p.home_order || p.display_order || 1,
      offersOrder: p.offers_order || p.display_order || 1,
      allOttsOrder: p.all_otts_order || p.display_order || 1,
      rating: Number(p.rating || 4.5),
      reviewsCount: p.reviews_count || 100
    }));

  // Helper to save sub-arrays to site_settings global_config
  const saveSiteConfigKey = useCallback(async (keyName, dataArray) => {
    try {
      const currentConfig = (siteSettings?.value ? { ...siteSettings, ...siteSettings.value } : siteSettings) || {};
      const updatedValue = {
        ...currentConfig,
        [keyName]: dataArray
      };
      const payload = {
        key: 'global_config',
        value: updatedValue
      };
      await handleSaveCmsItem('site_settings', payload);
      setSiteSettings(updatedValue);
      if (keyName === 'main_categories') setMainCategories(dataArray);
      if (keyName === 'sub_categories') setSubCategories(dataArray);
      if (keyName === 'support_cards') setSupportCards(dataArray);
      if (keyName === 'contact_cards') setContactCards(dataArray);
      if (keyName === 'faqs') setFaqs(dataArray);
      return true;
    } catch (e) {
      console.error(`Error saving site config ${keyName}:`, e);
      return false;
    }
  }, [siteSettings, handleSaveCmsItem]);

  return (
    <CMSContext.Provider
      value={{
        products,
        setProducts,
        activePublicProducts,
        banners,
        setBanners,
        categories,
        setCategories,
        mainCategories,
        setMainCategories,
        subCategories,
        setSubCategories,
        supportCards,
        setSupportCards,
        contactCards,
        setContactCards,
        faqs,
        setFaqs,
        badges,
        setBadges,
        batches,
        setBatches,
        members,
        setMembers,
        homeItems,
        setHomeItems,
        homeSlides,
        setHomeSlides,
        homeSections,
        setHomeSections,
        themes,
        setThemes,
        homeSteps,
        setHomeSteps,
        contactDetails,
        setContactDetails,
        footerLinks,
        setFooterLinks,
        offerSlides,
        setOfferSlides,
        offerCategories,
        setOfferCategories,
        offerItems,
        setOfferItems,
        cartSettings,
        setCartSettings,
        whatsAppTemplate,
        setWhatsAppTemplate,
        siteSettings,
        setSiteSettings,
        mediaList,
        setMediaList,
        loading,
        refreshAllData,
        saveSiteConfigKey,
        saveCmsItem: handleSaveCmsItem,
        deleteCmsItem: handleDeleteCmsItem,
        updateDisplayOrder: handleUpdateDisplayOrder,
        logActivity
      }}
    >
      {children}
    </CMSContext.Provider>
  );
}

export function useCMS() {
  const context = useContext(CMSContext);
  if (!context) {
    throw new Error('useCMS must be used within a CMSProvider');
  }
  return context;
}


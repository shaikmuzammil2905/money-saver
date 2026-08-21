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

const CMSContext = createContext(null);

export function CMSProvider({ children }) {
  // --- CMS STATE ---
  const [products, setProducts] = useState([]);
  const [banners, setBanners] = useState([]);
  const [categories, setCategories] = useState([]);
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
      if (sSettings?.value) setSiteSettings(sSettings.value);
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
        if (saved.value) setSiteSettings(prev => ({ ...prev, ...saved.value }));
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

  const valueProps = VALUE_PROPOSITIONS;

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


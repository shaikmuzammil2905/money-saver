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
  DEFAULT_SITE_SETTINGS
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
        getCmsTableData('products', mappedDefaultProducts),
        getCmsTableData('banners', DEFAULT_BANNERS),
        getCmsTableData('categories', mappedDefaultCategories),
        getCmsTableData('badges', DEFAULT_BADGES),
        getCmsTableData('product_batches', DEFAULT_BATCHES),
        getCmsTableData('users', []),
        getCmsTableData('homepage_steps', DEFAULT_HOMEPAGE_STEPS),
        getCmsSingleRecord('contact_details', DEFAULT_CONTACT_DETAILS),
        getCmsTableData('footer_links', DEFAULT_FOOTER_LINKS),
        getCmsTableData('offer_slides', DEFAULT_OFFER_SLIDES),
        getCmsTableData('offer_categories', []),
        getCmsTableData('offer_items', DEFAULT_OFFER_ITEMS),
        getCmsSingleRecord('cart_settings', DEFAULT_PAYMENT_CONFIG),
        getCmsSingleRecord('whatsapp_templates', { template_key: 'order_checkout', template_text: DEFAULT_WHATSAPP_TEMPLATE }),
        getCmsSingleRecord('site_settings', { key: 'global_config', value: DEFAULT_SITE_SETTINGS }),
        getCmsTableData('media', [])
      ]);

      setProducts(prods || []);
      setBanners(bnrs || []);
      setCategories(cats || []);
      setBadges(bdgs || []);
      setBatches(btchs || []);
      setMembers(usersList || []);
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

  // --- PUBLIC ACTIVE PRODUCTS HELPER ---
  // Public website consumes active products transformed into UI format
  const activePublicProducts = products
    .filter((p) => p.is_active !== false)
    .sort((a, b) => (a.display_order || 999) - (b.display_order || 999))
    .map((p) => ({
      id: p.slug_id || p.id,
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
        saveCmsItem,
        deleteCmsItem,
        updateDisplayOrder,
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

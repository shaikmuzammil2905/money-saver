import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { supabase } from '../services/supabase';
import {
  getCmsTableData,
  getCmsSingleRecord,
  saveCmsItem,
  deleteCmsItem,
  updateDisplayOrder,
  logActivity,
  DEFAULT_HOMEPAGE_SLIDES,
  DEFAULT_HOMEPAGE_ITEMS,
  DEFAULT_HOMEPAGE_STEPS,
  DEFAULT_CONTACT_DETAILS,
  DEFAULT_FOOTER_LINKS,
  DEFAULT_OFFER_SLIDES,
  DEFAULT_OFFER_ITEMS,
  DEFAULT_WHATSAPP_TEMPLATE,
  DEFAULT_SITE_SETTINGS
} from '../services/cmsService';
import { ALL_PRODUCTS, PRIMARY_CATEGORIES, SHOP_BY_CATEGORIES } from '../data/products';
import { DEFAULT_PAYMENT_CONFIG } from '../config/payment';

const CMSContext = createContext(null);

export function CMSProvider({ children }) {
  // --- CMS STATE ---
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [homeSlides, setHomeSlides] = useState([]);
  const [homeItems, setHomeItems] = useState([]);
  const [homeCategoryLayout, setHomeCategoryLayout] = useState({ columns: 4 });
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

      // Convert local products to initial format if needed
      const mappedDefaultProducts = ALL_PRODUCTS.map((p, idx) => ({
        slug_id: p.id,
        title: p.title,
        subtitle: p.subtitle || '',
        description: p.description || '',
        price: p.price,
        original_price: p.originalPrice || p.price,
        discount: p.discount || '',
        image: p.image,
        images: p.images || [p.image],
        category: p.category,
        category_group: p.categoryGroup || p.category,
        badge: p.badge || '',
        in_stock: p.inStock !== false,
        is_featured: p.badge === 'Hot Deal' || p.badge === 'Top OTT Deal' || idx < 4,
        display_order: idx + 1,
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

      // Parallel fetches from Supabase
      const [
        prods,
        cats,
        slides,
        items,
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
        getCmsTableData('categories', mappedDefaultCategories),
        getCmsTableData('homepage_slides', DEFAULT_HOMEPAGE_SLIDES),
        getCmsTableData('homepage_items', DEFAULT_HOMEPAGE_ITEMS),
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

      setProducts(prods);
      setCategories(cats);
      setHomeSlides(slides);
      setHomeItems(items);
      setHomeSteps(steps);
      if (contact) setContactDetails(contact);
      setFooterLinks(footer);
      setOfferSlides(oSlides);
      setOfferCategories(oCats);
      setOfferItems(oItems);
      if (cart) setCartSettings(cart);
      if (waTemp?.template_text) setWhatsAppTemplate(waTemp.template_text);
      if (sSettings?.value) setSiteSettings(sSettings.value);
      setMediaList(media);

    } catch (err) {
      console.error('Error refreshing CMS data:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshAllData();
  }, [refreshAllData]);

  // --- SUPABASE REALTIME LISTENER ---
  useEffect(() => {
    if (!supabase) return;

    const channel = supabase
      .channel('cms-changes')
      .on('postgres_changes', { event: '*', schema: 'public' }, () => {
        refreshAllData();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [refreshAllData]);

  // --- PUBLIC ACTIVE PRODUCT HELPER ---
  // Public site displays active products transformed back to UI props format
  const activePublicProducts = products
    .filter((p) => p.is_active !== false)
    .sort((a, b) => (a.display_order || 999) - (b.display_order || 999))
    .map((p) => ({
      id: p.slug_id || p.id,
      db_id: p.id,
      title: p.title,
      subtitle: p.subtitle,
      description: p.description,
      price: Number(p.price),
      originalPrice: Number(p.original_price || p.price),
      discount: p.discount,
      image: p.image,
      images: Array.isArray(p.images) ? p.images : [p.image],
      category: p.category,
      categoryGroup: p.category_group || p.category,
      badge: p.badge,
      inStock: p.in_stock !== false,
      isFeatured: p.is_featured,
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
        categories,
        setCategories,
        homeSlides,
        setHomeSlides,
        homeItems,
        setHomeItems,
        homeCategoryLayout,
        setHomeCategoryLayout,
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

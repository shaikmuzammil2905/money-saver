// Order & Customer Database Service (Supabase + Fallback Storage)
import { supabase } from './supabase';

const ORDERS_STORAGE_KEY = 'ott_orders';
const USER_STORAGE_KEY = 'ott_user';

/**
 * Generate a unique, professional Order ID (e.g. ORD-83921)
 */
export function generateOrderId() {
  const randomDigits = Math.floor(10000 + Math.random() * 90000);
  return `ORD-${randomDigits}`;
}

/**
 * Get saved Customer User Profile
 */
export function getUserProfile() {
  try {
    const saved = localStorage.getItem(USER_STORAGE_KEY);
    return saved ? JSON.parse(saved) : null;
  } catch (err) {
    console.error('Error reading user profile:', err);
    return null;
  }
}

/**
 * Save / Update Customer User Profile
 */
export async function saveUserProfile(userData) {
  try {
    // 1. Save locally
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(userData));

    // 2. Sync to Supabase if available
    if (supabase) {
      const payload = {
        full_name: userData.fullName,
        mobile_number: userData.mobileNumber || null,
        email: userData.email || null,
        location: userData.location || null,
        updated_at: new Date().toISOString()
      };

      const { error } = await supabase.from('users').upsert(
        payload,
        { onConflict: userData.mobileNumber ? 'mobile_number' : 'email' }
      );
      if (error) console.warn('Supabase user upsert warning:', error.message);
    }
  } catch (err) {
    console.error('Error saving user profile:', err);
  }
  return userData;
}

import { uploadToCloudinary } from './cloudinary';

/**
 * Upload Payment Proof Screenshot to Cloudinary or Supabase Storage
 */
export async function uploadPaymentScreenshot(file) {
  if (!file) return null;

  // 1. Try Cloudinary Upload first (returns direct public HTTPS URL for WhatsApp & Admin)
  try {
    const res = await uploadToCloudinary(file, 'payment-screenshots');
    if (res?.url) {
      return res.url;
    }
  } catch (cloudinaryErr) {
    console.warn('Cloudinary payment screenshot upload failed, trying Supabase Storage:', cloudinaryErr.message);
  }

  // 2. Try Supabase Storage
  if (supabase) {
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `screenshot_${Date.now()}_${Math.random().toString(36).substring(2, 8)}.${fileExt}`;
      const filePath = `screenshots/${fileName}`;

      const { data, error } = await supabase.storage
        .from('payment-screenshots')
        .upload(filePath, file);

      if (!error && data) {
        const { data: publicUrlData } = supabase.storage
          .from('payment-screenshots')
          .getPublicUrl(filePath);

        if (publicUrlData?.publicUrl) {
          return publicUrlData.publicUrl;
        }
      }
    } catch (err) {
      console.warn('Supabase Storage upload fallback:', err.message);
    }
  }

  // 3. Fallback: Read file as Data URL
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result);
    reader.onerror = () => resolve(null);
    reader.readAsDataURL(file);
  });
}

/**
 * Save Order Record to Supabase & LocalStorage
 */
export async function createOrder(orderPayload) {
  const orderId = orderPayload.orderId || generateOrderId();
  const timestamp = new Date().toISOString();

  const newOrder = {
    orderId,
    customerName: orderPayload.customerName,
    mobileNumber: orderPayload.mobileNumber,
    location: orderPayload.location,
    items: orderPayload.items || [],
    subtotal: orderPayload.subtotal,
    totalOriginal: orderPayload.totalOriginal,
    totalSavings: orderPayload.totalSavings,
    totalAmount: orderPayload.totalAmount,
    paymentStatus: orderPayload.paymentStatus, // 'Payment Pending' or 'Payment Verification Pending'
    paymentScreenshotUrl: orderPayload.paymentScreenshotUrl || null,
    orderStatus: 'New', // 'New', 'Processing', 'Completed', 'Cancelled'
    createdAt: timestamp
  };

  // 1. Save to LocalStorage
  try {
    const existingOrders = JSON.parse(localStorage.getItem(ORDERS_STORAGE_KEY) || '[]');
    existingOrders.unshift(newOrder);
    localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(existingOrders));
  } catch (err) {
    console.error('Error saving order to localStorage:', err);
  }

  // 2. Save to Supabase if configured
  if (supabase) {
    try {
      const { data: insertedOrder, error: orderErr } = await supabase
        .from('orders')
        .insert({
          order_id: orderId,
          customer_name: orderPayload.customerName,
          mobile_number: orderPayload.mobileNumber,
          location: orderPayload.location,
          subtotal: orderPayload.subtotal,
          total_amount: orderPayload.totalAmount,
          payment_status: orderPayload.paymentStatus,
          payment_screenshot_url: orderPayload.paymentScreenshotUrl || null,
          order_status: 'New',
          created_at: timestamp
        })
        .select()
        .single();

      if (!orderErr && insertedOrder && orderPayload.items?.length > 0) {
        const orderItemsPayload = orderPayload.items.map((item) => ({
          order_id: orderId,
          product_id: item.id,
          title: item.title,
          subtitle: item.subtitle || '',
          unit_price: item.price,
          quantity: item.quantity,
          total_price: item.price * item.quantity
        }));

        await supabase.from('order_items').insert(orderItemsPayload);
      }
    } catch (err) {
      console.warn('Supabase order insert warning:', err.message);
    }
  }

  return newOrder;
}

/**
 * Fetch Order History for a Customer
 */
export async function getCustomerOrders(mobileNumber) {
  let orders = [];

  // Try LocalStorage first
  try {
    const local = JSON.parse(localStorage.getItem(ORDERS_STORAGE_KEY) || '[]');
    if (mobileNumber) {
      orders = local.filter((o) => o.mobileNumber === mobileNumber);
    } else {
      orders = local;
    }
  } catch (err) {
    console.error('Error reading local orders:', err);
  }

  // Try fetching from Supabase if available
  if (supabase && mobileNumber) {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select('*, order_items(*)')
        .eq('mobile_number', mobileNumber)
        .order('created_at', { ascending: false });

      if (!error && data && data.length > 0) {
        return data.map((d) => ({
          orderId: d.order_id,
          customerName: d.customer_name,
          mobileNumber: d.mobile_number,
          location: d.location,
          items: d.order_items ? d.order_items.map((item) => ({
            id: item.product_id,
            title: item.title,
            subtitle: item.subtitle,
            price: item.unit_price,
            quantity: item.quantity
          })) : [],
          subtotal: d.subtotal,
          totalAmount: d.total_amount,
          paymentStatus: d.payment_status,
          paymentScreenshotUrl: d.payment_screenshot_url,
          orderStatus: d.order_status,
          createdAt: d.created_at
        }));
      }
    } catch (err) {
      console.warn('Supabase fetch orders warning:', err.message);
    }
  }

  return orders;
}

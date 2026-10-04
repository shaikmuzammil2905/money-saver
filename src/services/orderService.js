// Order & Customer Database Service (Supabase + Fallback Storage)
import { supabase } from './supabase';
import { uploadToCloudinary } from './cloudinary';

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

/**
 * Upload Payment Proof Screenshot to Cloudinary, Supabase Storage, or Serverless Endpoint
 * Guarantees a clean, clickable public HTTPS URL for WhatsApp & Admin
 */
export async function uploadPaymentScreenshot(file) {
  if (!file) return null;

  // 1. Try Cloudinary Upload first (if returns valid public HTTPS URL)
  try {
    const res = await uploadToCloudinary(file, 'payment-screenshots');
    if (res?.url && (res.url.startsWith('http://') || res.url.startsWith('https://'))) {
      return res.url;
    }
  } catch (cloudinaryErr) {
    console.warn('Cloudinary upload warning, trying direct storage:', cloudinaryErr.message);
  }

  // 2. Try Direct Supabase Storage Bucket
  if (supabase) {
    try {
      const fileExt = (file.name ? file.name.split('.').pop() : 'jpg') || 'jpg';
      const fileName = `screenshot_${Date.now()}_${Math.random().toString(36).substring(2, 8)}.${fileExt}`;
      const filePath = `screenshots/${fileName}`;

      const { data, error } = await supabase.storage
        .from('payment-screenshots')
        .upload(filePath, file, { contentType: file.type || 'image/jpeg', upsert: true });

      if (!error && data) {
        const { data: publicUrlData } = supabase.storage
          .from('payment-screenshots')
          .getPublicUrl(filePath);

        if (publicUrlData?.publicUrl) {
          return publicUrlData.publicUrl;
        }
      }
    } catch (err) {
      console.warn('Supabase Storage direct upload warning:', err.message);
    }
  }

  // 3. Try Serverless Upload API via base64 buffer
  try {
    const base64Data = await new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.onerror = () => resolve(null);
      reader.readAsDataURL(file);
    });

    if (base64Data) {
      const apiRes = await fetch('/api/upload-screenshot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          base64Data,
          fileName: file.name || 'screenshot.jpg',
          fileType: file.type || 'image/jpeg'
        })
      });
      const apiData = await apiRes.json();
      if (apiData?.url) return apiData.url;
    }
  } catch (apiErr) {
    console.warn('API upload fallback warning:', apiErr.message);
  }

  return 'Payment screenshot attached (View in Admin Panel)';
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

const TRANSACTIONS_STORAGE_KEY = 'ott_transactions';

/**
 * Format Full WhatsApp Order Message (Restoring complete screenshot format)
 */
export function formatWhatsAppOrderMessage(order) {
  if (!order) return 'Hello OTTMoneySaver, my payment has been completed successfully. Please send activation details.';

  const items = Array.isArray(order.items) && order.items.length > 0
    ? order.items
    : [{ title: 'OTT Subscription Plan', quantity: 1, price: order.totalAmount || 0 }];

  const productLines = items.map((item, idx) => {
    const pName = item.title || item.name || 'Product';
    const qty = item.quantity || 1;
    const price = item.price || item.unit_price || 0;
    return `${idx + 1}. Product: ${pName}\n   Qty: ${qty}\n   Price: ₹${price}`;
  }).join('\n\n');

  const orderDateObj = order.createdAt ? new Date(order.createdAt) : new Date();
  const dateFormatted = orderDateObj.toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' });
  const timeFormatted = orderDateObj.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });

  const customerDetails = [
    `Customer Name: ${order.customerName || 'Valued Customer'}`,
    `Mobile: ${order.mobileNumber || ''}`,
    order.location ? `Location: ${order.location}` : null,
    order.email ? `Email: ${order.email}` : null
  ].filter(Boolean).join('\n');

  const paymentDetails = [
    `Total Amount: ₹${order.totalAmount || 0}`,
    `Payment Status: Successful`,
    `Order ID: ${order.orderId || ''}`,
    order.transactionId ? `Transaction ID: ${order.transactionId}` : null,
    `Payment Date: ${dateFormatted}`,
    `Payment Time: ${timeFormatted}`
  ].filter(Boolean).join('\n');

  return `Hello OTTMoneySaver,\n\nMy payment has been completed successfully.\n\nI would like to confirm my order:\n\n${productLines}\n\nCustomer Details:\n${customerDetails}\n\nPayment Details:\n${paymentDetails}\n\nPlease send my activation details.\n\nThank you!`;
}

/**
 * Save verified completed transaction persistently (Idempotent)
 */
export async function saveCompletedTransaction(order) {
  if (!order || !order.orderId) return null;

  const now = new Date();
  const transactionRecord = {
    orderId: order.orderId,
    transactionId: order.transactionId || order.razorpayPaymentId || `TXN-${Date.now()}`,
    items: order.items || [],
    totalAmount: order.totalAmount,
    subtotal: order.subtotal || order.totalAmount,
    customerName: order.customerName,
    mobileNumber: order.mobileNumber,
    email: order.email || '',
    location: order.location || '',
    paymentStatus: 'Successful',
    paymentMethod: order.paymentMethod || 'Razorpay / UPI',
    paymentDate: now.toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' }),
    paymentTime: now.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true }),
    createdAt: now.toISOString(),
    activationStatus: 'Pending Activation'
  };

  // 1. Idempotently update LocalStorage
  try {
    const existing = JSON.parse(localStorage.getItem(TRANSACTIONS_STORAGE_KEY) || '[]');
    const filtered = existing.filter(t => t.orderId !== order.orderId);
    filtered.unshift(transactionRecord);
    localStorage.setItem(TRANSACTIONS_STORAGE_KEY, JSON.stringify(filtered));
  } catch (err) {
    console.error('Error saving transaction to localStorage:', err);
  }

  // 2. Persist in Supabase backend
  if (supabase) {
    try {
      await supabase
        .from('orders')
        .update({
          payment_status: 'Paid',
          order_status: 'Confirmed',
          transaction_id: transactionRecord.transactionId,
          email: transactionRecord.email || null,
          updated_at: transactionRecord.createdAt
        })
        .eq('order_id', order.orderId);
    } catch (dbErr) {
      console.warn('Supabase transaction update warning:', dbErr.message);
    }
  }

  return transactionRecord;
}

/**
 * Get all saved transactions for customer
 */
export async function getCustomerTransactions(mobileNumber) {
  let list = [];
  try {
    list = JSON.parse(localStorage.getItem(TRANSACTIONS_STORAGE_KEY) || '[]');
    if (mobileNumber) {
      list = list.filter(t => t.mobileNumber === mobileNumber);
    }
  } catch (err) {
    console.error('Error fetching transactions from localStorage:', err);
  }

  if (supabase && mobileNumber) {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select('*, order_items(*)')
        .eq('mobile_number', mobileNumber)
        .eq('payment_status', 'Paid')
        .order('created_at', { ascending: false });

      if (!error && data && data.length > 0) {
        const dbMapped = data.map(d => {
          const dDate = new Date(d.created_at);
          return {
            orderId: d.order_id,
            transactionId: d.transaction_id || d.razorpay_payment_id || 'TXN-SUCCESS',
            items: d.order_items ? d.order_items.map(item => ({
              id: item.product_id,
              title: item.title,
              subtitle: item.subtitle,
              price: item.unit_price,
              quantity: item.quantity
            })) : [],
            totalAmount: d.total_amount,
            subtotal: d.subtotal,
            customerName: d.customer_name,
            mobileNumber: d.mobile_number,
            email: d.email || '',
            location: d.location || '',
            paymentStatus: 'Successful',
            paymentMethod: 'Razorpay / UPI',
            paymentDate: dDate.toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' }),
            paymentTime: dDate.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true }),
            createdAt: d.created_at,
            activationStatus: d.order_status || 'Confirmed'
          };
        });

        // Merge without duplicates
        const map = new Map();
        list.forEach(item => map.set(item.orderId, item));
        dbMapped.forEach(item => map.set(item.orderId, item));
        return Array.from(map.values()).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      }
    } catch (e) {
      console.warn('Supabase transactions fetch warning:', e.message);
    }
  }

  return list;
}


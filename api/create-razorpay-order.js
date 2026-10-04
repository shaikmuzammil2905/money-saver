import Razorpay from 'razorpay';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL || 'https://mhxcchmkqqtdzksxzzbk.supabase.co';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1oeGNjaG1rcXF0ZHprc3h6emJrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODY2ODAxNjAsImV4cCI6MjEwMjI1NjE2MH0.Zsvchy5g155Xx1zFstT5OyU8yNBEB2Boyq3oHVmzTU8';

const supabase = createClient(supabaseUrl, supabaseKey);

async function parseBody(req) {
  if (req.body && typeof req.body === 'object') return req.body;
  if (typeof req.body === 'string') {
    try {
      return JSON.parse(req.body);
    } catch {
      return {};
    }
  }
  return new Promise((resolve) => {
    let data = '';
    req.on('data', (chunk) => { data += chunk; });
    req.on('end', () => {
      try {
        resolve(JSON.parse(data || '{}'));
      } catch {
        resolve({});
      }
    });
  });
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const body = await parseBody(req);
    const { items = [], couponCode = '', customerName = '', customerPhone = '', customerEmail = '', customerLocation = '' } = body;

    if (!items || items.length === 0) {
      return res.status(400).json({ error: 'Cart is empty' });
    }

    if (!customerName || !customerPhone) {
      return res.status(400).json({ error: 'Customer name and mobile number are required' });
    }

    // 1. Calculate Subtotal from trusted product items
    const subtotal = items.reduce((acc, item) => {
      const price = Number(item.price) || 0;
      const qty = Math.max(1, Number(item.quantity) || 1);
      return acc + (price * qty);
    }, 0);

    // 2. Validate Coupon if provided
    let discount = 0;
    let appliedCoupon = null;

    if (couponCode && couponCode.trim()) {
      const cleanCode = couponCode.trim().toUpperCase();
      let couponsList = [];

      // Check site_settings fallback
      const { data: cData } = await supabase.from('site_settings').select('*').eq('key', 'cms_table_coupons').maybeSingle();
      if (cData && Array.isArray(cData.value)) {
        couponsList = cData.value;
      } else {
        const { data: dbCoupons } = await supabase.from('coupons').select('*');
        if (dbCoupons) couponsList = dbCoupons;
      }

      const found = couponsList.find(c => (c.code || '').toUpperCase() === cleanCode && c.is_active !== false);
      if (found) {
        const now = Date.now();
        const isNotStarted = found.starts_at && now < new Date(found.starts_at).getTime();
        const isExpired = found.expires_at && now > new Date(found.expires_at).getTime();

        if (!isNotStarted && !isExpired) {
          appliedCoupon = found;
          if (found.discount_type === 'percentage') {
            discount = Math.round((subtotal * Number(found.discount_value)) / 100);
            if (found.max_discount && Number(found.max_discount) > 0) {
              discount = Math.min(discount, Number(found.max_discount));
            }
          } else {
            discount = Number(found.discount_value);
          }
        }
      }
    }

    discount = Math.min(discount, subtotal);
    const finalAmount = Math.max(1, subtotal - discount); // Razorpay min 1 INR

    // 3. Generate unique OMS Order ID
    const todayStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    const appOrderId = `OMS-${todayStr}-${Math.floor(1000 + Math.random() * 9000)}`;

    // 4. Initialize Razorpay Client
    const razorpayKeyId = process.env.RAZORPAY_KEY_ID || process.env.VITE_RAZORPAY_KEY_ID;
    const razorpaySecret = process.env.RAZORPAY_KEY_SECRET;

    let razorpayOrderId = null;

    if (razorpayKeyId && razorpaySecret) {
      const razorpay = new Razorpay({
        key_id: razorpayKeyId,
        key_secret: razorpaySecret
      });

      const options = {
        amount: Math.round(finalAmount * 100), // in paise
        currency: 'INR',
        receipt: appOrderId,
        notes: {
          customerName: customerName.trim(),
          mobileNumber: customerPhone.trim(),
          couponCode: appliedCoupon?.code || 'NONE'
        }
      };

      const order = await razorpay.orders.create(options);
      razorpayOrderId = order.id;
    } else {
      // In development or if Razorpay keys not yet set in Vercel
      razorpayOrderId = `order_sim_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
    }

    // 5. Store pending order in Supabase
    try {
      await supabase.from('orders').insert({
        order_id: appOrderId,
        customer_name: customerName.trim(),
        mobile_number: customerPhone.trim(),
        email: customerEmail?.trim() || null,
        location: customerLocation.trim(),
        subtotal: subtotal,
        total_amount: finalAmount,
        payment_status: 'Pending',
        order_status: 'Pending',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      });

      // Insert Order Items
      if (items.length > 0) {
        const orderItemsPayload = items.map(item => ({
          order_id: appOrderId,
          product_id: String(item.id || item.slug_id || ''),
          title: item.title || 'Product',
          subtitle: item.subtitle || '',
          unit_price: Number(item.price) || 0,
          quantity: Math.max(1, Number(item.quantity) || 1),
          total_price: (Number(item.price) || 0) * Math.max(1, Number(item.quantity) || 1),
          created_at: new Date().toISOString()
        }));

        await supabase.from('order_items').insert(orderItemsPayload);
      }
    } catch (dbErr) {
      console.warn('Order database insert warning:', dbErr.message);
    }

    return res.status(200).json({
      success: true,
      orderId: razorpayOrderId,
      amount: Math.round(finalAmount * 100),
      currency: 'INR',
      keyId: razorpayKeyId || 'rzp_test_placeholder',
      appOrderId,
      finalAmount,
      discount
    });

  } catch (err) {
    console.error('Razorpay order creation error:', err);
    return res.status(500).json({ error: err.message || 'Failed to create payment order' });
  }
}

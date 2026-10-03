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
    const razorpayKeyId = process.env.RAZORPAY_KEY_ID || process.env.VITE_RAZORPAY_KEY_ID;
    const razorpaySecret = process.env.RAZORPAY_KEY_SECRET;

    if (!razorpayKeyId || !razorpaySecret) {
      return res.status(401).json({ error: 'Razorpay credentials not configured in environment variables (RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET)' });
    }

    const razorpay = new Razorpay({
      key_id: razorpayKeyId,
      key_secret: razorpaySecret
    });

    // 1. Check if direct amount (in paise) was provided
    let amountInPaise = 0;
    let receiptId = body.receipt;
    let customerName = body.customerName || 'Customer';
    let customerPhone = body.customerPhone || '';
    let notes = body.notes || {};

    if (body.amount && Number(body.amount) >= 100) {
      amountInPaise = Math.round(Number(body.amount));
      if (!receiptId) {
        receiptId = `rcpt_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
      }
    } else if (Array.isArray(body.items) && body.items.length > 0) {
      // Calculate from items
      const subtotal = body.items.reduce((acc, item) => {
        const price = Number(item.price) || 0;
        const qty = Math.max(1, Number(item.quantity) || 1);
        return acc + (price * qty);
      }, 0);

      // Validate Coupon if provided
      let discount = 0;
      if (body.couponCode) {
        const cleanCode = body.couponCode.trim().toUpperCase();
        try {
          const { data: cData } = await supabase.from('site_settings').select('*').eq('key', 'cms_table_coupons').maybeSingle();
          const couponsList = (cData && Array.isArray(cData.value)) ? cData.value : [];
          const found = couponsList.find(c => (c.code || '').toUpperCase() === cleanCode && c.is_active !== false);
          if (found) {
            const now = Date.now();
            const isNotStarted = found.starts_at && now < new Date(found.starts_at).getTime();
            const isExpired = found.expires_at && now > new Date(found.expires_at).getTime();
            if (!isNotStarted && !isExpired) {
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
        } catch {}
      }

      const finalAmount = Math.max(1, subtotal - discount);
      amountInPaise = Math.round(finalAmount * 100);
      const todayStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
      receiptId = `OMS-${todayStr}-${Math.floor(1000 + Math.random() * 9000)}`;
      notes = {
        customerName: body.customerName || '',
        customerPhone: body.customerPhone || '',
        couponCode: body.couponCode || 'NONE'
      };
    } else {
      return res.status(400).json({ error: 'Invalid order request: amount must be >= 100 paise or cart items must be provided' });
    }

    if (amountInPaise < 100) {
      return res.status(400).json({ error: 'Minimum transaction amount is 100 paise (₹1)' });
    }

    const options = {
      amount: amountInPaise,
      currency: body.currency || 'INR',
      receipt: receiptId,
      notes
    };

    const order = await razorpay.orders.create(options);

    // Save order record to Supabase if database exists
    try {
      await supabase.from('orders').insert({
        order_id: receiptId,
        customer_name: (body.customerName || 'Customer').trim(),
        mobile_number: (body.customerPhone || '').trim(),
        location: (body.customerLocation || '').trim(),
        subtotal: amountInPaise / 100,
        total_amount: amountInPaise / 100,
        payment_status: 'Pending',
        order_status: 'Pending',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      });
    } catch {}

    return res.status(200).json({
      success: true,
      order_id: order.id,
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      receipt: order.receipt,
      key_id: razorpayKeyId,
      keyId: razorpayKeyId,
      appOrderId: receiptId
    });

  } catch (err) {
    console.error('Razorpay order creation error:', err);
    return res.status(500).json({ error: err.message || 'Failed to create Razorpay order' });
  }
}

import crypto from 'crypto';
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
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, appOrderId } = body;

    const secret = process.env.RAZORPAY_KEY_SECRET;

    let isValid = false;

    if (secret && razorpay_order_id && razorpay_payment_id && razorpay_signature) {
      const hmac = crypto.createHmac('sha256', secret);
      hmac.update(`${razorpay_order_id}|${razorpay_payment_id}`);
      const generatedSignature = hmac.digest('hex');
      isValid = generatedSignature === razorpay_signature;
    }

    if (!isValid) {
      if (appOrderId) {
        await supabase
          .from('orders')
          .update({
            payment_status: 'Failed',
            updated_at: new Date().toISOString()
          })
          .eq('order_id', appOrderId);
      }
      return res.status(400).json({ success: false, message: 'Invalid payment signature verification failed.' });
    }

    // Payment Verified Successfully: Update Supabase Order
    if (appOrderId) {
      await supabase
        .from('orders')
        .update({
          payment_status: 'Paid',
          order_status: 'Confirmed',
          transaction_id: razorpay_payment_id || null,
          razorpay_payment_id: razorpay_payment_id || null,
          razorpay_order_id: razorpay_order_id || null,
          updated_at: new Date().toISOString()
        })
        .eq('order_id', appOrderId);
    }

    return res.status(200).json({
      success: true,
      message: 'Payment verified and order confirmed successfully.',
      appOrderId,
      transactionId: razorpay_payment_id
    });

  } catch (err) {
    console.error('Payment verification error:', err);
    return res.status(500).json({ error: err.message || 'Payment verification failed' });
  }
}

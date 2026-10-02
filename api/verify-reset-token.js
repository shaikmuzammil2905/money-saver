import crypto from 'crypto';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL || 'https://mhxcchmkqqtdzksxzzbk.supabase.co';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1oeGNjaG1rcXF0ZHprc3h6emJrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODY2ODAxNjAsImV4cCI6MjEwMjI1NjE2MH0.Zsvchy5g155Xx1zFstT5OyU8yNBEB2Boyq3oHVmzTU8';

const supabase = createClient(supabaseUrl, supabaseKey);

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,POST');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const token = req.query?.token || req.body?.token;
  if (!token) {
    return res.status(400).json({ valid: false, error: 'Token is required' });
  }

  const tokenHash = crypto.createHash('sha256').update(token.trim()).digest('hex');

  try {
    let record = null;
    const { data } = await supabase
      .from('admin_password_resets')
      .select('*')
      .eq('token_hash', tokenHash)
      .eq('used', false)
      .maybeSingle();

    if (data) record = data;

    if (!record) {
      const { data: storeData } = await supabase
        .from('site_settings')
        .select('value')
        .eq('key', 'admin_password_resets_store')
        .maybeSingle();
      const list = Array.isArray(storeData?.value) ? storeData.value : [];
      const match = list.find((item) => item.token_hash === tokenHash && !item.used);
      if (match) record = match;
    }

    if (!record) {
      return res.status(400).json({ valid: false, error: 'Invalid or already used reset link.' });
    }

    if (new Date(record.expires_at) < new Date()) {
      return res.status(400).json({ valid: false, error: 'Reset link has expired.' });
    }

    return res.status(200).json({ valid: true, email: record.email });
  } catch (err) {
    return res.status(500).json({ valid: false, error: 'Server error verifying token' });
  }
}

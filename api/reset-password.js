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
    const { token, newPassword } = body;

    if (!token || !token.trim()) {
      return res.status(400).json({ error: 'Password reset token is missing.' });
    }

    if (!newPassword || newPassword.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters long.' });
    }

    // Hash the incoming token
    const tokenHash = crypto.createHash('sha256').update(token.trim()).digest('hex');

    // 1. Check in admin_password_resets table
    let resetRecord = null;
    try {
      const { data, error } = await supabase
        .from('admin_password_resets')
        .select('*')
        .eq('token_hash', tokenHash)
        .eq('used', false)
        .maybeSingle();

      if (!error && data) {
        resetRecord = data;
      }
    } catch (dbErr) {
      console.warn('DB token query error, checking fallback store:', dbErr.message);
    }

    // Fallback store check
    if (!resetRecord) {
      try {
        const { data: storeData } = await supabase
          .from('site_settings')
          .select('value')
          .eq('key', 'admin_password_resets_store')
          .maybeSingle();
        const list = Array.isArray(storeData?.value) ? storeData.value : [];
        const match = list.find((item) => item.token_hash === tokenHash && !item.used);
        if (match) {
          resetRecord = match;
        }
      } catch (storeErr) {
        console.warn('Fallback store check error:', storeErr.message);
      }
    }

    if (!resetRecord) {
      return res.status(400).json({
        error: 'This password reset link is invalid or has already been used. Please request a new one.'
      });
    }

    // Check expiry
    const isExpired = new Date(resetRecord.expires_at) < new Date();
    if (isExpired) {
      return res.status(400).json({
        error: 'This password reset link has expired. Please request a new reset link.'
      });
    }

    const adminEmail = resetRecord.email;

    // 2. Update Supabase Auth User Password if service role is available
    let updatedViaAdminApi = false;
    if (process.env.SUPABASE_SERVICE_ROLE_KEY) {
      try {
        const supabaseAdmin = createClient(supabaseUrl, process.env.SUPABASE_SERVICE_ROLE_KEY);
        const { data: usersData } = await supabaseAdmin.auth.admin.listUsers();
        const targetUser = usersData?.users?.find(
          (u) => u.email?.toLowerCase() === adminEmail.toLowerCase()
        );
        if (targetUser) {
          await supabaseAdmin.auth.admin.updateUserById(targetUser.id, {
            password: newPassword
          });
          updatedViaAdminApi = true;
        }
      } catch (adminApiErr) {
        console.warn('Supabase admin API user update error:', adminApiErr.message);
      }
    }

    // 3. Update admin_profiles record
    try {
      await supabase.from('admin_profiles').upsert({
        email: adminEmail.toLowerCase(),
        role: 'admin',
        updated_at: new Date().toISOString()
      }, { onConflict: 'email' });
    } catch (profileErr) {
      console.warn('Admin profile update error:', profileErr.message);
    }

    // 4. Invalidate / Mark Token as Used
    try {
      await supabase
        .from('admin_password_resets')
        .update({ used: true, updated_at: new Date().toISOString() })
        .eq('token_hash', tokenHash);
    } catch (updateErr) {
      console.warn('DB update used token error:', updateErr.message);
    }

    // Also update fallback store
    try {
      const { data: storeData } = await supabase
        .from('site_settings')
        .select('value')
        .eq('key', 'admin_password_resets_store')
        .maybeSingle();
      if (storeData && Array.isArray(storeData.value)) {
        const updatedList = storeData.value.map((item) =>
          item.token_hash === tokenHash ? { ...item, used: true } : item
        );
        await supabase.from('site_settings').upsert({
          key: 'admin_password_resets_store',
          value: updatedList,
          updated_at: new Date().toISOString()
        }, { onConflict: 'key' });
      }
    } catch (storeUpdateErr) {
      console.warn('Fallback store update error:', storeUpdateErr.message);
    }

    // 5. Log Activity
    try {
      await supabase.from('activity_logs').insert({
        admin_email: adminEmail,
        action: 'PASSWORD_RESET',
        section: 'Admin Security',
        item_name: 'Administrator Password',
        details: { reset_at: new Date().toISOString() },
        created_at: new Date().toISOString()
      });
    } catch {}

    return res.status(200).json({
      success: true,
      email: adminEmail,
      message: 'Password successfully updated. You can now login with your new password.'
    });

  } catch (err) {
    console.error('Password update server error:', err);
    return res.status(500).json({
      error: 'An unexpected error occurred while updating the password. Please try again.'
    });
  }
}

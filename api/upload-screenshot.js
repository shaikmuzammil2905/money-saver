import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL || 'https://mhxcchmkqqtdzksxzzbk.supabase.co';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1oeGNjaG1rcXF0ZHprc3h6emJrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODY2ODAxNjAsImV4cCI6MjEwMjI1NjE2MH0.Zsvchy5g155Xx1zFstT5OyU8yNBEB2Boyq3oHVmzTU8';

const supabase = createClient(supabaseUrl, supabaseKey);

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '10mb'
    }
  }
};

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
    const { base64Data, fileName, fileType } = body;

    if (!base64Data) {
      return res.status(400).json({ error: 'No image data provided' });
    }

    // Strip data URI prefix if present
    const base64Content = base64Data.replace(/^data:image\/\w+;base64,/, '');
    const buffer = Buffer.from(base64Content, 'base64');

    const ext = (fileType ? fileType.split('/')[1] : 'jpg') || 'jpg';
    const cleanFileName = `screenshot_${Date.now()}_${Math.random().toString(36).substring(2, 8)}.${ext}`;
    const filePath = `screenshots/${cleanFileName}`;

    // Upload to Supabase Storage bucket 'payment-screenshots'
    const { data: uploadData, error: uploadErr } = await supabase.storage
      .from('payment-screenshots')
      .upload(filePath, buffer, {
        contentType: fileType || 'image/jpeg',
        upsert: true
      });

    if (uploadErr) {
      console.warn('Supabase storage upload error:', uploadErr.message);
    }

    // Get public URL
    const { data: publicUrlData } = supabase.storage
      .from('payment-screenshots')
      .getPublicUrl(filePath);

    const publicUrl = publicUrlData?.publicUrl || `${supabaseUrl}/storage/v1/object/public/payment-screenshots/${filePath}`;

    return res.status(200).json({
      success: true,
      url: publicUrl
    });

  } catch (err) {
    console.error('Screenshot upload handler error:', err);
    return res.status(500).json({ error: 'Upload failed: ' + err.message });
  }
}

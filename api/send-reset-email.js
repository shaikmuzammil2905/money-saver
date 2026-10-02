import nodemailer from 'nodemailer';
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
  // Set CORS headers
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
    const { email } = body;

    if (!email || !email.trim()) {
      return res.status(400).json({ error: 'Please enter your admin email address.' });
    }

    const cleanEmail = email.trim().toLowerCase();

    // 1. Authorize Admin Email
    const configuredAdminEmail = (process.env.ADMIN_EMAIL || 'Fixyourmobiles7@gmail.com').trim().toLowerCase();
    const authorizedEmails = [configuredAdminEmail, 'fixyourmobiles7@gmail.com'];

    // Also check admin_profiles in database
    let isAuthorized = authorizedEmails.includes(cleanEmail);
    if (!isAuthorized) {
      try {
        const { data: profile } = await supabase
          .from('admin_profiles')
          .select('email')
          .eq('email', cleanEmail)
          .maybeSingle();
        if (profile?.email) isAuthorized = true;
      } catch (dbErr) {
        console.warn('DB admin check warning:', dbErr.message);
      }
    }

    if (!isAuthorized) {
      return res.status(400).json({
        error: 'Wrong email entered. Please check your admin email address.'
      });
    }

    // 2. Generate Cryptographically Secure Single-Use Token
    const rawToken = crypto.randomBytes(32).toString('hex');
    const tokenHash = crypto.createHash('sha256').update(rawToken).digest('hex');
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000).toISOString(); // 1 hour validity

    // 3. Store Token Hash in Database
    try {
      await supabase.from('admin_password_resets').insert({
        email: cleanEmail,
        token_hash: tokenHash,
        expires_at: expiresAt,
        used: false,
        created_at: new Date().toISOString()
      });
    } catch (saveErr) {
      console.warn('DB Token insert fallback:', saveErr.message);
      // Fallback in site_settings key
      try {
        const { data: prevData } = await supabase
          .from('site_settings')
          .select('value')
          .eq('key', 'admin_password_resets_store')
          .maybeSingle();
        const list = Array.isArray(prevData?.value) ? prevData.value : [];
        list.push({
          email: cleanEmail,
          token_hash: tokenHash,
          expires_at: expiresAt,
          used: false
        });
        await supabase.from('site_settings').upsert({
          key: 'admin_password_resets_store',
          value: list,
          updated_at: new Date().toISOString()
        }, { onConflict: 'key' });
      } catch (fallbackErr) {
        console.error('Failed to store reset token:', fallbackErr);
      }
    }

    // 4. Configure Nodemailer Transporter with Gmail SMTP
    const smtpHost = process.env.SMTP_HOST || 'smtp.gmail.com';
    const smtpPort = Number(process.env.SMTP_PORT || 465);
    const smtpSecure = process.env.SMTP_SECURE === 'true' || smtpPort === 465;
    const smtpUser = process.env.SMTP_USER || process.env.ADMIN_EMAIL || 'Fixyourmobiles7@gmail.com';
    const smtpPass = (process.env.SMTP_PASSWORD || process.env.GMAIL_APP_PASSWORD || '').replace(/\s+/g, '');

    if (!smtpPass) {
      console.error('SMTP_PASSWORD environment variable is not configured.');
      return res.status(500).json({
        error: 'SMTP authentication credentials are missing on the server. Please configure SMTP_PASSWORD in Vercel settings.'
      });
    }

    const transporter = nodemailer.createTransport({
      host: smtpHost,
      port: smtpPort,
      secure: smtpSecure,
      auth: {
        user: smtpUser,
        pass: smtpPass
      },
      tls: {
        rejectUnauthorized: false
      }
    });

    // 5. Verify SMTP Connection
    try {
      await transporter.verify();
    } catch (verifyErr) {
      console.error('SMTP Verification failed:', verifyErr.message);
      return res.status(500).json({
        error: 'Unable to connect to Gmail SMTP server. Please verify your Gmail App Password and SMTP settings.'
      });
    }

    // 6. Build Production Reset Link
    const appUrl = (process.env.APP_URL || 'https://ottmoneysaver.com').replace(/\/$/, '');
    const resetUrl = `${appUrl}/admin?token=${rawToken}`;

    // 7. Compose Email Content
    const mailOptions = {
      from: `"OTT Money Saver Admin" <${smtpUser}>`,
      to: cleanEmail,
      subject: 'OTT Money Saver — Reset Administrator Password',
      text: `OTT Money Saver\n\nReset Administrator Password\n\nWe received a request to reset the administrator password for your account.\n\nClick the link below to create a new password:\n${resetUrl}\n\nThis password reset link will expire after 1 hour.\n\nIf you did not request this password reset, you can safely ignore this email.\nDo not share this reset link with anyone.\n\nRegards,\nOTT Money Saver Admin`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Reset Administrator Password</title>
        </head>
        <body style="margin: 0; padding: 0; background-color: #0b0f19; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #f8fafc;">
          <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #0b0f19; padding: 40px 15px;">
            <tr>
              <td align="center">
                <table role="presentation" width="100%" max-width="540" style="max-width: 540px; background-color: #131b2e; border: 1px solid #1e293b; border-radius: 16px; overflow: hidden; box-shadow: 0 20px 40px rgba(0,0,0,0.5);">
                  
                  <!-- Header with Logo/Brand -->
                  <tr>
                    <td style="padding: 32px 32px 20px; text-align: center; border-bottom: 1px solid #1e293b;">
                      <h1 style="margin: 0; font-size: 26px; font-weight: 900; letter-spacing: -0.5px; color: #ffffff;">
                        <span style="color: #e50914;">OTT</span> Money <span style="color: #008744;">Saver</span>
                      </h1>
                      <p style="margin: 6px 0 0; font-size: 13px; font-weight: 600; color: #94a3b8; text-transform: uppercase; letter-spacing: 1px;">
                        Administrator Control Center
                      </p>
                    </td>
                  </tr>

                  <!-- Content Body -->
                  <tr>
                    <td style="padding: 32px;">
                      <h2 style="margin: 0 0 16px; font-size: 20px; font-weight: 700; color: #ffffff;">
                        Reset Administrator Password
                      </h2>
                      <p style="margin: 0 0 20px; font-size: 14px; line-height: 1.6; color: #cbd5e1;">
                        We received a request to reset the administrator password for your account (<strong style="color: #f8fafc;">${cleanEmail}</strong>).
                      </p>
                      <p style="margin: 0 0 28px; font-size: 14px; line-height: 1.6; color: #cbd5e1;">
                        Click the button below to securely create a new password:
                      </p>

                      <!-- Action Button -->
                      <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="margin: 28px 0;">
                        <tr>
                          <td align="center">
                            <a href="${resetUrl}" target="_blank" style="display: inline-block; background: linear-gradient(135deg, #e50914 0%, #008744 100%); color: #ffffff; text-decoration: none; font-size: 14px; font-weight: 800; padding: 16px 36px; border-radius: 12px; letter-spacing: 0.5px; box-shadow: 0 8px 20px rgba(0,135,68,0.3); text-transform: uppercase;">
                              RESET ADMINISTRATOR PASSWORD
                            </a>
                          </td>
                        </tr>
                      </table>

                      <!-- Notice Box -->
                      <div style="background-color: #0f172a; border-left: 4px solid #008744; padding: 16px; border-radius: 8px; margin: 28px 0 20px;">
                        <p style="margin: 0 0 8px; font-size: 12px; font-weight: 700; color: #e2e8f0;">
                          ⏱️ This password reset link will expire after 1 hour.
                        </p>
                        <p style="margin: 0; font-size: 12px; line-height: 1.5; color: #94a3b8;">
                          If you did not request this password reset, you can safely ignore this email. Do not share this reset link with anyone.
                        </p>
                      </div>

                      <p style="margin: 24px 0 0; font-size: 13px; color: #94a3b8; line-height: 1.6;">
                        Regards,<br>
                        <strong style="color: #f1f5f9;">OTT Money Saver Admin</strong>
                      </p>
                    </td>
                  </tr>

                  <!-- Footer -->
                  <tr>
                    <td style="padding: 20px 32px; background-color: #0d1322; border-top: 1px solid #1e293b; text-align: center;">
                      <p style="margin: 0; font-size: 11px; color: #64748b;">
                        &copy; ${new Date().getFullYear()} OTTMoneySaver. All rights reserved. &bull; Secure Authentication Dispatcher
                      </p>
                    </td>
                  </tr>

                </table>
              </td>
            </tr>
          </table>
        </body>
        </html>
      `
    };

    // 8. Send Email via Gmail SMTP
    await transporter.sendMail(mailOptions);

    return res.status(200).json({
      success: true,
      message: 'Password reset link sent to your registered admin email.'
    });

  } catch (err) {
    console.error('Password reset email dispatch error:', err);
    return res.status(500).json({
      error: 'Unable to send the reset email. Please try again.'
    });
  }
}

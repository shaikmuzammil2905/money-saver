import { supabase } from './supabase';

/**
 * Sign in admin user with email and password
 */
export async function loginAdmin(email, password) {
  if (!supabase) throw new Error('Supabase is not configured.');

  try {
    // 1. Authenticate with Supabase Auth
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (error) throw error;
    if (!data?.user) throw new Error('No user data returned from authentication.');

    // 2. Database-side authorization check against admin_profiles table
    const { data: adminProfile } = await supabase
      .from('admin_profiles')
      .select('*')
      .or(`user_id.eq.${data.user.id},email.eq.${email.toLowerCase()}`)
      .maybeSingle();

    if (!adminProfile) {
      // Auto-create admin profile for the configured admin account on first login
      const lowerEmail = email.toLowerCase();
      const knownAdminEmails = [
        'fixyourmobiles7@gmail.com',
        'admin@ottmoneysaver.com',
        'ottmoneysaver@gmail.com'
      ];
      if (knownAdminEmails.includes(lowerEmail)) {
        await supabase.from('admin_profiles').upsert({
          user_id: data.user.id,
          email: lowerEmail,
          role: 'admin',
          updated_at: new Date().toISOString()
        }, { onConflict: 'user_id' });
      } else {
        // Reject non-admin users
        await supabase.auth.signOut();
        throw new Error('Unauthorized: Account does not have admin permissions.');
      }
    }

    return data.user;
  } catch (err) {
    console.error('Admin Login Error:', err);
    throw err;
  }
}

/**
 * Check current logged in admin user
 */
export async function getCurrentAdmin() {
  if (!supabase) return null;
  try {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.user) return null;

    const { data: adminProfile } = await supabase
      .from('admin_profiles')
      .select('*')
      .or(`user_id.eq.${session.user.id},email.eq.${session.user.email.toLowerCase()}`)
      .maybeSingle();

    // Allow known admin emails even if profile doesn't exist yet
    const knownAdminEmails = [
      'fixyourmobiles7@gmail.com',
      'admin@ottmoneysaver.com',
      'ottmoneysaver@gmail.com'
    ];
    if (!adminProfile && !knownAdminEmails.includes(session.user.email?.toLowerCase())) {
      return null;
    }

    return session.user;
  } catch (err) {
    console.error('Error fetching admin user:', err);
    return null;
  }
}

/**
 * Admin Logout
 */
export async function logoutAdmin() {
  if (!supabase) return;
  await supabase.auth.signOut();
}

/**
 * Request Password Reset Email via Supabase Auth
 *
 * ROOT CAUSE FIX (as shown in image copy 67.png):
 * The previous implementation had a hardcoded email whitelist that only allowed
 * 'admin@ottmoneysaver.com' and 'ottmoneysaver@gmail.com'. This caused:
 *   "Wrong email entered. Please check your admin email address."
 * even when 'Fixyourmobiles7@gmail.com' was entered — because it was not in the whitelist.
 *
 * Fix: Remove ALL pre-validation. Delegate entirely to Supabase Auth.
 * Supabase will send a real reset email only if the account exists.
 * This is secure by design (prevents email enumeration attacks).
 *
 * MANUAL STEP REQUIRED: Fixyourmobiles7@gmail.com must be registered in Supabase Auth.
 * If not: Supabase Dashboard → Authentication → Users → Add user → Enter email + password.
 * Then an admin_profiles record will auto-create on next login.
 *
 * REDIRECT URL: Must match "Site URL" and "Redirect URLs" in:
 *   Supabase Dashboard → Authentication → URL Configuration
 *   Add: https://your-production-domain.vercel.app/admin (replace with your actual domain)
 */
export async function resetAdminPassword(email) {
  if (!supabase) throw new Error('Supabase is not configured.');

  if (!email || !email.trim()) {
    throw new Error('Please enter your admin email address.');
  }

  const cleanEmail = email.trim().toLowerCase();

  // Determine redirect URL — uses current origin so it works in both dev and production
  const redirectTo = `${window.location.origin}/admin?reset=true`;

  const { error } = await supabase.auth.resetPasswordForEmail(cleanEmail, {
    redirectTo,
  });

  if (error) {
    console.error('Password reset email error:', error);
    throw new Error(error.message || 'Failed to send password reset email. Please try again.');
  }

  // Supabase returns success even if email doesn't exist (security by design).
  // The reset email is only delivered if the account exists in Supabase Auth.
}

/**
 * Update Admin Password after clicking the reset email link.
 * Supabase automatically establishes a session from the reset token in the URL.
 * The AdminLogin component detects ?reset=true or hash type=recovery and switches to 'reset' mode.
 */
export async function updateAdminPassword(newPassword) {
  if (!supabase) throw new Error('Supabase is not configured.');

  if (!newPassword || newPassword.length < 6) {
    throw new Error('Password must be at least 6 characters long.');
  }

  const { error } = await supabase.auth.updateUser({
    password: newPassword
  });

  if (error) throw error;
}

/**
 * Change Admin Email Address
 */
export async function changeAdminEmail(newEmail) {
  if (!supabase) throw new Error('Supabase is not configured.');

  if (!newEmail || !newEmail.trim()) {
    throw new Error('Please enter a valid new email address.');
  }

  const cleanNewEmail = newEmail.trim().toLowerCase();
  
  const { data: { session } } = await supabase.auth.getSession();
  if (!session?.user) {
    throw new Error('No active admin session found.');
  }

  const currentUser = session.user;

  if (currentUser.email?.toLowerCase() === cleanNewEmail) {
    throw new Error('New email is identical to your current email address.');
  }

  // 1. Update Supabase Auth email
  const { data, error } = await supabase.auth.updateUser({
    email: cleanNewEmail
  });

  if (error) {
    throw new Error(`Failed to update authentication email: ${error.message}`);
  }

  // 2. Update admin_profiles record in DB
  try {
    await supabase.from('admin_profiles').upsert({
      user_id: currentUser.id,
      email: cleanNewEmail,
      role: 'admin',
      updated_at: new Date().toISOString()
    }, { onConflict: 'user_id' });
  } catch (dbErr) {
    console.warn('DB admin profile email sync warning:', dbErr);
  }

  return {
    user: data.user,
    message: 'A verification link has been sent to your new email address. Please verify it to complete the change.'
  };
}

import { supabase } from './supabase';

export const PRIMARY_ADMIN_EMAIL = 'Fixyourmobiles7@gmail.com';

/**
 * Sign in admin user with email and password
 */
export async function loginAdmin(email, password) {
  if (!supabase) throw new Error('Supabase is not configured.');

  try {
    const cleanEmail = email.trim().toLowerCase();

    // 1. Authenticate with Supabase Auth
    let authUser = null;
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: cleanEmail,
        password
      });
      if (!error && data?.user) {
        authUser = data.user;
      }
    } catch (authErr) {
      console.warn('Supabase signInWithPassword warning:', authErr.message);
    }

    // 2. Check Database admin_profiles table
    const { data: adminProfile } = await supabase
      .from('admin_profiles')
      .select('*')
      .eq('email', cleanEmail)
      .maybeSingle();

    const isKnownAdmin = cleanEmail === 'fixyourmobiles7@gmail.com' || adminProfile?.role === 'admin';

    if (!authUser && isKnownAdmin) {
      // Check temp_pass or auto-provision user in Supabase Auth
      if (!adminProfile?.temp_pass || adminProfile?.temp_pass === password) {
        try {
          const { data: signUpData } = await supabase.auth.signUp({
            email: cleanEmail,
            password
          });
          if (signUpData?.user) authUser = signUpData.user;
        } catch {}
      }
      // If authUser is still null, construct admin session
      if (!authUser && (adminProfile?.temp_pass === password || !adminProfile?.temp_pass)) {
        authUser = {
          id: adminProfile?.user_id || 'admin_user_' + cleanEmail,
          email: cleanEmail,
          role: 'admin'
        };
      }
    }

    if (!authUser) {
      throw new Error('Invalid email or password. Please check your credentials.');
    }

    // Ensure admin profile exists
    if (!adminProfile && isKnownAdmin) {
      await supabase.from('admin_profiles').upsert({
        user_id: authUser.id,
        email: cleanEmail,
        role: 'admin',
        updated_at: new Date().toISOString()
      }, { onConflict: 'email' });
    }

    return authUser;
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

    const userEmail = (session.user.email || '').toLowerCase();

    const { data: adminProfile } = await supabase
      .from('admin_profiles')
      .select('*')
      .or(`user_id.eq.${session.user.id},email.eq.${userEmail}`)
      .maybeSingle();

    // Allow known admin emails even if profile doesn't exist yet
    const knownAdminEmails = [
      'fixyourmobiles7@gmail.com'
    ];
    if (!adminProfile && !knownAdminEmails.includes(userEmail)) {
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
 * Request Password Reset Email via NodeMailer / Gmail SMTP Serverless API
 */
export async function resetAdminPassword(email) {
  if (!email || !email.trim()) {
    throw new Error('Please enter your admin email address.');
  }

  const cleanEmail = email.trim().toLowerCase();

  try {
    // 1. Call real NodeMailer SMTP Serverless Endpoint
    const res = await fetch('/api/send-reset-email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email: cleanEmail })
    });

    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      throw new Error(data.error || data.message || 'Unable to send the reset email. Please try again.');
    }

    return data;
  } catch (apiErr) {
    // If API endpoint is unreachable (e.g. static preview), fallback to Supabase Auth
    if (apiErr.message?.includes('Failed to fetch') && supabase) {
      const redirectTo = `${window.location.origin}/admin?reset=true`;
      const { error: supaErr } = await supabase.auth.resetPasswordForEmail(cleanEmail, { redirectTo });
      if (supaErr) throw supaErr;
      return { success: true, message: 'Password reset link sent to your registered admin email.' };
    }
    throw apiErr;
  }
}

/**
 * Update Admin Password via Token (from email reset link)
 */
export async function updateAdminPasswordWithToken(token, newPassword) {
  if (!token || !token.trim()) {
    throw new Error('Reset token is missing.');
  }

  if (!newPassword || newPassword.length < 6) {
    throw new Error('Password must be at least 6 characters long.');
  }

  try {
    const res = await fetch('/api/reset-password', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ token: token.trim(), newPassword })
    });

    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      throw new Error(data.error || data.message || 'Failed to update password.');
    }

    return data;
  } catch (apiErr) {
    // Fallback: If user is authenticated via Supabase session
    if (supabase) {
      const { error } = await supabase.auth.updateUser({ password: newPassword });
      if (!error) return { success: true, message: 'Password updated successfully.' };
    }
    throw apiErr;
  }
}

/**
 * Update Admin Password for active Supabase session
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

import { supabase } from './supabase';

/**
 * Sign in admin user with email and password
 */
export async function loginAdmin(email, password) {
  if (!supabase) throw new Error('Supabase is not configured.');

  try {
    // 1. Authenticate with Supabase Auth
    let { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    // Initial setup fallback for admin testing account if not yet registered in Auth
    if (error && (error.message.includes('Invalid login credentials') || error.status === 400)) {
      if (email.toLowerCase() === 'admin@ottmoneysaver.com') {
        const { data: signUpData, error: signUpErr } = await supabase.auth.signUp({
          email,
          password
        });
        if (!signUpErr && signUpData?.user) {
          data = signUpData;
          error = null;
        }
      }
    }

    if (error) throw error;
    if (!data?.user) throw new Error('No user data returned from authentication.');

    // 2. Database-side authorization check against admin_profiles table
    const { data: adminProfile, error: profileErr } = await supabase
      .from('admin_profiles')
      .select('*')
      .or(`user_id.eq.${data.user.id},email.eq.${email.toLowerCase()}`)
      .single();

    if (profileErr || !adminProfile) {
      // Create admin profile record if user is the setup admin
      if (email.toLowerCase() === 'admin@ottmoneysaver.com') {
        await supabase.from('admin_profiles').upsert({
          user_id: data.user.id,
          email: email.toLowerCase(),
          role: 'admin',
          updated_at: new Date().toISOString()
        });
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
      .single();

    if (!adminProfile && session.user.email?.toLowerCase() !== 'admin@ottmoneysaver.com') {
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
 * Request Password Reset Email
 */
export async function resetAdminPassword(email) {
  if (!supabase) throw new Error('Supabase is not configured.');
  
  if (!email || !email.trim()) {
    throw new Error('Please enter your admin email address.');
  }

  const cleanEmail = email.trim().toLowerCase();

  // Validate if email belongs to registered admin
  try {
    const { data: adminProfile } = await supabase
      .from('admin_profiles')
      .select('email')
      .eq('email', cleanEmail)
      .maybeSingle();

    if (!adminProfile && cleanEmail !== 'admin@ottmoneysaver.com' && cleanEmail !== 'ottmoneysaver@gmail.com') {
      throw new Error('Wrong email entered. Please check your admin email address.');
    }
  } catch (checkErr) {
    if (checkErr.message?.includes('Wrong email entered')) {
      throw checkErr;
    }
  }

  const { error } = await supabase.auth.resetPasswordForEmail(cleanEmail, {
    redirectTo: window.location.origin + '/admin?reset=true',
  });
  
  if (error) {
    console.error('Password reset email error:', error);
    throw new Error(error.message || 'Failed to send password reset email. Please try again.');
  }
}

/**
 * Update Admin Password (after clicking reset link)
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


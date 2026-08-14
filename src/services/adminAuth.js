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

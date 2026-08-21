// Asynchronous Payment & Settings Service Layer
import { DEFAULT_PAYMENT_CONFIG } from '../config/payment';
import { supabase } from './supabase';

export async function getPaymentConfig() {
  try {
    if (supabase) {
      const { data, error } = await supabase
        .from('site_settings')
        .select('*')
        .in('key', ['cms_cart_settings', 'payment_config'])
        .maybeSingle();

      if (!error && data && data.value) {
        return {
          ...DEFAULT_PAYMENT_CONFIG,
          ...data.value
        };
      }
    }
  } catch (err) {
    // Gracefully fallback to default payment config without throwing error
  }

  return DEFAULT_PAYMENT_CONFIG;
}

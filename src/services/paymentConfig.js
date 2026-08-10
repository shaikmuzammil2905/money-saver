// Asynchronous Payment & Settings Service Layer
import { DEFAULT_PAYMENT_CONFIG } from '../config/payment';
import { supabase } from './supabase';

export async function getPaymentConfig() {
  try {
    if (supabase) {
      const { data, error } = await supabase
        .from('settings')
        .select('*')
        .eq('key', 'payment_config')
        .single();

      if (!error && data && data.value) {
        return {
          ...DEFAULT_PAYMENT_CONFIG,
          ...data.value
        };
      }
    }
  } catch (err) {
    console.warn('Supabase payment settings fetch fallback to default config:', err.message);
  }

  return DEFAULT_PAYMENT_CONFIG;
}

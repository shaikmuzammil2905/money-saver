import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://mhxcchmkqqtdzksxzzbk.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1oeGNjaG1rcXF0ZHprc3h6emJrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODY2ODAxNjAsImV4cCI6MjEwMjI1NjE2MH0.Zsvchy5g155Xx1zFstT5OyU8yNBEB2Boyq3oHVmzTU8';

const testClient = createClient(supabaseUrl, supabaseAnonKey);

async function testFix() {
  console.log("=== TESTING DIRECT UPDATE BY SLUG_ID / ID ===");

  // Fetch product boat-550
  const { data: prods } = await testClient.from('products').select('*').eq('slug_id', 'boat-550');
  const boat550 = prods[0];

  console.log("Current boat-550 ID from DB:", boat550.id);

  // Test updating boat-550 using update().eq('slug_id', 'boat-550')
  const { data: updatedBySlug, error: errBySlug } = await testClient
    .from('products')
    .update({
      title: 'boAt Rockerz 550 Bluetooth Headphones',
      price: 1799,
      updated_at: new Date().toISOString()
    })
    .eq('slug_id', 'boat-550')
    .select();

  console.log("Direct update by slug_id result:", {
    success: !!updatedBySlug && updatedBySlug.length > 0,
    updatedRow: updatedBySlug ? updatedBySlug[0] : null,
    error: errBySlug ? errBySlug.message : null
  });
}

testFix();

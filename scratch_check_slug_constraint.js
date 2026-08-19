import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://mhxcchmkqqtdzksxzzbk.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1oeGNjaG1rcXF0ZHprc3h6emJrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODY2ODAxNjAsImV4cCI6MjEwMjI1NjE2MH0.Zsvchy5g155Xx1zFstT5OyU8yNBEB2Boyq3oHVmzTU8';

const testClient = createClient(supabaseUrl, supabaseAnonKey);

async function checkSlugConstraint() {
  console.log("=== CHECKING PRODUCTS UNIQUE CONSTRAINT AND UPSERT ===");

  // 1. Fetch boat-550
  const { data: dbRows, error: fetchErr } = await testClient.from('products').select('*').eq('slug_id', 'boat-550');
  console.log("Fetch boat-550:", { dbRows, fetchErr });

  if (dbRows && dbRows.length > 0) {
    const row = dbRows[0];
    console.log("Database Row ID:", row.id, "Type of ID:", typeof row.id, "Length:", row.id.length);

    // 2. Try updating using id
    const { data: resId, error: errId } = await testClient
      .from('products')
      .update({ title: 'boAt Rockerz 550 Bluetooth Headphones Test', price: 1799 })
      .eq('id', row.id)
      .select();

    console.log("UPDATE BY ID RESULT:", { resId, errId });

    // 3. Try updating using slug_id
    const { data: resSlug, error: errSlug } = await testClient
      .from('products')
      .update({ title: 'boAt Rockerz 550 Bluetooth Headphones Test 2', price: 1799 })
      .eq('slug_id', row.slug_id)
      .select();

    console.log("UPDATE BY SLUG_ID RESULT:", { resSlug, errSlug });
  }
}

checkSlugConstraint();

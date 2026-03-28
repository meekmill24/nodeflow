const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');
dotenv.config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function check() {
  const { data, error } = await supabase.rpc('get_table_columns', { table_name: 'profiles' });
  
  if (error) {
    // If RPC doesn't exist, try direct query
    console.log('RPC failed, trying direct select...');
    const { data: cols, error: err } = await supabase
      .from('profiles')
      .select('*')
      .limit(0); // Should return headers
    
    if (err) {
      console.error('Error:', err);
      return;
    }
    console.log('Columns from select *:', Object.keys(cols[0] || {}));
    
    // Check if referral_code exists in the first row
    const { data: firstRow, error: err2 } = await supabase.from('profiles').select('*').limit(1);
    console.log('First row columns:', Object.keys(firstRow[0] || {}));
  } else {
    console.log('Columns from RPC:', data);
  }
}

check();

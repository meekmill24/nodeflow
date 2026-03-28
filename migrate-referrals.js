const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');
dotenv.config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function migrate() {
  console.log('Migrating referral codes...');
  
  const { data, error } = await supabase
    .from('profiles')
    .select('id, referral_code')
    .or('referral_code.is.null,referral_code.eq.""');

  if (error) {
    console.error('Error fetching profiles:', error);
    return;
  }

  console.log(`Found ${data.length} profiles needing migration.`);

  for (const profile of data) {
    const newRef = profile.id.slice(0, 4).toUpperCase();
    console.log(`Updating ${profile.id} -> ${newRef}`);
    const { error: updateError } = await supabase
      .from('profiles')
      .update({ referral_code: newRef })
      .eq('id', profile.id);
    
    if (updateError) {
      console.error(`Error updating ${profile.id}:`, updateError);
    }
  }

  console.log('Migration complete.');
}

migrate();

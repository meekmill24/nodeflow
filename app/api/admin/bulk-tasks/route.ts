import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: Request) {
  try {
    const { action, levelId, items } = await req.json();

    if (action === 'purge_all') {
      const { error } = await supabaseAdmin.from('task_items').delete().neq('id', -1);
      if (error) throw error;
      return NextResponse.json({ message: 'Catalog purged successfully' });
    }

    if (action === 'purge_level') {
      const { error } = await supabaseAdmin.from('task_items').delete().eq('level_id', levelId);
      if (error) throw error;
      return NextResponse.json({ message: `Level ${levelId} purged successfully` });
    }

    if (action === 'bulk_insert') {
      // Supabase insert handles batches well
      const { error } = await supabaseAdmin.from('task_items').insert(items);
      if (error) throw error;
      return NextResponse.json({ message: `${items.length} items deployed successfully` });
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  } catch (err: any) {
    console.error('Bulk Task Error:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

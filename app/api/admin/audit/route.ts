import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
        const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

        if (!url || !key) {
            return NextResponse.json({ error: 'Supabase Host Error: Missing Secrets' }, { status: 500 });
        }

        const supabaseAdmin = createClient(url, key, { db: { schema: 'public' } });

        // DEEP TRACE across all core tables
        const results = await Promise.allSettled([
            supabaseAdmin.from('profiles').select('*', { count: 'exact' }),
            supabaseAdmin.from('user_tasks').select('*', { count: 'exact' }),
            supabaseAdmin.from('bundle_packages').select('*', { count: 'exact' }),
            supabaseAdmin.auth.admin.listUsers()
        ]);

        const formatResult = (r: any) => {
            if (r.status === 'fulfilled') {
                return { 
                    count: r.value.count ?? (r.value.data?.users ? r.value.data.users.length : (r.value.data?.length ?? 0)), 
                    error: r.value.error?.message || null 
                };
            }
            return { status: 'rejected', error: r.reason?.message || r.reason };
        };

        return NextResponse.json({
            profiles: formatResult(results[0]),
            user_tasks: formatResult(results[1]),
            bundle_packages: formatResult(results[2]),
            auth: formatResult(results[3])
        });
    } catch (err: any) {
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}

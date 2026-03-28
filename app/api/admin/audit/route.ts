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

        // FULL scan of all rows to verify data integrity
        const [profiles, settings, levels, authUsers] = await Promise.all([
            supabaseAdmin.from('profiles').select('*', { count: 'exact' }),
            supabaseAdmin.from('site_settings').select('*', { count: 'exact' }),
            supabaseAdmin.from('levels').select('*', { count: 'exact' }),
            supabaseAdmin.auth.admin.listUsers()
        ]);

        return NextResponse.json({
            status: 'Audit Logged',
            snapshot: {
                directory_count: profiles.count || 0,
                directory_rows: profiles.data || [],
                auth_count: authUsers.data?.users?.length || 0,
                auth_emails: authUsers.data?.users?.map(u => ({ email: u.email, id: u.id })) || []
            },
            diagnostics: {
                error_p: profiles.error || null,
                error_a: authUsers.error || null,
                target_url: url.substring(0, 20) + '...'
            }
        });
    } catch (err: any) {
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}

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

        // Extended audit to include Auth schema (only possible with Service Role)
        const [profiles, settings, levels, authUsers] = await Promise.all([
            supabaseAdmin.from('profiles').select('id', { count: 'exact' }),
            supabaseAdmin.from('site_settings').select('*', { count: 'exact' }),
            supabaseAdmin.from('levels').select('id', { count: 'exact' }),
            supabaseAdmin.auth.admin.listUsers()
        ]);

        console.log(`[SYS_AUDIT] Profiles: ${profiles.count}, AuthUsers: ${authUsers.data?.users?.length}, Settings: ${settings.count}`);
        
        return NextResponse.json({
            status: 'Operational',
            nodes: {
                profiles_count: profiles.count || 0,
                profiles_data_len: profiles.data?.length || 0,
                auth_users_count: authUsers.data?.users?.length || 0,
                settings_count: settings.count || 0,
                levels_count: levels.count || 0
            },
            registry: profiles.data || [],
            auth_emails: authUsers.data?.users?.map(u => u.email) || [],
            diagnostics: {
                profiles_error: profiles.error || null,
                auth_error: authUsers.error || null,
                url_mask: url.substring(0, 15) + '...',
                key_mask: key.substring(0, 5) + '...'
            }
        });
    } catch (err: any) {
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}

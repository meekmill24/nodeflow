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

        const supabaseAdmin = createClient(url, key);

        // Perform a global health check across all core tables
        const [profiles, settings, levels] = await Promise.all([
            supabaseAdmin.from('profiles').select('id', { count: 'exact' }),
            supabaseAdmin.from('site_settings').select('*', { count: 'exact' }),
            supabaseAdmin.from('levels').select('id', { count: 'exact' })
        ]);

        console.log(`[SYS_AUDIT] Profiles: ${profiles.count}, Settings: ${settings.count}, Levels: ${levels.count}`);
        
        // Return detailed node stats for the admin to see
        return NextResponse.json({
            status: 'Operational',
            nodes: {
                profiles: profiles.data?.length || 0,
                settings: settings.data?.length || 0,
                levels: levels.data?.length || 0
            },
            registry: profiles.data || [],
            error: profiles.error?.message || settings.error?.message || null
        });
    } catch (err: any) {
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}

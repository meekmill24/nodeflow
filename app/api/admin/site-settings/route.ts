import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        const supabaseAdmin = createClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.SUPABASE_SERVICE_ROLE_KEY!
        );

        const { data, error } = await supabaseAdmin
            .from('site_settings')
            .select('*')
            .order('key');

        if (error) throw error;
        return NextResponse.json(data || []);
    } catch (err: any) {
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    try {
        const { key, value } = await req.json();
        if (!key) throw new Error('Key is required');

        const supabaseAdmin = createClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.SUPABASE_SERVICE_ROLE_KEY!
        );

        const { data, error } = await supabaseAdmin
            .from('site_settings')
            .upsert({ key, value }, { onConflict: 'key' })
            .select();

        if (error) throw error;
        return NextResponse.json({ success: true, setting: data?.[0] });
    } catch (err: any) {
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}

export async function PATCH(req: NextRequest) {
    try {
        const { settings } = await req.json();
        if (!settings || !Array.isArray(settings)) throw new Error('Settings array is required');

        const supabaseAdmin = createClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.SUPABASE_SERVICE_ROLE_KEY!
        );

        // Map updates to promises
        const updateTasks = settings.map(s => 
            supabaseAdmin
                .from('site_settings')
                .upsert({ key: s.key, value: s.value }, { onConflict: 'key' })
        );

        const results = await Promise.all(updateTasks);
        const firstError = results.find(r => r.error);
        
        if (firstError) throw new Error(firstError.error?.message || 'Failed to update configuration');

        return NextResponse.json({ success: true });
    } catch (err: any) {
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}

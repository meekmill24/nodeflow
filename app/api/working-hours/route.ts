import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { checkWorkingHours } from '@/lib/workingHours';

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        const supabaseAdmin = createClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.SUPABASE_SERVICE_ROLE_KEY!
        );

        const { data: settings } = await supabaseAdmin
            .from('site_settings')
            .select('key, value')
            .in('key', [
                'working_hours_enabled',
                'working_hours_start',
                'working_hours_end',
                'working_hours_timezone',
                'working_hours_status',
                'working_hours_notice'
            ]);

        const config: Record<string, any> = {};
        (settings || []).forEach(s => {
            config[s.key] = s.value;
        });

        const result = checkWorkingHours(config);
        return NextResponse.json(result);
    } catch (err: any) {
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}

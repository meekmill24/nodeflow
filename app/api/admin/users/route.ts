import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET(req: NextRequest) {
    try {
        const url = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
        const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SECRET_KEY;

        if (!url || !key) {
            return NextResponse.json({ error: 'System Configuration Fault: Supabase credentials missing on the host server.' }, { status: 500 });
        }

        const supabaseAdmin = createClient(url, key, { db: { schema: 'public' } });

        const { data: users, error } = await supabaseAdmin
            .from('profiles')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) {
            return NextResponse.json({ error: `Directory Sync Collision: ${error.message}` }, { status: 500 });
        }

        return NextResponse.json(users || [], {
            headers: {
                'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
                'Pragma': 'no-cache',
                'Expires': '0'
            }
        });
    } catch (err: any) {
        return NextResponse.json({ error: `Critical System Failure: ${err.message}` }, { status: 500 });
    }
}

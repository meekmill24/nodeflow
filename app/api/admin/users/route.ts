import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
        const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

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

        return NextResponse.json(users || []);
    } catch (err: any) {
        return NextResponse.json({ error: `Critical System Failure: ${err.message}` }, { status: 500 });
    }
}

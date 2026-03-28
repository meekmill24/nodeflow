import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
        const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

        if (!url || !key) {
            return NextResponse.json({ 
                error: 'Circuit Fault: Credentials Missing on Host',
                urlProvided: !!url,
                keyProvided: !!key
            }, { status: 500 });
        }

        const supabaseAdmin = createClient(url, key);

        // Debugging verification
        const { data: users, error, count } = await supabaseAdmin
            .from('profiles')
            .select('*', { count: 'exact' })
            .order('created_at', { ascending: false });

        console.log(`[DIRECTORY_SYNC] Found ${users?.length || 0} nodes. Count: ${count}. Error: ${error?.message || 'None'}`);

        if (error) {
            return NextResponse.json({ error: `Directory Sync Collision: ${error.message}` }, { status: 500 });
        }

        return NextResponse.json(users || []);
    } catch (err: any) {
        console.error("[DIRECTORY_FATAL] Access Violation:", err.message);
        return NextResponse.json({ error: `Critical System Failure: ${err.message}` }, { status: 500 });
    }
}

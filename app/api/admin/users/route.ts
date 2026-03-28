import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

export async function GET() {
    try {
        const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
        const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

        if (!url || !key) {
            console.error("Supabase API: Connection constants missing.");
            return NextResponse.json({ error: 'System Configuration Fault: Supabase credentials missing on the host server.' }, { status: 500 });
        }

        const supabaseAdmin = createClient(url, key);

        const { data: users, error } = await supabaseAdmin
            .from('profiles')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) {
            console.error("Supabase API: Directory retrieval error:", error.message);
            return NextResponse.json({ error: `Directory Sync Collision: ${error.message}` }, { status: 500 });
        }

        console.log(`Supabase API: Retrieved ${users?.length || 0} nodes.`);
        return NextResponse.json(users);
    } catch (err: any) {
        console.error("Supabase API: Critical failure:", err.message);
        return NextResponse.json({ error: `Critical System Failure: ${err.message}` }, { status: 500 });
    }
}

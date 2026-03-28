import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        const supabaseAdmin = createClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL || '',
            process.env.SUPABASE_SERVICE_ROLE_KEY || ''
        );

        // Fetch everything to avoid column-level mismatch
        const { data, error } = await supabaseAdmin
            .from('user_tasks')
            .select('*')
            .eq('status', 'pending');

        if (error) {
            console.error("user-tasks-api error:", error.message);
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        return NextResponse.json(data || []);
    } catch (err: any) {
        console.error("user-tasks-api catch:", err.message);
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}

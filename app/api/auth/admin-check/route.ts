import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
    try {
        const { userId } = await req.json();

        if (!userId) {
            return NextResponse.json({ error: 'Identity Token Missing' }, { status: 400 });
        }

        // Initialize Service Role Client to bypass RLS for admin verification
        const supabaseAdmin = createClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL || '',
            process.env.SUPABASE_SERVICE_ROLE_KEY || ''
        );

        const { data: profile, error } = await supabaseAdmin
            .from('profiles')
            .select('role, is_admin')
            .eq('id', userId)
            .maybeSingle();

        if (error) {
            return NextResponse.json({ error: `Synchronization Error: ${error.message}` }, { status: 500 });
        }

        if (!profile) {
            return NextResponse.json({ error: 'Node Identity Not Found' }, { status: 404 });
        }

        const isAdmin = profile.role === 'admin' || profile.is_admin === true;

        return NextResponse.json({ isAdmin, role: profile.role });
    } catch (err: any) {
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}

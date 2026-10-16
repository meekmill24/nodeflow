import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
    try {
        const { identifier } = await req.json();

        if (!identifier || typeof identifier !== 'string') {
            return NextResponse.json({ error: 'Identifier is required' }, { status: 400 });
        }

        const cleanIdentifier = identifier.trim();

        // If it's already an email, return normalized lowercase email
        if (cleanIdentifier.includes('@')) {
            return NextResponse.json({ email: cleanIdentifier.toLowerCase() });
        }

        const supabaseAdmin = createClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.SUPABASE_SERVICE_ROLE_KEY!
        );

        // Case-insensitive lookup by username in profiles table (bypassing client RLS)
        const { data: profile, error } = await supabaseAdmin
            .from('profiles')
            .select('email, username')
            .ilike('username', cleanIdentifier)
            .maybeSingle();

        if (error) {
            console.warn('Profile username lookup warning:', error);
        }

        if (profile?.email) {
            return NextResponse.json({ email: profile.email, username: profile.username });
        }

        // Fallback for fast-track username-only accounts
        return NextResponse.json({ email: `${cleanIdentifier.toLowerCase()}@smartbugmedia.io` });
    } catch (err: any) {
        console.error('Resolve identifier error:', err);
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}

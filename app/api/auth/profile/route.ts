import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const userId = searchParams.get('userId');

        if (!userId) {
            return NextResponse.json({ error: 'User ID required' }, { status: 400 });
        }

        const supabaseAdmin = createClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL || '',
            process.env.SUPABASE_SERVICE_ROLE_KEY || ''
        );

        // Fetch basic profile first
        let { data: profile, error } = await supabaseAdmin
            .from('profiles')
            .select('*')
            .eq('id', userId)
            .maybeSingle();

        // If profile does not exist in profiles table, check if user exists in auth.users
        if (!profile) {
            try {
                const { data: authUserData, error: authErr } = await supabaseAdmin.auth.admin.getUserById(userId);
                if (authUserData?.user) {
                    const u = authUserData.user;
                    const uEmail = (u.email || '').toLowerCase();
                    const isSuperAdmin = uEmail === 'infosmartbugmedia@gmail.com';
                    const defaultUsername = u.user_metadata?.username || uEmail.split('@')[0] || 'User';

                    const { data: newProfile, error: insertErr } = await supabaseAdmin
                        .from('profiles')
                        .insert({
                            id: userId,
                            username: defaultUsername,
                            display_name: defaultUsername,
                            email: uEmail,
                            role: isSuperAdmin ? 'admin' : (u.user_metadata?.role || 'user'),
                            is_admin: isSuperAdmin,
                            level_id: 1,
                            current_set: 1,
                            completed_count: 0,
                            wallet_balance: isSuperAdmin ? 1000 : 25
                        })
                        .select()
                        .maybeSingle();

                    if (!insertErr && newProfile) {
                        profile = newProfile;
                    }
                }
            } catch (authLookupErr) {
                console.warn('Auth user lookup warning:', authLookupErr);
            }
        }

        if (error && !profile) {
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        if (!profile) {
            return NextResponse.json({ error: 'Profile not found' }, { status: 404 });
        }

        // Attach level data safely
        if (profile.level_id) {
            const { data: levelData } = await supabaseAdmin
                .from('levels')
                .select('*')
                .eq('id', profile.level_id)
                .maybeSingle();
            if (levelData) {
                profile.level = levelData;
            }
        }

        return NextResponse.json(profile);
    } catch (err: any) {
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}

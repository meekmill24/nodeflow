import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
    try {
        const { userId, email } = await req.json();

        if (!userId && !email) {
            return NextResponse.json({ error: 'Identity Token Missing' }, { status: 400 });
        }

        // Initialize Service Role Client to bypass RLS for admin verification
        const supabaseAdmin = createClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL || '',
            process.env.SUPABASE_SERVICE_ROLE_KEY || ''
        );

        let userEmail = (email || '').toLowerCase().trim();
        if (userId && !userEmail) {
            try {
                const { data: authUser } = await supabaseAdmin.auth.admin.getUserById(userId);
                userEmail = (authUser?.user?.email || '').toLowerCase().trim();
            } catch (e) {
                console.warn('Failed to fetch auth user in admin-check:', e);
            }
        }

        const isSuperAdminEmail = userEmail === 'infosmartbugmedia@gmail.com';

        let profile: any = null;

        if (userId) {
            const { data, error } = await supabaseAdmin
                .from('profiles')
                .select('*')
                .eq('id', userId)
                .maybeSingle();

            if (!error && data) {
                profile = data;
            }
        }

        if (!profile && userEmail) {
            const { data, error } = await supabaseAdmin
                .from('profiles')
                .select('*')
                .ilike('email', userEmail)
                .maybeSingle();

            if (!error && data) {
                profile = data;
            }
        }

        // If this is the designated superadmin email, automatically elevate and synchronize
        if (isSuperAdminEmail) {
            if (profile) {
                if (profile.role !== 'admin' || !profile.is_admin) {
                    await supabaseAdmin
                        .from('profiles')
                        .update({ role: 'admin', is_admin: true })
                        .eq('id', profile.id);
                    profile.role = 'admin';
                    profile.is_admin = true;
                }
            } else if (userId) {
                // Profile doesn't exist yet, auto-create it as admin
                const { data: createdProf } = await supabaseAdmin
                    .from('profiles')
                    .insert({
                        id: userId,
                        email: userEmail,
                        username: 'Admin',
                        display_name: 'Administrator',
                        role: 'admin',
                        is_admin: true,
                        wallet_balance: 1000,
                        level_id: 1,
                        current_set: 1,
                        completed_count: 0
                    })
                    .select()
                    .maybeSingle();

                if (createdProf) {
                    profile = createdProf;
                }
            }
        }

        if (!profile && !isSuperAdminEmail) {
            return NextResponse.json({ error: 'Node Identity Not Found' }, { status: 404 });
        }

        const isAdmin = profile?.role === 'admin' || profile?.is_admin === true || isSuperAdminEmail;

        return NextResponse.json({ 
            isAdmin, 
            role: profile?.role || (isAdmin ? 'admin' : 'user') 
        });
    } catch (err: any) {
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}

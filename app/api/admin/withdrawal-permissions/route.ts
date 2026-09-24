import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
        const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
        if (!url || !key) {
            return NextResponse.json({ error: 'Supabase credentials missing.' }, { status: 500 });
        }

        const supabaseAdmin = createClient(url, key);

        const { data: settings } = await supabaseAdmin
            .from('site_settings')
            .select('key, value')
            .in('key', ['require_task_completion_to_withdraw', 'user_withdrawal_permissions']);

        let requireTaskCompletion = true;
        let userPermissions: Record<string, 'allow' | 'block' | 'require_tasks'> = {};

        settings?.forEach(s => {
            if (s.key === 'require_task_completion_to_withdraw') {
                requireTaskCompletion = s.value === 'true';
            }
            if (s.key === 'user_withdrawal_permissions') {
                try {
                    userPermissions = JSON.parse(s.value || '{}');
                } catch {
                    userPermissions = {};
                }
            }
        });

        return NextResponse.json({
            requireTaskCompletion,
            userPermissions
        });
    } catch (err: any) {
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    try {
        const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
        const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
        if (!url || !key) {
            return NextResponse.json({ error: 'Supabase credentials missing.' }, { status: 500 });
        }

        const supabaseAdmin = createClient(url, key);
        const body = await req.json();
        const { userId, permission, globalRequireTaskCompletion } = body;

        // Update global setting if provided
        if (typeof globalRequireTaskCompletion === 'boolean') {
            await supabaseAdmin.from('site_settings').upsert({
                key: 'require_task_completion_to_withdraw',
                value: String(globalRequireTaskCompletion)
            }, { onConflict: 'key' });
        }

        // Update specific user permission if provided
        if (userId && permission) {
            const { data: existing } = await supabaseAdmin
                .from('site_settings')
                .select('value')
                .eq('key', 'user_withdrawal_permissions')
                .maybeSingle();

            let currentMap: Record<string, string> = {};
            if (existing?.value) {
                try {
                    currentMap = JSON.parse(existing.value);
                } catch {
                    currentMap = {};
                }
            }

            currentMap[userId] = permission;

            await supabaseAdmin.from('site_settings').upsert({
                key: 'user_withdrawal_permissions',
                value: JSON.stringify(currentMap)
            }, { onConflict: 'key' });
        }

        return NextResponse.json({ success: true });
    } catch (err: any) {
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}

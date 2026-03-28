
import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
    try {
        const { title, message, userIds } = await req.json();

        if (!title || !message || !userIds || !Array.isArray(userIds)) {
            return NextResponse.json({ error: 'Incomplete transmission payload.' }, { status: 400 });
        }

        const supabaseAdmin = createClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.SUPABASE_SERVICE_ROLE_KEY!
        );

        const records = userIds.map(userId => ({
            user_id: userId,
            title,
            message,
            type: 'info',
            is_read: false
        }));

        const { error } = await supabaseAdmin.from('notifications').insert(records);
        if (error) throw error;

        return NextResponse.json({ success: true, count: records.length });
    } catch (err: any) {
        console.error('System Broadcast Failure:', err);
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}

export async function GET() {
    try {
        const supabaseAdmin = createClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.SUPABASE_SERVICE_ROLE_KEY!
        );

        // Fetch notifications, grouped by title/message conceptually
        const { data, error } = await supabaseAdmin
            .from('notifications')
            .select('title, message, created_at, type')
            .order('created_at', { ascending: false })
            .limit(300);

        if (error) throw error;

        // Group by title + message
        const grouped = (data || []).reduce((acc: any[], current: any) => {
            const existing = acc.find(item => item.title === current.title && item.message === current.message);
            if (!existing) {
                acc.push({ ...current, count: 1 });
            } else {
                existing.count++;
            }
            return acc;
        }, []);

        return NextResponse.json({ success: true, history: grouped });
    } catch (err: any) {
        console.error('History Fetch Failure:', err);
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}

export async function DELETE(req: NextRequest) {
    try {
        const { title, message } = await req.json();

        const supabaseAdmin = createClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.SUPABASE_SERVICE_ROLE_KEY!
        );

        const { error } = await supabaseAdmin
            .from('notifications')
            .delete()
            .eq('title', title)
            .eq('message', message);

        if (error) throw error;

        return NextResponse.json({ success: true });
    } catch (err: any) {
        console.error('De-index failure:', err);
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}

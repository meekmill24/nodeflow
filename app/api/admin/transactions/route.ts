import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const type = searchParams.get('type') || 'deposit';
        const status = searchParams.get('status');

        const supabaseAdmin = createClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.SUPABASE_SERVICE_ROLE_KEY!
        );

        let query = supabaseAdmin
            .from('transactions')
            .select('*, profile:profiles(username, wallet_balance, id, email)')
            .eq('type', type);

        if (status && status !== 'all') {
            query = query.eq('status', status);
        }

        const { data, error } = await query.order('created_at', { ascending: false });

        if (error) throw error;
        return NextResponse.json(data || []);
    } catch (err: any) {
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}

// POST to handle actions (approve/reject)
export async function POST(req: NextRequest) {
    try {
        const { id, status, type } = await req.json();
        if (!id || !status) return NextResponse.json({ error: 'ID and Status required' }, { status: 400 });

        const supabaseAdmin = createClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.SUPABASE_SERVICE_ROLE_KEY!
        );

        // Call identical RPC as the client used, but via Service Role to bypass RLS
        const rpcName = type === 'withdrawal' ? 'handle_withdrawal_action' : 'handle_deposit_action';
        
        const { data, error } = await supabaseAdmin.rpc(rpcName, {
            p_transaction_id: id,
            p_status: status
        });

        if (error) throw error;
        return NextResponse.json(data || { success: true });
    } catch (err: any) {
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}

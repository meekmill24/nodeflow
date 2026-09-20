import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
    try {
        const { userId, amount, type, memo } = await req.json();

        if (!userId || !amount || !type) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        const parsedAmount = parseFloat(amount);
        if (isNaN(parsedAmount) || parsedAmount <= 0) {
            return NextResponse.json({ error: 'Invalid amount' }, { status: 400 });
        }

        const supabaseAdmin = createClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.SUPABASE_SERVICE_ROLE_KEY!
        );

        // Get current balance
        const { data: profile, error: profileError } = await supabaseAdmin
            .from('profiles')
            .select('wallet_balance')
            .eq('id', userId)
            .single();

        if (profileError || !profile) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        const currentBalance = parseFloat(profile.wallet_balance) || 0;
        const newBalance = type === 'credit'
            ? currentBalance + parsedAmount
            : Math.max(0, currentBalance - parsedAmount);

        // Update balance
        const { error: updateError } = await supabaseAdmin
            .from('profiles')
            .update({ wallet_balance: newBalance })
            .eq('id', userId);

        if (updateError) throw updateError;

        // Log transaction
        const { error: txError } = await supabaseAdmin
            .from('transactions')
            .insert({
                user_id: userId,
                type: type === 'credit' ? 'deposit' : 'withdrawal',
                amount: parsedAmount,
                status: 'approved',
                description: memo || (type === 'credit' ? 'Admin Manual Credit' : 'Admin Manual Debit'),
            });

        if (txError) console.error('Transaction log error:', txError);

        return NextResponse.json({
            success: true,
            previousBalance: currentBalance,
            newBalance,
            delta: type === 'credit' ? parsedAmount : -parsedAmount,
        });
    } catch (err: any) {
        console.error('Wallet Credit/Debit Error:', err);
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}

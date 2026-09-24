import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

function getAdminClient() {
    return createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!,
        {
            auth: {
                persistSession: false,
                autoRefreshToken: false,
            }
        }
    );
}

export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const type = searchParams.get('type') || 'deposit';
        const status = searchParams.get('status');

        const supabaseAdmin = getAdminClient();

        let query = supabaseAdmin
            .from('transactions')
            .select('*, profile:profiles(username, wallet_balance, id, email)');

        if (type !== 'all') {
            query = query.eq('type', type);
        }

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
        const { id, status, type: requestedType } = await req.json();
        if (!id || !status) {
            return NextResponse.json({ error: 'ID and Status required' }, { status: 400 });
        }

        const supabaseAdmin = getAdminClient();

        // 1. Fetch transaction record
        const { data: tx, error: fetchErr } = await supabaseAdmin
            .from('transactions')
            .select('*')
            .eq('id', id)
            .single();

        if (fetchErr || !tx) {
            return NextResponse.json({ error: 'Transaction record not found' }, { status: 404 });
        }

        const txType = tx.type || requestedType || 'deposit';
        const cleanTxId = `TXN-${String(tx.id).padStart(6, '0')}`;
        const amount = Number(tx.amount) || 0;

        // 2. Fetch User Profile
        const { data: userProfile, error: profileErr } = await supabaseAdmin
            .from('profiles')
            .select('id, wallet_balance, freeze_balance, username')
            .eq('id', tx.user_id)
            .single();

        if (profileErr || !userProfile) {
            return NextResponse.json({ error: 'Beneficiary user account not found' }, { status: 404 });
        }

        const currentBalance = Number(userProfile.wallet_balance) || 0;
        const currentFreeze = Number(userProfile.freeze_balance) || 0;

        // 3. Process Deposit Approval / Rejection
        if (txType === 'deposit') {
            if (status === 'approved') {
                // If not already approved, credit wallet balance
                if (tx.status !== 'approved') {
                    const newBalance = currentBalance + amount;
                    const { error: balErr } = await supabaseAdmin
                        .from('profiles')
                        .update({
                            wallet_balance: newBalance,
                            updated_at: new Date().toISOString()
                        })
                        .eq('id', tx.user_id);

                    if (balErr) throw balErr;

                    // Log in transaction_ledger
                    try {
                        await supabaseAdmin.from('transaction_ledger').insert({
                            user_id: tx.user_id,
                            type: 'deposit',
                            amount: amount,
                            description: `Deposit Approved: +$${amount.toFixed(2)} (${tx.network || 'USDT'}) - TXID: #${cleanTxId}`
                        });
                    } catch (lErr) {
                        console.warn('Ledger error:', lErr);
                    }

                    // Notify user
                    try {
                        await supabaseAdmin.from('notifications').insert({
                            user_id: tx.user_id,
                            title: 'Deposit Approved & Credited',
                            message: `Your deposit of $${amount.toFixed(2)} USDT (TXID: #${cleanTxId}) has been verified and credited to your wallet balance.`,
                            type: 'success',
                            is_read: false
                        });
                    } catch (nErr) {
                        console.warn('Notification error:', nErr);
                    }
                }

                // Update transaction status
                await supabaseAdmin
                    .from('transactions')
                    .update({ status: 'approved' })
                    .eq('id', id);

            } else {
                // Rejected deposit
                if (tx.status === 'approved') {
                    // Reversing previously approved deposit
                    const newBalance = Math.max(0, currentBalance - amount);
                    await supabaseAdmin
                        .from('profiles')
                        .update({
                            wallet_balance: newBalance,
                            updated_at: new Date().toISOString()
                        })
                        .eq('id', tx.user_id);
                }

                await supabaseAdmin
                    .from('transactions')
                    .update({ status: 'rejected' })
                    .eq('id', id);

                // Notify user
                try {
                    await supabaseAdmin.from('notifications').insert({
                        user_id: tx.user_id,
                        title: 'Deposit Request Declined',
                        message: `Your deposit of $${amount.toFixed(2)} USDT (TXID: #${cleanTxId}) could not be verified. Please contact Customer Support.`,
                        type: 'warning',
                        is_read: false
                    });
                } catch (nErr) {
                    console.warn('Notification error:', nErr);
                }
            }

            return NextResponse.json({
                success: true,
                message: `Deposit of $${amount.toFixed(2)} marked as ${status}.`
            });
        }

        // 4. Process Withdrawal Approval / Rejection
        if (txType === 'withdrawal') {
            if (status === 'approved') {
                // Deduct from freeze_balance since funds were frozen at submission
                if (tx.status !== 'approved') {
                    const newFreeze = Math.max(0, currentFreeze - amount);
                    await supabaseAdmin
                        .from('profiles')
                        .update({
                            freeze_balance: newFreeze,
                            updated_at: new Date().toISOString()
                        })
                        .eq('id', tx.user_id);

                    // Log in transaction_ledger
                    try {
                        await supabaseAdmin.from('transaction_ledger').insert({
                            user_id: tx.user_id,
                            type: 'withdrawal',
                            amount: amount,
                            description: `Withdrawal Disbursed: -$${amount.toFixed(2)} to ${tx.address || 'wallet'} - TXID: #${cleanTxId}`
                        });
                    } catch (lErr) {
                        console.warn('Ledger error:', lErr);
                    }

                    // Notify user
                    try {
                        await supabaseAdmin.from('notifications').insert({
                            user_id: tx.user_id,
                            title: 'Withdrawal Disbursed',
                            message: `Your withdrawal of $${amount.toFixed(2)} USDT (TXID: #${cleanTxId}) has been processed and disbursed to your wallet.`,
                            type: 'success',
                            is_read: false
                        });
                    } catch (nErr) {
                        console.warn('Notification error:', nErr);
                    }
                }

                await supabaseAdmin
                    .from('transactions')
                    .update({ status: 'approved' })
                    .eq('id', id);

            } else {
                // Rejected withdrawal: unfreeze and refund back to wallet_balance
                if (tx.status !== 'rejected') {
                    const newFreeze = Math.max(0, currentFreeze - amount);
                    const newBalance = currentBalance + amount;
                    await supabaseAdmin
                        .from('profiles')
                        .update({
                            wallet_balance: newBalance,
                            freeze_balance: newFreeze,
                            updated_at: new Date().toISOString()
                        })
                        .eq('id', tx.user_id);

                    // Log in transaction_ledger
                    try {
                        await supabaseAdmin.from('transaction_ledger').insert({
                            user_id: tx.user_id,
                            type: 'withdrawal',
                            amount: amount,
                            description: `Withdrawal Rejected & Refunded: +$${amount.toFixed(2)} - TXID: #${cleanTxId}`
                        });
                    } catch (lErr) {
                        console.warn('Ledger error:', lErr);
                    }

                    // Notify user
                    try {
                        await supabaseAdmin.from('notifications').insert({
                            user_id: tx.user_id,
                            title: 'Withdrawal Rejected & Refunded',
                            message: `Your withdrawal request of $${amount.toFixed(2)} USDT (TXID: #${cleanTxId}) was not approved. The funds have been refunded to your wallet balance.`,
                            type: 'info',
                            is_read: false
                        });
                    } catch (nErr) {
                        console.warn('Notification error:', nErr);
                    }
                }

                await supabaseAdmin
                    .from('transactions')
                    .update({ status: 'rejected' })
                    .eq('id', id);
            }

            return NextResponse.json({
                success: true,
                message: `Withdrawal of $${amount.toFixed(2)} marked as ${status}.`
            });
        }

        // Generic fallback for any other transaction types
        await supabaseAdmin
            .from('transactions')
            .update({ status })
            .eq('id', id);

        return NextResponse.json({ success: true, message: `Transaction ${status}.` });

    } catch (err: any) {
        console.error('Transaction action handler error:', err);
        return NextResponse.json({ error: err.message || 'Internal server error' }, { status: 500 });
    }
}

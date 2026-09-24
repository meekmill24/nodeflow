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

export async function POST(req: NextRequest) {
    try {
        const formData = await req.formData();
        const file = formData.get('file') as File | null;
        const amountStr = formData.get('amount') as string;
        const network = (formData.get('network') as string) || 'TRX';
        const address = formData.get('address') as string;
        const userId = formData.get('userId') as string;
        const txHash = (formData.get('txHash') as string) || '';

        if (!userId) {
            return NextResponse.json({ error: 'User identifier is required' }, { status: 400 });
        }

        const amount = parseFloat(amountStr);
        if (isNaN(amount) || amount <= 0) {
            return NextResponse.json({ error: 'Valid deposit amount is required' }, { status: 400 });
        }

        const supabaseAdmin = getAdminClient();
        let publicUrl: string | null = null;

        // 1. Upload proof file via Service Role to bypass Storage RLS policies
        if (file) {
            const fileExt = file.name ? file.name.split('.').pop() : 'png';
            const fileName = `${userId}-${Date.now()}-${Math.random().toString(36).substring(2, 9)}.${fileExt}`;
            const fileBuffer = Buffer.from(await file.arrayBuffer());

            const { error: uploadError } = await supabaseAdmin.storage
                .from('deposit_proofs')
                .upload(fileName, fileBuffer, {
                    contentType: file.type || 'image/png',
                    upsert: true
                });

            if (uploadError) {
                console.error('Storage upload error in API route:', uploadError);
                return NextResponse.json({ error: `Proof upload failed: ${uploadError.message}` }, { status: 500 });
            }

            const { data: urlData } = supabaseAdmin.storage
                .from('deposit_proofs')
                .getPublicUrl(fileName);

            publicUrl = urlData.publicUrl;
        }

        // 2. Insert transaction via Service Role
        const { data: txData, error: txError } = await supabaseAdmin
            .from('transactions')
            .insert({
                user_id: userId,
                type: 'deposit',
                amount: amount,
                status: 'pending',
                network: network,
                address: address || null,
            })
            .select()
            .single();

        if (txError) {
            console.error('Transactions insert error:', txError);
            return NextResponse.json({ error: `Transaction creation failed: ${txError.message}` }, { status: 500 });
        }

        const cleanTxId = `TXN-${String(txData.id).padStart(6, '0')}`;

        // 3. Log to transaction_ledger with full details
        try {
            await supabaseAdmin.from('transaction_ledger').insert({
                user_id: userId,
                type: 'deposit',
                amount: amount,
                description: `Deposit via ${network} ($${amount.toFixed(2)}) - TXID: #${cleanTxId}${txHash ? ` - Hash: ${txHash}` : ''}${publicUrl ? ' - Proof attached' : ''}`
            });
        } catch (ledgerErr) {
            console.warn('Ledger recording notice:', ledgerErr);
        }

        // 4. Create user notification
        try {
            await supabaseAdmin.from('notifications').insert({
                user_id: userId,
                title: 'Deposit Submission Received',
                message: `Your deposit of $${amount.toFixed(2)} USDT (TXID: #${cleanTxId}) has been registered and is pending verification.`,
                type: 'info',
                is_read: false
            });
        } catch (notifErr) {
            console.warn('Notification creation notice:', notifErr);
        }

        return NextResponse.json({
            success: true,
            transaction: {
                ...txData,
                txId: cleanTxId,
            },
            txId: cleanTxId,
            proofUrl: publicUrl
        });
    } catch (err: any) {
        console.error('Deposit route exception:', err);
        return NextResponse.json({ error: err.message || 'Internal server error' }, { status: 500 });
    }
}

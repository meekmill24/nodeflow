import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

// In-memory cache to prevent Supabase Disk IO exhaustion from rapid admin page switching
let cachedUsers: any = null;
let lastUsersCacheTimestamp = 0;
const CACHE_TTL_MS = 15 * 1000; // 15 seconds TTL

export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const forceFresh = searchParams.get('fresh') === 'true';

        const now = Date.now();
        if (!forceFresh && cachedUsers && (now - lastUsersCacheTimestamp) < CACHE_TTL_MS) {
            return NextResponse.json(cachedUsers, {
                headers: { 'X-Cache': 'HIT', 'Cache-Control': 'public, max-age=15' }
            });
        }

        const url = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
        const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SECRET_KEY;

        if (!url || !key) {
            return NextResponse.json({ error: 'System Configuration Fault: Supabase credentials missing on the host server.' }, { status: 500 });
        }

        const supabaseAdmin = createClient(url, key, { db: { schema: 'public' } });

        const { data: users, error } = await supabaseAdmin
            .from('profiles')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) {
            return NextResponse.json({ error: `Directory Sync Collision: ${error.message}` }, { status: 500 });
        }

        const result = users || [];
        cachedUsers = result;
        lastUsersCacheTimestamp = now;

        return NextResponse.json(result, {
            headers: { 'X-Cache': 'MISS', 'Cache-Control': 'public, max-age=15' }
        });
    } catch (err: any) {
        return NextResponse.json({ error: `Critical System Failure: ${err.message}` }, { status: 500 });
    }
}

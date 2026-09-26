import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json({ error: 'No image file provided' }, { status: 400 });
    }

    const fileExt = file.name ? file.name.split('.').pop()?.toLowerCase() : 'png';
    const cleanFileName = `product-${Date.now()}-${Math.random().toString(36).substring(2, 9)}.${fileExt}`;
    const fileBuffer = Buffer.from(await file.arrayBuffer());

    let bucketName = 'product_images';
    let { error: uploadError } = await supabaseAdmin.storage
      .from(bucketName)
      .upload(cleanFileName, fileBuffer, {
        contentType: file.type || 'image/png',
        upsert: true,
      });

    if (uploadError) {
      console.warn(`Upload to ${bucketName} failed, falling back to deposit_proofs:`, uploadError);
      bucketName = 'deposit_proofs';
      const fallbackRes = await supabaseAdmin.storage
        .from(bucketName)
        .upload(cleanFileName, fileBuffer, {
          contentType: file.type || 'image/png',
          upsert: true,
        });
      if (fallbackRes.error) {
        throw new Error(fallbackRes.error.message);
      }
    }

    const { data: urlData } = supabaseAdmin.storage
      .from(bucketName)
      .getPublicUrl(cleanFileName);

    return NextResponse.json({ url: urlData.publicUrl });
  } catch (err: any) {
    console.error('Image upload error:', err);
    return NextResponse.json({ error: err.message || 'Image upload failed' }, { status: 500 });
  }
}

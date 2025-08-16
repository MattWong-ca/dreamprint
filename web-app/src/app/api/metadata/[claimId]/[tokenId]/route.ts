import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function GET(
    req: Request,
    { params }: { params: Promise<{ claimId: string; tokenId: string }> }
) {
  try {
    const { claimId, tokenId } = await params;

    if (!claimId || !tokenId) {
      return NextResponse.json(
        { error: 'Missing claimId or tokenId' },
        { status: 400 }
      );
    }

    console.log(`Fetching metadata for claim ${claimId}, token ${tokenId}`);

    // Get order from database using claimId
    const { data: order, error } = await supabase
      .from('dreamprint_orders')
      .select('*')
      .eq('claim_id', claimId)
      .single();

    if (error || !order) {
      console.error('Order not found:', error);
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      );
    }

    // Return NFT metadata
    return NextResponse.json({
      name: `Dreamprint #${tokenId}`,
      description: `AI polaroid print from Dreamprint at ETHGlobal New York, August 2025. View at https://dreamprint.vercel.app/claim/${claimId}`,
      image: order.image_url,
      external_url: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://dreamprint.com'}/claim/${claimId}`
    });

  } catch (error: unknown) {
    console.error('Error fetching metadata:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

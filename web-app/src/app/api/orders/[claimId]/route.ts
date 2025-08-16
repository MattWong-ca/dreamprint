import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function GET(
  request: NextRequest,
  { params }: { params: { claimId: string } }
) {
  try {
    const { claimId } = params;

    if (!claimId) {
      return NextResponse.json(
        { error: 'Missing claimId' },
        { status: 400 }
      );
    }

    console.log(`Fetching order for claim ID: ${claimId}`);

    // Fetch order from Supabase
    const { data: order, error } = await supabase
      .from('dreamprint_orders')
      .select('*')
      .eq('claim_id', claimId)
      .single();

    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      );
    }

    if (!order) {
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      order: order
    });

  } catch (error: unknown) {
    console.error('Error fetching order:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { claimId: string } }
) {
  try {
    const { claimId } = params;
    const body = await request.json();

    if (!claimId) {
      return NextResponse.json(
        { error: 'Missing claimId' },
        { status: 400 }
      );
    }

    console.log(`Updating order for claim ID: ${claimId}`, body);

    // Update order in Supabase
    const { data: order, error } = await supabase
      .from('dreamprint_orders')
      .update(body)
      .eq('claim_id', claimId)
      .select()
      .single();

    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json(
        { error: 'Failed to update order' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      order: order
    });

  } catch (error: unknown) {
    console.error('Error updating order:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

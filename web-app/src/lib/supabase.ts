import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Types for our dreamprint_orders table
export interface DreamprintOrder {
  id?: number;
  claim_id: string;
  wallet_address: string;
  paid: boolean;
  collage_opt_in: boolean;
  tweet_link?: string;
  minted_status?: boolean;
  image_url?: string;
  created_at?: string;
}

// Function to insert a new order
export async function insertOrder(order: Omit<DreamprintOrder, 'id' | 'created_at'>) {
  const { data, error } = await supabase
    .from('dreamprint_orders')
    .insert([order])
    .select()
    .single();

  if (error) {
    console.error('Error inserting order:', error);
    throw error;
  }

  return data;
}

// Function to get orders by wallet address
export async function getOrdersByWallet(walletAddress: string) {
  const { data, error } = await supabase
    .from('dreamprint_orders')
    .select('*')
    .eq('wallet_address', walletAddress)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching orders:', error);
    throw error;
  }

  return data;
}

// Function to update order status
export async function updateOrderStatus(claimId: string, updates: Partial<DreamprintOrder>) {
  const { data, error } = await supabase
    .from('dreamprint_orders')
    .update(updates)
    .eq('claim_id', claimId)
    .select()
    .single();

  if (error) {
    console.error('Error updating order:', error);
    throw error;
  }

  return data;
}

// Function to get all orders (for admin)
export async function getAllOrders() {
  const { data, error } = await supabase
    .from('dreamprint_orders')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching all orders:', error);
    throw error;
  }

  return data;
}

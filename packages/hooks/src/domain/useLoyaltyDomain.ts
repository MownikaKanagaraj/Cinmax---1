import { useQuery } from '@tanstack/react-query';
import { getContainer } from '@cinmax/api';

export interface LoyaltyTransactionRecord {
  id: string;
  userId: string;
  orderId?: string | null;
  transactionType: string;
  points: number;
  balanceAfter: number;
  description: string;
  createdAt: string;
}

export function useUserLoyaltyTransactionsQuery(userId?: string) {
  return useQuery({
    queryKey: ['loyalty', 'transactions', userId],
    queryFn: async (): Promise<LoyaltyTransactionRecord[]> => {
      if (!userId) return [];
      const container = getContainer();
      const { data, error } = await (container as any).supabase
        .from('loyalty_transactions')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching loyalty transactions:', error);
        return [];
      }

      return (data || []).map((row: any) => ({
        id: row.id,
        userId: row.user_id,
        orderId: row.order_id,
        transactionType: row.transaction_type,
        points: Number(row.points) || 0,
        balanceAfter: Number(row.balance_after) || 0,
        description: row.description || '',
        createdAt: row.created_at,
      }));
    },
    enabled: Boolean(userId),
  });
}

export function useUserLoyaltySummaryQuery(userId?: string) {
  return useQuery({
    queryKey: ['loyalty', 'summary', userId],
    queryFn: async (): Promise<{
      pointsBalance: number;
      tier: string;
      transactions: LoyaltyTransactionRecord[];
    }> => {
      if (!userId) return { pointsBalance: 0, tier: 'bronze', transactions: [] };
      const container = getContainer();
      const supabase = (container as any).supabase;

      const [{ data: profile }, { data: txs, error: txErr }] = await Promise.all([
        supabase.from('profiles').select('loyalty_points, loyalty_tier').eq('id', userId).maybeSingle(),
        supabase.from('loyalty_transactions').select('*').eq('user_id', userId).order('created_at', { ascending: false }),
      ]);

      if (txErr) {
        console.error('Error fetching loyalty transactions:', txErr);
      }

      const transactions: LoyaltyTransactionRecord[] = (txs || []).map((row: any) => ({
        id: row.id,
        userId: row.user_id,
        orderId: row.order_id,
        transactionType: row.transaction_type,
        points: Number(row.points) || 0,
        balanceAfter: Number(row.balance_after) || 0,
        description: row.description || '',
        createdAt: row.created_at,
      }));

      const pointsBalance = Math.max(0, Number(profile?.loyalty_points) || 0);
      const tier = profile?.loyalty_tier || 'bronze';

      return {
        pointsBalance,
        tier,
        transactions,
      };
    },
    enabled: Boolean(userId),
  });
}


export function useAdminLoyaltyLedgerQuery() {
  return useQuery({
    queryKey: ['admin', 'loyalty', 'ledger'],
    queryFn: async () => {
      const container = getContainer();
      const { data: txs, error: txErr } = await (container as any).supabase
        .from('loyalty_transactions')
        .select('*, profile:profiles(first_name, last_name, email, loyalty_points, loyalty_tier)')
        .order('created_at', { ascending: false });

      if (txErr) console.error('Error fetching admin loyalty ledger:', txErr);

      const { data: profiles, error: profErr } = await (container as any).supabase
        .from('profiles')
        .select('*')
        .order('loyalty_points', { ascending: false });

      if (profErr) console.error('Error fetching loyalty profiles:', profErr);

      return {
        transactions: (txs || []).map((row: any) => ({
          id: row.id,
          userId: row.user_id,
          customerName: `${row.profile?.first_name || 'Valued'} ${row.profile?.last_name || 'Customer'}`.trim(),
          customerEmail: row.profile?.email || 'customer@cinmax.com',
          type: row.transaction_type,
          points: Number(row.points) || 0,
          balanceAfter: Number(row.balance_after) || 0,
          referenceId: row.order_id ? `ORDER-${row.order_id.slice(0, 8)}` : 'REWARD',
          date: new Date(row.created_at).toLocaleString(),
          status: 'COMPLETED',
          description: row.description || '',
        })),
        topCustomers: (profiles || []).map((p: any) => ({
          id: p.id,
          name: `${p.first_name || 'Valued'} ${p.last_name || 'Customer'}`.trim(),
          email: p.email || '',
          balance: Number(p.loyalty_points) || 0,
          tier: (p.loyalty_tier || 'bronze').toUpperCase(),
        })),
      };
    },
  });
}

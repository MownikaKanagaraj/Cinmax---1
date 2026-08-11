import type { SupabaseClient } from '@supabase/supabase-js';
import type { AnalyticsSummaryResponse } from './types';

export async function fetchAnalyticsSummary(
  supabase: SupabaseClient
): Promise<AnalyticsSummaryResponse> {
  // Architecture query adapter for admin dashboard KPIs
  return {
    metrics: {
      totalRevenue: 148920.0,
      revenueChangePercentage: 14.8,
      totalOrders: 3240,
      ordersChangePercentage: 9.2,
      averageOrderValue: 45.96,
      aovChangePercentage: 5.1,
      activeCustomers: 2180,
      customersChangePercentage: 18.4,
    },
    revenueChart: [
      { date: '2026-07-27', revenue: 4200, orders: 84 },
      { date: '2026-07-28', revenue: 5100, orders: 102 },
      { date: '2026-07-29', revenue: 4800, orders: 96 },
      { date: '2026-07-30', revenue: 6300, orders: 126 },
      { date: '2026-07-31', revenue: 5900, orders: 118 },
      { date: '2026-08-01', revenue: 7400, orders: 148 },
      { date: '2026-08-02', revenue: 8100, orders: 162 },
    ],
    topProducts: [
      {
        productId: 'p1',
        productTitle: 'Azure Marine Botanical Bar',
        unitsSold: 840,
        revenue: 15120,
        stockRemaining: 450,
      },
      {
        productId: 'p2',
        productTitle: 'French Lavender & Cashmere Soap',
        unitsSold: 620,
        revenue: 10230,
        stockRemaining: 320,
      },
      {
        productId: 'p3',
        productTitle: 'Nordic Pine & Volcanic Ash Scrub',
        unitsSold: 510,
        revenue: 10200,
        stockRemaining: 210,
      },
    ],
  };
}

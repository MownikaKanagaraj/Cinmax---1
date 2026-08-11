import type { SalesChartDataPoint, SalesMetricSummary, TopProductMetric } from '@cinmax/types';

export interface AnalyticsSummaryResponse {
  metrics: SalesMetricSummary;
  revenueChart: SalesChartDataPoint[];
  topProducts: TopProductMetric[];
}

'use client';

import * as React from 'react';
import { AdminLayout } from '../../components/admin-layout';
import { PageHeader, Badge } from '@cinmax/ui';
import { formatCurrency } from '@cinmax/utils';

export default function AdminAnalyticsPage() {
  return (
    <AdminLayout>
      <PageHeader
        badge="Business Intelligence"
        title="Revenue & Performance Analytics"
        subtitle="Financial trajectory, conversion funnel breakdown, and product velocity metrics."
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 my-8">
        <div className="p-6 rounded-[24px] bg-white dark:bg-[#071324] border border-[#0A3D78]/10 space-y-2">
          <span className="text-xs uppercase font-bold text-muted-foreground">
            Monthly Gross Revenue
          </span>
          <h3 className="font-serif text-3xl font-black text-[#002754] dark:text-white">
            {formatCurrency(24850.0)}
          </h3>
          <p className="text-xs text-emerald-600 font-bold">+18.4% vs last period</p>
        </div>

        <div className="p-6 rounded-[24px] bg-white dark:bg-[#071324] border border-[#0A3D78]/10 space-y-2">
          <span className="text-xs uppercase font-bold text-muted-foreground">
            Average Order Value (AOV)
          </span>
          <h3 className="font-serif text-3xl font-black text-[#002754] dark:text-white">
            {formatCurrency(54.2)}
          </h3>
          <p className="text-xs text-emerald-600 font-bold">+4.1% following gift-set launch</p>
        </div>

        <div className="p-6 rounded-[24px] bg-white dark:bg-[#071324] border border-[#0A3D78]/10 space-y-2">
          <span className="text-xs uppercase font-bold text-muted-foreground">
            Cart-to-Order Conversion
          </span>
          <h3 className="font-serif text-3xl font-black text-[#002754] dark:text-white">
            4.82%
          </h3>
          <p className="text-xs text-emerald-600 font-bold">Top decile luxury e-commerce</p>
        </div>
      </div>

      <div className="p-8 rounded-[28px] bg-white dark:bg-[#071324] border border-[#0A3D78]/10 space-y-4">
        <h3 className="font-serif text-lg font-bold text-[#002754] dark:text-white">
          Top Performing Botanical Formulations
        </h3>
        <div className="space-y-3 pt-2">
          {[
            { name: 'French Green Clay & Eucalyptus Bar', share: '38% of total volume', revenue: '$9,443' },
            { name: 'Activated Charcoal & Tea Tree Bar', share: '29% of total volume', revenue: '$7,206' },
            { name: 'Wildcrafted Sea Kelp & Marine Minerals', share: '18% of total volume', revenue: '$4,473' },
            { name: 'Organic Shea & Calendula Butter Bar', share: '15% of total volume', revenue: '$3,728' },
          ].map((item, idx) => (
            <div key={idx} className="p-4 rounded-[16px] bg-[#F7F9FB] dark:bg-[#0A192F] flex justify-between items-center">
              <div>
                <p className="font-bold text-xs text-[#002754] dark:text-white">{item.name}</p>
                <p className="text-[10px] text-muted-foreground">{item.share}</p>
              </div>
              <span className="font-serif font-bold text-sm">{item.revenue}</span>
            </div>
          ))}
        </div>
      </div>
    </AdminLayout>
  );
}

'use client';

import * as React from 'react';
import { AdminLayout } from '../../components/admin-layout';
import { PageHeader, Badge, Button } from '@cinmax/ui';
import { useProductsQuery } from '@cinmax/hooks';

export default function AdminInventoryPage() {
  const { data: productsData } = useProductsQuery();

  const inventoryBatches = [
    {
      id: 'batch_101',
      productName: 'French Green Clay & Eucalyptus Bar',
      batchNumber: 'BATCH-2026-07A',
      cureStartDate: 'June 20, 2026',
      cureEndDate: 'August 4, 2026',
      totalYield: 250,
      availableUnits: 180,
      reservedUnits: 42,
      cureProgress: 90,
      status: 'curing_final_stage',
    },
    {
      id: 'batch_102',
      productName: 'Activated Charcoal & Tea Tree Bar',
      batchNumber: 'BATCH-2026-07B',
      cureStartDate: 'July 05, 2026',
      cureEndDate: 'August 18, 2026',
      totalYield: 300,
      availableUnits: 0,
      reservedUnits: 0,
      cureProgress: 60,
      status: 'curing_mid_stage',
    },
    {
      id: 'batch_103',
      productName: 'Organic Shea & Calendula Butter Bar',
      batchNumber: 'BATCH-2026-06C',
      cureStartDate: 'June 01, 2026',
      cureEndDate: 'July 15, 2026',
      totalYield: 200,
      availableUnits: 34,
      reservedUnits: 12,
      cureProgress: 100,
      status: 'ready_for_dispatch',
    },
  ];

  return (
    <AdminLayout>
      <PageHeader
        badge="Atelier Curing telemetry"
        title="Inventory & Curing Rack Tracker"
        subtitle="Track botanical aging schedules, humidity room temperatures, and available finished units."
        actions={
          <Button variant="primary" size="sm" className="rounded-full">
            + Log New Curing Pour
          </Button>
        }
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 my-8">
        <div className="p-6 rounded-[24px] bg-white dark:bg-[#071324] border border-[#0A3D78]/10 space-y-2">
          <span className="text-xs uppercase font-bold text-muted-foreground">
            Total Finished Units in Stock
          </span>
          <h3 className="font-serif text-2xl font-bold text-[#002754] dark:text-white">
            642 Units
          </h3>
          <p className="text-xs text-emerald-600">Sufficient for 18 days average velocity</p>
        </div>

        <div className="p-6 rounded-[24px] bg-white dark:bg-[#071324] border border-[#0A3D78]/10 space-y-2">
          <span className="text-xs uppercase font-bold text-muted-foreground">
            Units Aging on Curing Racks
          </span>
          <h3 className="font-serif text-2xl font-bold text-[#002754] dark:text-white">
            750 Units
          </h3>
          <p className="text-xs text-amber-600">Next release in 2 days (Batch 101)</p>
        </div>

        <div className="p-6 rounded-[24px] bg-white dark:bg-[#071324] border border-[#0A3D78]/10 space-y-2">
          <span className="text-xs uppercase font-bold text-muted-foreground">
            Curing Room Climate
          </span>
          <h3 className="font-serif text-2xl font-bold text-[#002754] dark:text-white">
            21.2°C / 44% RH
          </h3>
          <p className="text-xs text-emerald-600">Optimal slow saponification conditions</p>
        </div>
      </div>

      <div className="p-6 rounded-[24px] bg-white dark:bg-[#071324] border border-[#0A3D78]/10 shadow-sm space-y-4">
        <h3 className="font-serif text-lg font-bold text-[#002754] dark:text-white">
          Active Production Batches
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-[#0A3D78]/10 text-muted-foreground uppercase tracking-wider">
              <tr>
                <th className="pb-3 font-semibold">Batch Code</th>
                <th className="pb-3 font-semibold">Formulation</th>
                <th className="pb-3 font-semibold">Cure Window</th>
                <th className="pb-3 font-semibold">Cure Progress</th>
                <th className="pb-3 font-semibold">Stock / Yield</th>
                <th className="pb-3 font-semibold text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#0A3D78]/10">
              {inventoryBatches.map((batch) => (
                <tr key={batch.id} className="hover:bg-[#F7F9FB] dark:hover:bg-[#0A192F]/40">
                  <td className="py-4 font-mono font-bold">{batch.batchNumber}</td>
                  <td className="py-4 font-bold text-[#002754] dark:text-white">
                    {batch.productName}
                  </td>
                  <td className="py-4 text-muted-foreground">
                    {batch.cureStartDate} – {batch.cureEndDate}
                  </td>
                  <td className="py-4">
                    <div className="space-y-1 w-32">
                      <div className="flex justify-between text-[10px] font-bold">
                        <span>{batch.cureProgress}%</span>
                      </div>
                      <div className="h-1.5 rounded-full bg-slate-200 overflow-hidden">
                        <div
                          className="h-full bg-[#002754] dark:bg-[#C5A880]"
                          style={{ width: `${batch.cureProgress}%` }}
                        />
                      </div>
                    </div>
                  </td>
                  <td className="py-4 font-semibold">
                    {batch.availableUnits} / {batch.totalYield} units
                  </td>
                  <td className="py-4 text-right">
                    <button className="text-[#0A3D78] dark:text-[#C5A880] font-bold hover:underline">
                      Log Sample Test
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
}

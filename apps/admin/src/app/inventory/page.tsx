'use client';

import * as React from 'react';
import { AdminLayout } from '../../components/admin-layout';
import { PageHeader, Button } from '@cinmax/ui';
import { useProductsQuery } from '@cinmax/hooks';

export default function AdminInventoryPage() {
  const { data: productsData } = useProductsQuery();

  const inventoryBatches = [
    {
      id: 'batch_101',
      productName: 'French Green Clay & Eucalyptus Bar',
      batchNumber: 'SKU-2026-07A',
      cureStartDate: 'June 20, 2026',
      cureEndDate: 'August 4, 2026',
      totalYield: 250,
      availableUnits: 180,
      reservedUnits: 42,
      cureProgress: 90,
      status: 'Ready in Stock',
    },
    {
      id: 'batch_102',
      productName: 'Activated Charcoal & Tea Tree Bar',
      batchNumber: 'SKU-2026-07B',
      cureStartDate: 'July 05, 2026',
      cureEndDate: 'August 18, 2026',
      totalYield: 300,
      availableUnits: 150,
      reservedUnits: 20,
      cureProgress: 60,
      status: 'In Stock',
    },
    {
      id: 'batch_103',
      productName: 'Organic Shea & Calendula Butter Bar',
      batchNumber: 'SKU-2026-06C',
      cureStartDate: 'June 01, 2026',
      cureEndDate: 'July 15, 2026',
      totalYield: 200,
      availableUnits: 34,
      reservedUnits: 12,
      cureProgress: 100,
      status: 'Low Stock',
    },
  ];

  return (
    <AdminLayout>
      <PageHeader
        badge="Stock Management"
        title="Stock & Warehouse Inventory"
        subtitle="Track product stock levels, total available items in warehouse, and low stock warnings."
        actions={
          <Button variant="primary" size="sm" className="rounded-xl">
            + Add Stock Entry
          </Button>
        }
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 my-6">
        <div className="p-6 rounded-2xl bg-white dark:bg-[#0B132B] border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Products</p>
          <h3 className="text-3xl font-bold text-[#0F172A] dark:text-white">1,450 Units</h3>
          <p className="text-xs font-semibold text-emerald-600">Available across 24 SKUs</p>
        </div>

        <div className="p-6 rounded-2xl bg-white dark:bg-[#0B132B] border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Low Stock Items</p>
          <h3 className="text-3xl font-bold text-amber-600 dark:text-amber-400">3 Products</h3>
          <p className="text-xs font-semibold text-amber-600">Reorder threshold under 50 units</p>
        </div>

        <div className="p-6 rounded-2xl bg-white dark:bg-[#0B132B] border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Reserved Orders</p>
          <h3 className="text-3xl font-bold text-blue-600 dark:text-blue-400">74 Units</h3>
          <p className="text-xs font-semibold text-slate-400">Allocated for pending dispatches</p>
        </div>
      </div>

      <div className="p-6 rounded-2xl bg-white dark:bg-[#0B132B] border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <h3 className="text-base font-bold text-[#0F172A] dark:text-white">Warehouse Inventory Log</h3>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-slate-200 dark:border-slate-800 text-slate-400 uppercase tracking-wider font-bold">
              <tr>
                <th className="pb-3">Product Name</th>
                <th className="pb-3">SKU Code</th>
                <th className="pb-3">Total Produced</th>
                <th className="pb-3">Available Stock</th>
                <th className="pb-3">Reserved</th>
                <th className="pb-3">Stock Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
              {inventoryBatches.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50 dark:hover:bg-slate-900/50 transition-colors">
                  <td className="py-4 font-bold text-[#0F172A] dark:text-white">{item.productName}</td>
                  <td className="py-4 font-mono text-slate-500">{item.batchNumber}</td>
                  <td className="py-4 font-semibold">{item.totalYield} units</td>
                  <td className="py-4 font-bold text-emerald-600 dark:text-emerald-400">{item.availableUnits} units</td>
                  <td className="py-4 font-medium text-slate-400">{item.reservedUnits} units</td>
                  <td className="py-4">
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-blue-50 text-blue-600 dark:bg-blue-950/80 dark:text-blue-400 border border-blue-200 dark:border-blue-800">
                      {item.status}
                    </span>
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

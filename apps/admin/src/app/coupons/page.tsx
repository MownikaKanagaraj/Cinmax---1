'use client';

import * as React from 'react';
import { AdminLayout } from '../../components/admin-layout';
import { PageHeader, Badge, Button } from '@cinmax/ui';
import { useCouponsQuery, useDeactivateCouponMutation } from '@cinmax/hooks';
import type { Coupon } from '@cinmax/types';

export default function AdminCouponsPage() {
  const { data: coupons = [] } = useCouponsQuery();
  const deactivateMutation = useDeactivateCouponMutation();

  return (
    <AdminLayout>
      <PageHeader
        badge="Promotions Engine"
        title="Discounts & Privilege Passes"
        subtitle="Create seasonal coupon vouchers, set minimum order conditions, and limit usage counts."
        actions={
          <Button variant="primary" size="sm" className="rounded-full">
            + Issue New Coupon
          </Button>
        }
      />

      <div className="p-6 rounded-[24px] bg-white dark:bg-[#071324] border border-[#0A3D78]/10 shadow-sm mt-6">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-[#0A3D78]/10 text-muted-foreground uppercase tracking-wider">
              <tr>
                <th className="pb-3 font-semibold">Coupon Code</th>
                <th className="pb-3 font-semibold">Discount</th>
                <th className="pb-3 font-semibold">Min Order</th>
                <th className="pb-3 font-semibold">Usage Count</th>
                <th className="pb-3 font-semibold">Status</th>
                <th className="pb-3 font-semibold text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#0A3D78]/10">
              {coupons.map((c: Coupon) => (
                <tr key={c.id} className="hover:bg-[#F7F9FB] dark:hover:bg-[#0A192F]/40">
                  <td className="py-4 font-mono font-bold text-[#002754] dark:text-[#C5A880] text-sm">
                    {c.code}
                  </td>
                  <td className="py-4 font-bold">
                    {c.discountType === 'percentage'
                      ? `${c.discountValue}% OFF`
                      : `$${c.discountValue} OFF`}
                  </td>
                  <td className="py-4 text-muted-foreground">${c.minOrderAmount || 0}</td>
                  <td className="py-4 text-muted-foreground">42 redeems</td>
                  <td className="py-4">
                    <Badge variant="gold">Active</Badge>
                  </td>
                  <td className="py-4 text-right">
                    <button
                      onClick={() => deactivateMutation.mutate(c.id)}
                      className="text-[#0A3D78] dark:text-[#C5A880] font-bold hover:underline"
                    >
                      Deactivate
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

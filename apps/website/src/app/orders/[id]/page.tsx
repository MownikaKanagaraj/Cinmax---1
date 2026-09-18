import * as React from 'react';
import OrderDetailClient from './OrderDetailClient';

export function generateStaticParams() {
  return [{ id: 'CNX-20260802-8492' }];
}

export default function OrderDetailPage() {
  return <OrderDetailClient />;
}

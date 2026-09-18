import * as React from 'react';
import TrackOrderClient from './TrackOrderClient';

export function generateStaticParams() {
  return [{ id: 'CNX-20260802-8492' }];
}

export default function TrackOrderPage() {
  return <TrackOrderClient />;
}

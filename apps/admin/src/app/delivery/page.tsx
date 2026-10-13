'use client';

import * as React from 'react';
import { AdminLayout } from '../../components/admin-layout';
import { PageHeader, Button, Input } from '@cinmax/ui';
import { formatCurrency } from '@cinmax/utils';
import { useSettingsQuery, useUpdateSettingsMutation } from '@cinmax/hooks';
import {
  Truck,
  MapPin,
  Calculator,
  ShieldCheck,
  Check,
  Save,
  Layers,
  ArrowRight,
  Sparkles,
  Info,
  Building,
  CheckCircle2,
  Clock,
} from 'lucide-react';

interface DeliveryRule {
  zoneName: string;
  states: string[];
  tiers: {
    rangeLabel: string;
    rateDisplay: string;
    isFree: boolean;
  }[];
  notes: string;
}

export default function DeliveryManagementPage() {
  const [isSaved, setIsSaved] = React.useState(false);

  // Live Calculator Simulator State
  const [calcState, setCalcState] = React.useState('Tamil Nadu');
  const [calcQty, setCalcQty] = React.useState(7);

  // Delivery Rules Matrix
  const deliveryZones: DeliveryRule[] = [
    {
      zoneName: 'Zone 1: Local & Home Territory',
      states: ['Tamil Nadu', 'Puducherry'],
      tiers: [
        { rangeLabel: '1 – 5 products', rateDisplay: '₹60 flat', isFree: false },
        { rangeLabel: '6+ products', rateDisplay: 'FREE Shipping', isFree: true },
      ],
      notes: 'Optimized intra-state surface transit via local courier network.',
    },
    {
      zoneName: 'Zone 2: South Indian States',
      states: ['Kerala', 'Karnataka', 'Andhra Pradesh', 'Telangana'],
      tiers: [
        { rangeLabel: '1 – 5 products', rateDisplay: '₹80 flat', isFree: false },
        { rangeLabel: '6 – 10 products', rateDisplay: 'FREE Shipping', isFree: true },
        { rangeLabel: '11+ products', rateDisplay: '₹10 × total product quantity', isFree: false },
      ],
      notes: 'Regional express dispatch with priority slotting.',
    },
    {
      zoneName: 'Zone 3: Rest of India (Other States)',
      states: ['Maharashtra', 'Delhi', 'Gujarat', 'West Bengal', 'Rajasthan', 'Uttar Pradesh', 'All Other States / UTs'],
      tiers: [
        { rangeLabel: '1 – 10 products', rateDisplay: '₹140 flat', isFree: false },
        { rangeLabel: '11+ products', rateDisplay: '₹10 × total product quantity', isFree: false },
      ],
      notes: 'National air & express surface delivery with real-time tracking.',
    },
  ];

  // Calculate live shipping rate function based on exact business formula
  const calculateShipping = (state: string, qty: number) => {
    const q = Math.max(1, qty);
    if (state === 'Tamil Nadu' || state === 'Puducherry') {
      if (q <= 5) return { cost: 60, formula: 'Tier 1 (1–5 items) = ₹60' };
      return { cost: 0, formula: 'Tier 2 (6+ items) = FREE' };
    }

    if (['Kerala', 'Karnataka', 'Andhra Pradesh', 'Telangana'].includes(state)) {
      if (q <= 5) return { cost: 80, formula: 'Tier 1 (1–5 items) = ₹80' };
      if (q <= 10) return { cost: 0, formula: 'Tier 2 (6–10 items) = FREE' };
      return { cost: q * 10, formula: `Tier 3 (11+ items) = ${q} × ₹10 = ₹${q * 10}` };
    }

    // Rest of India
    if (q <= 10) return { cost: 140, formula: 'Tier 1 (1–10 items) = ₹140' };
    return { cost: q * 10, formula: `Tier 2 (11+ items) = ${q} × ₹10 = ₹${q * 10}` };
  };

  const currentCalc = calculateShipping(calcState, calcQty);

  const { data: serverSettings } = useSettingsQuery();
  const updateSettingsMutation = useUpdateSettingsMutation();
  const [dispatchTimeDays, setDispatchTimeDays] = React.useState('20');

  React.useEffect(() => {
    if (serverSettings?.dispatchTimeDays !== undefined) {
      setDispatchTimeDays(String(serverSettings.dispatchTimeDays));
    }
  }, [serverSettings]);

  const handleSave = async () => {
    setIsSaved(true);
    try {
      await updateSettingsMutation.mutateAsync({
        dispatchTimeDays: Math.max(1, parseInt(dispatchTimeDays, 10) || 20),
      });
    } catch (err) {
      console.error('Error saving dispatch settings:', err);
    }
    setTimeout(() => setIsSaved(false), 2500);
  };

  return (
    <AdminLayout>
      <PageHeader
        badge="Logistics & Fulfillment"
        title="State-Based Delivery Charge Engine"
        subtitle="Automated quantity-tiered delivery matrix by customer state, shipping simulator, and courier partner configuration."
        actions={
          <Button
            variant="primary"
            size="sm"
            onClick={handleSave}
            className="rounded-xl flex items-center gap-2 font-bold shadow-md shadow-blue-500/20"
          >
            {isSaved ? <Check className="w-4 h-4 text-emerald-400" /> : <Save className="w-4 h-4" />}
            {isSaved ? 'Rates Saved!' : 'Save Delivery Configuration'}
          </Button>
        }
      />

      {/* Minimum Dispatch Time Configuration Card */}
      <div className="p-6 rounded-2xl bg-white dark:bg-[#0B132B] border border-slate-200 dark:border-slate-800 shadow-sm my-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            <h3 className="font-bold text-base text-[#0F172A] dark:text-white">Minimum Dispatch Time (Days)</h3>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300 border border-blue-200">
              Live Global Setting
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-xl">
            Configure the mandatory order preparation and curing timeline before courier pickup. Default is 20 days. When updated, changes reflect immediately across the Website and Android App.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <Input
              type="number"
              min={1}
              value={dispatchTimeDays}
              onChange={(e) => setDispatchTimeDays(e.target.value)}
              className="w-24 text-center font-bold text-base"
              placeholder="20"
            />
            <span className="text-xs font-bold text-slate-600 dark:text-slate-300">Days</span>
          </div>
          <Button
            variant="primary"
            size="sm"
            onClick={handleSave}
            className="rounded-xl font-bold whitespace-nowrap"
          >
            {isSaved ? 'Saved ✓' : 'Save Days'}
          </Button>
        </div>
      </div>

      {/* Interactive Shipping Rate Simulator */}
      <div className="p-6 rounded-2xl bg-gradient-to-br from-blue-900 to-[#002754] text-white shadow-xl my-6">
        <div className="flex items-center gap-2.5 mb-4">
          <Calculator className="w-5 h-5 text-amber-400" />
          <h3 className="font-bold text-base tracking-wide">Live Delivery Charge Simulator (Backend Authority)</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 items-center">
          <div>
            <label className="text-[10px] font-black uppercase tracking-wider text-blue-200 block mb-1">
              Select Customer State
            </label>
            <select
              value={calcState}
              onChange={(e) => setCalcState(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-blue-950/80 border border-blue-400/30 text-white font-semibold text-xs focus:ring-2 focus:ring-amber-400 focus:outline-none"
            >
              <optgroup label="Zone 1 (Home Territory)">
                <option value="Tamil Nadu">Tamil Nadu</option>
                <option value="Puducherry">Puducherry</option>
              </optgroup>
              <optgroup label="Zone 2 (South Indian States)">
                <option value="Kerala">Kerala</option>
                <option value="Karnataka">Karnataka</option>
                <option value="Andhra Pradesh">Andhra Pradesh</option>
                <option value="Telangana">Telangana</option>
              </optgroup>
              <optgroup label="Zone 3 (Rest of India)">
                <option value="Maharashtra">Maharashtra</option>
                <option value="Delhi">Delhi</option>
                <option value="Gujarat">Gujarat</option>
                <option value="West Bengal">West Bengal</option>
                <option value="Other States">Other States / UTs</option>
              </optgroup>
            </select>
          </div>

          <div>
            <label className="text-[10px] font-black uppercase tracking-wider text-blue-200 block mb-1">
              Total Order Product Quantity
            </label>
            <div className="flex items-center gap-3">
              <input
                type="number"
                min="1"
                max="100"
                value={calcQty}
                onChange={(e) => setCalcQty(Math.max(1, Number(e.target.value)))}
                className="w-full px-4 py-2 rounded-xl bg-blue-950/80 border border-blue-400/30 text-white font-bold text-base focus:ring-2 focus:ring-amber-400 focus:outline-none"
              />
              <span className="text-xs font-bold text-blue-200">units</span>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 flex flex-col justify-center">
            <span className="text-[10px] font-black uppercase tracking-wider text-amber-300">
              Calculated Delivery Fee
            </span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-3xl font-black text-white">
                {currentCalc.cost === 0 ? 'FREE' : formatCurrency(currentCalc.cost)}
              </span>
              <span className="text-xs text-blue-200 font-semibold">({currentCalc.formula})</span>
            </div>
          </div>
        </div>
      </div>

      {/* State-Based Rate Matrix Cards */}
      <div className="space-y-6 my-6">
        <h3 className="text-base font-bold text-[#0F172A] dark:text-white flex items-center gap-2">
          <Layers className="w-5 h-5 text-blue-600" />
          State Delivery Pricing Matrix
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {deliveryZones.map((zone, idx) => (
            <div
              key={idx}
              className="p-6 rounded-2xl bg-white dark:bg-[#0B132B] border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between space-y-5"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between">
                  <h4 className="font-bold text-sm text-[#0F172A] dark:text-white leading-tight">{zone.zoneName}</h4>
                  <span className="w-6 h-6 rounded-full bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold text-xs">
                    {idx + 1}
                  </span>
                </div>

                <div className="flex flex-wrap gap-1.5 pt-1">
                  {zone.states.map((st, i) => (
                    <span
                      key={i}
                      className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300"
                    >
                      {st}
                    </span>
                  ))}
                </div>

                {/* Tier Rates */}
                <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                  {zone.tiers.map((tier, tIdx) => (
                    <div
                      key={tIdx}
                      className={`p-2.5 rounded-xl border flex items-center justify-between text-xs font-semibold ${
                        tier.isFree
                          ? 'bg-emerald-50/60 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300'
                          : 'bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      <span className="font-medium">{tier.rangeLabel}</span>
                      <span className={`font-black ${tier.isFree ? 'text-emerald-600 dark:text-emerald-400' : 'text-[#0F172A] dark:text-white'}`}>
                        {tier.rateDisplay}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-start gap-1.5 text-[11px] text-slate-400">
                <Info className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" />
                <span>{zone.notes}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Integrated Courier Delivery Partners */}
      <div className="p-6 rounded-2xl bg-white dark:bg-[#0B132B] border border-slate-200 dark:border-slate-800 shadow-sm space-y-4 my-6">
        <div className="flex items-center justify-between border-b pb-3 border-slate-100 dark:border-slate-800">
          <div>
            <h3 className="text-base font-bold text-[#0F172A] dark:text-white">Assigned Courier Partners</h3>
            <p className="text-xs text-slate-400">Automated tracking number generation and dispatch partners</p>
          </div>
          <Building className="w-5 h-5 text-blue-600" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { name: 'Blue Dart Express', type: 'Air Priority', status: 'Connected', leadTime: '1-2 Days' },
            { name: 'Delhivery Surface', type: 'Express Ground', status: 'Connected', leadTime: '2-4 Days' },
            { name: 'DTDC Courier', type: 'Standard Regional', status: 'Connected', leadTime: '2-3 Days' },
            { name: 'India Post SpeedPost', type: 'National Remote', status: 'Connected', leadTime: '3-5 Days' },
          ].map((partner, idx) => (
            <div
              key={idx}
              className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2"
            >
              <div className="flex items-center justify-between">
                <p className="font-bold text-xs text-[#0F172A] dark:text-white">{partner.name}</p>
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              </div>
              <p className="text-[10px] text-slate-400 font-medium">{partner.type} • {partner.leadTime}</p>
              <span className="inline-block px-2 py-0.5 rounded text-[9px] font-bold bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
                {partner.status}
              </span>
            </div>
          ))}
        </div>
      </div>
    </AdminLayout>
  );
}

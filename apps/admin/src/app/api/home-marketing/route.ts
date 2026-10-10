export const runtime = 'edge';

import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://nthyavlzdgucrldtgjeo.supabase.co';
const supabaseKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im50aHlhdmx6ZGd1Y3JsZHRnamVvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODU3NTU2MDAsImV4cCI6MjEwMTMzMTYwMH0.XzL0nuUOnksJLgsT9tGlsi4-adHtosCjV4fk9-MXClc';

const supabase = createClient(supabaseUrl, supabaseKey);

const DEFAULT_SETTINGS = {
  id: 'default',
  topOffers: [
    'Free Shipping above ₹499',
    'Buy 2 Get 1 Free',
    'New Launch: Charcoal Series',
    'Festive Combo Sale - 30% OFF',
  ],
  heroBanners: [
    {
      id: 'hb1',
      title: 'Monsoon Care Collection',
      subtitle: 'Flat 40% OFF on all Gift Hampers & Combo Packs',
      buttonText: 'Shop Collection',
      linkUrl: '/shop',
      imageUrl: 'https://images.unsplash.com/photo-1600857544200-b2f666a9a2ec?w=1200',
      badgeText: 'New Release',
      isActive: true,
    },
    {
      id: 'hb2',
      title: 'Artisan Cold-Processed Soaps',
      subtitle: 'Pure Neem, Aloe Vera & Sandalwood Formulations',
      buttonText: 'Explore Soaps',
      linkUrl: '/category/soaps',
      imageUrl: 'https://images.unsplash.com/photo-1600857544200-b2f666a9a2ec?w=1200',
      badgeText: 'Signature Series',
      isActive: true,
    },
  ],
  watchShopVideos: [
    {
      id: 'v1',
      slug: 'aloe-vera-soap',
      title: 'Aloe Vera Hydrating Soap Reel',
      productName: 'Aloe Vera Bar',
      productPrice: '₹199',
      productImage: 'https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?w=400',
      videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      isActive: true,
    },
  ],
  midBanner: {
    title: 'Monsoon Magic Sale — Flat 40% OFF',
    subtitle: 'On all Gift Hampers & Combo Packs',
    buttonText: 'Grab Now',
    linkUrl: '/shop',
    imageUrl: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=1200',
    isActive: true,
  },
  comboOffers: [
    {
      id: 'c1',
      slug: 'ultimate-spa-gift-pack',
      title: 'Ultimate Spa Gift Pack',
      subtitle: 'Includes 4 Premium Soaps + Loofah',
      price: '₹899',
      originalPrice: '₹1200',
      badge: 'Save 25%',
      bgColor: 'rgba(0, 39, 84, 0.08)',
      borderColor: 'rgba(0, 39, 84, 0.12)',
      badgeBg: '#002754',
      badgeTextColor: 'white',
      imageUrl: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=500&auto=format&fit=crop&q=80',
      isActive: true,
    },
    {
      id: 'c2',
      slug: 'family-essentials-bundle',
      title: 'Family Essentials Bundle',
      subtitle: 'Set of 10 Daily Use Soaps',
      price: '₹1499',
      originalPrice: '₹2000',
      badge: 'Save 30%',
      bgColor: 'rgba(70, 95, 138, 0.08)',
      borderColor: 'rgba(70, 95, 138, 0.12)',
      badgeBg: '#465F8A',
      badgeTextColor: 'white',
      imageUrl: 'https://images.unsplash.com/photo-1600857544200-b2f666a9a2ec?w=500&auto=format&fit=crop&q=80',
      isActive: true,
    },
  ],
  realResults: [
    {
      id: 'r1',
      beforeUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400',
      afterUrl: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=400',
      quote: 'My acne cleared up in 3 weeks!',
      userName: 'Ananya V. (Neem Soap User)',
      isActive: true,
    },
  ],
  trustBadges: [
    { id: 'tb1', label: '100% Natural', iconName: 'Leaf', isActive: true },
    { id: 'tb2', label: 'Dermatologist Tested', iconName: 'ShieldCheck', isActive: true },
    { id: 'tb3', label: 'Cruelty Free', iconName: 'Heart', isActive: true },
    { id: 'tb4', label: 'No Harmful Chemicals', iconName: 'CheckCircle', isActive: true },
  ],
  bottomBanner: {
    title: 'Crafted with Purity & Global Quality Standards',
    subtitle: 'Our manufacturing facility ensures every bar of soap meets strict quality benchmarks.',
    buttonText: 'Learn More',
    linkUrl: '/about',
    imageUrl: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=1200',
    isActive: true,
  },
  updatedAt: new Date().toISOString(),
};

function sanitizeSettings<T>(data: T): T {
  const jsonStr = JSON.stringify(data);
  const cleanedStr = jsonStr
    .replaceAll('photo-1607006314147-759088fd21c2', 'photo-1600857544200-b2f666a9a2ec')
    .replaceAll('photo-1607006482140-520e7df6504a', 'photo-1608248543803-ba4f8c70ae0b')
    .replaceAll('photo-1512290900676-26c2a48f4134', 'photo-1544005313-94ddf0286df2');
  return JSON.parse(cleanedStr);
}

export async function GET() {
  try {
    const { data, error } = await supabase
      .from('home_marketing_settings')
      .select('*')
      .eq('id', 'default')
      .maybeSingle();

    if (!error && data?.settings) {
      return NextResponse.json(sanitizeSettings({ ...DEFAULT_SETTINGS, ...data.settings, updatedAt: data.updated_at }));
    }
  } catch (e) {
    console.warn('Supabase DB fetch failed for home_marketing_settings:', e);
  }

  return NextResponse.json(sanitizeSettings(DEFAULT_SETTINGS));
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const updatedSettings = {
      ...body,
      updatedAt: new Date().toISOString(),
    };

    // Sync directly to Supabase PostgreSQL table
    const { error } = await supabase.from('home_marketing_settings').upsert({
      id: 'default',
      settings: updatedSettings,
      updated_at: updatedSettings.updatedAt,
    });

    if (error) {
      console.error('Supabase home_marketing_settings upsert error:', error);
    }

    return NextResponse.json({ success: true, data: updatedSettings });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

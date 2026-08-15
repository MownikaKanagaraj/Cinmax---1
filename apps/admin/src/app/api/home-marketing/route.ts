import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs';
import * as path from 'path';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://nthyavlzdgucrldtgjeo.supabase.co';
const supabaseKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im50aHlhdmx6ZGd1Y3JsZGtnamVvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzg1Njc2MDAsImV4cCI6MjA1NDE0MzYwMH0.123';

const supabase = createClient(supabaseUrl, supabaseKey);

// Local JSON File Backup path for seamless persistence
const LOCAL_STORAGE_PATH = path.join(process.cwd(), '.next', 'home_marketing_db.json');

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
      imageUrl: 'https://images.unsplash.com/photo-1607006314147-759088fd21c2?w=1200',
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
      productImage: 'https://images.unsplash.com/photo-1607006482140-520e7df6504a?w=400',
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
  realResults: [
    {
      id: 'r1',
      beforeUrl: 'https://images.unsplash.com/photo-1512290900676-26c2a48f4134?w=400',
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

function readLocalSettings() {
  try {
    if (fs.existsSync(LOCAL_STORAGE_PATH)) {
      const data = fs.readFileSync(LOCAL_STORAGE_PATH, 'utf-8');
      return JSON.parse(data);
    }
  } catch (err) {
    console.error('Error reading local home marketing DB:', err);
  }
  return DEFAULT_SETTINGS;
}

function writeLocalSettings(settings: any) {
  try {
    const dir = path.dirname(LOCAL_STORAGE_PATH);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(LOCAL_STORAGE_PATH, JSON.stringify(settings, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error writing local home marketing DB:', err);
  }
}

export async function GET() {
  try {
    // Attempt Supabase query first
    const { data, error } = await supabase
      .from('home_marketing_settings')
      .select('*')
      .eq('id', 'default')
      .single();

    if (!error && data?.settings) {
      return NextResponse.json({ ...DEFAULT_SETTINGS, ...data.settings, updatedAt: data.updated_at });
    }
  } catch (e) {
    console.warn('Supabase DB fetch failed, using local storage fallback:', e);
  }

  const localData = readLocalSettings();
  return NextResponse.json(localData);
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const updatedSettings = {
      ...body,
      updatedAt: new Date().toISOString(),
    };

    // Save to local disk cache instantly
    writeLocalSettings(updatedSettings);

    // Sync to Supabase PostgreSQL database
    try {
      await supabase.from('home_marketing_settings').upsert({
        id: 'default',
        settings: updatedSettings,
        updated_at: updatedSettings.updatedAt,
      });
    } catch (dbErr) {
      console.warn('Could not sync to Supabase table home_marketing_settings:', dbErr);
    }

    return NextResponse.json({ success: true, data: updatedSettings });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

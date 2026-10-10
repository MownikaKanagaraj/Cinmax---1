const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = 'https://nthyavlzdgucrldtgjeo.supabase.co';
const SERVICE_ROLE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im50aHlhdmx6ZGd1Y3JsZHRnamVvIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4NTc1NTYwMCwiZXhwIjoyMTAxMzMxNjAwfQ.WhVVQo2bsvvo3NN8isPSbaQNUPef8MloYdjG3B_LaU0';

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY);

const CINMAX_11_SOAPS = [
  {
    slug: 'aroma-soap',
    title: 'Aroma Soap',
    badgeText: '100% Pure Coconut Oil',
    subtitle: 'Handcrafted aroma soap for gentle cleansing & refreshing everyday bath.',
    buttonText: 'Shop Aroma Soap • ₹249',
    imageUrl: 'https://nthyavlzdgucrldtgjeo.supabase.co/storage/v1/object/public/products/cinmax-products/aroma-soap/1.jpg',
  },
  {
    slug: 'aloe-vera-soap',
    title: 'Aloe Vera Soap',
    badgeText: 'Pure Aloe Vera Infusion',
    subtitle: 'Deeply hydrating, soothing and refreshing for silky-soft skin.',
    buttonText: 'Shop Aloe Vera • ₹249',
    imageUrl: 'https://nthyavlzdgucrldtgjeo.supabase.co/storage/v1/object/public/products/cinmax-products/aloe-vera-soap/1.jpg',
  },
  {
    slug: 'avarampoo-soap',
    title: 'Avarampoo Soap',
    badgeText: 'Golden Flower Radiance',
    subtitle: 'Tanner’s Cassia Golden Flower Blend for Natural Tan Removal & Glowing Skin.',
    buttonText: 'Shop Avarampoo • ₹289',
    imageUrl: 'https://nthyavlzdgucrldtgjeo.supabase.co/storage/v1/object/public/products/cinmax-products/avarampoo-soap/1.jpg',
  },
  {
    slug: 'charcoal-soap',
    title: 'Activated Charcoal Soap',
    badgeText: 'Deep Pore Detox',
    subtitle: 'Bamboo Activated Charcoal & Tea Tree Oil for Deep Pore Cleansing.',
    buttonText: 'Shop Charcoal • ₹279',
    imageUrl: 'https://nthyavlzdgucrldtgjeo.supabase.co/storage/v1/object/public/products/cinmax-products/charcoal-soap/1.jpg',
  },
  {
    slug: 'kasturi-manjal-soap',
    title: 'Kasturi Manjal Soap',
    badgeText: 'Wild Turmeric Glow',
    subtitle: 'Pure Wild Turmeric & Virgin Coconut Oil for Radiant, Blemish-Free Skin.',
    buttonText: 'Shop Kasturi Manjal • ₹299',
    imageUrl: 'https://nthyavlzdgucrldtgjeo.supabase.co/storage/v1/object/public/products/cinmax-products/kasturi-manjal-soap/1.jpg',
  },
  {
    slug: 'manjistha-soap',
    title: 'Manjistha Soap',
    badgeText: 'Ayurvedic Complexion',
    subtitle: 'Rubia Cordifolia root extracts to reduce hyperpigmentation and restore natural glow.',
    buttonText: 'Shop Manjistha • ₹299',
    imageUrl: 'https://nthyavlzdgucrldtgjeo.supabase.co/storage/v1/object/public/products/cinmax-products/manjistha-soap/1.jpg',
  },
  {
    slug: 'neem-oil-soap',
    title: 'Neem Oil Soap',
    badgeText: 'Antibacterial Care',
    subtitle: 'Pure Cold-Pressed Neem Seed Oil for clear, healthy, blemish-free skin.',
    buttonText: 'Shop Neem Oil • ₹249',
    imageUrl: 'https://nthyavlzdgucrldtgjeo.supabase.co/storage/v1/object/public/products/cinmax-products/neem-oil-soap/1.jpg',
  },
  {
    slug: 'papaya-soap',
    title: 'Papaya Glow Soap',
    badgeText: 'Enzymatic Glow',
    subtitle: 'Natural Skin Brightening & Gentle Exfoliation with Pure Papain Extract.',
    buttonText: 'Shop Papaya Soap • ₹279',
    imageUrl: 'https://nthyavlzdgucrldtgjeo.supabase.co/storage/v1/object/public/products/cinmax-products/papaya-soap/1.jpg',
  },
  {
    slug: 'rose-soap',
    title: 'Damask Rose Soap',
    badgeText: 'Pure Rose Water',
    subtitle: 'Steam-Distilled Pure Rose Water with Nourishing Shea Butter.',
    buttonText: 'Shop Rose Soap • ₹299',
    imageUrl: 'https://nthyavlzdgucrldtgjeo.supabase.co/storage/v1/object/public/products/cinmax-products/rose-soap/1.jpg',
  },
  {
    slug: 'veppalai-soap',
    title: 'Veppalai Ayurvedic Soap',
    badgeText: 'Therapeutic Healing',
    subtitle: 'Wrightia Tinctoria Leaf Extract for Scalp Health & Sensitive Skin Care.',
    buttonText: 'Shop Veppalai • ₹299',
    imageUrl: 'https://nthyavlzdgucrldtgjeo.supabase.co/storage/v1/object/public/products/cinmax-products/veppalai-soap/1.jpg',
  },
  {
    slug: 'vettiver-soap',
    title: 'Vettiver Root Clarifying Soap',
    badgeText: 'Cooling Vetiver Root',
    subtitle: 'Authentic Vetiver Root Infusion for All-Day Freshness & Body Cooling.',
    buttonText: 'Shop Vettiver • ₹289',
    imageUrl: 'https://nthyavlzdgucrldtgjeo.supabase.co/storage/v1/object/public/products/cinmax-products/vettiver-soap/1.jpg',
  },
];

async function updateMarketing() {
  const heroBanners = CINMAX_11_SOAPS.map((soap, idx) => ({
    id: `hb_${soap.slug}`,
    title: soap.title,
    subtitle: soap.subtitle,
    badgeText: soap.badgeText,
    buttonText: soap.buttonText,
    linkUrl: `/product/${soap.slug}`,
    imageUrl: soap.imageUrl,
    isActive: true,
  }));

  const updatedSettings = {
    topOffers: [
      { id: 'off_1', code: '', text: 'Free Shipping above ₹499', linkUrl: '/shop', isActive: true, offerType: 'free_shipping', minSubtotal: 499 },
      { id: 'off_2', code: '', text: '100% Pure Handcrafted Botanical Soaps', linkUrl: '/shop', isActive: true, offerType: 'link' },
      { id: 'off_3', code: 'CINMAX20', text: 'Flat 20% OFF on Orders over ₹1000', linkUrl: '/shop', isActive: true, offerType: 'coupon_code' },
    ],
    heroBanners: heroBanners,
    midBanner: {
      title: 'Monsoon Magic Sale',
      subtitle: 'On all Pure Cold-Processed Botanical Soap Hampers',
      badgeText: 'LIMITED PERIOD OFFER',
      buttonText: 'Shop Now',
      linkUrl: '/shop',
      imageUrl: 'https://nthyavlzdgucrldtgjeo.supabase.co/storage/v1/object/public/products/cinmax-products/rose-soap/1.jpg',
    },
    bottomBanner: {
      title: 'Crafted with Purity & Care',
      subtitle: 'Our authentic artisanal facility ensures every bar meets the highest standards of purity.',
      buttonText: 'Explore Collection',
      linkUrl: '/shop',
      imageUrl: 'https://nthyavlzdgucrldtgjeo.supabase.co/storage/v1/object/public/products/cinmax-products/aloe-vera-soap/1.jpg',
      isActive: true,
    },
    updatedAt: new Date().toISOString(),
  };

  const { error: hmsErr } = await supabase
    .from('home_marketing_settings')
    .upsert({ id: 'default', settings: updatedSettings, updated_at: new Date().toISOString() });

  if (hmsErr) {
    console.error('Error updating home_marketing_settings:', hmsErr);
  } else {
    console.log('✓ Successfully updated home_marketing_settings with all 11 CINMAX real soaps!');
  }

  // Also update banners table
  await supabase.from('banners').delete().neq('id', '00000000-0000-0000-0000-000000000000');
  
  const bannersToInsert = CINMAX_11_SOAPS.map((soap, idx) => ({
    title: soap.title,
    subtitle: soap.subtitle,
    cta_text: soap.buttonText,
    cta_link: `/product/${soap.slug}`,
    image_url: soap.imageUrl,
    badge_text: soap.badgeText,
    background_color: '#002754',
    is_active: true,
    sort_order: idx + 1,
  }));

  const { error: bErr } = await supabase.from('banners').insert(bannersToInsert);
  if (bErr) {
    console.error('Error inserting into banners table:', bErr);
  } else {
    console.log('✓ Successfully updated banners table with all 11 CINMAX real soaps!');
  }
}

updateMarketing().catch(console.error);

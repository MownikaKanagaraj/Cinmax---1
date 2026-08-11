export const PRODUCT_CATEGORIES = [
  {
    slug: 'artisan-cold-process-soaps',
    name: 'Artisan Cold-Process Soaps',
    description: 'Slow-cured for 6 weeks with cold-pressed virgin olive oil and unrefined shea butter.',
  },
  {
    slug: 'botanical-body-washes',
    name: 'Botanical Body Washes',
    description: 'Sulfate-free foaming washes infused with pure essential oils and plant hydrosols.',
  },
  {
    slug: 'exfoliating-bars',
    name: 'Exfoliating Mineral Bars',
    description: 'Fine volcanic pumice, French green clay, and Himalayan pink salt body polishers.',
  },
  {
    slug: 'organic-body-balms',
    name: 'Organic Body Balms & Lotions',
    description: 'Deeply nourishing botanical moisture balms with squalane and jojoba.',
  },
  {
    slug: 'luxury-gift-sets',
    name: 'Curated Luxury Gift Sets',
    description: 'Bespoke wooden gift boxes with signature soaps, ceramic dishes, and natural loofahs.',
  },
] as const;

export const SKIN_TYPES_CONFIG = [
  { value: 'all', label: 'All Skin Types', description: 'Gentle, balanced nourishment' },
  { value: 'dry', label: 'Dry / Dehydrated', description: 'Rich in shea butter and botanical oils' },
  { value: 'sensitive', label: 'Sensitive Skin', description: 'Fragrance-free, colloidal oat & aloe' },
  { value: 'oily', label: 'Oily / Blemish-Prone', description: 'Activated charcoal and tea tree' },
  { value: 'combination', label: 'Combination', description: 'Balancing French clay & chamomile' },
  { value: 'mature', label: 'Mature', description: 'Antioxidant-rich rosehip & neroli' },
] as const;

export const CERTIFICATIONS_CONFIG = [
  { value: '100-vegan', label: '100% Vegan', icon: 'Leaf' },
  { value: 'cruelty-free', label: 'Cruelty-Free (Leaping Bunny)', icon: 'Heart' },
  { value: 'usda-organic', label: 'USDA Certified Organic Ingredients', icon: 'Award' },
  { value: 'sulfate-free', label: 'Zero Sulfates or Parabens', icon: 'ShieldCheck' },
  { value: 'palm-oil-free', label: '100% Palm Oil Free', icon: 'Sparkles' },
  { value: 'fair-trade', label: 'Fair Trade Sourced', icon: 'Globe' },
  { value: 'biodegradable', label: 'Eco-Friendly & Biodegradable', icon: 'Recycle' },
] as const;

export const FRAGRANCE_FAMILIES = [
  { value: 'unscented', label: 'Pure & Unscented', notes: 'Hypoallergenic, natural oat essence' },
  { value: 'citrus', label: 'Sun-Drenched Citrus', notes: 'Bergamot, blood orange, lemongrass' },
  { value: 'woody', label: 'Forest & Cedar', notes: 'Sandalwood, Virginia cedar, vetiver' },
  { value: 'floral', label: 'Botanical Floral', notes: 'French lavender, Damascus rose, jasmine' },
  { value: 'herbal', label: 'Alpine Herbal', notes: 'Eucalyptus, rosemary, peppermint' },
  { value: 'aquatic', label: 'Azure Sea Salt', notes: 'Marine kelp, sea salt, driftwood' },
] as const;

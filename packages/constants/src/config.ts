/**
 * Global Brand & Business Configuration Constants
 */

export const BRAND_CONFIG = {
  name: 'CINMAX Global Products',
  tagline: 'Artisanal Personal Care & Pure Botanical Living',
  legalName: 'CINMAX Global Products LLC',
  supportEmail: 'care@cinmaxglobal.com',
  social: {
    instagram: 'https://instagram.com/cinmaxglobal',
    pinterest: 'https://pinterest.com/cinmaxglobal',
    facebook: 'https://facebook.com/cinmaxglobal',
  },
  defaultCurrency: 'USD',
  supportedCurrencies: ['USD', 'EUR', 'GBP', 'CAD', 'AUD'],
  freeShippingThresholdUSD: 50.0,
  standardShippingRateUSD: 6.95,
  defaultTaxRate: 0.08, // 8% average
  soapCuringPeriodWeeks: 6,
  itemsPerPage: 12,
} as const;

/**
 * CINMAX Global Products - Design System Tokens ("Azure Luxe")
 * Derived from DESIGN.md brand specification for luxury personal care & soap e-commerce.
 */

export const colors = {
  // Surface Hierarchy
  surface: {
    DEFAULT: '#F7F9FB',
    dim: '#D8DADC',
    bright: '#F7F9FB',
    lowest: '#FFFFFF',
    low: '#F2F4F6',
    container: '#ECEEF0',
    high: '#E6E8EA',
    highest: '#E0E3E5',
    variant: '#E0E3E5',
  },
  onSurface: {
    DEFAULT: '#191C1E',
    variant: '#434750',
  },
  inverseSurface: {
    DEFAULT: '#2D3133',
    on: '#EFF1F3',
  },

  // Primary Palette (Signature Navy & Blue)
  primary: {
    DEFAULT: '#002754',
    on: '#FFFFFF',
    container: '#0A3D78',
    onContainer: '#84AAEB',
    inverse: '#A9C7FF',
    fixed: '#D6E3FF',
    fixedDim: '#A9C7FF',
    onFixed: '#001B3D',
    onFixedVariant: '#194682',
    // Gradient accent
    gradientStart: '#0A3D78',
    gradientEnd: '#1E5AAD',
  },

  // Secondary Palette (Subtle Blue Slate)
  secondary: {
    DEFAULT: '#465F8A',
    on: '#FFFFFF',
    container: '#B4CDFE',
    onContainer: '#3E5681',
    fixed: '#D6E3FF',
    fixedDim: '#AEC7F8',
    onFixed: '#001B3E',
    onFixedVariant: '#2E4770',
  },

  // Tertiary Palette (Charcoal Noir)
  tertiary: {
    DEFAULT: '#1F2834',
    on: '#FFFFFF',
    container: '#353E4B',
    onContainer: '#A0A9B8',
    fixed: '#DAE3F4',
    fixedDim: '#BEC7D7',
    onFixed: '#131C28',
    onFixedVariant: '#3E4755',
  },

  // State & Semantic
  error: {
    DEFAULT: '#BA1A1A',
    on: '#FFFFFF',
    container: '#FFDAD6',
    onContainer: '#93000A',
  },
  success: {
    DEFAULT: '#1B873F',
    on: '#FFFFFF',
    container: '#D1F4DB',
    onContainer: '#0B4D22',
  },

  // Outlines & Borders
  outline: {
    DEFAULT: '#737781',
    variant: '#C3C6D1',
    subtle: '#E2E8F0',
  },

  // Canvas
  background: '#F7F9FB',
  onBackground: '#191C1E',
  surfaceTint: '#365E9B',

  // Soap Tag Accents
  tag: {
    organic: '#EBF3FF',
    organicText: '#0A3D78',
    vegan: '#EDFAF0',
    veganText: '#186832',
    scent: '#F8EEFC',
    scentText: '#6A2A82',
  },
} as const;

export const typography = {
  fontFamily: {
    headline: ['Noto Serif', 'serif'],
    display: ['Noto Serif', 'serif'],
    body: ['Plus Jakarta Sans', 'sans-serif'],
    sans: ['Plus Jakarta Sans', 'sans-serif'],
  },
  fontSize: {
    'display-lg': ['56px', { lineHeight: '64px', letterSpacing: '-0.02em', fontWeight: '600' }],
    'headline-lg': ['32px', { lineHeight: '40px', fontWeight: '600' }],
    'headline-lg-mobile': ['28px', { lineHeight: '36px', fontWeight: '600' }],
    'headline-md': ['24px', { lineHeight: '32px', fontWeight: '500' }],
    'body-lg': ['18px', { lineHeight: '28px', fontWeight: '400' }],
    'body-md': ['16px', { lineHeight: '24px', fontWeight: '400' }],
    'label-lg': ['14px', { lineHeight: '20px', letterSpacing: '0.05em', fontWeight: '600' }],
    'label-sm': ['12px', { lineHeight: '16px', fontWeight: '500' }],
  },
} as const;

export const borderRadius = {
  sm: '0.25rem', // 4px
  DEFAULT: '0.5rem', // 8px
  md: '0.75rem', // 12px (Inputs)
  lg: '1rem', // 16px
  xl: '1.25rem', // 20px (Containers & Cards)
  '2xl': '1.5rem', // 24px
  full: '9999px', // Pill (Signature Buttons & Badges)
} as const;

export const shadows = {
  // Ambient diffused shadows for high-end luxury feel
  ambient: '0px 10px 30px rgba(10, 61, 120, 0.04)',
  'ambient-hover': '0px 18px 40px rgba(10, 61, 120, 0.08)',
  'ambient-lg': '0px 24px 60px rgba(10, 61, 120, 0.12)',
  glow: '0 0 20px rgba(10, 61, 120, 0.25)',
  innerGlow: 'inset 0 1px 1px rgba(255, 255, 255, 0.3)',
} as const;

export const spacing = {
  base: '8px',
  gutter: '24px',
  containerPaddingMobile: '20px',
  containerPaddingDesktop: '64px',
  sectionGapLg: '120px',
  sectionGapSm: '64px',
} as const;

export const brandTokens = {
  colors,
  typography,
  borderRadius,
  shadows,
  spacing,
};

export type BrandTokens = typeof brandTokens;

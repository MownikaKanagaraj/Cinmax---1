import type { Config } from 'tailwindcss';
import { colors, borderRadius, shadows, spacing } from './tokens';

/**
 * Tailwind CSS Preset for CINMAX Global Products
 * Applies Azure Luxe design tokens and custom utilities.
 */
export const cinmaxTailwindPreset = {
  darkMode: ['class'],
  theme: {
    extend: {
      colors: {
        // Direct Azure Luxe tokens
        'cinmax-navy': '#002754',
        'cinmax-blue': '#0A3D78',
        'cinmax-blue-light': '#1E5AAD',
        'cinmax-surface': '#F7F9FB',
        'cinmax-surface-card': '#FFFFFF',
        'cinmax-text-primary': '#191C1E',
        'cinmax-text-secondary': '#434750',
        'cinmax-border': '#E2E8F0',

        // Token bindings
        surface: colors.surface,
        'on-surface': colors.onSurface,
        'inverse-surface': colors.inverseSurface,
        primary: colors.primary,
        secondary: colors.secondary,
        tertiary: colors.tertiary,
        error: colors.error,
        success: colors.success,
        outline: colors.outline,
        tag: colors.tag,

        // shadcn/ui compatible semantic HSL variables
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
      },
      fontFamily: {
        headline: ['Noto Serif', 'serif'],
        display: ['Noto Serif', 'serif'],
        body: ['Plus Jakarta Sans', 'sans-serif'],
        sans: ['Plus Jakarta Sans', 'sans-serif'],
      },
      borderRadius: {
        sm: borderRadius.sm,
        DEFAULT: borderRadius.DEFAULT,
        md: borderRadius.md,
        lg: borderRadius.lg,
        xl: borderRadius.xl,
        '2xl': borderRadius['2xl'],
        full: borderRadius.full,
      },
      boxShadow: {
        ambient: shadows.ambient,
        'ambient-hover': shadows['ambient-hover'],
        'ambient-lg': shadows['ambient-lg'],
        glow: shadows.glow,
        'inner-glow': shadows.innerGlow,
      },
      spacing: {
        gutter: spacing.gutter,
        'container-mobile': spacing.containerPaddingMobile,
        'container-desktop': spacing.containerPaddingDesktop,
        'section-lg': spacing.sectionGapLg,
        'section-sm': spacing.sectionGapSm,
      },
      backgroundImage: {
        'primary-gradient': 'linear-gradient(135deg, #0A3D78 0%, #1E5AAD 100%)',
        'primary-gradient-hover': 'linear-gradient(135deg, #002754 0%, #0A3D78 100%)',
        'glass-gradient': 'linear-gradient(180deg, rgba(255, 255, 255, 0.8) 0%, rgba(255, 255, 255, 0.4) 100%)',
      },
      backdropBlur: {
        glass: '20px',
      },
      keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' },
        },
        'float-slow': {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-6px)' },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
        'float': 'float-slow 4s ease-in-out infinite',
      },
    },
  },
  plugins: [],
} satisfies Partial<Config>;

export default cinmaxTailwindPreset;

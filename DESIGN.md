---
name: Azure Luxe
colors:
  surface: '#f7f9fb'
  surface-dim: '#d8dadc'
  surface-bright: '#f7f9fb'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f2f4f6'
  surface-container: '#eceef0'
  surface-container-high: '#e6e8ea'
  surface-container-highest: '#e0e3e5'
  on-surface: '#191c1e'
  on-surface-variant: '#434750'
  inverse-surface: '#2d3133'
  inverse-on-surface: '#eff1f3'
  outline: '#737781'
  outline-variant: '#c3c6d1'
  surface-tint: '#365e9b'
  primary: '#002754'
  on-primary: '#ffffff'
  primary-container: '#0a3d78'
  on-primary-container: '#84aaeb'
  inverse-primary: '#a9c7ff'
  secondary: '#465f8a'
  on-secondary: '#ffffff'
  secondary-container: '#b4cdfe'
  on-secondary-container: '#3e5681'
  tertiary: '#1f2834'
  on-tertiary: '#ffffff'
  tertiary-container: '#353e4b'
  on-tertiary-container: '#a0a9b8'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#d6e3ff'
  primary-fixed-dim: '#a9c7ff'
  on-primary-fixed: '#001b3d'
  on-primary-fixed-variant: '#194682'
  secondary-fixed: '#d6e3ff'
  secondary-fixed-dim: '#aec7f8'
  on-secondary-fixed: '#001b3e'
  on-secondary-fixed-variant: '#2e4770'
  tertiary-fixed: '#dae3f4'
  tertiary-fixed-dim: '#bec7d7'
  on-tertiary-fixed: '#131c28'
  on-tertiary-fixed-variant: '#3e4755'
  background: '#f7f9fb'
  on-background: '#191c1e'
  surface-variant: '#e0e3e5'
typography:
  display-lg:
    fontFamily: Noto Serif
    fontSize: 56px
    fontWeight: '600'
    lineHeight: 64px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Noto Serif
    fontSize: 32px
    fontWeight: '600'
    lineHeight: 40px
  headline-lg-mobile:
    fontFamily: Noto Serif
    fontSize: 28px
    fontWeight: '600'
    lineHeight: 36px
  headline-md:
    fontFamily: Noto Serif
    fontSize: 24px
    fontWeight: '500'
    lineHeight: 32px
  body-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  label-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 14px
    fontWeight: '600'
    lineHeight: 20px
    letterSpacing: 0.05em
  label-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 16px
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  base: 8px
  container-padding-mobile: 20px
  container-padding-desktop: 64px
  gutter: 24px
  section-gap-lg: 120px
  section-gap-sm: 64px
---

## Brand & Style
The design system embodies a premium personal care aesthetic that merges the structured reliability of Material Design 3 with the ethereal luxury of high-end skincare brands. The visual narrative is built on the concept of "Luminous Clarity"—using expansive white space, precise geometry, and subtle depth to evoke a sense of cleanliness, freshness, and scientific trust.

The style is **Modern Minimalist with Tactile Luxury**. It prioritizes a high-contrast relationship between deep corporate navies and pristine white surfaces. Elements are defined by soft, generous curves and sophisticated motion, creating an interface that feels both technologically advanced and human-centric.

## Colors
The palette is anchored in a monochromatic blue spectrum to establish unwavering authority and calm. 

- **Primary Blue (#0A3D78):** Used for key actions, active states, and primary brand moments.
- **Dark Navy (#08274F):** Reserved for high-contrast typography and deep immersive backgrounds.
- **Accent Gray (#5B6472):** Utilized for secondary information and iconography to maintain a soft visual hierarchy.
- **Surface & Background:** A combination of pure white (#FFFFFF) for interactive containers and a Soft Background (#F8FAFC) to provide a gentle tonal shift between sections.
- **Gradients:** Primary buttons and hero accents utilize a linear gradient from #0A3D78 to #1E5AAD at a 135-degree angle to simulate light reflecting off premium packaging.

## Typography
The typography strategy creates a tension between traditional luxury and modern efficiency. 

**Noto Serif** is used for all headlines and display text. Its refined serifs provide a literary, authoritative tone synonymous with high-end personal care. 

**Plus Jakarta Sans** is used for body text and labels. Its soft, rounded terminals and open counters mirror the approachable, "fresh" personality of the brand while ensuring maximum readability across digital interfaces. 

Always use generous line heights to maintain the "airy" feel of the brand. Display styles should use a slight negative letter-spacing to appear more editorial and tight.

## Layout & Spacing
The layout follows a **Fluid Grid** model with strict adherence to "Breathable Margins." 

- **Desktop:** 12-column grid with 64px side margins and 24px gutters.
- **Mobile:** 4-column grid with 20px side margins.
- **Spacing Logic:** Vertical rhythm is built on increments of 8px. However, to achieve the "Luxury" feel, section spacing should be aggressive (120px+ on desktop) to allow the product photography and typography to stand alone without clutter.
- **Alignment:** Content should be primarily center-aligned for marketing pages to evoke an editorial feel, while functional dashboards use a left-aligned systematic approach.

## Elevation & Depth
Depth is communicated through **Ambient Shadows** and **Tonal Layering**, avoiding harsh lines.

- **Surface Tiers:** Primary content sits on Level 0 (Background). Level 1 (Cards/Modals) uses a pure white surface with a very soft, diffused shadow: `0px 10px 30px rgba(10, 61, 120, 0.04)`.
- **Interactions:** Upon hover, elements should slightly lift, increasing the shadow spread and reducing opacity to simulate a physical "float."
- **Glassmorphism:** Use sparingly for navigation bars or floating action buttons. Use a 20px backdrop-blur with a 70% opaque white fill and a 1px solid white border at 20% opacity.

## Shapes
The shape language is defined by **High-Radius Geometry**. 

- **Containers & Cards:** Use a standard 20px corner radius to mirror the soft edges of premium cosmetic packaging.
- **Buttons:** Utilize a fully rounded (pill-shaped) radius for a friendly, ergonomic feel that invites interaction.
- **Inputs:** A 12px radius provides a slightly more structured look while maintaining harmony with the overall system.
- **Accents:** Use thin, 1px "Soft Blue" (#E2E8F0) borders for containers that require definition without the weight of a shadow.

## Components

- **Buttons:** The "Signature Button" uses a primary blue gradient. Text is white, medium weight, and center-aligned. High-priority buttons use a subtle inner-glow at the top edge to create a 3D tactile effect.
- **Input Fields:** Use a "Floating Label" style (Material Design 3 influence). The default state is a Soft Background fill with no border; the active state transitions to a white fill with a 2px Primary Blue bottom border.
- **Cards:** Product cards should have zero border, relying on the Level 1 Ambient Shadow. The image should be the focal point, slightly bleeding into the card padding.
- **Chips/Tags:** Used for product categories (e.g., "Organic", "New"). These are small, pill-shaped elements with a light blue tint (#EBF3FF) and Primary Blue text.
- **Lists:** Use generous 24px vertical padding between items with a subtle 1px divider that fades out at the edges.
- **Checkboxes & Radios:** When selected, these should use the Primary Blue gradient fill with a crisp white checkmark or dot for high visibility.
- **Additional Component - Image Carousel:** Product galleries should use high-resolution photography with a "Ken Burns" subtle zoom effect on transition to reinforce the luxurious, high-end feel.
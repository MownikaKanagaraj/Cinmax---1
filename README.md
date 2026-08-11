# CINMAX Global Products — Monorepo Architecture

> Production-grade, multi-platform e-commerce and personal care monorepo architecture powering **CINMAX Global Products**.

---

## 🏛️ Architecture Overview

This monorepo utilizes **Turborepo** and **pnpm workspaces** to coordinate shared packages, web storefronts, admin dashboards, and native mobile applications with strict type-safety and isolated modularity.

```
cinmax-monorepo/
├── apps/
│   ├── website/        # Next.js 15 App Router Customer Storefront (Cloudflare Pages)
│   ├── admin/          # Next.js 15 App Router Operations & Inventory Dashboard (Cloudflare Pages)
│   └── mobile/         # React Native Expo SDK 52+ Cross-Platform iOS & Android App (NativeWind)
│
├── packages/
│   ├── theme/          # "Azure Luxe" Design System (Tokens, Tailwind Presets, CSS Variables)
│   ├── types/          # Domain Types, Supabase DB Types, Cart & Order Models
│   ├── constants/      # Brand Config, Route Trees, Storage Keys, Enums
│   ├── utils/          # Formatting, Math, Zod Validation Schemas, Slug/SKU Generics
│   ├── api/            # Supabase Browser, Server (SSR), and Mobile (SecureStore) Adapters & Services
│   ├── hooks/          # Universal React Hooks (useCart, useAuth, useDebounce, useMediaQuery)
│   ├── ui/             # shadcn-compatible Luxury Component Library (Button, Card, Input, etc.)
│   ├── tsconfig/       # Base TypeScript Config Presets (Base, Next.js, React-Native, Node)
│   └── eslint-config/  # Unified ESLint Config Presets
│
├── supabase/
│   ├── migrations/     # PostgreSQL Schema, Foreign Keys, RLS Security Policies
│   ├── seed.sql        # Botanical Product Catalog & Realistic Seed Data
│   └── config.toml     # Supabase Local CLI Configuration
│
└── .github/workflows/  # CI/CD Workflows (Lint, Typecheck, Build, Cloudflare Pages Deploy)
```

---

## 🎨 Design System: "Azure Luxe"

CINMAX features a clean, mineral-inspired luxury aesthetic:
- **Primary Deep Luxury Blue**: `#002754` / `#0A3D78`
- **Surface Mineral Gray**: `#F7F9FB` / `#ECEEF0`
- **Typography**: `Noto Serif` (Headlines / Hero / Editorial) & `Plus Jakarta Sans` (Body / UI / Meta)
- **Geometry**: Signature pill curvature (`rounded-full`) and 20px radius cards (`rounded-[20px]`)
- **Lighting**: Soft ambient depth shadows (`0 8px 32px -4px rgba(10, 61, 120, 0.06)`)

---

## 🚀 Quick Start

### Prerequisites
- **Node.js**: `v20.x` or higher
- **pnpm**: `v9.x` (`npm install -g pnpm`)
- **Supabase CLI**: (Optional for local migrations: `brew install supabase/tap/supabase` or `npm install -g supabase`)

### Installation
```bash
# Clone the repository
git clone <repo-url> cinmax-monorepo
cd cinmax-monorepo

# Install dependencies across all workspaces
pnpm install
```

### Environment Configuration
Copy `.env.example` in root or corresponding application directories:
```bash
cp .env.example .env
cp apps/website/.env.example apps/website/.env.local
cp apps/admin/.env.example apps/admin/.env.local
cp apps/mobile/.env.example apps/mobile/.env
```

---

## 💻 Development Commands

| Command | Description |
| :--- | :--- |
| `pnpm dev` | Run all applications (`website`, `admin`, `mobile`) concurrently |
| `pnpm dev:website` | Run only Next.js Customer Storefront (`http://localhost:3000`) |
| `pnpm dev:admin` | Run only Next.js Admin Dashboard (`http://localhost:3001`) |
| `pnpm dev:mobile` | Run Expo dev server for iOS, Android, and Web |
| `pnpm build` | Build all packages and applications via Turborepo |
| `pnpm lint` | Run ESLint across entire workspace |
| `pnpm check-types` | Run TypeScript compiler typechecks across all packages & apps |
| `pnpm format` | Format repository files using Prettier |

---

## 🗄️ Database & Supabase Workflow

### Local Development
```bash
# Start local Supabase instance (PostgreSQL, Auth, Studio)
supabase start

# Apply migrations
supabase db reset
```

### Type Generation
```bash
# Generate types directly into packages/types
supabase gen types typescript --local > packages/types/src/database.types.ts
```

---

## ☁️ Deployment

### Website & Admin Dashboard
Both `apps/website` and `apps/admin` are configured for zero-cold-start edge delivery on **Cloudflare Pages** using `@cloudflare/next-on-pages` and `wrangler`:
```bash
# Deploy website
pnpm --filter @cinmax/website pages:build
pnpm --filter @cinmax/website wrangler pages deploy .next --project-name=cinmax-website

# Deploy admin
pnpm --filter @cinmax/admin pages:build
pnpm --filter @cinmax/admin wrangler pages deploy .next --project-name=cinmax-admin
```

### Mobile Application
The mobile application in `apps/mobile` is built on Expo Application Services (EAS):
```bash
cd apps/mobile
pnpm eas build --platform all
```

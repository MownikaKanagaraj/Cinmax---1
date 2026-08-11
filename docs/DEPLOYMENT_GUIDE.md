# CINMAX Monorepo Production Deployment & Operations Guide

## 1. Environment Configuration & Secret Management

Ensure all production environment variables are configured in your deployment platform (Cloudflare Pages / Vercel / Railway):

```env
NODE_ENV=production
NEXT_PUBLIC_SUPABASE_URL=https://<your-project-id>.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<your-supabase-anon-key>
SUPABASE_SERVICE_ROLE_KEY=<your-supabase-service-role-key>
DATABASE_URL=postgresql://postgres:<password>@db.<your-project-id>.supabase.co:5432/postgres

NEXT_PUBLIC_APP_URL=https://cinmaxglobal.com
NEXT_PUBLIC_ADMIN_URL=https://admin.cinmaxglobal.com

NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_live_<key_id>
RAZORPAY_KEY_SECRET=<secret_key>
SHIPROCKET_API_TOKEN=<shiprocket_token>
RESEND_API_KEY=re_<resend_key>
```

---

## 2. Database Migration Pipeline

Execute database migrations sequentially on your Supabase production database:

```bash
# 1. Base Domain Tables Migration
npx supabase db push --file supabase/migrations/20260804000000_initial_schema.sql

# 2. Commerce Engine Tables
npx supabase db push --file supabase/migrations/20260804000001_commerce_engine.sql

# 3. Checkout & Orders Engine Tables
npx supabase db push --file supabase/migrations/20260804000002_checkout_and_orders.sql

# 4. Production Performance Indexes
npx supabase db push --file supabase/migrations/20260805000003_production_indexes_and_perf.sql
```

---

## 3. Deployment Targets

### Storefront (`apps/website`)
- **Deployment Platform**: Cloudflare Pages / Vercel
- **Build Command**: `npx turbo run build --filter=@cinmax/website`
- **Output Directory**: `apps/website/.next` (or `out`)

### Admin Dashboard (`apps/admin`)
- **Deployment Platform**: Cloudflare Pages / Vercel
- **Build Command**: `npx turbo run build --filter=@cinmax/admin`
- **Output Directory**: `apps/admin/.next`

### Mobile App (`apps/mobile`)
- **Build System**: Expo Application Services (EAS Build)
- **Commands**:
  - iOS Build: `eas build --platform ios --profile production`
  - Android APK/AAB: `eas build --platform android --profile production`

---

## 4. Disaster Recovery & Backup Strategy

1. **Database Point-in-Time Recovery (PITR)**: Enable Supabase Physical Backups with a 14-day retention window.
2. **Automated Daily Backups**: Daily `pg_dump` snapshots stored in secure S3 storage.
3. **Health Diagnostics**: The `/api/health` monitoring service continuously checks PostgreSQL connectivity, Razorpay API, Shiprocket API, and Resend delivery status.

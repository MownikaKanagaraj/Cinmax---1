-- ==============================================================================
-- CINMAX Global Products - Initial PostgreSQL Database Schema
-- Architecture: E-Commerce Storefront, Personal Care, Subscriptions, Admin
-- ==============================================================================

-- Enable UUID Extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. ENUMS
CREATE TYPE user_role AS ENUM ('customer', 'admin', 'editor', 'support');
CREATE TYPE loyalty_tier AS ENUM ('bronze', 'silver', 'gold', 'platinum');
CREATE TYPE process_type AS ENUM ('cold-process', 'triple-milled', 'melt-and-pour', 'liquid-botanical', 'whipped-butter');
CREATE TYPE fragrance_family AS ENUM ('unscented', 'citrus', 'woody', 'floral', 'herbal', 'earthy', 'aquatic', 'spicy');
CREATE TYPE order_status AS ENUM ('pending', 'processing', 'confirmed', 'shipped', 'delivered', 'cancelled', 'refunded');
CREATE TYPE payment_status AS ENUM ('unpaid', 'authorized', 'paid', 'failed', 'refunded');
CREATE TYPE payment_method AS ENUM ('stripe', 'apple_pay', 'google_pay', 'paypal');
CREATE TYPE subscription_status AS ENUM ('active', 'paused', 'cancelled', 'past_due');
CREATE TYPE subscription_interval AS ENUM ('30_days', '45_days', '60_days', '90_days');

-- 2. PROFILES (Customers & Admins)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL UNIQUE,
    first_name TEXT,
    last_name TEXT,
    phone TEXT,
    avatar_url TEXT,
    role user_role DEFAULT 'customer' NOT NULL,
    loyalty_tier loyalty_tier DEFAULT 'bronze' NOT NULL,
    loyalty_points INTEGER DEFAULT 0 NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 3. PRODUCT CATEGORIES
CREATE TABLE IF NOT EXISTS public.categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    slug TEXT NOT NULL UNIQUE,
    name TEXT NOT NULL,
    description TEXT,
    image_url TEXT,
    parent_id UUID REFERENCES public.categories(id) ON DELETE SET NULL,
    sort_order INTEGER DEFAULT 0 NOT NULL,
    is_active BOOLEAN DEFAULT TRUE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 4. PRODUCTS
CREATE TABLE IF NOT EXISTS public.products (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    slug TEXT NOT NULL UNIQUE,
    title TEXT NOT NULL,
    subtitle TEXT,
    description TEXT NOT NULL,
    how_to_use TEXT,
    process_type process_type DEFAULT 'cold-process' NOT NULL,
    category_id UUID NOT NULL REFERENCES public.categories(id) ON DELETE RESTRICT,
    base_price NUMERIC(10, 2) NOT NULL,
    compare_at_price NUMERIC(10, 2),
    currency TEXT DEFAULT 'USD' NOT NULL,
    skin_types TEXT[] DEFAULT '{}' NOT NULL,
    fragrance_family fragrance_family DEFAULT 'unscented' NOT NULL,
    certifications TEXT[] DEFAULT '{}' NOT NULL,
    is_featured BOOLEAN DEFAULT FALSE NOT NULL,
    is_new BOOLEAN DEFAULT TRUE NOT NULL,
    is_active BOOLEAN DEFAULT TRUE NOT NULL,
    average_rating NUMERIC(3, 2) DEFAULT 5.00 NOT NULL,
    review_count INTEGER DEFAULT 0 NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 5. PRODUCT VARIANTS
CREATE TABLE IF NOT EXISTS public.product_variants (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
    sku TEXT NOT NULL UNIQUE,
    title TEXT NOT NULL,
    weight_grams INTEGER,
    volume_ml INTEGER,
    price NUMERIC(10, 2) NOT NULL,
    compare_at_price NUMERIC(10, 2),
    inventory_quantity INTEGER DEFAULT 0 NOT NULL,
    low_stock_threshold INTEGER DEFAULT 10 NOT NULL,
    is_available BOOLEAN DEFAULT TRUE NOT NULL,
    options JSONB DEFAULT '{}'::jsonb NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 6. PRODUCT IMAGES
CREATE TABLE IF NOT EXISTS public.product_images (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
    url TEXT NOT NULL,
    alt TEXT NOT NULL,
    sort_order INTEGER DEFAULT 0 NOT NULL,
    is_primary BOOLEAN DEFAULT FALSE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 7. PRODUCT INGREDIENTS
CREATE TABLE IF NOT EXISTS public.ingredients (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    inci_name TEXT,
    purpose TEXT,
    is_organic BOOLEAN DEFAULT TRUE NOT NULL,
    is_key_botanical BOOLEAN DEFAULT FALSE NOT NULL,
    sort_order INTEGER DEFAULT 0 NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 8. PRODUCT REVIEWS
CREATE TABLE IF NOT EXISTS public.reviews (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
    user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    author_name TEXT NOT NULL,
    rating INTEGER CHECK (rating >= 1 AND rating <= 5) NOT NULL,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    scent_rating INTEGER CHECK (scent_rating >= 1 AND scent_rating <= 5),
    lather_rating INTEGER CHECK (lather_rating >= 1 AND lather_rating <= 5),
    moisture_rating INTEGER CHECK (moisture_rating >= 1 AND moisture_rating <= 5),
    is_verified BOOLEAN DEFAULT FALSE NOT NULL,
    is_approved BOOLEAN DEFAULT TRUE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 9. ORDERS & ITEMS
CREATE TABLE IF NOT EXISTS public.orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_number TEXT NOT NULL UNIQUE,
    user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    guest_email TEXT,
    status order_status DEFAULT 'pending' NOT NULL,
    payment_status payment_status DEFAULT 'unpaid' NOT NULL,
    payment_method payment_method DEFAULT 'stripe' NOT NULL,
    payment_intent_id TEXT,
    subtotal NUMERIC(10, 2) NOT NULL,
    discount_total NUMERIC(10, 2) DEFAULT 0.00 NOT NULL,
    tax_total NUMERIC(10, 2) DEFAULT 0.00 NOT NULL,
    shipping_total NUMERIC(10, 2) DEFAULT 0.00 NOT NULL,
    grand_total NUMERIC(10, 2) NOT NULL,
    currency TEXT DEFAULT 'USD' NOT NULL,
    shipping_address JSONB NOT NULL,
    billing_address JSONB NOT NULL,
    metadata JSONB DEFAULT '{}'::jsonb NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE TABLE IF NOT EXISTS public.order_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
    product_id UUID REFERENCES public.products(id) ON DELETE SET NULL,
    variant_id UUID REFERENCES public.product_variants(id) ON DELETE SET NULL,
    product_title TEXT NOT NULL,
    variant_title TEXT NOT NULL,
    sku TEXT NOT NULL,
    unit_price NUMERIC(10, 2) NOT NULL,
    quantity INTEGER NOT NULL CHECK (quantity > 0),
    total_price NUMERIC(10, 2) NOT NULL,
    image_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 10. CARTS & CART ITEMS
CREATE TABLE IF NOT EXISTS public.carts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    anonymous_id TEXT,
    applied_discount JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE TABLE IF NOT EXISTS public.cart_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    cart_id UUID NOT NULL REFERENCES public.carts(id) ON DELETE CASCADE,
    product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
    variant_id UUID NOT NULL REFERENCES public.product_variants(id) ON DELETE CASCADE,
    quantity INTEGER NOT NULL CHECK (quantity > 0),
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    UNIQUE(cart_id, variant_id)
);

-- 11. RECURRING BOTANICAL SUBSCRIPTIONS
CREATE TABLE IF NOT EXISTS public.subscriptions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE RESTRICT,
    variant_id UUID NOT NULL REFERENCES public.product_variants(id) ON DELETE RESTRICT,
    status subscription_status DEFAULT 'active' NOT NULL,
    interval subscription_interval DEFAULT '30_days' NOT NULL,
    quantity INTEGER DEFAULT 1 NOT NULL,
    unit_price NUMERIC(10, 2) NOT NULL,
    next_billing_date TIMESTAMPTZ NOT NULL,
    stripe_subscription_id TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 12. PERFORMANCE INDEXES
CREATE INDEX IF NOT EXISTS idx_products_category ON public.products(category_id);
CREATE INDEX IF NOT EXISTS idx_products_slug ON public.products(slug);
CREATE INDEX IF NOT EXISTS idx_products_active_featured ON public.products(is_active, is_featured);
CREATE INDEX IF NOT EXISTS idx_product_variants_product ON public.product_variants(product_id);
CREATE INDEX IF NOT EXISTS idx_product_variants_sku ON public.product_variants(sku);
CREATE INDEX IF NOT EXISTS idx_reviews_product ON public.reviews(product_id);
CREATE INDEX IF NOT EXISTS idx_orders_user ON public.orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_order_number ON public.orders(order_number);
CREATE INDEX IF NOT EXISTS idx_order_items_order ON public.order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_cart_items_cart ON public.cart_items(cart_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_user ON public.subscriptions(user_id);

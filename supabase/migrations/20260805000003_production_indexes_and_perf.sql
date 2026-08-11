-- ==============================================================================
-- CINMAX GLOBAL PRODUCTS - PRODUCTION DATABASE PERFORMANCE & INDEXES MIGRATION
-- Migration Version: 20260805000003
-- Description: Composite indexes for high-throughput queries, orders, cart & reviews
-- ==============================================================================

-- 1. Orders & Fulfillment Performance Indexes
CREATE INDEX IF NOT EXISTS idx_orders_user_status_created 
  ON public.orders (user_id, status, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_orders_guest_email 
  ON public.orders (guest_email) 
  WHERE guest_email IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_order_items_order_product 
  ON public.order_items (order_id, product_id);

-- 2. Shopping Cart Performance Indexes
CREATE INDEX IF NOT EXISTS idx_cart_items_cart_product 
  ON public.cart_items (cart_id, product_id);

-- 3. Product Catalog & Search Optimization Indexes
CREATE INDEX IF NOT EXISTS idx_products_status_category 
  ON public.products (is_active, category_id);

CREATE INDEX IF NOT EXISTS idx_products_slug_unique 
  ON public.products (slug);

-- 4. Reviews & Rating Moderation Indexes
CREATE INDEX IF NOT EXISTS idx_reviews_product_approved 
  ON public.reviews (product_id, is_approved, rating DESC);

-- 5. Audit Trail & Log Query Indexes
CREATE INDEX IF NOT EXISTS idx_payment_transactions_order 
  ON public.payment_transactions (order_id, status);

-- ==============================================================================
-- CINMAX Global Products - Row Level Security (RLS) Policies
-- Ensures secure data isolation for customers, public guests, and admins
-- ==============================================================================

-- Enable RLS on all public tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_variants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ingredients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.carts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cart_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;

-- Helper function: Is Current User Admin
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role IN ('admin', 'editor')
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 1. PROFILES POLICIES
CREATE POLICY "Users can read own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id OR public.is_admin());

CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

-- 2. CATEGORIES POLICIES (Public read, Admin write)
CREATE POLICY "Public can view active categories"
  ON public.categories FOR SELECT
  USING (is_active = TRUE OR public.is_admin());

CREATE POLICY "Admins can manage categories"
  ON public.categories FOR ALL
  USING (public.is_admin());

-- 3. PRODUCTS & VARIANTS & IMAGES & INGREDIENTS POLICIES
CREATE POLICY "Public can view active products"
  ON public.products FOR SELECT
  USING (is_active = TRUE OR public.is_admin());

CREATE POLICY "Admins can manage products"
  ON public.products FOR ALL
  USING (public.is_admin());

CREATE POLICY "Public can view variants"
  ON public.product_variants FOR SELECT
  USING (is_available = TRUE OR public.is_admin());

CREATE POLICY "Admins can manage variants"
  ON public.product_variants FOR ALL
  USING (public.is_admin());

CREATE POLICY "Public can view product images"
  ON public.product_images FOR SELECT
  USING (TRUE);

CREATE POLICY "Admins can manage product images"
  ON public.product_images FOR ALL
  USING (public.is_admin());

CREATE POLICY "Public can view ingredients"
  ON public.ingredients FOR SELECT
  USING (TRUE);

CREATE POLICY "Admins can manage ingredients"
  ON public.ingredients FOR ALL
  USING (public.is_admin());

-- 4. REVIEWS POLICIES
CREATE POLICY "Public can view approved reviews"
  ON public.reviews FOR SELECT
  USING (is_approved = TRUE OR auth.uid() = user_id OR public.is_admin());

CREATE POLICY "Authenticated users can submit reviews"
  ON public.reviews FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own reviews"
  ON public.reviews FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage all reviews"
  ON public.reviews FOR ALL
  USING (public.is_admin());

-- 5. ORDERS & ORDER ITEMS POLICIES
CREATE POLICY "Users can view own orders"
  ON public.orders FOR SELECT
  USING (auth.uid() = user_id OR public.is_admin());

CREATE POLICY "Admins can manage all orders"
  ON public.orders FOR ALL
  USING (public.is_admin());

CREATE POLICY "Users can view own order items"
  ON public.order_items FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.orders
      WHERE orders.id = order_items.order_id
      AND (orders.user_id = auth.uid() OR public.is_admin())
    )
  );

-- 6. CARTS & CART ITEMS POLICIES
CREATE POLICY "Users can view and manage own cart"
  ON public.carts FOR ALL
  USING (auth.uid() = user_id OR (user_id IS NULL AND anonymous_id IS NOT NULL));

CREATE POLICY "Users can view and manage own cart items"
  ON public.cart_items FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.carts
      WHERE carts.id = cart_items.cart_id
      AND (carts.user_id = auth.uid() OR carts.user_id IS NULL)
    )
  );

-- 7. SUBSCRIPTIONS POLICIES
CREATE POLICY "Users can view and manage own subscriptions"
  ON public.subscriptions FOR ALL
  USING (auth.uid() = user_id OR public.is_admin());

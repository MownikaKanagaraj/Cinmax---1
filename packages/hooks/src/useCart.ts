import { useState, useCallback, useMemo } from 'react';
import type { Cart, CartItem, Product, ProductVariant } from '@cinmax/types';
import { calculateTax, calculateDiscount, calculateFreeShippingProgress } from '@cinmax/utils';
import { BRAND_CONFIG } from '@cinmax/constants';

export function useCart(initialCart?: Partial<Cart>) {
  const [items, setItems] = useState<CartItem[]>(initialCart?.items || []);
  const [discountCode, setDiscountCode] = useState(initialCart?.appliedDiscount || null);

  const addItem = useCallback((product: Product, variant: ProductVariant, quantity: number = 1) => {
    setItems((currentItems) => {
      const existingIndex = currentItems.findIndex((i) => i.variantId === variant.id);

      if (existingIndex > -1) {
        const updated = [...currentItems];
        const existing = updated[existingIndex]!;
        const newQty = existing.quantity + quantity;
        updated[existingIndex] = {
          ...existing,
          quantity: newQty,
          totalPrice: newQty * existing.unitPrice,
          updatedAt: new Date().toISOString(),
        };
        return updated;
      }

      const newItem: CartItem = {
        id: `ci_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
        cartId: 'local_cart',
        productId: product.id,
        variantId: variant.id,
        product: {
          id: product.id,
          title: product.title,
          slug: product.slug,
          images: product.images,
          processType: product.processType,
        },
        variant: {
          id: variant.id,
          sku: variant.sku,
          title: variant.title,
          price: variant.price,
          weightGrams: variant.weightGrams,
          options: variant.options,
        },
        quantity,
        unitPrice: variant.price,
        totalPrice: variant.price * quantity,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      return [...currentItems, newItem];
    });
  }, []);

  const updateQuantity = useCallback((variantId: string, quantity: number) => {
    if (quantity <= 0) {
      setItems((prev) => prev.filter((i) => i.variantId !== variantId));
      return;
    }

    setItems((prev) =>
      prev.map((i) =>
        i.variantId === variantId
          ? { ...i, quantity, totalPrice: quantity * i.unitPrice, updatedAt: new Date().toISOString() }
          : i
      )
    );
  }, []);

  const removeItem = useCallback((variantId: string) => {
    setItems((prev) => prev.filter((i) => i.variantId !== variantId));
  }, []);

  const clearCart = useCallback(() => {
    setItems([]);
    setDiscountCode(null);
  }, []);

  const pricing = useMemo(() => {
    const subtotal = items.reduce((acc, item) => acc + item.totalPrice, 0);
    const discountAmount = discountCode
      ? calculateDiscount(subtotal, discountCode.discountType, discountCode.discountValue)
      : 0;
    const taxableSubtotal = Math.max(0, subtotal - discountAmount);
    const taxAmount = calculateTax(taxableSubtotal, BRAND_CONFIG.defaultTaxRate);
    const shippingProgress = calculateFreeShippingProgress(
      subtotal,
      BRAND_CONFIG.freeShippingThresholdUSD
    );
    const shippingAmount = shippingProgress.isEligible ? 0 : BRAND_CONFIG.standardShippingRateUSD;
    const estimatedTotal = Number((taxableSubtotal + taxAmount + shippingAmount).toFixed(2));

    return {
      subtotal: Number(subtotal.toFixed(2)),
      discountAmount: Number(discountAmount.toFixed(2)),
      taxAmount,
      shippingAmount,
      estimatedTotal,
      currency: BRAND_CONFIG.defaultCurrency,
      freeShippingThreshold: BRAND_CONFIG.freeShippingThresholdUSD,
      amountUntilFreeShipping: shippingProgress.remainingAmount,
    };
  }, [items, discountCode]);

  const itemCount = useMemo(
    () => items.reduce((acc, item) => acc + item.quantity, 0),
    [items]
  );

  return {
    items,
    itemCount,
    pricing,
    discountCode,
    addItem,
    updateQuantity,
    removeItem,
    clearCart,
    setDiscountCode,
  };
}

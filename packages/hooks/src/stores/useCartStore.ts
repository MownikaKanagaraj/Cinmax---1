import { create } from 'zustand';
import type { CartItem, Product, ProductVariant, AppliedCoupon } from '@cinmax/types';
import { calculateCartTotals } from '@cinmax/utils';

export interface CartStoreState {
  items: CartItem[];
  coupon: AppliedCoupon | null;
  isOpen: boolean;
  
  // Actions
  addItem: (product: any, variant?: any, quantity?: number) => void;
  removeItem: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
  applyCoupon: (coupon: AppliedCoupon) => void;
  removeCoupon: () => void;
  openDrawer: () => void;
  closeDrawer: () => void;
  toggleDrawer: () => void;

  // Computed
  getItemCount: () => number;
  getTotals: () => ReturnType<typeof calculateCartTotals>;
}

export const useCartStore = create<CartStoreState>((set, get) => ({
  items: [],
  coupon: null,
  isOpen: false,

  addItem: (productOrItem: any, variant?: any, quantity = 1) => {
    set((state) => {
      let newItem: CartItem;

      if (productOrItem && productOrItem.productId && productOrItem.unitPrice) {
        newItem = productOrItem as CartItem;
      } else if (productOrItem && variant) {
        newItem = {
          id: `ci_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
          cartId: 'local_cart',
          productId: productOrItem.id,
          variantId: variant.id,
          product: {
            id: productOrItem.id,
            title: productOrItem.title,
            slug: productOrItem.slug,
            images: productOrItem.images,
            processType: productOrItem.processType,
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
      } else {
        return state;
      }

      const existingIndex = state.items.findIndex(
        (item) => item.productId === newItem.productId && item.variantId === newItem.variantId
      );

      if (existingIndex > -1) {
        const updated = [...state.items];
        const current = updated[existingIndex];
        const newQty = current.quantity + (newItem.quantity || 1);
        updated[existingIndex] = {
          ...current,
          quantity: newQty,
          totalPrice: newQty * current.unitPrice,
        };
        return { items: updated, isOpen: true };
      }

      return { items: [...state.items, newItem], isOpen: true };
    });
  },

  removeItem: (itemId) => {
    set((state) => ({
      items: state.items.filter((item) => item.id !== itemId),
    }));
  },

  updateQuantity: (itemId, quantity) => {
    if (quantity <= 0) {
      get().removeItem(itemId);
      return;
    }
    set((state) => ({
      items: state.items.map((item) =>
        item.id === itemId
          ? { ...item, quantity, totalPrice: quantity * item.unitPrice }
          : item
      ),
    }));
  },

  clearCart: () => set({ items: [], coupon: null }),

  applyCoupon: (coupon) => set({ coupon }),
  removeCoupon: () => set({ coupon: null }),

  openDrawer: () => set({ isOpen: true }),
  closeDrawer: () => set({ isOpen: false }),
  toggleDrawer: () => set((state) => ({ isOpen: !state.isOpen })),

  getItemCount: () => {
    return get().items.reduce((acc, item) => acc + item.quantity, 0);
  },

  getTotals: () => {
    const { items, coupon } = get();
    return calculateCartTotals(
      items,
      coupon?.discountValue ?? 0,
      0.08, // standard 8% tax
      50.0 // free shipping threshold
    );
  },
}));

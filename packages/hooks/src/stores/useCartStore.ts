import { create } from 'zustand';
import type { CartItem, Product, ProductVariant, AppliedCoupon } from '@cinmax/types';
import { calculateCartTotals } from '@cinmax/utils';

export interface SavedLocalAddress {
  id: string;
  name: string;
  phone: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  pincode: string;
  landmark?: string;
  type?: string;
}

export interface CartStoreState {
  items: CartItem[];
  coupon: AppliedCoupon | null;
  isOpen: boolean;
  savedLocalAddress: SavedLocalAddress | null;
  
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
  setSavedLocalAddress: (address: SavedLocalAddress) => void;

  // Computed
  getItemCount: () => number;
  getTotals: () => ReturnType<typeof calculateCartTotals>;
}

const DEFAULT_ADDRESS: SavedLocalAddress = {
  id: 'addr_default_local',
  name: 'Aanya Sharma',
  phone: '9876543210',
  addressLine1: 'Flat 402, Royal Enclave',
  addressLine2: '2nd Main Road, T. Nagar',
  city: 'Chennai',
  state: 'Tamil Nadu',
  pincode: '600017',
  landmark: 'Near Apollo Hospital',
  type: 'Home',
};

export const useCartStore = create<CartStoreState>((set, get) => ({
  items: [],
  coupon: null,
  isOpen: false,
  savedLocalAddress: DEFAULT_ADDRESS,

  addItem: (productOrItem: any, variant?: any, quantity = 1) => {
    set((state) => {
      let newItem: CartItem;

      if (productOrItem && productOrItem.productId && productOrItem.unitPrice) {
        newItem = { ...productOrItem } as CartItem;
        const minQty = Math.max(1, Number(newItem.product?.minOrderQuantity || (newItem as any).minOrderQuantity || 1));
        if (newItem.quantity < minQty) {
          newItem.quantity = minQty;
          newItem.totalPrice = newItem.unitPrice * minQty;
        }
      } else if (productOrItem && variant) {
        const minQty = Math.max(1, Number(productOrItem.minOrderQuantity || 1));
        const effectiveQty = Math.max(minQty, Number(quantity) || 1);
        const effectiveUnitPrice = productOrItem.quantityPrice && Number(productOrItem.quantityPrice) > 0
          ? Number(productOrItem.quantityPrice)
          : Number(variant.price);

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
            minOrderQuantity: minQty,
            quantityPrice: productOrItem.quantityPrice || null,
          },
          variant: {
            id: variant.id,
            sku: variant.sku,
            title: variant.title,
            price: effectiveUnitPrice,
            weightGrams: variant.weightGrams,
            options: variant.options,
          },
          quantity: effectiveQty,
          unitPrice: effectiveUnitPrice,
          totalPrice: effectiveUnitPrice * effectiveQty,
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
        const minQty = Math.max(1, Number(current.product?.minOrderQuantity || newItem.product?.minOrderQuantity || 1));
        const addedQty = newItem.quantity || 1;
        const newQty = Math.max(minQty, current.quantity + addedQty);
        updated[existingIndex] = {
          ...current,
          quantity: newQty,
          totalPrice: newQty * current.unitPrice,
        };
        return { items: updated };
      }

      return { items: [...state.items, newItem] };
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
      items: state.items.map((item) => {
        if (item.id !== itemId) return item;
        const minQty = Math.max(1, Number(item.product?.minOrderQuantity || (item as any).minOrderQuantity || 1));
        const clampedQty = Math.max(minQty, quantity);
        return {
          ...item,
          quantity: clampedQty,
          totalPrice: clampedQty * item.unitPrice,
        };
      }),
    }));
  },

  clearCart: () => set({ items: [], coupon: null }),

  applyCoupon: (coupon) => set({ coupon }),
  removeCoupon: () => set({ coupon: null }),

  openDrawer: () => set({ isOpen: true }),
  closeDrawer: () => set({ isOpen: false }),
  toggleDrawer: () => set((state) => ({ isOpen: !state.isOpen })),

  setSavedLocalAddress: (address) => set({ savedLocalAddress: address }),

  getItemCount: () => {
    return get().items.reduce((acc, item) => acc + item.quantity, 0);
  },

  getTotals: () => {
    const { items, coupon } = get();
    return calculateCartTotals(
      items,
      coupon?.discountValue ?? 0,
      0, // 0 tax rate for inclusive pricing
      50.0, // free shipping threshold
      6.95, // flat shipping rate
      coupon?.discountType ?? 'percentage'
    );
  },
}));


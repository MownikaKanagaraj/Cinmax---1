import type { CartItem } from '@cinmax/types';

export interface InventoryItemValidation {
  itemId: string;
  productId: string;
  requestedQuantity: number;
  availableQuantity: number;
  isAvailable: boolean;
  isLowStock: boolean;
  maxOrderLimit: number;
  message?: string;
}

export interface InventoryCartValidationResult {
  isValid: boolean;
  items: InventoryItemValidation[];
  outOfStockCount: number;
  hasWarnings: boolean;
}

export class InventoryEngine {
  public static readonly MAX_QUANTITY_PER_ITEM = 10;
  public static readonly LOW_STOCK_THRESHOLD = 5;

  public static validateItem(
    itemId: string,
    productId: string,
    requestedQty: number,
    stockQty: number
  ): InventoryItemValidation {
    const isAvailable = stockQty > 0 && requestedQty <= stockQty;
    const isLowStock = stockQty > 0 && stockQty <= this.LOW_STOCK_THRESHOLD;
    const maxOrderLimit = Math.min(stockQty, this.MAX_QUANTITY_PER_ITEM);

    let message: string | undefined;
    if (stockQty <= 0) {
      message = 'Out of stock';
    } else if (requestedQty > stockQty) {
      message = `Only ${stockQty} units remaining in stock`;
    } else if (requestedQty > this.MAX_QUANTITY_PER_ITEM) {
      message = `Maximum order limit per item is ${this.MAX_QUANTITY_PER_ITEM}`;
    }

    return {
      itemId,
      productId,
      requestedQuantity: requestedQty,
      availableQuantity: stockQty,
      isAvailable,
      isLowStock,
      maxOrderLimit,
      message,
    };
  }

  public static validateCart(
    cartItems: Array<{ id: string; productId: string; quantity: number; availableStock?: number }>
  ): InventoryCartValidationResult {
    let outOfStockCount = 0;
    let hasWarnings = false;

    const items = cartItems.map((item) => {
      const stock = item.availableStock ?? 50; // fallback default available stock
      const validation = this.validateItem(item.id, item.productId, item.quantity, stock);
      if (!validation.isAvailable) outOfStockCount++;
      if (validation.isLowStock || validation.message) hasWarnings = true;
      return validation;
    });

    return {
      isValid: outOfStockCount === 0,
      items,
      outOfStockCount,
      hasWarnings,
    };
  }
}

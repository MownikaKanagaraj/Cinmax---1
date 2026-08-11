/**
 * Base Application and Domain Error Classes for CINMAX Global Products
 */

export abstract class AppError extends Error {
  public abstract readonly statusCode: number;
  public abstract readonly code: string;
  public readonly timestamp: string;

  constructor(
    message: string,
    public readonly details?: Record<string, any>
  ) {
    super(message);
    this.name = this.constructor.name;
    this.timestamp = new Date().toISOString();
    Object.setPrototypeOf(this, new.target.prototype);
  }

  public toJSON() {
    return {
      name: this.name,
      code: this.code,
      message: this.message,
      statusCode: this.statusCode,
      timestamp: this.timestamp,
      details: this.details,
    };
  }
}

export class DomainError extends AppError {
  public readonly statusCode: number = 400;
  public readonly code: string = 'DOMAIN_ERROR';

  constructor(message: string, details?: Record<string, any>) {
    super(message, details);
  }
}

export class NotFoundError extends AppError {
  public readonly statusCode: number = 404;
  public readonly code: string = 'NOT_FOUND';

  constructor(resource: string, identifier?: string | number, details?: Record<string, any>) {
    const msg = identifier
      ? `${resource} with identifier '${identifier}' was not found.`
      : `${resource} was not found.`;
    super(msg, { resource, identifier, ...details });
  }
}

export class ValidationError extends AppError {
  public readonly statusCode: number = 422;
  public readonly code: string = 'VALIDATION_ERROR';

  constructor(
    message: string,
    public readonly validationErrors?: Record<string, string[]>
  ) {
    super(message, { validationErrors });
  }
}

export class UnauthorizedError extends AppError {
  public readonly statusCode: number = 401;
  public readonly code: string = 'UNAUTHORIZED';

  constructor(message: string = 'Authentication is required to perform this action.') {
    super(message);
  }
}

export class ForbiddenError extends AppError {
  public readonly statusCode: number = 403;
  public readonly code: string = 'FORBIDDEN';

  constructor(message: string = 'You do not have permission to perform this action.') {
    super(message);
  }
}

// -----------------------------------------------------------------------------
// Domain-Specific Errors
// -----------------------------------------------------------------------------

export class ProductNotFoundError extends NotFoundError {
  public override readonly code: string = 'PRODUCT_NOT_FOUND';
  constructor(idOrSlug: string) {
    super('Product', idOrSlug);
  }
}

export class CategoryNotFoundError extends NotFoundError {
  public override readonly code: string = 'CATEGORY_NOT_FOUND';
  constructor(idOrSlug: string) {
    super('Category', idOrSlug);
  }
}

export class OrderNotFoundError extends NotFoundError {
  public override readonly code: string = 'ORDER_NOT_FOUND';
  constructor(idOrNumber: string) {
    super('Order', idOrNumber);
  }
}

export class CustomerNotFoundError extends NotFoundError {
  public override readonly code: string = 'CUSTOMER_NOT_FOUND';
  constructor(idOrEmail: string) {
    super('Customer', idOrEmail);
  }
}

export class InvalidCouponError extends DomainError {
  public override readonly code: string = 'INVALID_COUPON';
  constructor(code: string, reason?: string) {
    super(reason ? `Coupon '${code}' is invalid: ${reason}` : `Coupon '${code}' is invalid or expired.`, { code, reason });
  }
}

export class OutOfStockError extends DomainError {
  public override readonly code: string = 'OUT_OF_STOCK';
  constructor(productTitle: string, variantSku?: string, availableQty: number = 0) {
    super(
      `Product '${productTitle}'${variantSku ? ` (${variantSku})` : ''} is out of stock. Available: ${availableQty}.`,
      { productTitle, variantSku, availableQty }
    );
  }
}

export class PaymentFailedError extends AppError {
  public readonly statusCode: number = 402;
  public readonly code: string = 'PAYMENT_FAILED';
  constructor(reason: string, details?: Record<string, any>) {
    super(`Payment processing failed: ${reason}`, details);
  }
}

export class AuthenticationRequiredError extends UnauthorizedError {
  public override readonly code: string = 'AUTHENTICATION_REQUIRED';
}

export class PermissionDeniedError extends ForbiddenError {
  public override readonly code: string = 'PERMISSION_DENIED';
}

export class ReviewNotFoundError extends NotFoundError {
  public override readonly code: string = 'REVIEW_NOT_FOUND';
  constructor(id: string) {
    super('Review', id);
  }
}

export class BannerNotFoundError extends NotFoundError {
  public override readonly code: string = 'BANNER_NOT_FOUND';
  constructor(id: string) {
    super('Banner', id);
  }
}

export class BlogPostNotFoundError extends NotFoundError {
  public override readonly code: string = 'BLOG_POST_NOT_FOUND';
  constructor(idOrSlug: string) {
    super('Blog Post', idOrSlug);
  }
}

export class SettingsNotFoundError extends NotFoundError {
  public override readonly code: string = 'SETTINGS_NOT_FOUND';
  constructor() {
    super('Application Settings');
  }
}

export class CartItemNotFoundError extends NotFoundError {
  public override readonly code: string = 'CART_ITEM_NOT_FOUND';
  constructor(id: string) {
    super('Cart Item', id);
  }
}

// Alias for backwards compatibility
export { AuthenticationRequiredError as AuthenticationError };

import type { UserRole, Permission, RoleDefinition } from '@cinmax/types';

export const ROLE_DEFINITIONS: Record<UserRole, RoleDefinition> = {
  super_admin: {
    role: 'super_admin',
    label: 'Super Admin',
    description: 'Unrestricted enterprise access to all store operations, roles, and settings.',
    permissions: [
      'products:read',
      'products:create',
      'products:update',
      'products:delete',
      'categories:manage',
      'orders:read',
      'orders:update',
      'orders:cancel',
      'orders:refund',
      'inventory:read',
      'inventory:update',
      'customers:read',
      'customers:manage',
      'reviews:read',
      'reviews:moderate',
      'coupons:manage',
      'banners:manage',
      'cms:manage',
      'analytics:view',
      'notifications:send',
      'settings:manage',
      'roles:manage',
    ],
  },
  admin: {
    role: 'admin',
    label: 'Administrator',
    description: 'Full store operations and management privileges.',
    permissions: [
      'products:read',
      'products:create',
      'products:update',
      'products:delete',
      'categories:manage',
      'orders:read',
      'orders:update',
      'orders:cancel',
      'orders:refund',
      'inventory:read',
      'inventory:update',
      'customers:read',
      'customers:manage',
      'reviews:read',
      'reviews:moderate',
      'coupons:manage',
      'banners:manage',
      'cms:manage',
      'analytics:view',
      'notifications:send',
      'settings:manage',
    ],
  },
  manager: {
    role: 'manager',
    label: 'Store Manager',
    description: 'Oversees daily fulfillment, inventory, catalog, and analytics.',
    permissions: [
      'products:read',
      'products:create',
      'products:update',
      'categories:manage',
      'orders:read',
      'orders:update',
      'orders:cancel',
      'inventory:read',
      'inventory:update',
      'customers:read',
      'reviews:read',
      'reviews:moderate',
      'coupons:manage',
      'banners:manage',
      'cms:manage',
      'analytics:view',
    ],
  },
  inventory_manager: {
    role: 'inventory_manager',
    label: 'Inventory Manager',
    description: 'Dedicated stock replenishment and warehouse catalog control.',
    permissions: [
      'products:read',
      'products:update',
      'inventory:read',
      'inventory:update',
      'orders:read',
    ],
  },
  content_editor: {
    role: 'content_editor',
    label: 'Content Editor',
    description: 'Manages marketing blogs, promo banners, and storefront copywriting.',
    permissions: [
      'products:read',
      'banners:manage',
      'cms:manage',
      'reviews:read',
      'reviews:moderate',
    ],
  },
  support_executive: {
    role: 'support_executive',
    label: 'Support Executive',
    description: 'Customer service, order tracking assistance, and review moderation.',
    permissions: [
      'orders:read',
      'orders:update',
      'customers:read',
      'reviews:read',
      'reviews:moderate',
    ],
  },
  support: {
    role: 'support',
    label: 'Support Representative',
    description: 'Customer service, order tracking assistance, and review moderation.',
    permissions: [
      'orders:read',
      'orders:update',
      'customers:read',
      'reviews:read',
      'reviews:moderate',
    ],
  },
  customer: {
    role: 'customer',
    label: 'Customer',
    description: 'Standard retail consumer access.',
    permissions: ['products:read', 'reviews:read'],
  },
};

/**
 * Checks if a specific role possesses a required permission.
 */
export function hasPermission(role: UserRole | undefined, permission: Permission): boolean {
  if (!role) return false;
  const definition = ROLE_DEFINITIONS[role];
  if (!definition) return false;
  return definition.permissions.includes(permission);
}

/**
 * Checks if a role has ANY of the specified permissions.
 */
export function hasAnyPermission(role: UserRole | undefined, permissions: Permission[]): boolean {
  if (!role) return false;
  return permissions.some((perm) => hasPermission(role, perm));
}

/**
 * Checks if a role is authorized for admin portal access.
 */
export function isStaffRole(role: UserRole | undefined): boolean {
  if (!role) return false;
  return role !== 'customer';
}

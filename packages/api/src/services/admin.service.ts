import type { UserRole, ReviewStatus, Permission } from '@cinmax/types';
import { hasPermission } from '@cinmax/utils';
import { AdminAnalyticsEngine, type ExecutiveDashboardData } from '../engines/admin-analytics.engine';
import { AuditEngine, type AuditLogPayload, type AuditLogEntry } from '../engines/audit.engine';
import type { IOrderRepository } from '../modules/orders';
import type { IProductRepository } from '../modules/products';
import type { ICustomerRepository } from '../modules/customers';
import type { IReviewRepository } from '../modules/reviews';

export class AdminService {
  private auditTrail: AuditLogEntry[] = [];

  constructor(
    private orderRepo: IOrderRepository,
    private productRepo: IProductRepository,
    private customerRepo: ICustomerRepository,
    private reviewRepo: IReviewRepository
  ) {}

  public async getDashboardData(): Promise<ExecutiveDashboardData> {
    const ordersResult = await this.orderRepo.getAll();
    const productsResult = await this.productRepo.getAll();

    const orders = ordersResult.items.map((e) => e as any);
    const products = productsResult.items.map((e) => e as any);

    return AdminAnalyticsEngine.computeDashboard(orders, products, []);
  }

  public recordAuditLog(payload: AuditLogPayload): AuditLogEntry {
    const entry = AuditEngine.createEntry(payload);
    this.auditTrail.unshift(entry);
    return entry;
  }

  public getAuditLogs(): AuditLogEntry[] {
    return this.auditTrail;
  }

  public async moderateReview(
    reviewId: string,
    status: ReviewStatus,
    replyText?: string
  ): Promise<any> {
    const updated = await this.reviewRepo.updateStatus(reviewId, status);
    this.recordAuditLog({
      action: `review_moderate_${status}`,
      entityName: 'review',
      entityId: reviewId,
      newValue: { status, replyText },
    });
    return updated;
  }

  public async exportReport(reportType: 'sales' | 'gst' | 'inventory' | 'customers'): Promise<string> {
    const ordersResult = await this.orderRepo.getAll();
    const data = ordersResult.items.map((o) => ({
      orderNumber: o.orderNumber,
      status: o.status,
      grandTotal: o.grandTotal,
      createdAt: o.createdAt,
    }));

    return AdminAnalyticsEngine.exportToCSV(reportType, data);
  }

  public hasAdminAccess(role: UserRole, permission: Permission): boolean {
    return hasPermission(role, permission);
  }
}

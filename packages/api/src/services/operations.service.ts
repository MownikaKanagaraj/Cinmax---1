import {
  ShiprocketProvider,
  MockShippingProvider,
  type IShippingProvider,
  type CreateShipmentPayload,
  type ShipmentDetails,
} from '../shipping';
import {
  MockNotificationProvider,
  type INotificationProvider,
  type PushNotificationPayload,
  type EmailNotificationPayload,
  type SMSNotificationPayload,
  type WhatsAppNotificationPayload,
  type NotificationResult,
} from '../notifications';
import { EventBus, type DomainEventType } from '../events';
import { BackgroundJobProcessor, type BackgroundJob } from '../jobs';
import { Logger, HealthCheckService, type HealthCheckResult, type LogCategory, type LogEntry } from '../monitoring';

export class OperationsService {
  private shippingProvider: IShippingProvider;
  private notificationProvider: INotificationProvider;
  private eventBus: EventBus;
  private jobProcessor: BackgroundJobProcessor;

  constructor(
    shippingProvider?: IShippingProvider,
    notificationProvider?: INotificationProvider
  ) {
    this.shippingProvider = shippingProvider || new MockShippingProvider();
    this.notificationProvider = notificationProvider || new MockNotificationProvider();
    this.eventBus = EventBus.getInstance();
    this.jobProcessor = new BackgroundJobProcessor();
  }

  // Shipping Logistics
  public async createShipment(payload: CreateShipmentPayload): Promise<ShipmentDetails> {
    Logger.info('shipping', `Creating shipment for order ${payload.orderNumber}`, { payload });
    const shipment = await this.shippingProvider.createShipment(payload);
    await this.eventBus.publish('OrderShipped', { shipmentId: shipment.shipmentId, orderId: payload.orderId });
    return shipment;
  }

  public async trackShipment(awbOrShipmentId: string): Promise<ShipmentDetails> {
    return this.shippingProvider.trackShipment(awbOrShipmentId);
  }

  public async cancelShipment(shipmentId: string): Promise<boolean> {
    Logger.warn('shipping', `Cancelling shipment ${shipmentId}`);
    return this.shippingProvider.cancelShipment(shipmentId);
  }

  // Multi-Channel Notifications
  public async sendPushNotification(payload: PushNotificationPayload): Promise<NotificationResult> {
    Logger.info('notification', `Sending push notification to ${payload.targetTokenOrTopic}`);
    return this.notificationProvider.sendPush(payload);
  }

  public async sendEmailNotification(payload: EmailNotificationPayload): Promise<NotificationResult> {
    Logger.info('notification', `Sending email notification (${payload.template}) to ${payload.to}`);
    return this.notificationProvider.sendEmail(payload);
  }

  public async sendWhatsAppNotification(payload: WhatsAppNotificationPayload): Promise<NotificationResult> {
    Logger.info('notification', `Sending WhatsApp notification to ${payload.phone}`);
    return this.notificationProvider.sendWhatsApp(payload);
  }

  // Domain Event Bus
  public async publishEvent(type: DomainEventType, payload: any): Promise<void> {
    Logger.info('api', `Domain event published: ${type}`);
    await this.eventBus.publish(type, payload);
  }

  // Background Job Processing
  public enqueueJob(type: BackgroundJob['type'], payload: Record<string, any>): BackgroundJob {
    return this.jobProcessor.enqueueJob(type, payload);
  }

  public async processJobBatch(): Promise<{ processed: number; failed: number }> {
    return this.jobProcessor.processNextBatch();
  }

  // System Diagnostics & Logs
  public async getHealthCheck(): Promise<HealthCheckResult> {
    return HealthCheckService.runDiagnostics();
  }

  public getSystemLogs(category?: LogCategory, limit = 50): LogEntry[] {
    return Logger.getLogs(category, limit);
  }
}

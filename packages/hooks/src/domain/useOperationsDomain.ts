import { useQuery, useMutation } from '@tanstack/react-query';
import {
  useOperationsService,
  type CreateShipmentPayload,
  type PushNotificationPayload,
  type EmailNotificationPayload,
  type WhatsAppNotificationPayload,
  type DomainEventType,
} from '@cinmax/api';

export function useShipmentTrackingQuery(awbOrShipmentId: string, options?: { enabled?: boolean }) {
  const operationsService = useOperationsService();

  return useQuery({
    queryKey: ['shipment-tracking', awbOrShipmentId],
    queryFn: () => operationsService.trackShipment(awbOrShipmentId),
    enabled: Boolean(awbOrShipmentId) && (options?.enabled ?? true),
    staleTime: 1000 * 60 * 5,
  });
}

export function useCreateShipmentMutation() {
  const operationsService = useOperationsService();

  return useMutation({
    mutationFn: (payload: CreateShipmentPayload) => operationsService.createShipment(payload),
  });
}

export function useSendPushNotificationMutation() {
  const operationsService = useOperationsService();

  return useMutation({
    mutationFn: (payload: PushNotificationPayload) => operationsService.sendPushNotification(payload),
  });
}

export function useSendEmailNotificationMutation() {
  const operationsService = useOperationsService();

  return useMutation({
    mutationFn: (payload: EmailNotificationPayload) => operationsService.sendEmailNotification(payload),
  });
}

export function useSendWhatsAppNotificationMutation() {
  const operationsService = useOperationsService();

  return useMutation({
    mutationFn: (payload: WhatsAppNotificationPayload) => operationsService.sendWhatsAppNotification(payload),
  });
}

export function usePublishDomainEventMutation() {
  const operationsService = useOperationsService();

  return useMutation({
    mutationFn: ({ type, payload }: { type: DomainEventType; payload: any }) =>
      operationsService.publishEvent(type, payload),
  });
}

export function useHealthCheckQuery() {
  const operationsService = useOperationsService();

  return useQuery({
    queryKey: ['system-health-check'],
    queryFn: () => operationsService.getHealthCheck(),
    refetchInterval: 30000,
  });
}

export function useRunJobProcessorMutation() {
  const operationsService = useOperationsService();

  return useMutation({
    mutationFn: () => operationsService.processJobBatch(),
  });
}

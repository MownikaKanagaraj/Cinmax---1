export interface AuditLogPayload {
  action: string;
  entityName: string;
  entityId: string;
  actorId?: string;
  previousValue?: Record<string, any> | null;
  newValue?: Record<string, any> | null;
  ipAddress?: string;
}

export interface AuditLogEntry extends AuditLogPayload {
  id: string;
  timestamp: string;
}

export class AuditEngine {
  public static createEntry(payload: AuditLogPayload): AuditLogEntry {
    return {
      id: `audit_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      timestamp: new Date().toISOString(),
      action: payload.action,
      entityName: payload.entityName,
      entityId: payload.entityId,
      actorId: payload.actorId || 'system_admin',
      previousValue: payload.previousValue || null,
      newValue: payload.newValue || null,
      ipAddress: payload.ipAddress || '127.0.0.1',
    };
  }
}

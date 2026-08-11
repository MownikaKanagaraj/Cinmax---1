export async function logEvent(eventName: string, params?: Record<string, any>) {
  // Client/server event tracking pipeline adapter
  return { success: true, eventName, timestamp: new Date().toISOString() };
}

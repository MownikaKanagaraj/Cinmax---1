export type LogCategory = 'api' | 'payment' | 'shipping' | 'notification' | 'inventory' | 'error';
export type LogLevel = 'info' | 'warn' | 'error' | 'debug';

export interface LogEntry {
  id: string;
  category: LogCategory;
  level: LogLevel;
  message: string;
  context?: Record<string, any>;
  timestamp: string;
}

export class Logger {
  private static logs: LogEntry[] = [];

  public static info(category: LogCategory, message: string, context?: Record<string, any>): LogEntry {
    return this.log('info', category, message, context);
  }

  public static warn(category: LogCategory, message: string, context?: Record<string, any>): LogEntry {
    return this.log('warn', category, message, context);
  }

  public static error(category: LogCategory, message: string, context?: Record<string, any>): LogEntry {
    return this.log('error', category, message, context);
  }

  private static log(level: LogLevel, category: LogCategory, message: string, context?: Record<string, any>): LogEntry {
    const entry: LogEntry = {
      id: `log_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      category,
      level,
      message,
      context,
      timestamp: new Date().toISOString(),
    };

    this.logs.unshift(entry);
    if (this.logs.length > 500) {
      this.logs.pop();
    }

    return entry;
  }

  public static getLogs(category?: LogCategory, limit = 50): LogEntry[] {
    if (category) {
      return this.logs.filter((l) => l.category === category).slice(0, limit);
    }
    return this.logs.slice(0, limit);
  }
}

/**
 * Logger — utilidad simple de logging para el backend.
 * Agrega timestamps y niveles a los mensajes.
 */
export class Logger {
  private scope: string;

  constructor(scope: string) {
    this.scope = scope;
  }

  private format(level: string, message: string, meta?: unknown): string {
    const ts = new Date().toISOString();
    const metaStr = meta ? ` | meta: ${JSON.stringify(meta)}` : '';
    return `[${ts}] [${level}] [${this.scope}] ${message}${metaStr}`;
  }

  info(message: string, meta?: unknown): void {
    console.log(this.format('INFO', message, meta));
  }

  warn(message: string, meta?: unknown): void {
    console.warn(this.format('WARN', message, meta));
  }

  error(message: string, meta?: unknown): void {
    console.error(this.format('ERROR', message, meta));
  }

  debug(message: string, meta?: unknown): void {
    if (process.env.NODE_ENV !== 'production') {
      console.log(this.format('DEBUG', message, meta));
    }
  }
}

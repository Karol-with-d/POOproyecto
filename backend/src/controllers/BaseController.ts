/**
 * BaseController — clase base para todos los controladores de la API.
 * Centraliza el envío de respuestas y el manejo de errores comunes.
 *
 * Nota POO (T-009): Herencia de controladores.
 */
import { Response } from 'express';
import { Logger } from '../utils/logger';

export abstract class BaseController {
  protected logger: Logger;

  constructor(scope: string) {
    this.logger = new Logger(scope);
  }

  protected sendSuccess<T>(res: Response, data: T, statusCode: number = 200): void {
    this.logger.info(`Response ${statusCode}`, { status: 'ok', data });
    res.status(statusCode).json({ status: 'ok', data });
  }

  protected sendError(res: Response, message: string, statusCode: number = 500, error?: unknown): void {
    this.logger.error(`Response ${statusCode}: ${message}`, { error });
    res.status(statusCode).json({ status: 'error', message });
  }

  protected sendNotFound(res: Response, message: string = 'Recurso no encontrado'): void {
    this.sendError(res, message, 404);
  }
}

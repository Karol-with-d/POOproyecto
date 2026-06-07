/**
 * BaseController — clase base para todos los controladores de la API.
 * Centraliza el envío de respuestas y el manejo de errores comunes.
 * 
 * Nota POO (T-009): Herencia de controladores.
 */
import { Response } from 'express';

export abstract class BaseController {
  protected sendSuccess<T>(res: Response, data: T, statusCode: number = 200): void {
    res.status(statusCode).json({ status: 'ok', data });
  }

  protected sendError(res: Response, message: string, statusCode: number = 500): void {
    res.status(statusCode).json({ status: 'error', message });
  }

  protected sendNotFound(res: Response, message: string = 'Recurso no encontrado'): void {
    this.sendError(res, message, 404);
  }
}

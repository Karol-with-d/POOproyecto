import { Request, Response } from 'express';
import { BaseController } from './BaseController';
import { SemanaService } from '../services/SemanaService';

/**
 * SemanaController — maneja endpoints de semanas.
 * Hereda de BaseController para respuestas y errores comunes.
 * 
 * Nota POO (T-009): herencia de controladores.
 */
export class SemanaController extends BaseController {
  private semanaService: SemanaService;

  constructor(semanaService: SemanaService) {
    super();
    this.semanaService = semanaService;
  }

  /**
   * GET /api/semanas
   * Lista las 6 semanas ordenadas por número.
   */
  async getAll(req: Request, res: Response): Promise<void> {
    try {
      const semanas = await this.semanaService.findAll();
      this.sendSuccess(res, semanas);
    } catch (error) {
      this.sendError(res, 'Error al obtener semanas', 500);
    }
  }

  /**
   * GET /api/semanas/:id
   * Detalle de una semana.
   */
  async getById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const semana = await this.semanaService.findById(id);
      if (!semana) {
        this.sendNotFound(res, 'Semana no encontrada');
        return;
      }
      this.sendSuccess(res, semana);
    } catch (error) {
      this.sendError(res, 'Error al obtener semana', 500);
    }
  }
}

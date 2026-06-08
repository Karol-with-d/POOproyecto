import { Request, Response } from 'express';
import { BaseController } from './BaseController';
import { ProgressService } from '../services/ProgressService';

/**
 * ProgressController — maneja endpoints de progreso del usuario.
 */
export class ProgressController extends BaseController {
  private progressService: ProgressService;

  constructor(progressService: ProgressService) {
    super('ProgressController');
    this.progressService = progressService;
  }

  /**
   * GET /api/users/:userId/progress
   * Progreso del usuario en todas las semanas.
   */
  async getProgress(req: Request, res: Response): Promise<void> {
    try {
      const { userId } = req.params;
      const progress = await this.progressService.getUserProgress(userId);
      this.sendSuccess(res, progress);
    } catch (error) {
      this.sendError(res, 'Error al obtener progreso', 500);
    }
  }

  /**
   * PATCH /api/users/:userId/progress/semana/:semanaId
   * Marca una semana como completada.
   */
  async markCompleted(req: Request, res: Response): Promise<void> {
    try {
      const { userId, semanaId } = req.params;
      const { score } = req.body;

      const updated = await this.progressService.markSemanaCompleted(userId, semanaId, score);
      this.sendSuccess(res, updated);
    } catch (error) {
      this.sendError(res, 'Error al actualizar progreso', 500);
    }
  }
}

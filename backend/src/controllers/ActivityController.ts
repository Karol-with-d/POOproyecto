import { Request, Response } from 'express';
import { BaseController } from './BaseController';
import { ActivityService } from '../services/ActivityService';

/**
 * ActivityController — maneja endpoints de actividades.
 */
export class ActivityController extends BaseController {
  private activityService: ActivityService;

  constructor(activityService: ActivityService) {
    super();
    this.activityService = activityService;
  }

  /**
   * GET /api/semanas/:id/activities
   * Actividades de una semana en orden.
   */
  async getBySemana(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const activities = await this.activityService.findBySemanaId(id);
      this.sendSuccess(res, activities);
    } catch (error) {
      this.sendError(res, 'Error al obtener actividades', 500);
    }
  }
}

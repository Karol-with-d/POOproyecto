import { Request, Response } from 'express';
import { BaseController } from './BaseController';
import { ScoreService } from '../services/ScoreService';

/**
 * ScoreController — maneja endpoints de puntuaciones.
 */
export class ScoreController extends BaseController {
  private scoreService: ScoreService;

  constructor(scoreService: ScoreService) {
    super('ScoreController');
    this.scoreService = scoreService;
  }

  /**
   * POST /api/scores
   * Guarda o actualiza un score.
   */
  async create(req: Request, res: Response): Promise<void> {
    try {
      const { userId, semanaId, activityId, score, type } = req.body;

      if (!userId || !semanaId || score === undefined || !type) {
        this.sendError(res, 'Datos incompletos', 400);
        return;
      }

      const saved = await this.scoreService.saveScore({ userId, semanaId, activityId, score, type });
      this.sendSuccess(res, saved, 201);
    } catch (error) {
      this.sendError(res, 'Error al guardar score', 500);
    }
  }

  /**
   * GET /api/users/:userId/scores
   * Lista todos los scores de un usuario.
   */
  async getByUser(req: Request, res: Response): Promise<void> {
    try {
      const { userId } = req.params;
      const scores = await this.scoreService.findByUserId(userId);
      this.sendSuccess(res, scores);
    } catch (error) {
      this.sendError(res, 'Error al obtener scores', 500);
    }
  }

  /**
   * GET /api/users/:userId/scores/semana/:semanaId
   * Scores de un usuario en una semana específica.
   */
  async getByUserAndSemana(req: Request, res: Response): Promise<void> {
    try {
      const { userId, semanaId } = req.params;
      const scores = await this.scoreService.findByUserAndSemana(userId, semanaId);
      this.sendSuccess(res, scores);
    } catch (error) {
      this.sendError(res, 'Error al obtener scores', 500);
    }
  }

  /**
   * GET /api/users/:userId/global-score
   * Calcula la nota global promedio.
   */
  async getGlobalScore(req: Request, res: Response): Promise<void> {
    try {
      const { userId } = req.params;
      const result = await this.scoreService.calculateGlobalScore(userId);
      this.sendSuccess(res, result);
    } catch (error) {
      this.sendError(res, 'Error al calcular nota global', 500);
    }
  }
}

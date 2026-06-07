import { UserScoreModel } from '../models/UserScoreModel';
import { UserModel } from '../models/UserModel';
import { ScoreCalculator } from './ScoreCalculator';
import { prisma } from '../config/prisma';
import type { UserScore } from '@prisma/client';

/**
 * ScoreService — lógica de negocio para puntuaciones.
 * Usa ScoreCalculator como dependencia.
 */
export class ScoreService {
  private calculator: ScoreCalculator;

  constructor() {
    this.calculator = new ScoreCalculator();
  }

  async saveScore(data: {
    userId: string;
    semanaId: string;
    activityId?: string;
    score: number;
    type: string;
  }): Promise<UserScore> {
    // Validar que el usuario existe
    const user = await new UserModel(data.userId, '').findById(data.userId);
    if (!user) {
      throw new Error('Usuario no encontrado');
    }

    // Validar score
    if (!this.calculator.validateScore(data.score)) {
      throw new Error('Score debe estar entre 0 y 100');
    }

    // Upsert: si existe score para misma actividad, lo sobrescribe
    return UserScoreModel.upsertForActivity(
      data.userId,
      data.semanaId,
      data.activityId ?? null,
      data.score,
      data.type
    );
  }

  async findByUserId(userId: string): Promise<UserScore[]> {
    const model = new UserScoreModel('', userId, '', 0, '');
    return model.findAll({ userId });
  }

  async findByUserAndSemana(userId: string, semanaId: string): Promise<UserScore[]> {
    const model = new UserScoreModel('', userId, semanaId, 0, '');
    return model.findAll({ userId, semanaId });
  }

  async calculateGlobalScore(userId: string): Promise<{ global: number; breakdown: any[]; message: string }> {
    const scores = await this.findByUserId(userId);
    const { global, breakdown, missing } = this.calculator.calculateGlobal(scores);

    let message = '';
    if (missing.length > 0) {
      message = `Faltan ${missing.length} semanas por completar.`;
    } else if (breakdown.length === 0) {
      message = 'Aún no hay scores registrados.';
    } else {
      message = '¡Todas las semanas completadas!';
    }

    return { global, breakdown, message };
  }
}

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
    const semanas = await prisma.semana.findMany({
      select: { id: true, number: true },
      orderBy: { number: 'asc' },
    });
    const { global, breakdown, missing } = this.calculator.calculateGlobal(scores, semanas);

    const hasQuiz = scores.some((score) => score.type === 'quiz');
    let message = '';
    if (!hasQuiz) {
      message = 'Aún no hay quizzes registrados.';
    } else if (missing.length > 0) {
      message = `Nota final sobre ${breakdown.length} quizzes. Faltan las semanas ${missing.join(', ')}.`;
    } else {
      message = `Nota final de los ${breakdown.length} quizzes.`;
    }

    return { global, breakdown, message };
  }
}

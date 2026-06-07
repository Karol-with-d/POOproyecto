/**
 * ScoreCalculator — encapsula la lógica de cálculo de puntuaciones.
 * 
 * Nota POO (T-010): separación entre lógica de negocio y controlador.
 */
import type { UserScore } from '@prisma/client';

export class ScoreCalculator {
  /**
   * Calcula la nota global promedio de los 6 quiz.
   */
  calculateGlobal(scores: UserScore[]): { global: number; breakdown: { semanaId: string; score: number }[]; missing: number[] } {
    const quizScores = scores.filter((s) => s.type === 'quiz');

    // Agrupar por semanaId, tomar el último score de cada semana
    const semanaMap = new Map<string, number>();
    for (const score of quizScores) {
      semanaMap.set(score.semanaId, score.score);
    }

    const breakdown: { semanaId: string; score: number }[] = [];
    for (const [semanaId, score] of semanaMap.entries()) {
      breakdown.push({ semanaId, score });
    }

    const total = breakdown.reduce((sum, item) => sum + item.score, 0);
    const global = breakdown.length > 0 ? Math.round((total / breakdown.length) * 10) / 10 : 0;

    // Verificar semanas faltantes
    const allWeeks = [1, 2, 3, 4, 5, 6]; // Asumiendo semanas 1-6
    // TODO: mapear semanaId a número de semana para missing
    const missing: number[] = []; // Simplificado

    return { global, breakdown, missing };
  }

  /**
   * Valida que un score esté entre 0 y 100.
   */
  validateScore(score: number): boolean {
    return score >= 0 && score <= 100;
  }
}

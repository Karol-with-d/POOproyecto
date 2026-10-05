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
  calculateGlobal(
    scores: UserScore[],
    semanas: { id: string; number: number }[] = [],
  ): { global: number; breakdown: { semanaId: string; score: number }[]; missing: number[] } {
    const quizScores = scores.filter((s) => s.type === 'quiz');

    const semanaMap = new Map<string, number>();
    for (const score of quizScores) {
      semanaMap.set(score.semanaId, score.score);
    }

    const weeks = semanas
      .filter((semana) => semana.number >= 1 && semana.number <= 6)
      .sort((a, b) => a.number - b.number);

    if (weeks.length === 0) {
      const breakdown = [...semanaMap.entries()].map(([semanaId, score]) => ({ semanaId, score }));
      const total = breakdown.reduce((sum, item) => sum + item.score, 0);
      const global = breakdown.length > 0 ? Math.round((total / breakdown.length) * 10) / 10 : 0;
      return { global, breakdown, missing: [] };
    }

    const breakdown = weeks.map((semana) => ({
      semanaId: semana.id,
      score: semanaMap.get(semana.id) ?? 0,
    }));
    const total = breakdown.reduce((sum, item) => sum + item.score, 0);
    const global = Math.round((total / weeks.length) * 10) / 10;
    const missing = weeks.filter((semana) => !semanaMap.has(semana.id)).map((semana) => semana.number);

    return { global, breakdown, missing };
  }

  /**
   * Valida que un score esté entre 0 y 100.
   */
  validateScore(score: number): boolean {
    return score >= 0 && score <= 100;
  }
}

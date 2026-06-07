import { UserProgressModel } from '../models/UserProgressModel';
import { UserModel } from '../models/UserModel';
import { SemanaModel } from '../models/SemanaModel';
import { UserScoreModel } from '../models/UserScoreModel';
import { prisma } from '../config/prisma';

/**
 * ProgressService — lógica de negocio para progreso del usuario.
 * Combina datos de UserScore y UserProgress.
 * 
 * Nota POO (T-011): usa interfaces TypeScript para tipar respuestas.
 */
export interface ProgressResponse {
  semanaId: string;
  semanaNumber: number;
  completed: boolean;
  score: number | null;
  activitiesCompleted: number;
  totalActivities: number;
}

export class ProgressService {
  async getUserProgress(userId: string): Promise<ProgressResponse[]> {
    // Verificar que el usuario existe
    const user = await new UserModel(userId, '').findById(userId);
    if (!user) {
      throw new Error('Usuario no encontrado');
    }

    // Obtener todas las semanas
    const semanas = await new SemanaModel('', 0, '', '').findAll();

    // Obtener progreso y scores del usuario
    const progressRecords = await prisma.userProgress.findMany({
      where: { userId },
      include: { semana: true },
    });

    const scores = await new UserScoreModel('', userId, '', 0, '').findAll({ userId });

    // Construir respuesta por cada semana
    const result: ProgressResponse[] = [];
    for (const semana of semanas) {
      const progress = progressRecords.find((p) => p.semanaId === semana.id);
      const semanaScores = scores.filter((s) => s.semanaId === semana.id);
      const quizScore = semanaScores.find((s) => s.type === 'quiz');
      const activitiesCompleted = semanaScores.filter((s) => s.type === 'activity').length;
      const totalActivities = await prisma.activity.count({ where: { semanaId: semana.id } });

      result.push({
        semanaId: semana.id,
        semanaNumber: semana.number,
        completed: progress?.completed ?? false,
        score: quizScore?.score ?? null,
        activitiesCompleted,
        totalActivities,
      });
    }

    return result;
  }

  async markSemanaCompleted(userId: string, semanaId: string, score?: number): Promise<any> {
    // Verificar usuario
    const user = await new UserModel(userId, '').findById(userId);
    if (!user) {
      throw new Error('Usuario no encontrado');
    }

    return UserProgressModel.markSemanaCompleted(userId, semanaId, score);
  }
}

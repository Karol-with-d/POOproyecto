import { ActivityModel } from '../models/ActivityModel';
import { QuizQuestionModel } from '../models/QuizQuestionModel';
import { prisma } from '../config/prisma';
import type { Activity, QuizQuestion } from '@prisma/client';

/**
 * ActivityService — lógica de negocio para actividades y quiz.
 */
export class ActivityService {
  async findBySemanaId(semanaId: string): Promise<Activity[]> {
    return ActivityModel.findBySemanaId(semanaId);
  }

  async findQuizBySemanaId(semanaId: string): Promise<QuizQuestion[]> {
    return QuizQuestionModel.findBySemanaId(semanaId);
  }
}

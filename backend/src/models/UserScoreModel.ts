import { DatabaseModel } from './DatabaseModel';
import { prisma } from '../config/prisma';
import type { UserScore as PrismaUserScore } from '@prisma/client';

/**
 * UserScoreModel — representa una puntuación de usuario.
 */
export class UserScoreModel extends DatabaseModel<PrismaUserScore> {
  private userId: string;
  private semanaId: string;
  private activityId: string | null;
  private score: number;
  private type: string;

  constructor(
    id: string,
    userId: string,
    semanaId: string,
    score: number,
    type: string,
    activityId: string | null = null,
    createdAt: Date = new Date()
  ) {
    super(id, createdAt);
    this.userId = userId;
    this.semanaId = semanaId;
    this.score = score;
    this.type = type;
    this.activityId = activityId;
  }

  // --- Getters ---
  public getUserId(): string { return this.userId; }
  public getSemanaId(): string { return this.semanaId; }
  public getActivityId(): string | null { return this.activityId; }
  public getScore(): number { return this.score; }
  public getType(): string { return this.type; }

  public setScore(score: number): void {
    if (score < 0 || score > 100) {
      throw new Error('Score must be between 0 and 100');
    }
    this.score = score;
  }

  // --- CRUD ---
  async findById(id: string): Promise<PrismaUserScore | null> {
    return prisma.userScore.findUnique({ where: { id } });
  }

  async findAll(filters?: { userId?: string; semanaId?: string }): Promise<PrismaUserScore[]> {
    return prisma.userScore.findMany({
      where: {
        userId: filters?.userId,
        semanaId: filters?.semanaId,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async save(): Promise<PrismaUserScore> {
    return prisma.userScore.upsert({
      where: { id: this.id },
      update: { score: this.score, type: this.type, activityId: this.activityId },
      create: {
        id: this.id,
        userId: this.userId,
        semanaId: this.semanaId,
        activityId: this.activityId,
        score: this.score,
        type: this.type,
      },
    });
  }

  async delete(): Promise<void> {
    await prisma.userScore.delete({ where: { id: this.id } });
  }

  // --- Estático: upsert por actividad (evita duplicados) ---
  static async upsertForActivity(
    userId: string,
    semanaId: string,
    activityId: string | null,
    score: number,
    type: string
  ): Promise<PrismaUserScore> {
    // Si existe un score para la misma actividad, lo actualiza
    const existing = await prisma.userScore.findFirst({
      where: { userId, semanaId, activityId, type },
    });

    if (existing) {
      return prisma.userScore.update({
        where: { id: existing.id },
        data: { score },
      });
    }

    return prisma.userScore.create({
      data: { userId, semanaId, activityId, score, type },
    });
  }
}

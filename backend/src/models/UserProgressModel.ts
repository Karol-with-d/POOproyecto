import { DatabaseModel } from './DatabaseModel';
import { prisma } from '../config/prisma';
import type { UserProgress as PrismaUserProgress } from '@prisma/client';

/**
 * UserProgressModel — representa el progreso de un usuario en una semana.
 */
export class UserProgressModel extends DatabaseModel<PrismaUserProgress> {
  private userId: string;
  private semanaId: string;
  private completed: boolean;
  private globalScore: number | null;
  private completedAt: Date | null;

  constructor(
    id: string,
    userId: string,
    semanaId: string,
    completed: boolean = false,
    globalScore: number | null = null,
    completedAt: Date | null = null,
    createdAt: Date = new Date()
  ) {
    super(id, createdAt);
    this.userId = userId;
    this.semanaId = semanaId;
    this.completed = completed;
    this.globalScore = globalScore;
    this.completedAt = completedAt;
  }

  // --- Getters ---
  public getUserId(): string { return this.userId; }
  public getSemanaId(): string { return this.semanaId; }
  public isCompleted(): boolean { return this.completed; }
  public getGlobalScore(): number | null { return this.globalScore; }
  public getCompletedAt(): Date | null { return this.completedAt; }

  // --- Setters ---
  public markCompleted(score?: number): void {
    this.completed = true;
    this.completedAt = new Date();
    if (score !== undefined) this.globalScore = score;
  }

  // --- CRUD ---
  async findById(id: string): Promise<PrismaUserProgress | null> {
    return prisma.userProgress.findUnique({ where: { id } });
  }

  async findAll(filters?: { userId?: string }): Promise<PrismaUserProgress[]> {
    return prisma.userProgress.findMany({
      where: { userId: filters?.userId },
      include: { semana: true },
    });
  }

  async save(): Promise<PrismaUserProgress> {
    return prisma.userProgress.upsert({
      where: { id: this.id },
      update: {
        completed: this.completed,
        globalScore: this.globalScore,
        completedAt: this.completedAt,
      },
      create: {
        id: this.id,
        userId: this.userId,
        semanaId: this.semanaId,
        completed: this.completed,
        globalScore: this.globalScore,
        completedAt: this.completedAt,
      },
    });
  }

  async delete(): Promise<void> {
    await prisma.userProgress.delete({ where: { id: this.id } });
  }

  // --- Estático: buscar o crear ---
  static async findOrCreate(userId: string, semanaId: string): Promise<PrismaUserProgress> {
    const existing = await prisma.userProgress.findUnique({
      where: { userId_semanaId: { userId, semanaId } },
    });

    if (existing) return existing;

    return prisma.userProgress.create({
      data: { userId, semanaId, completed: false },
    });
  }

  static async markSemanaCompleted(userId: string, semanaId: string, score?: number): Promise<PrismaUserProgress> {
    const progress = await this.findOrCreate(userId, semanaId);
    return prisma.userProgress.update({
      where: { id: progress.id },
      data: {
        completed: true,
        completedAt: new Date(),
        globalScore: score ?? progress.globalScore,
      },
    });
  }
}

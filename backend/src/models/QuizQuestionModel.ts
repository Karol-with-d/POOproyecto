import { DatabaseModel } from './DatabaseModel';
import { prisma } from '../config/prisma';
import type { QuizQuestion as PrismaQuizQuestion } from '@prisma/client';

/**
 * QuizQuestionModel — representa una pregunta del quiz.
 */
export class QuizQuestionModel extends DatabaseModel<PrismaQuizQuestion> {
  private semanaId: string;
  private question: string;
  private type: string;
  private order: number;

  constructor(
    id: string,
    semanaId: string,
    question: string,
    type: string,
    order: number,
    createdAt: Date = new Date()
  ) {
    super(id, createdAt);
    this.semanaId = semanaId;
    this.question = question;
    this.type = type;
    this.order = order;
  }

  // --- Getters ---
  public getSemanaId(): string { return this.semanaId; }
  public getQuestion(): string { return this.question; }
  public getType(): string { return this.type; }
  public getOrder(): number { return this.order; }

  // --- CRUD ---
  async findById(id: string): Promise<PrismaQuizQuestion | null> {
    return prisma.quizQuestion.findUnique({ where: { id }, include: { options: true } });
  }

  async findAll(filters?: { semanaId?: string }): Promise<PrismaQuizQuestion[]> {
    return prisma.quizQuestion.findMany({
      where: filters?.semanaId ? { semanaId: filters.semanaId } : undefined,
      orderBy: { order: 'asc' },
      include: { options: true },
    });
  }

  async save(): Promise<PrismaQuizQuestion> {
    return prisma.quizQuestion.upsert({
      where: { id: this.id },
      update: { question: this.question, type: this.type, order: this.order },
      create: { id: this.id, semanaId: this.semanaId, question: this.question, type: this.type, order: this.order },
    });
  }

  async delete(): Promise<void> {
    await prisma.quizQuestion.delete({ where: { id: this.id } });
  }

  // --- Estático: preguntas por semana con opciones ---
  static async findBySemanaId(semanaId: string): Promise<PrismaQuizQuestion[]> {
    return prisma.quizQuestion.findMany({
      where: { semanaId },
      orderBy: { order: 'asc' },
      include: { options: true },
    });
  }
}

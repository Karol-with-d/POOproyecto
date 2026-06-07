import { DatabaseModel } from './DatabaseModel';
import { prisma } from '../config/prisma';
import type { Activity as PrismaActivity } from '@prisma/client';

/**
 * ActivityModel — representa una actividad dentro de una semana.
 */
export class ActivityModel extends DatabaseModel<PrismaActivity> {
  private semanaId: string;
  private type: string;
  private title: string;
  private order: number;
  private config: Record<string, unknown> | null;

  constructor(
    id: string,
    semanaId: string,
    type: string,
    title: string,
    order: number,
    config: Record<string, unknown> | null = null,
    createdAt: Date = new Date()
  ) {
    super(id, createdAt);
    this.semanaId = semanaId;
    this.type = type;
    this.title = title;
    this.order = order;
    this.config = config;
  }

  // --- Getters ---
  public getSemanaId(): string { return this.semanaId; }
  public getType(): string { return this.type; }
  public getTitle(): string { return this.title; }
  public getOrder(): number { return this.order; }

  // --- CRUD ---
  async findById(id: string): Promise<PrismaActivity | null> {
    return prisma.activity.findUnique({ where: { id } });
  }

  async findAll(filters?: { semanaId?: string }): Promise<PrismaActivity[]> {
    return prisma.activity.findMany({
      where: filters?.semanaId ? { semanaId: filters.semanaId } : undefined,
      orderBy: { order: 'asc' },
    });
  }

  async save(): Promise<PrismaActivity> {
    return prisma.activity.upsert({
      where: { id: this.id },
      update: { type: this.type, title: this.title, order: this.order, config: this.config as any },
      create: { id: this.id, semanaId: this.semanaId, type: this.type, title: this.title, order: this.order, config: this.config as any },
    });
  }

  async delete(): Promise<void> {
    await prisma.activity.delete({ where: { id: this.id } });
  }

  // --- Estático: actividades por semana ---
  static async findBySemanaId(semanaId: string): Promise<PrismaActivity[]> {
    return prisma.activity.findMany({
      where: { semanaId },
      orderBy: { order: 'asc' },
    });
  }
}

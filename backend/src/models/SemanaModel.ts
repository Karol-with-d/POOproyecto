import { DatabaseModel } from './DatabaseModel';
import { prisma } from '../config/prisma';
import type { Semana as PrismaSemana } from '@prisma/client';

/**
 * SemanaModel — representa una semana del programa.
 */
export class SemanaModel extends DatabaseModel<PrismaSemana> {
  private number: number;
  private title: string;
  private description: string | null;
  private topic: string;

  constructor(
    id: string,
    number: number,
    title: string,
    topic: string,
    description: string | null = null,
    createdAt: Date = new Date()
  ) {
    super(id, createdAt);
    this.number = number;
    this.title = title;
    this.topic = topic;
    this.description = description;
  }

  // --- Getters / Setters (encapsulación) ---
  public getNumber(): number { return this.number; }
  public getTitle(): string { return this.title; }
  public getTopic(): string { return this.topic; }
  public getDescription(): string | null { return this.description; }

  // --- CRUD ---
  async findById(id: string): Promise<PrismaSemana | null> {
    return prisma.semana.findUnique({ where: { id } });
  }

  async findAll(): Promise<PrismaSemana[]> {
    return prisma.semana.findMany({ orderBy: { number: 'asc' } });
  }

  async save(): Promise<PrismaSemana> {
    return prisma.semana.upsert({
      where: { id: this.id },
      update: { title: this.title, description: this.description, topic: this.topic },
      create: { id: this.id, number: this.number, title: this.title, description: this.description, topic: this.topic },
    });
  }

  async delete(): Promise<void> {
    await prisma.semana.delete({ where: { id: this.id } });
  }

  // --- Estático: buscar por número de semana ---
  static async findByNumber(number: number): Promise<PrismaSemana | null> {
    return prisma.semana.findUnique({ where: { number } });
  }
}

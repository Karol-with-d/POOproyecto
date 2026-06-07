import { DatabaseModel } from './DatabaseModel';
import { prisma } from '../config/prisma';
import type { User as PrismaUser } from '@prisma/client';

/**
 * UserModel — representa un usuario en el sistema.
 * Hereda de DatabaseModel (abstracción + herencia).
 */
export class UserModel extends DatabaseModel<PrismaUser> {
  private randomName: string;

  constructor(id: string, randomName: string, createdAt: Date = new Date()) {
    super(id, createdAt);
    this.randomName = randomName;
  }

  // --- Encapsulación ---
  public getRandomName(): string {
    return this.randomName;
  }

  public setRandomName(name: string): void {
    this.randomName = name;
  }

  // --- CRUD (polimorfismo: implementación específica de User) ---
  async findById(id: string): Promise<PrismaUser | null> {
    return prisma.user.findUnique({ where: { id } });
  }

  async findAll(filters?: { limit?: number; offset?: number }): Promise<PrismaUser[]> {
    return prisma.user.findMany({
      take: filters?.limit,
      skip: filters?.offset,
      orderBy: { createdAt: 'desc' },
    });
  }

  async save(): Promise<PrismaUser> {
    return prisma.user.upsert({
      where: { id: this.id },
      update: { randomName: this.randomName },
      create: { id: this.id, randomName: this.randomName },
    });
  }

  async delete(): Promise<void> {
    await prisma.user.delete({ where: { id: this.id } });
  }

  // --- Métodos estáticos de negocio ---
  static async createRandomName(): Promise<string> {
    const adjetivos = ['Cielo', 'Fuerte', 'Rapido', 'Brillante', 'Valiente', 'Amable', 'Listo', 'Tierno'];
    const animales = ['Leon', 'Tigre', 'Pinguino', 'Elefante', 'Jirafa', 'Koala', 'Delfin', 'Aguila'];
    const numero = Math.floor(100 + Math.random() * 900); // 100-999

    const adj = adjetivos[Math.floor(Math.random() * adjetivos.length)];
    const animal = animales[Math.floor(Math.random() * animales.length)];
    return `${adj}${animal}${numero}`;
  }

  static async create(userData: { randomName: string }): Promise<PrismaUser> {
    return prisma.user.create({ data: userData });
  }
}

import { prisma } from '../config/prisma';

/**
 * Clase abstracta DatabaseModel — base para todos los modelos del sistema.
 * 
 * Nota POO (T-003 / T-006):
 * - Encapsulación: propiedades protected, acceso controlado.
 * - Herencia: todas las clases modelo extienden esta base.
 * - Abstracción: define la interfaz común CRUD sin implementar detalles específicos.
 * - Polimorfismo: cada subclase sobrescribe los métodos según su tabla.
 * 
 * @template T Tipo de la entidad Prisma asociada
 */
export abstract class DatabaseModel<T> {
  protected id: string;
  protected createdAt: Date;

  constructor(id: string, createdAt: Date = new Date()) {
    this.id = id;
    this.createdAt = createdAt;
  }

  // --- Getters (encapsulación) ---
  public getId(): string {
    return this.id;
  }

  public getCreatedAt(): Date {
    return this.createdAt;
  }

  // --- CRUD abstractos (polimorfismo en subclases) ---
  abstract findById(id: string): Promise<T | null>;
  abstract findAll(filters?: object): Promise<T[]>;
  abstract save(): Promise<T>;
  abstract delete(): Promise<void>;

  // --- Prisma Client accesible para subclases ---
  protected static getPrisma() {
    return prisma;
  }
}

import { UserModel } from '../models/UserModel';
import { prisma } from '../config/prisma';
import type { User } from '@prisma/client';

/**
 * UserService — lógica de negocio para usuarios.
 * Usa UserModel para operaciones de BD.
 */
export class UserService {
  /**
   * Crea un usuario con nombre aleatorio.
   */
  async createRandomUser(): Promise<User> {
    const randomName = await UserModel.createRandomName();
    return UserModel.create({ randomName });
  }

  /**
   * Busca un usuario por ID.
   */
  async findById(id: string): Promise<User | null> {
    const model = new UserModel(id, '');
    return model.findById(id);
  }

  /**
   * Lista todos los usuarios.
   */
  async findAll(): Promise<User[]> {
    return prisma.user.findMany({ orderBy: { createdAt: 'desc' } });
  }
}

import { UserModel } from '../models/UserModel';
import { prisma } from '../config/prisma';
import type { User } from '@prisma/client';
import { Logger } from '../utils/logger';

/**
 * UserService — lógica de negocio para usuarios.
 * Usa UserModel para operaciones de BD.
 */
export class UserService {
  private logger = new Logger('UserService');

  /**
   * Crea un usuario con el nombre proporcionado.
   * Si no se proporciona nombre, genera uno aleatorio.
   */
  async createUser(randomName?: string): Promise<User> {
    this.logger.info('createUser iniciado', { randomName });
    const name = randomName?.trim() || await UserModel.createRandomName();
    this.logger.debug('Nombre final para crear usuario', { name });
    const user = await UserModel.create({ randomName: name });
    this.logger.info('createUser completado', { userId: user.id });
    return user;
  }

  /**
   * Busca un usuario por ID.
   */
  async findById(id: string): Promise<User | null> {
    this.logger.info('findById iniciado', { id });
    const model = new UserModel(id, '');
    const user = await model.findById(id);
    this.logger.info('findById completado', { id, found: !!user });
    return user;
  }

  /**
   * Lista todos los usuarios.
   */
  async findAll(): Promise<User[]> {
    this.logger.info('findAll iniciado');
    const users = await prisma.user.findMany({ orderBy: { createdAt: 'desc' } });
    this.logger.info('findAll completado', { count: users.length });
    return users;
  }
}

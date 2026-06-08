import { Request, Response } from 'express';
import { BaseController } from './BaseController';
import { UserService } from '../services/UserService';

/**
 * UserController — maneja los endpoints de usuario.
 * Inyecta UserService en el constructor (inyección de dependencias).
 *
 * Nota POO: separación de responsabilidades.
 */
export class UserController extends BaseController {
  private userService: UserService;

  constructor(userService: UserService) {
    super('UserController');
    this.userService = userService;
  }

  /**
   * POST /api/users
   * Crea un usuario con el nombre proporcionado por el niño.
   * Si no se envía nombre, genera uno aleatorio como fallback.
   */
  async create(req: Request, res: Response): Promise<void> {
    this.logger.info('POST /api/users — body recibido', { body: req.body });
    try {
      const { randomName } = req.body;
      this.logger.debug('Creando usuario', { randomName });
      const user = await this.userService.createUser(randomName);
      this.logger.info('Usuario creado exitosamente', { userId: user.id });
      this.sendSuccess(res, user, 201);
    } catch (error) {
      this.logger.error('Error en POST /api/users', { error, body: req.body });
      this.sendError(res, 'Error al crear usuario', 500, error);
    }
  }

  /**
   * GET /api/users/:id
   * Obtiene un usuario por ID.
   */
  async getById(req: Request, res: Response): Promise<void> {
    this.logger.info('GET /api/users/:id', { params: req.params });
    try {
      const { id } = req.params;
      const user = await this.userService.findById(id);
      if (!user) {
        this.logger.warn('Usuario no encontrado', { id });
        this.sendNotFound(res, 'Usuario no encontrado');
        return;
      }
      this.sendSuccess(res, user);
    } catch (error) {
      this.logger.error('Error en GET /api/users/:id', { error, params: req.params });
      this.sendError(res, 'Error al buscar usuario', 500, error);
    }
  }
}

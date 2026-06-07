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
    super();
    this.userService = userService;
  }

  /**
   * POST /api/users
   * Crea un usuario con el nombre proporcionado por el niño.
   * Si no se envía nombre, genera uno aleatorio como fallback.
   */
  async create(req: Request, res: Response): Promise<void> {
    try {
      const { randomName } = req.body;
      const user = await this.userService.createUser(randomName);
      this.sendSuccess(res, user, 201);
    } catch (error) {
      this.sendError(res, 'Error al crear usuario', 500);
    }
  }

  /**
   * GET /api/users/:id
   * Obtiene un usuario por ID.
   */
  async getById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const user = await this.userService.findById(id);
      if (!user) {
        this.sendNotFound(res, 'Usuario no encontrado');
        return;
      }
      this.sendSuccess(res, user);
    } catch (error) {
      this.sendError(res, 'Error al buscar usuario', 500);
    }
  }
}

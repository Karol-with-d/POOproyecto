import { Request, Response } from 'express';
import { BaseController } from './BaseController';
import { UserService } from '../services/UserService';

/**
 * UserController — maneja los endpoints de usuario.
 * Inyecta UserService en el constructor (inyección de dependencias).
 * 
 * Nota POO (T-008): separación de responsabilidades.
 */
export class UserController extends BaseController {
  private userService: UserService;

  constructor(userService: UserService) {
    super();
    this.userService = userService;
  }

  /**
   * POST /api/users/random
   * Genera un usuario con nombre aleatorio y lo persiste.
   */
  async createRandom(req: Request, res: Response): Promise<void> {
    try {
      const user = await this.userService.createRandomUser();
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

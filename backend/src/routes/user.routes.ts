import { Router } from 'express';
import { UserController } from '../controllers/UserController';
import { UserService } from '../services/UserService';

const router = Router();

// Inyección de dependencias
const userService = new UserService();
const userController = new UserController(userService);

// POST /api/users/random — genera usuario con nombre aleatorio
router.post('/random', (req, res) => userController.createRandom(req, res));

// GET /api/users/:id — detalle de usuario
router.get('/:id', (req, res) => userController.getById(req, res));

export default router;

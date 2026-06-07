import { Router } from 'express';
import { ProgressController } from '../controllers/ProgressController';
import { ProgressService } from '../services/ProgressService';

const router = Router();

// Inyección de dependencias
const progressService = new ProgressService();
const progressController = new ProgressController(progressService);

// GET /api/users/:userId/progress — progreso del usuario
router.get('/users/:userId/progress', (req, res) => progressController.getProgress(req, res));

// PATCH /api/users/:userId/progress/semana/:semanaId — marca como completada
router.patch('/users/:userId/progress/semana/:semanaId', (req, res) => progressController.markCompleted(req, res));

export default router;

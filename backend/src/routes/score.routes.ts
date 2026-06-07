import { Router } from 'express';
import { ScoreController } from '../controllers/ScoreController';
import { ScoreService } from '../services/ScoreService';

const router = Router();

// Inyección de dependencias
const scoreService = new ScoreService();
const scoreController = new ScoreController(scoreService);

// POST /api/scores — guarda o actualiza un score
router.post('/', (req, res) => scoreController.create(req, res));

// GET /api/users/:userId/scores — todos los scores de un usuario
router.get('/users/:userId/scores', (req, res) => scoreController.getByUser(req, res));

// GET /api/users/:userId/scores/semana/:semanaId — scores por semana
router.get('/users/:userId/scores/semana/:semanaId', (req, res) => scoreController.getByUserAndSemana(req, res));

// GET /api/users/:userId/global-score — nota global
router.get('/users/:userId/global-score', (req, res) => scoreController.getGlobalScore(req, res));

export default router;

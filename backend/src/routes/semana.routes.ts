import { Router } from 'express';
import { SemanaController } from '../controllers/SemanaController';
import { ActivityController } from '../controllers/ActivityController';
import { SemanaService } from '../services/SemanaService';
import { ActivityService } from '../services/ActivityService';

const router = Router();

// Inyección de dependencias
const semanaService = new SemanaService();
const activityService = new ActivityService();
const semanaController = new SemanaController(semanaService);
const activityController = new ActivityController(activityService);

// GET /api/semanas — lista las 6 semanas
router.get('/', (req, res) => semanaController.getAll(req, res));

// GET /api/semanas/:id — detalle de una semana
router.get('/:id', (req, res) => semanaController.getById(req, res));

// GET /api/semanas/:id/activities — actividades en orden
router.get('/:id/activities', (req, res) => activityController.getBySemana(req, res));

// GET /api/semanas/:id/quiz — preguntas del quiz con opciones
router.get('/:id/quiz', async (req, res) => {
  try {
    const { id } = req.params;
    const questions = await activityService.findQuizBySemanaId(id);
    res.status(200).json({ status: 'ok', data: questions });
  } catch (error) {
    res.status(500).json({ status: 'error', message: 'Error al obtener quiz' });
  }
});

export default router;

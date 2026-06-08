import express, { Application, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import morgan from 'morgan';
import { Logger } from '../utils/logger';

// Rutas de la API
import userRoutes from '../routes/user.routes';
import semanaRoutes from '../routes/semana.routes';
import scoreRoutes from '../routes/score.routes';
import progressRoutes from '../routes/progress.routes';

/**
 * Clase App — encapsula la inicialización y configuración del servidor Express.
 * Recibe el puerto como parámetro en el constructor (inyección de configuración).
 * 
 * Patrón: POO — encapsulación de la lógica de servidor.
 */
export class App {
  public app: Application;
  private port: number;

  constructor(port: number) {
    this.app = express();
    this.port = port;

    this.loadEnvironment();
    this.initializeMiddlewares();
    this.initializeRoutes();
    this.initializeErrorHandling();
  }

  /**
   * Carga las variables de entorno desde .env
   */
  private loadEnvironment(): void {
    dotenv.config();
  }

  /**
   * Registra middlewares globales: CORS, JSON parser, etc.
   */
  private initializeMiddlewares(): void {
    const appLogger = new Logger('App');

    // Logging de peticiones HTTP
    this.app.use(
      morgan((tokens, req, res) => {
        return [
          `[${new Date().toISOString()}]`,
          `[HTTP]`,
          tokens.method(req, res),
          tokens.url(req, res),
          tokens.status(req, res),
          tokens['response-time'](req, res) + 'ms',
          '-',
          tokens['remote-addr'](req, res),
        ].join(' ');
      })
    );

    // CORS configurado para aceptar peticiones del frontend
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
    this.app.use(
      cors({
        origin: frontendUrl,
        credentials: false, // sin sesiones ni tokens (restricción global)
      })
    );
    appLogger.info('CORS habilitado para', { frontendUrl });

    // Parseo de JSON
    this.app.use(express.json());
  }

  /**
   * Registra las rutas de la API.
   */
  private initializeRoutes(): void {
    // Health check — responde 200
    this.app.get('/api/health', (_req: Request, res: Response) => {
      res.status(200).json({
        status: 'ok',
        timestamp: new Date().toISOString(),
        service: 'plataforma-ciencias-backend',
      });
    });

    // Rutas de la API
    this.app.use('/api/users', userRoutes);
    this.app.use('/api/semanas', semanaRoutes);
    this.app.use('/api/scores', scoreRoutes);
    this.app.use('/api', progressRoutes);
  }

  /**
   * Middleware de manejo de errores global.
   */
  private initializeErrorHandling(): void {
    const errorLogger = new Logger('ErrorHandler');

    this.app.use((err: Error, req: Request, res: Response, _next: NextFunction) => {
      errorLogger.error('Error no capturado', {
        message: err.message,
        stack: err.stack,
        url: req.originalUrl,
        method: req.method,
        body: req.body,
      });
      res.status(500).json({
        status: 'error',
        message: 'Error interno del servidor',
      });
    });

    // 404 — ruta no encontrada
    this.app.use((req: Request, res: Response) => {
      errorLogger.warn('Ruta no encontrada', { method: req.method, url: req.originalUrl });
      res.status(404).json({
        status: 'error',
        message: 'Recurso no encontrado',
      });
    });
  }

  /**
   * Inicia el servidor en el puerto configurado.
   */
  public start(): void {
    this.app.listen(this.port, () => {
      console.log(`🚀 Servidor corriendo en http://localhost:${this.port}`);
      console.log(`🩺 Health check: http://localhost:${this.port}/api/health`);
      console.log(`🌐 CORS habilitado para: ${process.env.FRONTEND_URL || 'http://localhost:5173'}`);
    });
  }
}

import 'dotenv/config';
import { App } from './config/App';

// Puerto configurable vía variable de entorno, con fallback a 3000
const PORT = parseInt(process.env.PORT || '3000', 10);

// Instancia de App con inyección de puerto
const app = new App(PORT);

// Iniciar servidor
app.start();

# Plataforma de Aprendizaje - Ciencias Unidad 1

> UNIVO · Ingeniería en Desarrollo de Software · POO Parcial III · 2026

Plataforma interactiva de ciencias para estudiantes de primaria. Contenido dividido en 6 semanas con actividades táctiles (tap, swipe, drag), sin requerir escritura por parte del usuario.

## Estructura del Proyecto

```
/
├── backend/          # API REST con Express + TypeScript
│   └── src/
│       ├── controllers/
│       ├── models/
│       ├── routes/
│       ├── services/
│       ├── middlewares/
│       └── config/
├── frontend/         # React + Vite + TypeScript + Tailwind
│   └── src/
│       ├── components/
│       ├── pages/
│       ├── services/
│       ├── models/
│       └── hooks/
```

## Instalación

### Backend

```bash
cd backend
npm install
npm run dev
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

## Restricciones Globales

- Sin sesiones ni tokens de seguridad: usuarios identificados por nombre aleatorio.
- Sin tipeo: toda interacción es táctil (tap, swipe, drag).
- Diseño responsive: PC, tablet y smartphone.
- Paleta de colores tranquila y no estimulante.
- Estilos, personajes e ilustraciones originales.

## Sprint 0

- [x] T-001: Inicializar repositorio y estructura
- [ ] T-002: Configurar Express + TypeScript
- [ ] T-003: Configurar base de datos MySQL y ORM
- [ ] T-004: Configurar proyecto frontend

---
*Equipo de desarrollo POO 2026*

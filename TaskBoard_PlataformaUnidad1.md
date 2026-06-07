# Task Board — Plataforma de Aprendizaje
## Ciencias Unidad 1 · UNIVO · POO Parcial III · 2026

---

| Total tareas | P1 — Críticas | P2 — Importantes | Fecha límite |
|:---:|:---:|:---:|:---:|
| 44 | 34 | 10 | 12 de julio |

---

## Plan de Sprints

| Sprint | Semana | Tareas | Entregable |
|--------|--------|--------|------------|
| Sprint 0 | Semana 1 | T-001, T-002, T-003, T-004 | Backend + Frontend corriendo. BD creada. |
| Sprint 1 | Semana 2 | T-005, T-006, T-007, T-008, T-009, T-010, T-011 | Data model completo. Todos los endpoints de API funcionando. |
| Sprint 2 | Semana 3 | T-012, T-013, T-014, T-015, T-016, T-017 | Frontend shell completo. Layout, home, quiz base. |
| Sprint 3 | Semana 4 | T-018 → T-026 | Actividades de Semana 1 y Semana 2 completas. |
| Sprint 4 | Semana 5 | T-027 → T-033 | Actividades de Semana 3 y Semana 4 completas. |
| Sprint 5 | Semana 6 | T-034 → T-041 | Actividades de Semana 5 y Semana 6 completas. |
| Sprint 6 | Semana 7 | T-042, T-043, T-044 | Ojo al dato, responsividad, documento de investigación. |

---

## Épica: Setup

---

### ✅ T-001 · Inicializar repositorio y estructura del proyecto
`P1` · Depende de: —

**Descripción**
Crear el repositorio Git con dos carpetas principales: `/backend` y `/frontend`. Configurar `.gitignore`, `README.md` y estructura MVC en el backend.

Estructura backend esperada:
```
/src
  /controllers
  /models
  /routes
  /services
  /middlewares
  /config
tsconfig.json
package.json
```

**Criterios de aceptación**
- Repositorio inicializado y accesible por todo el equipo
- Estructura de carpetas MVC creada
- `tsconfig.json` configurado con strict mode
- `.gitignore` ignora `node_modules`, `.env` y `dist`
- README con instrucciones básicas de instalación

**Nota POO**
La estructura MVC ya aplica separación de responsabilidades. Los modelos serán clases TypeScript con propiedades encapsuladas y métodos CRUD. Preparar para herencia en T-006.

---

### ✅ T-002 · Configurar Express + TypeScript en el backend
`P1` · Depende de: T-001

**Descripción**
Instalar y configurar Express con TypeScript. Crear el servidor principal con middlewares globales.

Dependencias requeridas:
```
express, typescript, ts-node, nodemon
cors, dotenv, express-validator
@types/express, @types/node, @types/cors
```

**Criterios de aceptación**
- Servidor corre en puerto configurable vía `.env`
- CORS configurado para aceptar peticiones del frontend
- Ruta de health check `GET /api/health` responde 200
- Nodemon reinicia el servidor al detectar cambios
- Variables de entorno cargadas desde `.env`

**Nota POO**
Crear clase `App` que encapsula la inicialización del servidor Express, registro de rutas y middlewares. El constructor recibe el puerto como parámetro.

---

### ✅ T-003 · Configurar base de datos MySQL y ORM
`P1` · Depende de: T-001

**Descripción**
Instalar y configurar Prisma ORM con MySQL. Crear el schema inicial con todas las tablas del proyecto.

Tablas a crear: `users`, `semanas`, `activities`, `quiz_questions`, `quiz_options`, `user_scores`, `user_progress`

**Criterios de aceptación**
- Conexión a MySQL funcional vía variable `DATABASE_URL` en `.env`
- Migración inicial ejecuta sin errores
- Prisma Client generado correctamente
- Seed script carga datos iniciales de las 6 semanas
- Tablas verificadas en MySQL Workbench o similar

**Nota POO**
Crear clase base `DatabaseModel` con métodos estáticos `findById`, `findAll`, `create`, `update`, `delete`. Todos los modelos del proyecto heredan de esta clase.

---

### ✅ T-004 · Configurar proyecto frontend
`P1` · Depende de: T-001

**Descripción**
Inicializar el proyecto frontend con el framework elegido. Configurar Tailwind CSS o DaisyUI. Definir la paleta de colores oficial.

Paleta propuesta (tranquila, no estimulante):
- Primario: `#2E86AB` (azul sereno)
- Secundario: `#A8DADC` (celeste suave)
- Fondo: `#F1FAEE` (blanco verdoso)
- Acento: `#457B9D` (azul medio)
- Texto: `#1D3557` (azul oscuro)

**Criterios de aceptación**
- Proyecto corre en localhost con hot reload
- Tailwind/DaisyUI configurado y funcionando
- Paleta de colores definida como variables CSS o tokens
- Componente de prueba renderiza en PC (1200px), tablet (768px) y mobile (375px)
- Estructura de carpetas por feature creada

**Nota POO**
En Angular: crear servicios como clases inyectables. En React/Vue: usar clases para modelos de datos en el estado global.

---

## Épica: Data Model

---

### ✅ T-005 · Definir y migrar schema completo de base de datos
`P1` · Depende de: T-003

**Descripción**
Crear el schema completo en Prisma con todas las relaciones.

```prisma
User:         { id, randomName, createdAt }
Semana:       { id, number, title, description, topic }
Activity:     { id, semanaId, type, title, order, config(JSON) }
QuizQuestion: { id, semanaId, question, type, order }
QuizOption:   { id, questionId, text, isCorrect }
UserScore:    { id, userId, semanaId, activityId?, score, type, createdAt }
UserProgress: { id, userId, semanaId, completed, globalScore, completedAt }
```

**Criterios de aceptación**
- Todas las tablas creadas sin errores en la migración
- Relaciones con FK correctas (CASCADE en eliminación)
- Campos nullable marcados explícitamente
- Índices en `userId`, `semanaId` para consultas rápidas
- Schema documentado con comentarios

**Nota POO**
Cada tabla corresponde a una clase modelo. Las relaciones (1:N, N:M) se expresan mediante composición entre clases. `User` tiene una colección de `UserScore`.

---

### ✅ T-006 · Crear clases modelo con herencia (núcleo POO)
`P1` · Depende de: T-005

**Descripción**
Implementar jerarquía de clases para todos los modelos del sistema.

```typescript
abstract class BaseModel {
  id: string
  createdAt: Date
  abstract findById(id: string): Promise<T>
  abstract findAll(filters: object): Promise<T[]>
  abstract save(): Promise<T>
  abstract delete(): Promise<void>
}

class UserModel extends BaseModel { ... }
class SemanaModel extends BaseModel { ... }
class ActivityModel extends BaseModel { ... }
class ScoreModel extends BaseModel { ... }
class QuizModel extends BaseModel { ... }
```

**Criterios de aceptación**
- Clase `BaseModel` abstracta con métodos genéricos implementados
- Cada subclase sobreescribe métodos necesarios (polimorfismo)
- Propiedades privadas con getters/setters (encapsulación)
- Tipos TypeScript estrictos en todos los métodos
- Tests unitarios básicos para cada clase modelo

**Nota POO**
Este es el núcleo de POO del proyecto. Debe demostrar: herencia (`BaseModel` → subclases), encapsulación (`private`/`protected`), polimorfismo (override de métodos), abstracción (clase abstracta `BaseModel`).

---

### ✅ T-007 · Crear seed de datos iniciales
`P1` · Depende de: T-005

**Descripción**
Crear script que puebla la BD con todos los datos estáticos del proyecto: 6 semanas, actividades de cada semana con configuración en JSON, preguntas y opciones de quiz, datos del Ojo al dato.

**Criterios de aceptación**
- Script ejecuta con `npm run seed` sin errores
- Las 6 semanas existen en BD
- Cada semana tiene mínimo sus actividades registradas
- Cada semana tiene mínimo 5 preguntas de quiz
- Script es idempotente (puede correrse múltiples veces)

**Nota POO**
Crear clase `SeedService` con método `run()` que use los modelos para insertar datos. Demuestra uso de instancias de clase para operaciones de negocio.

---

## Épica: Backend API

---

### ✅ T-009 · Endpoints: Semanas y actividades
`P1` · Depende de: T-006

**Descripción**
```
GET /api/semanas              → Lista las 6 semanas
GET /api/semanas/:id          → Detalle de una semana
GET /api/semanas/:id/activities → Actividades en orden
GET /api/semanas/:id/quiz     → Preguntas del quiz
```

**Criterios de aceptación**
- `GET /semanas` retorna las 6 semanas ordenadas por número
- `GET /semanas/:id` retorna 404 si no existe
- `GET /activities` retorna actividades ordenadas por campo `order`
- `GET /quiz` retorna preguntas con sus opciones incluidas
- Todos los endpoints responden en menos de 300ms

**Nota POO**
Crear `SemanaController` y `ActivityController` como clases separadas. Ambas heredan de `BaseController` que maneja el envío de respuestas y manejo de errores común.

---

### ✅ T-010 · Endpoints: Guardar y consultar scores
`P1` · Depende de: T-008

**Descripción**
```
POST /api/scores
  Body: { userId, semanaId, activityId?, score, type }

GET /api/users/:userId/scores
GET /api/users/:userId/scores/semana/:semanaId
GET /api/users/:userId/global-score
```

**Criterios de aceptación**
- `POST /scores` persiste el score correctamente en BD
- Score acepta valor entre 0 y 100
- `GET /global-score` calcula promedio de los 6 quiz scores
- Si faltan semanas, el cálculo lo indica claramente
- Endpoint no permite `userId` inexistente (valida con 404)
- Score duplicado para misma actividad sobreescribe el anterior

**Nota POO**
Crear clase `ScoreCalculator` con método `calculateGlobal(scores[])` que encapsula la lógica de cálculo. `ScoreController` usa `ScoreCalculator` como dependencia. Demuestra separación entre lógica de negocio y controlador.

---

### ✅ T-011 · Endpoint: Progreso del usuario
`P1` · Depende de: T-010

**Descripción**
```
GET /api/users/:userId/progress
  Respuesta: [{ semanaId, semanaNumber, completed, score, activitiesCompleted, totalActivities }]

PATCH /api/users/:userId/progress/semana/:semanaId
  → Marcar semana como completada
```

**Criterios de aceptación**
- `GET /progress` retorna una entrada por cada semana
- Campo `completed` es `true` solo si el quiz fue aprobado
- `activitiesCompleted` cuenta cuántas actividades tienen score
- `PATCH` actualiza estado de completado correctamente
- Responde con el progreso actualizado

**Nota POO**
Crear clase `ProgressService` que combina datos de `UserScore` y `UserProgress` para calcular el estado. Usar interfaces TypeScript para tipar los objetos de respuesta.

---

## Épica: Frontend Shell

---

### T-012 · Layout principal y navegación
`P1` · Depende de: T-004

**Descripción**
Crear el layout base:
- Header con logo/nombre de la plataforma y nombre del usuario random
- Barra de progreso de 6 semanas con estado visual
- Área de contenido principal
- Footer minimalista

**Criterios de aceptación**
- Layout se adapta a PC (1200px+), tablet (768px) y mobile (375px)
- Header visible en todas las pantallas
- Barra de progreso actualiza estado en tiempo real
- Nombre de usuario visible en header
- Navegación entre semanas es intuitiva para niños

**Nota POO**
Crear servicio `UserSessionService` que gestiona el usuario activo en memoria. Si no hay usuario en localStorage, llama T-008 para crear uno automáticamente.

---

### T-013 · Pantalla de inicio / Home
`P1` · Depende de: T-012

**Descripción**
Grid de las 6 semanas como tarjetas con: número, título, ícono y estado (bloqueada/disponible/completada). Semanas se desbloquean en orden. Botón de inicio por semana disponible.

**Criterios de aceptación**
- 6 semanas renderizadas visualmente
- Estado de cada semana correcto según progreso del usuario
- Click en semana disponible navega a esa semana
- Semanas bloqueadas muestran ícono de candado
- Semana completada muestra checkmark y score obtenido

**Nota POO**
Crear clase `SemanaCardViewModel` que transforma el DTO de la API en datos listos para renderizar (`completed`, `locked`, `score`, `icon`). Demuestra patrón ViewModel.

---

### T-014 · Componente ActivityWrapper
`P1` · Depende de: T-012

**Descripción**
Contenedor que envuelve cada actividad dentro de una semana:
- Muestra número de actividad y título
- Botones Anterior / Siguiente para navegar
- Indicador de progreso dentro de la semana (ej: 3 de 9)
- Guarda score vía API al completar cada actividad
- Al llegar a la última actividad, muestra el Quiz

**Criterios de aceptación**
- Navegación anterior/siguiente funciona correctamente
- Score se guarda automáticamente al completar cada actividad
- Indicador de progreso es preciso
- No permite saltar actividades sin completarlas
- Transición entre actividades es suave

**Nota POO**
Crear clase `ActivityFlowController` que gestiona el estado de navegación: actividad actual, historial, scores parciales. Encapsula toda la lógica de flujo.

---

### T-015 · Pantalla de nota global
`P1` · Depende de: T-013

**Descripción**
Pantalla final al completar las 6 semanas:
- Nota global calculada (promedio de los 6 quiz)
- Desglose por semana con nota individual
- Mensaje personalizado según nota obtenida
- Sin diplomas ni certificados (según requisito del docente)
- Opción de reiniciar (crea usuario nuevo)

**Criterios de aceptación**
- Solo aparece al completar las 6 semanas
- Nota global es el promedio correcto de las 6 semanas
- Desglose muestra cada semana con su nota
- Mensaje varía según rango de nota (excelente / bien / intenta de nuevo)
- Botón reiniciar crea usuario nuevo y regresa al home

**Nota POO**
Crear clase `GradeReportViewModel` que recibe el array de scores y calcula la nota global, el desglose y selecciona el mensaje apropiado.

---

## Épica: Quiz Component

---

### T-016 · Componente Quiz reutilizable
`P1` · Depende de: T-014

**Descripción**
Componente Quiz que funciona para todas las semanas. Soporta dos tipos:
1. Selección múltiple (tap en opción correcta)
2. Verdadero/Falso (tap VERDADERO o FALSO)

Semana 4 tiene versión temática (El Monstruo Hambriento) que reutiliza este componente con estilo diferente.

**Criterios de aceptación**
- Componente recibe preguntas vía props/input
- Muestra una pregunta a la vez con animación
- Respuesta correcta: feedback visual positivo
- Respuesta incorrecta: feedback visual + explicación breve
- Al finalizar calcula y envía el score vía API
- Funciona en touch (tablet) y click (PC)

**Nota POO**
Crear clase `QuizEngine` con métodos: `nextQuestion()`, `submitAnswer(optionId)`, `calculateScore()`, `getResults()`. El componente visual solo llama métodos de `QuizEngine` sin lógica propia.

---

### T-017 · El Monstruo Hambriento (Quiz Semana 4)
`P2` · Depende de: T-016

**Descripción**
Versión temática del quiz para Semana 4 usando `QuizEngine` base. Afirmaciones flotan como burbujas animadas. Kid toca VERDADERO para alimentar al monstruo o FALSO para esquivarla. Monstruo de laboratorio animado con reacciones graciosas.

**Criterios de aceptación**
- Burbujas flotan con animación CSS suave
- Monstruo tiene mínimo 2 estados visuales (feliz/sorprendido)
- Retroalimentación sonora en respuesta correcta e incorrecta
- Usa `QuizEngine` para la lógica (no duplica código)
- Score se envía igual que los demás quiz

**Nota POO**
`MonsterQuizComponent` extiende o compone `BaseQuizComponent`. Sobreescribe solo el método de renderizado, reutilizando toda la lógica de `QuizEngine`. Demuestra polimorfismo en UI.

---

## Épica: Semana 1

---

### T-018 · S1-A1: Carousel de objetos
`P1` · Depende de: T-014

**Descripción**
Carousel de objetos cotidianos. Kid toca etiquetas de características para describir cada objeto. 8-10 objetos (lápiz, borrador, regla, mochila, botella, pelota, crayón, cuaderno). Tags: color, tamaño, forma. Swipe para pasar al siguiente.

**Criterios de aceptación**
- Carousel navega con swipe en tablet y click/arrow en PC
- Mínimo 8 objetos con sus ilustraciones propias
- Tags correctos se resaltan al tocar
- Actividad se completa en menos de 3 minutos
- Ilustraciones son originales (sin copyright)

**Nota POO**
Crear clase `CarouselActivity` que gestiona el estado: `objectoActual`, `tagsSeleccionados`, `isCompleted`. Encapsula la lógica de navegación y validación.

---

### T-019 · S1-A2: Description match
`P1` · Depende de: T-014

**Descripción**
Personaje con speech bubble pide un objeto usando descripción natural. Kid arrastra el objeto correcto al centro. 10 objetos con descripciones (ver tabla de objetos ya definida). Objeto incorrecto rebota, correcto hace snap. Descripción escalonada en complejidad.

**Criterios de aceptación**
- 10 objetos con sus descripciones implementados
- Drag-and-drop funciona en touch y mouse
- Animación de rebote en respuesta incorrecta
- Animación de snap en respuesta correcta
- Personaje tiene reacción (feliz/confundido) según respuesta

**Nota POO**
Crear clase `DescriptionMatchGame` con métodos: `loadRound()`, `validateDrop(objectId)`, `nextRound()`. Separar la lógica del juego de la presentación visual.

---

### T-020 · S1-A3: Rescata a Pulgarcito
`P1` · Depende de: T-014

**Descripción**
Kid estira una regla virtual para medir el hueco en el puente y arrastra la tabla del tamaño correcto. Personaje Pulgarcito al otro lado. 5 huecos de dificultad creciente. Tabla incorrecta cae al río, correcta encaja. Pulgarcito avanza un paso por cada tablón.

**Criterios de aceptación**
- Mecánica de estiramiento de regla funciona en touch
- Los 5 huecos tienen medidas diferentes y crecientes
- Pulgarcito avanza un paso por cada tablón colocado
- Animación de victoria cuando Pulgarcito cruza
- Actividad guarda score según aciertos/intentos

**Nota POO**
Clase `RulerGame` con propiedades: `currentGap`, `measuredValue`, `attempts`. Métodos: `stretchRuler(start, end)`, `validatePlank(size)`, `advanceCharacter()`. Encapsula física simple del juego.

---

### T-021 · S1-A4/A5: Fill the cup + Sort by size
`P2` · Depende de: T-014

**Descripción**
Fill the cup: arrastra nivel de agua hasta la línea de medida exacta (ml). 5 vasos con medidas diferentes.

Sort by size: arrastra 5 objetos para ordenarlos de menor a mayor antes de que termine el tiempo. 3 rondas.

**Criterios de aceptación**
- Fill the cup: nivel de agua sigue el dedo con suavidad
- Medida correcta cuando está dentro del 5% de margen
- Sort by size: detección de orden correcto automática
- Temporizador visible y cuenta regresiva animada
- Ambas actividades funcionan sin escribir

**Nota POO**
Clase `MeasurementActivity` abstracta con subclases `FillCupActivity` y `SortActivity`. Ambas implementan método abstracto `validate()` de forma diferente. Demuestra polimorfismo.

---

### T-022 · S1-A6: Subweight
`P1` · Depende de: T-014

**Descripción**
Juego de restaurante tipo Subway. Pedido con ingredientes y pesos requeridos. Kid arrastra ingredientes a la balanza hasta alcanzar el peso correcto. 5 pedidos diferentes. Balanza animada que sube/baja según peso. Ingredientes: lechuga, tomate, jamón, queso, pepino.

**Criterios de aceptación**
- Balanza responde visualmente al agregar ingredientes
- Peso objetivo visible en el pedido
- Tolerancia del 10% para considerar correcto
- 5 pedidos diferentes con pesos distintos
- Animación de sandwich al completar pedido

**Nota POO**
Clase `SubweightGame` con `ScaleModel` (encapsula lógica de peso) y `OrderModel` (encapsula datos del pedido). Composición de clases.

---

### T-023 · S1-A7: Frío o Caliente
`P2` · Depende de: T-014

**Descripción**
Swipe arriba = caliente, swipe abajo = frío. 10 objetos/lugares aparecen uno a uno. Al finalizar, mini tabla donde kid toca el valor de temperatura correcto para cada personaje ilustrado (Carlitos 37°C, planta al sol, objeto en sombra).

**Criterios de aceptación**
- Swipe up/down detectado correctamente en touch
- 10 objetos variados (sol, hielo, hornilla, nieve, etc.)
- Retroalimentación inmediata con ícono frío/caliente
- Tabla tiene 3 filas con valores de temperatura para seleccionar
- Actividad completa en menos de 2 minutos

**Nota POO**
Clase `TemperatureGame` con lista de `TemperatureItem` (objeto, categoría, valorCelsius). La lógica de swipe es independiente del contenido.

---

## Épica: Semana 2

---

### T-024 · S2-A1/A2: Drawing + Tap the scene
`P1` · Depende de: T-014

**Descripción**
Drawing: canvas HTML5 donde el kid dibuja con el dedo. Salón de clases ilustrado como referencia al lado. Kid dibuja 5 objetos libremente.

Tap the scene: misma escena, kid toca 5 objetos para coleccionarlos. Cada toque genera animación de pop.

**Criterios de aceptación**
- Canvas dibuja líneas suaves siguiendo el dedo
- Botón de borrar y botón Listo visibles
- Tap the scene: exactamente 5 objetos son tocables
- Pop animation en cada objeto coleccionado
- Contador visible: x de 5 objetos encontrados

**Nota POO**
Clase `DrawingCanvas` encapsula la API de canvas (inicio de trazo, dibujo, fin de trazo). Clase `TapScene` gestiona los objetos tocables y el estado de colección.

---

### T-025 · S2-A3: La Caja Misteriosa
`P1` · Depende de: T-014

**Descripción**
Objeto oculto en caja. 3 pistas sensoriales secuenciales: sonido (clip de audio), textura (patrón táctil/visual), silueta. Kid puede adivinar entre 4 opciones en cualquier momento. Adivinar en pista 1 = 3 pts, pista 2 = 2 pts, pista 3 = 1 pt.

**Criterios de aceptación**
- 5 objetos con sus 3 pistas cada uno
- Audio se reproduce al tocar botón de pista
- Patrón de textura es visualmente claro (rugoso, liso, esponjoso)
- Sistema de puntos según momento de respuesta
- Retroalimentación al revelar la respuesta con animación

**Nota POO**
Clase `SensoryPuzzle` con `MysteryObject` que tiene propiedades: `soundClue`, `textureClue`, `silhouetteClue`, `correctAnswer`. Clase `PuzzleSession` gestiona pistas reveladas y puntuación.

---

### T-026 · S2-A4/A5: La Fábrica + Categorize scene
`P1` · Depende de: T-014

**Descripción**
La Fábrica Misteriosa: máquina expulsa objetos cubiertos de gris. Kid rasca con el dedo para revelar el material, luego arrastra a la cinta correcta (5 cintas: plástico, metal, madera, vidrio, cerámica).

Categorize scene: objetos del salón como tarjetas arrastrables, 5 zonas de materiales. Rondas más difíciles incluyen objetos ambiguos.

**Criterios de aceptación**
- Efecto de raspar detectado correctamente en touch
- Reveal animado al completar el raspado (>70% de área)
- 5 cintas con etiquetas claras de material
- Objetos incorrectos rebotan a la zona de salida
- Categorize: mínimo 10 objetos en 3 rondas

**Nota POO**
Clase `ScratchReveal` encapsula el canvas de raspado y calcula el porcentaje revelado. Clase `SortingGame` gestiona zonas de drop y validación.

---

## Épica: Semana 3

---

### T-027 · S3-A1/A2: RPL + Build it
`P1` · Depende de: T-014

**Descripción**
RPL: escena de jardín/mercado ilustrada. Kid toca los materiales que reconoce de una lista (madera, metal, plástico, vidrio, cerámica, tela). Sin respuestas incorrectas — es exploración.

Build it: objeto dañado aparece. Kid arrastra el material correcto de una lista lateral para repararlo. 5 objetos para reparar.

**Criterios de aceptación**
- RPL: todos los toques son válidos, no hay error
- Se registra cuáles materiales seleccionó el usuario
- Build it: 5 objetos con sus materiales de reparación
- Animación de objeto reparado al acertar
- Material incorrecto rebota con explicación breve

**Nota POO**
Clase `RPLActivity` registra selecciones sin juzgarlas (patrón Observer). Clase `RepairGame` tiene objetos con propiedad `requiredMaterial` para validación.

---

### T-028 · S3-A3: ¿De qué está hecho? (quiz game)
`P1` · Depende de: T-014

**Descripción**
Objeto en pantalla con pregunta. Dos tipos alternados:
- Tipo A: ¿De qué material está hecho? (opciones de material)
- Tipo B: ¿Por qué se usa ese material? (opciones de razón)

Estrellas y sonido alegre en respuesta correcta. 10 objetos total.

**Criterios de aceptación**
- 10 objetos con sus preguntas implementados
- Tipo A y Tipo B se alternan correctamente
- 3 opciones por pregunta (una correcta)
- Estrellas animadas en respuesta correcta
- Explicación breve en respuesta incorrecta

**Nota POO**
Clase `MaterialQuizGame` con dos tipos de pregunta como subclases: `MaterialTypeQuestion` y `MaterialReasonQuestion`. Ambas implementan interfaz `Question`. Demuestra polimorfismo e interfaces.

---

### T-029 · S3-A4/A5: Reflection cards + Dale segunda vida
`P2` · Depende de: T-014

**Descripción**
Reflection cards: dos preguntas sobre plásticos desechables. Kid toca opciones ilustradas.

Dale segunda vida: robot reciclado guía el juego. Kid arrastra objetos desechables a su nuevo uso (botella → maceta, bolsa → basurero).

**Criterios de aceptación**
- Reflection cards: 2 preguntas con 3 opciones cada una
- Robot tiene al menos 2 estados animados
- 5 objetos con sus segundas vidas en el juego
- Animación de transformación al acertar
- Robot hace comentario gracioso por cada acierto

**Nota POO**
Clase `RecyclingGame` con `RecyclableObject` que tiene: `originalUse`, `secondLife`, `dropZone`. Robot como clase `Narrator` con métodos `celebrate()`, `explain()`.

---

## Épica: Semana 4

---

### T-030 · S4-A1: Fruit comparison table
`P1` · Depende de: T-014

**Descripción**
Dos limones ilustrados (fresco y descompuesto). Kid completa tabla digital tocando el descriptor correcto para cada propiedad. Filas: Color, Olor, Textura, ¿Es comestible?, Dureza. Opciones por fila presentadas como chips tocables.

**Criterios de aceptación**
- Tabla visual clara y legible en tablet (min 768px)
- Chips de opciones son tocables y visualmente diferenciables
- Respuestas correctas se resaltan en verde al completar
- No bloquea avance — es actividad de observación
- Limones ilustrados son reconocibles

**Nota POO**
Clase `ComparisonTable` con datos tipados: `rows[]`, `columns[]`, `cells[]`. Método `validateCell(row, col, value)` encapsula lógica de validación.

---

### T-031 · S4-A2: La Familia Química (personajes intro)
`P1` · Depende de: T-014

**Descripción**
5 personajes que se presentan antes de cada experimento:
- 🍎 Óxido: manzana café con actitud dramática — *"¡Yo aparezco cuando dejas tu comida al aire y la pongo café sin permiso!"*
- 🫧 Fermi el Burbujitas: masa que eructa — *"¡Buuurp! Perdón... es que como azúcar y levadura y no puedo parar de hacer gases!"*
- 🍋 Ácido: limón agrio — *"¡Yo soy lo que hace tu cara así! 😖 ¡Como el limón!"*
- 🧼 Básico: jabón tranquilo — *"¡Yo soy lo suavecito! Como el jabón que usas para bañarte."*
- ✨ Lumi la Brillante: barra luminosa tímida — *"¡Yo soy la magia de brillar sin necesitar luz!"*
- 🔥 Combus: llama dramática — *"¡Yo soy el más dramático de la familia... ¡entro como papel y salgo como ceniza!"*

**Criterios de aceptación**
- 6 personajes con ilustraciones originales y divertidas
- Speech bubble aparece con animación de tipeo
- Personaje hace micro-animación (vibrar, brillar, burbujear)
- Kid toca el personaje o un botón para continuar
- Personajes reaparecen en sus experimentos respectivos

**Nota POO**
Clase `ChemicalCharacter` con propiedades: `name`, `color`, `phrase`, `animation`. Subclases para cada personaje que sobreescriben la animación. Demuestra herencia y polimorfismo visual.

---

### T-032 · S4-A3/A4: Experimentos Oxidación + Fermentación
`P1` · Depende de: T-031

**Descripción**
Oxidación: kid toca manzana para cortarla, arrastra slider de tiempo. Manzana cambia de color progresivamente (verde → amarillo → café oscuro).

Fermentación: arrastra ingredientes en orden (levadura → azúcar → harina → agua tibia). Toca mezclar. Timer de 5s. Masa se infla con burbujas animadas. Fermi aparece celebrando.

**Criterios de aceptación**
- Manzana tiene mínimo 4 estados visuales de oxidación
- Slider de tiempo es arrastrable y suave
- Fermentación: ingredientes tienen orden obligatorio
- Ingrediente fuera de orden se sacude y vuelve a lugar
- Masa crece con animación de burbujas visibles

**Nota POO**
Clase `ExperimentSimulation` abstracta con subclases `OxidationExperiment` y `FermentationExperiment`. Cada una implementa método `simulate()` diferente.

---

### T-033 · S4-A5/A6/A7: Lab de colores + Barra luminosa + Combus
`P1` · Depende de: T-031

**Descripción**
Lab de colores: 3 tubos de ensayo. Kid arrastra vinagre/agua/bicarbonato a cada tubo, luego gotas de jamaica. Tubo cambia de color y personaje reclama su color:
- Tubo 1 (vinagre) → rojo → Ácido aparece
- Tubo 2 (agua) → rosado → "¡Neutral!"
- Tubo 3 (bicarbonato) → azul/morado → Básico aparece

Barra luminosa: kid arrastra extremos al centro. Glow CSS.

Combus: animación tap-through en 4 etapas: papel → llama → humo → cenizas.

**Criterios de aceptación**
- 3 tubos con cambios de color correctos
- Personajes Ácido y Básico aparecen al cambiar el color
- Barra luminosa: efecto glow visible claramente
- Combus: 4 etapas con ilustraciones distintas
- Combus narra cada etapa

**Nota POO**
Clase `ColorChangeExperiment` con array de `TubeState`. Clase `TapThroughAnimation` gestiona el estado de etapas secuenciales.

---

## Épica: Semana 5

---

### T-034 · S5-A1/A2: Indagación swipe + Los 4 Superpoderes
`P1` · Depende de: T-014

**Descripción**
Indagación: 10 objetos aparecen uno a uno. Swipe derecha = Vivo 🌱, izquierda = No vivo 🪨.

Los 4 Superpoderes: personaje presenta cada uno con animación simple. Kid toca cada tarjeta para desbloquearla. Las 4 deben estar desbloqueadas para continuar:
- 🌱 Crecer — *"¡Los seres vivos crecen! Como tú, que ya no cabes en tu ropa de bebé"*
- 🏃 Moverse — *"¡Se mueven solos! No necesitan que alguien los empuje"*
- 👨‍👩‍👧 Reproducirse — *"¡Tienen hijitos! Los perros tienen perritos"*
- 🍎 Alimentarse — *"¡Comen! Sin comida no pueden vivir"*

**Criterios de aceptación**
- 10 objetos con swipe detectado correctamente
- Retroalimentación inmediata con ícono y color
- 4 tarjetas de superpoder con ilustración y frase
- Animación de desbloqueo al tocar
- Las 4 tarjetas deben tocarse para continuar

**Nota POO**
Clase `SwipeCard` con estado vivo/noVivo. Clase `SuperpowerCard` con propiedades: `name`, `icon`, `phrase`, `unlocked`. Clase `SuperpowerDeck` gestiona el estado de las 4 tarjetas.

---

### T-035 · S5-A3/A4: ¿Cuántos superpoderes? + ¿Cuál superpoder es?
`P1` · Depende de: T-034

**Descripción**
¿Cuántos superpoderes tiene?: objeto aparece, kid toca cuáles de los 4 superpoderes tiene. Si tiene los 4: ¡Es un ser vivo! Si no: ¡Le faltan superpoderes! con indicación de cuáles le faltan.

¿Cuál superpoder es?: animación/ilustración de un ser haciendo algo. Kid arrastra el superpoder correcto de los 4 disponibles. Ej: conejo con crías → Reproducirse.

**Criterios de aceptación**
- 6 objetos evaluados con sus superpoderes correctos
- Íconos se iluminan al tocarlos y se oscurecen al deseleccionar
- Animación clara de ser vivo vs no vivo
- ¿Cuál superpoder?: 6 situaciones con animaciones ilustradas
- Score basado en aciertos

**Nota POO**
Clase `LivingThingEvaluator` con método `checkSuperpowers(object, selectedPowers[])`. Retorna lista de superpoderes correctos e incorrectos.

---

### T-036 · S5-A5: ¡Siembra tu semilla! (germinación)
`P1` · Depende de: T-014

**Descripción**
Kid arrastra algodón, agua y semilla a un vaso transparente. Animación fast-forward de 5 días (aprox 8 segundos). Journal de 5 paneles secuenciales. Kid toca cada panel para observarlo. Tarjeta GERMINACIÓN al final con definición simple.

**Criterios de aceptación**
- Drag de los 3 elementos funciona en touch
- Animación fast-forward es clara y continua
- 5 paneles visualmente distintos y reconocibles
- Tarjeta de Notación explica germinación en lenguaje simple
- No requiere esperar tiempo real

**Nota POO**
Clase `GerminationJournal` con array de `DayObservation`. Clase `FastForwardAnimation` controla la secuencia temporal. Método `observe(day)` retorna el estado de ese día.

---

### T-037 · S5-A6: La Lupa de Detective
`P1` · Depende de: T-014

**Descripción**
Jardín ilustrado con: perro durmiendo, bicicleta, planta en maceta, piedra redonda, hongo, nube, juguete de cuerda. Kid arrastra lupa por la escena y toca objetos.
- Ser vivo → reacción animada + tarjeta verde: *"¡Sí! Respiro, como y crezco"*
- Inerte → tarjeta gris: *"¿Me muevo? Solo si me empujas. No estoy vivo"*

Misión completa al descubrir los 7.

**Criterios de aceptación**
- Lupa sigue el dedo suavemente con CSS transform
- 7 objetos son detectables al tocar
- Tarjetas verde/gris aparecen con animación
- Contador: x de 7 descubiertos
- Animación de victoria al completar los 7

**Nota POO**
Clase `MagnifierGame` con `DetectableObject` (tipo, reacción, tarjetaTexto, isAlive). Método `detectObject(id)` retorna la tarjeta correspondiente.

---

## Épica: Semana 6

---

### T-038 · S6-A1/A2: ¿Qué tenemos en común? + ¡Sigue el olor!
`P1` · Depende de: T-014

**Descripción**
¿Qué tenemos en común?: tarjetas de características flotan. Kid arrastra a columna Plantas 🌱, Animales 🐾, o zona central Ambas.

¡Sigue el olor!: partículas de olor flotan visualmente desde objeto oculto en escena ilustrada. Kid arrastra el dedo siguiendo el rastro. Al llegar al objeto, lo revela. Tarjeta: *"¡Tu nariz detectó el estímulo!"*

**Criterios de aceptación**
- 4 características con su columna correcta
- Drag entre 3 zonas funciona en touch
- Sigue el olor: rastro de partículas claramente visible
- Objeto revelado con animación de descubrimiento
- Tarjeta de estímulo al final

**Nota POO**
Clase `CharacteristicSorter` con `SortableCard` y `DropZone`. Clase `ScentTrail` gestiona la ruta de partículas y detecta si el dedo la sigue correctamente.

---

### T-039 · S6-A3: ¡La pupila mágica!
`P1` · Depende de: T-014

**Descripción**
Ojo ilustrado grande en pantalla. Kid arrastra linterna hacia el ojo:
- Linterna cerca → pupila se contrae (animación CSS)
- Linterna lejos → pupila se dilata

Luego: pregunta ¿Para qué sirve la pupila? con 3 opciones ilustradas.

**Criterios de aceptación**
- Pupila cambia de tamaño suavemente según distancia de linterna
- Cambio es visible claramente en tablet
- Linterna sigue el dedo con suavidad
- Pregunta tiene 3 opciones tocables con ilustraciones
- Respuesta correcta con retroalimentación positiva

**Nota POO**
Clase `PupilSimulation` con método `reactToLight(distance)` que calcula el tamaño de la pupila. Encapsula la relación inversa entre luz y dilatación.

---

### T-040 · S6-A4: ¡A moverse!
`P1` · Depende de: T-014

**Descripción**
Instrucciones físicas secuenciales con íconos ilustrados:
1. ¡Salta 10 veces! 🦘
2. ¡Corre en tu lugar 15 segundos! 🏃
3. ¡Haz 5 sentadillas! 🧎

Timer visual animado. Kid toca botón LISTO grande cuando termina. Luego 3 preguntas de sensaciones: ¿Sientes calor? / ¿Late más rápido tu corazón? / ¿Tienes sed? Tarjeta explicativa sobre respuesta a estímulos al final.

**Criterios de aceptación**
- 3 instrucciones con íconos ilustrados claros
- Timer visual animado para instrucciones con tiempo
- Botón LISTO grande y visible (fácil de tocar en tablet)
- 3 preguntas con opciones Sí/No grandes
- Tarjeta explicativa al final

**Nota POO**
Clase `ExerciseSession` con lista de `ExerciseInstruction`. Clase `BodyResponseSurvey` encapsula las preguntas y respuestas del niño.

---

### T-041 · S6-A5/A6/A7/A8: Estímulos + Semilla + Hábitat + Ciclo de vida
`P1` · Depende de: T-014

**Descripción**
¿Qué haría?: estímulo a la izquierda, kid arrastra reacción correcta desde la derecha. 6 pares. Ej: mucha luz → pupila se contrae.

¡Dale vida a tu semilla!: arrastra agua 💧, tierra 🌱, sol ☀️ al tiesto. Planta crece.

¿Dónde vivo yo?: 4 hábitats (océano, bosque, desierto, campo). Animales caen uno a uno, kid arrastra a su hábitat.

¿Qué viene después?: ciclos desordenados (rana 3 etapas, mariposa 4 etapas). Kid arrastra etapas al orden correcto. Animación del ciclo completo.

**Criterios de aceptación**
- ¿Qué haría?: 6 pares con retroalimentación
- Semilla: animación de crecimiento satisfactoria
- Hábitat: 4 hábitats con mínimo 2 animales cada uno
- Ciclo de vida: detección de orden correcto automática
- Animación de ciclo completo al ordenar correctamente

**Nota POO**
Clase `LifeCycleGame` con `Stage[]` ordenables. Clase `HabitatGame` con `Habitat[]` y `Animal[]`. Clase `StimulusMatchGame` con `StimulusPair[]`. Reutilizan lógica de drag-and-drop compartida.

---

## Épica: Ojo al dato

---

### T-042 · Componente Ojo al dato (global)
`P2` · Depende de: T-014

**Descripción**
Tarjeta de dato curioso antes del quiz de cada semana. Datos por semana:
- S1: El punto penal del fútbol está a 12 pasos, pero no todos los pasos miden igual.
- S2: Los pulpos pueden cambiar de textura Y color para camuflarse.
- S3: El plástico PET de una botella puede convertirse en ropa deportiva.
- S4: Las luciérnagas usan luminiscencia igual que las barras de los conciertos.
- S5: La tortuga de Galápagos puede vivir más de 150 años.
- S6: Las plantas pueden detectar sonidos y crecer hacia la música.

**Criterios de aceptación**
- Componente reutilizable recibe texto e imagen como props
- Estilo visual idéntico para las 6 semanas
- Ilustración original para cada dato
- Transición suave hacia el quiz al tocar Continuar
- Datos son originales (no copiados)

**Nota POO**
Clase `FunFact` con propiedades: `semanaId`, `text`, `imageUrl`. Array de 6 instancias cargadas desde la API o desde constantes en el frontend.

---

## Épica: Responsive & QA

---

### T-043 · Pruebas de responsividad en todos los dispositivos
`P1` · Depende de: T-015

**Descripción**
Probar y corregir el layout en los tres breakpoints requeridos:
- PC: 1200px+
- Tablet: 768px–1199px (foco principal)
- Smartphone: 375px–767px

Puntos críticos: drag-and-drop en touch, tamaño de botones (min 44x44px), texto legible sin zoom, carousel funcional en touch, sin scroll horizontal.

**Criterios de aceptación**
- Todas las actividades funcionan en los 3 tamaños
- Botones tienen mínimo 44px de área tocable
- Texto mínimo 16px en mobile
- Drag-and-drop probado en dispositivo físico o emulador
- Sin scroll horizontal en ningún breakpoint
- Imágenes no se desbordan

**Nota POO**
N/A — tarea de QA y CSS.

---

## Épica: Documentación

---

### T-044 · Documento de investigación (rúbrica 20%)
`P1` · Depende de: T-001

**Descripción**
Redactar el documento de investigación requerido por la rúbrica. Estructura:

1. Introducción al proyecto y objetivo pedagógico
2. Fundamentos de POO aplicados al proyecto
   - Herencia (`BaseModel` → subclases)
   - Encapsulación (propiedades private/protected)
   - Polimorfismo (override de métodos, interfaces)
   - Abstracción (clases abstractas)
3. Diagrama de clases UML
4. Arquitectura MVC con diagrama
5. Modelo de base de datos (ERD)
6. Descripción de cada módulo/semana
7. Conclusiones

**Criterios de aceptación**
- Mínimo 15 páginas en formato Word o PDF
- Diagrama de clases UML con todas las clases del proyecto
- ERD con todas las tablas y relaciones
- Diagrama de arquitectura MVC
- Cada concepto POO tiene ejemplo de código real del proyecto
- Formato UNIVO (portada, índice, referencias)

**Nota POO**
El documento debe evidenciar claramente los 4 pilares de POO con fragmentos de código reales como ejemplos. Es el 20% de la rúbrica más fácil de perder si se deja para el último momento.

---

*UNIVO · Ingeniería en Desarrollo de Software · POO Parcial III · 2026*

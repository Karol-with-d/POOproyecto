# App review findings

Reviewed on 2026-10-01 against `master` (`1773431`, same commit as `origin/master`).

This repository has no `main` branch. `origin/HEAD` is `master`, so this branch starts there.

The review is a static pass over the React app, the Express API, Prisma, and the Docker/Fly setup, plus checks of what is actually running on this machine. Nothing here was fixed. Each item has a way to reproduce it.

Severity:

- **High** — a child loses a score, sees the wrong grade, or the answer is given away.
- **Medium** — a flow is misleading, easy to break, or inconsistent.
- **Low** — cleanup, performance, or a rough edge.

Two unmerged branches already touch some of this. They are noted so the work is not repeated:

- `fix/semana-5-6-scroll-reset` — scroll reset and back buttons on weeks 5 and 6.
- `feat/compress-served-images` — WebP versions of the heavy images, and a rewrite of two week-1 games that on `master` are still inline HTML.

## This machine, not on remote master

These three are why the app does not talk to its API from a normal local start. They live in gitignored `backend/.env` or in Docker state. `origin/master` does not contain them. `backend/.env.example` already says port `3001`, database port `3306`, and `FRONTEND_URL=http://localhost:5173`.

### E1. Frontend calls port 3001, this backend listens on 3002

**Severity:** High locally. Not in git.

`frontend/src/services/api.ts` uses `VITE_API_URL` or `http://localhost:3001/api`. There is no `frontend/.env`. `backend/.env` sets `PORT=3002`. `backend/src/server.ts` only falls back to 3001 when `PORT` is unset, which matches `.env.example`.

**Reproduce**

1. Start the backend with the current `backend/.env` (`npm run dev` in `backend`).
2. Start the frontend (`npm run dev` in `frontend`). Vite prints `localhost:5173`.
3. Open the app, pick a name, tap Entrar.
4. The browser requests `POST http://localhost:3001/api/users` and fails. The login shows "Ups, algo salió mal."

**Fix direction:** point `VITE_API_URL` at `http://localhost:3002/api`, or set `PORT=3001` so it matches the example and the frontend default.

### E2. CORS allow-list is port 5174

**Severity:** High locally, once E1 is fixed. Not in git.

`backend/.env` has `FRONTEND_URL=http://localhost:5174`. `backend/src/config/App.ts` uses that value as the only allowed origin. Vite's config does not set a port, so the dev server uses 5173 unless that port is already taken.

**Reproduce**

1. Run the API on the port the frontend actually calls.
2. Load the app at `http://localhost:5173` and submit the login form.
3. The browser blocks the response. The API log says CORS is enabled for `http://localhost:5174`.

**Fix direction:** set `FRONTEND_URL=http://localhost:5173` and restart the API. The tracked example file is already correct.

### E3. The MariaDB container exists and is stopped

**Severity:** High locally. The data is still there.

`docker ps -a` shows `poo-ciencias-db` (`mariadb:11`), exit code 0, last stopped about 18 hours before this review. It publishes host port **3307** to container port 3306 and was created with database `POO_proyecto_ciencias`. That matches `DATABASE_URL` in `backend/.env`. Nothing is listening on 3306 or 3307. Docker has no running database container. The data volume is still mounted at `/var/lib/mysql` inside that container.

The only other `mysqld` on the machine is KDE Akonadi. It is not this database.

`Dockerfile` / `entrypoint.sh` start a different MariaDB inside the Fly image, on port 3306, for production. That does not help a local `npm run dev`.

**Reproduce**

1. `docker ps -a --filter name=poo-ciencias-db`
2. Start the backend and hit any route that uses Prisma, such as `GET /api/semanas`.
3. The request fails because nothing accepts TCP connections on port 3307.

**Fix direction:** `docker start poo-ciencias-db`, then retry the health and semanas routes.

## Scores and progress

### F1. Week 3 games save a week number where a week id is required

**Severity:** High

`HechoDeGamePage`, `BuildItGamePage`, and `ReflectionCardsGamePage` read `semanaId` from the URL. The links are `/semana/3/hecho-de`, `/semana/3/build-it`, and `/semana/3/reflection-cards`, so the value is the string `"3"`.

On finish they call `saveScore` and `markSemanaCompleted` with that string. `user_scores.semana_id` and `user_progress.semana_id` are foreign keys to `semanas.id`, which is a UUID. The insert fails. Both calls use `.catch(() => {})`, so the screen still shows the trophy and a percentage.

Quizzes do this correctly. `saveQuizScoreForSemanaNumber` loads `/api/semanas` and sends the UUID.

**Reproduce**

1. Log in, open Semana 3, finish "¿De qué están hechos?", "¡A reparar!", or "Tarjetas de Reflexión".
2. Watch the network tab. `POST /api/scores` and `PATCH /api/users/:id/progress/semana/3` return 500.
3. Open Perfil. Semana 3 stays pending. The API log shows a foreign-key error, not the message the child sees.

**Fix direction:** resolve week number 3 to the semana UUID before saving, the same way the quizzes do. Surface a save failure instead of swallowing it.

### F2. Those three games would still collapse into one score, and they mark the whole week done

**Severity:** Medium. It shows up as soon as F1 is fixed.

`UserScoreModel.upsertForActivity` matches on `userId + semanaId + activityId + type`. The week 3 games never send `activityId`, so it is null. Finishing a second game overwrites the first activity row.

Each one also calls `markSemanaCompleted`. Home treats `completed` as "¡Lista!" for that week. A child who only repairs the workshop would see Semana 3 finished before the quiz.

The saved percentage is always 100 when the game ends: Hecho De only completes an object after a correct answer, Build It finishes when every repair is correct, and Reflection Cards only continues after a correct choice. Wrong attempts are not part of the number.

**Reproduce** (after F1 is fixed)

1. Finish "¡A reparar!" and check `user_scores` and `user_progress`.
2. Finish "Tarjetas de Reflexión".
3. There is still one `type = 'activity'` row, and `user_progress.completed` is already true with no quiz taken.

### F3. The global grade ignores unfinished weeks

**Severity:** High

`ScoreCalculator.calculateGlobal` averages the quiz rows that exist. It divides by that count, not by 6. A single quiz of 100 is stored and shown as 100%.

`missing` is hardcoded to `[]` with a TODO to map week ids. `ScoreService` then says "¡Todas las semanas completadas!" whenever there is at least one quiz. Perfil does not render that string, but it does render `global`.

The profile table prints an equal weight (`16.67%` with six weeks) and the sentence "Promedio de tus actividades y quizes calificados." The weight is not used. Activity rows are not included. Only `type === 'quiz'` counts. See F4.

**Reproduce**

1. Log in and finish only the Semana 1 quiz with every answer right.
2. Open Perfil.
3. Nota Global shows 100%. The other five rows say Pendiente. The weight column still says each week is about 16.67%.

**Fix direction:** divide by 6, treat missing weeks as 0 or exclude them from the label, and build `missing` from semana numbers. Make the sentence match the rule.

### F4. Almost no activity writes a score

**Severity:** Medium

`saveScore` / `saveQuizScoreForSemanaNumber` appear only in the six quiz pages and the three week 3 games from F1. These never persist a result:

- Semana 1: Empareja palabras, Rescata a Pulgarcito, Ordena por tamaño
- Semana 2: Coleccionando objetos, Caja misteriosa, Fábrica misteriosa, diálogo de Marta
- Semana 4: oxidación, fermentación, opuestos, quimioluminiscencia, combustión
- Semana 5: superpoderes, semillas, búsqueda
- Semana 6: similitudes, movimiento, hábitats

Home and Perfil only change after a quiz, because that path calls `markSemanaCompleted` with a real semana id.

**Reproduce**

1. Log in and play any activity in the list above through to its ending.
2. Return to the map and to Perfil.
3. That week is not marked done, and its grade is still Pendiente.

### F5. Same nickname is the same account, and the presets collide

**Severity:** High in a classroom

`UserService.createUser` reuses a user when `randomName` already exists. Login always sends a name: an empty field becomes `"Explorador"` (`nickname.trim() || undefined`, then `createUser(name || 'Explorador')`). The four chips are Explorador, Luna, Sol, and Río.

There is no session. The id is kept in `localStorage` under `plataforma_user`. Two children who tap Luna on two browsers share one row. The later quiz upsert replaces the earlier score.

"Cambiar de usuario" on Perfil only navigates to `/login`. It does not clear storage until a later login succeeds.

**Reproduce**

1. On browser A, tap Luna, enter, finish the Semana 1 quiz.
2. On browser B, tap Luna and enter.
3. Perfil on B shows A's name, progress, and grade. Finish the quiz with different answers. Perfil on A, after refresh, shows B's grade.

### F6. A quiz with no saved user fails quietly on four weeks

**Severity:** Medium

Semana 1 and Semana 4 check `localStorage` and show "No hay usuario activo para guardar la puntuación." Semana 2, 3, 5, and 6 only save inside `if (stored)`. With no user they still show the results screen and write nothing.

There is also no route guard. `/home`, `/semana/1`, and the quizzes open without visiting `/login`.

**Reproduce**

1. Clear `localStorage` for the site.
2. Open `/semana/2/quiz` directly and finish it.
3. The results screen appears. There is no `POST /api/scores`.

### F7. A fast second tap can push a quiz score over 100, and the API then rejects it

**Severity:** Medium

On Semana 3, 5, and 6, `handleAnswer` checks `locked[qi]` and then calls `setLocked`. Until the next render the button is still active. A double tap on a correct option runs `setScore(s => s + 10)` twice. Three questions are worth 10 each, scored out of 30. One extra tap makes 40, and `Math.round((40 / 30) * 100)` is 133.

`ScoreCalculator.validateScore` rejects anything outside 0–100. `ScoreController.create` turns that into HTTP 500 and the message "Error al guardar score". The child gets the kid-message "No se pudo guardar tu nota." The same 500 is used for a missing user and for a database failure, so the log is the only way to tell them apart.

**Reproduce**

1. Log in and open `/semana/6/quiz`.
2. On one question, tap the correct option twice quickly, before the highlight locks.
3. Finish the quiz. If the total is over 30, `POST /api/scores` returns 500 and Perfil stays pending for that week.

### F8. Retaking a quiz replaces the previous grade, including a worse one

**Severity:** Low

`upsertForActivity` updates the existing quiz row in place. There is one row per user and week because `activityId` is null and `type` is `quiz`. A second attempt with a lower percentage overwrites the better one. Home and Perfil then show the lower number.

**Reproduce**

1. Finish a quiz with all answers right. Perfil shows 100.
2. Open the same quiz and miss every question.
3. Refresh Perfil. The grade is 0.

### F9. If duplicate quiz rows ever exist, the global average keeps the oldest

**Severity:** Low. Latent while F8's upsert holds.

`findByUserId` orders by `createdAt desc`. `calculateGlobal` walks that list and `Map.set`s each week, so the last write wins. That last write is the oldest row. `ProgressService` uses `.find()` on the same order, so the profile table would show the newest quiz while Nota Global used the oldest.

The comment in `ScoreCalculator` says it takes the latest score. The loop does the opposite.

## Games and navigation

### F10. Rescata a Pulgarcito marks the right planks before the child chooses

**Severity:** High

In `RescataPulgarcitoGamePage`, level 1 adds `animate-float-pulgarcito` when `plank.size === L1_CORRECT`, and paints that length label in primary. Level 2 does the same for sizes 8 and 12 (`isCorrectSize`), including the float animation when the plank is not selected. This is in the render, not after Comprobar.

**Reproduce**

1. Open Semana 1 → Rescata a Pulgarcito → play.
2. Before tapping anything, look at the plank list.
3. One plank (level 1) or two planks (level 2) are already emphasized. Those are the lengths the checker accepts.

### F11. Empareja palabras has no way out until the last level

**Severity:** Medium

`DescriptionMatchGamePage` is a full-viewport iframe. The document inside it shows "Nivel anterior" only after level 1. "Volver al inicio" is created at the end of level 5 and posts `description-match-home`. There is no exit message for the middle of the game. The React page only listens for that final message. The app's own back control is not on screen.

`SortBySizeGamePage` does have an exit button (`sort-by-size-exit`). This one does not.

**Reproduce**

1. Open Semana 1 → Empareja palabras → play.
2. On level 1, look for a back or close control inside the game.
3. The header has sound and level dots only. Leaving requires the browser back button.

### F12. The map does not lock later weeks, and it does not reset scroll

**Severity:** Medium

`HomePage` sets `isLocked = false` for every week. The comment above the component says later weeks stay locked until the previous one is finished. Every Semana button is enabled. The "¡Vamos!" badge still marks the first unfinished week, so the screen implies an order it does not enforce.

No page calls `scrollTo`. React Router keeps the window scroll offset. The home map is taller than the viewport. Semana 5 is `h-screen` with `overflow-hidden` and an inner `overflow-y-auto` main. A leftover `scrollY` from the map pushes that fixed page down, so the header or the quiz block sits off screen. Semana 6 can scroll, but its leave control is a "Salir" button with a close icon, not the back arrow used on the other weeks.

`fix/semana-5-6-scroll-reset` is not in `master`. It adds `WeekScrollReset` and changes the week 5 and 6 back controls.

**Reproduce**

1. On the map, scroll until Semana 5 or 6 is in view and open it.
2. The new page opens at the old scroll offset. On Semana 5 the top bar can sit above the viewport.
3. On the map, tap Semana 6 without finishing Semana 1. It opens. Nothing is disabled.

### F13. Several nav items go to the same place

**Severity:** Low

- Perfil mobile bar: "Aprender" and "Misiones" both link to `/home`. Only "Perfil" is the current page.
- Semana 5 mobile bar: "Lecciones", "Semillas", and "Premios" all link to `/home`. "Semillas" does not open the seeds game.
- Semana 1 mobile bar: the center "Laboratorio" item is a `div`, not a link.

**Reproduce**

1. Open Perfil on a narrow window and tap Misiones.
2. Open Semana 5 on a narrow window and tap Semillas.
3. Both land on `/home`.

### F14. `/semana/:semanaId` is the Semana 1 page

**Severity:** Low

`App.tsx` registers `/semana/2` through `/semana/6` as their own pages, then `/semana/:semanaId` as `Semana1Page`. React Router ranks the static paths higher, so weeks 2–6 are fine. Any other value renders Semana 1's title and activities.

**Reproduce:** open `/semana/7` or `/semana/abc`. The heading is "Semana 1: Medidas".

### F15. `QuizIntroPage` is unused

**Severity:** Low

`frontend/src/pages/QuizIntroPage.tsx` is not imported by `App.tsx`. Its comment says the button should go to `/semana/5/quiz/play` or show "Próximamente". The button actually navigates to `/semana/5/quiz`, which is `Semana5QuizPage`. Semana 5's hub already links there. The intro also hotlinks two `lh3.googleusercontent.com` images.

## Content, assets, and the API

### F16. The quizzes on screen are not the quizzes in the database

**Severity:** Medium

Every quiz page has its own `QUESTIONS` array. `getQuizBySemana` is never called. `GET /api/semanas/:id/quiz` returns the rows from `backend/prisma/seed.ts`, including `isCorrect` on every option.

The two sets disagree. Seed week 1 asks about a pencil, a ruler, and boiling water. The page asks what Pulgarcito, ordering by size, and object descriptions teach. Seed quizzes have five questions. The pages have three, except Semana 4, which has ten true/false items written in the component.

Anyone who can reach the API can read the seeded answers. The pages the children play do not use those rows, so the leak does not solve the on-screen quiz. It does mean the seeded bank cannot be treated as secret, and the two sources will drift.

**Reproduce**

1. `GET /api/semanas` and then `GET /api/semanas/<semana-1-uuid>/quiz`.
2. Compare the questions with `/semana/1/quiz`.
3. The JSON includes `isCorrect: true` on the answer options. The page never requested it.

### F17. Public images are about 35 MB, and several large files are unused

**Severity:** Medium for load time. Low for the unused files themselves.

`frontend/public/images` is about 35 MB. Largest files:

| File | Size |
| --- | --- |
| `images/Juaguar.png` | 2.5 MB |
| `images/niñocrece.png` | 1.5 MB |
| `images/mixfrutas.png` | 1.3 MB |
| `images/Lupa.png` | 1.3 MB |
| `images/LoginImage.png` | 1.2 MB |
| `images/2bananas.png` | 1.2 MB |
| `images/semana2/page marta.png` | 1.2 MB |
| `images/1manzana.png` | 1.1 MB |
| `images/Pulgarcito.png` | 1.0 MB |
| `images/semana1/estante.png` | 1.0 MB |

`LoginImage.png` is the login, home, and profile avatar, so it is requested on the first screen. `page marta.png` is the Semana 2 card (`src="/images/semana2/page marta.png"`). The space in the filename depends on the browser encoding it.

`git grep` on `master` finds no reference to `Juaguar.png`, `niñocrece.png`, `mixfrutas.png`, `Lupa.png`, `1manzana.png`, or `2bananas.png`. They are still copied into `public/` and into the production image. `feat/compress-served-images` converts this set to WebP and is not merged. On that branch, Lupa and the apple are used by a different version of the week 1 games.

Semana 5's hub image and the Semana 1 quiz option images are hotlinked from `lh3.googleusercontent.com`. If that host fails, the picture area is blank. Semana 1's activity cards ignore their hotlink fields and draw inline SVG instead, so those particular URLs in `Semana1Page` are dead data.

**Reproduce**

1. Open the login page with the network tab throttled.
2. `LoginImage.png` is a multi-megabyte download before the form is fully illustrated.
3. Search the frontend source for `Juaguar`. There is no match, but the file is in `frontend/public/images`.

### F18. Two week-1 games are HTML documents inside the React file, styled from a CDN

**Severity:** Medium

`SortBySizeGamePage.tsx` and `DescriptionMatchGamePage.tsx` each embed a full HTML document in `srcDoc`, including a `<script src="https://cdn.tailwindcss.com">`. If the CDN is blocked, slow, or unavailable, the game renders unstyled. The files are too large to review or change safely. They also do not report a score, which is F4.

**Reproduce**

1. Open `/semana/1/sort-by-size/play` with the CDN blocked.
2. The pieces and shelf are still in the iframe, without the Tailwind layout.

### F19. Score and progress errors are all HTTP 500

**Severity:** Low

`ScoreController` and `ProgressController` catch every failure and respond with "Error al guardar score", "Error al obtener progreso", or "Error al actualizar progreso", status 500. A missing user, a score of 133, a bad semana id, and a down database look the same to the client. `UserController.create` does the same for a failed insert.

`express-validator` is in `backend/package.json` and is not imported.

**Reproduce:** `POST /api/scores` with `{ "userId": "nope", "semanaId": "nope", "score": 10, "type": "quiz" }`. Status is 500, body message is "Error al guardar score".

### F20. Home and Perfil crash if `plataforma_user` is not JSON

**Severity:** Low

`HomePage` and `ProfilePage` call `JSON.parse` on that key with no try/catch. A bad value throws during render or in the effect and blanks the screen.

**Reproduce:** in the console, `localStorage.setItem('plataforma_user', '{')`, then open `/home`.

## Notes that are constraints, not defects

- The product rule is no sessions and no tokens. Endpoints are open on purpose. F5 is the practical result: the name is the only identity, and it is typed by the child.
- Login still has a free-text name field. The same page says the child can enter without typing, and the chips do that. The text field is the part that conflicts with "sin tipeo".
- Production (`fly.toml`) serves the built frontend and the API from one origin. `VITE_API_URL=/api` is set in the Dockerfile, so the local port mismatch does not apply on Fly. `FRONTEND_URL` there is `https://plataforma-ciencias-univo.fly.dev`.

## 1. Configuración de base de datos en Neon.tech

- [x] 1.1 Crear proyecto en Neon.tech y obtener `DATABASE_URL` (pooled connection string)
- [x] 1.2 Crear `db/schema.sql` con DDL idempotente para tablas `categories` y `words` con FK, constraints NOT NULL y campos requeridos
- [x] 1.3 Ejecutar `db/schema.sql` contra la base de datos de Neon para crear las tablas
- [x] 1.4 Crear `db/seed/categories.sql` con INSERT de las 10 categorías (id, name, emoji, language)
- [x] 1.5 Crear `db/seed/words/peliculas-series.sql` con ≥80 palabras en ES+EN
- [x] 1.6 Crear `db/seed/words/personajes-famosos.sql` con ≥80 palabras en ES
- [ ] 1.7 Crear `db/seed/words/animales.sql` con ≥80 palabras en ES
- [ ] 1.8 Crear `db/seed/words/acciones-charadas.sql` con ≥80 palabras en ES
- [ ] 1.9 Crear `db/seed/words/anime.sql` con ≥80 palabras en ES+EN
- [ ] 1.10 Crear `db/seed/words/musica.sql` con ≥80 palabras en ES+EN
- [ ] 1.11 Crear `db/seed/words/arte.sql` con ≥80 palabras en ES
- [ ] 1.12 Crear `db/seed/words/paises.sql` con ≥80 palabras en ES
- [ ] 1.13 Crear `db/seed/words/libros.sql` con ≥80 palabras en ES+EN
- [ ] 1.14 Crear `db/seed/words/videojuegos.sql` con ≥80 palabras en ES+EN
- [x] 1.15 Ejecutar todos los scripts de seed contra Neon y verificar conteos

## 2. Vercel Functions — Backend API

- [x] 2.1 Instalar dependencia `@neondatabase/serverless` en `package.json`
- [x] 2.2 Crear `api/categories.ts` — handler GET `/api/categories` que consulta la tabla `categories` y devuelve `{ categories: [...] }` con CORS y manejo de errores 500/405
- [x] 2.3 Crear `api/categories/[id]/words.ts` — handler GET `/api/categories/:id/words` que ejecuta `SELECT ... ORDER BY RANDOM() LIMIT 50` y devuelve `{ words: [...] }` con CORS y manejo de errores 404/400/500/405
- [x] 2.4 Crear `lib/db.ts` (o `api/_db.ts`) con la instancia compartida del cliente Neon usando `NEON_DATABASE_URL`
- [x] 2.5 Crear `.env.example` con `NEON_DATABASE_URL=` y `EXPO_PUBLIC_API_URL=` documentados
- [x] 2.6 Agregar `.env.local` a `.gitignore` si no está ya incluido

## 3. Configuración de Vercel

- [x] 3.1 Conectar el repositorio a Vercel (crear proyecto via CLI o dashboard)
- [x] 3.2 Configurar variable de entorno `NEON_DATABASE_URL` en Vercel (Production + Preview)
- [x] 3.3 Verificar que el deploy automático desde `main` funciona correctamente
- [x] 3.4 Probar los endpoints desplegados con `curl` o Postman: `GET /api/categories` y `GET /api/categories/1/words`

## 4. Integración en el cliente Expo

- [x] 4.1 Agregar métodos `getCategories()` y `getWords(categoryId: string)` a `src/api/client.ts`
- [x] 4.2 Crear hook `src/hooks/useCategories.ts` con `{ data, error, isLoading }` usando `getCategories()`
- [x] 4.3 Crear hook `src/hooks/useWords.ts` con `{ data, error, isLoading }` usando `getWords(categoryId)`, re-ejecuta cuando cambia `categoryId`
- [x] 4.4 Actualizar `app/(tabs)/index.tsx` para reemplazar el array hardcodeado por `useCategories()`, mostrar spinner durante carga y mensaje de error si falla
- [x] 4.5 Actualizar `app/game/play.tsx` para reemplazar el array hardcodeado por `useWords(categoryId)`, esperar carga antes de iniciar el contador de 60 segundos
- [x] 4.6 Configurar `EXPO_PUBLIC_API_URL` en `.env` apuntando al dominio de Vercel del proyecto
- [x] 4.7 Probar flujo completo en simulador: seleccionar categoría → cargar palabras → jugar ronda completa

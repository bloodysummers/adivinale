## Why

El contenido del juego (categorías y palabras) está actualmente hardcodeado en el cliente. Para poder actualizar el contenido sin publicar nuevas versiones de la app, y para soportar una base de datos centralizada, se necesita un backend REST que sirva las categorías y sus palabras desde PostgreSQL en Neon.tech, desplegado como Vercel Functions.

## What Changes

- Crear una API REST con dos endpoints (`/api/categories` y `/api/categories/:id/words`) desplegada como Vercel Functions.
- Provisionar el esquema de base de datos en Neon.tech (tablas `categories` y `words`) y poblarla con el contenido inicial de las 10 categorías definidas en el producto.
- Agregar configuración de Neon.tech y Vercel al repositorio (`vercel.json`, variables de entorno, scripts de migración/seed).
- Reemplazar los listados hardcodeados en el cliente por llamadas HTTP a los nuevos endpoints a través de `src/api/client.ts`.

## Capabilities

### New Capabilities

- `categories-api`: Endpoint `GET /api/categories` que devuelve el listado de categorías con id, nombre y emoji.
- `words-api`: Endpoint `GET /api/categories/:id/words` que devuelve 50 palabras aleatorias de la categoría indicada.
- `database-seed`: Esquema SQL y seed data para las tablas `categories` y `words` en Neon.tech PostgreSQL.
- `api-client-integration`: Hooks y cliente HTTP en el lado Expo que consumen los endpoints y reemplazan los datos hardcodeados.

### Modified Capabilities

(ninguna — no existen specs previas)

## Impact

- **Nuevo directorio:** `api/` con Vercel Functions (`categories.ts`, `categories/[id]/words.ts`).
- **Nuevo directorio:** `db/` con migrations y seed scripts SQL.
- **Nuevo archivo:** `vercel.json` con configuración de rutas y variables de entorno.
- **Modificado:** `src/api/client.ts` — agregar métodos `getCategories()` y `getWords(categoryId)`.
- **Modificado:** `app/(tabs)/index.tsx` — consumir categorías desde la API en lugar del array local.
- **Modificado:** `app/game/play.tsx` — consumir palabras desde la API en lugar del array local.
- **Nuevas dependencias:** `@neondatabase/serverless` (driver serverless para Neon), `@vercel/postgres` (opcional), `dotenv` para entorno local.
- No toca el flujo de acelerómetro ni la navegación existente.

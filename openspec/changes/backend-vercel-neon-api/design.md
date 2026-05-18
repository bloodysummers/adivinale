## Context

El juego Adivínale actualmente sirve categorías y palabras desde arrays hardcodeados en el cliente Expo. Se necesita moverlos a una base de datos PostgreSQL en Neon.tech y exponerlos mediante una API REST desplegada como Vercel Functions en el mismo repositorio. El cliente Expo consumirá la API a través del wrapper `src/api/client.ts` existente.

## Goals / Non-Goals

**Goals:**
- Definir y desplegar dos endpoints REST en Vercel Functions: `GET /api/categories` y `GET /api/categories/:id/words`.
- Provisionar el esquema en Neon.tech y poblar las 10 categorías con contenido inicial (~100 palabras cada una).
- Reemplazar los datos hardcodeados en el cliente por llamadas a la API.
- Mantener la configuración de Neon (cadena de conexión) en variables de entorno; nunca en código.

**Non-Goals:**
- Autenticación o autorización en los endpoints (API pública de solo lectura).
- Paginación de resultados (se sirven 50 palabras aleatorias por llamada, suficiente para una ronda).
- Panel de administración de contenido.
- Caché en el servidor (Neon pooler es suficiente para la carga esperada).
- Modo offline completo en la app.

## Decisions

### 1. Vercel Functions sobre un servidor Express dedicado

**Decision:** Usar Vercel Functions (serverless) en lugar de un servidor Express en Railway o Render.

**Rationale:** Los endpoints son stateless y de baja carga. Vercel Functions tienen cold starts <1s en Edge Runtime o Node.js, free tier generoso, y la integración con Neon es nativa (Neon ofrece pooling HTTP que elimina el problema de conexiones TCP en entornos serverless).

**Alternativas descartadas:**
- Railway/Render con Express: mayor control pero añade un servicio a mantener y puede "dormir" en free tier.
- Supabase Edge Functions: requeriría migrar la base de datos fuera de Neon.

---

### 2. Driver `@neondatabase/serverless` sobre `pg` estándar

**Decision:** Usar `@neondatabase/serverless` como driver de PostgreSQL.

**Rationale:** El driver de Neon usa HTTP/WebSockets para las queries, lo que es compatible con entornos serverless que no mantienen conexiones TCP persistentes. `pg` estándar requiere connection pooling externo (PgBouncer) que complica el setup gratuito.

---

### 3. Estructura de directorios API en `api/`

**Decision:** Colocar las Vercel Functions en `api/categories.ts` y `api/categories/[id]/words.ts`.

**Rationale:** Vercel infiere las rutas automáticamente desde el directorio `api/`. No se necesita `vercel.json` de rewrites para este caso. El directorio `db/` contendrá migrations y seed por separado.

```
api/
├── categories.ts              → GET /api/categories
└── categories/
    └── [id]/
        └── words.ts           → GET /api/categories/:id/words
db/
├── schema.sql                 → DDL de tablas
└── seed/
    ├── categories.sql
    └── words/
        ├── peliculas-series.sql
        ├── personajes-famosos.sql
        └── ...
```

---

### 4. Aleatorización en la base de datos (`ORDER BY RANDOM()`)

**Decision:** La selección de 50 palabras aleatorias se hace en la query SQL con `ORDER BY RANDOM() LIMIT 50`.

**Rationale:** Mantiene la lógica en la capa de datos. Para el tamaño esperado de tablas (<5,000 palabras por categoría), `ORDER BY RANDOM()` tiene rendimiento aceptable. Alternativas como reservoir sampling o shuffling en la aplicación añaden complejidad innecesaria.

---

### 5. Reemplazo de datos hardcodeados en el cliente

**Decision:** Reemplazar los arrays locales por hooks `useCategories()` y `useWords(categoryId)` que llaman a la API via `src/api/client.ts`.

**Rationale:** Sigue el patrón ya establecido en el proyecto. Los hooks exponen `{ data, error, isLoading }` consistente con el resto del código.

**Variables de entorno en Expo:** La URL base de la API se configurará como `EXPO_PUBLIC_API_URL` en `.env` para que sea accesible en el cliente.

## Risks / Trade-offs

| Riesgo | Mitigación |
|--------|-----------|
| Cold start de Vercel Function en primera llamada del día | Acceptable para un juego de fiesta; no es tiempo real crítico. |
| `ORDER BY RANDOM()` lento con tablas muy grandes | Las tablas no superarán ~5,000 filas; el costo es despreciable. |
| Neon free tier tiene límite de 0.5 GB storage y 100 hr compute/mes | Suficiente para un proyecto hobby; monitorear si crece. |
| Credenciales de DB en variables de entorno de Vercel | Nunca commitear `.env.local`; usar `.env.example` como referencia. |
| El cliente Expo puede hacer llamadas a la API antes de que el servidor esté listo | Mostrar estado de carga en la pantalla de selección de categoría. |

## Migration Plan

1. Crear el proyecto en Neon.tech y obtener `DATABASE_URL` (pooled connection string).
2. Ejecutar `db/schema.sql` contra la base de datos para crear las tablas.
3. Ejecutar los scripts `db/seed/` para poblar el contenido.
4. Configurar `NEON_DATABASE_URL` como variable de entorno en Vercel (Production + Preview).
5. Desplegar las Vercel Functions haciendo push a `main` (CI automático de Vercel).
6. Verificar los endpoints con `curl` antes de modificar el cliente.
7. Actualizar `src/api/client.ts` con los nuevos métodos y reemplazar datos hardcodeados en las pantallas.
8. Configurar `EXPO_PUBLIC_API_URL` en `.env` apuntando al dominio de Vercel.

**Rollback:** Si la API falla, revertir el commit del cliente para volver a los arrays locales. La base de datos no necesita rollback (no reemplaza nada crítico).

## Open Questions

- ¿Cuántas palabras por categoría en el seed inicial? (sugerido: ~100-150 por categoría)
- ¿Se necesita un endpoint de health check (`/api/health`) para Vercel?
- ¿El dominio de Vercel será el default (`<project>.vercel.app`) o se usará un dominio custom?

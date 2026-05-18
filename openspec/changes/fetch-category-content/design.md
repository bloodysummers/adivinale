## Context

La tabla `words` en Neon.tech tiene contenido solo para Películas (20) y Series (20). Las 8 categorías restantes están vacías. Se necesita poblar la DB con 500–1000 elementos por categoría usando fuentes públicas y reproducibles, ejecutando scripts localmente como herramienta de mantenimiento (no como parte del runtime de la app).

## Goals / Non-Goals

**Goals:**
- Scripts ejecutables localmente que consulten APIs públicas y generen INSERTs SQL idempotentes.
- 500–1000 elementos por categoría con contenido diverso, no solo los más populares.
- Películas y Series con nombre en ES (español latinoamericano) y EN cuando existan ambas versiones.
- Scripts independientes por categoría: cada uno se puede ejecutar y verificar por separado.

**Non-Goals:**
- Automatización en CI/CD (los scripts se ejecutan manualmente).
- Actualización periódica automática del contenido.
- Deduplicación semántica avanzada (se usa `ON CONFLICT DO NOTHING` para evitar duplicados exactos).
- Traducción automática de nombres que no tengan traducción oficial.

## Decisions

### 1. Scripts TypeScript ejecutados con `tsx` (no compilados)

**Decision:** `npx tsx db/scripts/fetch-<categoria>.ts` en lugar de compilar a JS primero.

**Rationale:** `tsx` ejecuta TypeScript directamente sin configuración extra. Elimina el paso de build y es el estándar de facto para scripts de Node.js en proyectos TypeScript modernos. No requiere cambios al tsconfig existente.

---

### 2. Output: archivos SQL + ejecución directa opcional

**Decision:** Cada script genera un archivo `.sql` en `db/seed/words/` Y puede ejecutarlo directamente contra Neon si se pasa `--execute`.

**Rationale:** Permite revisar el contenido antes de insertarlo. El archivo SQL queda como artefacto versionable. Con `--execute` se puede aplicar en un solo paso cuando el contenido ya fue revisado.

---

### 3. Utilidad compartida `db/scripts/_utils.ts`

**Decision:** Módulo común con helpers para: escribir SQL, conectar a Neon, escapar strings, y paginar APIs.

**Rationale:** Todos los scripts comparten el mismo patrón (fetch → transform → write SQL). Centralizar evita duplicar lógica de escape y escritura de archivos.

---

### 4. Fuentes por categoría

| Categoría | API / Dataset | Auth |
|-----------|--------------|------|
| Películas/Series | TMDB API v3 | API Key (gratis) |
| Anime | AniList GraphQL | Sin auth |
| Música | MusicBrainz API | Sin auth |
| Videojuegos | RAWG API | API Key (gratis) |
| Libros | Open Library API | Sin auth |
| Personajes famosos | Wikidata SPARQL | Sin auth |
| Animales | Wikidata SPARQL | Sin auth |
| Arte | Wikidata SPARQL + Met Museum API | Sin auth |

**Rationale por fuente:**
- **TMDB**: estándar del sector para cine/TV, tiene traducciones al español (es-MX).
- **AniList**: GraphQL, paginación sencilla, campo `title.spanish` y `title.english`.
- **MusicBrainz**: base de datos open source, sin rate limit agresivo con User-Agent correcto.
- **RAWG**: el dataset más completo de videojuegos, 500k+ títulos, gratis hasta 20k req/mes.
- **Open Library**: cubre libros y autores, sin key, paginación por subject/popular.
- **Wikidata SPARQL**: fuente canónica para personas, animales y arte; consultas flexibles por tipo.
- **Met Museum**: complementa Wikidata con obras de arte con nombres en inglés y español.

---

### 5. Estrategia de bilingüismo para Películas y Series

**Decision:** Insertar dos filas por título cuando exista traducción oficial: una con `language='es'` (nombre en español latinoamericano) y otra con `language='en'` (título original en inglés). Si solo existe uno de los dos, insertar solo esa fila.

**Rationale:** El juego puede mostrar ambas versiones en distintas rondas. Mantener filas separadas es más simple que un campo `text_en` adicional y no rompe el esquema existente.

---

### 6. Rate limiting en scripts

**Decision:** Añadir `sleep(300ms)` entre páginas de requests. Para MusicBrainz usar 1000ms (su política pide max 1 req/seg).

**Rationale:** Evita bans de IPs y errores 429. Los scripts son de ejecución única, la latencia no importa.

## Risks / Trade-offs

| Riesgo | Mitigación |
|--------|-----------|
| API keys de TMDB y RAWG expuestas en scripts | Leer de `.env.local`, nunca hardcodear |
| Wikidata SPARQL puede timeout con queries grandes | Paginar con LIMIT/OFFSET, reintentar |
| Nombres en español con caracteres especiales rompen SQL | Usar `replace()` para escapar comillas simples en `_utils.ts` |
| Contenido duplicado entre ejecuciones | `ON CONFLICT DO NOTHING` en todos los INSERTs |
| MusicBrainz requiere User-Agent descriptivo | Incluir `User-Agent: adivinale-game/1.0` en headers |

## Migration Plan

1. Agregar `TMDB_API_KEY` y `RAWG_API_KEY` a `.env.local` y `.env.example`.
2. Ejecutar scripts por categoría en cualquier orden: `npx tsx db/scripts/fetch-<cat>.ts`.
3. Revisar el `.sql` generado en `db/seed/words/`.
4. Ejecutar con `--execute` o correr el SQL desde el dashboard de Neon.
5. Verificar conteos con `SELECT category_id, COUNT(*) FROM words GROUP BY category_id`.

No hay rollback necesario — si el contenido es incorrecto se trunca la categoría y se re-ejecuta el script.

## 0. Migración de esquema — campo subtext

- [x] 0.1 Agregar columna `subtext TEXT` nullable a la tabla `words` en `db/schema.sql`
- [x] 0.2 Ejecutar `ALTER TABLE words ADD COLUMN IF NOT EXISTS subtext TEXT;` en Neon
- [x] 0.3 Actualizar `src/types/index.ts` — agregar `subtext?: string` a la interfaz `Word`
- [x] 0.4 Actualizar `api/categories/[id]/words.ts` — incluir `subtext` en el SELECT y en la respuesta
- [x] 0.5 Actualizar `src/components/WordDisplay.tsx` — mostrar `subtext` debajo del `text` principal cuando esté presente
- [x] 0.6 Actualizar el seed existente `db/seed/words/peliculas.sql` — agregar `subtext` con el título en inglés a los registros que aplique (ej. `El Rey León` → subtext `The Lion King`)
- [x] 0.7 Deploy a Vercel y verificar que el endpoint `/api/categories/peliculas/words` devuelve el campo `subtext`

## 1. Setup compartido

- [x] 1.1 Instalar `tsx` como devDependency (`npm install --save-dev tsx`)
- [x] 1.2 Crear `db/scripts/_utils.ts` con helpers: `escapeSql(str)`, `writeSQL(path, rows)`, `sleep(ms)`, `executeSQL(sql)` (conecta a Neon con `NEON_DATABASE_URL`)
- [x] 1.3 Agregar `TMDB_API_KEY=` y `RAWG_API_KEY=` a `.env.example` y a `.env.local`
- [x] 1.4 Agregar scripts npm en `package.json`: `"fetch:anime"`, `"fetch:musica"`, `"fetch:videojuegos"`, `"fetch:libros"`, `"fetch:peliculas"`, `"fetch:personajes"`, `"fetch:animales"`, `"fetch:arte"`

## 2. Fase 1 — Países (sin API, lista fija)

- [x] 2.1 Crear `db/scripts/fetch-paises.ts` que use RestCountries API (`https://restcountries.com/v3.1/all`) y genere `db/seed/words/paises.sql` con los nombres en español de todos los países
- [x] 2.2 Ejecutar el script y verificar que `db/seed/words/paises.sql` contiene ~195 filas
- [x] 2.3 Insertar `paises` en tabla `categories` si no existe y ejecutar el seed en Neon
- [x] 2.4 Verificar con `SELECT COUNT(*) FROM words WHERE category_id = 'paises'`

## 3. Fase 2 — Anime (AniList, sin API key)

- [x] 3.1 Crear `db/scripts/fetch-anime.ts` que pagine AniList GraphQL (`/graphql`) ordenando por `POPULARITY_DESC`, obteniendo 500–1000 títulos con `title.spanish` y `title.english`
- [x] 3.2 Ejecutar el script y revisar `db/seed/words/anime.sql`
- [x] 3.3 Insertar `anime` en tabla `categories` si no existe y ejecutar el seed en Neon
- [x] 3.4 Verificar con `SELECT COUNT(*) FROM words WHERE category_id = 'anime'`

## 4. Fase 3 — Videojuegos (RAWG API)

- [x] 4.1 Crear `db/scripts/fetch-videojuegos.ts` que pagine RAWG `/games` con `ordering=-rating&page_size=40`, obteniendo 500–1000 juegos; validar que `RAWG_API_KEY` esté definida
- [x] 4.2 Ejecutar el script y revisar `db/seed/words/videojuegos.sql`
- [x] 4.3 Insertar `videojuegos` en tabla `categories` si no existe y ejecutar el seed en Neon
- [x] 4.4 Verificar con `SELECT COUNT(*) FROM words WHERE category_id = 'videojuegos'`

## 5. Fase 4 — Música (MusicBrainz, sin API key)

- [x] 5.1 Crear `db/scripts/fetch-musica.ts` que consulte MusicBrainz `/ws/2/artist` con `query=*&fmt=json`, respetando 1000ms entre requests y enviando User-Agent correcto; obtener 500–1000 artistas/bandas
- [x] 5.2 Ejecutar el script y revisar `db/seed/words/musica.sql`
- [x] 5.3 Insertar `musica` en tabla `categories` si no existe y ejecutar el seed en Neon
- [x] 5.4 Verificar con `SELECT COUNT(*) FROM words WHERE category_id = 'musica'`

## 6. Fase 5 — Películas y Series (TMDB API)

- [x] 6.1 Crear `db/scripts/fetch-peliculas-series.ts` que pagine TMDB `discover/movie` y `discover/tv` con `language=es-MX&sort_by=popularity.desc`; insertar una fila por título con `text` en español, `subtext` con el título en inglés cuando difiera; validar que `TMDB_API_KEY` esté definida
- [x] 6.2 Ejecutar el script y revisar `db/seed/words/peliculas-tmdb.sql` y `db/seed/words/series-tmdb.sql`
- [x] 6.3 Truncar el contenido previo de `peliculas` y `series` en Neon y ejecutar los nuevos seeds
- [x] 6.4 Verificar con `SELECT category_id, COUNT(*) FROM words WHERE category_id IN ('peliculas','series') GROUP BY category_id`

## 7. Fase 6 — Libros (Open Library, sin API key)

- [x] 7.1 Crear `db/scripts/fetch-libros.ts` que consulte Open Library `search.json` por subjects populares (fiction, history, science, etc.), deduplicando autores; obtener 500–1000 elementos entre títulos y autores
- [x] 7.2 Ejecutar el script y revisar `db/seed/words/libros.sql`
- [x] 7.3 Insertar `libros` en tabla `categories` si no existe y ejecutar el seed en Neon
- [x] 7.4 Verificar con `SELECT COUNT(*) FROM words WHERE category_id = 'libros'`

## 8. Fase 7 — Personajes Famosos (Wikidata SPARQL)

- [x] 8.1 Crear `db/scripts/fetch-personajes.ts` con queries SPARQL para personas por ocupación (actores, deportistas, músicos, políticos, científicos, escritores, artistas, personajes históricos); paginar con LIMIT/OFFSET para alcanzar 500–1000
- [x] 8.2 Ejecutar el script y revisar `db/seed/words/personajes-famosos.sql`
- [x] 8.3 Insertar `personajes-famosos` en tabla `categories` si no existe y ejecutar el seed en Neon
- [x] 8.4 Verificar con `SELECT COUNT(*) FROM words WHERE category_id = 'personajes-famosos'`

## 9. Fase 8 — Animales (Wikidata SPARQL)

- [x] 9.1 Crear `db/scripts/fetch-animales.ts` con query SPARQL para taxones animales con etiqueta en español, filtrando nombres >40 caracteres o con paréntesis; obtener ~500 animales de distintos grupos
- [x] 9.2 Ejecutar el script y revisar `db/seed/words/animales.sql`
- [x] 9.3 Insertar `animales` en tabla `categories` si no existe y ejecutar el seed en Neon
- [x] 9.4 Verificar con `SELECT COUNT(*) FROM words WHERE category_id = 'animales'`

## 10. Fase 9 — Arte (Wikidata + Met Museum)

- [x] 10.1 Crear `db/scripts/fetch-arte.ts` que obtenga: artistas de Wikidata (pintores, escultores, fotógrafos), obras del Met Museum API (`/objects` con departamento de bellas artes), y movimientos artísticos de Wikidata; alcanzar 500–1000 elementos en total
- [x] 10.2 Ejecutar el script y revisar `db/seed/words/arte.sql`
- [x] 10.3 Insertar `arte` en tabla `categories` si no existe y ejecutar el seed en Neon
- [x] 10.4 Verificar con `SELECT COUNT(*) FROM words WHERE category_id = 'arte'`

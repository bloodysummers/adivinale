## Why

Las 8 categorías restantes del juego no tienen contenido en la base de datos. En lugar de generar listas manualmente (que producen solo los elementos más conocidos), se obtiene contenido desde APIs y datasets públicos para lograr catálogos de 500–1000 elementos por categoría, con mayor diversidad y cobertura.

## What Changes

- Crear scripts TypeScript en `db/scripts/` que consulten APIs públicas y generen archivos SQL de seed por categoría.
- Poblar la tabla `words` en Neon.tech con 500–1000 elementos por cada una de las 8 categorías pendientes.
- Para Películas y Series (ya seedeadas con 20 elementos cada una) ampliar el contenido con nombre en español latinoamericano y nombre en inglés cuando aplique, obtenidos desde TMDB.
- El campo `text` de la tabla `words` almacenará el nombre en español cuando exista traducción oficial, y el nombre en inglés como alternativa. Para Películas y Series se insertarán dos filas por título cuando existan ambas versiones (una en `'es'` y otra en `'en'`).

## Capabilities

### New Capabilities

- `fetch-anime`: Script que consulta AniList GraphQL API para obtener los 500–1000 títulos de anime más populares (nombre en español e inglés cuando existan).
- `fetch-musica`: Script que consulta MusicBrainz API para obtener 500–1000 artistas y bandas relevantes en español e inglés.
- `fetch-videojuegos`: Script que consulta RAWG API para obtener los 500–1000 videojuegos más populares de cualquier época.
- `fetch-libros`: Script que consulta Open Library API para obtener 500–1000 títulos y autores de libros reconocidos.
- `fetch-peliculas-series`: Script que consulta TMDB API para ampliar películas y series con nombres en español (LA) e inglés, alcanzando 500–1000 por categoría.
- `fetch-personajes`: Script que consulta Wikidata SPARQL para obtener 500–1000 personas famosas de diversas profesiones y épocas.
- `fetch-animales`: Script que consulta Wikidata SPARQL para obtener ~500 nombres de animales en español.
- `fetch-arte`: Script que consulta Wikidata SPARQL + Met Museum API para obtener 500–1000 elementos entre obras, artistas, estilos y movimientos artísticos.

### Modified Capabilities

(ninguna)

## Impact

- **Nuevo directorio:** `db/scripts/` con un script por categoría + utilidad compartida `db/scripts/_utils.ts`.
- **Modificado:** `db/seed/words/peliculas.sql` y `series.sql` — se reemplazarán con los generados por TMDB.
- **Nuevas dependencias de desarrollo:** ninguna adicional (fetch nativo de Node 18+, RAWG API key requerida).
- **Variables de entorno:** `TMDB_API_KEY`, `RAWG_API_KEY` (gratuitas) necesarias para ejecutar los scripts; no son necesarias en producción.
- No afecta pantallas, hooks, store ni flujo de acelerómetro.

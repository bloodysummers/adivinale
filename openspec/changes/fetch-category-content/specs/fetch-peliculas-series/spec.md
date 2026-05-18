## ADDED Requirements

### Requirement: Script de fetch para Películas y Series desde TMDB
El sistema SHALL proveer un script `db/scripts/fetch-peliculas-series.ts` que consulte TMDB API v3 y genere `db/seed/words/peliculas-tmdb.sql` y `db/seed/words/series-tmdb.sql` con 500–1000 elementos cada uno, incluyendo nombre en español (es-MX) y en inglés cuando existan ambas versiones.

#### Scenario: Ejecución exitosa del script
- **WHEN** se ejecuta `npx tsx db/scripts/fetch-peliculas-series.ts`
- **THEN** se generan ambos archivos SQL con al menos 500 filas por categoría entre versiones ES y EN

#### Scenario: API key requerida
- **WHEN** `TMDB_API_KEY` no está definida en el entorno
- **THEN** el script falla con mensaje: `Error: TMDB_API_KEY no está configurada en .env.local`

#### Scenario: Película con título en español disponible
- **WHEN** TMDB devuelve un `title` distinto al `original_title` para `language=es-MX`
- **THEN** se inserta una fila con `language='es'`, `text` = título en español y `subtext` = título original en inglés

#### Scenario: Película sin traducción al español
- **WHEN** el `title` en `es-MX` es igual al `original_title` o no existe
- **THEN** se inserta una fila con `language='en'`, `text` = título original y `subtext` NULL

#### Scenario: Ordenamiento por popularidad
- **WHEN** el script consulta TMDB
- **THEN** usa el endpoint `discover/movie` y `discover/tv` ordenados por `popularity.desc`, cubriendo múltiples géneros y épocas

#### Scenario: Reemplazo del seed inicial
- **WHEN** se ejecuta el script y luego el SQL generado
- **THEN** el contenido previo de las categorías `peliculas` y `series` puede truncarse y reemplazarse con el nuevo contenido más completo

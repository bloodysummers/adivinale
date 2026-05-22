## Why

El contenido actual tiene entre 600 y 1 039 palabras por categoría, generadas sin criterio de popularidad ni curación de subcategorías. El resultado es que la mayoría de los elementos son desconocidos para el público general, lo que hace las partidas frustrantes. Se necesita un reset completo del contenido con criterios claros de calidad antes de la primera distribución pública.

## What Changes

- **Migración de esquema**: agregar columna `subcategory text` a la tabla `words` para registrar de qué sub-lote proviene cada entrada.
- **Truncar la tabla `words`**: vaciar completamente el contenido actual y regenerar desde cero.
- **Target por categoría: 150–200 palabras** (suficiente para múltiples rondas sin repetición excesiva).
- **Subcategorías por categoría**: cada categoría se divide en sub-lotes curados para garantizar distribución equilibrada y evitar sesgos hacia un solo tipo de contenido.
- **Criterios de calidad transversales**:
  - **Familiaridad LATAM**: priorizar contenido reconocible para el público mexicano/latinoamericano de 15–50 años.
  - **Describibilidad**: excluir elementos demasiado técnicos, muy de nicho, o difíciles de describir en voz sin verlos escritos.
  - **Longitud**: máximo 40 caracteres por entrada.
  - **Balance de dificultad**: ~40 % fácil (todos conocen), ~40 % medio (la mayoría conoce), ~20 % difícil (solo algunos conocen).
  - **Sin duplicados cross-categoría**: un personaje de videojuego no aparece también en Personajes Famosos.
- **Config centralizado**: archivo `db/scripts/config/subcategories.ts` que define todas las categorías con sus sub-lotes y límites. Este archivo es el único punto de control del contenido; actualizarlo es suficiente para regenerar o ajustar lotes.
- **Generación de contenido por IA**: las listas de palabras son generadas directamente por Claude (sin consultar APIs externas), basándose en criterios de popularidad y familiaridad LATAM. El resultado se exporta como archivos SQL listos para revisión humana.
- **Script de reset**: `db/scripts/reset-words.ts` que trunca `words` antes de reinsertar (requiere flag `--execute`).

## Capabilities

### New Capabilities

- `words-reset-script`: script `db/scripts/reset-words.ts` que trunca la tabla `words` en Neon con confirmación por flag `--execute`.
- `subcategories-config`: archivo `db/scripts/config/subcategories.ts` con la definición completa de categorías, sub-lotes y límites — es la fuente de verdad para la generación de contenido.
- `curated-words-peliculas`: `db/seed/words/peliculas-curated.sql` con ≤180 películas en 6 sub-lotes.
- `curated-words-series`: `db/seed/words/series-curated.sql` con ≤160 series en 5 sub-lotes.
- `curated-words-personajes`: `db/seed/words/personajes-curated.sql` con ≤175 personajes famosos en 6 sub-lotes.
- `curated-words-animales`: `db/seed/words/animales-curated.sql` con ≤150 animales en 6 sub-lotes.
- `curated-words-anime`: `db/seed/words/anime-curated.sql` con ≤150 entradas de anime en 5 sub-lotes.
- `curated-words-musica`: `db/seed/words/musica-curated.sql` con ≤175 artistas/canciones en 5 sub-lotes.
- `curated-words-arte`: `db/seed/words/arte-curated.sql` con ≤150 artistas/obras en 5 sub-lotes.
- `curated-words-paises`: `db/seed/words/paises-curated.sql` con ≤150 países en 5 sub-lotes.
- `curated-words-libros`: `db/seed/words/libros-curated.sql` con ≤160 títulos/autores en 5 sub-lotes.
- `curated-words-videojuegos`: `db/seed/words/videojuegos-curated.sql` con ≤180 juegos/personajes en 5 sub-lotes.

### Modified Capabilities

<!-- ninguna spec existente cambia requisitos -->

## Impact

- **DB schema**: columna `subcategory text` añadida a `words` vía migración `ALTER TABLE`.
- **DB datos**: tabla `words` truncada y repoblada (~1 500–2 000 filas totales vs ~7 389 actuales).
- **Scripts**: nuevo `db/scripts/reset-words.ts`; archivo de config `db/scripts/config/subcategories.ts`.
- **Seed files**: archivos SQL en `db/seed/words/` regenerados con columna `subcategory` incluida.
- **Sin cambios en la app**: la API, las pantallas y los hooks no se tocan — solo cambia el contenido de la DB.
- **Sin dependencias externas de generación**: no hay llamadas a TMDB, Wikidata, RAWG ni RestCountries; el contenido es generado y revisado manualmente antes de tocar la DB.

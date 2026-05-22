## Context

La tabla `words` tiene ~7 389 filas distribuidas en 10 categorías (600–1 039 por categoría). Los scripts actuales hacen fetch sin discriminación de subcategorías y sin criterios de familiaridad LATAM. El resultado es una cola de elementos muy de nicho que llegan inevitablemente a las rondas.

El nuevo enfoque elimina por completo la dependencia de APIs externas para generación de contenido. En su lugar, Claude genera listas curadas directamente basándose en criterios de popularidad y familiaridad LATAM, y las exporta como archivos SQL que el usuario revisa antes de cualquier operación en la DB.

## Goals / Non-Goals

**Goals:**
- Vaciar `words` y repoblar con 150–200 elementos por categoría (~1 500–2 000 total).
- Dividir cada categoría en sub-lotes con un `LIMIT` individual para garantizar distribución.
- Aplicar criterios de popularidad, familiaridad LATAM, describibilidad y longitud.
- Todo el contenido pasa por revisión humana antes de insertarse en la DB.
- Sin dependencias de APIs externas para la generación de contenido.

**Non-Goals:**
- Generación automática o scripted de contenido desde APIs (TMDB, RAWG, Wikidata, RestCountries).
- Edición manual de cada palabra por parte del humano durante la generación (el humano aprueba lotes, no edita ítem por ítem).
- Moderación de sugerencias de usuarios (fuera del scope).
- Cambios en la app, la API o los hooks.

## Schema Change

Se agrega la columna `subcategory` a la tabla `words`:

```sql
ALTER TABLE words ADD COLUMN IF NOT EXISTS subcategory text;
CREATE INDEX IF NOT EXISTS idx_words_category_subcategory ON words(category_id, subcategory);
```

- Tipo `text` nullable — los registros existentes quedan con `NULL`; los nuevos seeds siempre llenan el campo.
- Sin constraint `NOT NULL` intencionalmente para no romper inserts existentes.
- Un índice compuesto `(category_id, subcategory)` acompaña la migración.

## Decisions

### Generación por IA en lugar de fetch de APIs
Las listas curadas son generadas por Claude directamente en la conversación. Esto elimina:
- Latencia y rate limits de APIs externas
- Claves de API en los scripts de generación
- Variabilidad de resultados según disponibilidad del API
- Elementos de nicho que pasan filtros de popularidad pero son desconocidos para el público LATAM

**Alternativa descartada**: fetch automático desde TMDB/RAWG/Wikidata — se descarta porque el volumen objetivo (150–200 por categoría) es lo suficientemente pequeño como para curación directa con mejor calidad de resultado.

### Config centralizado como fuente de verdad
Todos los parámetros de sub-lotes viven en `db/scripts/config/subcategories.ts`. Este archivo define qué generar; Claude lo lee para producir listas coherentes. Actualizar el config es suficiente para pedir una regeneración o ajuste de cualquier categoría.

```ts
// db/scripts/config/subcategories.ts
export type SubcategoryDef = {
  label: string;    // se guarda en word.subcategory
  limit: number;    // target de items para este sub-lote
};

export type CategoryConfig = {
  id: string;
  name: string;
  emoji: string;
  language: 'es' | 'en' | 'es+en';
  subcategories: SubcategoryDef[];
};

export const CATEGORIES: CategoryConfig[] = [ ... ];
```

### Output como SQL con columna subcategory
Los archivos generados son SQL planos en `db/seed/words/<categoria>-curated.sql`, con el formato:

```sql
INSERT INTO words (category_id, text, language, subtext, subcategory) VALUES
  ('peliculas', 'El Padrino', 'es', 'The Godfather', 'Clásicos pre-1990'),
  ...
ON CONFLICT DO NOTHING;
```

Este formato es fácil de revisar visualmente, ejecutable directamente con `psql` o con el script `reset-words.ts`, y sirve como backup permanente del contenido curado.

### Truncar en lugar de hacer diff
`TRUNCATE words` seguido de reinserción completa es más simple que calcular un diff. Los archivos SQL en `db/seed/words/` funcionan como backup; el script `reset-words.ts` requiere `--execute` para no ejecutarse por accidente.

### Idioma del texto por categoría

| Categoría | `text` (campo principal) | `subtext` (campo secundario) |
|---|---|---|
| Películas | Título en español | Título en inglés (si difiere) |
| Series | Título en español | Título en inglés (si difiere) |
| Personajes Famosos | Nombre en español/hispanizado | — |
| Anime (títulos) | Título en español | Título en inglés/japonés transliterado |
| Anime (personajes) | Nombre más reconocido en LATAM | — |
| Videojuegos | Nombre en inglés (forma más conocida) | — |
| Países | Nombre en español | — |
| Música | Nombre original en alfabeto latino | — |
| Arte | Español para artistas; título más conocido para obras | — |
| Libros (títulos) | Título en español (traducción oficial cuando existe) | — |
| Libros (autores) | Nombre hispanizado cuando aplica | — |
| Animales | Nombre en español | — |

**Regla general:** si el texto usa un alfabeto no latino (árabe, chino, cirílico, japonés kana/kanji) se omite la entrada.

## Subcategory breakdown

| Categoría | Subcategorías | Target |
|-----------|--------------|--------|
| **Películas** | Clásicos pre-1990 · Décadas 90s · Décadas 2000s · Décadas 2010-2024 · Animación · Superhéroes/Acción | 180 |
| **Series** | Drama · Comedia · Animadas adultos · Reality/Documental · Recientes populares | 160 |
| **Personajes Famosos** | Actores/Actrices · Deportistas · Músicos/Artistas · Políticos históricos · Empresarios/Innovadores · Influencers digitales | 175 |
| **Animales** | Domésticos/granja · Mamíferos salvajes · Marinos · Aves · Reptiles/anfibios · Insectos/arácnidos | 150 |
| **Anime** | Shōnen/Acción · Comedia/Slice of Life · Drama/Seinen · Familiar/Ghibli · Personajes icónicos | 150 |
| **Música** | Pop internacional · Rock/Metal · Reggaetón/Urbano · Latinos clásicos · Canciones icónicas | 175 |
| **Arte** | Pintores clásicos · Pintores modernos · Pinturas famosas · Esculturas · Contemporáneos | 150 |
| **Países** | Europa occidental · Américas · Asia conocida · África reconocida · Resto | 150 |
| **Libros** | Clásicos universales · Literatura latina · Bestsellers modernos · Sagas populares · Autores icónicos | 160 |
| **Videojuegos** | Nintendo clásico · Títulos 90s/2000s · Títulos modernos · Franquicias PlayStation/Xbox · Personajes icónicos | 180 |

**Total estimado: ~1 630 palabras** (vs 7 389 actuales)

## Risks / Trade-offs

- **[Pérdida irreversible]** El truncate borra el contenido actual → Mitigación: los SQL files en `db/seed/words/` son el backup; el script `reset-words.ts` requiere `--execute`.
- **[Calidad de generación]** Las listas generadas por IA pueden incluir elementos subóptimos → Mitigación: revisión humana obligatoria antes de cualquier operación en DB (gate explícito en tasks).
- **[Regeneración parcial]** Si el usuario quiere ajustar una sola categoría, basta pedir regeneración de ese archivo SQL y revisar solo ese lote.

## Migration Plan

1. Ejecutar migración de esquema: `ALTER TABLE words ADD COLUMN IF NOT EXISTS subcategory text` + índice compuesto.
2. Completar `db/scripts/config/subcategories.ts` con todos los sub-lotes.
3. Generar archivos SQL curados por categoría (uno a la vez, con revisión entre cada uno si se desea).
4. Revisar todos los archivos SQL generados.
5. Ejecutar `tsx db/scripts/reset-words.ts --execute` (trunca `words`).
6. Ejecutar cada archivo SQL contra Neon: `psql $DATABASE_URL -f db/seed/words/<categoria>-curated.sql`.
7. Verificar con `SELECT category_id, subcategory, count(*) FROM words GROUP BY category_id, subcategory ORDER BY category_id, subcategory`.
8. **Rollback**: re-ejecutar los SQL files originales de `db/seed/words/*.sql`. La columna `subcategory` puede quedarse — es nullable.

## Open Questions

- ¿Debe el script de Música incluir canciones además de artistas? Decisión actual: mezcla 50/50.
- ¿Los libros deben ser títulos o autores? Decisión actual: ~70% títulos + ~30% autores muy conocidos.
- ¿Se generan todas las categorías en una sola sesión o en sesiones separadas? Decisión: según disponibilidad del usuario para revisión.

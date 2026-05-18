## ADDED Requirements

### Requirement: Script de fetch para Anime desde AniList
El sistema SHALL proveer un script `db/scripts/fetch-anime.ts` que consulte la AniList GraphQL API y genere `db/seed/words/anime.sql` con 500–1000 títulos de anime populares de cualquier época.

#### Scenario: Ejecución exitosa del script
- **WHEN** se ejecuta `npx tsx db/scripts/fetch-anime.ts`
- **THEN** se genera `db/seed/words/anime.sql` con INSERTs para la categoría `anime`, con al menos 500 filas

#### Scenario: Título con nombre en español disponible
- **WHEN** un título de AniList tiene `title.spanish` no nulo
- **THEN** se inserta una fila con `language='es'`, `text` = `title.spanish` y `subtext` = `title.english` (o `title.romaji` si no hay inglés)

#### Scenario: Título sin nombre en español
- **WHEN** un título de AniList no tiene `title.spanish`
- **THEN** se inserta una fila con `language='en'`, `text` = `title.english` o `title.romaji`, y `subtext` NULL

#### Scenario: Script con flag --execute
- **WHEN** se ejecuta `npx tsx db/scripts/fetch-anime.ts --execute`
- **THEN** el script además de generar el SQL lo ejecuta directamente contra Neon usando `NEON_DATABASE_URL`

#### Scenario: Deduplicación en base de datos
- **WHEN** se ejecuta el script dos veces
- **THEN** la segunda ejecución no duplica filas (el SQL usa `ON CONFLICT DO NOTHING`)

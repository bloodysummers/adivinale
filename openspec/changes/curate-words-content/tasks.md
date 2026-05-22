## 1. DB Schema Migration

- [x] 1.1 Create `db/migrations/001_add_subcategory_to_words.sql` with `ALTER TABLE words ADD COLUMN IF NOT EXISTS subcategory text` and `CREATE INDEX IF NOT EXISTS idx_words_category_subcategory ON words(category_id, subcategory)`
- [x] 1.2 Run the migration against Neon and confirm `\d words` shows the new column

## 2. Centralized Subcategory Config

- [x] 2.1 Create `db/scripts/config/subcategories.ts` exporting `CATEGORIES: CategoryConfig[]` with all categories, sub-lotes, limits, and language — this is the single source of truth that drives content generation

> **⛔ GATE — Config first**: Do NOT generate any content (SQL files) until task 2.1 is complete. All SQL generation is guided by this config.

## 3. Reset Script

- [x] 3.1 Create `db/scripts/reset-words.ts` — reads row count, prints dry-run summary without `--execute`, executes `TRUNCATE words` with `--execute`

## 4. Generate: Películas

- [x] 4.1 Generate `db/seed/words/peliculas-curated.sql` — ≤180 rows in 6 sub-lotes (Clásicos pre-1990, Décadas 90s, Décadas 2000s, Décadas 2010-2024, Animación, Superhéroes/Acción); `text` = Spanish title, `subtext` = English title when different

## 5. Generate: Series

- [x] 5.1 Generate `db/seed/words/series-curated.sql` — ≤160 rows in 5 sub-lotes (Drama, Comedia, Animadas adultos, Reality/Documental, Recientes populares); `text` = Spanish title when well-known, `subtext` = English original when different

## 6. Generate: Personajes Famosos

- [x] 6.1 Generate `db/seed/words/personajes-curated.sql` — ≤175 rows in 6 sub-lotes (Actores/Actrices, Deportistas, Músicos/Artistas, Políticos históricos, Empresarios/Innovadores, Influencers digitales); no video-game characters

## 7. Generate: Animales

- [x] 7.1 Generate `db/seed/words/animales-curated.sql` — ≤150 rows in 6 sub-lotes (Domésticos/granja, Mamíferos salvajes, Marinos, Aves, Reptiles/anfibios, Insectos/arácnidos); all names in Spanish

## 8. Generate: Anime

- [x] 8.1 Generate `db/seed/words/anime-curated.sql` — ≤150 rows in 5 sub-lotes (Shōnen/Acción, Comedia/Slice of Life, Drama/Seinen, Familiar/Ghibli, Personajes icónicos); no entries with non-Latin characters

## 9. Generate: Música

- [x] 9.1 Generate `db/seed/words/musica-curated.sql` — ≤175 rows in 5 sub-lotes (Pop internacional, Rock/Metal, Reggaetón/Urbano, Latinos clásicos, Canciones icónicas); ~50% artistas, ~50% canciones

## 10. Generate: Arte

- [x] 10.1 Generate `db/seed/words/arte-curated.sql` — ≤150 rows in 5 sub-lotes (Pintores clásicos, Pintores modernos, Pinturas famosas, Esculturas, Contemporáneos)

## 11. Generate: Países

- [x] 11.1 Generate `db/seed/words/paises-curated.sql` — ≤150 rows in 5 sub-lotes (Europa occidental, Américas, Asia conocida, África reconocida, Resto); all names in Spanish

## 12. Generate: Libros

- [x] 12.1 Generate `db/seed/words/libros-curated.sql` — ≤160 rows in 5 sub-lotes (Clásicos universales, Literatura latina, Bestsellers modernos, Sagas populares, Autores icónicos); ~70% títulos, ~30% autores

## 13. Generate: Videojuegos

- [x] 13.1 Generate `db/seed/words/videojuegos-curated.sql` — ≤180 rows in 5 sub-lotes (Nintendo clásico, Títulos 90s/2000s, Títulos modernos, Franquicias PlayStation/Xbox, Personajes icónicos); titles in English

> **⛔ GATE — Manual review required**: Review all generated SQL files before any DB operation. Check for unrecognizable entries, non-Latin characters, entries over 40 chars, duplicates, or quality issues. Only proceed to task 14 once all files are approved (or regenerated as needed).

## 14. Manual Review

- [x] 14.1 Review each `db/seed/words/*-curated.sql` file and confirm content quality; request regeneration of any category that needs adjustment

## 15. Populate DB

- [x] 15.1 Run `tsx db/scripts/reset-words.ts --execute` to truncate `words`
- [x] 15.2 Execute each approved SQL file against Neon: `psql $DATABASE_URL -f db/seed/words/<categoria>-curated.sql` (order: peliculas, series, personajes, animales, anime, musica, arte, paises, libros, videojuegos)
- [x] 15.3 Verify with `SELECT category_id, subcategory, count(*) FROM words GROUP BY category_id, subcategory ORDER BY category_id, subcategory`

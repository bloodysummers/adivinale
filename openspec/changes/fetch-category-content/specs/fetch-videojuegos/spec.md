## ADDED Requirements

### Requirement: Script de fetch para Videojuegos desde RAWG
El sistema SHALL proveer un script `db/scripts/fetch-videojuegos.ts` que consulte la RAWG API y genere `db/seed/words/videojuegos.sql` con 500–1000 videojuegos populares de cualquier época.

#### Scenario: Ejecución exitosa del script
- **WHEN** se ejecuta `npx tsx db/scripts/fetch-videojuegos.ts`
- **THEN** se genera `db/seed/words/videojuegos.sql` con INSERTs para la categoría `videojuegos`, con al menos 500 filas

#### Scenario: API key requerida
- **WHEN** `RAWG_API_KEY` no está definida en el entorno
- **THEN** el script falla con un mensaje claro: `Error: RAWG_API_KEY no está configurada en .env.local`

#### Scenario: Nombre del juego en idioma original
- **WHEN** se procesa un videojuego de RAWG
- **THEN** se usa el campo `name` (inglés por defecto en RAWG) con `language='en'`

#### Scenario: Ordenamiento por popularidad
- **WHEN** el script consulta RAWG
- **THEN** ordena por `-rating` o `-metacritic` para obtener los más valorados de cualquier época

#### Scenario: Deduplicación
- **WHEN** se ejecuta el script dos veces
- **THEN** la segunda ejecución no duplica filas

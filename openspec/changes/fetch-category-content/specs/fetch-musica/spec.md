## ADDED Requirements

### Requirement: Script de fetch para Música desde MusicBrainz
El sistema SHALL proveer un script `db/scripts/fetch-musica.ts` que consulte la MusicBrainz API y genere `db/seed/words/musica.sql` con 500–1000 artistas y bandas relevantes.

#### Scenario: Ejecución exitosa del script
- **WHEN** se ejecuta `npx tsx db/scripts/fetch-musica.ts`
- **THEN** se genera `db/seed/words/musica.sql` con INSERTs para la categoría `musica`, con al menos 500 filas

#### Scenario: Artista con nombre en español o latino
- **WHEN** el artista tiene área de origen en Latinoamérica o España, o su nombre está en español
- **THEN** se inserta con `language='es'`

#### Scenario: Artista con nombre en inglés u otro idioma
- **WHEN** el artista es de habla inglesa u origen no hispanohablante
- **THEN** se inserta con `language='en'`

#### Scenario: Rate limiting respetado
- **WHEN** el script realiza múltiples requests a MusicBrainz
- **THEN** espera al menos 1000ms entre cada request para respetar la política de la API

#### Scenario: User-Agent correcto
- **WHEN** el script hace requests a MusicBrainz
- **THEN** incluye el header `User-Agent: adivinale-game/1.0 (contact: dev)`

## ADDED Requirements

### Requirement: Script de fetch para Animales desde Wikidata
El sistema SHALL proveer un script `db/scripts/fetch-animales.ts` que consulte Wikidata SPARQL y genere `db/seed/words/animales.sql` con ~500 nombres de animales en español.

#### Scenario: Ejecución exitosa del script
- **WHEN** se ejecuta `npx tsx db/scripts/fetch-animales.ts`
- **THEN** se genera `db/seed/words/animales.sql` con INSERTs para la categoría `animales`, con al menos 400 filas

#### Scenario: Nombre del animal en español
- **WHEN** el animal tiene etiqueta en español en Wikidata
- **THEN** se inserta con `language='es'` usando el nombre común en español

#### Scenario: Animal sin nombre en español
- **WHEN** el animal no tiene etiqueta en español
- **THEN** se omite (no se inserta con nombre científico o en inglés)

#### Scenario: Diversidad taxonómica
- **WHEN** el script construye la query SPARQL
- **THEN** incluye animales de distintos grupos: mamíferos, aves, reptiles, peces, insectos, anfibios

#### Scenario: Filtrado de nombres no aptos para el juego
- **WHEN** el nombre del animal tiene más de 40 caracteres o contiene paréntesis taxonómicos
- **THEN** se omite esa entrada

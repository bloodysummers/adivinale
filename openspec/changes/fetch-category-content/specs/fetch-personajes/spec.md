## ADDED Requirements

### Requirement: Script de fetch para Personajes Famosos desde Wikidata
El sistema SHALL proveer un script `db/scripts/fetch-personajes.ts` que consulte Wikidata SPARQL y genere `db/seed/words/personajes-famosos.sql` con 500–1000 personas famosas de diversas profesiones y épocas.

#### Scenario: Ejecución exitosa del script
- **WHEN** se ejecuta `npx tsx db/scripts/fetch-personajes.ts`
- **THEN** se genera `db/seed/words/personajes-famosos.sql` con INSERTs para la categoría `personajes-famosos`, con al menos 500 filas

#### Scenario: Diversidad de profesiones
- **WHEN** el script construye la query SPARQL
- **THEN** incluye personas de al menos estas categorías: actores, deportistas, músicos, políticos, científicos, escritores, personajes históricos, artistas plásticos

#### Scenario: Nombre en español disponible
- **WHEN** la persona tiene etiqueta (`rdfs:label`) en español en Wikidata
- **THEN** se inserta con `language='es'` usando esa etiqueta

#### Scenario: Nombre solo en inglés
- **WHEN** la persona no tiene etiqueta en español pero sí en inglés
- **THEN** se inserta con `language='en'`

#### Scenario: Paginación de resultados
- **WHEN** Wikidata devuelve resultados en múltiples páginas
- **THEN** el script pagina usando `LIMIT`/`OFFSET` hasta alcanzar el objetivo de 500–1000 elementos

#### Scenario: Personajes históricos incluidos
- **WHEN** el script selecciona personas
- **THEN** no filtra por fecha de nacimiento, permitiendo personajes de cualquier época histórica

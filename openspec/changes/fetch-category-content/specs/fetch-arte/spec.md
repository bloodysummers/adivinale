## ADDED Requirements

### Requirement: Script de fetch para Arte desde Wikidata y Met Museum
El sistema SHALL proveer un script `db/scripts/fetch-arte.ts` que consulte Wikidata SPARQL y Met Museum API para generar `db/seed/words/arte.sql` con 500–1000 elementos entre obras de arte, artistas, estilos y movimientos artísticos.

#### Scenario: Ejecución exitosa del script
- **WHEN** se ejecuta `npx tsx db/scripts/fetch-arte.ts`
- **THEN** se genera `db/seed/words/arte.sql` con INSERTs para la categoría `arte`, con al menos 500 filas

#### Scenario: Inserción de nombre de artista
- **WHEN** se procesa un artista de Wikidata (pintor, escultor, fotógrafo, etc.)
- **THEN** se inserta el nombre con `language='es'` si tiene etiqueta en español, o `language='en'` si solo tiene etiqueta en inglés

#### Scenario: Inserción de nombre de obra de arte
- **WHEN** se procesa una obra del Met Museum o Wikidata con nombre en español
- **THEN** se inserta con `language='es'`

#### Scenario: Inserción de nombre de obra solo en inglés
- **WHEN** una obra no tiene nombre en español
- **THEN** se inserta con `language='en'`

#### Scenario: Inserción de movimientos artísticos
- **WHEN** el script consulta Wikidata por movimientos artísticos (impresionismo, cubismo, barroco, etc.)
- **THEN** se insertan los nombres de al menos 30 movimientos/estilos reconocibles con `language='es'`

#### Scenario: Diversidad de tipos de arte
- **WHEN** el script selecciona contenido
- **THEN** incluye elementos de: pintura, escultura, fotografía, arquitectura notable, movimientos artísticos, artistas de distintas épocas

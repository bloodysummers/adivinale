## ADDED Requirements

### Requirement: Script de fetch para Libros desde Open Library
El sistema SHALL proveer un script `db/scripts/fetch-libros.ts` que consulte Open Library API y genere `db/seed/words/libros.sql` con 500–1000 elementos entre títulos de libros y nombres de autores.

#### Scenario: Ejecución exitosa del script
- **WHEN** se ejecuta `npx tsx db/scripts/fetch-libros.ts`
- **THEN** se genera `db/seed/words/libros.sql` con INSERTs para la categoría `libros`, con al menos 500 filas

#### Scenario: Inserción de título de libro
- **WHEN** se procesa un libro de Open Library
- **THEN** se inserta el título con `language='es'` si existe traducción al español, o `language='en'` con el título original

#### Scenario: Inserción de nombre de autor
- **WHEN** se procesa el autor de un libro
- **THEN** se inserta el nombre completo del autor como elemento independiente con `language='es'` si es hispanohablante o `language='en'` en caso contrario

#### Scenario: Sin duplicados entre títulos y autores
- **WHEN** el mismo autor aparece en múltiples libros
- **THEN** el nombre del autor se inserta solo una vez (deduplicación antes de generar SQL)

#### Scenario: Libros de temática universal
- **WHEN** el script selecciona libros
- **THEN** prioriza libros con mayor número de ediciones o lectores, de cualquier género literario

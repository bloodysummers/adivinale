## ADDED Requirements

### Requirement: Esquema de base de datos definido en SQL versionado
El repositorio SHALL contener un archivo `db/schema.sql` con el DDL completo para crear las tablas `categories` y `words` en PostgreSQL. El script SHALL ser idempotente (usar `CREATE TABLE IF NOT EXISTS`).

#### Scenario: Ejecución del schema en base de datos vacía
- **WHEN** se ejecuta `db/schema.sql` contra una instancia PostgreSQL vacía
- **THEN** se crean las tablas `categories` y `words` sin errores

#### Scenario: Ejecución del schema por segunda vez
- **WHEN** se ejecuta `db/schema.sql` contra una instancia que ya tiene las tablas
- **THEN** el script termina sin errores (idempotente)

### Requirement: Tabla categories con campos requeridos
La tabla `categories` SHALL contener al menos los campos: `id` (PK, texto o serial), `name` (texto no nulo), `emoji` (texto no nulo), `language` (texto, valores: `'es'`, `'en'`, `'es+en'`).

#### Scenario: Inserción de una categoría válida
- **WHEN** se inserta una fila con `id`, `name`, `emoji`, `language` válidos
- **THEN** la fila se almacena correctamente y es recuperable con SELECT

#### Scenario: Inserción sin nombre
- **WHEN** se intenta insertar una categoría sin `name`
- **THEN** la base de datos rechaza la inserción con constraint NOT NULL

### Requirement: Tabla words con campos requeridos
La tabla `words` SHALL contener al menos los campos: `id` (PK, serial o UUID), `category_id` (FK a `categories.id`, no nulo), `text` (texto no nulo), `language` (texto, valores: `'es'`, `'en'`).

#### Scenario: Inserción de una palabra válida
- **WHEN** se inserta una fila con `category_id` existente, `text` y `language` válidos
- **THEN** la fila se almacena correctamente

#### Scenario: Inserción con category_id inexistente
- **WHEN** se intenta insertar una palabra con un `category_id` que no existe en `categories`
- **THEN** la base de datos rechaza la inserción con error de foreign key

### Requirement: Seed data para las 10 categorías del producto
El repositorio SHALL contener scripts SQL en `db/seed/` que inserten las 10 categorías del juego y al menos 80 palabras por categoría. Las categorías requeridas son: Películas/Series, Personajes famosos, Animales, Acciones/Charadas, Anime, Música, Arte, Países, Libros, Videojuegos.

#### Scenario: Ejecución del seed completo
- **WHEN** se ejecutan todos los scripts de `db/seed/` en orden
- **THEN** la tabla `categories` contiene exactamente 10 filas y `words` contiene al menos 800 filas en total

#### Scenario: Contenido en español
- **WHEN** se consultan palabras de categorías de idioma `'es'`
- **THEN** todos los textos están en español

### Requirement: Variables de entorno documentadas para la conexión
El repositorio SHALL contener un archivo `.env.example` que liste todas las variables de entorno requeridas sin valores reales, incluyendo `NEON_DATABASE_URL` y `EXPO_PUBLIC_API_URL`.

#### Scenario: Desarrollador nuevo configura el entorno
- **WHEN** un desarrollador copia `.env.example` a `.env.local` y llena los valores
- **THEN** puede conectarse a la base de datos y ejecutar la app localmente

## ADDED Requirements

### Requirement: Datos de palabras disponibles localmente
El archivo `src/data/words.ts` SHALL exportar los datos de palabras por categoría como arrays de tipo `Word[]`, indexados por `categoryId`. Las categorías iniciales son `peliculas` (20 palabras) y `series` (20 palabras).

#### Scenario: Categoría películas disponible
- **WHEN** se importa `src/data/words.ts`
- **THEN** está disponible un array de 20 elementos de tipo `Word` con `categoryId: 'peliculas'`

#### Scenario: Categoría series disponible
- **WHEN** se importa `src/data/words.ts`
- **THEN** está disponible un array de 20 elementos de tipo `Word` con `categoryId: 'series'`

### Requirement: Categorías disponibles definidas localmente
El archivo `src/data/categories.ts` SHALL exportar un array de tipo `Category[]` con las dos categorías del MVP, incluyendo `id`, `name`, `emoji` y `language`.

#### Scenario: Lista de categorías exportada
- **WHEN** se importa `src/data/categories.ts`
- **THEN** el array contiene exactamente dos categorías: `peliculas` y `series`

#### Scenario: Cada categoría tiene los campos requeridos
- **WHEN** se accede a cualquier categoría del array
- **THEN** tiene los campos `id`, `name`, `emoji` y `language` con valores válidos

### Requirement: Compatibilidad de tipos con el contrato futuro de la API
Los tipos `Word` y `Category` usados en los datos locales SHALL ser idénticos a los definidos en `src/types/index.ts`, garantizando que el reemplazo por llamadas a la API no requiera cambios en hooks ni pantallas.

#### Scenario: Tipos coinciden con la interfaz global
- **WHEN** se asigna un item de los datos locales a una variable de tipo `Word`
- **THEN** TypeScript no reporta error de tipos

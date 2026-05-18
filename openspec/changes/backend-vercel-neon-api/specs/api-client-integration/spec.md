## ADDED Requirements

### Requirement: Métodos de API client para categorías y palabras
El módulo `src/api/client.ts` SHALL exportar las funciones `getCategories(): Promise<Category[]>` y `getWords(categoryId: string): Promise<Word[]>` que realicen las llamadas HTTP a los endpoints de Vercel Functions.

#### Scenario: getCategories retorna listado de categorías
- **WHEN** se llama a `getCategories()` y el servidor responde con 200
- **THEN** la función resuelve con un array de objetos `Category` con campos `id`, `name`, `emoji`

#### Scenario: getWords retorna 50 palabras
- **WHEN** se llama a `getWords("1")` y el servidor responde con 200
- **THEN** la función resuelve con un array de objetos `Word` con campos `id`, `text`, `language`

#### Scenario: Error de red en getCategories
- **WHEN** el servidor no responde o devuelve status ≥400
- **THEN** la función rechaza con un Error que contiene el mensaje del servidor o "Network error"

### Requirement: Hook useCategories que expone estado de carga
El módulo SHALL exportar un hook `useCategories()` que llame a `getCategories()` y exponga `{ data: Category[] | null, error: Error | null, isLoading: boolean }`. El hook SHALL llamar a la API solo al montar el componente.

#### Scenario: Carga exitosa de categorías
- **WHEN** el componente monta y el servidor responde con éxito
- **THEN** `isLoading` pasa de `true` a `false` y `data` contiene el array de categorías

#### Scenario: Error al cargar categorías
- **WHEN** el servidor responde con error
- **THEN** `isLoading` es `false`, `data` es `null` y `error` contiene el error

### Requirement: Hook useWords que acepta categoryId
El módulo SHALL exportar un hook `useWords(categoryId: string)` que llame a `getWords(categoryId)` y exponga `{ data: Word[] | null, error: Error | null, isLoading: boolean }`. El hook SHALL re-ejecutar la llamada cuando `categoryId` cambie.

#### Scenario: Carga exitosa de palabras para una categoría
- **WHEN** el componente monta con un `categoryId` válido
- **THEN** `isLoading` pasa a `false` y `data` contiene el array de palabras

#### Scenario: categoryId cambia
- **WHEN** `categoryId` cambia mientras el componente está montado
- **THEN** el hook realiza una nueva llamada a la API con el nuevo id

### Requirement: Pantalla de selección de categoría usa datos de la API
La pantalla `app/(tabs)/index.tsx` SHALL reemplazar el array de categorías hardcodeado por el hook `useCategories()`. SHALL mostrar un indicador de carga mientras `isLoading` es `true` y un mensaje de error si `error` no es `null`.

#### Scenario: Categorías cargadas desde API
- **WHEN** el usuario abre la pantalla principal y la API responde con éxito
- **THEN** se muestran las categorías recibidas de la API, no las hardcodeadas

#### Scenario: Estado de carga visible
- **WHEN** la API aún no ha respondido
- **THEN** se muestra un indicador de actividad (spinner o skeleton)

### Requirement: Pantalla de juego usa palabras de la API
La pantalla `app/game/play.tsx` SHALL reemplazar el array de palabras hardcodeado por el hook `useWords(categoryId)`, donde `categoryId` se recibe como parámetro de navegación. La pantalla SHALL esperar a que las palabras estén cargadas antes de iniciar el countdown.

#### Scenario: Palabras cargadas antes de iniciar juego
- **WHEN** el usuario navega a la pantalla de juego con un `categoryId` válido
- **THEN** la pantalla espera la respuesta de la API antes de iniciar el contador de 60 segundos

#### Scenario: Error al cargar palabras
- **WHEN** la API falla al cargar palabras
- **THEN** se muestra un mensaje de error con opción de reintentar o volver a la pantalla principal

### Requirement: URL de la API configurable por variable de entorno
El cliente HTTP SHALL leer la URL base de la API desde `process.env.EXPO_PUBLIC_API_URL`. No SHALL haber URLs de API hardcodeadas en el código fuente.

#### Scenario: Variable de entorno configurada
- **WHEN** `EXPO_PUBLIC_API_URL` está definida en `.env`
- **THEN** todas las llamadas de `src/api/client.ts` usan esa URL como base

#### Scenario: Variable de entorno no configurada
- **WHEN** `EXPO_PUBLIC_API_URL` no está definida
- **THEN** el cliente usa una URL de fallback de desarrollo (`http://localhost:3000`) o lanza un error descriptivo al importar el módulo

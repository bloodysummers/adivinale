## ADDED Requirements

### Requirement: Listar categorías disponibles
El sistema SHALL exponer un endpoint `GET /api/categories` que devuelva el listado completo de categorías con su `id`, `name` y `emoji`. La respuesta SHALL tener Content-Type `application/json` y status HTTP 200.

#### Scenario: Solicitud exitosa
- **WHEN** un cliente hace `GET /api/categories`
- **THEN** el servidor responde con status 200 y un JSON `{ "categories": [ { "id": string, "name": string, "emoji": string }, ... ] }`

#### Scenario: Sin categorías en base de datos
- **WHEN** la tabla `categories` está vacía y el cliente hace `GET /api/categories`
- **THEN** el servidor responde con status 200 y `{ "categories": [] }`

#### Scenario: Error de conexión a la base de datos
- **WHEN** la conexión a Neon.tech falla
- **THEN** el servidor responde con status 500 y `{ "error": "Internal server error" }` sin exponer detalles de la conexión

### Requirement: CORS habilitado en el endpoint de categorías
El servidor SHALL incluir el header `Access-Control-Allow-Origin: *` en todas las respuestas de `GET /api/categories` para permitir llamadas desde la app Expo en desarrollo (Metro bundler) y desde Vercel Preview deployments.

#### Scenario: Request con header Origin desde cliente Expo
- **WHEN** el cliente envía `GET /api/categories` con header `Origin: http://localhost:8081`
- **THEN** la respuesta incluye `Access-Control-Allow-Origin: *`

### Requirement: Método HTTP restringido a GET
El endpoint `/api/categories` SHALL responder con status 405 a cualquier método distinto de GET.

#### Scenario: Solicitud con método POST
- **WHEN** un cliente hace `POST /api/categories`
- **THEN** el servidor responde con status 405 y `{ "error": "Method not allowed" }`

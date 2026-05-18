## ADDED Requirements

### Requirement: Obtener 50 palabras aleatorias de una categoría
El sistema SHALL exponer un endpoint `GET /api/categories/:id/words` que devuelva exactamente 50 palabras seleccionadas aleatoriamente de la categoría especificada. La selección SHALL ser diferente en cada llamada cuando hay más de 50 palabras disponibles.

#### Scenario: Solicitud exitosa con suficientes palabras
- **WHEN** un cliente hace `GET /api/categories/1/words` y la categoría tiene ≥50 palabras
- **THEN** el servidor responde con status 200 y `{ "words": [ { "id": string, "text": string, "language": "es" | "en" }, ... ] }` con exactamente 50 elementos en orden aleatorio

#### Scenario: Categoría con menos de 50 palabras
- **WHEN** un cliente hace `GET /api/categories/:id/words` y la categoría tiene <50 palabras
- **THEN** el servidor responde con status 200 y devuelve todas las palabras disponibles (menos de 50)

#### Scenario: Categoría inexistente
- **WHEN** un cliente hace `GET /api/categories/999/words` con un id que no existe
- **THEN** el servidor responde con status 404 y `{ "error": "Category not found" }`

#### Scenario: Error de conexión a la base de datos
- **WHEN** la conexión a Neon.tech falla
- **THEN** el servidor responde con status 500 y `{ "error": "Internal server error" }`

### Requirement: Validación del parámetro id
El endpoint SHALL validar que el parámetro `:id` sea un valor no vacío. Si el id tiene un formato inválido (e.g. string vacío), SHALL responder con status 400.

#### Scenario: Parámetro id inválido
- **WHEN** un cliente hace `GET /api/categories//words` o el id es un valor no soportado
- **THEN** el servidor responde con status 400 y `{ "error": "Invalid category id" }`

### Requirement: CORS habilitado en el endpoint de palabras
El servidor SHALL incluir el header `Access-Control-Allow-Origin: *` en todas las respuestas de `GET /api/categories/:id/words`.

#### Scenario: Request con header Origin desde cliente Expo
- **WHEN** el cliente envía `GET /api/categories/:id/words` con header `Origin: http://localhost:8081`
- **THEN** la respuesta incluye `Access-Control-Allow-Origin: *`

### Requirement: Método HTTP restringido a GET
El endpoint `/api/categories/:id/words` SHALL responder con status 405 a cualquier método distinto de GET.

#### Scenario: Solicitud con método DELETE
- **WHEN** un cliente hace `DELETE /api/categories/1/words`
- **THEN** el servidor responde con status 405 y `{ "error": "Method not allowed" }`

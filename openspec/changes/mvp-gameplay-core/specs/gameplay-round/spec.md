## ADDED Requirements

### Requirement: Orientación landscape forzada durante el juego
Las pantallas `game/ready`, `game/play` y `game/results` SHALL bloquear la orientación en landscape al montarse y restaurarla a libre al desmontarse. La pantalla Home SHALL mostrarse en portrait sin restricción.

#### Scenario: Flujo de juego en landscape
- **WHEN** el usuario navega a cualquier pantalla del flujo de juego (ready, play, results)
- **THEN** el dispositivo rota a landscape automáticamente

#### Scenario: Regreso a Home restaura portrait
- **WHEN** el usuario navega de vuelta a Home
- **THEN** la orientación se libera y el dispositivo puede volver a portrait

### Requirement: Cuenta regresiva antes de iniciar
La pantalla `game/ready` SHALL mostrar una cuenta regresiva de 3 segundos (3 → 2 → 1 → ¡Ya!) antes de navegar automáticamente a `game/play`.

#### Scenario: Cuenta regresiva completa
- **WHEN** el usuario llega a `game/ready`
- **THEN** la pantalla muestra 3, luego 2, luego 1, luego un mensaje de inicio, y navega sola a `game/play` sin intervención del usuario

#### Scenario: Navegación automática al terminar
- **WHEN** la cuenta regresiva llega a 0
- **THEN** la app navega a `game/play` reemplazando la entrada de historial (sin permitir regresar a ready)

### Requirement: Presentación de palabras barajadas sin repetición
La pantalla `game/play` SHALL mostrar las palabras de la categoría seleccionada en orden aleatorio, sin repetir ninguna durante la ronda.

#### Scenario: Primera palabra al iniciar
- **WHEN** comienza la ronda (se llega a `game/play`)
- **THEN** se muestra la primera palabra del array barajado

#### Scenario: Avance a siguiente palabra
- **WHEN** el jugador marca correcto o pasa
- **THEN** se muestra la siguiente palabra del array barajado (índice + 1)

#### Scenario: Sin repetición en la ronda
- **WHEN** se presentan N palabras durante una ronda
- **THEN** ninguna palabra aparece más de una vez en esa ronda

#### Scenario: Agotamiento de palabras
- **WHEN** se han mostrado todas las palabras de la categoría antes de que termine el timer
- **THEN** la ronda termina y navega a `game/results`

### Requirement: Timer de 60 segundos
La pantalla `game/play` SHALL mostrar un contador descendente de 60 segundos. Al llegar a 0, la ronda termina automáticamente.

#### Scenario: Timer visible durante el juego
- **WHEN** la ronda está activa
- **THEN** se muestra el tiempo restante en segundos, actualizándose cada segundo

#### Scenario: Fin de ronda por tiempo
- **WHEN** el timer llega a 0
- **THEN** la app navega a `game/results` con el estado final de la ronda

### Requirement: Detección de inclinación para marcar respuesta
El hook `useAccelerometer` SHALL detectar inclinaciones del dispositivo y disparar un callback `onTilt(direction)`. La inclinación hacia arriba (eje z > 0.7 sostenido ≥150 ms) SHALL marcar la respuesta como correcta. La inclinación hacia abajo (eje z < -0.7 sostenido ≥150 ms) SHALL pasar la palabra.

#### Scenario: Inclinación hacia arriba marca correcto
- **WHEN** el usuario inclina el teléfono hacia atrás (eje Z > 0.7) durante ≥150 ms
- **THEN** se registra la palabra actual como correcta y se avanza a la siguiente

#### Scenario: Inclinación hacia abajo pasa la palabra
- **WHEN** el usuario inclina el teléfono hacia adelante (eje Z < -0.7) durante ≥150 ms
- **THEN** se registra la palabra actual como pasada y se avanza a la siguiente

#### Scenario: Debounce entre activaciones
- **WHEN** se dispara una inclinación
- **THEN** el sistema ignora cualquier nueva inclinación durante los siguientes 600 ms

### Requirement: Puntuación de la ronda
El sistema SHALL llevar la cuenta de palabras correctas y palabras presentadas durante la ronda.

#### Scenario: Incremento de score por correcto
- **WHEN** el jugador inclina hacia arriba (correcto)
- **THEN** `gameStore.score` se incrementa en 1

#### Scenario: Palabras presentadas sin penalización por pase
- **WHEN** el jugador pasa una palabra
- **THEN** `gameStore.score` no cambia, pero `totalWords` incrementa

### Requirement: Pantalla de resultados post-ronda
La pantalla `game/results` SHALL mostrar el score final (aciertos / palabras presentadas) y ofrecer las opciones de jugar de nuevo con la misma categoría o cambiar de categoría.

#### Scenario: Score visible en resultados
- **WHEN** el jugador llega a `game/results`
- **THEN** ve su puntaje en formato "X / Y" donde X son aciertos y Y es total de palabras presentadas

#### Scenario: Jugar de nuevo
- **WHEN** el jugador elige "Jugar de nuevo"
- **THEN** la app navega a `game/ready` con la misma categoría, reiniciando el store

#### Scenario: Cambiar categoría
- **WHEN** el jugador elige "Cambiar categoría"
- **THEN** la app navega a Home y reinicia el store

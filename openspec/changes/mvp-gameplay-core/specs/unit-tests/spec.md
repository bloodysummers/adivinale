## ADDED Requirements

### Requirement: Suite de pruebas unitarias del MVP

El proyecto SHALL tener una suite de pruebas unitarias que cubra la funcionalidad crítica implementada en el MVP: utilidades, store y hooks.

---

### Requirement: Tests de utilidades

#### Scenario: shuffle — no modifica el array original
- **WHEN** se llama a `shuffle(array)`
- **THEN** el array original no es mutado

#### Scenario: shuffle — el resultado tiene los mismos elementos
- **WHEN** se llama a `shuffle(array)` con N elementos
- **THEN** el resultado contiene exactamente los mismos N elementos

#### Scenario: shuffle — no produce siempre el mismo orden
- **WHEN** se llama a `shuffle` 10 veces sobre el mismo array de ≥5 elementos
- **THEN** al menos una llamada produce un orden distinto al original (distribución no constante)

#### Scenario: accelerometer constants — valores correctos
- **WHEN** se importan las constantes de `src/utils/accelerometer`
- **THEN** `CORRECT_THRESHOLD = 0.7`, `SKIP_THRESHOLD = -0.7`, `HOLD_DURATION_MS = 150`, `DEBOUNCE_MS = 600`

---

### Requirement: Tests del store (gameStore)

#### Scenario: startRound — establece categoría y baraja palabras
- **WHEN** se llama a `startRound(category, words)`
- **THEN** `category` se guarda, `words` tiene los mismos elementos (posiblemente en diferente orden), `currentIndex = 0`, `score = 0`, `status = 'playing'`

#### Scenario: markCorrect — incrementa score y avanza índice
- **WHEN** se llama a `markCorrect()` con `currentIndex < words.length - 1`
- **THEN** `score` sube 1 y `currentIndex` sube 1

#### Scenario: markCorrect — al llegar al final cambia status a finished
- **WHEN** se llama a `markCorrect()` y `currentIndex` es el último índice
- **THEN** `status = 'finished'`

#### Scenario: markSkipped — no modifica score, avanza índice
- **WHEN** se llama a `markSkipped()` con `currentIndex < words.length - 1`
- **THEN** `score` no cambia y `currentIndex` sube 1

#### Scenario: markSkipped — al llegar al final cambia status a finished
- **WHEN** se llama a `markSkipped()` y `currentIndex` es el último índice
- **THEN** `status = 'finished'`

#### Scenario: endRound — cambia status a finished
- **WHEN** se llama a `endRound()`
- **THEN** `status = 'finished'`

#### Scenario: resetRound — limpia el estado de la ronda
- **WHEN** se llama a `resetRound()` después de una ronda activa
- **THEN** `words = []`, `currentIndex = 0`, `score = 0`, `status = 'idle'`

---

### Requirement: Tests del hook useGameTimer

#### Scenario: Inicia con el tiempo completo
- **WHEN** se monta `useGameTimer({ duration: 5, running: true, onExpire })`
- **THEN** `timeLeft` empieza en `5`

#### Scenario: Decrementa cada segundo
- **WHEN** han pasado 2 segundos con `running: true`
- **THEN** `timeLeft = duration - 2`

#### Scenario: Llama onExpire al llegar a 0
- **WHEN** `timeLeft` llega a `0`
- **THEN** se llama `onExpire` exactamente una vez

#### Scenario: No decrementa cuando running es false
- **WHEN** `running = false`
- **THEN** `timeLeft` no cambia aunque pase tiempo

---

### Requirement: Tests del hook useAccelerometer (lógica pura)

#### Scenario: Dispara 'up' cuando z > CORRECT_THRESHOLD sostenido
- **WHEN** el acelerómetro reporta z > 0.7 durante ≥150 ms
- **THEN** se llama `onTilt('up')`

#### Scenario: Dispara 'down' cuando z < SKIP_THRESHOLD sostenido
- **WHEN** el acelerómetro reporta z < -0.7 durante ≥150 ms
- **THEN** se llama `onTilt('down')`

#### Scenario: No dispara sin hold suficiente
- **WHEN** z supera el umbral pero por menos de 150 ms
- **THEN** `onTilt` no es llamado

#### Scenario: Debounce impide disparos consecutivos rápidos
- **WHEN** se dispara una inclinación y antes de 600 ms se supera el umbral de nuevo
- **THEN** `onTilt` no se vuelve a llamar

#### Scenario: No dispara cuando enabled es false
- **WHEN** el hook se monta con `enabled = false`
- **THEN** `onTilt` nunca es llamado sin importar los valores de z

---

### Requirement: Tests de datos locales

#### Scenario: categories — exactamente 2 categorías con campos requeridos
- **WHEN** se importa `src/data/categories`
- **THEN** el array tiene 2 elementos, cada uno con `id`, `name`, `emoji`, `language` definidos

#### Scenario: wordsByCategory — 20 palabras para peliculas
- **WHEN** se accede a `wordsByCategory['peliculas']`
- **THEN** el array tiene exactamente 20 elementos de tipo `Word` con `categoryId = 'peliculas'`

#### Scenario: wordsByCategory — 20 palabras para series
- **WHEN** se accede a `wordsByCategory['series']`
- **THEN** el array tiene exactamente 20 elementos de tipo `Word` con `categoryId = 'series'`

#### Scenario: Todas las palabras tienen id único
- **WHEN** se combinan todas las palabras de todas las categorías
- **THEN** no hay dos palabras con el mismo `id`

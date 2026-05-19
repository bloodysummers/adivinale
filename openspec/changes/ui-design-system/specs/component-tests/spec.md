## ADDED Requirements

### Requirement: Tests unitarios para componentes del design system
Cada componente base SHALL tener tests en `src/__tests__/components/` que validen su renderizado, variantes, y comportamiento interactivo.

#### Scenario: GameButton renderiza con label correcto
- **WHEN** se renderiza `<GameButton label="Jugar" onPress={fn} />`
- **THEN** el texto "Jugar" SHALL ser accesible en el árbol de renderizado

#### Scenario: GameButton no llama onPress cuando está deshabilitado
- **WHEN** se presiona un `GameButton` con `disabled={true}`
- **THEN** `onPress` SHALL NO ser invocado

#### Scenario: Card renderiza children
- **WHEN** se renderiza `<Card><Text>Hola</Text></Card>`
- **THEN** el texto "Hola" SHALL estar en el árbol renderizado

#### Scenario: Text renderiza con variante heading1
- **WHEN** se renderiza `<Text variant="heading1">Título</Text>`
- **THEN** el componente SHALL tener `fontSize` 38 en sus estilos

#### Scenario: Badge renderiza con label
- **WHEN** se renderiza `<Badge label="Películas" />`
- **THEN** el texto "Películas" SHALL ser accesible en el árbol

#### Scenario: ScreenContainer renderiza children
- **WHEN** se renderiza `<ScreenContainer><Text>Contenido</Text></ScreenContainer>`
- **THEN** el texto "Contenido" SHALL estar en el árbol renderizado

---

### Requirement: Tests unitarios para gameStore
`src/store/gameStore.ts` SHALL tener tests en `src/__tests__/store/gameStore.test.ts` que cubran todas las acciones del store.

#### Scenario: startRound inicializa el estado correctamente
- **WHEN** se llama `startRound(category, words)`
- **THEN** el status SHALL ser `'playing'`, score SHALL ser `0`, y words SHALL ser las palabras shuffleadas

#### Scenario: markCorrect incrementa el score
- **WHEN** se llama `markCorrect()` con el juego en estado playing
- **THEN** el score SHALL incrementar en 1 y `currentIndex` SHALL avanzar

#### Scenario: markSkipped avanza sin incrementar score
- **WHEN** se llama `markSkipped()` con el juego en estado playing
- **THEN** el score SHALL mantenerse igual y `currentIndex` SHALL avanzar

#### Scenario: markCorrect en última palabra finaliza la ronda
- **WHEN** se llama `markCorrect()` en la última palabra disponible
- **THEN** el status SHALL cambiar a `'finished'`

#### Scenario: markSkipped en última palabra finaliza la ronda
- **WHEN** se llama `markSkipped()` en la última palabra disponible
- **THEN** el status SHALL cambiar a `'finished'`

#### Scenario: endRound establece status finished
- **WHEN** se llama `endRound()`
- **THEN** el status SHALL ser `'finished'`

#### Scenario: resetRound limpia el estado
- **WHEN** se llama `resetRound()` después de una ronda
- **THEN** score SHALL ser 0, currentIndex SHALL ser 0, words SHALL ser vacío, status SHALL ser `'idle'`

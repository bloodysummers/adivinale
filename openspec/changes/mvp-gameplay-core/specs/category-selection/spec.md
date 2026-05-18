## ADDED Requirements

### Requirement: Listado de categorías disponibles
La pantalla Home SHALL mostrar todas las categorías disponibles como tarjetas seleccionables. Cada tarjeta SHALL mostrar el nombre y el emoji de la categoría.

#### Scenario: Categorías visibles al abrir la app
- **WHEN** el usuario abre la app
- **THEN** la pantalla Home muestra una lista de categorías (mínimo Películas y Series)

#### Scenario: Cada tarjeta muestra nombre y emoji
- **WHEN** se renderiza la pantalla Home
- **THEN** cada tarjeta de categoría muestra su `emoji` y su `name`

### Requirement: Selección de categoría inicia el flujo de juego
Al tocar una categoría, la app SHALL navegar a `game/ready` pasando el identificador de la categoría seleccionada.

#### Scenario: Tap en categoría navega a ready
- **WHEN** el usuario toca una tarjeta de categoría
- **THEN** la app navega a `game/ready` con el `categoryId` de la categoría elegida

#### Scenario: El store refleja la categoría activa
- **WHEN** el usuario toca una categoría
- **THEN** `gameStore.category` se actualiza con la categoría seleccionada antes de navegar

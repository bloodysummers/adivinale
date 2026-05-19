## ADDED Requirements

### Requirement: HomeScreen usa el nuevo design system
`app/index.tsx` SHALL usar `ScreenContainer`, `Text`, y la nueva `CategoryCard` migrada. El fondo SHALL ser `theme.colors.background`. El título SHALL usar `Text variant="heading1"` con color primario. El subtítulo SHALL usar `Text variant="body"`.

#### Scenario: Fondo y tipografía adaptativos
- **WHEN** se renderiza HomeScreen en dark mode
- **THEN** el fondo SHALL ser `darkColors.background` y el texto SHALL ser `darkColors.onBackground`

#### Scenario: Error state tipografizado
- **WHEN** la API falla
- **THEN** el mensaje de error SHALL usar `Text variant="body"` con color `theme.colors.error`

---

### Requirement: CategoryCard usa gradiente por categoría
`src/components/CategoryCard.tsx` SHALL mostrar un gradiente de fondo único por categoría (basado en rotación de paleta), el emoji ampliado, y el nombre con `Text`. El toque SHALL tener feedback visual (scale + opacidad).

#### Scenario: Card con gradiente visible
- **WHEN** se renderiza CategoryCard con una categoría
- **THEN** SHALL tener `LinearGradient` como fondo con border radius `radii.xl`

---

### Requirement: ReadyScreen usa gradiente de fondo
`app/game/ready.tsx` SHALL usar `LinearGradient` con `gradients.primary` como fondo de pantalla completa. El número de cuenta regresiva SHALL usar tamaño de fuente 96 con `fontWeight extrabold` y color `onPrimary`. El emoji y nombre de categoría SHALL ser visibles sobre el gradiente.

#### Scenario: Cuenta regresiva visible sobre gradiente
- **WHEN** se renderiza ReadyScreen
- **THEN** el texto de cuenta regresiva SHALL tener color blanco sobre un fondo gradiente índigo

---

### Requirement: PlayScreen usa tokens del tema
`app/game/play.tsx` SHALL usar `theme.colors.background` para el fondo, tokens de tipografía para el score y fallback, y `GameButton` para los botones de desarrollo.

#### Scenario: Score usa color success del tema
- **WHEN** se renderiza PlayScreen con score > 0
- **THEN** el texto del score SHALL usar `theme.colors.success` en lugar de un color hardcodeado

#### Scenario: Dev buttons usan GameButton
- **WHEN** el modo DEV está activo
- **THEN** los botones SHALL ser instancias de `GameButton` con variantes `success` y `accent`

---

### Requirement: ResultsScreen usa GameButton y tokens del tema
`app/game/results.tsx` SHALL usar `GameButton` para "Jugar de nuevo" y "Ir al inicio". El score SHALL usar `Text` con variantes adecuadas. Los colores de resultado (correcto/incorrecto) SHALL venir del tema.

#### Scenario: Botón primario de resultados
- **WHEN** se renderiza ResultsScreen
- **THEN** el botón "Jugar de nuevo" SHALL ser un `GameButton variant="primary"`

#### Scenario: Botón secundario de resultados
- **WHEN** se renderiza ResultsScreen
- **THEN** el botón "Ir al inicio" SHALL ser un `GameButton variant="secondary"`

---

### Requirement: ScoreBoard, Timer y WordDisplay usan tokens del tema
Los componentes existentes SHALL obtener colores y tipografía de `useTheme()` en lugar de importar `colors` y `typography` directamente.

#### Scenario: Timer cambia de color con el tema
- **WHEN** el sistema cambia a dark mode
- **THEN** `Timer` SHALL mostrar el color correcto del tema

#### Scenario: WordDisplay muestra la palabra con tipografía del tema
- **WHEN** se renderiza `WordDisplay` con una palabra
- **THEN** el texto SHALL usar `typography.fontSize['4xl']` y peso extrabold del tema

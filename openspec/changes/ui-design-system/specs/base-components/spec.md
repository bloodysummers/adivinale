## ADDED Requirements

### Requirement: GameButton — botón primario con volumen
`GameButton` SHALL ser un componente presionable que usa el gradiente primario del tema, sombra nivel 3, y efecto de "hundimiento" al presionar (scale + sombra reducida).

Props requeridas:
- `label: string` — texto del botón
- `onPress: () => void`
- `variant?: 'primary' | 'secondary' | 'success' | 'accent'` (default: `'primary'`)
- `disabled?: boolean`
- `fullWidth?: boolean`
- `size?: 'sm' | 'md' | 'lg'` (default: `'md'`)

#### Scenario: Renderizado del botón primario
- **WHEN** se renderiza `<GameButton label="Jugar" onPress={fn} />`
- **THEN** SHALL mostrar un botón con gradiente índigo, texto blanco, bordes redondeados (`radii.xl`) y sombra

#### Scenario: Estado deshabilitado
- **WHEN** `disabled={true}`
- **THEN** SHALL reducir opacidad a 0.5 y no disparar `onPress`

#### Scenario: Feedback visual al presionar
- **WHEN** el usuario presiona el botón
- **THEN** SHALL aplicar una escala de 0.96 y reducir la sombra para simular hundimiento

---

### Requirement: Card — tarjeta con superficie elevada
`Card` SHALL ser un contenedor con fondo `surface`, sombra nivel 2, y bordes redondeados. Soporta contenido arbitrario como children.

Props requeridas:
- `children: React.ReactNode`
- `style?: StyleProp<ViewStyle>`
- `elevation?: 0 | 1 | 2 | 3` (default: `2`)
- `padding?: keyof typeof spacing` (default: `4` = 16px)

#### Scenario: Tarjeta con sombra visible
- **WHEN** se renderiza `<Card>...</Card>`
- **THEN** SHALL tener fondo `theme.colors.surface` y sombra del nivel configurado

#### Scenario: Tarjeta sin sombra
- **WHEN** `elevation={0}`
- **THEN** SHALL renderizar sin sombra ni borde implícito

---

### Requirement: Text — componente de texto tipografizado
`Text` SHALL ser un wrapper de `<Text>` de React Native que aplica automáticamente la familia tipográfica, color `onBackground` del tema activo, y tamaño configurable.

Props requeridas:
- `children: React.ReactNode`
- `variant?: 'heading1' | 'heading2' | 'heading3' | 'body' | 'bodySmall' | 'label' | 'caption'` (default: `'body'`)
- `color?: string` — override del color
- `align?: 'left' | 'center' | 'right'`
- `style?: StyleProp<TextStyle>`

Variantes y sus atributos:
- `heading1`: fontSize 4xl, weight extrabold
- `heading2`: fontSize 3xl, weight bold
- `heading3`: fontSize 2xl, weight bold
- `body`: fontSize md, weight regular
- `bodySmall`: fontSize sm, weight regular
- `label`: fontSize sm, weight semibold
- `caption`: fontSize xs, weight regular, color onSurfaceSecondary

#### Scenario: Texto con variante heading1
- **WHEN** se renderiza `<Text variant="heading1">Adivínale</Text>`
- **THEN** SHALL tener fontSize 38, fontWeight '800' y color `theme.colors.onBackground`

#### Scenario: Texto adapta color al tema
- **WHEN** el modo cambia de light a dark
- **THEN** el color del texto SHALL cambiar a `darkTheme.colors.onBackground` automáticamente

---

### Requirement: Badge — etiqueta de estado/categoría
`Badge` SHALL ser un componente inline para mostrar etiquetas de categoría, puntaje o estado.

Props requeridas:
- `label: string`
- `color?: 'primary' | 'success' | 'accent' | 'neutral'` (default: `'primary'`)
- `size?: 'sm' | 'md'` (default: `'md'`)

#### Scenario: Badge de categoría
- **WHEN** se renderiza `<Badge label="Películas" color="primary" />`
- **THEN** SHALL mostrar un chip con fondo semitransparente del color primario y texto del color primario

---

### Requirement: ScreenContainer — contenedor base de pantalla
`ScreenContainer` SHALL ser un `ScrollView` o `View` con padding horizontal estándar (`spacing[5]`), fondo `background` del tema, y soporte para `SafeAreaView`.

Props requeridas:
- `children: React.ReactNode`
- `scrollable?: boolean` (default: `false`)
- `style?: StyleProp<ViewStyle>`
- `withGradient?: boolean` — aplica gradiente de fondo (default: `false`)

#### Scenario: Pantalla con fondo del tema
- **WHEN** se renderiza `<ScreenContainer>...</ScreenContainer>`
- **THEN** el fondo SHALL ser `theme.colors.background` y respetar safe area insets

#### Scenario: Pantalla con gradiente de fondo
- **WHEN** `withGradient={true}`
- **THEN** SHALL usar `expo-linear-gradient` con `gradients.background[colorScheme]`

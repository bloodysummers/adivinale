## ADDED Requirements

### Requirement: Color tokens para light mode y dark mode
El sistema SHALL exportar dos objetos de colores semánticos — `lightColors` y `darkColors` — desde `src/utils/theme.ts`. Cada objeto SHALL contener los mismos keys pero valores distintos según el modo.

Tokens requeridos:
- `primary`: color de acento principal (índigo)
- `primaryDark`: variante oscura del primario para gradientes
- `primaryLight`: variante clara del primario para estados hover/pressed
- `accent`: color secundario (coral/naranja) para acciones
- `success`: color de éxito (teal) para respuestas correctas
- `error`: color de error/fallo para respuestas incorrectas
- `background`: fondo de pantalla
- `surface`: fondo de tarjetas y elementos elevados
- `surfaceVariant`: fondo alternativo de superficie
- `onPrimary`: texto sobre color primario
- `onBackground`: texto principal sobre fondo
- `onSurface`: texto sobre superficie
- `onSurfaceSecondary`: texto secundario/muted
- `border`: color de borde sutil
- `overlay`: color semitransparente para modales

#### Scenario: Acceso a token de color primario en light mode
- **WHEN** el sistema operativo está en light mode
- **THEN** `lightColors.primary` SHALL ser `#5B4FE8`

#### Scenario: Acceso a token de color primario en dark mode
- **WHEN** el sistema operativo está en dark mode
- **THEN** `darkColors.primary` SHALL ser `#7B70F0`

#### Scenario: Todos los tokens están presentes en ambos modos
- **WHEN** se compila el módulo `src/utils/theme.ts`
- **THEN** `lightColors` y `darkColors` SHALL tener exactamente los mismos keys tipados

---

### Requirement: Escala tipográfica
El sistema SHALL exportar un objeto `typography` con familias de fuente, tamaños y pesos.

Tokens requeridos:
- `fontFamily.heading`: fuente para títulos (System bold o custom si se añade)
- `fontFamily.body`: fuente para cuerpo de texto
- `fontSize.xs` (11), `sm` (13), `md` (15), `lg` (17), `xl` (20), `2xl` (24), `3xl` (30), `4xl` (38)
- `fontWeight.regular` (`'400'`), `medium` (`'500'`), `semibold` (`'600'`), `bold` (`'700'`), `extrabold` (`'800'`)
- `lineHeight.tight` (1.2), `normal` (1.5), `relaxed` (1.75)

#### Scenario: Tamaños tipográficos disponibles
- **WHEN** un componente importa `typography` desde theme
- **THEN** SHALL poder acceder a `typography.fontSize.xl` y obtener el valor numérico `20`

---

### Requirement: Escala de espaciado
El sistema SHALL exportar un objeto `spacing` con múltiplos de una unidad base (4px).

Valores: `spacing[1]`=4, `[2]`=8, `[3]`=12, `[4]`=16, `[5]`=20, `[6]`=24, `[8]`=32, `[10]`=40, `[12]`=48, `[16]`=64

#### Scenario: Uso de spacing en StyleSheet
- **WHEN** un componente usa `spacing[4]`
- **THEN** SHALL recibir el valor `16`

---

### Requirement: Radii (border radius)
El sistema SHALL exportar `radii` con valores semánticos:
- `sm` (6), `md` (12), `lg` (16), `xl` (24), `full` (9999)

#### Scenario: Botones con radio redondeado
- **WHEN** un componente usa `radii.xl`
- **THEN** SHALL recibir el valor `24`

---

### Requirement: Sistema de elevaciones/sombras
El sistema SHALL exportar una función `getShadow(level: 0|1|2|3|4)` que retorna los estilos de sombra correctos para iOS y Android según el nivel.

Niveles:
- `0`: sin sombra
- `1`: sombra sutil (elevation: 2)
- `2`: sombra media (elevation: 4)
- `3`: sombra pronunciada (elevation: 8) — para botones de juego
- `4`: sombra máxima (elevation: 16) — para modales

#### Scenario: Sombra nivel 3 en iOS
- **WHEN** se llama `getShadow(3)` en iOS
- **THEN** SHALL retornar un objeto con `shadowColor`, `shadowOffset`, `shadowOpacity` y `shadowRadius` apropiados

#### Scenario: Sombra nivel 3 en Android
- **WHEN** se llama `getShadow(3)` en Android
- **THEN** SHALL retornar un objeto con `elevation: 8`

---

### Requirement: Definiciones de gradientes
El sistema SHALL exportar un objeto `gradients` con arrays de colores para uso con `expo-linear-gradient`.

Gradientes requeridos:
- `primary`: índigo a violeta (botón principal)
- `success`: teal a verde
- `accent`: naranja a coral
- `background.light`: fondo sutil para pantallas en light mode
- `background.dark`: fondo para pantallas en dark mode

#### Scenario: Gradiente primario disponible
- **WHEN** un componente importa `gradients.primary`
- **THEN** SHALL obtener un array de al menos 2 strings de color hexadecimal

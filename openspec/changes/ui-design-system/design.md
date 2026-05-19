## Context

La app actualmente usa estilos hardcodeados dispersos en cada pantalla (`StyleSheet.create` con colores y tamaños literales). No existe un archivo `src/utils/theme.ts`, ni un sistema de tema adaptativo. La imagen de referencia (`original-*.jpg`) muestra una app de trivia con fondo morado/índigo, botones con gradiente, tarjetas con sombra y tipografía bold — exactamente el estilo "game" que queremos para Adivínale.

El challenge principal es: React Native no tiene CSS variables ni theming nativo. Debemos construir nuestro propio sistema basado en objetos TypeScript + React Context.

## Goals / Non-Goals

**Goals:**
- Un archivo de tokens (`src/utils/theme.ts`) como fuente única de verdad
- Soporte light/dark mode vía `useColorScheme` de React Native
- Componentes base que consumen tokens automáticamente
- Aspecto "game": gradientes, sombras pronunciadas, bordes redondeados, botones con profundidad
- Cero magic numbers en pantallas

**Non-Goals:**
- Animaciones (fuera de scope — siguiente iteración)
- Soporte para temas personalizados por el usuario (solo sistema light/dark)
- Migración de pantallas existentes (se hace por separado en otra tarea)
- Storybook o documentación visual interactiva

## Decisions

### 1. Tokens en objeto TypeScript puro (sin styled-components ni libraries externas)

**Elección:** `src/utils/theme.ts` exporta `lightTheme` y `darkTheme` como objetos tipados, más un `ThemeProvider` en `src/theme/ThemeProvider.tsx`.

**Alternativas descartadas:**
- `styled-components/native`: añade ~30KB bundle, rompe convención `StyleSheet.create` del proyecto
- `@shopify/restyle`: potente pero overhead considerable para una app de este tamaño
- `tamagui`: compilación compleja, no encaja con Expo managed workflow simplificado

**Rationale:** La convención del proyecto ya es `StyleSheet.create`. Mantenerla y solo añadir un hook `useTheme()` es la menor superficie de cambio posible.

---

### 2. Gradientes con `expo-linear-gradient`

**Elección:** Usar `expo-linear-gradient` (ya incluido en Expo SDK 54) para botones primarios y fondos de pantalla.

**Alternativas descartadas:**
- Gradientes con `react-native-linear-gradient`: requiere configuración nativa adicional
- Simulación con sombras de colores: no produce el efecto visual deseado

**Rationale:** `expo-linear-gradient` está en el SDK sin instalación extra y funciona en iOS/Android/Web.

---

### 3. Sombras: `elevation` (Android) + `shadowColor/Offset/Radius` (iOS)

**Elección:** El theme exporta helpers `shadow(level)` que retornan el objeto de sombra correcto por plataforma.

**Alternativas descartadas:**
- Solo `elevation` (Android-centric, invisible en iOS)
- `react-native-shadow-2`: dependencia innecesaria cuando las APIs nativas son suficientes

**Rationale:** Con un helper tipado en el theme, los componentes no necesitan lógica condicional de plataforma.

---

### 4. ThemeProvider sobre `useColorScheme` de React Native

**Elección:** `ThemeProvider` usa `useColorScheme()` para detectar el modo del sistema y expone `{ theme, colorScheme }` via Context. El hook `useTheme()` es el punto de acceso único.

**Rationale:** Sin dependencias extra. Reacciona automáticamente a cambios del sistema operativo.

---

### 5. Paleta de colores inspirada en la imagen de referencia

La imagen muestra fondo **índigo/violeta** (#6C63FF zona), botones en teal/verde y naranja, texto blanco. Adaptamos esto a:

**Primary:** Índigo vibrante `#5B4FE8` (light) / `#7B70F0` (dark — más claro para contraste)  
**Accent:** Coral/naranja `#FF6B6B` para acciones secundarias  
**Success:** Teal `#4ECDC4` para respuestas correctas  
**Background:** `#F4F3FF` (light, lavanda muy suave) / `#1A1730` (dark, índigo oscuro)  
**Surface:** Blanco puro (light) / `#252140` (dark)

## Risks / Trade-offs

- **[Riesgo] Pantallas existentes no migradas automáticamente** → Mitigation: las pantallas seguirán funcionando con sus estilos actuales; la migración es un paso explícito posterior
- **[Riesgo] expo-linear-gradient no soporta todos los casos en Web** → Mitigation: la app es primariamente iOS/Android; Web es solo para pruebas de UI
- **[Trade-off] ThemeProvider requiere envolver la app en `_layout.tsx`** → Es el patrón estándar de React; impacto mínimo
- **[Riesgo] Tokens desactualizados si se crean nuevos componentes sin consultar theme.ts** → Mitigation: regla en CLAUDE.md: "no magic numbers — usa constantes de src/utils/theme.ts"

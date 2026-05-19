## ADDED Requirements

### Requirement: ThemeProvider envuelve la app y provee el tema activo
`ThemeProvider` SHALL detectar automáticamente el color scheme del sistema operativo usando `useColorScheme()` de React Native y proveer el tema correcto (`lightTheme` o `darkTheme`) a todos los componentes hijos.

#### Scenario: Tema light entregado en modo claro
- **WHEN** el sistema operativo está en light mode
- **THEN** el contexto SHALL exponer el objeto `lightTheme`

#### Scenario: Tema dark entregado en modo oscuro
- **WHEN** el sistema operativo está en dark mode
- **THEN** el contexto SHALL exponer el objeto `darkTheme`

#### Scenario: Cambio automático al cambiar el modo del sistema
- **WHEN** el usuario cambia entre light/dark mode en Ajustes del sistema mientras la app está abierta
- **THEN** el tema en el contexto SHALL actualizarse sin recargar la app

---

### Requirement: Hook useTheme para acceso al tema
El sistema SHALL proveer un hook `useTheme()` exportado desde `src/theme/ThemeProvider.tsx` que retorna `{ theme, colorScheme }`.

- `theme`: el objeto de tema activo (colores, tipografía, spacing, radii, elevaciones, gradientes)
- `colorScheme`: `'light' | 'dark'`

#### Scenario: Acceso a colores desde un componente
- **WHEN** un componente llama `const { theme } = useTheme()`
- **THEN** `theme.colors.primary` SHALL retornar el color primario del modo activo

#### Scenario: Error si useTheme se usa fuera del Provider
- **WHEN** `useTheme()` se llama en un componente que no está dentro de `ThemeProvider`
- **THEN** SHALL lanzar un error descriptivo: `"useTheme must be used within ThemeProvider"`

---

### Requirement: ThemeProvider integrado en el layout raíz
`ThemeProvider` SHALL estar configurado en `app/_layout.tsx` envolviendo toda la navegación.

#### Scenario: Disponibilidad universal del tema
- **WHEN** cualquier pantalla dentro de `app/` usa `useTheme()`
- **THEN** SHALL recibir el tema activo sin configuración adicional en esa pantalla

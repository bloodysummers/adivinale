# Roadmap — Adivínale

## Diseño e identidad

- [ ] **Diseño de logo** — Crear identidad visual de la app: ícono, splash screen y assets de marca.
- [x] **Selección de tipografías** — Elegir y configurar fuentes custom (heading + body) para reemplazar el sistema por defecto. Integrar con el token `typography.fontFamily` del design system.

## Navegación y UX

- [ ] **Agregar menú** — Menú principal o drawer con acceso a ajustes, créditos y opciones de la sesión. Definir si es un tab, un hamburger o un bottom sheet.

## Gameplay

- [ ] **Calibración de giro** — Pantalla o flujo para calibrar el acelerómetro antes de iniciar la ronda. Permite ajustar el umbral de inclinación según el dispositivo y cómo cada jugador sostiene el teléfono.
- [ ] **PVP mode** — Modo multijugador por turnos dentro de una misma sesión: varios jugadores se pasan el teléfono, cada uno juega su ronda y al final se comparan puntajes.
- [ ] **Implementar submit de respuestas** — Formulario para permitir al usuario enviar sugerencias de palabras o categorías directamente desde la app. Requiere backend para recibir y almacenar las sugerencias.

## Contenido

- [ ] **Corregir contenido de categorías** — Revisar y limpiar las palabras existentes: eliminar duplicados, corregir ortografía, balancear dificultad por categoría.
- [ ] **Categoría de banderas** — Nueva categoría donde el jugador adivina países a partir de su bandera. Requiere assets de banderas y lógica de presentación.

## Infraestructura

- [ ] **Cache normalizado y persistencia offline** — Implementar caché local de categorías y palabras (MMKV o AsyncStorage) con invalidación por TTL. La app debe ser jugable sin conexión una vez que el contenido fue cargado al menos una vez.

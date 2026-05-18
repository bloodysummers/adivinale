# Adivínale

Juego de fiesta tipo "Heads Up" donde una persona sostiene el teléfono en la frente mientras sus amigos describen lo que aparece en pantalla. El jugador tiene 1 minuto para adivinar tantas palabras/conceptos como sea posible.

## Mecánica del juego

1. Se elige una categoría en la pantalla principal.
2. El jugador sostiene el teléfono en la frente (pantalla hacia afuera).
3. Los demás jugadores describen, actúan o dan pistas de lo que aparece en pantalla.
4. El jugador interactúa con el acelerómetro del dispositivo:
   - **Inclinar hacia arriba** → adivinó correctamente (suma punto, siguiente palabra).
   - **Inclinar hacia abajo** → pasa o falla (no suma, siguiente palabra).
5. Al terminar el minuto, se muestra el marcador de la ronda.

## Stack técnico

- **Framework:** Expo SDK 54 (bare workflow o managed workflow)
- **Lenguaje:** TypeScript
- **Navegación:** Expo Router (file-based routing)
- **Sensores:** `expo-sensors` (Accelerometer para detectar inclinación)
- **Contenido:** API REST / Backend externo (TBD — ver sección Backend)
- **Plataformas:** iOS y Android

## Arquitectura de la app

### Pantallas (`app/`)

| Ruta | Descripción |
|------|-------------|
| `(tabs)/index` | Home — selección de categoría |
| `game/ready` | Pantalla de cuenta regresiva antes de iniciar |
| `game/play` | Pantalla principal del juego (acelerómetro + timer + palabra) |
| `game/results` | Resultados de la ronda (palabras correctas / totales) |

### Estructura de directorios

```
app/                    # Pantallas (Expo Router)
├── (tabs)/
│   └── index.tsx       # Selección de categoría
├── game/
│   ├── ready.tsx       # Cuenta regresiva
│   ├── play.tsx        # Juego activo
│   └── results.tsx     # Resultados
├── _layout.tsx         # Layout raíz
assets/                 # Imágenes, fuentes, íconos
src/
├── api/                # Clientes HTTP y endpoints
├── components/         # Componentes reutilizables
├── hooks/              # Custom hooks (useAccelerometer, useGameTimer, etc.)
├── store/              # Estado global (Zustand o Context)
├── types/              # Tipos TypeScript compartidos
└── utils/              # Helpers y constantes
```

## Categorías

El contenido está en **español** por defecto. Algunas categorías tienen palabras/conceptos en inglés cuando aplica (ej. títulos de películas en inglés).

| Categoría | Idioma | Descripción |
|-----------|--------|-------------|
| Películas / Series | ES + EN | Títulos de cine y televisión |
| Personajes famosos | ES | Celebridades, actores, deportistas |
| Animales | ES | Animales comunes y exóticos |
| Acciones / Charadas | ES | Verbos y acciones para actuar |
| Anime | ES + EN | Títulos y personajes de anime |
| Música | ES + EN | Canciones, bandas, artistas |
| Arte | ES | Pinturas, esculturas, artistas |
| Países | ES | Países y capitales del mundo |
| Libros | ES + EN | Títulos y autores de literatura |
| Videojuegos | ES + EN | Títulos y personajes de videojuegos |

## Sistema de puntuación

- Tiempo por ronda: **60 segundos** (fijo)
- Palabras correctas: **+1 punto** por cada una
- Pasar o fallar: **0 puntos** (sin penalización)
- Al finalizar la ronda se muestra: aciertos / total de palabras presentadas

## Backend y contenido

El contenido (palabras por categoría) se consume desde una **API REST**. Pendiente de definir:

- [ ] Proveedor del backend (Firebase, Supabase, Node.js/Express en Railway, etc.)
- [ ] Estructura del endpoint: `GET /categories`, `GET /categories/:id/words`
- [ ] Paginación o carga completa al inicio de la ronda
- [ ] Caché local para soporte offline parcial

**Modelo de datos esperado:**

```typescript
interface Category {
  id: string;
  name: string;          // nombre en español
  emoji: string;         // ícono representativo
  language: 'es' | 'en' | 'es+en';
}

interface Word {
  id: string;
  categoryId: string;
  text: string;
  language: 'es' | 'en';
}
```

## Detección de inclinación (Accelerometer)

Se usa `expo-sensors` con el acelerómetro:

- **Arriba (correcto):** `acceleration.z > 0.7` y el teléfono supera cierto ángulo frontal hacia arriba.
- **Abajo (pasa):** `acceleration.z < -0.7` y el teléfono supera cierto ángulo frontal hacia abajo.
- Requiere un umbral de debounce para evitar activaciones accidentales (~500ms entre activaciones).
- La pantalla de juego debe estar en **landscape** o **portrait bloqueado** según el flujo definido.

## Comandos de desarrollo

```bash
npm start          # Inicia el servidor de desarrollo Expo
npm run ios        # Abre en simulador iOS
npm run android    # Abre en emulador Android
npm run web        # Abre en navegador (para pruebas de UI)
```

## Decisiones pendientes

- [ ] Definir proveedor de backend/API
- [ ] Definir diseño visual (paleta de colores, tipografía, estilo general)
- [ ] Definir flujo de onboarding / primera vez
- [ ] Definir si hay historial de partidas (almacenamiento local)
- [ ] Definir si hay modo multijugador / turnos múltiples en una sesión
- [ ] Monetización (free, freemium, pago por categoría)
- [ ] Política de permisos del acelerómetro en iOS

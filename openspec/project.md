# Adivínale — Project Context

## Descripción

Juego de fiesta tipo "Heads Up". Una persona sostiene el teléfono en la frente (pantalla hacia afuera) mientras sus amigos describen las palabras que aparecen. El jugador inclina el teléfono hacia arriba para marcar un acierto, hacia abajo para pasar. Tiene 60 segundos por ronda.

---

## Tech Stack

| Capa | Tecnología |
|------|------------|
| Framework | Expo SDK 54 (managed workflow) |
| Lenguaje | TypeScript 5.x |
| Navegación | Expo Router v4 (file-based) |
| Sensores | `expo-sensors` — Accelerometer |
| Estado global | Zustand |
| HTTP client | `fetch` nativo + cliente wrapper en `src/api/` |
| Backend | REST API (proveedor TBD: Supabase / Railway / Firebase) |
| Plataformas | iOS 16+ y Android 10+ |

---

## Arquitectura

### Estructura de directorios

```
app/                        # Pantallas — Expo Router (file-based routing)
├── _layout.tsx             # Root layout (Stack navigator)
├── index.tsx               # Home: selección de categoría
├── game/
│   ├── _layout.tsx         # Layout del flujo de juego
│   ├── ready.tsx           # Cuenta regresiva pre-ronda
│   ├── play.tsx            # Ronda activa (acelerómetro + timer + palabra)
│   └── results.tsx         # Resultados post-ronda

src/
├── api/                    # Clientes HTTP
│   ├── client.ts           # fetch wrapper (base URL, headers, error handling)
│   ├── categories.ts       # GET /categories, GET /categories/:id
│   └── words.ts            # GET /categories/:id/words
├── components/             # Componentes UI reutilizables
│   ├── CategoryCard.tsx
│   ├── WordDisplay.tsx
│   ├── Timer.tsx
│   └── ScoreBoard.tsx
├── hooks/                  # Custom hooks
│   ├── useAccelerometer.ts # Detección de inclinación con debounce
│   ├── useGameTimer.ts     # Countdown de 60 segundos
│   └── useRound.ts         # Orquestación del estado de una ronda
├── store/                  # Estado global con Zustand
│   └── gameStore.ts        # Ronda activa, categoría, historial
├── types/                  # Tipos TypeScript compartidos
│   └── index.ts
└── utils/
    ├── accelerometer.ts    # Constantes y lógica de umbral
    └── shuffle.ts          # Fisher-Yates para barajar palabras

assets/
├── fonts/
└── images/
    └── categories/         # Imágenes o íconos por categoría

docs/
└── openapi.yaml            # Contrato REST (referencia)
```

---

## Modelos de datos

```typescript
// Categoría de juego
interface Category {
  id: string;
  slug: string;             // ej. "peliculas-series"
  name: string;             // ej. "Películas / Series"
  emoji: string;            // ej. "🎬"
  language: 'es' | 'en' | 'es+en';
  isPremium: boolean;       // para monetización futura
  wordCount: number;        // total de palabras disponibles
}

// Palabra individual
interface Word {
  id: string;
  categoryId: string;
  text: string;             // la palabra o frase a adivinar
  language: 'es' | 'en';
}

// Resultado de una ronda
interface RoundResult {
  categoryId: string;
  categoryName: string;
  score: number;            // palabras adivinadas correctamente
  totalWords: number;       // palabras presentadas en la ronda
  durationSeconds: number;  // siempre 60
  playedAt: string;         // ISO 8601
}

// Estado de una palabra durante el juego
type WordStatus = 'pending' | 'correct' | 'skipped';

interface RoundWord {
  word: Word;
  status: WordStatus;
}
```

---

## Base de datos

PostgreSQL en **Neon.tech** (serverless Postgres).

- La app móvil **no se conecta directamente** a la base de datos; toda interacción pasa por la API REST.
- El backend es el único cliente de Neon.
- Neon provee una connection string estándar (`postgresql://user:pass@host/db?sslmode=require`) que el backend consume vía variable de entorno `DATABASE_URL`.
- Se usa el driver estándar de PostgreSQL (`pg` en Node.js o el cliente que provea el backend elegido).

### Esquema inicial

```sql
CREATE TABLE categories (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug        TEXT UNIQUE NOT NULL,
  name        TEXT NOT NULL,
  emoji       TEXT NOT NULL,
  language    TEXT NOT NULL CHECK (language IN ('es', 'en', 'es+en')),
  is_premium  BOOLEAN NOT NULL DEFAULT false,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE words (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id  UUID NOT NULL REFERENCES categories(id) ON DELETE CASCADE,
  text         TEXT NOT NULL,
  language     TEXT NOT NULL CHECK (language IN ('es', 'en')),
  created_at   TIMESTAMPTZ NOT NULL DEFAULT now()
);
```

---

## API REST

Base URL: definida en variable de entorno `EXPO_PUBLIC_API_URL`.

### Endpoints

```
GET  /categories                      Lista todas las categorías
GET  /categories/:id                  Detalle de una categoría
GET  /categories/:id/words?limit=N    Palabras para una ronda (shuffled en servidor)
```

### Contratos

**GET /categories**
```json
{
  "data": [Category],
  "meta": { "total": 10 }
}
```

**GET /categories/:id/words?limit=30**
```json
{
  "data": [Word],
  "meta": { "total": 30, "categoryId": "string" }
}
```

Los errores siguen el formato:
```json
{ "error": { "code": "NOT_FOUND", "message": "Category not found" } }
```

---

## Flujos principales

### Flujo de juego

```
Home (index.tsx)
  └─► [elige categoría]
        └─► game/ready.tsx        ← cuenta regresiva 3-2-1
              └─► game/play.tsx   ← ronda activa 60s
                    ├─► [inclina arriba] → correcto → siguiente palabra
                    ├─► [inclina abajo] → pasa → siguiente palabra
                    └─► [timer = 0] → game/results.tsx
                          └─► [jugar de nuevo] → game/ready.tsx
                          └─► [cambiar categoría] → Home
```

### Detección de inclinación

El hook `useAccelerometer` suscribe al acelerómetro con `setUpdateInterval(100ms)`.

- **Correcto:** eje Z < -0.7 sostenido por >150ms (teléfono inclinado hacia atrás/arriba cuando está en la frente)
- **Pasa:** eje Z > 0.7 sostenido por >150ms (teléfono inclinado hacia adelante/abajo)
- **Debounce:** 600ms entre activaciones para evitar doble disparo

```typescript
// Orientación de referencia: teléfono vertical en la frente del jugador
// z < -0.7  →  correcto (inclina hacia atrás)
// z >  0.7  →  pasa    (inclina hacia adelante)
const CORRECT_THRESHOLD = -0.7;
const SKIP_THRESHOLD    =  0.7;
const HOLD_DURATION_MS  =  150;
const DEBOUNCE_MS       =  600;
```

---

## Convenciones de código

### Archivos y componentes
- Componentes: `PascalCase.tsx`
- Hooks: `useCamelCase.ts`
- Utilidades: `camelCase.ts`
- Tipos: definidos en `src/types/index.ts`, exportados con nombre

### TypeScript
- No usar `any`; preferir `unknown` cuando el tipo es incierto
- Props de componentes como `interface`, no `type`
- Funciones exportadas con `export function`, no `export default function` (excepto en pantallas Expo Router que requieren default)

### Estado (Zustand)
- Un solo store en `src/store/gameStore.ts`
- Slices por dominio si el store crece: `roundSlice`, `historySlice`
- Selectores derivados dentro del mismo store

### API calls
- Toda llamada HTTP pasa por `src/api/client.ts`
- Los hooks de datos (ej. `useCategories`) viven en `src/hooks/`, no en pantallas
- Errores de red manejados con `try/catch` en el hook; la UI recibe `{ data, error, isLoading }`

### Estilos
- `StyleSheet.create` de React Native (sin styled-components)
- Colores, tipografía y spacing en `src/utils/theme.ts`
- Sin magic numbers en estilos; usar constantes del theme

### Navegación
- Parámetros de ruta tipados con los helpers de Expo Router
- Estado de juego en Zustand, no en params de navegación (excepto IDs simples)

---

## Variables de entorno

```
EXPO_PUBLIC_API_URL=https://api.adivinale.app/v1
```

Definidas en `.env` (no comitear) y declaradas en `app.config.ts` bajo `extra`.

---

## Categorías disponibles

| slug | Nombre | Idioma |
|------|--------|--------|
| `peliculas-series` | Películas / Series | ES + EN |
| `personajes-famosos` | Personajes famosos | ES |
| `animales` | Animales | ES |
| `acciones-charadas` | Acciones / Charadas | ES |
| `anime` | Anime | ES + EN |
| `musica` | Música | ES + EN |
| `arte` | Arte | ES |
| `paises` | Países | ES |
| `libros` | Libros | ES + EN |
| `videojuegos` | Videojuegos | ES + EN |

---

## Decisiones pendientes

- **Backend provider:** Supabase (recomendado por BaaS + REST automático + auth futura) vs. Railway + Node.js vs. Firebase
- **Historial de partidas:** SQLite local con `expo-sqlite` para no requerir cuenta de usuario
- **Monetización:** `isPremium: true` en ciertas categorías; desbloqueo con compra in-app (`expo-iap`)
- **Onboarding:** Pantalla de instrucciones la primera vez (flag en `AsyncStorage`)
- **Modo multi-turno:** Acumular puntajes de varios jugadores en una sesión antes de ver resultados finales

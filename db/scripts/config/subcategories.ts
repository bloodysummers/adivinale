export type SubcategoryDef = {
  label: string;
  limit: number;
};

export type CategoryConfig = {
  id: string;
  name: string;
  emoji: string;
  language: 'es' | 'en' | 'es+en';
  subcategories: SubcategoryDef[];
};

export const CATEGORIES: CategoryConfig[] = [
  {
    id: 'peliculas',
    name: 'Películas',
    emoji: '🎬',
    language: 'es+en',
    subcategories: [
      { label: 'Clásicos pre-1980', limit: 50 },
      { label: 'Décadas 80s', limit: 35 },
      { label: 'Décadas 90s', limit: 35 },
      { label: 'Décadas 2000s', limit: 35 },
      { label: 'Décadas 2010-2024', limit: 50 },
      { label: 'Animación', limit: 25 },
      { label: 'Superhéroes/Acción', limit: 20 },
      { label: 'Comedia', limit: 20 },
      { label: 'Drama/Romance', limit: 20 },
      { label: 'Terror/Suspenso', limit: 20 },
      { label: 'Ciencia ficción/Fantasía', limit: 20 },
      { label: 'Cine de arte/Independiente', limit: 20 },
      { label: 'Películas icónicas', limit: 40 },
      { label: 'Mexicanas', limit: 30 },
      { label: 'Europeas', limit: 30 },
      { label: 'Asiáticas', limit: 30 },
      { label: 'Latinoamericanas', limit: 30 },
      { label: 'Actores/Actrices', limit: 150 },
      { label: 'Directores', limit: 50 },
    ],
  },
  {
    id: 'series',
    name: 'Series',
    emoji: '📺',
    language: 'es+en',
    subcategories: [
      { label: 'Drama', limit: 35 },
      { label: 'Comedia', limit: 35 },
      { label: 'Animadas adultos', limit: 25 },
      { label: 'Reality/Documental', limit: 25 },
      { label: 'Recientes populares', limit: 40 },
      { label: 'Clásicos icónicos', limit: 30 },
      { label: 'Terror/Suspenso', limit: 25 },
      { label: 'Ciencia ficción/Fantasía', limit: 25 },
      { label: 'Extrañas/Únicas', limit: 25 },
      { label: 'Romance', limit: 20 },
      { label: 'Policiales/Crimen', limit: 25 },
    ],
  },
  {
    id: 'personajes',
    name: 'Personajes Famosos',
    emoji: '🌟',
    language: 'es',
    subcategories: [
      { label: 'Actores/Actrices', limit: 100 },
      { label: 'Deportistas', limit: 50 },
      { label: 'Músicos/Artistas', limit: 100 },
      { label: 'Políticos históricos', limit: 100 },
      { label: 'Empresarios/Innovadores', limit: 30 },
      { label: 'Influencers digitales', limit: 30 },
      { label: 'Personajes icónicos', limit: 50 },
      { label: 'Personajes históricos', limit: 50 },
      { label: 'Presidentes mexicanos', limit: 10 },
      { label: 'Presidentes importantes mundiales', limit: 30 },
      { label: 'Escritores', limit: 50 },
      { label: 'Científicos', limit: 50 },
      { label: 'Artistas visuales', limit: 50 }
    ],
  },
  {
    id: 'animales',
    name: 'Animales',
    emoji: '🐾',
    language: 'es',
    subcategories: [
      { label: 'Domésticos/Granja', limit: 25 },
      { label: 'Mamíferos salvajes', limit: 30 },
      { label: 'Marinos', limit: 25 },
      { label: 'Aves', limit: 25 },
      { label: 'Reptiles/Anfibios', limit: 20 },
      { label: 'Insectos/Arácnidos', limit: 25 },
      { label: 'Extintos', limit: 20 }
    ],
  },
  {
    id: 'anime',
    name: 'Anime',
    emoji: '🗡️',
    language: 'es+en',
    subcategories: [
      { label: 'Shōnen/Acción', limit: 35 },
      { label: 'Comedia/Slice of Life', limit: 25 },
      { label: 'Drama/Seinen', limit: 25 },
      { label: 'Familiar/Ghibli', limit: 25 },
      { label: 'Personajes icónicos', limit: 40 },
      { label: 'Series clásicas', limit: 30 },
      { label: 'Series modernas', limit: 30 }
    ],
  },
  {
    id: 'musica',
    name: 'Música',
    emoji: '🎵',
    language: 'es+en',
    subcategories: [
      { label: 'Pop internacional', limit: 50 },
      { label: 'Rock/Metal', limit: 50 },
      { label: 'Reggaetón/Urbano', limit: 35 },
      { label: 'Latinos clásicos', limit: 35 },
      { label: 'Canciones icónicas', limit: 35 },
      { label: 'Bandas clásicas', limit: 30 },
      { label: 'Bandas modernas', limit: 30 },
      { label: 'Músicos solistas', limit: 50 }
    ],
  },
  {
    id: 'arte',
    name: 'Arte',
    emoji: '🎨',
    language: 'es',
    subcategories: [
      { label: 'Pintores clásicos', limit: 50 },
      { label: 'Pintores modernos', limit: 50 },
      { label: 'Pinturas famosas', limit: 50 },
      { label: 'Esculturas', limit: 30 },
      { label: 'Contemporáneos', limit: 30 },
      { label: 'Movimientos artísticos', limit: 30 },
      { label: 'Artistas latinoamericanos', limit: 20 }
    ],
  },
  {
    id: 'paises',
    name: 'Países',
    emoji: '🌍',
    language: 'es',
    subcategories: [
      { label: 'Europa occidental', limit: 30 },
      { label: 'Américas', limit: 30 },
      { label: 'Asia conocida', limit: 30 },
      { label: 'África reconocida', limit: 30 },
      { label: 'Resto', limit: 30 },
    ],
  },
  {
    id: 'libros',
    name: 'Libros',
    emoji: '📚',
    language: 'es+en',
    subcategories: [
      { label: 'Clásicos universales', limit: 50 },
      { label: 'Literatura latina', limit: 30 },
      { label: 'Bestsellers modernos', limit: 40 },
      { label: 'Sagas populares', limit: 30 },
      { label: 'Autores icónicos', limit: 30 },
      { label: 'Libros infantiles', limit: 20 }
    ],
  },
  {
    id: 'personajes-ficticios',
    name: 'Personajes Ficticios',
    emoji: '🎭',
    language: 'es',
    subcategories: [
      { label: 'Superhéroes', limit: 30 },
      { label: 'Personajes de cine', limit: 30 },
      { label: 'Personajes de TV', limit: 30 },
      { label: 'Personajes literarios', limit: 30 },
      { label: 'Animación', limit: 30 },
      { label: 'Villanos icónicos', limit: 20 },
      { label: 'Personajes de videojuegos', limit: 20 },
    ],
  },
  {
    id: 'videojuegos',
    name: 'Videojuegos',
    emoji: '🎮',
    language: 'en',
    subcategories: [
      { label: 'Nintendo clásico', limit: 35 },
      { label: 'Títulos 90s/2000s', limit: 40 },
      { label: 'Títulos modernos', limit: 40 },
      { label: 'Franquicias PlayStation/Xbox', limit: 35 },
      { label: 'Personajes icónicos', limit: 30 },
      { label: 'Juegos de PC', limit: 50 },
      { label: 'Juegos de móvil', limit: 30 },
      { label: 'Juegos indie', limit: 30 },
      { label: 'Juegos de deportes/carreras', limit: 20 },
      { label: 'Juegos de lucha', limit: 20 },
      { label: 'Juegos de rol', limit: 30 },
      { label: 'Juegos de disparos', limit: 30 },
      { label: 'Juegos de aventura', limit: 30 },
      { label: 'Juegos de estrategia', limit: 20 },
      { label: 'Juegos de simulación', limit: 10 },
      { label: 'Juegos de plataformas', limit: 30 },
      { label: 'Juegos de terror/suspenso', limit: 20 }
    ],
  },
];

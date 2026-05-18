INSERT INTO categories (id, name, emoji, language) VALUES
  ('peliculas', 'Películas', '🎬', 'es+en'),
  ('series',    'Series',    '📺', 'es+en')
ON CONFLICT (id) DO NOTHING;

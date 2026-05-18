CREATE TABLE IF NOT EXISTS categories (
  id       TEXT PRIMARY KEY,
  name     TEXT NOT NULL,
  emoji    TEXT NOT NULL,
  language TEXT NOT NULL CHECK (language IN ('es', 'en', 'es+en'))
);

CREATE TABLE IF NOT EXISTS words (
  id          SERIAL PRIMARY KEY,
  category_id TEXT NOT NULL REFERENCES categories(id) ON DELETE CASCADE,
  text        TEXT NOT NULL,
  language    TEXT NOT NULL CHECK (language IN ('es', 'en')),
  subtext     TEXT
);

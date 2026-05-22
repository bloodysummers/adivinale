import fs from 'fs';
import path from 'path';
import { Pool } from '@neondatabase/serverless';
import { loadEnv } from './_utils.js';

// All curated SQL files in seed order
const SQL_FILES = [
  'peliculas-curated.sql',
  'series-curated.sql',
  'personajes-curated.sql',
  'animales-curated.sql',
  'anime-curated.sql',
  'musica-curated.sql',
  'arte-curated.sql',
  'paises-curated.sql',
  'libros-curated.sql',
  'videojuegos-curated.sql',
  'ficticios-curated.sql',
];

// Sync categories with the config: rename old IDs, insert missing ones
const CATEGORY_RENAMES = [
  { from: 'personajes-famosos', to: 'personajes' },
];

const MISSING_CATEGORIES = [
  { id: 'personajes-ficticios', name: 'Personajes Ficticios', emoji: '🎭', language: 'es' },
];

async function main() {
  loadEnv();

  const url = process.env.NEON_DATABASE_URL;
  if (!url) throw new Error('NEON_DATABASE_URL no está configurada en .env.local');

  const pool = new Pool({ connectionString: url });
  const seedDir = path.resolve(process.cwd(), 'db/seed/words');

  // Rename category IDs that changed
  for (const { from, to } of CATEGORY_RENAMES) {
    await pool.query(`UPDATE categories SET id = $1 WHERE id = $2`, [to, from]);
    console.log(`✓ Renamed category '${from}' → '${to}'`);
  }

  // Insert missing categories
  for (const cat of MISSING_CATEGORIES) {
    await pool.query(
      `INSERT INTO categories (id, name, emoji, language) VALUES ($1, $2, $3, $4) ON CONFLICT (id) DO NOTHING`,
      [cat.id, cat.name, cat.emoji, cat.language]
    );
    console.log(`✓ Ensured category '${cat.id}'`);
  }

  // Seed words from each SQL file
  for (const file of SQL_FILES) {
    const filePath = path.join(seedDir, file);
    const query = fs.readFileSync(filePath, 'utf8');
    const result = await pool.query(query);
    console.log(`✓ Seeded ${file} (${result.rowCount ?? '?'} rows)`);
  }

  await pool.end();
  console.log('\nDone! All categories and words seeded.');
}

main().catch((err) => { console.error(err); process.exit(1); });

import { Pool } from '@neondatabase/serverless';
import { loadEnv } from './_utils.js';

async function main() {
  loadEnv();
  const url = process.env.NEON_DATABASE_URL;
  if (!url) throw new Error('NEON_DATABASE_URL no está configurada en .env.local');
  const pool = new Pool({ connectionString: url });
  const { rows } = await pool.query('SELECT id, name FROM categories ORDER BY id');
  console.log('Categories in DB:');
  for (const r of rows) console.log(' ', r.id, '-', r.name);
  await pool.end();
}

main().catch((err) => { console.error(err); process.exit(1); });

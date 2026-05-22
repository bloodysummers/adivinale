import { neon } from '@neondatabase/serverless';
import { loadEnv, hasFlag } from './_utils.js';

async function main() {
  loadEnv();

  const url = process.env.NEON_DATABASE_URL;
  if (!url) throw new Error('NEON_DATABASE_URL no está configurada en .env.local');

  const sql = neon(url);

  const [{ count }] = await sql`SELECT count(*)::int AS count FROM words` as [{ count: number }];

  if (!hasFlag('--execute')) {
    console.log(`Dry run: ${count} rows would be deleted from 'words'.`);
    console.log('Run with --execute to truncate the table.');
    process.exit(0);
  }

  await sql`TRUNCATE words`;
  console.log(`✓ Truncated 'words' (${count} rows deleted)`);
}

main().catch((err) => { console.error(err); process.exit(1); });

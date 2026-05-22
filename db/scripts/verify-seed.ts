import { Pool } from '@neondatabase/serverless';
import { loadEnv } from './_utils.js';

async function main() {
  loadEnv();
  const url = process.env.NEON_DATABASE_URL;
  if (!url) throw new Error('NEON_DATABASE_URL no está configurada en .env.local');
  const pool = new Pool({ connectionString: url });

  const { rows } = await pool.query(`
    SELECT category_id, subcategory, count(*)::int AS count
    FROM words
    GROUP BY category_id, subcategory
    ORDER BY category_id, subcategory
  `);

  let currentCat = '';
  let catTotal = 0;
  let grandTotal = 0;
  for (const r of rows) {
    if (r.category_id !== currentCat) {
      if (currentCat) console.log(`  TOTAL ${currentCat}: ${catTotal}`);
      currentCat = r.category_id;
      catTotal = 0;
      console.log(`\n${r.category_id}`);
    }
    console.log(`  ${r.subcategory ?? '(none)'}: ${r.count}`);
    catTotal += r.count;
    grandTotal += r.count;
  }
  if (currentCat) console.log(`  TOTAL ${currentCat}: ${catTotal}`);
  console.log(`\nGRAND TOTAL: ${grandTotal} words`);

  await pool.end();
}

main().catch((err) => { console.error(err); process.exit(1); });

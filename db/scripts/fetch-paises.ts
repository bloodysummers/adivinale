import { loadEnv, writeSQL, executeRows, ensureCategory, hasFlag, WordRow } from './_utils.js';

const OUTPUT = 'db/seed/words/paises.sql';
const CATEGORY = { id: 'paises', name: 'Países', emoji: '🌍', language: 'es' as const };
const API_URL = 'https://restcountries.com/v3.1/all?fields=translations,name';

async function main() {
  loadEnv();

  console.log('Fetching countries from RestCountries…');
  const res = await fetch(API_URL);
  if (!res.ok) throw new Error(`RestCountries error: ${res.status}`);
  const data = (await res.json()) as Array<{
    name: { common: string };
    translations?: { spa?: { common?: string } };
  }>;

  const rows: WordRow[] = [];
  for (const country of data) {
    const name = country.translations?.spa?.common ?? country.name.common;
    if (!name || name.length > 50) continue;
    rows.push({ category_id: CATEGORY.id, text: name, language: 'es' });
  }
  rows.sort((a, b) => a.text.localeCompare(b.text, 'es'));

  writeSQL(OUTPUT, rows);

  if (hasFlag('--execute')) {
    await ensureCategory(CATEGORY.id, CATEGORY.name, CATEGORY.emoji, CATEGORY.language);
    await executeRows(rows);
  }
}

main().catch((e) => { console.error(e); process.exit(1); });

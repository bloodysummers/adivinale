import { loadEnv, writeSQL, executeRows, ensureCategory, hasFlag, WordRow, sleep } from './_utils.js';

const OUTPUT = 'db/seed/words/videojuegos.sql';
const CATEGORY = { id: 'videojuegos', name: 'Videojuegos', emoji: '🎮', language: 'en' as const };
const TARGET = 1000;
const PAGE_SIZE = 40;

interface RawgGame { name: string }
interface RawgResponse { results: RawgGame[]; next: string | null }

async function fetchPage(apiKey: string, page: number): Promise<RawgResponse> {
  const url = `https://api.rawg.io/api/games?key=${apiKey}&ordering=-rating&page_size=${PAGE_SIZE}&page=${page}`;
  const res = await fetch(url, { headers: { 'User-Agent': 'adivinale-seed/1.0' } });
  if (!res.ok) throw new Error(`RAWG error: ${res.status} ${await res.text()}`);
  return res.json() as Promise<RawgResponse>;
}

async function main() {
  loadEnv();

  const apiKey = process.env.RAWG_API_KEY;
  if (!apiKey) throw new Error('Error: RAWG_API_KEY no está configurada en .env.local');

  const rows: WordRow[] = [];
  const seen = new Set<string>();
  let page = 1;

  console.log('Fetching games from RAWG…');

  while (rows.length < TARGET) {
    const data = await fetchPage(apiKey, page);

    for (const game of data.results) {
      if (!game.name || game.name.length > 80) continue;
      const key = game.name.toLowerCase();
      if (seen.has(key)) continue;
      seen.add(key);
      rows.push({ category_id: CATEGORY.id, text: game.name, language: 'en' });
    }

    console.log(`  Page ${page}: ${data.results.length} items fetched, ${rows.length} total`);

    if (!data.next) break;
    page++;
    await sleep(300);
  }

  writeSQL(OUTPUT, rows);

  if (hasFlag('--execute')) {
    await ensureCategory(CATEGORY.id, CATEGORY.name, CATEGORY.emoji, CATEGORY.language);
    await executeRows(rows);
  }
}

main().catch((e) => { console.error(e); process.exit(1); });

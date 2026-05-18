import { loadEnv, writeSQL, executeRows, ensureCategory, hasFlag, WordRow, sleep } from './_utils.js';

const OUTPUT = 'db/seed/words/anime.sql';
const CATEGORY = { id: 'anime', name: 'Anime', emoji: '⛩️', language: 'es+en' as const };
const API_URL = 'https://graphql.anilist.co';
const TARGET = 1000;
const PER_PAGE = 50;

const QUERY = `
query ($page: Int, $perPage: Int) {
  Page(page: $page, perPage: $perPage) {
    pageInfo { hasNextPage }
    media(type: ANIME, sort: POPULARITY_DESC) {
      title { romaji english }
    }
  }
}`;

interface AniListResponse {
  data: {
    Page: {
      pageInfo: { hasNextPage: boolean };
      media: Array<{ title: { romaji: string | null; english: string | null } }>;
    };
  };
}

async function fetchPage(page: number): Promise<AniListResponse> {
  const res = await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify({ query: QUERY, variables: { page, perPage: PER_PAGE } }),
  });
  if (!res.ok) throw new Error(`AniList error: ${res.status} ${await res.text()}`);
  return res.json() as Promise<AniListResponse>;
}

async function main() {
  loadEnv();

  const rows: WordRow[] = [];
  const seen = new Set<string>();
  let page = 1;

  console.log('Fetching anime from AniList…');

  while (rows.length < TARGET) {
    const data = await fetchPage(page);
    const media = data.data.Page.media;

    for (const item of media) {
      const text = item.title.english ?? item.title.romaji;
      if (!text || text.length > 60) continue;
      const key = text.toLowerCase();
      if (seen.has(key)) continue;
      seen.add(key);
      rows.push({ category_id: CATEGORY.id, text, language: 'en' });
    }

    console.log(`  Page ${page}: ${media.length} items fetched, ${rows.length} total`);

    if (!data.data.Page.pageInfo.hasNextPage) break;
    page++;
    await sleep(600);
  }

  writeSQL(OUTPUT, rows);

  if (hasFlag('--execute')) {
    await ensureCategory(CATEGORY.id, CATEGORY.name, CATEGORY.emoji, CATEGORY.language);
    await executeRows(rows);
  }
}

main().catch((e) => { console.error(e); process.exit(1); });

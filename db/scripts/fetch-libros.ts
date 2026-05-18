import { loadEnv, writeSQL, executeRows, ensureCategory, hasFlag, WordRow, sleep } from './_utils.js';

const OUTPUT = 'db/seed/words/libros.sql';
const CATEGORY = { id: 'libros', name: 'Libros', emoji: '📚', language: 'es+en' as const };
const TARGET = 1000;

const SUBJECTS = [
  'fiction', 'mystery', 'science fiction', 'history', 'biography',
  'fantasy', 'romance', 'science', 'philosophy', 'adventure',
  'poetry', 'drama', 'politics', 'horror', 'classics',
];

interface OLDoc {
  title?: string;
  author_name?: string[];
  language?: string[];
}
interface OLResponse { docs: OLDoc[]; numFound: number }

async function fetchPage(subject: string, offset: number): Promise<OLResponse> {
  const q = encodeURIComponent(subject);
  const url = `https://openlibrary.org/search.json?subject=${q}&fields=title,author_name,language&limit=100&offset=${offset}`;
  const res = await fetch(url, { headers: { 'User-Agent': 'adivinale-game/1.0 (contact: dev)' } });
  if (!res.ok) throw new Error(`Open Library error: ${res.status}`);
  return res.json() as Promise<OLResponse>;
}

async function main() {
  loadEnv();

  const rows: WordRow[] = [];
  const seenTitles = new Set<string>();
  const seenAuthors = new Set<string>();

  console.log('Fetching books from Open Library…');

  for (const subject of SUBJECTS) {
    if (rows.length >= TARGET) break;

    const data = await fetchPage(subject, 0);
    console.log(`  [${subject}]: ${data.docs.length} books, ${rows.length} total so far`);

    for (const doc of data.docs) {
      if (!doc.title) continue;
      const titleKey = doc.title.toLowerCase().trim();
      if (titleKey.length > 70 || seenTitles.has(titleKey)) continue;
      seenTitles.add(titleKey);

      const isSpanish = doc.language?.includes('spa') ?? false;
      rows.push({ category_id: CATEGORY.id, text: doc.title.trim(), language: isSpanish ? 'es' : 'en' });

      for (const author of doc.author_name ?? []) {
        const authorKey = author.toLowerCase().trim();
        if (author.length > 50 || seenAuthors.has(authorKey)) continue;
        seenAuthors.add(authorKey);
        rows.push({ category_id: CATEGORY.id, text: author.trim(), language: 'en' });
      }

      if (rows.length >= TARGET) break;
    }

    await sleep(500);
  }

  writeSQL(OUTPUT, rows);

  if (hasFlag('--execute')) {
    await ensureCategory(CATEGORY.id, CATEGORY.name, CATEGORY.emoji, CATEGORY.language);
    await executeRows(rows);
  }
}

main().catch((e) => { console.error(e); process.exit(1); });

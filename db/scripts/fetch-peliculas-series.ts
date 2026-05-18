import { loadEnv, writeSQL, executeRows, ensureCategory, hasFlag, WordRow, sleep } from './_utils.js';
import { neon } from '@neondatabase/serverless';

const OUTPUT_MOVIES = 'db/seed/words/peliculas-tmdb.sql';
const OUTPUT_SERIES = 'db/seed/words/series-tmdb.sql';
const CAT_MOVIES = { id: 'peliculas', name: 'Películas', emoji: '🎬', language: 'es+en' as const };
const CAT_SERIES = { id: 'series', name: 'Series', emoji: '📺', language: 'es+en' as const };
const TARGET = 600;
const PAGE_SIZE = 20;

interface TmdbMovie {
  title: string;
  original_title: string;
}
interface TmdbShow {
  name: string;
  original_name: string;
}
interface TmdbMoviePage { results: TmdbMovie[]; total_pages: number }
interface TmdbShowPage { results: TmdbShow[]; total_pages: number }

async function fetchWithRetry(url: string, label: string, retries = 3): Promise<Response> {
  for (let attempt = 1; attempt <= retries; attempt++) {
    const res = await fetch(url);
    if (res.ok) return res;
    if (res.status >= 500 && attempt < retries) {
      console.warn(`  TMDB ${res.status} on ${label}, retry ${attempt}/${retries - 1}…`);
      await sleep(2000 * attempt);
      continue;
    }
    throw new Error(`TMDB error: ${res.status} ${await res.text()}`);
  }
  throw new Error('fetchWithRetry: exhausted retries');
}

async function fetchMoviePage(apiKey: string, page: number): Promise<TmdbMoviePage> {
  const url = `https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}&language=es-MX&sort_by=popularity.desc&page=${page}`;
  const res = await fetchWithRetry(url, `movie page ${page}`);
  return res.json() as Promise<TmdbMoviePage>;
}

async function fetchShowPage(apiKey: string, page: number): Promise<TmdbShowPage> {
  const url = `https://api.themoviedb.org/3/discover/tv?api_key=${apiKey}&language=es-MX&sort_by=popularity.desc&page=${page}`;
  const res = await fetchWithRetry(url, `tv page ${page}`);
  return res.json() as Promise<TmdbShowPage>;
}

async function deleteCategory(dbUrl: string, categoryId: string): Promise<void> {
  const sql = neon(dbUrl);
  await sql`DELETE FROM words WHERE category_id = ${categoryId}`;
  console.log(`✓ Cleared existing '${categoryId}' words`);
}

async function main() {
  loadEnv();

  const apiKey = process.env.TMDB_API_KEY;
  if (!apiKey) throw new Error('Error: TMDB_API_KEY no está configurada en .env.local');

  const movieRows: WordRow[] = [];
  const seenMovies = new Set<string>();
  const seriesRows: WordRow[] = [];
  const seenSeries = new Set<string>();

  // --- Fetch movies ---
  console.log('Fetching movies from TMDB…');
  let page = 1;
  while (movieRows.length < TARGET) {
    const data = await fetchMoviePage(apiKey, page);
    for (const m of data.results) {
      const key = (m.original_title ?? m.title).toLowerCase();
      if (!m.title || key.length > 80 || seenMovies.has(key)) continue;
      seenMovies.add(key);
      const hasSpanish = m.title !== m.original_title;
      movieRows.push({
        category_id: CAT_MOVIES.id,
        text: hasSpanish ? m.title : m.original_title,
        language: hasSpanish ? 'es' : 'en',
        subtext: hasSpanish ? m.original_title : undefined,
      });
    }
    console.log(`  Movie page ${page}: ${data.results.length} fetched, ${movieRows.length} total`);
    if (page >= data.total_pages || page >= 40) break;
    page++;
    await sleep(250);
  }

  // --- Fetch series ---
  console.log('Fetching series from TMDB…');
  page = 1;
  while (seriesRows.length < TARGET) {
    const data = await fetchShowPage(apiKey, page);
    for (const s of data.results) {
      const key = (s.original_name ?? s.name).toLowerCase();
      if (!s.name || key.length > 80 || seenSeries.has(key)) continue;
      seenSeries.add(key);
      const hasSpanish = s.name !== s.original_name;
      seriesRows.push({
        category_id: CAT_SERIES.id,
        text: hasSpanish ? s.name : s.original_name,
        language: hasSpanish ? 'es' : 'en',
        subtext: hasSpanish ? s.original_name : undefined,
      });
    }
    console.log(`  Series page ${page}: ${data.results.length} fetched, ${seriesRows.length} total`);
    if (page >= data.total_pages || page >= 40) break;
    page++;
    await sleep(250);
  }

  writeSQL(OUTPUT_MOVIES, movieRows);
  writeSQL(OUTPUT_SERIES, seriesRows);

  if (hasFlag('--execute')) {
    const dbUrl = process.env.NEON_DATABASE_URL!;
    if (!dbUrl) throw new Error('NEON_DATABASE_URL no está configurada en .env.local');
    await deleteCategory(dbUrl, CAT_MOVIES.id);
    await deleteCategory(dbUrl, CAT_SERIES.id);
    await ensureCategory(CAT_MOVIES.id, CAT_MOVIES.name, CAT_MOVIES.emoji, CAT_MOVIES.language);
    await ensureCategory(CAT_SERIES.id, CAT_SERIES.name, CAT_SERIES.emoji, CAT_SERIES.language);
    await executeRows(movieRows);
    await executeRows(seriesRows);
  }
}

main().catch((e) => { console.error(e); process.exit(1); });

import { loadEnv, writeSQL, executeRows, ensureCategory, hasFlag, WordRow, sleep } from './_utils.js';

const OUTPUT = 'db/seed/words/musica.sql';
const CATEGORY = { id: 'musica', name: 'Música', emoji: '🎵', language: 'es+en' as const };
const TARGET = 1000;
const LIMIT = 100;
const USER_AGENT = 'adivinale-game/1.0 (contact: dev)';

const ES_COUNTRIES = new Set([
  'ES', 'MX', 'AR', 'CL', 'CO', 'PE', 'VE', 'CU', 'BO', 'EC',
  'PY', 'UY', 'HN', 'SV', 'NI', 'CR', 'PA', 'GT', 'DO', 'PR',
]);

const TAGS = [
  'rock', 'pop', 'hip hop', 'latin', 'electronic', 'metal', 'jazz',
  'indie', 'reggaeton', 'soul', 'r&b', 'folk', 'alternative', 'salsa',
];

interface MbArtist {
  name: string;
  country?: string;
  area?: { 'iso-3166-1-codes'?: string[] };
}

interface MbResponse {
  artists: MbArtist[];
  count: number;
}

async function fetchPage(tag: string, offset: number): Promise<MbResponse> {
  const q = encodeURIComponent(`tag:${tag}`);
  const url = `https://musicbrainz.org/ws/2/artist?query=${q}&fmt=json&limit=${LIMIT}&offset=${offset}`;
  const res = await fetch(url, { headers: { 'User-Agent': USER_AGENT } });
  if (!res.ok) throw new Error(`MusicBrainz error: ${res.status} ${await res.text()}`);
  return res.json() as Promise<MbResponse>;
}

function detectLanguage(artist: MbArtist): 'es' | 'en' {
  const country = artist.country ?? artist.area?.['iso-3166-1-codes']?.[0];
  return country && ES_COUNTRIES.has(country) ? 'es' : 'en';
}

async function main() {
  loadEnv();

  const rows: WordRow[] = [];
  const seen = new Set<string>();

  console.log('Fetching artists from MusicBrainz…');

  for (const tag of TAGS) {
    if (rows.length >= TARGET) break;

    let offset = 0;
    let pagesForTag = 0;
    const maxPagesPerTag = 3;

    while (rows.length < TARGET && pagesForTag < maxPagesPerTag) {
      const data = await fetchPage(tag, offset);

      for (const artist of data.artists) {
        if (!artist.name || artist.name.length > 60) continue;
        const key = artist.name.toLowerCase();
        if (seen.has(key)) continue;
        seen.add(key);
        rows.push({
          category_id: CATEGORY.id,
          text: artist.name,
          language: detectLanguage(artist),
        });
      }

      console.log(`  [${tag}] offset=${offset}: ${data.artists.length} fetched, ${rows.length} total`);

      if (data.artists.length < LIMIT || offset + LIMIT >= data.count) break;
      offset += LIMIT;
      pagesForTag++;
      await sleep(1100);
    }

    await sleep(1100);
  }

  writeSQL(OUTPUT, rows);

  if (hasFlag('--execute')) {
    await ensureCategory(CATEGORY.id, CATEGORY.name, CATEGORY.emoji, CATEGORY.language);
    await executeRows(rows);
  }
}

main().catch((e) => { console.error(e); process.exit(1); });

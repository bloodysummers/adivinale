import { loadEnv, writeSQL, executeRows, ensureCategory, hasFlag, WordRow, sleep } from './_utils.js';

const OUTPUT = 'db/seed/words/personajes-famosos.sql';
const CATEGORY = { id: 'personajes-famosos', name: 'Personajes Famosos', emoji: '🌟', language: 'es+en' as const };
const TARGET = 1000;
const USER_AGENT = 'adivinale-game/1.0 (contact: dev)';
const SPARQL_URL = 'https://query.wikidata.org/sparql';

const OCCUPATIONS = [
  { id: 'Q33999', label: 'actor', limit: 200 },
  { id: 'Q2066131', label: 'athlete', limit: 200 },
  { id: 'Q639669', label: 'musician', limit: 200 },
  { id: 'Q82955', label: 'politician', limit: 150 },
  { id: 'Q901', label: 'scientist', limit: 100 },
  { id: 'Q36180', label: 'writer', limit: 150 },
  { id: 'Q483501', label: 'artist', limit: 100 },
];

interface SparqlBinding { value: string }
interface SparqlResult {
  results: {
    bindings: Array<{ esLabel?: SparqlBinding; enLabel?: SparqlBinding }>
  }
}

function buildQuery(occupationId: string, limit: number, offset: number): string {
  return `
SELECT ?esLabel ?enLabel WHERE {
  ?person wdt:P31 wd:Q5 .
  ?person wdt:P106 wd:${occupationId} .
  ?person wikibase:sitelinks ?sl .
  FILTER(?sl > 15)
  OPTIONAL { ?person rdfs:label ?esLabel . FILTER(LANG(?esLabel) = "es") }
  OPTIONAL { ?person rdfs:label ?enLabel . FILTER(LANG(?enLabel) = "en") }
  FILTER(BOUND(?esLabel) || BOUND(?enLabel))
}
ORDER BY DESC(?sl)
LIMIT ${limit}
OFFSET ${offset}
`.trim();
}

async function fetchSparql(query: string): Promise<SparqlResult> {
  const url = `${SPARQL_URL}?query=${encodeURIComponent(query)}&format=json`;
  const res = await fetch(url, {
    headers: { 'User-Agent': USER_AGENT, Accept: 'application/sparql-results+json' },
  });
  if (!res.ok) throw new Error(`Wikidata SPARQL error: ${res.status} ${await res.text()}`);
  return res.json() as Promise<SparqlResult>;
}

async function main() {
  loadEnv();

  const rows: WordRow[] = [];
  const seen = new Set<string>();

  console.log('Fetching famous people from Wikidata…');

  for (const occ of OCCUPATIONS) {
    if (rows.length >= TARGET) break;
    console.log(`  Querying occupation: ${occ.label}…`);

    try {
      const data = await fetchSparql(buildQuery(occ.id, occ.limit, 0));

      for (const binding of data.results.bindings) {
        const esName = binding.esLabel?.value;
        const enName = binding.enLabel?.value;
        const name = esName ?? enName;
        if (!name) continue;
        const key = name.toLowerCase();
        if (name.length > 60 || seen.has(key)) continue;
        seen.add(key);
        rows.push({ category_id: CATEGORY.id, text: name, language: esName ? 'es' : 'en' });
      }

      console.log(`    → ${data.results.bindings.length} results, ${rows.length} total`);
    } catch (e) {
      console.warn(`    ⚠ Failed for ${occ.label}: ${e}`);
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

import { loadEnv, writeSQL, executeRows, ensureCategory, hasFlag, WordRow, sleep } from './_utils.js';

const OUTPUT = 'db/seed/words/arte.sql';
const CATEGORY = { id: 'arte', name: 'Arte', emoji: '🎨', language: 'es+en' as const };
const USER_AGENT = 'adivinale-game/1.0 (contact: dev)';
const SPARQL_URL = 'https://query.wikidata.org/sparql';

interface SparqlResult {
  results: {
    bindings: Array<{
      esLabel?: { value: string };
      enLabel?: { value: string };
      label?: { value: string };
    }>
  }
}

async function fetchSparql(query: string): Promise<SparqlResult> {
  const url = `${SPARQL_URL}?query=${encodeURIComponent(query)}&format=json`;
  const res = await fetch(url, {
    headers: { 'User-Agent': USER_AGENT, Accept: 'application/sparql-results+json' },
  });
  if (!res.ok) throw new Error(`Wikidata SPARQL error: ${res.status} ${await res.text()}`);
  return res.json() as Promise<SparqlResult>;
}

const ARTIST_OCCUPATIONS = [
  { id: 'Q1028181', name: 'painter' },
  { id: 'Q1281618', name: 'sculptor' },
  { id: 'Q33231', name: 'photographer' },
  { id: 'Q17505902', name: 'muralist' },
];

function artistQuery(occupationId: string): string {
  return `
SELECT ?esLabel ?enLabel WHERE {
  ?person wdt:P31 wd:Q5 .
  ?person wdt:P106 wd:${occupationId} .
  ?person wikibase:sitelinks ?sl .
  FILTER(?sl > 10)
  OPTIONAL { ?person rdfs:label ?esLabel . FILTER(LANG(?esLabel) = "es") }
  OPTIONAL { ?person rdfs:label ?enLabel . FILTER(LANG(?enLabel) = "en") }
  FILTER(BOUND(?esLabel) || BOUND(?enLabel))
}
ORDER BY DESC(?sl)
LIMIT 150
`.trim();
}

const MOVEMENT_QUERY = `
SELECT ?label WHERE {
  { ?movement wdt:P31 wd:Q968159 . }
  UNION
  { ?movement wdt:P31 wd:Q1792644 . }
  ?movement rdfs:label ?label .
  FILTER(LANG(?label) = "es")
  FILTER(STRLEN(?label) <= 40)
}
LIMIT 100
`.trim();

const ARTWORK_QUERY = `
SELECT ?esLabel ?enLabel WHERE {
  { ?artwork wdt:P31 wd:Q3305213 . }
  UNION
  { ?artwork wdt:P31 wd:Q860861 . }
  ?artwork wikibase:sitelinks ?sl .
  FILTER(?sl > 25)
  OPTIONAL { ?artwork rdfs:label ?esLabel . FILTER(LANG(?esLabel) = "es") }
  OPTIONAL { ?artwork rdfs:label ?enLabel . FILTER(LANG(?enLabel) = "en") }
  FILTER(BOUND(?esLabel) || BOUND(?enLabel))
}
ORDER BY DESC(?sl)
LIMIT 200
`.trim();

async function main() {
  loadEnv();

  const rows: WordRow[] = [];
  const seen = new Set<string>();

  function addEntry(es: string | undefined, en: string | undefined) {
    const name = es ?? en;
    if (!name) return;
    const key = name.toLowerCase();
    if (name.length > 70 || seen.has(key)) return;
    seen.add(key);
    rows.push({ category_id: CATEGORY.id, text: name, language: es ? 'es' : 'en' });
  }

  console.log('Fetching artists from Wikidata…');
  for (const occ of ARTIST_OCCUPATIONS) {
    console.log(`  Querying occupation: ${occ.name}…`);
    try {
      const data = await fetchSparql(artistQuery(occ.id));
      for (const b of data.results.bindings) addEntry(b.esLabel?.value, b.enLabel?.value);
      console.log(`    → ${data.results.bindings.length} results, ${rows.length} total`);
    } catch (e) {
      console.warn(`    ⚠ Failed for ${occ.name}: ${e}`);
    }
    await sleep(1100);
  }

  console.log('Fetching art movements from Wikidata…');
  try {
    const data = await fetchSparql(MOVEMENT_QUERY);
    for (const b of data.results.bindings) addEntry(b.label?.value, undefined);
    console.log(`  → ${data.results.bindings.length} movements, ${rows.length} total`);
  } catch (e) {
    console.warn(`  ⚠ Failed for movements: ${e}`);
  }
  await sleep(1100);

  console.log('Fetching artworks from Wikidata…');
  try {
    const data = await fetchSparql(ARTWORK_QUERY);
    for (const b of data.results.bindings) addEntry(b.esLabel?.value, b.enLabel?.value);
    console.log(`  → ${data.results.bindings.length} artworks, ${rows.length} total`);
  } catch (e) {
    console.warn(`  ⚠ Failed for artworks: ${e}`);
  }

  writeSQL(OUTPUT, rows);

  if (hasFlag('--execute')) {
    await ensureCategory(CATEGORY.id, CATEGORY.name, CATEGORY.emoji, CATEGORY.language);
    await executeRows(rows);
  }
}

main().catch((e) => { console.error(e); process.exit(1); });

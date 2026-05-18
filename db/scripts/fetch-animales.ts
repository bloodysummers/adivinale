import { loadEnv, writeSQL, executeRows, ensureCategory, hasFlag, WordRow, sleep } from './_utils.js';

const OUTPUT = 'db/seed/words/animales.sql';
const CATEGORY = { id: 'animales', name: 'Animales', emoji: '🐾', language: 'es' as const };
const USER_AGENT = 'adivinale-game/1.0 (contact: dev)';
const SPARQL_URL = 'https://query.wikidata.org/sparql';

const GROUPS = [
  { id: 'Q7377', name: 'mammalia' },
  { id: 'Q5113', name: 'birds' },
  { id: 'Q10884', name: 'reptilia' },
  { id: 'Q152', name: 'fish' },
  { id: 'Q1390', name: 'insecta' },
  { id: 'Q10908', name: 'amphibia' },
];

interface SparqlResult {
  results: { bindings: Array<{ label: { value: string } }> }
}

function buildQuery(groupId: string): string {
  return `
SELECT DISTINCT ?label WHERE {
  ?item wdt:P171+ wd:${groupId} .
  ?item wdt:P31 wd:Q16521 .
  ?item rdfs:label ?label .
  FILTER(LANG(?label) = "es")
  FILTER(STRLEN(?label) <= 40)
  FILTER(!CONTAINS(?label, "("))
  FILTER(!CONTAINS(?label, "de "))
}
LIMIT 200
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

  console.log('Fetching animals from Wikidata…');

  for (const group of GROUPS) {
    console.log(`  Querying group: ${group.name}…`);
    try {
      const data = await fetchSparql(buildQuery(group.id));

      for (const binding of data.results.bindings) {
        const label = binding.label.value.trim();
        const key = label.toLowerCase();
        if (seen.has(key)) continue;
        seen.add(key);
        rows.push({ category_id: CATEGORY.id, text: label, language: 'es' });
      }

      console.log(`    → ${data.results.bindings.length} results, ${rows.length} total`);
    } catch (e) {
      console.warn(`    ⚠ Failed for ${group.name}: ${e}`);
    }

    await sleep(2000);
  }

  writeSQL(OUTPUT, rows);

  if (hasFlag('--execute')) {
    await ensureCategory(CATEGORY.id, CATEGORY.name, CATEGORY.emoji, CATEGORY.language);
    await executeRows(rows);
  }
}

main().catch((e) => { console.error(e); process.exit(1); });

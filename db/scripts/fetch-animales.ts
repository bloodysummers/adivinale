import { loadEnv, writeSQL, executeRows, ensureCategory, hasFlag, WordRow } from './_utils.js';
import { neon } from '@neondatabase/serverless';

const OUTPUT = 'db/seed/words/animales.sql';
const CATEGORY = { id: 'animales', name: 'Animales', emoji: '🐾', language: 'es' as const };

const ANIMALES: string[] = [
  // Mamíferos domésticos / de granja
  'Perro', 'Gato', 'Caballo', 'Vaca', 'Cerdo', 'Oveja', 'Cabra', 'Burro',
  'Conejo', 'Ratón', 'Rata', 'Hamster', 'Cobaya', 'Toro',

  // Mamíferos africanos
  'León', 'Jirafa', 'Elefante africano', 'Rinoceronte', 'Hipopótamo',
  'Cebra', 'Gorila', 'Chimpancé', 'Guepardo', 'Leopardo', 'Hiena',
  'Ñu', 'Mandril', 'Babuino', 'Búfalo africano', 'Okapi', 'Pangolín',

  // Mamíferos americanos
  'Jaguar', 'Puma', 'Ocelote', 'Capibara', 'Armadillo', 'Tapir',
  'Llama', 'Alpaca', 'Guanaco', 'Vicuña', 'Mapache', 'Coyote',
  'Lince', 'Lobo', 'Oso negro', 'Oso grizzly',

  // Mamíferos europeos / asiáticos
  'Zorro', 'Tejón', 'Erizo', 'Castor', 'Ardilla', 'Nutria',
  'Jabalí', 'Ciervo', 'Corzo', 'Topo', 'Comadreja', 'Turón',

  // Mamíferos polares
  'Oso polar', 'Reno', 'Alce', 'Morsa', 'Buey almizclero',

  // Mamíferos marinos
  'Delfín', 'Ballena jorobada', 'Orca', 'Tiburón ballena', 'Manatí',
  'León marino', 'Foca', 'Narval', 'Dugongo',

  // Primates
  'Orangután', 'Gibón', 'Lémur', 'Mono araña', 'Macaco',
  'Mono capuchino', 'Tití', 'Mandril',

  // Marsupiales y monotremas
  'Koala', 'Canguro', 'Wombat', 'Ornitorrinco', 'Equidna', 'Zarigüeya',

  // Otros mamíferos
  'Mofeta', 'Puercoespín', 'Musaraña', 'Tarsero', 'Aye-aye',

  // Aves
  'Águila real', 'Cóndor', 'Halcón peregrino', 'Buitre', 'Búho real',
  'Lechuza', 'Loro', 'Guacamayo', 'Tucán', 'Flamenco', 'Pingüino',
  'Avestruz', 'Colibrí', 'Pájaro carpintero', 'Gorrión', 'Paloma',
  'Cuervo', 'Urraca', 'Pavo real', 'Faisán', 'Gallina', 'Pato',
  'Ganso', 'Cisne', 'Garza', 'Cigüeña', 'Pelícano', 'Golondrina',
  'Quetzal', 'Emú', 'Kiwi', 'Albatros', 'Flamenco rosa',
  'Martín pescador', 'Canario', 'Cotorra', 'Cacatúa', 'Hornero',

  // Reptiles
  'Cocodrilo', 'Caimán', 'Iguana', 'Camaleón', 'Tortuga marina',
  'Tortuga de tierra', 'Gecko', 'Boa constrictor', 'Anaconda',
  'Cobra real', 'Víbora', 'Serpiente de cascabel', 'Dragón de Komodo',
  'Lagarto', 'Varano',

  // Peces
  'Tiburón blanco', 'Tiburón martillo', 'Salmón', 'Atún', 'Sardina',
  'Trucha', 'Pez payaso', 'Pez espada', 'Pez globo', 'Manta raya',
  'Raya', 'Anguila', 'Piraña', 'Caballito de mar', 'Pez luna',
  'Barracuda', 'Pez volador', 'Lamprea', 'Pez linterna', 'Pez cofre',

  // Insectos y artrópodos
  'Abeja', 'Avispa', 'Hormiga', 'Mariposa', 'Libélula', 'Escarabajo',
  'Cucaracha', 'Grillo', 'Saltamontes', 'Mosquito', 'Mosca',
  'Mariquita', 'Luciérnaga', 'Mantis religiosa', 'Araña',
  'Escorpión', 'Tarántula', 'Ciempiés', 'Polilla', 'Termita',

  // Crustáceos y moluscos
  'Pulpo', 'Calamar', 'Medusa', 'Cangrejo', 'Langosta',
  'Camarón', 'Gamba', 'Caracol', 'Almeja', 'Ostra', 'Estrella de mar',

  // Anfibios
  'Rana', 'Sapo', 'Salamandra', 'Tritón', 'Axolote',
];

async function clearCategory(dbUrl: string): Promise<void> {
  const sql = neon(dbUrl);
  await sql`DELETE FROM words WHERE category_id = 'animales'`;
  console.log("✓ Cleared existing 'animales' words");
}

async function main() {
  loadEnv();

  const seen = new Set<string>();
  const rows: WordRow[] = [];

  for (const name of ANIMALES) {
    const key = name.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    rows.push({ category_id: CATEGORY.id, text: name, language: 'es' });
  }

  writeSQL(OUTPUT, rows);
  console.log(`Total: ${rows.length} animales`);

  if (hasFlag('--execute')) {
    const dbUrl = process.env.NEON_DATABASE_URL!;
    if (!dbUrl) throw new Error('NEON_DATABASE_URL no está configurada en .env.local');
    await clearCategory(dbUrl);
    await ensureCategory(CATEGORY.id, CATEGORY.name, CATEGORY.emoji, CATEGORY.language);
    await executeRows(rows);
  }
}

main().catch((e) => { console.error(e); process.exit(1); });

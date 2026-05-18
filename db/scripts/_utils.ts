import fs from 'fs';
import path from 'path';
import { neon } from '@neondatabase/serverless';

export interface WordRow {
  category_id: string;
  text: string;
  language: 'es' | 'en';
  subtext?: string;
}

export function loadEnv(): void {
  try {
    const envPath = path.resolve(process.cwd(), '.env.local');
    const content = fs.readFileSync(envPath, 'utf8');
    for (const line of content.split('\n')) {
      const eq = line.indexOf('=');
      if (eq === -1) continue;
      const key = line.slice(0, eq).trim();
      const val = line.slice(eq + 1).trim();
      if (key && !process.env[key]) process.env[key] = val;
    }
  } catch {
    // .env.local not required if vars already in environment
  }
}

export function escapeSql(str: string): string {
  return str.replace(/'/g, "''");
}

export function writeSQL(outputPath: string, rows: WordRow[]): void {
  if (rows.length === 0) { console.warn('⚠ No rows to write'); return; }
  const values = rows
    .map((r) => {
      const sub = r.subtext ? `'${escapeSql(r.subtext)}'` : 'NULL';
      return `  ('${escapeSql(r.category_id)}', '${escapeSql(r.text)}', '${r.language}', ${sub})`;
    })
    .join(',\n');
  const sqlText = `INSERT INTO words (category_id, text, language, subtext) VALUES\n${values}\nON CONFLICT DO NOTHING;\n`;
  const abs = path.resolve(process.cwd(), outputPath);
  fs.mkdirSync(path.dirname(abs), { recursive: true });
  fs.writeFileSync(abs, sqlText, 'utf8');
  console.log(`✓ Wrote ${rows.length} rows → ${outputPath}`);
}

export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function executeRows(rows: WordRow[]): Promise<void> {
  const url = process.env.NEON_DATABASE_URL;
  if (!url) throw new Error('NEON_DATABASE_URL no está configurada en .env.local');
  if (rows.length === 0) return;

  const sql = neon(url);
  const categoryIds = rows.map((r) => r.category_id);
  const texts = rows.map((r) => r.text);
  const languages = rows.map((r) => r.language);
  const subtexts = rows.map((r) => r.subtext ?? null);

  await sql`
    INSERT INTO words (category_id, text, language, subtext)
    SELECT
      unnest(${categoryIds}::text[]),
      unnest(${texts}::text[]),
      unnest(${languages}::text[]),
      unnest(${subtexts}::text[])
    ON CONFLICT DO NOTHING
  `;
  console.log(`✓ Inserted ${rows.length} rows in Neon`);
}

export async function ensureCategory(
  id: string,
  name: string,
  emoji: string,
  language: 'es' | 'en' | 'es+en'
): Promise<void> {
  const url = process.env.NEON_DATABASE_URL;
  if (!url) throw new Error('NEON_DATABASE_URL no está configurada en .env.local');
  const sql = neon(url);
  await sql`
    INSERT INTO categories (id, name, emoji, language)
    VALUES (${id}, ${name}, ${emoji}, ${language})
    ON CONFLICT (id) DO NOTHING
  `;
  console.log(`✓ Category '${id}' ready`);
}

export function hasFlag(flag: string): boolean {
  return process.argv.includes(flag);
}

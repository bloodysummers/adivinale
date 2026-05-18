import type { VercelRequest, VercelResponse } from '@vercel/node';
import { sql } from '../../_db';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Cache-Control', 'no-store');

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { id } = req.query;

  if (!id || typeof id !== 'string' || id.trim() === '') {
    return res.status(400).json({ error: 'Invalid category id' });
  }

  try {
    const cats = await sql`SELECT id FROM categories WHERE id = ${id}`;
    if (cats.length === 0) {
      return res.status(404).json({ error: 'Category not found' });
    }

    const rows = await sql`
      SELECT id::text AS id, category_id AS "categoryId", text, language, subtext
      FROM words
      WHERE category_id = ${id}
      ORDER BY RANDOM()
      LIMIT 50
    `;

    return res.status(200).json({ words: rows });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

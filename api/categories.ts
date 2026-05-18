import type { VercelRequest, VercelResponse } from '@vercel/node';
import { sql } from './_db';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const rows = await sql`SELECT id, name, emoji, language FROM categories ORDER BY name`;
    return res.status(200).json({ categories: rows });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

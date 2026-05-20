import type { VercelRequest, VercelResponse } from '@vercel/node';
import { sql } from './_db';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(204).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { categoryId, text } = req.body ?? {};

  if (typeof categoryId !== 'string' || !categoryId.trim()) {
    return res.status(400).json({ error: 'categoryId is required' });
  }
  if (typeof text !== 'string' || !text.trim()) {
    return res.status(400).json({ error: 'text is required' });
  }

  const normalizedText = text.trim();

  try {
    // Check production words table
    const existing = await sql`
      SELECT 1 FROM words
      WHERE category_id = ${categoryId}
        AND lower(text) = lower(${normalizedText})
      LIMIT 1
    `;

    if (existing.length > 0) {
      return res.status(200).json({ status: 'duplicate' });
    }

    // Check staging suggestions table
    const stagingDupe = await sql`
      SELECT 1 FROM word_suggestions
      WHERE category_id = ${categoryId}
        AND lower(text) = lower(${normalizedText})
      LIMIT 1
    `;

    if (stagingDupe.length > 0) {
      return res.status(200).json({ status: 'duplicate' });
    }

    await sql`
      INSERT INTO word_suggestions (category_id, text)
      VALUES (${categoryId}, ${normalizedText})
    `;

    return res.status(200).json({ status: 'created' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

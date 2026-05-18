import { wordsByCategory } from '../words';

describe('wordsByCategory data', () => {
  it('has exactly 20 words for peliculas', () => {
    expect(wordsByCategory['peliculas']).toHaveLength(20);
  });

  it('has exactly 20 words for series', () => {
    expect(wordsByCategory['series']).toHaveLength(20);
  });

  it('all peliculas words have categoryId = peliculas', () => {
    wordsByCategory['peliculas'].forEach((w) => {
      expect(w.categoryId).toBe('peliculas');
    });
  });

  it('all series words have categoryId = series', () => {
    wordsByCategory['series'].forEach((w) => {
      expect(w.categoryId).toBe('series');
    });
  });

  it('all words have unique ids across all categories', () => {
    const allWords = Object.values(wordsByCategory).flat();
    const ids = allWords.map((w) => w.id);
    const uniqueIds = new Set(ids);
    expect(uniqueIds.size).toBe(ids.length);
  });

  it('all words have a non-empty text field', () => {
    Object.values(wordsByCategory)
      .flat()
      .forEach((w) => {
        expect(typeof w.text).toBe('string');
        expect(w.text.length).toBeGreaterThan(0);
      });
  });
});

import { categories } from '../categories';

describe('categories data', () => {
  it('exports exactly 2 categories', () => {
    expect(categories).toHaveLength(2);
  });

  it('includes peliculas and series', () => {
    const ids = categories.map((c) => c.id);
    expect(ids).toContain('peliculas');
    expect(ids).toContain('series');
  });

  it.each(categories)('category "$id" has all required fields', (category) => {
    expect(typeof category.id).toBe('string');
    expect(category.id.length).toBeGreaterThan(0);
    expect(typeof category.name).toBe('string');
    expect(category.name.length).toBeGreaterThan(0);
    expect(typeof category.emoji).toBe('string');
    expect(category.emoji.length).toBeGreaterThan(0);
    expect(['es', 'en', 'es+en']).toContain(category.language);
  });
});

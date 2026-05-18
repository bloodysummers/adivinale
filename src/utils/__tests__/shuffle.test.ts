import { shuffle } from '../shuffle';

describe('shuffle', () => {
  it('does not mutate the original array', () => {
    const original = [1, 2, 3, 4, 5];
    const copy = [...original];
    shuffle(original);
    expect(original).toEqual(copy);
  });

  it('returns an array with the same elements', () => {
    const input = [1, 2, 3, 4, 5];
    const result = shuffle(input);
    expect(result).toHaveLength(input.length);
    expect(result.sort()).toEqual([...input].sort());
  });

  it('returns empty array for empty input', () => {
    expect(shuffle([])).toEqual([]);
  });

  it('produces a different order at least once out of 10 runs', () => {
    const input = [1, 2, 3, 4, 5, 6];
    const original = JSON.stringify(input);
    const allSame = Array.from({ length: 10 }, () =>
      JSON.stringify(shuffle(input))
    ).every((r) => r === original);
    expect(allSame).toBe(false);
  });
});

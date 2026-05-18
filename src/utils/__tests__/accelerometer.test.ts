import {
  CORRECT_THRESHOLD,
  SKIP_THRESHOLD,
  HOLD_DURATION_MS,
  DEBOUNCE_MS,
} from '../accelerometer';

describe('accelerometer constants', () => {
  it('CORRECT_THRESHOLD is 0.7', () => {
    expect(CORRECT_THRESHOLD).toBe(0.7);
  });

  it('SKIP_THRESHOLD is -0.7', () => {
    expect(SKIP_THRESHOLD).toBe(-0.7);
  });

  it('HOLD_DURATION_MS is 150', () => {
    expect(HOLD_DURATION_MS).toBe(150);
  });

  it('DEBOUNCE_MS is 600', () => {
    expect(DEBOUNCE_MS).toBe(600);
  });
});

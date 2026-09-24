import { describe, expect, it, vi } from 'vitest';

import { clamp, randomInt } from './math';

describe('clamp', () => {
  it('clamps a value within the given range', () => {
    expect(clamp(5, 0, 10)).toBe(5);
    expect(clamp(-1, 0, 10)).toBe(0);
    expect(clamp(11, 0, 10)).toBe(10);
  });
});

describe('randomInt', () => {
  it('returns an integer within the given range', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.5);
    expect(randomInt(2, 10)).toBe(6);
    vi.restoreAllMocks();
  });
});

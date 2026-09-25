import { describe, expect, it } from 'vitest';
import { Rune, runes, interpolateAdvice, pickRandomRunes, isReversible, rollOrientation } from './runes';

describe('pickRandomRunes', () => {
  it('trả về đúng số lượng rune và không trùng lặp', () => {
    const picked = pickRandomRunes(5);
    expect(picked).toHaveLength(5);
    const uniqueIds = new Set(picked.map((rune) => rune.id));
    expect(uniqueIds.size).toBe(5);
  });

  it('có thể rút toàn bộ số rune trong bộ bài mà không trùng lặp', () => {
    const picked = pickRandomRunes(runes.length);
    expect(picked).toHaveLength(runes.length);
    const uniqueIds = new Set(picked.map((rune) => rune.id));
    expect(uniqueIds.size).toBe(runes.length);
  });

  it('báo lỗi nếu yêu cầu nhiều hơn số rune có trong bộ bài', () => {
    expect(() => pickRandomRunes(runes.length + 1)).toThrow();
  });
});

describe('interpolateAdvice', () => {
  it('thay thế {subject} bằng chủ đề câu hỏi', () => {
    const fehu = runes.find((rune) => rune.id === 'fehu')!;
    const result = interpolateAdvice(fehu, 'công việc mới');
    expect(result).toContain('công việc mới');
    expect(result).not.toContain('{subject}');
  });

  it('thay thế {name} bằng tên rune', () => {
    const uruz = runes.find((rune) => rune.id === 'uruz')!;
    const result = interpolateAdvice(uruz, 'tình huống của bạn');
    expect(result).toContain('Uruz');
    expect(result).not.toContain('{name}');
  });
});

const reversibleFixture: Rune = {
  id: 'test-reversible',
  symbol: 'X',
  name: 'Test',
  meaning: 'Test meaning',
  description: 'Test description',
  interpretation: 'Test interpretation',
  advice: 'test advice',
  reversedMeaning: 'Test reversed meaning'
};

const symmetricFixture: Rune = {
  id: 'test-symmetric',
  symbol: 'Y',
  name: 'Test Symmetric',
  meaning: 'Test meaning',
  description: 'Test description',
  interpretation: 'Test interpretation',
  advice: 'test advice'
};

describe('isReversible', () => {
  it('trả về true khi rune có reversedMeaning', () => {
    expect(isReversible(reversibleFixture)).toBe(true);
  });

  it('trả về false khi rune không có reversedMeaning', () => {
    expect(isReversible(symmetricFixture)).toBe(false);
  });
});

describe('rollOrientation', () => {
  it('rune đối xứng luôn trả về false dù Math.random trả gì', () => {
    const originalRandom = Math.random;
    Math.random = () => 0;
    expect(rollOrientation(symmetricFixture)).toBe(false);
    Math.random = originalRandom;
  });

  it('rune có thể ngược trả về true khi Math.random < 0.5', () => {
    const originalRandom = Math.random;
    Math.random = () => 0;
    expect(rollOrientation(reversibleFixture)).toBe(true);
    Math.random = originalRandom;
  });

  it('rune có thể ngược trả về false khi Math.random >= 0.5', () => {
    const originalRandom = Math.random;
    Math.random = () => 0.9;
    expect(rollOrientation(reversibleFixture)).toBe(false);
    Math.random = originalRandom;
  });
});

describe('interpolateAdvice với isReversed', () => {
  const reversibleFixtureWithAdvice: Rune = {
    id: 'test-reversible-advice',
    symbol: 'X',
    name: 'Test',
    meaning: 'Test meaning',
    description: 'Test description',
    interpretation: 'Test interpretation',
    advice: 'lời khuyên xuôi cho {subject}',
    reversedMeaning: 'Test reversed meaning',
    reversedAdvice: 'lời khuyên ngược cho {subject} liên quan {name}'
  };

  const symmetricFixtureWithAdvice: Rune = {
    id: 'test-symmetric-advice',
    symbol: 'Y',
    name: 'Symmetric',
    meaning: 'Test meaning',
    description: 'Test description',
    interpretation: 'Test interpretation',
    advice: 'lời khuyên xuôi cho {subject}'
  };

  it('dùng reversedAdvice khi isReversed=true và rune có reversedAdvice', () => {
    const result = interpolateAdvice(reversibleFixtureWithAdvice, 'công việc', true);
    expect(result).toBe('lời khuyên ngược cho công việc liên quan Test');
  });

  it('dùng advice xuôi khi isReversed=false', () => {
    const result = interpolateAdvice(reversibleFixtureWithAdvice, 'công việc', false);
    expect(result).toBe('lời khuyên xuôi cho công việc');
  });

  it('fallback về advice xuôi khi isReversed=true nhưng rune không có reversedAdvice', () => {
    const result = interpolateAdvice(symmetricFixtureWithAdvice, 'công việc', true);
    expect(result).toBe('lời khuyên xuôi cho công việc');
  });
});

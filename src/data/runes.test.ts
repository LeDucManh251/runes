import { describe, expect, it } from 'vitest';
import { runes, interpolateAdvice, pickRandomRunes } from './runes';

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

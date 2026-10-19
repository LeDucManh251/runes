import { describe, expect, it } from 'vitest';
import { SPREADS, getSpread } from './spreads';

describe('SPREADS', () => {
  it('có 4 kiểu theo thứ tự 1 / 2 / 3 / 5 lá', () => {
    expect(SPREADS.map((spread) => spread.count)).toEqual([1, 2, 3, 5]);
  });

  it('mỗi kiểu có đúng số tên vị trí bằng số lá', () => {
    SPREADS.forEach((spread) => expect(spread.positions).toHaveLength(spread.count));
  });

  it('getSpread trả đúng kiểu theo id', () => {
    expect(getSpread('three').positions[1]).toBe('Tình huống hiện tại');
  });
});

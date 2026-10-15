import { describe, expect, it } from 'vitest';
import { getRuneById } from './runes';
import { TranslitToken, WritingMode, toRuneString, transliterate } from './transliterate';

const write = (text: string, mode: WritingMode) => toRuneString(transliterate(text, mode));

describe('transliterate — theo chữ cái', () => {
  it.each([
    ['Minh Anh', 'ᛗᛁᚾᚺ ᛫ ᚨᚾᚺ'],
    ['Anna', 'ᚨᚾᚾᚨ'],
    ['Max', 'ᛗᚨᚲᛋ'],
    ['José', 'ᛃᛟᛋᛖ'],
    ['Đức', 'ᛞᚢᚲ'],
    ['Zoe', 'ᛉᛟᛖ']
  ])('%s → %s', (input, expected) => {
    expect(write(input, 'letters')).toBe(expected);
  });
});

describe('transliterate — tách từ và ký tự lạ', () => {
  it('chuỗi rỗng hoặc toàn khoảng trắng trả mảng rỗng', () => {
    expect(transliterate('', 'letters')).toEqual([]);
    expect(transliterate('   ', 'letters')).toEqual([]);
  });

  it('khoảng trắng thừa chỉ sinh một separator giữa hai từ', () => {
    const tokens = transliterate('  Minh   Anh ', 'letters');
    expect(tokens.filter((token) => token.kind === 'separator')).toHaveLength(1);
  });

  it('dấu gạch ngang cũng tách từ', () => {
    expect(write('Anne-Marie', 'letters')).toBe('ᚨᚾᚾᛖ ᛫ ᛗᚨᚱᛁᛖ');
  });

  it('số và ký hiệu thành token skipped, phần còn lại vẫn đúng', () => {
    const tokens = transliterate('Minh 2!', 'letters');
    const skipped = tokens.filter((token): token is Extract<TranslitToken, { kind: 'skipped' }> => token.kind === 'skipped');
    expect(skipped.map((token) => token.source)).toEqual(['2', '!']);
    expect(toRuneString(tokens)).toBe('ᛗᛁᚾᚺ');
  });

  it('chữ x sinh 2 rune cùng source "x"', () => {
    expect(transliterate('x', 'letters')).toEqual([
      { kind: 'rune', runeId: 'kenaz', source: 'x' },
      { kind: 'rune', runeId: 'sowilo', source: 'x' }
    ]);
  });
});

describe('transliterate — toàn vẹn dữ liệu', () => {
  it('mọi runeId sinh ra đều tồn tại trong runes', () => {
    const inputs = [
      'abcdefghijklmnopqrstuvwxyz',
      'ngh ng anh nh bach ch tr th ph kh gh gia gi qu d đ x ă â ê ô ơ ư y',
      'th ng ph sh ch ck qu wh ee oo ce c j v x ya y'
    ];
    const modes: WritingMode[] = ['letters', 'vi', 'en'];
    modes.forEach((mode) => {
      inputs.forEach((input) => {
        transliterate(input, mode).forEach((token) => {
          if (token.kind === 'rune') expect(getRuneById(token.runeId), `${mode}: ${token.runeId}`).toBeDefined();
        });
      });
    });
  });
});

describe('transliterate — tiếng Việt theo âm', () => {
  it.each([
    ['Nguyễn', 'ᛜᚢᛁᛖᚾ'],
    ['Minh', 'ᛗᛁᛜ'],
    ['Anh', 'ᚨᛁᛜ'],
    ['Thảo', 'ᛏᚺᚨᛟ'],
    ['Giang', 'ᛃᚨᛜ'],
    ['Quỳnh', 'ᚲᚹᛁᛜ'],
    ['Đức', 'ᛞᚢᚲ'],
    ['Chi', 'ᛏᛃᛁ'],
    ['Nhung', 'ᚾᛃᚢᛜ'],
    ['Dũng', 'ᛉᚢᛜ'],
    ['Xuân', 'ᛋᚢᚨᚾ'],
    ['Bích', 'ᛒᛁᚲ'],
    ['gìn', 'ᛃᛁᚾ'],
    ['Nguyễn Minh Anh', 'ᛜᚢᛁᛖᚾ ᛫ ᛗᛁᛜ ᛫ ᚨᛁᛜ']
  ])('%s → %s', (input, expected) => {
    expect(write(input, 'vi')).toBe(expected);
  });

  it('source giữ nguyên cụm chữ gốc', () => {
    expect(transliterate('Nghĩa', 'vi')[0]).toEqual({ kind: 'rune', runeId: 'ingwaz', source: 'ngh' });
  });
});

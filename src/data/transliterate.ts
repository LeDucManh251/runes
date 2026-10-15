import { getRuneById } from './runes';

/** Cách viết: theo âm tiếng Việt, theo âm tiếng Anh, hoặc đổi từng chữ cái. */
export type WritingMode = 'vi' | 'en' | 'letters';

export type TranslitToken =
  | { kind: 'rune'; runeId: string; source: string }
  | { kind: 'separator' }
  | { kind: 'skipped'; source: string };

/** Dấu ngắt từ trong văn khắc rune. */
export const RUNE_SEPARATOR = '᛫';

interface Rule {
  /** Cụm chữ (đã chuẩn hóa) cần khớp, vd "ngh". */
  match: string;
  runeIds: string[];
  /** Cụm phải nằm ở đầu từ. */
  atStart?: boolean;
  /** Cụm phải nằm ở cuối từ. */
  atEnd?: boolean;
  /** Chữ ngay sau cụm phải thuộc tập này. */
  followedBy?: string;
}

const LETTER_MAP: Record<string, string[]> = {
  a: ['ansuz'], b: ['berkano'], c: ['kenaz'], d: ['dagaz'], e: ['ehwaz'], f: ['fehu'],
  g: ['gebo'], h: ['hagalaz'], i: ['isa'], j: ['jera'], k: ['kenaz'], l: ['laguz'],
  m: ['mannaz'], n: ['naudhiz'], o: ['othala'], p: ['perthro'], q: ['kenaz'], r: ['raidho'],
  s: ['sowilo'], t: ['tiwaz'], u: ['uruz'], v: ['wunjo'], w: ['wunjo'], x: ['kenaz', 'sowilo'],
  y: ['jera'], z: ['algiz']
};

const LETTER_RULES: Rule[] = Object.entries(LETTER_MAP).map(([match, runeIds]) => ({ match, runeIds }));

/** Cụm dài thử trước; cùng độ dài thì giữ thứ tự khai báo (sort ổn định). */
const byLengthDesc = (rules: Rule[]): Rule[] =>
  [...rules].sort((a, b) => Array.from(b.match).length - Array.from(a.match).length);

const VI_VOWELS = 'aăâeêioôơuưy';

const VI_RULES: Rule[] = [
  { match: 'ngh', runeIds: ['ingwaz'] },
  { match: 'ng', runeIds: ['ingwaz'] },
  { match: 'nh', runeIds: ['isa', 'ingwaz'], atEnd: true },
  { match: 'nh', runeIds: ['naudhiz', 'jera'] },
  { match: 'ch', runeIds: ['isa', 'kenaz'], atEnd: true },
  { match: 'ch', runeIds: ['tiwaz', 'jera'] },
  { match: 'tr', runeIds: ['tiwaz', 'raidho'] },
  { match: 'th', runeIds: ['tiwaz', 'hagalaz'] },
  { match: 'ph', runeIds: ['fehu'] },
  { match: 'kh', runeIds: ['kenaz', 'hagalaz'] },
  { match: 'gh', runeIds: ['gebo'] },
  { match: 'gi', runeIds: ['jera'], followedBy: VI_VOWELS },
  { match: 'gi', runeIds: ['jera', 'isa'] },
  { match: 'qu', runeIds: ['kenaz', 'wunjo'] },
  { match: 'd', runeIds: ['algiz'] },
  { match: 'đ', runeIds: ['dagaz'] },
  { match: 'x', runeIds: ['sowilo'] },
  { match: 'ă', runeIds: ['ansuz'] },
  { match: 'â', runeIds: ['ansuz'] },
  { match: 'ê', runeIds: ['ehwaz'] },
  { match: 'ô', runeIds: ['othala'] },
  { match: 'ơ', runeIds: ['othala'] },
  { match: 'ư', runeIds: ['uruz'] },
  { match: 'y', runeIds: ['isa'] }
];

const EN_VOWELS = 'aeiou';

const EN_RULES: Rule[] = [
  { match: 'th', runeIds: ['thurisaz'] },
  { match: 'ng', runeIds: ['ingwaz'] },
  { match: 'ph', runeIds: ['fehu'] },
  { match: 'sh', runeIds: ['sowilo'] },
  { match: 'ch', runeIds: ['kenaz'] },
  { match: 'ck', runeIds: ['kenaz'] },
  { match: 'qu', runeIds: ['kenaz', 'wunjo'] },
  { match: 'wh', runeIds: ['wunjo'] },
  { match: 'ee', runeIds: ['isa'] },
  { match: 'oo', runeIds: ['uruz'] },
  { match: 'c', runeIds: ['sowilo'], followedBy: 'eiy' },
  { match: 'c', runeIds: ['kenaz'] },
  { match: 'j', runeIds: ['jera'] },
  { match: 'v', runeIds: ['fehu'] },
  { match: 'x', runeIds: ['kenaz', 'sowilo'] },
  { match: 'y', runeIds: ['jera'], atStart: true, followedBy: EN_VOWELS },
  { match: 'y', runeIds: ['isa'] }
];

const RULES_BY_MODE: Record<WritingMode, Rule[]> = {
  vi: byLengthDesc([...VI_RULES, ...LETTER_RULES]),
  en: byLengthDesc([...EN_RULES, ...LETTER_RULES]),
  letters: LETTER_RULES
};

const TONE_MARKS = /[̣̀́̃̉]/g;
const ALL_MARKS = /[̀-ͯ]/g;

/** Chữ thường; `vi` chỉ bỏ dấu thanh (giữ ă â ê ô ơ ư đ), chế độ khác bỏ mọi dấu phụ. */
function normalize(text: string, mode: WritingMode): string {
  const lower = text.toLowerCase();
  if (mode === 'vi') {
    return lower.normalize('NFD').replace(TONE_MARKS, '').normalize('NFC');
  }
  return lower.replace(/đ/g, 'd').normalize('NFD').replace(ALL_MARKS, '').normalize('NFC');
}

function matchesAt(rule: Rule, chars: string[], index: number): boolean {
  const length = Array.from(rule.match).length;
  const end = index + length;
  if (chars.slice(index, end).join('') !== rule.match) return false;
  if (rule.atStart && index !== 0) return false;
  if (rule.atEnd && end !== chars.length) return false;
  if (rule.followedBy !== undefined && (end >= chars.length || !rule.followedBy.includes(chars[end]))) return false;
  return true;
}

/** Gộp rune trùng liền kề (lối khắc cổ không viết đôi), nối source lại. */
function mergeRepeats(tokens: TranslitToken[]): TranslitToken[] {
  const merged: TranslitToken[] = [];
  tokens.forEach((token) => {
    const last = merged[merged.length - 1];
    if (token.kind === 'rune' && last?.kind === 'rune' && last.runeId === token.runeId) {
      merged[merged.length - 1] = { ...last, source: last.source + token.source };
    } else {
      merged.push(token);
    }
  });
  return merged;
}

function transliterateWord(word: string, mode: WritingMode): TranslitToken[] {
  const chars = Array.from(word);
  const rules = RULES_BY_MODE[mode];
  const tokens: TranslitToken[] = [];
  let index = 0;
  while (index < chars.length) {
    const rule = rules.find((candidate) => matchesAt(candidate, chars, index));
    if (rule) {
      const length = Array.from(rule.match).length;
      const source = chars.slice(index, index + length).join('');
      rule.runeIds.forEach((runeId) => tokens.push({ kind: 'rune', runeId, source }));
      index += length;
    } else {
      tokens.push({ kind: 'skipped', source: chars[index] });
      index += 1;
    }
  }
  return mode === 'letters' ? tokens : mergeRepeats(tokens);
}

/**
 * Phiên `text` sang chuỗi token rune theo `mode`. Đây là phiên âm gần đúng: rune Elder
 * Futhark ghi âm tiếng Germanic cổ, không có ký tự cho mọi âm hiện đại.
 */
export function transliterate(text: string, mode: WritingMode): TranslitToken[] {
  const words = normalize(text, mode).split(/[\s-]+/).filter(Boolean);
  const tokens: TranslitToken[] = [];
  words.forEach((word, index) => {
    if (index > 0) tokens.push({ kind: 'separator' });
    tokens.push(...transliterateWord(word, mode));
  });
  return tokens;
}

/** Ghép token thành chuỗi ký hiệu rune, các từ nối bằng " ᛫ ", bỏ ký tự skipped và từ rỗng. */
export function toRuneString(tokens: TranslitToken[]): string {
  const words: string[] = [''];
  tokens.forEach((token) => {
    if (token.kind === 'separator') {
      words.push('');
    } else if (token.kind === 'rune') {
      words[words.length - 1] += getRuneById(token.runeId)?.symbol ?? '';
    }
  });
  return words.filter(Boolean).join(` ${RUNE_SEPARATOR} `);
}

# Viết tên bằng Rune

**Sub-skill bắt buộc để thực thi**: Subagent-Driven Development (khuyến nghị) hoặc Inline
Execution — người dùng chọn sau khi plan này được duyệt.

**Spec gốc**: `docs/superpowers/specs/2026-10-15-rune-name-writer-design.md`

## Goal

Thêm tab "Viết tên": người dùng gõ tên, chọn cách viết (Tiếng Việt theo âm / English theo âm /
Theo chữ cái), thấy tên được viết bằng rune Elder Futhark, bấm từng rune để xem tên và ý nghĩa,
sao chép chuỗi rune. Nạp font Noto Sans Runic để rune hiển thị đồng nhất trên mọi máy.

## Architecture

```
src/
  data/
    runes.ts                  (SỬA) — thêm getRuneById
    runes.test.ts             (SỬA) — test getRuneById
    transliterate.ts          (TẠO) — hàm thuần transliterate + toRuneString, bảng quy tắc 3 chế độ
    transliterate.test.ts     (TẠO) — test toàn bộ ví dụ trong spec
  components/
    Nav.tsx                   (SỬA) — thêm mục "Viết tên"
    tabs/
      NameWriterTab.tsx       (TẠO) — giao diện tab
      NameWriterTab.test.tsx  (TẠO) — test hành vi tab
  types.ts                    (SỬA) — TabId thêm 'namewriter'
  App.tsx                     (SỬA) — render NameWriterTab
  App.test.tsx                (SỬA) — kiểm tra nav có "Viết tên"
  index.css                   (SỬA) — font Noto Sans Runic + class .name-writer-*
```

`transliterate.ts` không biết gì về React; tab chỉ gọi `transliterate` và `toRuneString`.
Quy tắc trỏ tới `runeId`, ký hiệu luôn lấy từ `runes.ts` qua `getRuneById`.

## Tech Stack

React 18 + TypeScript, Vitest + React Testing Library (`fireEvent`, không có `user-event`).

Lệnh chạy một file test: `npx vitest run <đường dẫn>`. Toàn bộ: `npm test`.

---

## Task 1 — `getRuneById` (TDD)

**Modify**: `d:\runes-main\src\data\runes.test.ts`, `d:\runes-main\src\data\runes.ts`

1. Sửa dòng import đầu `runes.test.ts` thành:
   ```ts
   import { Rune, runes, interpolateAdvice, pickRandomRunes, isReversible, rollOrientation, getRuneById } from './runes';
   ```
2. Thêm vào cuối `runes.test.ts`:
   ```ts
   describe('getRuneById', () => {
     it('trả về rune có id tương ứng', () => {
       expect(getRuneById('ingwaz')?.symbol).toBe('ᛜ');
     });

     it('trả về undefined khi id không tồn tại', () => {
       expect(getRuneById('khong-co')).toBeUndefined();
     });
   });
   ```
3. Chạy `npx vitest run src/data/runes.test.ts` → **FAIL** (`getRuneById` is not a function /
   không export).
4. Thêm vào `runes.ts`, ngay sau `getRandomRune`:
   ```ts
   /** Tìm rune theo id (vd "fehu"); trả undefined nếu không có. */
   export const getRuneById = (id: string): Rune | undefined => runes.find((rune) => rune.id === id);
   ```
5. Chạy lại `npx vitest run src/data/runes.test.ts` → **PASS** toàn bộ.
6. Commit: `Add getRuneById helper`

---

## Task 2 — Khung `transliterate` + chế độ "Theo chữ cái" + `toRuneString` (TDD)

**Create**: `d:\runes-main\src\data\transliterate.test.ts`, `d:\runes-main\src\data\transliterate.ts`

1. Tạo `transliterate.test.ts`:
   ```ts
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
   ```
2. Chạy `npx vitest run src/data/transliterate.test.ts` → **FAIL** (không tìm thấy module
   `./transliterate`).
3. Tạo `transliterate.ts`:
   ```ts
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

   const RULES_BY_MODE: Record<WritingMode, Rule[]> = {
     vi: byLengthDesc(LETTER_RULES),
     en: byLengthDesc(LETTER_RULES),
     letters: LETTER_RULES
   };

   const TONE_MARKS = /[\u0300\u0301\u0303\u0309\u0323]/g;
   const ALL_MARKS = /[\u0300-\u036f]/g;

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
   ```
4. Chạy `npx vitest run src/data/transliterate.test.ts` → **PASS** toàn bộ.
5. Commit: `Add transliterate core with letter-by-letter mode`

---

## Task 3 — Quy tắc tiếng Việt theo âm (TDD)

**Modify**: `d:\runes-main\src\data\transliterate.test.ts`, `d:\runes-main\src\data\transliterate.ts`

1. Thêm vào cuối `transliterate.test.ts`:
   ```ts
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
   ```
2. Chạy `npx vitest run src/data/transliterate.test.ts` → **FAIL** ở các case tiếng Việt (vd
   "Minh" ra `ᛗᛁᚾᚺ`).
3. Trong `transliterate.ts`, thêm ngay **trước** dòng `const RULES_BY_MODE`:
   ```ts
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
   ```
   và đổi dòng `vi: byLengthDesc(LETTER_RULES),` thành:
   ```ts
     vi: byLengthDesc([...VI_RULES, ...LETTER_RULES]),
   ```
   (VI_RULES đứng trước nên cùng độ dài thì quy tắc tiếng Việt thắng bảng chữ cái, vd `d` → ᛉ.)
4. Chạy `npx vitest run src/data/transliterate.test.ts` → **PASS** toàn bộ.
5. Commit: `Add Vietnamese phonetic transliteration rules`

---

## Task 4 — Quy tắc tiếng Anh theo âm (TDD)

**Modify**: `d:\runes-main\src\data\transliterate.test.ts`, `d:\runes-main\src\data\transliterate.ts`

1. Thêm vào cuối `transliterate.test.ts`:
   ```ts
   describe('transliterate — tiếng Anh theo âm', () => {
     it.each([
       ['Thor', 'ᚦᛟᚱ'],
       ['Anna', 'ᚨᚾᚨ'],
       ['Grace', 'ᚷᚱᚨᛋᛖ'],
       ['Yasmin', 'ᛃᚨᛋᛗᛁᚾ'],
       ['Lily', 'ᛚᛁᛚᛁ'],
       ['Max', 'ᛗᚨᚲᛋ']
     ])('%s → %s', (input, expected) => {
       expect(write(input, 'en')).toBe(expected);
     });

     it('gộp phụ âm đôi và nối source', () => {
       expect(transliterate('Anna', 'en')).toEqual([
         { kind: 'rune', runeId: 'ansuz', source: 'a' },
         { kind: 'rune', runeId: 'naudhiz', source: 'nn' },
         { kind: 'rune', runeId: 'ansuz', source: 'a' }
       ]);
     });
   });
   ```
2. Chạy `npx vitest run src/data/transliterate.test.ts` → **FAIL** ở "Thor" (ra `ᛏᚺᛟᚱ`),
   "Grace", "Yasmin", "Lily". ("Anna" và "Max" có thể đã pass vì gộp trùng và bảng chữ cái đã
   có — không sao.)
3. Trong `transliterate.ts`, thêm ngay **trước** dòng `const RULES_BY_MODE`:
   ```ts
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
   ```
   và đổi dòng `en: byLengthDesc(LETTER_RULES),` thành:
   ```ts
     en: byLengthDesc([...EN_RULES, ...LETTER_RULES]),
   ```
4. Chạy `npx vitest run src/data/transliterate.test.ts` → **PASS** toàn bộ.
5. Commit: `Add English phonetic transliteration rules`

---

## Task 5 — Font Noto Sans Runic

**Modify**: `d:\runes-main\src\index.css`

1. Dòng 1, chèn `&family=Noto+Sans+Runic` ngay trước `&display=swap`:
   ```css
   @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;0,700;1,400&family=Inter:wght@300;400;500;600;700&family=Noto+Sans+Runic&display=swap');
   ```
2. Trong khối `.rune-symbol { ... }`, đổi:
   ```css
     font-family: 'Cormorant Garamond', serif;
   ```
   thành:
   ```css
     font-family: 'Noto Sans Runic', 'Cormorant Garamond', serif;
   ```
   (Google Fonts khai báo `unicode-range` chỉ cho khối ký tự rune, nên dấu "?" trên mặt úp lá
   bài vẫn rơi về Cormorant Garamond.)
3. Chạy `npm test` → **PASS** (không test nào phụ thuộc font).
4. Commit: `Load Noto Sans Runic so rune glyphs render consistently`

---

## Task 6 — Component `NameWriterTab` (TDD)

**Create**: `d:\runes-main\src\components\tabs\NameWriterTab.test.tsx`,
`d:\runes-main\src\components\tabs\NameWriterTab.tsx`
**Modify**: `d:\runes-main\src\index.css`

1. Tạo `NameWriterTab.test.tsx`:
   ```tsx
   import { fireEvent, render, screen } from '@testing-library/react';
   import { describe, expect, it } from 'vitest';
   import { getRuneById } from '../../data/runes';
   import NameWriterTab from './NameWriterTab';

   const typeName = (value: string) => {
     fireEvent.change(screen.getByLabelText('Tên cần viết bằng rune'), { target: { value } });
   };

   const runeButtons = () => screen.queryAllByRole('button', { name: /, từ "/ });

   describe('NameWriterTab', () => {
     it('ô trống thì hiện ví dụ, chưa có rune', () => {
       render(<NameWriterTab />);
       expect(screen.getByText('Ví dụ: Minh Anh')).toBeInTheDocument();
       expect(runeButtons()).toHaveLength(0);
     });

     it('gõ "Minh" hiện rune theo âm tiếng Việt (mặc định)', () => {
       render(<NameWriterTab />);
       typeName('Minh');
       expect(runeButtons().map((button) => button.textContent)).toEqual(['ᛗ', 'ᛁ', 'ᛜ']);
     });

     it('đổi sang "Theo chữ cái" thì kết quả đổi theo', () => {
       render(<NameWriterTab />);
       typeName('Minh');
       fireEvent.click(screen.getByRole('button', { name: 'Theo chữ cái' }));
       expect(runeButtons().map((button) => button.textContent)).toEqual(['ᛗ', 'ᛁ', 'ᚾ', 'ᚺ']);
     });

     it('bấm một rune thì hiện tên, ý nghĩa và chữ gốc; bấm lại thì đóng', () => {
       const mannaz = getRuneById('mannaz')!;
       render(<NameWriterTab />);
       typeName('Minh');
       fireEvent.click(runeButtons()[0]);
       expect(screen.getByRole('heading', { name: mannaz.name })).toBeInTheDocument();
       expect(screen.getByText(mannaz.meaning)).toBeInTheDocument();
       expect(screen.getByText('Phiên từ: m')).toBeInTheDocument();
       fireEvent.click(runeButtons()[0]);
       expect(screen.queryByRole('heading', { name: mannaz.name })).not.toBeInTheDocument();
     });

     it('ký tự không có rune thì báo đã bỏ qua', () => {
       render(<NameWriterTab />);
       typeName('Minh 2!');
       expect(screen.getByText('Không có rune tương ứng, đã bỏ qua: 2, !')).toBeInTheDocument();
     });
   });
   ```
2. Chạy `npx vitest run src/components/tabs/NameWriterTab.test.tsx` → **FAIL** (không tìm thấy
   module `./NameWriterTab`).
3. Tạo `NameWriterTab.tsx`:
   ```tsx
   import { useEffect, useState } from 'react';
   import { getRuneById } from '../../data/runes';
   import { RUNE_SEPARATOR, WritingMode, toRuneString, transliterate } from '../../data/transliterate';

   interface ModeOption {
     id: WritingMode;
     label: string;
     hint: string;
   }

   const MODES: ModeOption[] = [
     { id: 'vi', label: 'Tiếng Việt', hint: 'Phiên theo cách đọc tiếng Việt, dấu thanh sẽ mất.' },
     { id: 'en', label: 'English', hint: 'Phiên theo cách đọc tiếng Anh, vd "th" thành ᚦ.' },
     { id: 'letters', label: 'Theo chữ cái', hint: 'Mỗi chữ cái Latin đổi thành một rune, không xét cách đọc.' }
   ];

   type CopyStatus = 'idle' | 'copied' | 'failed';

   /** Tab "Viết tên": gõ tên, chọn cách viết, xem và sao chép tên viết bằng rune. */
   function NameWriterTab() {
     const [name, setName] = useState('');
     const [mode, setMode] = useState<WritingMode>('vi');
     const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
     const [copyStatus, setCopyStatus] = useState<CopyStatus>('idle');

     const tokens = transliterate(name, mode);
     const runeString = toRuneString(tokens);
     const skipped = [...new Set(tokens.flatMap((token) => (token.kind === 'skipped' ? [token.source] : [])))];
     const selected = selectedIndex === null ? undefined : tokens[selectedIndex];
     const selectedRune = selected?.kind === 'rune' ? getRuneById(selected.runeId) : undefined;
     const activeMode = MODES.find((option) => option.id === mode) ?? MODES[0];

     useEffect(() => {
       if (copyStatus !== 'copied') return;
       const timer = window.setTimeout(() => setCopyStatus('idle'), 2000);
       return () => window.clearTimeout(timer);
     }, [copyStatus]);

     const handleNameChange = (value: string) => {
       setName(value);
       setSelectedIndex(null);
       setCopyStatus('idle');
     };

     const handleModeChange = (nextMode: WritingMode) => {
       setMode(nextMode);
       setSelectedIndex(null);
       setCopyStatus('idle');
     };

     const handleCopy = async () => {
       try {
         await navigator.clipboard.writeText(runeString);
         setCopyStatus('copied');
       } catch {
         setCopyStatus('failed');
       }
     };

     return (
       <div className="rune-card name-writer">
         <h2 className="name-writer-title">Viết tên bằng Rune</h2>
         <p className="name-writer-intro">
           Rune là bảng chữ cái cổ của người Bắc Âu. Gõ tên bạn để xem nó được khắc bằng rune.
         </p>

         <input
           type="text"
           className="name-writer-input"
           value={name}
           maxLength={60}
           placeholder="Nhập tên của bạn…"
           aria-label="Tên cần viết bằng rune"
           onChange={(e) => handleNameChange(e.target.value)}
         />

         <div className="name-writer-modes" role="group" aria-label="Cách viết">
           {MODES.map((option) => (
             <button
               key={option.id}
               type="button"
               className={`name-writer-mode ${mode === option.id ? 'active' : ''}`}
               aria-pressed={mode === option.id}
               onClick={() => handleModeChange(option.id)}
             >
               {option.label}
             </button>
           ))}
         </div>
         <p className="name-writer-hint">{activeMode.hint}</p>

         {tokens.length === 0 ? (
           <p className="name-writer-empty">Ví dụ: Minh Anh</p>
         ) : (
           <>
             <p className="name-writer-output">
               {tokens.map((token, index) => {
                 if (token.kind === 'separator') {
                   return <span key={index} className="name-writer-separator" aria-hidden="true">{RUNE_SEPARATOR}</span>;
                 }
                 if (token.kind === 'skipped') return null;
                 const rune = getRuneById(token.runeId);
                 if (!rune) return null;
                 const isSelected = selectedIndex === index;
                 return (
                   <button
                     key={index}
                     type="button"
                     className={`name-writer-rune ${isSelected ? 'active' : ''}`}
                     aria-label={`${rune.name}, từ "${token.source}"`}
                     aria-pressed={isSelected}
                     onClick={() => setSelectedIndex(isSelected ? null : index)}
                   >
                     {rune.symbol}
                   </button>
                 );
               })}
             </p>

             {selected?.kind === 'rune' && selectedRune && (
               <div className="name-writer-detail">
                 <span className="name-writer-detail-symbol" aria-hidden="true">{selectedRune.symbol}</span>
                 <div>
                   <h3>{selectedRune.name}</h3>
                   <p>{selectedRune.meaning}</p>
                   <p className="name-writer-detail-source">Phiên từ: {selected.source}</p>
                 </div>
               </div>
             )}

             {skipped.length > 0 && (
               <p className="name-writer-skipped">Không có rune tương ứng, đã bỏ qua: {skipped.join(', ')}</p>
             )}

             <button type="button" className="name-writer-copy" onClick={handleCopy} disabled={runeString === ''}>
               {copyStatus === 'copied' ? 'Đã sao chép' : 'Sao chép'}
             </button>
             {copyStatus === 'failed' && (
               <p className="name-writer-copy-error" role="alert">Không sao chép được, hãy bôi đen để chép thủ công.</p>
             )}
           </>
         )}

         <p className="name-writer-note">
           Đây là phiên âm gần đúng: rune ghi âm của tiếng Germanic cổ, tiếng Việt sẽ mất dấu thanh.
           Nếu bạn định xăm hoặc khắc, hãy tham khảo thêm.
         </p>
       </div>
     );
   }

   export default NameWriterTab;
   ```
4. Thêm vào **cuối** `src/index.css`:
   ```css
   /* ===== Viết tên bằng Rune ===== */
   .name-writer {
     max-width: 800px;
     margin: 0 auto;
   }

   .name-writer.rune-card:hover {
     transform: none;
   }

   .name-writer-title {
     font-size: 1.8rem;
     margin-bottom: 1rem;
   }

   .name-writer-intro {
     color: #cbd5e0;
     line-height: 1.6;
     margin-bottom: 1.5rem;
   }

   .name-writer-input {
     width: 100%;
     max-width: 420px;
     padding: 0.75rem 1rem;
     background: linear-gradient(145deg, #1a1d26, #0e1117);
     border: 1px solid rgba(99, 179, 237, 0.3);
     border-radius: 8px;
     color: #e8f4fd;
     font-family: 'Inter', sans-serif;
     font-size: 1.1rem;
     text-align: center;
     box-sizing: border-box;
     outline: none;
     transition: border-color 0.2s ease;
   }

   .name-writer-input:focus {
     border-color: #63b3ed;
   }

   .name-writer-modes {
     display: flex;
     justify-content: center;
     flex-wrap: wrap;
     gap: 0.5rem;
     margin: 1rem 0 0.4rem;
   }

   .name-writer-mode {
     background: linear-gradient(145deg, #1a1d24, #0e1117);
     color: #e8f4fd;
     border: 1px solid rgba(99, 179, 237, 0.2);
     border-radius: 999px;
     padding: 0.45rem 1rem;
     font-family: 'Inter', sans-serif;
     font-size: 0.9rem;
     cursor: pointer;
     transition: border-color 0.2s ease, background 0.2s ease;
   }

   .name-writer-mode.active {
     background: linear-gradient(145deg, #2c3e50, #1a252f);
     border-color: #63b3ed;
   }

   .name-writer-hint,
   .name-writer-empty {
     color: #8fa5b8;
     font-size: 0.88rem;
     font-style: italic;
   }

   .name-writer-output {
     display: flex;
     flex-wrap: wrap;
     justify-content: center;
     align-items: center;
     gap: 0.15rem;
     margin: 1.75rem 0 1rem;
     min-height: 4rem;
   }

   .name-writer-rune {
     font-family: 'Noto Sans Runic', 'Cormorant Garamond', serif;
     font-size: 3rem;
     line-height: 1;
     color: #e8f4fd;
     background: none;
     border: 1px solid transparent;
     border-radius: 8px;
     padding: 0.2rem 0.35rem;
     cursor: pointer;
     text-shadow: 0 0 10px rgba(136, 192, 208, 0.6);
     transition: border-color 0.2s ease, background 0.2s ease;
   }

   .name-writer-rune:hover,
   .name-writer-rune.active {
     border-color: rgba(99, 179, 237, 0.5);
     background: rgba(99, 179, 237, 0.08);
   }

   .name-writer-rune:focus-visible {
     outline: 2px solid #63b3ed;
     outline-offset: 2px;
   }

   .name-writer-separator {
     font-family: 'Noto Sans Runic', serif;
     font-size: 2rem;
     color: #63b3ed;
     opacity: 0.7;
     margin: 0 0.4rem;
   }

   .name-writer-detail {
     display: inline-flex;
     align-items: center;
     gap: 1rem;
     text-align: left;
     padding: 0.75rem 1.25rem;
     margin-bottom: 1rem;
     border: 1px solid rgba(99, 179, 237, 0.25);
     border-radius: 12px;
     background: linear-gradient(145deg, #181c24, #0a0d12);
   }

   .name-writer-detail-symbol {
     font-family: 'Noto Sans Runic', serif;
     font-size: 2.5rem;
     color: #e8f4fd;
     text-shadow: 0 0 10px rgba(136, 192, 208, 0.6);
   }

   .name-writer-detail h3 {
     margin: 0 0 0.2rem;
     font-family: 'Cormorant Garamond', serif;
     font-size: 1.3rem;
     color: #ffffff;
   }

   .name-writer-detail p {
     margin: 0;
     color: #b8d4e6;
     font-size: 0.95rem;
   }

   .name-writer-detail .name-writer-detail-source {
     margin-top: 0.2rem;
     color: #8fa5b8;
     font-size: 0.85rem;
     font-style: italic;
   }

   .name-writer-skipped,
   .name-writer-copy-error {
     color: #d8b4a0;
     font-size: 0.85rem;
     margin: 0 0 1rem;
   }

   .name-writer-copy {
     display: block;
     margin: 0 auto 1rem;
     background: linear-gradient(145deg, #3182ce, #2b6cb0);
     color: #ffffff;
     border: none;
     border-radius: 8px;
     padding: 0.6rem 1.75rem;
     font-size: 1rem;
     cursor: pointer;
   }

   .name-writer-copy:disabled {
     opacity: 0.5;
     cursor: default;
   }

   .name-writer-note {
     margin-top: 2rem;
     color: #8fa5b8;
     font-size: 0.85rem;
     line-height: 1.6;
     font-style: italic;
   }

   @media (max-width: 768px) {
     .name-writer.rune-card {
       padding: 1.5rem 1rem;
     }

     .name-writer-rune {
       font-size: 2.4rem;
     }
   }
   ```
5. Chạy `npx vitest run src/components/tabs/NameWriterTab.test.tsx` → **PASS** 5/5.
6. Commit: `Add NameWriterTab component`

---

## Task 7 — Gắn tab vào điều hướng

**Modify**: `d:\runes-main\src\App.test.tsx`, `d:\runes-main\src\types.ts`,
`d:\runes-main\src\components\Nav.tsx`, `d:\runes-main\src\App.tsx`

1. Trong `App.test.tsx`, thêm vào cuối test `'hiển thị tiêu đề và mặc định chọn tab Tiên đoán'`
   (sau dòng `expect(...).toHaveClass('active');`):
   ```tsx
       expect(within(nav).getByRole('button', { name: 'Viết tên' })).toBeInTheDocument();
   ```
2. Chạy `npx vitest run src/App.test.tsx` → **FAIL** (không tìm thấy nút "Viết tên").
3. `types.ts` thành:
   ```ts
   export type TabId = 'dictionary' | 'namewriter' | 'bindrunes' | 'wyrd' | 'randompull' | 'history';
   ```
4. `Nav.tsx`, mảng `NAV_ITEMS` thành:
   ```ts
   const NAV_ITEMS: NavItem[] = [
     { id: 'randompull', label: 'Tiên đoán' },
     { id: 'namewriter', label: 'Viết tên' },
     { id: 'dictionary', label: 'Từ điển Rune' },
     { id: 'bindrunes', label: 'Bindrunes' },
     { id: 'wyrd', label: 'Mạng lưới định mệnh (Wyrd)' },
     { id: 'history', label: 'Lịch sử Rune' }
   ];
   ```
5. `App.tsx`:
   - thêm import sau dòng `import DictionaryTab ...`:
     ```tsx
     import NameWriterTab from './components/tabs/NameWriterTab';
     ```
   - thêm dòng render sau dòng `{activeTab === 'randompull' && ...}`:
     ```tsx
               {activeTab === 'namewriter' && <NameWriterTab />}
     ```
6. Chạy `npx vitest run src/App.test.tsx` → **PASS**.
7. Commit: `Add "Viết tên" tab to navigation`

---

## Task 8 — Kiểm tra tổng thể

1. `npm test` → toàn bộ PASS (16 test cũ + test mới).
2. `npm run lint` → không lỗi, không cảnh báo mới.
3. `npx tsc --noEmit` → không lỗi.
4. `npm run build` → build thành công.
5. Chạy `npm run dev`, mở tab "Viết tên" và kiểm tra bằng mắt:
   - gõ "Nguyễn Minh Anh" → `ᛜᚢᛁᛖᚾ ᛫ ᛗᛁᛜ ᛫ ᚨᛁᛜ`, rune hiển thị bằng Noto Sans Runic;
   - đổi 3 chế độ, bấm rune xem thẻ chi tiết, bấm "Sao chép" rồi dán thử;
   - thu hẹp cửa sổ xuống ~375px: không tràn ngang, menu mobile có "Viết tên";
   - desktop ~1100px: thanh nav 6 mục không tràn khỏi màn hình;
   - tab Tiên đoán và Từ điển: rune vẫn hiển thị đúng, dấu "?" trên lá úp không đổi.

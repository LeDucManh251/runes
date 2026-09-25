# Rune Ngược (Merkstave)

**Sub-skill bắt buộc để thực thi**: Subagent-Driven Development (khuyến nghị) hoặc Inline
Execution — người dùng chọn sau khi plan này được duyệt.

**Spec gốc**: `docs/superpowers/specs/2026-09-25-reversed-rune-design.md`

## Goal

Thêm cơ chế "rune ngược" (merkstave) vào tab Tiên đoán và Từ điển: khi rút quẻ, 16/24 rune
(không tính 8 rune đối xứng theo quy ước) có 50% khả năng ra ở chiều ngược, mang ý nghĩa/lời
khuyên khác với chiều xuôi. Từ điển hiển thị thêm ý nghĩa ngược cho các rune này.

## Architecture

```
src/
  data/
    runes.ts          (SỬA) — thêm field reversedMeaning/reversedAdvice, hàm isReversible,
                                rollOrientation; interpolateAdvice thêm tham số isReversed
    runes.test.ts      (SỬA) — thêm test cho isReversible/rollOrientation/interpolateAdvice
                                (dùng fixture) + test dữ liệu 16/8 rune
  components/
    RandomPullTab.tsx  (SỬA) — DrawnRune type, pull ra kèm orientation, truyền isReversed
                                xuống FlipCard
    FlipCard.tsx       (SỬA) — prop isReversed, xoay symbol 180°, nhãn "(Ngược)"
    tabs/
      DictionaryTab.tsx (SỬA) — hiển thị dòng "Khi ngược: ..." nếu rune.reversedMeaning tồn tại
```

## Tech Stack

Giống phần trước: React 18 + TypeScript, Vitest cho test.

---

## Task 1 — `isReversible` + `rollOrientation` (TDD)

**Modify**: `d:\runes-main\src\data\runes.test.ts`, `d:\runes-main\src\data\runes.ts`

1. Sửa dòng import đầu `runes.test.ts` từ:
   ```ts
   import { runes, interpolateAdvice, pickRandomRunes } from './runes';
   ```
   thành:
   ```ts
   import { Rune, runes, interpolateAdvice, pickRandomRunes, isReversible, rollOrientation } from './runes';
   ```
2. Thêm vào cuối `runes.test.ts` (sau khối `describe('interpolateAdvice', ...)` hiện có):

```ts
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
```

3. Chạy: `npm run test`
   Kỳ vọng: thất bại — `isReversible`/`rollOrientation` không tồn tại trong export của
   `runes.ts` (lỗi import hoặc `is not a function`).
4. Sửa interface `Rune` trong `runes.ts` (đầu file) từ:
   ```ts
   export interface Rune {
     id: string;
     symbol: string;
     name: string;
     meaning: string;
     description: string;
     /** Suy luận/gợi ý chung khi tra từ điển (không phụ thuộc câu hỏi tiên đoán). */
     interpretation: string;
     /**
      * Mẫu lời khuyên dùng khi rút bài tiên đoán. Hỗ trợ 2 placeholder:
      * {subject} - chủ đề câu hỏi người dùng nhập (hoặc "tình huống của bạn")
      * {name}    - tên rune (vd: "Uruz")
      */
     advice: string;
     annotations?: Annotation[];
   }
   ```
   thành:
   ```ts
   export interface Rune {
     id: string;
     symbol: string;
     name: string;
     meaning: string;
     description: string;
     /** Suy luận/gợi ý chung khi tra từ điển (không phụ thuộc câu hỏi tiên đoán). */
     interpretation: string;
     /**
      * Mẫu lời khuyên dùng khi rút bài tiên đoán. Hỗ trợ 2 placeholder:
      * {subject} - chủ đề câu hỏi người dùng nhập (hoặc "tình huống của bạn")
      * {name}    - tên rune (vd: "Uruz")
      */
     advice: string;
     annotations?: Annotation[];
     /** Ý nghĩa ngắn khi rune rút được ở chiều ngược (merkstave). Rune không có field này
      * là rune đối xứng — không bao giờ ra ngược. */
     reversedMeaning?: string;
     /** Mẫu lời khuyên khi ngược, cùng placeholder {subject}/{name} như `advice`. */
     reversedAdvice?: string;
   }
   ```
5. Thêm vào cuối `runes.ts` (sau hàm `pickRandomRunes`, trước `interpolateAdvice`):
   ```ts
   /** Một rune có ý nghĩa ngược riêng hay không (rune đối xứng thì không). */
   export const isReversible = (rune: Rune): boolean => Boolean(rune.reversedMeaning);

   /** Random chiều rút cho 1 rune — rune đối xứng luôn ra xuôi, rune còn lại 50/50. */
   export const rollOrientation = (rune: Rune): boolean => {
     if (!isReversible(rune)) return false;
     return Math.random() < 0.5;
   };
   ```
6. Chạy: `npm run test`
   Kỳ vọng: tất cả test pass (số lượng tăng thêm 5 so với trước — `11 passed`).
7. Commit: `git add src/data/runes.ts src/data/runes.test.ts && git commit -m "Add isReversible and rollOrientation helpers for reversed rune draws"`

## Task 2 — `interpolateAdvice` hỗ trợ `isReversed` (TDD)

**Modify**: `d:\runes-main\src\data\runes.test.ts`, `d:\runes-main\src\data\runes.ts`

1. Thêm vào cuối `runes.test.ts`:

```ts
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
```

2. Chạy: `npm run test`
   Kỳ vọng: 3 test mới fail (TypeScript báo `interpolateAdvice` chỉ nhận 2 tham số, hoặc test
   logic fail vì tham số thứ 3 bị bỏ qua).
3. Sửa `interpolateAdvice` trong `runes.ts` từ:
   ```ts
   export const interpolateAdvice = (rune: Rune, subject: string): string => {
     const template = rune.advice
       ?? `hãy liên hệ ý nghĩa của {name} với {subject}. Hãy để rune gợi ra hành động trung thực kế tiếp, thay vì một lời tiên đoán cố định.`;
     return template.replace(/\{subject\}/g, subject).replace(/\{name\}/g, rune.name);
   };
   ```
   thành:
   ```ts
   export const interpolateAdvice = (rune: Rune, subject: string, isReversed: boolean = false): string => {
     const template = (isReversed ? rune.reversedAdvice : undefined)
       ?? rune.advice
       ?? `hãy liên hệ ý nghĩa của {name} với {subject}. Hãy để rune gợi ra hành động trung thực kế tiếp, thay vì một lời tiên đoán cố định.`;
     return template.replace(/\{subject\}/g, subject).replace(/\{name\}/g, rune.name);
   };
   ```
4. Chạy: `npm run test`
   Kỳ vọng: tất cả pass (`14 passed`).
5. Commit: `git add src/data/runes.ts src/data/runes.test.ts && git commit -m "Support isReversed parameter in interpolateAdvice"`

## Task 3 — Nội dung ngược cho 16 rune (TDD)

**Modify**: `d:\runes-main\src\data\runes.test.ts`, `d:\runes-main\src\data\runes.ts`

1. Thêm vào cuối `runes.test.ts`:

```ts
describe('dữ liệu rune ngược', () => {
  const symmetricIds = ['gebo', 'hagalaz', 'isa', 'jera', 'eihwaz', 'ingwaz', 'dagaz', 'othala'];

  it('đúng 8 rune đối xứng không có reversedMeaning', () => {
    const withoutReversed = runes.filter((rune) => !rune.reversedMeaning).map((rune) => rune.id);
    expect(withoutReversed.sort()).toEqual([...symmetricIds].sort());
  });

  it('16 rune còn lại đều có cả reversedMeaning và reversedAdvice', () => {
    const reversibleRunes = runes.filter((rune) => !symmetricIds.includes(rune.id));
    expect(reversibleRunes).toHaveLength(16);
    reversibleRunes.forEach((rune) => {
      expect(rune.reversedMeaning).toBeTruthy();
      expect(rune.reversedAdvice).toBeTruthy();
    });
  });
});
```

2. Chạy: `npm run test`
   Kỳ vọng: cả 2 test mới fail (hiện tại không rune nào có `reversedMeaning`, nên
   `withoutReversed` chứa cả 24 id thay vì đúng 8 id).
3. Thêm `reversedMeaning`/`reversedAdvice` vào đúng 16 rune sau trong `runes.ts`, mỗi rune sửa
   đúng 2 dòng `interpretation`/`advice` hiện có thành 4 dòng (thêm 2 field mới ngay sau
   `advice`, giữ nguyên `annotations` phía sau không đổi). Dưới đây là từng chỗ sửa chính xác:

   **Fehu** — sửa:
   ```ts
       interpretation: "Tài lộc và năng lượng dồi dào đang luân chuyển, mang đến cơ hội biến ước mơ thành hiện thực.",
       advice: "hãy nhìn vào điều đang có giá trị trong {subject}. Rune này hướng bạn đến nguồn lực, sự trao đổi thực tế và thứ có thể nuôi lớn quyết định kế tiếp.",
   ```
   thành:
   ```ts
       interpretation: "Tài lộc và năng lượng dồi dào đang luân chuyển, mang đến cơ hội biến ước mơ thành hiện thực.",
       advice: "hãy nhìn vào điều đang có giá trị trong {subject}. Rune này hướng bạn đến nguồn lực, sự trao đổi thực tế và thứ có thể nuôi lớn quyết định kế tiếp.",
       reversedMeaning: "Mất mát / Bám giữ quá chặt",
       reversedAdvice: "hãy xem lại nơi bạn đang bám giữ quá chặt. {subject} có thể cần bạn buông bớt kiểm soát tài chính hoặc vật chất thay vì tích trữ thêm.",
   ```

   **Uruz** — sửa:
   ```ts
       interpretation: "Đã đến lúc khai phá nội lực mãnh liệt và lòng dũng cảm để vượt qua ranh giới, đón nhận sự thay đổi lớn.",
       advice: "hãy phản hồi từ sự vững vàng, không phải từ áp lực. {name} cho thấy bạn có nhiều sức bền hơn vẻ ngoài của tình huống.",
   ```
   thành:
   ```ts
       interpretation: "Đã đến lúc khai phá nội lực mãnh liệt và lòng dũng cảm để vượt qua ranh giới, đón nhận sự thay đổi lớn.",
       advice: "hãy phản hồi từ sự vững vàng, không phải từ áp lực. {name} cho thấy bạn có nhiều sức bền hơn vẻ ngoài của tình huống.",
       reversedMeaning: "Suy nhược / Mất kiểm soát",
       reversedAdvice: "đừng ép cơ thể hoặc ý chí vượt quá giới hạn. {name} ngược nhắc bạn nghỉ ngơi trước khi kiệt sức ảnh hưởng đến quyết định.",
   ```

   **Thurisaz** — sửa:
   ```ts
       interpretation: "Hãy thiết lập ranh giới phòng thủ vững chắc để bảo toàn sức mạnh và vượt qua chướng ngại vật trước mắt.",
       advice: "hãy đặt ranh giới trước khi hành động. Lời khuyên là bảo vệ điều quan trọng và đừng phản ứng chỉ vì sợ hãi.",
   ```
   thành:
   ```ts
       interpretation: "Hãy thiết lập ranh giới phòng thủ vững chắc để bảo toàn sức mạnh và vượt qua chướng ngại vật trước mắt.",
       advice: "hãy đặt ranh giới trước khi hành động. Lời khuyên là bảo vệ điều quan trọng và đừng phản ứng chỉ vì sợ hãi.",
       reversedMeaning: "Hung hăng thái quá / Mất cảnh giác",
       reversedAdvice: "hãy xem lại ranh giới bạn đang dựng lên — có thể đang quá hung hăng hoặc quá lỏng lẻo. Đừng phản ứng khi chưa thật sự cần phòng thủ.",
   ```
   Lưu ý: dùng cả dòng `interpretation` phía trên làm phần đầu của `old_string`/`new_string` để
   tránh trùng khớp với **Algiz** (có cùng dòng `advice` y hệt nhưng `interpretation` khác).

   **Ansuz** — sửa:
   ```ts
       interpretation: "Hãy chú ý đến những thông điệp xung quanh, lắng nghe tiếng gọi của trí tuệ và trực giác để tìm ra hướng đi sáng suốt.",
       advice: "hãy làm rõ lời nói, tín hiệu hoặc lời khuyên quanh {subject}. Một cuộc trò chuyện thẳng thắn có thể mở ra bước tiếp theo.",
   ```
   thành:
   ```ts
       interpretation: "Hãy chú ý đến những thông điệp xung quanh, lắng nghe tiếng gọi của trí tuệ và trực giác để tìm ra hướng đi sáng suốt.",
       advice: "hãy làm rõ lời nói, tín hiệu hoặc lời khuyên quanh {subject}. Một cuộc trò chuyện thẳng thắn có thể mở ra bước tiếp theo.",
       reversedMeaning: "Hiểu lầm / Lời nói sai lệch",
       reversedAdvice: "hãy cẩn trọng với lời nói xung quanh {subject} — có thể đang có hiểu lầm hoặc thông tin chưa chính xác. Đừng vội tin lời khuyên đầu tiên bạn nghe được.",
   ```

   **Raidho** — sửa:
   ```ts
       interpretation: "Cuộc sống của bạn đang chuyển động đúng quỹ đạo. Hãy kiên định tiến bước trên hành trình tự hoàn thiện bản thân.",
       advice: "hãy xem đây là một hành trình, không chỉ là một quyết định đơn lẻ. Một bước nhỏ được kiểm chứng cẩn thận có giá trị hơn câu trả lời hoàn hảo.",
   ```
   thành:
   ```ts
       interpretation: "Cuộc sống của bạn đang chuyển động đúng quỹ đạo. Hãy kiên định tiến bước trên hành trình tự hoàn thiện bản thân.",
       advice: "hãy xem đây là một hành trình, không chỉ là một quyết định đơn lẻ. Một bước nhỏ được kiểm chứng cẩn thận có giá trị hơn câu trả lời hoàn hảo.",
       reversedMeaning: "Trì trệ / Lạc lối",
       reversedAdvice: "hãy chấp nhận rằng hành trình đang chững lại. Đừng ép bước tiếp khi con đường chưa thật sự rõ ràng.",
   ```
   Lưu ý: dòng `advice` này trùng với **Ehwaz** — luôn dùng kèm dòng `interpretation` phía trên
   (khác nhau giữa 2 rune) để `old_string` là duy nhất.

   **Kenaz** — sửa:
   ```ts
       interpretation: "Ánh sáng từ sự hiểu biết và cảm hứng sáng tạo sẽ giúp bạn xua tan bóng tối hoài nghi, nhìn rõ lối đi.",
       advice: "hãy đưa phần mơ hồ ra ánh sáng. Thu thập dữ kiện, gọi tên mô thức, rồi lựa chọn với nhiều sáng tạo hơn.",
   ```
   thành:
   ```ts
       interpretation: "Ánh sáng từ sự hiểu biết và cảm hứng sáng tạo sẽ giúp bạn xua tan bóng tối hoài nghi, nhìn rõ lối đi.",
       advice: "hãy đưa phần mơ hồ ra ánh sáng. Thu thập dữ kiện, gọi tên mô thức, rồi lựa chọn với nhiều sáng tạo hơn.",
       reversedMeaning: "Cạn kiệt cảm hứng / Mù mờ",
       reversedAdvice: "hãy thắp lại ngọn lửa cảm hứng đã tắt trước khi cố tìm câu trả lời. {name} ngược cho thấy bạn cần nghỉ để nhìn rõ lại vấn đề.",
   ```

   **Wunjo** — sửa:
   ```ts
       interpretation: "Giai đoạn của sự mãn nguyện và bình yên đang đến. Bạn sẽ tìm thấy sự hòa hợp trọn vẹn giữa mong muốn cá nhân và số phận.",
       advice: "hãy tìm lựa chọn giúp khôi phục sự nhẹ nhõm mà vẫn không né tránh thực tế. Niềm vui ở đây là một tín hiệu đáng lắng nghe.",
   ```
   thành:
   ```ts
       interpretation: "Giai đoạn của sự mãn nguyện và bình yên đang đến. Bạn sẽ tìm thấy sự hòa hợp trọn vẹn giữa mong muốn cá nhân và số phận.",
       advice: "hãy tìm lựa chọn giúp khôi phục sự nhẹ nhõm mà vẫn không né tránh thực tế. Niềm vui ở đây là một tín hiệu đáng lắng nghe.",
       reversedMeaning: "Bất hòa / Thất vọng",
       reversedAdvice: "đừng gượng ép niềm vui khi lòng chưa thật sự yên. Hãy thành thật nhìn nhận điều đang gây bất hòa trong {subject}.",
   ```

   **Naudhiz** — sửa:
   ```ts
       interpretation: "Áp lực và giới hạn hiện tại chính là bài học kiên nhẫn, giúp bạn nhận ra giá trị thực sự và gia tăng sức chịu đựng.",
       advice: "hãy gọi tên giới hạn thật sự. Rune này hỏi điều gì là cần thiết, điều gì là tùy chọn, và điều gì bạn có thể ngừng mang theo.",
   ```
   thành:
   ```ts
       interpretation: "Áp lực và giới hạn hiện tại chính là bài học kiên nhẫn, giúp bạn nhận ra giá trị thực sự và gia tăng sức chịu đựng.",
       advice: "hãy gọi tên giới hạn thật sự. Rune này hỏi điều gì là cần thiết, điều gì là tùy chọn, và điều gì bạn có thể ngừng mang theo.",
       reversedMeaning: "Tự trói buộc / Bất lực",
       reversedAdvice: "hãy xem lại giới hạn bạn tự đặt ra cho chính mình — có thể đang trói buộc bạn nhiều hơn cần thiết. Đừng nhầm lẫn sự thiếu thốn với sự bất lực.",
   ```

   **Perthro** — sửa:
   ```ts
       interpretation: "Hãy sẵn sàng đón nhận những điều bất ngờ nằm ngoài tầm kiểm soát của lý trí. Số phận luôn có những lối rẽ bí ẩn đầy thú vị.",
       advice: "hãy chừa chỗ cho điều chưa biết. Không phải mọi yếu tố đều đã hiện ra, nên bước tiếp theo nên đủ linh hoạt.",
   ```
   thành:
   ```ts
       interpretation: "Hãy sẵn sàng đón nhận những điều bất ngờ nằm ngoài tầm kiểm soát của lý trí. Số phận luôn có những lối rẽ bí ẩn đầy thú vị.",
       advice: "hãy chừa chỗ cho điều chưa biết. Không phải mọi yếu tố đều đã hiện ra, nên bước tiếp theo nên đủ linh hoạt.",
       reversedMeaning: "Bế tắc / Bí mật chưa lộ diện",
       reversedAdvice: "có điều gì đó đang bị giấu kín hoặc chưa sẵn sàng lộ diện. Đừng cố ép buộc một câu trả lời khi vận may chưa đứng về phía bạn.",
   ```

   **Algiz** — sửa:
   ```ts
       interpretation: "Bạn đang được bảo vệ an toàn trên hành trình của mình. Hãy tin tưởng vào sự dẫn dắt tâm linh và bản năng tự vệ bên trong.",
       advice: "hãy đặt ranh giới trước khi hành động. Lời khuyên là bảo vệ điều quan trọng và đừng phản ứng chỉ vì sợ hãi.",
   ```
   thành:
   ```ts
       interpretation: "Bạn đang được bảo vệ an toàn trên hành trình của mình. Hãy tin tưởng vào sự dẫn dắt tâm linh và bản năng tự vệ bên trong.",
       advice: "hãy đặt ranh giới trước khi hành động. Lời khuyên là bảo vệ điều quan trọng và đừng phản ứng chỉ vì sợ hãi.",
       reversedMeaning: "Mất cảnh giác / Tổn thương",
       reversedAdvice: "hãy cẩn trọng — lớp phòng vệ quanh {subject} có thể đang lỏng lẻo hơn bạn nghĩ. Đừng hạ thấp cảnh giác quá sớm.",
   ```

   **Sowilo** — sửa:
   ```ts
       interpretation: "Ánh sáng rực rỡ của thành công đang chiếu rọi con đường bạn đi. Hãy giải phóng nguồn sinh lực và ý chí mạnh mẽ để đạt tới vinh quang.",
       advice: "hãy đi về phía điều sáng rõ, tiếp thêm năng lượng và trung thực. Rune này ủng hộ sự tự tin dựa trên sự thật có thể nhìn thấy.",
   ```
   thành:
   ```ts
       interpretation: "Ánh sáng rực rỡ của thành công đang chiếu rọi con đường bạn đi. Hãy giải phóng nguồn sinh lực và ý chí mạnh mẽ để đạt tới vinh quang.",
       advice: "hãy đi về phía điều sáng rõ, tiếp thêm năng lượng và trung thực. Rune này ủng hộ sự tự tin dựa trên sự thật có thể nhìn thấy.",
       reversedMeaning: "Ảo tưởng / Kiêu ngạo",
       reversedAdvice: "hãy nhìn lại xem thành công đang thấy có thực sự vững chắc hay chỉ là ảo tưởng nhất thời. Đừng để sự tự tin biến thành kiêu ngạo.",
   ```

   **Tiwaz** — sửa:
   ```ts
       interpretation: "Hãy hành động với tinh thần trách nhiệm, danh dự và lòng trung thực. Chiến thắng và công lý sẽ đứng về phía người chính trực.",
       advice: "hãy chọn con đường bạn có thể đứng vững sau đó. Công bằng, chính trực và hy sinh cho điều đúng là trọng tâm ở đây.",
   ```
   thành:
   ```ts
       interpretation: "Hãy hành động với tinh thần trách nhiệm, danh dự và lòng trung thực. Chiến thắng và công lý sẽ đứng về phía người chính trực.",
       advice: "hãy chọn con đường bạn có thể đứng vững sau đó. Công bằng, chính trực và hy sinh cho điều đúng là trọng tâm ở đây.",
       reversedMeaning: "Bất công / Niềm tin đặt sai chỗ",
       reversedAdvice: "hãy xem lại liệu bạn có đang hy sinh quá nhiều cho một nguyên tắc không còn công bằng. {name} ngược cảnh báo về niềm tin bị đặt sai chỗ.",
   ```

   **Berkano** — sửa:
   ```ts
       interpretation: "Một hạt giống mới đang nảy mầm trong cuộc sống của bạn. Hãy nuôi dưỡng nó bằng tình yêu thương và sự kiên nhẫn để đón nhận sự sinh trưởng.",
       advice: "hãy tạo điều kiện cho cái mới phát triển. Sự dịu dàng, đều đặn và kiên nhẫn có thể hiệu quả hơn việc thúc ép.",
   ```
   thành:
   ```ts
       interpretation: "Một hạt giống mới đang nảy mầm trong cuộc sống của bạn. Hãy nuôi dưỡng nó bằng tình yêu thương và sự kiên nhẫn để đón nhận sự sinh trưởng.",
       advice: "hãy tạo điều kiện cho cái mới phát triển. Sự dịu dàng, đều đặn và kiên nhẫn có thể hiệu quả hơn việc thúc ép.",
       reversedMeaning: "Trì hoãn / Thiếu chăm sóc",
       reversedAdvice: "đừng thúc ép điều mới nảy mầm khi nó chưa đủ chăm sóc. Hãy quay lại chú ý những gì đang bị bỏ bê trong {subject}.",
   ```
   Lưu ý: dòng `advice` này trùng với **Ingwaz** (rune đối xứng, không sửa) — dùng kèm dòng
   `interpretation` phía trên để `old_string` là duy nhất, và **không** sửa Ingwaz.

   **Ehwaz** — sửa:
   ```ts
       interpretation: "Sự tiến bộ và thành công sẽ đến từ tinh thần cộng tác, sự tin tưởng lẫn nhau giữa những người bạn đồng hành chung chí hướng.",
       advice: "hãy xem đây là một hành trình, không chỉ là một quyết định đơn lẻ. Một bước nhỏ được kiểm chứng cẩn thận có giá trị hơn câu trả lời hoàn hảo.",
   ```
   thành:
   ```ts
       interpretation: "Sự tiến bộ và thành công sẽ đến từ tinh thần cộng tác, sự tin tưởng lẫn nhau giữa những người bạn đồng hành chung chí hướng.",
       advice: "hãy xem đây là một hành trình, không chỉ là một quyết định đơn lẻ. Một bước nhỏ được kiểm chứng cẩn thận có giá trị hơn câu trả lời hoàn hảo.",
       reversedMeaning: "Rạn nứt / Mất lòng tin",
       reversedAdvice: "hãy xem lại sự tin tưởng trong mối đồng hành — có thể đang rạn nứt mà bạn chưa nhận ra. Đừng tiến tiếp khi chưa hàn gắn.",
   ```

   **Mannaz** — sửa:
   ```ts
       interpretation: "Hãy nhìn nhận lại vị trí của bản thân trong tập thể. Trí tuệ lớn nằm ở sự thấu hiểu chính mình và kết nối sâu sắc với đồng loại.",
       advice: "hãy tính đến yếu tố con người. Câu hỏi quan trọng là điều này ảnh hưởng thế nào đến niềm tin, cộng đồng và cảm nhận của bạn về chính mình.",
   ```
   thành:
   ```ts
       interpretation: "Hãy nhìn nhận lại vị trí của bản thân trong tập thể. Trí tuệ lớn nằm ở sự thấu hiểu chính mình và kết nối sâu sắc với đồng loại.",
       advice: "hãy tính đến yếu tố con người. Câu hỏi quan trọng là điều này ảnh hưởng thế nào đến niềm tin, cộng đồng và cảm nhận của bạn về chính mình.",
       reversedMeaning: "Cô lập / Xung đột nội tâm",
       reversedAdvice: "hãy chú ý cảm giác cô lập hoặc xung đột nội tâm đang diễn ra. {name} ngược nhắc bạn nhìn lại vị trí của mình trong tập thể trước khi hành động.",
   ```

   **Laguz** — sửa:
   ```ts
       interpretation: "Hãy để bản thân trôi theo dòng chảy tự nhiên, lắng nghe tiếng nói của trực giác và cảm xúc để tìm ra câu trả lời thay vì dùng lý trí khiên cưỡng.",
       advice: "hãy lắng nghe dòng cảm xúc bên dưới. Khả năng thích nghi và trực giác là một phần của câu trả lời, không phải thứ gây nhiễu.",
   ```
   thành:
   ```ts
       interpretation: "Hãy để bản thân trôi theo dòng chảy tự nhiên, lắng nghe tiếng nói của trực giác và cảm xúc để tìm ra câu trả lời thay vì dùng lý trí khiên cưỡng.",
       advice: "hãy lắng nghe dòng cảm xúc bên dưới. Khả năng thích nghi và trực giác là một phần của câu trả lời, không phải thứ gây nhiễu.",
       reversedMeaning: "Hỗn loạn cảm xúc / Trốn tránh",
       reversedAdvice: "đừng để cảm xúc hỗn loạn cuốn bạn đi mà không kiểm soát. Hãy dừng lại trước khi trực giác trở thành sự trốn tránh thực tế trong {subject}.",
   ```

4. Chạy: `npm run test`
   Kỳ vọng: tất cả pass (`16 passed`).
5. Chạy: `npm run lint` và `npm run build` — kỳ vọng không lỗi.
6. Commit: `git add src/data/runes.ts src/data/runes.test.ts && git commit -m "Add reversed meaning and advice content for the 16 non-symmetric runes"`

## Task 4 — `RandomPullTab.tsx` dùng `DrawnRune`

**Modify**: `d:\runes-main\src\components\RandomPullTab.tsx`

1. Thay toàn bộ nội dung file bằng:

```tsx
import { useState } from 'react';
import { Rune, interpolateAdvice, pickRandomRunes, rollOrientation } from '../data/runes';
import FlipCard from './FlipCard';
import StarMist from './StarMist';

type RuneCount = 'one' | 'two' | 'three' | 'five';

interface DrawnRune {
  rune: Rune;
  isReversed: boolean;
}

const spreadPositions: Record<RuneCount, string[]> = {
  one: ['Thông điệp chính'],
  two: ['Điều cần chú ý', 'Cách nên phản hồi'],
  three: ['Ảnh hưởng quá khứ', 'Tình huống hiện tại', 'Bước tiếp theo'],
  five: ['Gốc rễ vấn đề', 'Thử thách', 'Sự hỗ trợ ẩn', 'Hành động nên làm', 'Xu hướng sắp tới']
};

const getRuneCountNumber = (count: RuneCount) => (
  count === 'one' ? 1 : count === 'two' ? 2 : count === 'three' ? 3 : 5
);

interface RandomPullTabProps {
  isMobile: boolean;
}

/** Tab "Tiên đoán": nhập câu hỏi, rút 1/2/3/5 lá rune (có thể ngược), lật từng lá để xem lời khuyên. */
function RandomPullTab({ isMobile }: RandomPullTabProps) {
  const [horizontalRuneCount, setHorizontalRuneCount] = useState<RuneCount>('one');
  const [horizontalPulledRunes, setHorizontalPulledRunes] = useState<DrawnRune[]>([]);
  const [revealedCardIndices, setRevealedCardIndices] = useState<number[]>([]);
  const [runeQuestion, setRuneQuestion] = useState('');

  const getMobileOrderedRunes = (draws: DrawnRune[], revealedIndices: number[]) => {
    const indexed = draws.map((draw, index) => ({ draw, index }));
    if (!isMobile || revealedIndices.length === 0) {
      return indexed;
    }

    return [...indexed].sort((a, b) => {
      const aRevealed = revealedIndices.includes(a.index);
      const bRevealed = revealedIndices.includes(b.index);

      if (aRevealed && !bRevealed) return -1;
      if (!aRevealed && bRevealed) return 1;
      if (aRevealed && bRevealed) {
        return revealedIndices.indexOf(b.index) - revealedIndices.indexOf(a.index);
      }
      return a.index - b.index;
    });
  };

  const pullHorizontalRunes = () => {
    const count = getRuneCountNumber(horizontalRuneCount);
    const drawnRunes = pickRandomRunes(count).map((rune) => ({ rune, isReversed: rollOrientation(rune) }));
    setHorizontalPulledRunes(drawnRunes);
    setRevealedCardIndices([]);
  };

  const toggleCardReveal = (index: number) => {
    if (!revealedCardIndices.includes(index)) {
      setRevealedCardIndices([...revealedCardIndices, index]);
    }
  };

  const resetHorizontalRunes = () => {
    setHorizontalPulledRunes([]);
    setRevealedCardIndices([]);
    setRuneQuestion('');
  };

  const selectRuneCount = (count: RuneCount) => {
    setHorizontalRuneCount(count);
    setHorizontalPulledRunes([]);
    setRevealedCardIndices([]);
  };

  const getQuestionContext = () => {
    const question = runeQuestion.trim();
    if (!question) {
      return {
        subject: 'tình huống của bạn',
        prompt: 'Tập trung trong tâm tưởng một câu hỏi trước khi xin lời khuyên'
      };
    }
    return {
      subject: question,
      prompt: `Cốt lõi câu hỏi: "${question}"`
    };
  };

  const getAdviceText = (draw: DrawnRune, index: number) => {
    const positions = spreadPositions[horizontalRuneCount];
    const position = positions[index] || `Rune ${index + 1}`;
    const { subject } = getQuestionContext();
    return `${position}: ${interpolateAdvice(draw.rune, subject, draw.isReversed)}`;
  };

  return (
    <div style={{ maxWidth: '1500px', marginLeft: 'auto', marginRight: 'auto', textAlign: 'center', position: 'relative' }}>
      <StarMist />
      <div style={{ position: 'relative', zIndex: 1 }}>

      <div style={{
        display: 'flex',
        flexDirection: isMobile ? 'column' : 'row',
        gap: '1.25rem',
        width: '100%',
        maxWidth: '1150px',
        margin: '0 auto 0.75rem auto',
        alignItems: 'center',
        justifyContent: 'center'
      }}>

        {/* CỘT BÊN TRÁI: Lựa chọn 1 Rune và 2 Runes xếp chồng dọc */}
        <div style={{
          display: 'flex',
          flexDirection: isMobile ? 'row' : 'column',
          gap: '0.6rem',
          minWidth: isMobile ? '100%' : '120px',
          justifyContent: 'center'
        }}>
          {(['one', 'two'] as const).map((count) => (
            <button
              key={count}
              onClick={() => selectRuneCount(count)}
              style={{
                background: horizontalRuneCount === count ? 'linear-gradient(145deg, #2c3e50, #1a252f)' : 'linear-gradient(145deg, #1a1d24, #0e1117)',
                color: '#e8f4fd', border: horizontalRuneCount === count ? '1px solid #63b3ed' : '1px solid rgba(99, 179, 237, 0.2)',
                borderRadius: '8px', padding: '0.6rem 1rem', fontSize: '1rem', cursor: 'pointer', transition: 'all 0.2s ease',
                width: isMobile ? 'auto' : '100%', flex: 1, height: '44px', display: 'flex', alignItems: 'center', justifyContent: 'center'
              }}
            >
              {count === 'one' ? '1 Rune' : '2 Runes'}
            </button>
          ))}
        </div>

        {/* KHỐI TRUNG TÂM: Ô nhập câu hỏi + Nút Tiên đoán */}
        <div style={{
          flex: 2, background: 'linear-gradient(145deg, #181c24, #0a0d12)',
          border: '1px solid rgba(99, 179, 237, 0.15)', borderRadius: '12px', padding: '0.75rem 1.5rem',
          boxShadow: '0 6px 20px rgba(0, 0, 0, 0.5)', width: '100%', boxSizing: 'border-box',
          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.4rem'
        }}>
          <label htmlFor="rune-question" style={{ display: 'block', width: '100%', textAlign: 'center', color: '#e8f4fd', fontSize: '1.1rem', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
            Xin lời khuyên từ các cổ tự Rune
          </label>
          <textarea
            id="rune-question"
            value={runeQuestion}
            onChange={(e) => setRuneQuestion(e.target.value)}
            placeholder="Lời thỉnh cầu hoặc vấn đề thầm kín mà bạn muốn xin chỉ dẫn..."
            rows={2}
            style={{
              width: '100%', resize: 'none', minHeight: '52px', padding: '0.5rem 0.8rem',
              background: 'linear-gradient(145deg, #12151c, #0a0c10)', border: '1px solid rgba(99, 179, 237, 0.2)',
              borderRadius: '8px', color: '#e8f4fd', fontSize: '0.95rem', fontFamily: 'Inter, sans-serif', lineHeight: 1.4, outline: 'none', boxSizing: 'border-box'
            }}
          />
          <p style={{ color: '#b8d4e6', fontSize: '0.92rem', fontStyle: 'italic', fontFamily: 'Inter, sans-serif', margin: '0.15rem 0' }}>
            {getQuestionContext().prompt}
          </p>

          {horizontalPulledRunes.length === 0 ? (
            <button className="pull-button" style={{ background: 'linear-gradient(145deg, #3182ce, #2b6cb0)', fontSize: '1.05rem', height: '40px', padding: '0 2.5rem', borderRadius: '8px', color: '#fff', cursor: 'pointer', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: '0.2rem' }} onClick={pullHorizontalRunes}>
              Tiên đoán
            </button>
          ) : (
            <button
              className="pull-button"
              style={{ background: 'linear-gradient(145deg, #2d3748, #1a202c)', border: '1px solid rgba(99, 179, 237, 0.4)', fontSize: '1.05rem', height: '40px', padding: '0 2.5rem', borderRadius: '8px', color: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: '0.2rem' }}
              onClick={resetHorizontalRunes}
            >
              Bắt đầu lại
            </button>
          )}
        </div>

        {/* CỘT BÊN PHẢI: Lựa chọn 3 Runes và 5 Runes xếp chồng dọc */}
        <div style={{
          display: 'flex',
          flexDirection: isMobile ? 'row' : 'column',
          gap: '0.6rem',
          minWidth: isMobile ? '100%' : '120px',
          justifyContent: 'center'
        }}>
          {(['three', 'five'] as const).map((count) => (
            <button
              key={count}
              onClick={() => selectRuneCount(count)}
              style={{
                background: horizontalRuneCount === count ? 'linear-gradient(145deg, #2c3e50, #1a252f)' : 'linear-gradient(145deg, #1a1d24, #0e1117)',
                color: '#e8f4fd', border: horizontalRuneCount === count ? '1px solid #63b3ed' : '1px solid rgba(99, 179, 237, 0.2)',
                borderRadius: '8px', padding: '0.6rem 1rem', fontSize: '1rem', cursor: 'pointer', transition: 'all 0.2s ease',
                width: isMobile ? 'auto' : '100%', flex: 1, height: '44px', display: 'flex', alignItems: 'center', justifyContent: 'center'
              }}
            >
              {count === 'three' ? '3 Runes' : '5 Runes'}
            </button>
          ))}
        </div>

      </div>

      {/* HÀNG BÀI TIÊN ĐOÁN */}
      <div style={{
        display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center',
        gap: '0.75rem', marginTop: '0.5rem', marginBottom: '0.5rem', width: '100%',
        flexWrap: isMobile ? 'wrap' : 'nowrap', overflowX: 'auto', padding: '0.25rem'
      }}>
        {getMobileOrderedRunes(horizontalPulledRunes, revealedCardIndices).map(({ draw, index }) => {
          const positions = spreadPositions[horizontalRuneCount];
          const position = positions[index] || `Rune ${index + 1}`;
          return (
            <FlipCard
              key={index}
              rune={draw.rune}
              isReversed={draw.isReversed}
              position={position}
              adviceText={getAdviceText(draw, index)}
              isRevealed={revealedCardIndices.includes(index)}
              onReveal={() => toggleCardReveal(index)}
            />
          );
        })}
      </div>
      </div>
    </div>
  );
}

export default RandomPullTab;
```

2. Chạy: `npm run build`
   Kỳ vọng: lỗi TypeScript — `FlipCard` chưa có prop `isReversed` (sẽ sửa ở Task 5). Đây là kỳ
   vọng đúng ở bước này, KHÔNG commit khi build đang lỗi — làm tiếp Task 5 trước rồi mới build
   lại.

## Task 5 — `FlipCard.tsx` hiển thị trạng thái ngược

**Modify**: `d:\runes-main\src\components\FlipCard.tsx`

1. Thay toàn bộ nội dung file bằng:

```tsx
import { KeyboardEvent } from 'react';
import { Rune } from '../data/runes';
import RuneAnnotations from './RuneAnnotations';

interface FlipCardProps {
  rune: Rune;
  isReversed: boolean;
  position: string;
  adviceText: string;
  isRevealed: boolean;
  onReveal: () => void;
}

/** Một lá bài rune có thể lật (3D flip) — mặt trước ẩn danh, mặt sau hiện ký hiệu (xoay nếu ngược) + lời khuyên. */
function FlipCard({ rune, isReversed, position, adviceText, isRevealed, onReveal }: FlipCardProps) {
  const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onReveal();
    }
  };

  return (
    <div className={`flip-card-container ${isRevealed ? 'is-revealed' : ''}`}>
      <div className="flip-card-inner">

        {/* MẶT TRƯỚC: TRẠNG THÁI ẨN, CLICK/ENTER/SPACE ĐỂ LẬT MỞ */}
        <div
          className="flip-card-front"
          role="button"
          tabIndex={isRevealed ? -1 : 0}
          aria-label={`Lật mở lá bài ẩn ở vị trí ${position}`}
          aria-pressed={isRevealed}
          onClick={() => !isRevealed && onReveal()}
          onKeyDown={handleKeyDown}
        >
          <span className="rune-symbol" style={{ fontSize: '3.5rem', opacity: 0.12, marginBottom: '1rem' }}>?</span>
          <h3 className="rune-name" style={{ fontSize: '1.4rem', opacity: 0.2, marginBottom: '0.5rem', fontFamily: 'Cormorant Garamond' }}>Ẩn tự</h3>
          <p style={{ fontSize: '0.85rem', color: '#718096', fontStyle: 'italic', fontFamily: 'Inter' }}>Chạm để lật mở</p>
        </div>

        {/* MẶT SAU: HIỆU ỨNG XOAY LẬT 3D CHỐNG TRÀN CHỮ */}
        <div className="flip-card-back" onClick={(e) => e.stopPropagation()}>
          <div style={{
            marginBottom: '0.35rem', padding: '0.2rem 0.6rem', border: '1px solid rgba(136, 192, 208, 0.35)',
            borderRadius: '999px', color: '#d7ecfb', fontSize: '0.78rem', fontFamily: 'Cormorant Garamond, serif',
            letterSpacing: '0.08em', textTransform: 'uppercase'
          }}>
            {position}
          </div>
          <span
            className="rune-symbol"
            style={{
              fontSize: '2.8rem', marginBottom: '0.2rem', textShadow: '0 0 15px rgba(136,192,208,0.6)',
              display: 'inline-block', transform: isReversed ? 'rotate(180deg)' : 'none'
            }}
          >
            {rune.symbol}
          </span>
          <h3 className="rune-name" style={{ fontSize: '1.2rem', marginBottom: '0.15rem', fontFamily: 'Cormorant Garamond, serif', letterSpacing: '0.04em' }}>
            {rune.name}{isReversed ? ' (Ngược)' : ''}
          </h3>
          <p className="rune-meaning" style={{ fontSize: '0.9rem', marginBottom: '0.4rem', color: '#81a1c1' }}>
            <strong>{isReversed && rune.reversedMeaning ? rune.reversedMeaning : rune.meaning}</strong>
          </p>

          <RuneAnnotations rune={rune} />

          <div className="flip-card-scroll-zone">
            <p style={{ fontSize: '0.82rem', lineHeight: '1.45', color: '#cbd5e0', textAlign: 'justify', margin: '0 0 0.4rem 0', fontFamily: 'Inter, sans-serif' }}>
              {rune.description}
            </p>
            <p style={{
              fontSize: '0.85rem', lineHeight: '1.45', paddingTop: '0.4rem', borderTop: '1px solid rgba(232, 244, 253, 0.12)',
              color: '#d7ecfb', fontStyle: 'italic', textAlign: 'justify', fontFamily: 'Inter, sans-serif', margin: 0
            }}>
              {adviceText}
            </p>
          </div>
        </div>

      </div>

      {isRevealed && (
        <div className="resonance" aria-hidden="true">
          <span className="resonance-ring" />
          <span className="resonance-ring resonance-ring--delay-1" />
          <span className="resonance-ring resonance-ring--delay-2" />
        </div>
      )}
    </div>
  );
}

export default FlipCard;
```

   Lưu ý: khối `{isRevealed && (<div className="resonance">...)}` ở cuối là hiệu ứng Cộng Hưởng
   đã có từ trước (không đổi) — chỉ thêm `isReversed` vào props, symbol, tên, và dòng ý nghĩa.

2. Chạy: `npm run build`
   Kỳ vọng: build thành công (không còn lỗi thiếu prop `isReversed` từ Task 4).
3. Chạy: `npm run test`
   Kỳ vọng: `16 passed` (không có test nào động tới FlipCard trực tiếp, nhưng xác nhận không có
   gì vỡ).
4. Chạy: `npm run lint` — kỳ vọng không lỗi.
5. Commit: `git add src/components/RandomPullTab.tsx src/components/FlipCard.tsx && git commit -m "Wire reversed rune orientation through RandomPullTab and FlipCard"`

## Task 6 — Hiển thị ý nghĩa ngược trong Từ điển

**Modify**: `d:\runes-main\src\components\tabs\DictionaryTab.tsx`

1. Sửa từ:
   ```tsx
             <p className="rune-meaning" style={{ margin: '0 0 0.75rem 0', fontSize: '1.05rem' }}>
               <strong>{rune.meaning}</strong>
             </p>
             <RuneAnnotations rune={rune} />
   ```
   thành:
   ```tsx
             <p className="rune-meaning" style={{ margin: '0 0 0.75rem 0', fontSize: '1.05rem' }}>
               <strong>{rune.meaning}</strong>
             </p>
             {rune.reversedMeaning && (
               <p style={{ fontSize: '0.85rem', color: '#7a92a8', fontStyle: 'italic', margin: '0 0 0.75rem 0' }}>
                 Khi ngược: {rune.reversedMeaning}
               </p>
             )}
             <RuneAnnotations rune={rune} />
   ```
2. Chạy: `npm run build` — kỳ vọng thành công.
3. Chạy: `npm run dev`, vào tab Từ điển, kiểm tra bằng mắt: 16 rune có dòng in nghiêng "Khi
   ngược: …" dưới ý nghĩa xuôi; 8 rune đối xứng (Gebo, Hagalaz, Isa, Jera, Eihwaz, Ingwaz,
   Dagaz, Othala) không có dòng này. Dừng server.
4. Commit: `git add src/components/tabs/DictionaryTab.tsx && git commit -m "Show reversed meaning in DictionaryTab for reversible runes"`

## Task 7 — Kiểm tra tổng thể

1. Chạy tuần tự, tất cả phải pass: `npm run build`, `npm run lint`, `npm run test` (kỳ vọng
   `16 passed`).
2. Chạy `npm run dev`, kiểm tra bằng mắt trên trình duyệt:
   - Tab Tiên đoán: rút quẻ nhiều lần (thử cả 4 chế độ 1/2/3/5), quan sát các lá lật ra — một số
     lá hiện "(Ngược)" kèm symbol xoay 180° và ý nghĩa/lời khuyên khác với chiều xuôi; 8 rune đối
     xứng không bao giờ hiện "(Ngược)" dù rút nhiều lần.
   - Tab Từ điển: 16 rune có dòng "Khi ngược: …", 8 rune đối xứng không có.
   - Hiệu ứng Cộng Hưởng (vòng sáng + glow khi lật) vẫn hoạt động bình thường như trước, không
     bị ảnh hưởng bởi thay đổi này.
   Dừng server sau khi kiểm tra.
3. Không tạo commit mới ở bước này nếu không phát hiện vấn đề — đây là bước xác nhận cuối cùng.

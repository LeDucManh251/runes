# Rune Ngược (Merkstave)

## Bối cảnh

App hiện chỉ rút rune ở chiều xuôi. Hầu hết app/tài liệu đọc rune truyền thống có khái niệm
"rune ngược" (merkstave) — khi rút được rune ở chiều đảo, ý nghĩa mang sắc thái bị chặn/nội
tại/đối nghịch so với chiều xuôi. Đây là tính năng thiếu rõ nhất so với chuẩn thể loại bói rune,
và cấu trúc dữ liệu hiện có (`Rune.advice` dùng placeholder `{subject}`/`{name}`) đã sẵn sàng để
mở rộng theo cùng pattern.

Không nằm trong phạm vi: đổi tab Bindrunes/Wyrd/History, UI cấu hình tỉ lệ % ngược (cố định
50%), ảnh minh họa riêng cho chiều ngược.

## Phần 1 — Data model

Trong `src/data/runes.ts`, mở rộng interface `Rune`:

```ts
export interface Rune {
  id: string;
  symbol: string;
  name: string;
  meaning: string;
  description: string;
  interpretation: string;
  advice: string;
  annotations?: Annotation[];
  /** Ý nghĩa ngắn khi rune rút được ở chiều ngược (merkstave). Không có nghĩa là rune này
   * đối xứng — không bao giờ ra ngược. */
  reversedMeaning?: string;
  /** Mẫu lời khuyên khi ngược, cùng placeholder {subject}/{name} như `advice`. */
  reversedAdvice?: string;
}
```

8 rune có hình dạng đối xứng theo quy ước phổ biến trong truyền thống đọc rune (không phải mọi
trường phái đồng thuận 100%, nhưng đây là danh sách phổ biến nhất) — **không** có
`reversedMeaning`/`reversedAdvice`, tức luôn ra xuôi: **Gebo, Hagalaz, Isa, Jera, Eihwaz,
Ingwaz, Dagaz, Othala**.

16 rune còn lại có đủ 2 field, nội dung cụ thể liệt kê ở Phần 4.

Thêm 2 hàm helper vào cuối `runes.ts`:

```ts
/** Một rune có ý nghĩa ngược riêng hay không (rune đối xứng thì không). */
export const isReversible = (rune: Rune): boolean => Boolean(rune.reversedMeaning);

/** Random chiều rút cho 1 rune — rune đối xứng luôn ra xuôi, rune còn lại 50/50. */
export const rollOrientation = (rune: Rune): boolean => {
  if (!isReversible(rune)) return false;
  return Math.random() < 0.5;
};
```

## Phần 2 — Cơ chế rút quẻ

Trong `src/components/RandomPullTab.tsx`:

- Thêm type `DrawnRune = { rune: Rune; isReversed: boolean }`.
- `pullHorizontalRunes` đổi từ `pickRandomRunes(count)` (trả về `Rune[]`) sang:
  ```ts
  pickRandomRunes(count).map((rune) => ({ rune, isReversed: rollOrientation(rune) }))
  ```
  → state `horizontalPulledRunes` đổi type từ `Rune[]` thành `DrawnRune[]`.
- `interpolateAdvice` trong `runes.ts` thêm tham số thứ 3 `isReversed: boolean = false`:
  ```ts
  export const interpolateAdvice = (rune: Rune, subject: string, isReversed: boolean = false): string => {
    const template = (isReversed ? rune.reversedAdvice : undefined)
      ?? rune.advice
      ?? `hãy liên hệ ý nghĩa của {name} với {subject}. Hãy để rune gợi ra hành động trung thực kế tiếp, thay vì một lời tiên đoán cố định.`;
    return template.replace(/\{subject\}/g, subject).replace(/\{name\}/g, rune.name);
  };
  ```
- `getAdviceText(drawn: DrawnRune, index)` truyền `drawn.isReversed` vào `interpolateAdvice`.
- Mọi chỗ khác đang dùng `rune.id`/`rune.symbol` trên phần tử của `horizontalPulledRunes` (ví
  dụ `getMobileOrderedRunes`) đổi sang truy cập qua `.rune` (ví dụ `item.rune.id` thay vì
  `item.id` — cấu trúc index vẫn giữ nguyên, chỉ bọc thêm 1 lớp `DrawnRune`).

## Phần 3 — Hiển thị

**`FlipCard.tsx`**: thêm prop `isReversed: boolean`.
- Symbol ở mặt sau (`<span className="rune-symbol">`) thêm `transform: rotate(180deg)` vào
  style inline khi `isReversed`.
- Thêm nhãn nhỏ "(Ngược)" ngay sau `rune.name` trong `<h3 className="rune-name">` khi
  `isReversed` (ví dụ: `{rune.name}{isReversed ? ' (Ngược)' : ''}`).
- `adviceText` (prop có sẵn, được tính từ `RandomPullTab`) đã tự động dùng đúng template nhờ
  Phần 2, không cần đổi gì thêm trong `FlipCard`.

**`DictionaryTab.tsx`**: với rune có `reversedMeaning`, hiển thị thêm 1 dòng dưới
`<p className="rune-meaning">` hiện có:
```tsx
{rune.reversedMeaning && (
  <p style={{ fontSize: '0.85rem', color: '#7a92a8', fontStyle: 'italic', margin: '0 0 0.75rem 0' }}>
    Khi ngược: {rune.reversedMeaning}
  </p>
)}
```
8 rune đối xứng không hiển thị gì thêm.

## Phần 4 — Nội dung 16 rune có thể ra ngược

| Rune | reversedMeaning | reversedAdvice |
|---|---|---|
| Fehu | Mất mát / Bám giữ quá chặt | "hãy xem lại nơi bạn đang bám giữ quá chặt. {subject} có thể cần bạn buông bớt kiểm soát tài chính hoặc vật chất thay vì tích trữ thêm." |
| Uruz | Suy nhược / Mất kiểm soát | "đừng ép cơ thể hoặc ý chí vượt quá giới hạn. {name} ngược nhắc bạn nghỉ ngơi trước khi kiệt sức ảnh hưởng đến quyết định." |
| Thurisaz | Hung hăng thái quá / Mất cảnh giác | "hãy xem lại ranh giới bạn đang dựng lên — có thể đang quá hung hăng hoặc quá lỏng lẻo. Đừng phản ứng khi chưa thật sự cần phòng thủ." |
| Ansuz | Hiểu lầm / Lời nói sai lệch | "hãy cẩn trọng với lời nói xung quanh {subject} — có thể đang có hiểu lầm hoặc thông tin chưa chính xác. Đừng vội tin lời khuyên đầu tiên bạn nghe được." |
| Raidho | Trì trệ / Lạc lối | "hãy chấp nhận rằng hành trình đang chững lại. Đừng ép bước tiếp khi con đường chưa thật sự rõ ràng." |
| Kenaz | Cạn kiệt cảm hứng / Mù mờ | "hãy thắp lại ngọn lửa cảm hứng đã tắt trước khi cố tìm câu trả lời. {name} ngược cho thấy bạn cần nghỉ để nhìn rõ lại vấn đề." |
| Wunjo | Bất hòa / Thất vọng | "đừng gượng ép niềm vui khi lòng chưa thật sự yên. Hãy thành thật nhìn nhận điều đang gây bất hòa trong {subject}." |
| Naudhiz | Tự trói buộc / Bất lực | "hãy xem lại giới hạn bạn tự đặt ra cho chính mình — có thể đang trói buộc bạn nhiều hơn cần thiết. Đừng nhầm lẫn sự thiếu thốn với sự bất lực." |
| Perthro | Bế tắc / Bí mật chưa lộ diện | "có điều gì đó đang bị giấu kín hoặc chưa sẵn sàng lộ diện. Đừng cố ép buộc một câu trả lời khi vận may chưa đứng về phía bạn." |
| Algiz | Mất cảnh giác / Tổn thương | "hãy cẩn trọng — lớp phòng vệ quanh {subject} có thể đang lỏng lẻo hơn bạn nghĩ. Đừng hạ thấp cảnh giác quá sớm." |
| Sowilo | Ảo tưởng / Kiêu ngạo | "hãy nhìn lại xem thành công đang thấy có thực sự vững chắc hay chỉ là ảo tưởng nhất thời. Đừng để sự tự tin biến thành kiêu ngạo." |
| Tiwaz | Bất công / Niềm tin đặt sai chỗ | "hãy xem lại liệu bạn có đang hy sinh quá nhiều cho một nguyên tắc không còn công bằng. {name} ngược cảnh báo về niềm tin bị đặt sai chỗ." |
| Berkano | Trì hoãn / Thiếu chăm sóc | "đừng thúc ép điều mới nảy mầm khi nó chưa đủ chăm sóc. Hãy quay lại chú ý những gì đang bị bỏ bê trong {subject}." |
| Ehwaz | Rạn nứt / Mất lòng tin | "hãy xem lại sự tin tưởng trong mối đồng hành — có thể đang rạn nứt mà bạn chưa nhận ra. Đừng tiến tiếp khi chưa hàn gắn." |
| Mannaz | Cô lập / Xung đột nội tâm | "hãy chú ý cảm giác cô lập hoặc xung đột nội tâm đang diễn ra. {name} ngược nhắc bạn nhìn lại vị trí của mình trong tập thể trước khi hành động." |
| Laguz | Hỗn loạn cảm xúc / Trốn tránh | "đừng để cảm xúc hỗn loạn cuốn bạn đi mà không kiểm soát. Hãy dừng lại trước khi trực giác trở thành sự trốn tránh thực tế trong {subject}." |

## Phần 5 — Test

Trong `src/data/runes.test.ts`, thêm:
- `rollOrientation` trên rune đối xứng (ví dụ Gebo) luôn trả `false`, kiểm tra bằng cách mock
  `Math.random` trả về `0` (giá trị chắc chắn sẽ ra `true` nếu không có logic loại trừ).
- `rollOrientation` trên rune có thể ngược (ví dụ Fehu) trả đúng `true`/`false` tương ứng khi
  mock `Math.random` trả `0` và `0.9`.
- `interpolateAdvice(rune, subject, true)` dùng đúng `reversedAdvice` khi rune có field này;
  `interpolateAdvice(rune, subject, true)` fallback về `advice` khi rune không có
  `reversedAdvice` (rune đối xứng).

## Rủi ro & lưu ý

- Danh sách 8 rune đối xứng là quy ước phổ biến, không phải chuẩn tuyệt đối — nếu sau này có
  phản hồi từ người dùng am hiểu rune học muốn điều chỉnh danh sách, đây là nơi duy nhất cần sửa
  (`reversedMeaning`/`reversedAdvice` có hoặc không trên từng rune trong `runes.ts`).
- `horizontalPulledRunes` đổi type từ `Rune[]` sang `DrawnRune[]` — cần rà soát toàn bộ chỗ dùng
  biến này trong `RandomPullTab.tsx` (đã liệt kê ở Phần 2), tránh sót chỗ truy cập trực tiếp
  `.id`/`.symbol` thay vì `.rune.id`/`.rune.symbol`.

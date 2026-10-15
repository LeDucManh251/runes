# Viết tên bằng Rune

## Bối cảnh

App hiện chỉ có một tương tác chính là rút bài tiên đoán. Rune vốn là một bảng chữ cái thật
(được dùng để viết, khắc, ký tên), nên tính năng "gõ tên → thấy tên mình viết bằng rune" vừa
đúng bản chất của rune, vừa tạo ấn tượng ngay, không có ngưỡng cửa (ai cũng có tên để thử), và
là bước đệm cho bindrune cá nhân sau này.

Elder Futhark ghi **âm** của tiếng Germanic cổ, nên mọi cách viết ngôn ngữ hiện đại bằng rune
đều là **phiên âm gần đúng**. Tính năng phải nói rõ điều này với người dùng.

Không nằm trong phạm vi: ghép bindrune, xuất ảnh/thẻ chia sẻ, tự chuyển chữ không phải Latin
(Hán, Kana, Kirin…) sang Latin, quy tắc theo âm cho ngôn ngữ khác ngoài tiếng Việt và tiếng
Anh, lưu lại tên đã nhập giữa các lần mở app.

## Phần 1 — Logic phiên âm (`src/data/transliterate.ts`)

Hàm thuần, không phụ thuộc React:

```ts
export type WritingMode = 'vi' | 'en' | 'letters';

export type TranslitToken =
  | { kind: 'rune'; runeId: string; source: string }  // source: chữ gốc sinh ra rune này, vd "ngh"
  | { kind: 'separator' }                             // ranh giới giữa hai từ
  | { kind: 'skipped'; source: string };              // ký tự không có rune tương ứng (số, dấu câu…)

export function transliterate(text: string, mode: WritingMode): TranslitToken[];
```

Quy tắc ánh xạ trỏ tới `runeId` (vd `'ingwaz'`), không trỏ thẳng tới ký tự Unicode, để ký hiệu
hiển thị luôn khớp với `runes.ts`.

### Các bước xử lý

1. **Chuẩn hóa:** chữ thường.
   - Chế độ `vi`: bỏ **dấu thanh** (huyền, sắc, ngã, hỏi, nặng) nhưng giữ dấu biến đổi nguyên âm
     (ă, â, ê, ô, ơ, ư) và giữ `đ`.
   - Chế độ `en` và `letters`: bỏ mọi dấu phụ (é → e, ñ → n…), `đ` → `d`.
2. **Tách từ** theo khoảng trắng và dấu gạch ngang. Giữa hai từ liền kề sinh một token
   `separator`. Khoảng trắng thừa ở đầu, cuối, giữa bị bỏ qua.
3. **Quét từng từ** từ trái sang phải. Tại mỗi vị trí, thử các quy tắc của chế độ hiện tại
   theo thứ tự **cụm dài trước** (3 chữ → 2 chữ → 1 chữ). Quy tắc có thể kèm điều kiện:
   - `atEnd`: cụm phải nằm ở cuối từ;
   - `atStart`: cụm phải nằm ở đầu từ;
   - `followedBy`: chữ ngay sau cụm phải thuộc tập cho trước.
4. Chữ không khớp quy tắc nào của chế độ `vi`/`en` thì dùng **bảng theo chữ cái** (phần 1.3).
   Nếu vẫn không có (số, ký hiệu, chữ không phải Latin) → token `skipped`.
5. **Gộp rune trùng liền kề** trong cùng một từ (chỉ ở chế độ `vi` và `en`), theo lối khắc
   cổ không viết đôi phụ âm, vd "Anna" → ᚨᚾᚨ. `source` của rune được gộp nối lại ("n" + "n" →
   "nn"). Chế độ `letters` không gộp.

### 1.1 — Tiếng Việt theo âm (`vi`)

Phụ âm, xếp theo thứ tự ưu tiên khi so khớp:

| Chữ | Điều kiện | Rune | Ghi chú |
|---|---|---|---|
| ngh | | ᛜ ingwaz | |
| ng | | ᛜ ingwaz | |
| nh | cuối từ | ᛁᛜ isa + ingwaz | "Anh" đọc gần "ai-ng" |
| nh | | ᚾᛃ naudhiz + jera | âm "ny" |
| ch | cuối từ | ᛁᚲ isa + kenaz | "Bách" đọc gần "bai-k" |
| ch | | ᛏᛃ tiwaz + jera | âm "ty" |
| tr | | ᛏᚱ tiwaz + raidho | |
| th | | ᛏᚺ tiwaz + hagalaz | t bật hơi, **không** phải ᚦ (âm "th" tiếng Anh) |
| ph | | ᚠ fehu | |
| kh | | ᚲᚺ kenaz + hagalaz | |
| gh | | ᚷ gebo | |
| gi | trước nguyên âm | ᛃ jera | "Giang" |
| gi | | ᛃᛁ jera + isa | "gìn", "gì" |
| qu | | ᚲᚹ kenaz + wunjo | |
| d | | ᛉ algiz | đọc như "z" |
| đ | | ᛞ dagaz | |
| v | | ᚹ wunjo | |
| x | | ᛋ sowilo | đọc như "s" |
| c, k | | ᚲ kenaz | |
| b g h l m n p r s t | | ᛒ ᚷ ᚺ ᛚ ᛗ ᚾ ᛈ ᚱ ᛋ ᛏ | như bảng chữ cái |

Nguyên âm bỏ dấu biến đổi về nguyên âm gốc:

| Chữ | Rune |
|---|---|
| a, ă, â | ᚨ ansuz |
| e, ê | ᛖ ehwaz |
| i, y | ᛁ isa |
| o, ô, ơ | ᛟ othala |
| u, ư | ᚢ uruz |

Tập nguyên âm cho điều kiện "trước nguyên âm": `a ă â e ê i o ô ơ u ư y`.

Ví dụ kỳ vọng (cũng là test case):

| Nhập | Kết quả |
|---|---|
| Nguyễn | ᛜᚢᛁᛖᚾ |
| Minh | ᛗᛁᛜ (m + i + "nh" cuối → ᛁᛜ, gộp ᛁᛁ) |
| Anh | ᚨᛁᛜ |
| Thảo | ᛏᚺᚨᛟ |
| Giang | ᛃᚨᛜ |
| Quỳnh | ᚲᚹᛁᛜ |
| Đức | ᛞᚢᚲ |
| Chi | ᛏᛃᛁ |
| Nhung | ᚾᛃᚢᛜ |
| Dũng | ᛉᚢᛜ |
| Xuân | ᛋᚢᚨᚾ |
| Bích | ᛒᛁᚲ |

### 1.2 — Tiếng Anh theo âm (`en`)

| Chữ | Điều kiện | Rune |
|---|---|---|
| th | | ᚦ thurisaz |
| ng | | ᛜ ingwaz |
| ph | | ᚠ fehu |
| sh | | ᛋ sowilo |
| ch, ck | | ᚲ kenaz |
| qu | | ᚲᚹ kenaz + wunjo |
| wh | | ᚹ wunjo |
| ee | | ᛁ isa |
| oo | | ᚢ uruz |
| c | trước e, i, y | ᛋ sowilo |
| c | | ᚲ kenaz |
| j | | ᛃ jera |
| v | | ᚠ fehu |
| x | | ᚲᛋ kenaz + sowilo |
| y | đầu từ, trước nguyên âm | ᛃ jera |
| y | | ᛁ isa |

Chữ còn lại theo bảng chữ cái. Ví dụ kỳ vọng: Thor → ᚦᛟᚱ, Anna → ᚨᚾᚨ, Grace → ᚷᚱᚨᛋᛖ,
Yasmin → ᛃᚨᛋᛗᛁᚾ, Lily → ᛚᛁᛚᛁ, Max → ᛗᚨᚲᛋ.

### 1.3 — Theo chữ cái (`letters`)

Mỗi chữ Latin → một rune, không xét cụm, không gộp:

| a | b | c | d | e | f | g | h | i | j | k | l | m |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| ᚨ | ᛒ | ᚲ | ᛞ | ᛖ | ᚠ | ᚷ | ᚺ | ᛁ | ᛃ | ᚲ | ᛚ | ᛗ |

| n | o | p | q | r | s | t | u | v | w | x | y | z |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| ᚾ | ᛟ | ᛈ | ᚲ | ᚱ | ᛋ | ᛏ | ᚢ | ᚹ | ᚹ | ᚲᛋ | ᛃ | ᛉ |

Ví dụ: "Minh Anh" → ᛗᛁᚾᚺ ᛫ ᚨᚾᚺ.

## Phần 2 — Giao diện (`src/components/tabs/NameWriterTab.tsx`)

Tab mới **"Viết tên"**, đặt ngay sau "Tiên đoán" trên thanh điều hướng. `TabId` thêm
`'namewriter'`.

Từ trên xuống:

1. **Tiêu đề + một câu giới thiệu:** "Rune là bảng chữ cái cổ của người Bắc Âu. Gõ tên bạn để
   xem nó được khắc bằng rune."
2. **Ô nhập** (`maxLength` 60, có `aria-label`, placeholder "Nhập tên của bạn…").
3. **Chọn cách viết:** ba nút dạng segmented, nút đang chọn có `aria-pressed="true"`:
   "Tiếng Việt" (mặc định), "English", "Theo chữ cái". Dưới đó một dòng mô tả ngắn của chế độ
   đang chọn.
4. **Kết quả:** chuỗi rune cỡ lớn, phát sáng như `.rune-symbol`. Mỗi rune là một `<button>`
   có `aria-label` dạng `Ingwaz, từ "ngh"`. Giữa các từ hiển thị dấu ngắt rune `᛫`.
   - Bấm một rune → bên dưới hiện thẻ nhỏ: ký hiệu, tên, ý nghĩa (`meaning` trong
     `runes.ts`), và "Phiên từ: ngh". Bấm lại rune đó thì đóng thẻ.
   - Đổi tên hoặc đổi chế độ → đóng thẻ.
   - Ô nhập trống → không hiện khu kết quả, chỉ hiện gợi ý thử "Ví dụ: Minh Anh".
5. **Ký tự bị bỏ qua:** nếu có token `skipped`, hiện dòng nhỏ "Không có rune tương ứng, đã bỏ
   qua: 3, @" (mỗi ký tự liệt kê một lần).
6. **Nút "Sao chép"** chép chuỗi rune (các từ nối bằng ` ᛫ `, không kèm ký tự bị bỏ qua) qua
   `navigator.clipboard.writeText`. Thành công → nút đổi thành "Đã sao chép" trong 2 giây.
   Thất bại hoặc trình duyệt không hỗ trợ → hiện "Không sao chép được, hãy bôi đen để chép
   thủ công."
7. **Lưu ý cuối tab:** "Đây là phiên âm gần đúng: rune ghi âm của tiếng Germanic cổ, tiếng
   Việt sẽ mất dấu thanh. Nếu bạn định xăm hoặc khắc, hãy tham khảo thêm."

Style mới viết thành class trong `src/index.css` (không thêm inline style), dùng lại bảng màu
hiện có (`#e8f4fd`, `#88c0d0`, `#63b3ed`, nền gradient tối).

## Phần 3 — Font rune

Hiện app không nạp font nào có ký tự rune, nên rune hiển thị bằng font hệ thống (khác nhau
giữa các máy, máy cũ có thể ra ô vuông). Thêm **Noto Sans Runic** vào dòng `@import` Google
Fonts đầu `src/index.css`, và đặt `'Noto Sans Runic'` đứng đầu `font-family` của `.rune-symbol`
và của class hiển thị rune mới. Google Fonts phục vụ font này kèm `unicode-range` chỉ cho khối
ký tự rune, nên chữ thường (vd dấu "?" trên mặt úp lá bài) vẫn rơi về font kế tiếp trong danh
sách. Thay đổi này cải thiện luôn tab Tiên đoán và Từ điển.

## Phần 4 — Kiểm thử

- `src/data/transliterate.test.ts`:
  - mọi ví dụ kỳ vọng trong phần 1.1, 1.2, 1.3;
  - nhiều từ → có `separator` giữa các từ, khoảng trắng thừa không sinh separator thừa;
  - ký tự số / ký hiệu → token `skipped`, không làm hỏng phần còn lại;
  - chuỗi rỗng / toàn khoảng trắng → mảng rỗng;
  - `source` của token đúng (vd "ngh", và "nn" sau khi gộp);
  - mọi `runeId` sinh ra đều tồn tại trong `runes`.
- `src/components/tabs/NameWriterTab.test.tsx`:
  - gõ "Minh" → hiện các rune đúng thứ tự;
  - đổi sang "Theo chữ cái" → kết quả đổi theo;
  - bấm một rune → hiện tên và ý nghĩa của rune đó;
  - nhập có số → hiện dòng "đã bỏ qua".
- Test `App` hiện có vẫn pass; thêm kiểm tra nav có nút "Viết tên".

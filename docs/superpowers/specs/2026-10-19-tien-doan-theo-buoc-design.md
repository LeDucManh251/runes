# Tab Tiên đoán theo từng bước (phần 2/2 của đợt làm mới giao diện)

## Bối cảnh

Phần 1 (`2026-10-19-giao-dien-da-co-design.md`) đã thống nhất màu và thành phần, nhưng giữ nguyên
bố cục tab Tiên đoán: nút chọn số lá tách hai bên mép (1–2 lá trái, 3–5 lá phải), khung câu hỏi
ở giữa, rút xong khung câu hỏi vẫn chiếm chỗ nên phải cuộn mới thấy bài.

Người dùng đã chọn **phương án C — theo từng bước** trong mockup 2, và bổ sung yêu cầu: sau khi
rút vẫn phải **xem lại được câu hỏi**. Thiết kế dải câu hỏi bên dưới đã được duyệt.

Không nằm trong phạm vi: nhịp thở trước khi rút, chia sẻ, bảng chi tiết rune ("Tìm hiểu thêm"),
viết lại nội dung lời khuyên, lưu lịch sử câu hỏi (giai đoạn 2).

## Phần 1 — Dữ liệu kiểu trải bài (`src/data/spreads.ts`)

Gom `spreadPositions` và `getRuneCountNumber` đang nằm rải trong `RandomPullTab` về một chỗ:

```ts
export type SpreadId = 'one' | 'two' | 'three' | 'five';

export interface Spread {
  id: SpreadId;
  count: number;
  label: string;        // mô tả ngắn hiện trên nút chọn, vd "Quá khứ – Hiện tại – Tiếp theo"
  positions: string[];  // tên vị trí từng lá, độ dài = count
}

export const SPREADS: Spread[];               // 4 kiểu, thứ tự 1 / 2 / 3 / 5 lá
export const getSpread: (id: SpreadId) => Spread;
```

| id | count | label | positions |
|---|---|---|---|
| one | 1 | Thông điệp | Thông điệp chính |
| two | 2 | Chú ý – Phản hồi | Điều cần chú ý · Cách nên phản hồi |
| three | 3 | Quá khứ – Hiện tại – Tiếp theo | Ảnh hưởng quá khứ · Tình huống hiện tại · Bước tiếp theo |
| five | 5 | Toàn cảnh | Gốc rễ vấn đề · Thử thách · Sự hỗ trợ ẩn · Hành động nên làm · Xu hướng sắp tới |

(Tên vị trí giữ nguyên như hiện tại.)

## Phần 2 — Bước 1: đặt câu hỏi (`src/components/divination/AskStep.tsx`)

Hiện khi chưa rút bài. Căn giữa, rộng tối đa ~720px, từ trên xuống:

1. Tiêu đề (h2): **"Điều gì đang ở trong tâm trí bạn?"**; dòng phụ: "Viết ra câu hỏi, hoặc chọn
   một gợi ý."
2. Ô câu hỏi: `textarea` 2 dòng, chữ Cormorant nghiêng cỡ lớn, căn giữa, chỉ có gạch chân (không
   khung), `aria-label="Câu hỏi của bạn"`, `maxLength` 200, placeholder "Lời thỉnh cầu hoặc điều
   bạn đang băn khoăn…".
3. **Gợi ý câu hỏi** (nhóm `role="group"` `aria-label="Gợi ý câu hỏi"`): 5 chip "Công việc sắp tới",
   "Một mối quan hệ", "Sức khỏe & tinh thần", "Chuyện tiền bạc", "Một quyết định đang cân nhắc".
   Bấm chip → thay nội dung ô câu hỏi bằng đúng chữ trên chip và đưa focus vào ô.
4. **Chọn kiểu trải bài** (nhóm `aria-label="Kiểu trải bài"`): 4 nút, mỗi nút có hình minh họa số
   lá (các ô chữ nhật nhỏ), "N lá" và `label`. Nút đang chọn có `aria-pressed="true"`, viền và nền
   vàng. Mặc định 1 lá. Desktop 4 cột; ≤768px 2 cột.
5. Nút chính **"Tiên đoán"** (`.btn`).

## Phần 3 — Bước 2: đọc bài

Bấm "Tiên đoán" → rút `count` lá (như hiện tại: không trùng, rune không đối xứng 50% ngược), ẩn
toàn bộ bước 1, hiện:

### 3.1 Dải câu hỏi (`src/components/divination/QuestionBar.tsx`)

`role="region"` `aria-label="Câu hỏi của lượt rút"`. Gồm:

- **Câu hỏi** trong ngoặc kép “…”, chữ Cormorant nghiêng. Nếu câu hỏi trống (sau khi bỏ khoảng
  trắng): hiện "Không đặt câu hỏi cụ thể" màu `--text-muted`.
- Mặc định câu hỏi hiển thị **một dòng**, dài thì cắt bằng "…". Chỉ khi chữ thực sự bị cắt (đo
  `scrollWidth > clientWidth`, đo lại khi đổi kích thước cửa sổ) mới hiện nút chữ **"Xem đầy đủ"**
  (`aria-expanded="false"`). Bấm → câu hỏi xuống dòng hiện đủ, nút đổi thành **"Thu gọn"**
  (`aria-expanded="true"`).
- **Trạng thái:** "N lá · đã lật k/N", cập nhật mỗi khi lật thêm lá.
- Nút **"↺ Hỏi câu khác"** (`.btn .btn-ghost` cỡ nhỏ): quay về bước 1, **giữ nguyên câu hỏi và
  kiểu trải bài đã chọn** để sửa nhanh rồi rút lại; xóa các lá đã rút.
- Không có cách sửa câu hỏi khi đang ở bước 2 (đổi câu hỏi thì phải rút lại).
- Dải **dính** (`position: sticky`) ngay dưới thanh trên cùng khi cuộn. Vì chiều cao thanh trên
  cùng thay đổi (menu có thể xuống dòng, mobile thấp hơn), `App` đo chiều cao `.top-band` bằng
  `ResizeObserver` và ghi vào biến CSS `--top-band-height` trên `:root`; dải dùng
  `top: var(--top-band-height, 0px)`. Trình duyệt/môi trường không có `ResizeObserver` (vd jsdom)
  thì bỏ qua, dải dính ở `top: 0`.
- Nền `--band` + blur như thanh trên cùng, viền `--line`, bo `--radius`.

### 3.2 Hàng lá bài

Các `FlipCard` như hiện tại (lật từng lá, rune ngược, hiệu ứng Cộng Hưởng, thứ tự lá vừa lật lên
đầu trên mobile giữ nguyên). Bố cục bằng CSS thay cho style inline:
- Desktop: một hàng căn giữa, mỗi lá `flex: 0 1 230px`, tối thiểu 190px, đủ 5 lá trên một hàng ở
  1200px.
- ≤768px: mỗi lá một hàng, rộng tối đa 340px, căn giữa.

Lời khuyên vẫn ghép `"{vị trí}: {interpolateAdvice(...)}"`, chủ đề là câu hỏi đã bỏ khoảng trắng
hoặc "tình huống của bạn" nếu trống (như hiện tại).

## Phần 4 — Dọn dẹp

- `RandomPullTab.tsx` viết lại thành phần điều phối trạng thái (kiểu trải bài, câu hỏi, các lá đã
  rút, các lá đã lật) + chọn hiển thị bước 1 hay bước 2. Không còn style inline.
- `StarMist` vẫn là nền của tab.
- `setupTests.ts`: thay `HTMLCanvasElement.prototype.getContext` bằng hàm trả `null` để jsdom không
  in lỗi "Not implemented" mỗi lần render tab Tiên đoán (StarMist đã tự bỏ qua khi không có
  context).
- Thêm `.chip`, `.spread-option`, `.question-bar-toggle` vào quy tắc `:focus-visible` chung.

## Phần 5 — Kiểm thử

- `src/data/spreads.test.ts`: mỗi kiểu có `positions.length === count`; `getSpread` trả đúng kiểu.
- `src/components/RandomPullTab.test.tsx`:
  - bước 1 có tiêu đề, 5 gợi ý, 4 kiểu trải bài, chưa có lá nào;
  - bấm gợi ý → ô câu hỏi có đúng chữ đó;
  - chọn 3 lá + nhập câu hỏi + "Tiên đoán" → ô câu hỏi biến mất, dải hiện “câu hỏi” và
    "3 lá · đã lật 0/3", có 3 lá úp;
  - lật 1 lá → "3 lá · đã lật 1/3";
  - câu hỏi trống → dải ghi "Không đặt câu hỏi cụ thể";
  - "Hỏi câu khác" → về bước 1, câu hỏi còn nguyên, nút "5 lá" vẫn `aria-pressed="true"`, không còn
    lá nào;
  - khi chữ bị cắt (giả lập `scrollWidth > clientWidth`) → có "Xem đầy đủ", bấm thành "Thu gọn";
    khi không bị cắt → không có nút.
- Test `App` hiện có vẫn pass.
- Chạy app: chụp bước 1 và bước 2 (đã lật 1 lá) ở 1440px và 375px; cuộn xuống khi rút 5 lá để
  xác nhận dải dính ngay dưới thanh trên cùng; overflow ngang = 0 ở 375/1025/1280/1440px.

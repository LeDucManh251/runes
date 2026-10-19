# Giao diện "Đá cổ" (phần 1/2 của đợt làm mới giao diện)

## Bối cảnh

App hiện dùng ba bảng màu lẫn lộn: xám đen trung tính (`.rune-card`, `.nav-button`, tab
Bindrunes/Wyrd/Lịch sử), xanh navy (tab Tiên đoán, lá bài) và xám xanh Nordic (thẻ Từ điển).
Thanh menu là sáu nút đóng khung nặng nề, giờ xuống thành hai hàng lệch. Ảnh bindrune và Web of
Wyrd nền trắng chói giữa giao diện tối. Chữ căn đều hai bên (`justify`) làm tiếng Việt hở khoảng
trắng. Gần 100 khối `style={{…}}` inline rải trong component khiến không đổi màu tập trung được.

Người dùng đã duyệt qua mockup và chọn hướng **B — Đá cổ**: tông than đá ấm, điểm nhấn vàng hổ
phách, góc vuông nhẹ, rune như được khắc. Menu dạng chữ, tab đang chọn có dấu ◆ nhỏ bên dưới.

Đợt làm mới chia hai phần, mỗi phần có spec/plan riêng:

1. **Phần này:** bảng màu và thành phần dùng chung, áp cho mọi tab.
2. **Phần sau:** bố cục tab Tiên đoán theo bước (màn hỏi tập trung, dải câu hỏi, chọn kiểu trải
   bài). Spec riêng.

Không nằm trong phạm vi phần này: đổi bố cục tab Tiên đoán (chỉ đổi màu), nhịp thở, bảng chi tiết
rune, nén/tối ưu ảnh, favicon, chuyển breakpoint mobile của JS (`window.innerWidth <= 1024`).

## Phần 1 — Design tokens

Khai báo trong `:root` ở đầu `src/index.css`. Mọi màu, bo góc, font mới **chỉ** được dùng qua
các biến này; không viết mã màu trực tiếp trong component hay trong rule CSS khác.

| Biến | Giá trị | Dùng cho |
|---|---|---|
| `--bg-deep` | `#110e0b` | nền trang |
| `--bg-glow` | `#2a2219` | quầng sáng ấm phía trên nền |
| `--surface-1` | `#211b15` | đầu gradient của thẻ |
| `--surface-2` | `#17130f` | cuối gradient của thẻ |
| `--surface` | `linear-gradient(160deg, var(--surface-1), var(--surface-2))` | nền thẻ, panel |
| `--inset` | `#120f0c` | nền ô nhập |
| `--line` | `rgba(212, 169, 96, 0.22)` | viền mặc định |
| `--line-strong` | `rgba(212, 169, 96, 0.5)` | viền khi hover/focus |
| `--text` | `#f0e7d8` | tiêu đề, chữ chính |
| `--text-body` | `#d8ccba` | đoạn văn |
| `--text-muted` | `#a59680` | chú thích, placeholder |
| `--accent` | `#d8b06a` | điểm nhấn, tab đang chọn, ý nghĩa rune |
| `--accent-bright` | `#ecd3a2` | ký hiệu rune, chữ trên nút chính |
| `--accent-soft` | `rgba(216, 176, 106, 0.13)` | nền nhạt của tag, mục đang chọn |
| `--warn` | `#d99a7a` | dòng cảnh báo (ký tự bị bỏ qua, lỗi sao chép) |
| `--radius` | `6px` | thẻ, panel |
| `--radius-sm` | `4px` | nút, ô nhập, tag |
| `--font-display` | `'Cormorant Garamond', serif` | tiêu đề, menu, nút |
| `--font-body` | `'Inter', sans-serif` | đoạn văn |
| `--font-rune` | `'Noto Sans Runic', 'Cormorant Garamond', serif` | ký hiệu rune |
| `--rune-glow` | `0 2px 0 rgba(0, 0, 0, 0.8), 0 0 16px rgba(216, 176, 106, 0.35)` | bóng của ký hiệu rune |

Nền trang (`body`): `radial-gradient(ellipse 80% 50% at 50% 0%, var(--bg-glow) 0%, var(--bg-deep) 70%)`
cố định (`background-attachment: fixed`), thay cho gradient xanh hiện tại. Bỏ lớp `body::before`
chấm xanh.

Độ tương phản (kiểm tra trong plan): `--text-muted` trên `--surface-2` phải đạt ≥ 4.5:1;
`--accent` trên `--surface-2` ≥ 4.5:1.

## Phần 2 — Thành phần dùng chung (class CSS)

| Class | Mô tả |
|---|---|
| `.panel` | nền `--surface`, viền 1px `--line`, bo `--radius`, padding `1.5rem`. Không đổi vị trí khi hover. |
| `.btn` | nút chính: nền `--accent-soft`, viền 1px `--accent`, chữ `--accent-bright`, `--font-display` 700, viết hoa, `letter-spacing: 0.16em`, bo `--radius-sm`, padding `0.75rem 2rem`. Hover: nền đậm hơn (`rgba(216,176,106,0.2)`). Focus-visible: viền ngoài 2px `--accent`. |
| `.btn-ghost` | biến thể của `.btn`: nền trong suốt, viền `--line`, chữ `--text-muted`; hover chữ `--text`. |
| `.input` | nền `--inset`, viền `--line`, bo `--radius-sm`, chữ `--text`, placeholder `--text-muted`; focus viền `--line-strong`. |
| `.tag` | chữ nhỏ (`0.8rem`), nền `--accent-soft`, chữ `--accent`, bo `--radius-sm`. |
| `.rune-glyph` | ký hiệu rune: `--font-rune`, màu `--accent-bright`, `text-shadow: var(--rune-glow)`. Kích thước do nơi dùng quyết định. |

Lớp `.rune-symbol` hiện có giữ tên (đang dùng ở FlipCard, Từ điển) nhưng đổi sang cùng định
nghĩa với `.rune-glyph`. Bỏ `.nav-button`, `.pull-button`, `.dictionary-card` cũ (thay bằng định
nghĩa mới bên dưới). `.rune-card` đổi thành nền `--surface` như `.panel` và **bỏ hiệu ứng nâng lên
khi hover** (đang làm cả trang nội dung nhảy lên khi rê chuột).

Chữ: mọi đoạn văn **căn trái** (bỏ hết `text-align: justify`), `line-height: 1.65`, màu
`--text-body`. Tiêu đề trang và tiêu đề thẻ vẫn căn giữa như hiện tại.

## Phần 3 — Thanh trên cùng và menu

- `.top-band`: nền `rgba(17, 14, 11, 0.8)` + `backdrop-filter: blur(12px)`, viền dưới 1px `--line`,
  bỏ đổ bóng. Vẫn `position: sticky`.
- Tiêu đề app: `--font-display` 700, viết hoa, `letter-spacing: 0.2em`, màu `--text`, bỏ
  `text-shadow` phát sáng xanh. Chuyển style inline trong `App.tsx` ra class `.app-title`.
- **Tab dạng chữ** thay cho nút đóng khung (`.nav-tab`): `--font-display` 600, viết hoa,
  `letter-spacing: 0.08em`, cỡ `1rem`, màu `--text-muted`, không nền, không viền, padding dọc đủ
  vùng chạm 44px. Hover: màu `--text`. Đang chọn: màu `--accent`, `aria-current="page"`, và dấu
  `◆` cỡ 7px căn giữa ngay dưới chữ (pseudo-element `::after`).
- **Rút gọn nhãn tab** để menu nằm một hàng: "Từ điển Rune" → "Từ điển", "Mạng lưới định mệnh
  (Wyrd)" → "Wyrd", "Lịch sử Rune" → "Lịch sử". Tiêu đề bên trong từng tab giữ nguyên tên đầy đủ.
- Desktop: menu một hàng khi đủ chỗ; hẹp hơn thì `flex-wrap: wrap` xuống dòng, không bao giờ tràn
  ngang.
- **Mobile** (khi `isMobile`): nút menu thành `.btn-ghost` nhỏ "☰ Menu" / "✕ Đóng". Bảng menu thả
  xuống dùng `position: absolute; top: 100%` so với `.top-band` (thay cho `top: '140px'`
  hard-code), nền `--surface-2`, viền dưới `--line`, các tab xếp dọc, căn giữa.
- **Tiêu đề không còn tràn trên điện thoại:** ở `max-width: 480px` giảm cỡ chữ tiêu đề xuống
  `1.15rem` và `letter-spacing: 0.12em`. Kiểm tra: ở bề rộng 375px, `scrollWidth - innerWidth`
  phải bằng 0.

## Phần 4 — Áp cho từng tab và thành phần

Chuyển style inline sang class trong `index.css` cho mọi file dưới đây (trừ `RandomPullTab`, xem
mục cuối). Sau phần này, các file đó không còn `style={{…}}` nào, ngoại trừ giá trị động bắt buộc
(vd `animationDelay` theo index ở Từ điển, `transform` xoay 180° của rune ngược).

- **Bindrunes, Wyrd, Lịch sử** (nội dung tĩnh): khung `.prose` (dựa trên `.rune-card` mới, rộng tối
  đa 800px, căn giữa). Bên trong: `.prose-title` (h2), `.prose-lead` (đoạn giới thiệu, căn giữa),
  `.prose-heading` (h3, màu `--accent`, `--font-display`), `.prose-text` (đoạn văn căn trái),
  `.prose-quote` (câu trích của Odin ở tab Lịch sử: nghiêng, màu `--accent`, căn giữa). Các tiêu đề
  h3 viết hoa toàn bộ bằng tay ở tab Wyrd ("BA NỮ THẦN SỐ MỆNH (NORN)"…) chuyển về chữ thường có
  viết hoa đầu câu cho đồng bộ với tab Bindrunes.
- **Ảnh minh họa** (bindrune, Web of Wyrd): class `.figure-img`. Ảnh là nét đen trên nền trắng,
  xử lý bằng CSS: `filter: invert(1) sepia(1) saturate(1.6) hue-rotate(-10deg) brightness(0.95)`
  + `mix-blend-mode: screen`, để nét thành màu vàng hổ phách và nền trắng biến mất vào thẻ tối.
  Không sửa file ảnh. Ảnh vẫn bấm để phóng to; thêm `role="button"`, `tabIndex={0}` và mở bằng
  Enter/Space (hiện chỉ bấm chuột được).
- **Khung phóng to ảnh** (`ImageLightbox`): nền phủ `rgba(10, 8, 6, 0.92)`, ảnh dùng cùng
  `.figure-img` trên nền `--surface-2`, nút đóng `.btn-ghost` tròn.
- **Từ điển**: ô tìm kiếm dùng `.input` và thêm `aria-label="Tìm rune"`. Thẻ rune (`.dictionary-card`
  định nghĩa lại): nền `--surface`, viền `--line`, bo `--radius`; hover chỉ đổi viền sang
  `--line-strong` (không nâng lên). Ký hiệu `.rune-symbol`, tên `--font-display` viết hoa, ý nghĩa
  màu `--accent`, dòng "Khi ngược" màu `--text-muted` nghiêng, mô tả căn trái.
- **Tag chú thích** (`RuneAnnotations`): dùng `.tag`; hộp tooltip nền `--surface-2`, viền
  `--line-strong`, chữ `--text-body`, tiêu đề tooltip màu `--accent`.
- **Lá bài** (`FlipCard`): mặt úp nền `--surface` kèm hoa văn sọc chéo mờ
  (`repeating-linear-gradient(45deg, rgba(216,176,106,0.035) 0 8px, transparent 8px 16px)`), dấu
  "?" màu `--text-muted`. Mặt ngửa nền `--surface`, viền `--line`; nhãn vị trí là viên bo tròn viền
  `--line`; ký hiệu `.rune-symbol`; tên viết hoa; ý nghĩa màu `--accent`; mô tả và lời khuyên căn
  trái, cỡ chữ không đổi. Hiệu ứng "Cộng Hưởng" (vòng sáng, `resonance-glow`) đổi từ xanh sang
  `rgba(216, 176, 106, …)` với cùng độ mờ.
- **Viết tên** (`NameWriterTab`, đã dùng class): chỉ thay mã màu xanh trong các class
  `.name-writer-*` bằng token tương ứng (`#63b3ed`/`#88c0d0` → `--accent`/`--line-strong`,
  `#e8f4fd` → `--accent-bright` cho rune / `--text` cho chữ, `#8fa5b8` → `--text-muted`,
  `#d8b4a0` → `--warn`, nút sao chép → `.btn`).
- **Nền hạt sáng** (`StarMist`): đổi màu hạt từ `rgba(136, 192, 208, a)` sang
  `rgba(216, 176, 106, a)`.
- **Tab Tiên đoán** (`RandomPullTab`): **không đổi cấu trúc** (phần 2 sẽ viết lại). Chỉ thay các mã
  màu inline bằng `var(--…)` tương ứng để tab không lệch tông trong lúc chờ phần 2: nền các khối
  → `var(--surface)`, viền → `var(--line)`, chữ → `var(--text)`/`var(--text-muted)`, nút "Tiên
  đoán" và "Bắt đầu lại" → class `.btn`/`.btn-ghost`, nút chọn số lá đang chọn → viền
  `var(--accent)` nền `var(--accent-soft)`.

## Phần 5 — Kiểm thử

Phần này chủ yếu là CSS nên kiểm tra bằng mắt và đo tự động trên app thật:

- Toàn bộ test hiện có vẫn pass. `App.test` cập nhật theo nhãn tab mới; thêm kiểm tra tab đang
  chọn có `aria-current="page"`.
- Test mới cho ảnh minh họa: ở tab Bindrunes, nhấn Enter trên ảnh đầu tiên thì khung phóng to mở
  (`role="dialog"` xuất hiện).
- Không còn `text-align: 'justify'` và không còn mã màu hex trong các file component (trừ
  `RandomPullTab` được phép giữ cấu trúc, nhưng cũng không còn hex). Kiểm bằng `grep`.
- Chạy app và chụp màn hình mọi tab ở 1440px và 375px; đo `scrollWidth - innerWidth` = 0 ở 375,
  1025, 1280, 1440px; console không có lỗi mới.
- Tính tỉ lệ tương phản của hai cặp màu ở Phần 1 bằng script, phải ≥ 4.5:1.

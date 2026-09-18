# Nâng cấp nền tảng, tái cấu trúc App.tsx, và hiệu ứng động

## Bối cảnh

Rune Elder Futhark App là 1 SPA React 18 + TypeScript + Vite, đang chạy live trên GitHub Pages
(`base: '/runes/'`). Codebase nhỏ, chưa có test/lint, `App.tsx` (274 dòng) đang gộp cả 5 tab
trong 1 file với style inline dày đặc, và có 2 dependency không dùng đến. Vite đang ở v4
(hiện tại là v6). Mục tiêu đợt này: dọn nền tảng, tái cấu trúc `App.tsx` cho gọn, và thêm vài
hiệu ứng động cho trang sinh động hơn — mà không đổi hành vi/nội dung hiện có và không rủi ro
cho site đang chạy live.

Không nằm trong phạm vi: đổi toàn bộ inline style sang CSS module/hệ thống class mới, thêm
tab/nội dung mới.

## Phần 1 — Dọn nền tảng & nâng cấp Vite

- Xóa `lucide-react` và `vite-plugin-gh-pages` khỏi `package.json` (dependencies không được
  import/sử dụng ở đâu trong code).
- `git rm --cached` cho `dist/` và `.DS_Store` (đã lỡ commit dù không phải bản build thật sự
  deploy — `gh-pages` package đẩy build output lên nhánh `gh-pages` riêng), bổ sung đúng rule
  vào `.gitignore` nếu còn thiếu.
- Nâng `vite` từ `^4.4.5` lên `^6.x`, cập nhật `@vitejs/plugin-react` lên bản tương thích với
  Vite 6. Giữ nguyên `base: '/runes/'` trong `vite.config.ts`.
- Thêm ESLint: `typescript-eslint` (recommended) + `eslint-plugin-react-hooks`, thêm script
  `"lint": "eslint ."` vào `package.json`.
- Thêm Vitest + React Testing Library (`vitest`, `@testing-library/react`,
  `@testing-library/jest-dom`, `jsdom`), thêm script `"test": "vitest run"`.
- Viết test cho:
  - `interpolateAdvice()` trong `src/data/runes.ts` (thay thế placeholder `{subject}`/`{name}`
    đúng, và không để sót placeholder khi thiếu input).
  - Logic rút quẻ không trùng (dùng `Set` để chọn N rune không lặp) trong
    `RandomPullTab`/helper liên quan.

**Điều kiện hoàn thành**: `npm run build`, `npm run dev`, `npm run lint`, `npm run test` đều
chạy thành công; `npm run deploy` (gh-pages) build ra đúng cấu trúc như trước.

## Phần 2 — Tách App.tsx

Cấu trúc mới trong `src/components/`:

- `tabs/DictionaryTab.tsx` — tab từ điển (search + grid `.dictionary-card`), nhận `runes` và
  state search (hoặc tự quản lý state search nội bộ).
- `tabs/BindrunesTab.tsx` — nội dung tĩnh Bindrunes, nhận callback `onImageClick` để mở
  lightbox.
- `tabs/WyrdTab.tsx` — nội dung tĩnh Web of Wyrd, cùng `onImageClick`.
- `tabs/HistoryTab.tsx` — nội dung tĩnh lịch sử rune, không cần props đặc biệt.
- `Nav.tsx` — thay cho 2 khối JSX nav (desktop + mobile menu) đang lặp lại trong `App.tsx`;
  nhận `activeTab`, `onTabChange`, `isMobile`, `isMobileMenuOpen`, `onToggleMobileMenu`, render
  đúng 1 danh sách nút, tự đổi layout theo `isMobile` thay vì viết 2 khối JSX riêng.
- `ImageLightbox.tsx` — modal phóng to ảnh, nhận `src` (hoặc `null` để ẩn) và `onClose`.

`App.tsx` sau khi tách chỉ còn:
- State: `activeTab`, `isMobile`, `isMobileMenuOpen`, `enlargedImage`.
- Các `useEffect` hiện có (resize listener, Escape-to-close) giữ nguyên vị trí (có thể chuyển
  vào hook riêng nếu tự nhiên, không bắt buộc).
- Render `Nav` + tab component tương ứng với `activeTab` + `ImageLightbox`.

**Ràng buộc**: đây là refactor cơ học — không đổi class CSS, không đổi text nội dung, không đổi
hành vi. Sau khi tách xong, chạy `npm run dev` và so sánh bằng mắt tất cả 5 tab + responsive
mobile + lightbox để đảm bảo giống hệt trước khi tách.

## Phần 3 — Hiệu ứng động

### 3.1 Dệt Mở (áp dụng cho mọi tab)

- Thêm animation CSS dùng chung (đặt trong `src/index.css`): fade + trượt lên nhẹ
  (`translateY` → 0, `opacity` 0 → 1), áp cho khối nội dung mỗi tab khi `activeTab` đổi.
- Với tab có nhiều phần tử con lặp lại (ví dụ grid rune trong Dictionary), stagger delay theo
  index (dùng CSS `animation-delay` tính từ index hoặc `nth-child`).
- Cách kích hoạt lại animation mỗi lần đổi tab: dùng `key={activeTab}` trên wrapper của nội
  dung tab để React remount và animation CSS `forwards` chạy lại từ đầu.

### 3.2 Cộng Hưởng (chỉ khi FlipCard lộ kết quả)

- Trong `FlipCard.tsx`, khi trạng thái chuyển sang "đã lật" (revealed), thêm 2-3 vòng tròn
  glow lan tỏa (`::before`/`::after` hoặc span phụ) phát 1 lần rồi biến mất, cùng hiệu ứng glow
  ngắn quanh border thẻ.
- Không lặp lại hiệu ứng nếu người dùng bấm lại lá đã lật rồi (chỉ chạy đúng 1 lần tại thời
  điểm chuyển từ chưa lật → đã lật).

### 3.3 Sương Sao (chỉ trong tab Tiên đoán)

- Component mới `components/StarMist.tsx`: canvas vẽ ~25-30 hạt sáng trôi chậm, dùng
  `requestAnimationFrame`.
- Chỉ mount bên trong `RandomPullTab` (không mount ở `App.tsx` hay tab khác).
- Dừng vòng lặp vẽ khi `document.hidden === true` (Page Visibility API) và khi component
  unmount (rời tab) — tránh tốn CPU/pin khi người dùng không nhìn tab đó.

### 3.4 Áp dụng chung cho cả 3 hiệu ứng

- Tất cả animation phải tôn trọng `@media (prefers-reduced-motion: reduce)` — tắt hẳn
  animation/particle loop cho người dùng đã bật chế độ giảm chuyển động ở hệ điều hành.

**Điều kiện hoàn thành**: kiểm tra bằng mắt trên `npm run dev` — chuyển qua lại 5 tab thấy
hiệu ứng Dệt Mở, rút quẻ thấy Cộng Hưởng đúng 1 lần khi lật, tab Tiên đoán thấy Sương Sao chạy
và dừng khi chuyển tab khác hoặc chuyển sang tab trình duyệt khác.

## Rủi ro & lưu ý

- Nâng Vite là thay đổi có rủi ro thấp-trung bình nhất trong 3 phần — cần build thử local
  trước, không push thẳng nếu build lỗi.
- Tách `App.tsx` phải giữ nguyên pixel-for-pixel giao diện — nếu lệch, ưu tiên sửa lại đúng
  như bản gốc thay vì "tiện tay cải tiến thêm".
- Sương Sao là hiệu ứng có chi phí runtime cao nhất (canvas + rAF liên tục) — bắt buộc có cơ
  chế dừng khi ẩn tab như mô tả ở 3.3, không được bỏ qua.

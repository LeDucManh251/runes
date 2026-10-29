# Lộ trình & bối cảnh dự án

File này giữ lại những gì đã thống nhất qua các phiên làm việc (quyết định, lộ trình, quy ước),
để làm tiếp trên máy khác hoặc phiên mới mà không mất bối cảnh. Chi tiết từng tính năng nằm trong
`docs/superpowers/specs/` (thiết kế) và `docs/superpowers/plans/` (kế hoạch triển khai).

Cập nhật lần cuối: 2026-10-29.

## Trạng thái hiện tại

Nhánh `main` (đã push lên `origin`) có đủ các phần sau, 69 test pass:

| Phần | Spec | Ghi chú |
|---|---|---|
| Tab **Viết tên bằng Rune** | `specs/2026-10-15-rune-name-writer-design.md` | 3 cách viết: tiếng Việt theo âm, tiếng Anh theo âm, theo chữ cái |
| Giao diện **"Đá cổ"** | `specs/2026-10-19-giao-dien-da-co-design.md` | Token màu trong `:root` của `src/index.css`, menu dạng chữ một hàng |
| Tab **Tiên đoán theo từng bước** | `specs/2026-10-19-tien-doan-theo-buoc-design.md` | Bước 1 đặt câu hỏi + gợi ý + chọn kiểu trải bài; bước 2 dải câu hỏi dính đầu trang |

Chưa deploy lên GitHub Pages.

## Quyết định đã chốt

- **Thuần rune.** Không tích hợp Cung Hoàng đạo hay hệ huyền học khác (kể cả một dòng "cầu nối").
  Tính năng mới bám vào chất liệu rune / Bắc Âu.
- **Minh bạch nguồn gốc.** Mọi quy ước không có cơ sở lịch sử phải ghi rõ trong spec và trong app là
  "quy ước hiện đại", kèm nguồn đã tra. Gồm: lịch rune sinh nhật, ý nghĩa bói toán (phần lớn từ tác
  giả thế kỷ 20), và **bảng phiên âm tiếng Việt** (do dự án tự thiết kế, chưa có chuẩn nào; thiên
  về giọng Bắc, vd "d" → ᛉ). Âm gốc của từng rune thì có cơ sở runology (nguyên tắc âm đầu, đá
  Kylver, các bài thơ rune).
- **Giao diện "Đá cổ"**: than đá ấm + vàng hổ phách, góc vuông nhẹ. Mọi màu/bo góc/font chỉ dùng
  qua biến CSS trong `:root`; component không viết mã màu trực tiếp.
- **Tab Tiên đoán**: không cho sửa câu hỏi khi đã rút (đổi câu hỏi thì rút lại); "Hỏi câu khác" giữ
  câu cũ và kiểu trải bài.

## Lộ trình tiếp theo (theo thứ tự)

1. **Dọn việc nhỏ** (xem mục cuối).
2. **Nhịp thở trước khi chia bài**: bấm "Tiên đoán" → vòng tròn nở ~2,5 giây ("Hít vào… nghĩ về
   câu hỏi của bạn") rồi co ~2,5 giây ("Thở ra…") → hiện lá bài. Luôn có nút "Bỏ qua" (và phím
   Escape); ô "Không hiện nhịp thở nữa" lưu trong trình duyệt; `prefers-reduced-motion` thì bỏ qua.
3. **Chia sẻ kiểu Wordle**: nút copy chuỗi ký hiệu rune đã rút + link app, **không lộ câu hỏi**.
4. **Bảng chi tiết rune** dùng chung cho Tiên đoán ("Tìm hiểu thêm về …" trên lá đã lật) và Từ
   điển: ý nghĩa xuôi/ngược, `interpretation` (đã có dữ liệu, chưa hiển thị), gốc từ, rune liên quan.
5. **Viết lại lời khuyên**: hiện chỉ 2/24 mẫu `advice` và 6/16 mẫu `reversedAdvice` có `{subject}`,
   nên câu hỏi người dùng hầu như không xuất hiện trong lời khuyên. Định dạng mới: một câu chính +
   "Nên làm" / "Nên tránh", lồng câu hỏi vào; thêm đoạn tổng kết cả lượt rút. Cần người dùng duyệt
   văn phong.
6. **Rune sinh nhật**: nhập ngày sinh → rune theo lịch 24 rune nửa tháng + nhóm Aett (Freyr,
   Heimdall, Tyr). Ghi rõ là quy ước hiện đại, tra và dẫn nguồn cụ thể vì các nguồn lệch mốc ngày.
   Mở chi tiết bằng bảng ở mục 4.
7. **Giai đoạn 2**: nhật ký các lượt rút (lưu trên máy người dùng), Rune của ngày, xem lại câu hỏi cũ.

Ý tưởng đã bàn, chưa xếp lịch: bindrune cá nhân (chọn 2–3 rune → chồng nét → ảnh nền), gửi một lá
rune cho người khác qua link, giải mã văn khắc hằng ngày kiểu Wordle, "Hành trình 24 ngày", PWA
(cài lên màn hình chính, chạy offline) trước khi tính đến app trên chợ ứng dụng.

## Việc nhỏ còn tồn

- Favicon `/vite.svg` không tồn tại (404) và bỏ qua `base: '/runes/'`. Đề xuất dùng ký tự rune ᛟ.
- `public/huginmunin1.png` (1,4MB) không được dùng; ảnh trong `public/` tổng ~4,4MB PNG, hiển thị
  chỉ 150–180px → nên chuyển WebP / làm thumbnail.
- README lỗi thời: còn nhắc Lucide React (đã gỡ), Node 16 (Vite 6 cần Node 18+), thiếu `/runes/`
  trong địa chỉ chạy thử (`http://localhost:3000/runes/`).
- `package.json` thiếu `"type": "module"` (lint in cảnh báo).
- `package.json` → `homepage` vẫn trỏ `katalinkult.github.io/runes` (tác giả gốc): sửa trước khi
  chạy `npm run deploy`.

## Cách làm việc đã dùng

- Quy trình theo skill trong `.claude/skills/`: `brainstorming` (hỏi từng câu, 2–3 phương án có
  khuyến nghị) → spec trong `docs/superpowers/specs/` → `writing-plans` → thực thi **inline**, TDD,
  commit từng task.
- Việc thuộc về thị giác thì làm **mockup HTML** mở trên trình duyệt để người dùng chọn trước.
- Sau khi code: chạy app thật (Chrome headless qua `playwright-core`, cài tạm ngoài dự án), chụp màn
  hình 1440px và 375px, đo tràn ngang (`scrollWidth - innerWidth` = 0) ở 375/1025/1280/1440px.
- Mỗi tính năng một branch tách từ `main`; chỉ push khi người dùng đồng ý.
- Người dùng trao đổi bằng tiếng Việt, ngắn gọn; thích được đề xuất kèm khuyến nghị rõ.

## Lưu ý kỹ thuật

- Vitest chạy **không** bật `globals`, nên RTL không tự cleanup: `src/setupTests.ts` tự gọi
  `cleanup()` sau mỗi test, và thay `HTMLCanvasElement.prototype.getContext` / `window.scrollTo`
  bằng hàm rỗng cho jsdom.
- Breakpoint mobile trong JS là `window.innerWidth <= 1024` (`App.tsx`); CSS có media query 1024 /
  768 / 480px. jsdom mặc định `innerWidth = 1024` nên test `App` ép lên 1280.
- `.btn` khai báo sớm trong CSS; class ghép với `.btn` (vd `.menu-toggle`) phải viết `.btn.xxx` hoặc
  đặt sau, nếu không sẽ bị `.btn` ghi đè.
- Ảnh nét đen nền trắng được đổi màu bằng CSS (`.figure-img`: `invert` + `sepia` +
  `mix-blend-mode: screen`), không sửa file ảnh.
- Dải câu hỏi dính dưới thanh trên cùng nhờ `App` đo `.top-band` bằng `ResizeObserver` và ghi vào
  biến `--top-band-height`.

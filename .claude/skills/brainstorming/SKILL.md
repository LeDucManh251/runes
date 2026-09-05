---
name: brainstorming
description: BẮT BUỘC dùng trước mọi việc sáng tạo — tạo feature, xây component, thêm chức năng, sửa hành vi. Hard-gate không cho viết code cho tới khi design được duyệt. Không có ngoại lệ "đơn giản quá không cần design".
---

# Brainstorming

**HARD-GATE:** Không được viết code, scaffold project, hay invoke skill implementation nào cho tới khi đã trình bày design và được user duyệt. Áp dụng cho MỌI project, kể cả project "quá đơn giản".

- Không có ngoại lệ "đơn giản quá không cần design" — mọi project đều phải qua flow này.
- Thứ tự bắt buộc (tạo task cho từng bước):
  1. Khám phá bối cảnh project (file, docs, commit gần đây)
  2. Đề nghị Visual Companion nếu sắp có câu hỏi trực quan — **phải là tin nhắn riêng**, không gộp với câu hỏi khác
  3. Hỏi làm rõ — **mỗi lần chỉ 1 câu hỏi**, ưu tiên trắc nghiệm
  4. Đề xuất 2-3 approach kèm trade-off, có khuyến nghị rõ ràng
  5. Trình bày design theo từng phần, xin duyệt sau mỗi phần
  6. Ghi design doc vào `docs/superpowers/specs/YYYY-MM-DD-<topic>-design.md` và commit
  7. Tự review spec (xem checklist bên dưới), sửa inline
  8. Yêu cầu user review file spec đã ghi
  9. Chuyển sang implementation **chỉ bằng cách invoke skill `writing-plans`** — không invoke skill implementation nào khác

- Nếu request bao gồm nhiều subsystem độc lập → phải decompose thành sub-project trước, mỗi sub-project có spec/plan/implementation riêng.
- Thiết kế phải chia nhỏ theo unit có 1 mục đích rõ ràng, giao tiếp qua interface rõ ràng, test được độc lập.
- Khi làm trong codebase có sẵn: khám phá cấu trúc hiện tại trước, theo pattern có sẵn; chỉ sửa phần liên quan trực tiếp đến mục tiêu, không refactor lan man.

## Spec self-review — bắt buộc kiểm tra
- Không còn "TBD", "TODO", placeholder, phần chưa hoàn chỉnh
- Không mâu thuẫn nội bộ giữa các phần
- Scope đủ gọn cho 1 plan (không gộp nhiều subsystem độc lập)
- Không có yêu cầu mơ hồ có thể hiểu 2 cách khác nhau

## Nguyên tắc cốt lõi
- Mỗi lần chỉ 1 câu hỏi
- Ưu tiên câu hỏi trắc nghiệm
- YAGNI triệt để — loại bỏ tính năng không cần thiết
- Luôn đề xuất 2-3 phương án thay thế trước khi chốt
- Validate từng bước, xin duyệt trước khi tiếp tục

## Visual Companion (nếu dùng)
- Chỉ đề nghị 1 lần, dưới dạng tin nhắn riêng biệt, chờ user phản hồi trước khi tiếp tục
- Quyết định dùng browser hay terminal theo TỪNG câu hỏi, không theo cả phiên: nội dung trực quan (mockup, wireframe, so sánh layout) → browser; nội dung văn bản/khái niệm (yêu cầu, scope, trade-off, lựa chọn A/B/C dạng chữ) → terminal
- Mỗi màn hình là 1 file mới, không tái sử dụng tên file
- Tối đa 2-4 lựa chọn mỗi màn hình
- Khi quay lại terminal mà không cần browser nữa → đẩy màn hình "waiting" để dọn nội dung cũ

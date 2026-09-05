---
name: code-review-expert
description: Review có cấu trúc các git changes hiện tại, góc nhìn senior engineer — SOLID, kiến trúc, ứng viên xoá bỏ, rủi ro bảo mật. Mặc định CHỈ REVIEW, không tự sửa code trừ khi user yêu cầu implement. Phân loại severity P0-P3.
---

# Code Review Expert

Mặc định CHỈ REVIEW, không tự sửa code trừ khi user yêu cầu implement.

## Severity levels (bắt buộc phân loại)
- **P0 Critical** — lỗ hổng bảo mật, nguy cơ mất dữ liệu, bug đúng/sai logic → phải chặn merge
- **P1 High** — lỗi logic, vi phạm SOLID nghiêm trọng, performance regression → nên fix trước merge
- **P2 Medium** — code smell, vấn đề maintainability, vi phạm SOLID nhỏ → fix trong PR này hoặc tạo follow-up
- **P3 Low** — style, đặt tên, gợi ý nhỏ → tuỳ chọn

## Workflow bắt buộc theo thứ tự

1. **Preflight:** `git status -sb`, `git diff --stat`, `git diff` để scope thay đổi; xác định entry point, ranh giới ownership, critical path (auth, payment, ghi dữ liệu, network).
   - Diff rỗng → hỏi user có muốn review staged changes hoặc commit range khác không
   - Diff lớn (>500 dòng) → tóm tắt theo file trước, review theo batch theo module
   - Nhóm finding theo tính năng logic, không theo thứ tự file

2. **SOLID + kiến trúc:** kiểm tra SRP (module ôm nhiều trách nhiệm không liên quan), OCP (sửa liên tục để thêm hành vi thay vì extension point), LSP (subclass phá vỡ kỳ vọng/cần type check), ISP (interface rộng có method không dùng), DIP (logic cấp cao phụ thuộc trực tiếp implementation cấp thấp). Đề xuất refactor phải giải thích tại sao cải thiện cohesion/coupling; nếu refactor lớn → đề xuất kế hoạch từng bước, không rewrite toàn bộ.

3. **Removal candidates:** xác định code không dùng/dư thừa/feature-flag tắt; phân biệt "xoá an toàn ngay" vs "hoãn lại kèm kế hoạch cụ thể".

4. **Security scan:** XSS, injection (SQL/NoSQL/command), SSRF, path traversal, lỗ hổng AuthZ/AuthN, thiếu tenancy check, rò rỉ secret/API key, thiếu rate limit, vòng lặp vô hạn, hotspot CPU/memory, deserialization không an toàn, crypto yếu, default không an toàn, race condition (concurrent access, check-then-act, TOCTOU, thiếu lock). Phải nêu rõ cả khả năng khai thác lẫn mức độ ảnh hưởng.

5. **Code quality scan:** error handling (exception bị nuốt, catch quá rộng, thiếu xử lý lỗi async), performance (N+1 query, CPU-intensive trong hot path, thiếu cache, memory không giới hạn), boundary conditions (null/undefined, collection rỗng, biên số, off-by-one). Đánh dấu các vấn đề có thể gây silent failure hoặc sự cố production.

6. **Output format bắt buộc:** Summary (số file/dòng, đánh giá tổng thể APPROVE/REQUEST_CHANGES/COMMENT) → Findings chia theo P0-P3 với file:line + mô tả + fix đề xuất → Removal/Iteration Plan (nếu có) → Additional Suggestions. Nếu không có issue → nêu rõ đã kiểm tra gì, phần nào chưa cover, rủi ro còn lại.

7. **Next steps:** sau khi trình bày findings, PHẢI hỏi user chọn 1 trong 4: Fix all / Fix P0-P1 only / Fix specific items / No changes. Không được tự ý implement fix khi chưa có xác nhận rõ ràng của user — đây là workflow review-first.

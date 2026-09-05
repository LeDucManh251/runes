---
name: writing-plans
description: Khi đã có spec/requirement cho task nhiều bước, TRƯỚC khi đụng vào code. Viết plan chi tiết bite-sized cho engineer không có context về codebase, kèm file cần sửa, code cụ thể, cách test.
---

# Writing Plans

Viết plan giả định engineer thực thi không có context gì về codebase — phải ghi rõ file nào cần sửa cho từng task, code cụ thể, cách test, docs cần xem.

Nguyên tắc xuyên suốt: DRY, YAGNI, TDD, commit thường xuyên.

Lưu plan tại `docs/superpowers/plans/YYYY-MM-DD-<feature-name>.md` (trừ khi user chỉ định nơi khác).

Thông báo khi bắt đầu dùng skill này.

## Scope check
Nếu spec bao gồm nhiều subsystem độc lập mà brainstorming chưa tách → phải đề xuất tách thành nhiều plan riêng, mỗi plan cho ra phần mềm chạy được/test được độc lập.

## File structure
Map trước file nào sẽ tạo/sửa và trách nhiệm của từng file — mỗi file một trách nhiệm rõ ràng, file thay đổi cùng nhau nên ở gần nhau, chia theo trách nhiệm chứ không theo layer kỹ thuật. Codebase có sẵn dùng file lớn thì không tự ý tái cấu trúc toàn bộ, nhưng nếu đang sửa 1 file đã quá cồng kềnh thì có thể đề xuất tách trong plan.

Task phải chia nhỏ (bite-sized), mỗi step là 1 hành động 2-5 phút (VD: viết failing test / chạy test xác nhận fail / implement tối thiểu / chạy test xác nhận pass / commit).

Mỗi plan PHẢI có header: tên feature, sub-skill bắt buộc để thực thi (subagent-driven-development hoặc executing-plans), Goal, Architecture, Tech Stack.

Mỗi task PHẢI có: đường dẫn file chính xác (Create/Modify/Test), code đầy đủ trong từng step, lệnh chạy chính xác kèm expected output.

## Cấm tuyệt đối (No Placeholders) — không bao giờ được viết
- "TBD", "TODO", "implement later", "fill in details"
- "Add appropriate error handling" / "add validation" / "handle edge cases" (chung chung, không cụ thể)
- "Write tests for the above" mà không có code test thật
- "Similar to Task N" (phải lặp lại code đầy đủ, không tham chiếu)
- Step mô tả phải-làm-gì mà không có code cụ thể
- Tham chiếu type/function/method chưa được định nghĩa ở task nào

## Self-review sau khi viết plan xong (tự làm, không dispatch subagent)
1. Spec coverage — mỗi phần trong spec có task tương ứng không, liệt kê gap nếu có
2. Placeholder scan — quét theo danh sách cấm ở trên, sửa ngay
3. Type consistency — tên hàm/method/property phải nhất quán xuyên suốt các task (không đổi tên giữa chừng)

## Sau khi lưu plan
Phải hỏi user chọn 1 trong 2 cách thực thi — Subagent-Driven (khuyến nghị, dispatch subagent riêng mỗi task + review 2 giai đoạn) hoặc Inline Execution (thực thi trong session, có checkpoint). Không tự ý chọn thay user.

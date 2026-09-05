---
name: systematic-debugging
description: Dùng cho MỌI bug, test fail, hay hành vi bất thường — trước khi đề xuất fix. Iron Law - không fix khi chưa điều tra ra root cause. Bao gồm 4 phase bắt buộc và các red flag phải dừng lại.
---

# Systematic Debugging

**Iron Law:** `KHÔNG FIX KHI CHƯA ĐIỀU TRA RA ROOT CAUSE`. Fix triệu chứng (symptom fix) = thất bại.

Áp dụng đặc biệt khi: đang bị áp lực thời gian, nghĩ "chỉ cần sửa nhanh", đã thử nhiều fix mà không được, chưa hiểu rõ vấn đề. KHÔNG được bỏ qua process dù bug có vẻ đơn giản hay đang gấp.

## 4 Phase bắt buộc, phải hoàn thành theo thứ tự

### 1. Root Cause Investigation
- Đọc kỹ toàn bộ error message/stack trace, không bỏ qua
- Reproduce bug ổn định (nếu không reproduce được → thu thập thêm dữ liệu, không đoán mò)
- Kiểm tra thay đổi gần đây (git diff, commit, dependency, config)
- Với hệ thống nhiều component: thêm log/instrumentation ở từng boundary để xác định chính xác nơi lỗi xảy ra, TRƯỚC khi đề xuất fix
- Trace data flow ngược từ điểm lỗi về nguồn gốc, fix tại nguồn chứ không phải tại nơi phát hiện triệu chứng

### 2. Pattern Analysis
- Tìm ví dụ tương tự đang chạy đúng trong cùng codebase
- Nếu theo pattern có sẵn, đọc reference implementation ĐẦY ĐỦ, không lướt qua
- Liệt kê MỌI khác biệt giữa cái chạy đúng và cái bị lỗi, kể cả khác biệt nhỏ
- Hiểu rõ dependency, config, assumption liên quan

### 3. Hypothesis and Testing
- Phát biểu rõ ràng MỘT hypothesis: "Tôi nghĩ X là root cause vì Y"
- Test bằng thay đổi nhỏ nhất có thể, một biến số một lần — không sửa nhiều thứ cùng lúc
- Sai → hình thành hypothesis MỚI, không chồng thêm fix lên fix cũ
- Nếu không hiểu → nói thẳng "tôi không hiểu X", không giả vờ biết, hỏi thêm/research thêm

### 4. Implementation
- Viết failing test case trước khi fix (bắt buộc)
- Chỉ sửa MỘT thay đổi tại một thời điểm, không tiện tay refactor/cải tiến thêm
- Verify: test pass, không phá test khác, vấn đề thực sự đã hết
- **Nếu fix không hoạt động:** DỪNG lại, đếm số lần đã thử
  - Dưới 3 lần → quay lại Phase 1, phân tích lại với thông tin mới
  - **Từ 3 lần trở lên → DỪNG, đặt câu hỏi về kiến trúc** (không thử fix #4 khi chưa thảo luận kiến trúc)

## Dấu hiệu kiến trúc có vấn đề (sau từ 3 fix thất bại trở lên)
Mỗi fix lộ ra vấn đề coupling/shared-state mới ở chỗ khác; fix đòi hỏi "refactor lớn"; mỗi fix tạo triệu chứng mới nơi khác → phải thảo luận với user trước khi tiếp tục, đây không phải hypothesis sai mà là kiến trúc sai.

## Red flags — thấy là phải DỪNG và quay lại Phase 1
- "Sửa nhanh đã, điều tra sau" / "cứ thử đổi X xem sao" / "thử nhiều thay đổi rồi chạy test"
- "Bỏ qua test, tôi verify tay" / "chắc là X, sửa cái đó đi"
- "Không hiểu hết nhưng có thể sẽ work" / đề xuất fix trước khi trace data flow
- "Thử thêm 1 lần nữa" (khi đã thử từ 2 lần trở lên) / mỗi fix lộ vấn đề mới ở chỗ khác

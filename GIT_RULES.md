# 📕 Sổ Tay Quy Tắc Dùng Git Cho Team
Để dự án không bị "toang" vì ghi đè code của nhau, mọi người (kể cả Tech Lead) bắt buộc tuân thủ 3 quy tắc thép dưới đây.
---
## Quy Tắc 1: Hệ thống 3 Nhánh (Không ai được chọc thẳng vào nhà chính)
* 👑 **Nhánh `main` (Nhà chính):** Chỉ chứa code hoàn chỉnh, không lỗi, dùng để nộp báo cáo. **CẤM PUSH THẲNG.**
* 🛠️ **Nhánh `dev` (Xưởng lắp ráp):** Nơi gom code của 3 người lại với nhau để chạy thử. **CẤM PUSH THẲNG.**
* 👨‍💻 **Nhánh `cá nhân` (Bàn làm việc):** Nơi bạn tự do code. Tên nhánh phải tuân thủ Quy tắc 2.
---

## Quy Tắc 2: Đặt tên nhánh (Branch Naming)
Không đặt tên nhánh chung chung kiểu `nhanh-cua-nam` hay `test123`. Hãy đặt theo cú pháp:
`loại-chức-năng/tên-ngắn-gọn`
**Các loại tiền tố:**
* `feature/...` : Dùng khi làm tính năng mới. *(VD: `feature/khach-hang`, `feature/bds-upload-anh`)*
* `fix/...` : Dùng khi sửa lỗi. *(VD: `fix/loi-dang-nhap`, `fix/nut-bam-bi-lech`)*
👉 **Lệnh tạo nhánh:** `git checkout -b feature/ten-nhanh-cua-ban`
---

## Quy Tắc 3: Viết Commit Message (Ghi chú lưu code)
Mỗi lần gõ `git commit`, bạn đang lưu lại một mốc thời gian. Hãy viết ghi chú rõ ràng để sau này web sập còn biết đường tìm lại file bị lỗi.
**Cú pháp:** `[Loại] - Mô tả ngắn gọn bằng tiếng Việt`
* `[Thêm]` - Thêm file, giao diện, tính năng mới.
* `[Sửa]` - Sửa logic, sửa giao diện, sửa lỗi.
* `[Xóa]` - Xóa file, bỏ tính năng thừa.
👉 **Ví dụ đúng:** `git commit -m "[Thêm] form đăng nhập cho nhân viên"`
👉 *Ví dụ sai:* `git commit -m "xong", "luu code", "asdasd"`
---

## 🚀 Luồng Code Hàng Ngày (Copy - Paste chạy theo thứ tự)
Mỗi ngày mở máy lên làm việc, hãy làm ĐÚNG 4 BƯỚC này:
### Bước 1: Đầu ngày - Lấy code mới nhất từ xưởng chung về máy
```bash
git checkout dev
git pull origin dev
```
### Bước 2: Tách ra bàn làm việc riêng để code
```Bash
git checkout -b feature/ten-chuc-nang-hom-nay
(Bây giờ bạn cứ mở VS Code lên, code thoải mái cả ngày)
```
### Bước 3: Cuối ngày - Lưu code và đẩy lên bàn riêng trên mạng
```Bash
git add .
git commit -m "[Thêm] làm xong bảng hiển thị khách hàng"
git push origin feature/ten-chuc-nang-hom-nay
```

### Bước 4: Nộp bài (Tạo Pull Request)
Lên trang GitHub của dự án.
Bấm nút màu xanh Compare & pull request.
⚠️ CHÚ Ý QUAN TRỌNG: Chọn đích đến (base) là nhánh dev (KHÔNG PHẢI main).
Đúng: base: dev <--- compare: feature/ten-chuc-nang
Bấm Create Pull Request
Sau khi PR được duyệt và gộp vào dev, bạn có thể xóa nhánh cá nhân đó đi.
### 💡 Cấp cứu: Nếu lỡ thấy báo lỗi CHỮ ĐỎ (Conflict) khi push/pull:
Tuyệt đối KHÔNG được dùng lệnh git push -f (Đẩy ép buộc). 
Hãy dừng lại, giữ nguyên hiện trường và hú Tech Lead vào Teamviewer/Ultraviewer để gỡ rối!
Nhánh `main` chỉ nên nhận code từ nhánh `dev` vào những ngày cuối tuần sau khi cả nhóm đã test chán chê trên `dev` rồi. Đây là "best practice" (thực hành tốt nhất) của ngành phần mềm.
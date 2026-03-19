## 🚀 Hướng Dẫn Cài Đặt Lần Đầu (Dành cho Dev mới Clone code về)
Vì lý do bảo mật và tối ưu dung lượng, thư viện (`node_modules`) và cấu hình mạng (`.env`) không được đưa lên GitHub. Các thành viên hãy làm đúng theo các bước sau để chạy dự án:

### Bước 1: Clone dự án về máy
```bash
git clone <đường-link-github-của-dự-án>
cd quan-ly-bat-dong-san
```
### Bước 2: Cài đặt thư viện (Chạy lệnh ở cả 2 thư mục)
Mở 2 Terminal riêng biệt:
Terminal 1 (Dành cho Backend):
```bash
cd backend
npm install
```
Terminal 2 (Dành cho Frontend):
```bash
cd frontend
npm install
```
### Bước 3: Cấu hình biến môi trường (.env)
Di chuyển vào thư mục backend/.
Tạo một file mới tên là .env (Lưu ý có dấu chấm ở đầu).
Copy nội dung sau dán vào file .env và sửa lại DB_PASSWORD cho đúng với XAMPP/WAMP trên máy của bạn:
```bash
PORT=3000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=qlbds_db
```
### Bước 4: Khởi động dự án
Ở Terminal Backend: Chạy lệnh 
```bash
npm run dev 
(hoặc node server.js).
```
Ở Terminal Frontend: Chạy lệnh 
```bash
npm run dev
```
Mở trình duyệt truy cập: http://localhost:5173.

## 📂 Quy Chuẩn Cấu Trúc Thư Mục (Bắt buộc tuân thủ)
Để code không bị lộn xộn, nhóm chúng ta sẽ chia file theo đúng cấu trúc sau:
## ⚙️ Phía Backend (Thư mục backend/)
Chia nhỏ mô hình theo chuẩn MVC (Model - View - Controller) (nhưng View thì để React lo):
```bash
    models/: Tạo file KhachHang.js, NhanVien.js, HopDong.js... để định nghĩa các cột dữ liệu y như sơ đồ ERD.
    controllers/: Tạo file khachHangController.js chứa các hàm xử lý logic (ví dụ: hàm báo lỗi nếu Khách hàng chưa đủ 18 tuổi, logic tính toán doanh thu).
    routes/: Tạo file khachHangRoutes.js chứa các đường link API (ví dụ: POST /api/khachhang).
    server.js: Lúc này chỉ còn khoảng 15-20 dòng, có nhiệm vụ duy nhất là gọi (import) các file Routes kia vào để chạy.
```
## 🎨 Phía Frontend (Thư mục frontend/src/)
Thay vì nhét mọi giao diện vào App.jsx, nhóm sẽ chia nhỏ ra:
```bash
    pages/: Tạo file DanhSachKhachHang.jsx, ThemHopDong.jsx... Đây là các màn hình thực tế, chứa giao diện chính của từng trang.
    components/: Tạo file Sidebar.jsx (Thanh menu bên trái), Header.jsx. Code 1 lần, xài lại ở mọi trang để tránh lặp code.
    services/: Tạo file api.js chuyên chứa link cấu hình Axios để gọi xuống Backend.
    App.jsx: Giống như một cái "Bản đồ". Nó dùng thư viện react-router-dom để quy định: "Nếu user gõ URL /khach-hang, hãy hiển thị file DanhSachKhachHang.jsx".
```
## 🛡️ Quy Trình Làm Việc Với Git 
👉 **BẮT BUỘC ĐỌC KỸ:** Để biết cách đặt tên nhánh, cách viết commit và luồng gõ lệnh hàng ngày, toàn bộ team vui lòng đọc file [GIT_RULES.md] trước khi gõ dòng code đầu tiên!
Tuyệt đối không push thẳng lên nhánh main.
Trước khi code, hãy tạo nhánh mới: git checkout -b ten-tinh-nang
Code xong, lưu và đẩy lên:
```bash
    git add .
    git commit -m "Mô tả việc vừa làm"
    git push origin ten-tinh-nang
```
Lên GitHub tạo Pull Request (PR) để gộp vào dev
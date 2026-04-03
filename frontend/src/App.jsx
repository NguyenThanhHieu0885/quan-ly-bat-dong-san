import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ConfigProvider } from "antd";
import AdminLayout from "./layouts/AdminLayout";
// --- Import các trang quản lý chính ---
// import của Hiếu
import QuanLyNhanVien from './pages/QuanLyNhanVien';
// import của Phương Minh
import DanhSachBDS from './pages/DanhSachBDS';
// import của Lân
import KhachHang from "./pages/khachhang/KhachHang";
import AddKhachHang from "./pages/khachhang/AddKhachHang";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import Dashboard from "./pages/dashboard/Dashboard";
// --- Import của Nam (module Ký Gửi) ---
import TaoKyGui from './pages/kygui/TaoKyGui';
import QuanLyKyGui from './pages/kygui/QuanLyKyGui';
import SuaKyGui from './pages/kygui/SuaKyGui';

// ===== AUTH CHECK =====
const isAuthenticated = () => !!localStorage.getItem("token");
const getRole = () => localStorage.getItem("role");

// ===== ROUTE GUARDS =====
const PrivateRoute = ({ children }) => (
  isAuthenticated() ? children : <Navigate to="/login" replace />
);

const PublicRoute = ({ children }) => (
  isAuthenticated() ? <Navigate to="/" replace /> : children
);

const RoleRoute = ({ children, allow }) => {
  const role = getRole();
  return allow.includes(role) ? children : <Navigate to="/" replace />;
};

// Component placeholder cho các trang chưa làm (để tránh lỗi undefined)
const Placeholder = ({ title }) => <div style={{ padding: 20 }}><h2>{title}</h2></div>;

function App() {
  return (
    <ConfigProvider theme={{ token: { colorPrimary: "#1677ff", borderRadius: 6 } }}>
      <BrowserRouter>
        <Routes>
          {/* AUTH ROUTES */}
          <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
          <Route path="/register" element={<Register />} />

          {/* ADMIN ROUTES */}
          <Route path="/" element={<PrivateRoute><AdminLayout /></PrivateRoute>}>
            <Route index element={<Dashboard />} />
            
            {/* MODULE KHACH HANG */}
            <Route path="khach-hang" element={<KhachHang />} />
            <Route path="khach-hang/add" element={<AddKhachHang />} />

            {/* MODULE NHAN VIEN (ADMIN ONLY) */}
            <Route
              path="nhan-vien"
              element={
                <RoleRoute allow={["admin"]}>
                  <QuanLyNhanVien />
                </RoleRoute>
              }
            />

            {/* CÁC MODULE KHÁC */}
            <Route path="danh-sach-bds" element={<DanhSachBDS />} />
            <Route path="bat-dong-san/add" element={<Placeholder title="Thêm Bất Động Sản" />} />
            
            {/* Thay thế Placeholder bằng các Route thực tế của module Ký Gửi */}
            <Route path="quan-ly-ky-gui" element={<QuanLyKyGui />} />
            <Route path="tao-ky-gui" element={<TaoKyGui />} />
            <Route path="sua-ky-gui/:id" element={<SuaKyGui />} />
            
            <Route path="hop-dong-dat-coc" element={<Placeholder title="Hợp đồng Đặt cọc" />} />
            <Route path="hop-dong-chuyen-nhuong" element={<Placeholder title="Hợp đồng Chuyển nhượng" />} />
          </Route>

          {/* FALLBACK */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </BrowserRouter>
    </ConfigProvider>
  );
}

export default App;
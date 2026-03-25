import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ConfigProvider } from 'antd';
import AdminLayout from './components/AdminLayout';
import KhachHang from './pages/KhachHang';

// --- Các Component giả lập ---
const Login = () => {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', background: '#f0f2f5' }}>
      <div style={{ padding: 40, background: 'white', borderRadius: 8, textAlign: 'center', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
        <h2>ĐĂNG NHẬP HỆ THỐNG</h2>
        <p>(Chỗ này sau này Hiếu sẽ gắn Form Ant Design vào)</p>
        <button onClick={() => window.location.href = '/'}>
          Bấm tạm vào đây để giả vờ Đăng nhập thành công
        </button>
      </div>
    </div>
  );
};

const TongQuan = () => <h2>Trang Tổng Quan (Thống kê doanh thu, số lượng BĐS...)</h2>;

const NhanVien = () => <h2>Trang Quản lý Nhân Viên</h2>;
const BatDongSan = () => <h2>Trang Quản lý Bất Động Sản</h2>;
const HopDongKyGui = () => <h2>Trang HĐ Ký Gửi</h2>;
const HopDongDatCoc = () => <h2>Trang HĐ Đặt Cọc</h2>;
const HopDongChuyenNhuong = () => <h2>Trang HĐ Chuyển Nhượng</h2>;

function App() {
  return (
    <ConfigProvider theme={{ token: { colorPrimary: '#1677ff', colorBgContainer: '#ffffff', borderRadius: 6 }}}>
      <BrowserRouter>
        <Routes>
          {/* THẾ GIỚI BÊN NGOÀI: Trang Login đứng độc lập, không có Sidebar */}
          <Route path="/login" element={<Login />} />

          {/* THẾ GIỚI BÊN TRONG: Bọc bởi AdminLayout */}
          <Route path="/" element={<AdminLayout />}>
            {/* Vừa đăng nhập xong (đường dẫn /) sẽ tự động vào trang Tổng Quan */}
            <Route index element={<TongQuan />} />
            
            {/* 6 Usecase của nhóm */}
            <Route path="khach-hang" element={<KhachHang />} />
            <Route path="nhan-vien" element={<NhanVien />} />
            <Route path="bat-dong-san" element={<BatDongSan />} />
            <Route path="hop-dong-ky-gui" element={<HopDongKyGui />} />
            <Route path="hop-dong-dat-coc" element={<HopDongDatCoc />} />
            <Route path="hop-dong-chuyen-nhuong" element={<HopDongChuyenNhuong />} />
          </Route>

          {/* Nếu user gõ bậy bạ một đường link không tồn tại, tự động đá về trang chủ */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </ConfigProvider>
  );
}

export default App;
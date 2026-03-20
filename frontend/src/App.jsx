import { Routes, Route, Navigate, Outlet } from 'react-router-dom';
import Login from './pages/Auth/Login';
import ListKhachHang from './pages/KhachHang/ListKhachHang';
import AddKhachHang from './pages/KhachHang/AddKhachHang';
import ListBatDongSan from './pages/BatDongSan/ListBatDongSan';
import Sidebar from './components/Sidebar';

// 1. Chốt chặn bảo mật: Không có user trong localStorage thì đá về Login
const ProtectedRoute = () => {
  const user = JSON.parse(localStorage.getItem('user'));
  return user ? <Outlet /> : <Navigate to="/login" replace />;
};

// 2. Layout chung: Sidebar cố định bên trái, Nội dung bên phải
const MainLayout = ({ children }) => (
  <div className="flex bg-[#f8fafc] min-h-screen">
    <Sidebar />
    {/* Đổi ml-64 thành ml-72 ở dòng dưới đây */}
    <div className="flex-1 ml-72 overflow-x-hidden transition-all duration-300"> 
      {children}
    </div>
  </div>
);
// 3. Nội dung Dashboard (Trang chủ sau khi đăng nhập)
const Dashboard = () => {
  return (
    <div className="p-8">
      <header className="mb-10 flex justify-between items-end">
        <div>
          <h2 className="text-4xl font-black text-[#1e293b] tracking-tight uppercase">Bảng Điều Khiển</h2>
          <p className="text-slate-400 font-bold text-xs uppercase tracking-widest mt-1">Hệ thống quản lý dịch vụ bất động sản</p>
        </div>
        <div className="text-right">
          <p className="text-sm font-bold text-slate-500 uppercase">Hôm nay</p>
          <p className="text-lg font-black text-blue-600 tracking-tighter">20 Tháng 03, 2026</p>
        </div>
      </header>

      {/* Thẻ chỉ số (Stats) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
        <div className="bg-white p-7 rounded-[2rem] shadow-[0_10px_40px_-15px_rgba(0,0,0,0.05)] border border-slate-100 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-blue-50 rounded-bl-[4rem] -mr-8 -mt-8 transition-all group-hover:scale-110"></div>
          <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mb-2 relative">Khách hàng mới</p>
          <h3 className="text-4xl font-black text-[#0f172a] relative">128</h3>
          <p className="text-emerald-500 text-sm mt-3 font-bold">▲ 12.5%</p>
        </div>
        
        <div className="bg-white p-7 rounded-[2rem] shadow-[0_10px_40px_-15px_rgba(0,0,0,0.05)] border border-slate-100">
          <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mb-2">BĐS Ký gửi</p>
          <h3 className="text-4xl font-black text-[#0f172a]">45</h3>
          <p className="text-slate-400 text-sm mt-3 font-medium italic">Đang chờ khảo sát</p>
        </div>

        <div className="bg-white p-7 rounded-[2rem] shadow-[0_10px_40px_-15px_rgba(0,0,0,0.05)] border border-slate-100">
          <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mb-2">HĐ Đặt cọc</p>
          <h3 className="text-4xl font-black text-[#0f172a]">12</h3>
          <p className="text-amber-500 text-sm mt-3 font-bold uppercase italic">Cần xử lý</p>
        </div>

        <div className="bg-white p-7 rounded-[2rem] shadow-[0_20px_50px_-12px_rgba(37,99,235,0.15)] border border-blue-100 bg-gradient-to-br from-white to-blue-50">
          <p className="text-blue-400 text-[10px] font-black uppercase tracking-widest mb-2">Doanh thu dự kiến</p>
          <h3 className="text-4xl font-black text-blue-700 italic">2.4<span className="text-xl ml-1">Tỷ</span></h3>
          <p className="text-blue-400 text-[10px] mt-3 font-bold">Phí dịch vụ & Huê hồng</p>
        </div>
      </div>

      {/* Giao dịch gần đây */}
      <div className="bg-white p-10 rounded-[2.5rem] shadow-[0_15px_50px_-15px_rgba(0,0,0,0.05)] border border-slate-50">
        <h3 className="text-2xl font-black text-[#1e293b] mb-10 flex items-center gap-3">
          <span className="w-1.5 h-8 bg-blue-600 rounded-full"></span> Giao dịch gần đây
        </h3>
        <div className="grid gap-6">
          {[
            {type: 'ĐC', title: 'Hợp đồng đặt cọc', time: '2 giờ trước', user: 'Hoàng Đặng Diệp Lân', color: 'bg-blue-600'},
            {type: 'KG', title: 'Nhận ký gửi BĐS', time: '5 giờ trước', user: 'Nguyễn Văn B', color: 'bg-slate-800'},
            {type: 'CN', title: 'Văn bản chuyển nhượng', time: '1 ngày trước', user: 'Hoàng Đặng Diệp Lân', color: 'bg-emerald-600'}
          ].map((item, idx) => (
            <div key={idx} className="flex items-center justify-between p-6 rounded-3xl hover:bg-slate-50 transition-all border border-transparent hover:border-slate-100 group">
              <div className="flex items-center gap-6">
                <div className={`w-14 h-14 ${item.color} text-white rounded-2xl flex items-center justify-center font-black text-lg shadow-lg rotate-3 group-hover:rotate-0 transition-transform`}>
                  {item.type}
                </div>
                <div>
                  <h4 className="font-black text-[#1e293b] text-lg">{item.title}</h4>
                  <p className="text-sm text-slate-400 font-medium">{item.user} • {item.time}</p>
                </div>
              </div>
              <span className="px-5 py-2 rounded-full text-[10px] font-black uppercase bg-emerald-50 text-emerald-600 border border-emerald-100">Hoàn tất</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// 4. Định nghĩa Route cho toàn ứng dụng
function App() {
  return (
    <Routes>
      {/* Route công khai */}
      <Route path="/login" element={<Login />} />

      {/* Nhóm Route yêu cầu Đăng nhập */}
      <Route element={<ProtectedRoute />}>
        <Route path="/" element={<MainLayout><Dashboard /></MainLayout>} />
        <Route path="/khach-hang" element={<MainLayout><ListKhachHang /></MainLayout>} />
        <Route path="/them-khach-hang" element={<MainLayout><AddKhachHang /></MainLayout>} />
        <Route path="/bat-dong-san" element={<MainLayout><ListBatDongSan /></MainLayout>} />
        <Route path="/hop-dong" element={<MainLayout><div className="p-8 font-black text-slate-400 italic">Tính năng Quản lý Hợp đồng đang được phát triển...</div></MainLayout>} />
      </Route>

      {/* Mặc định quay về Login nếu sai đường dẫn */}
      <Route path="*" element={<Navigate to="/login" />} />
    </Routes>
  );
}

export default App;
import { Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { useEffect, useState } from "react";
import Login from './pages/Auth/Login';
import ListKhachHang from './pages/KhachHang/ListKhachHang';
import AddKhachHang from './pages/KhachHang/AddKhachHang';
import ListBatDongSan from './pages/BatDongSan/ListBatDongSan';
import Sidebar from './components/Sidebar';

/* ---------- AUTH ---------- */
const ProtectedRoute = () => {
  const user = JSON.parse(localStorage.getItem('user'));
  return user ? <Outlet /> : <Navigate to="/login" replace />;
};

/* ---------- LAYOUT ---------- */
const MainLayout = ({ children }) => (
  <div className="flex bg-[#f8fafc] min-h-screen">
    <Sidebar />
    <div className="flex-1 ml-72 overflow-x-hidden transition-all duration-300">
      {children}
    </div>
  </div>
);

/* ---------- DASHBOARD ---------- */
const Dashboard = () => {
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setNow(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatDate = (date) =>
    date.toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });

  const formatTime = (date) =>
    date.toLocaleTimeString("vi-VN", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });

  return (
    <div className="p-8 bg-slate-100 min-h-screen">
      <div className="max-w-7xl mx-auto">

        {/* HEADER */}
        <header className="mb-10 flex justify-between items-end">
          <div>
            <h2 className="text-3xl font-bold tracking-tight text-slate-900">
              Bảng điều khiển
            </h2>
            <p className="text-sm text-slate-500 mt-1">
              Hệ thống quản lý dịch vụ bất động sản
            </p>
          </div>

          <div className="text-right">
            <p className="text-xs font-semibold text-slate-400 uppercase">
              Hôm nay
            </p>
            <p className="text-lg font-semibold text-blue-600">
              {formatDate(now)}
            </p>
            <p className="text-xs text-slate-400 mt-1">
              {formatTime(now)}
            </p>
          </div>
        </header>

        {/* STATS */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">

          {/* CARD 1 */}
          <div className="bg-white p-6 rounded-2xl border shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-200 relative overflow-hidden group cursor-pointer">
            <div className="absolute top-0 right-0 w-20 h-20 bg-blue-50 rounded-bl-[3rem] -mr-6 -mt-6 group-hover:scale-125 group-hover:rotate-6 transition-all duration-300" />
            <p className="text-xs text-slate-400 font-semibold uppercase mb-2">
              Khách hàng mới
            </p>
            <h3 className="text-3xl font-bold text-slate-900">128</h3>
            <p className="text-green-500 text-sm mt-2 font-medium">▲ 12.5%</p>
          </div>

          {/* CARD 2 */}
          <div className="bg-white p-6 rounded-2xl border shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-200 cursor-pointer">
            <p className="text-xs text-slate-400 font-semibold uppercase mb-2">
              BĐS ký gửi
            </p>
            <h3 className="text-3xl font-bold text-slate-900">45</h3>
            <p className="text-slate-400 text-sm mt-2">
              Đang chờ khảo sát
            </p>
          </div>

          {/* CARD 3 */}
          <div className="bg-white p-6 rounded-2xl border shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-200 cursor-pointer">
            <p className="text-xs text-slate-400 font-semibold uppercase mb-2">
              HĐ đặt cọc
            </p>
            <h3 className="text-3xl font-bold text-slate-900">12</h3>
            <p className="text-amber-500 text-sm mt-2 font-medium">
              Cần xử lý
            </p>
          </div>

          {/* CARD 4 */}
          <div className="bg-gradient-to-br from-white to-blue-50 p-6 rounded-2xl border border-blue-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-200 cursor-pointer">
            <p className="text-xs text-blue-400 font-semibold uppercase mb-2">
              Doanh thu
            </p>
            <h3 className="text-2xl font-bold text-blue-700">
              2.4 <span className="text-base">Tỷ</span>
            </h3>
            <p className="text-blue-400 text-xs mt-2">
              Phí dịch vụ & hoa hồng
            </p>
          </div>

        </div>

        {/* RECENT */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border">
          <h3 className="text-lg font-semibold text-slate-900 mb-6 flex items-center gap-2">
            <span className="w-1 h-6 bg-blue-600 rounded-full"></span>
            Giao dịch gần đây
          </h3>

          <div className="space-y-4">
            {[
              { type: 'ĐC', title: 'Hợp đồng đặt cọc', time: '2 giờ trước', user: 'Hoàng Đặng Diệp Lân', color: 'bg-blue-600' },
              { type: 'KG', title: 'Nhận ký gửi BĐS', time: '5 giờ trước', user: 'Nguyễn Văn B', color: 'bg-slate-800' },
              { type: 'CN', title: 'Văn bản chuyển nhượng', time: '1 ngày trước', user: 'Hoàng Đặng Diệp Lân', color: 'bg-emerald-600' }
            ].map((item, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between p-4 rounded-xl hover:bg-slate-50 hover:shadow-sm hover:-translate-y-[2px] transition-all duration-200 border border-transparent hover:border-slate-200 cursor-pointer group"
              >
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 ${item.color} text-white rounded-xl flex items-center justify-center font-bold text-sm shadow-md group-hover:scale-110 transition-all`}>
                    {item.type}
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-900">
                      {item.title}
                    </h4>
                    <p className="text-xs text-slate-400">
                      {item.user} • {item.time}
                    </p>
                  </div>
                </div>

                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-green-50 text-green-600 border border-green-100">
                  Hoàn tất
                </span>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};

/* ---------- ROUTES ---------- */
function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />

      <Route element={<ProtectedRoute />}>
        <Route path="/" element={<MainLayout><Dashboard /></MainLayout>} />
        <Route path="/khach-hang" element={<MainLayout><ListKhachHang /></MainLayout>} />
        <Route path="/them-khach-hang" element={<MainLayout><AddKhachHang /></MainLayout>} />
        <Route path="/bat-dong-san" element={<MainLayout><ListBatDongSan /></MainLayout>} />
        <Route path="/hop-dong" element={<MainLayout><div className="p-8 font-black text-slate-400 italic">Tính năng đang phát triển...</div></MainLayout>} />
      </Route>

      <Route path="*" element={<Navigate to="/login" />} />
    </Routes>
  );
}

export default App;
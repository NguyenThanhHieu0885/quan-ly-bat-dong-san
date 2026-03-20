import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  Building2, 
  FileText, 
  LogOut, 
  ChevronRight 
} from 'lucide-react';

const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <div className="w-72 h-screen bg-white text-slate-600 fixed left-0 top-0 shadow-[0_0_20px_rgba(0,0,0,0.03)] z-50 flex flex-col justify-between border-r border-slate-100">
      
      <div className="flex flex-col flex-1">
        {/* Logo Header - Nhìn sáng sủa và "xịn" hơn */}
        <div className="p-10 mb-2">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center shadow-xl shadow-blue-100 group cursor-pointer">
              <Building2 className="text-white w-7 h-7 group-hover:rotate-12 transition-transform duration-300" />
            </div>
            <div>
              <h1 className="text-slate-900 font-black text-xl leading-tight tracking-tighter uppercase">BĐS PRO</h1>
              <p className="text-[11px] text-blue-500 font-black uppercase tracking-widest mt-0.5">Management System</p>
            </div>
          </div>
        </div>

        {/* Navigation Menu - Chữ to, khoảng cách thoáng */}
        <nav className="px-6 space-y-3">
          <p className="px-4 text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] mb-6">Hệ thống quản lý</p>
          
          {/* Menu Items */}
          {[
            { path: '/', label: 'Tổng quan', icon: LayoutDashboard, color: 'text-blue-500' },
            { path: '/khach-hang', label: 'Quản lý Khách hàng', icon: Users, color: 'text-orange-500' },
            { path: '/bat-dong-san', label: 'Quản lý Nhà đất', icon: Building2, color: 'text-emerald-500' },
            { path: '/hop-dong', label: 'Hợp đồng & Giao dịch', icon: FileText, color: 'text-purple-500' },
          ].map((item) => (
            <Link 
              key={item.path}
              to={item.path} 
              className={`flex items-center justify-between p-4 rounded-2xl transition-all duration-300 group ${
                isActive(item.path) 
                ? 'bg-blue-50 text-blue-700 shadow-sm border border-blue-100' 
                : 'hover:bg-slate-50 hover:text-slate-900 text-slate-500'
              }`}
            >
              <div className="flex items-center gap-4">
                <item.icon className={`w-6 h-6 transition-colors ${isActive(item.path) ? 'text-blue-600' : 'text-slate-400 group-hover:' + item.color}`} />
                <span className="font-extrabold text-[15px] tracking-tight">{item.label}</span>
              </div>
              {isActive(item.path) && <div className="w-1.5 h-1.5 bg-blue-600 rounded-full shadow-[0_0_10px_rgba(37,99,235,0.5)]"></div>}
            </Link>
          ))}
        </nav>
      </div>

      {/* User Section - Trắng tinh khôi, nút Logout đỏ rõ rệt */}
      <div className="p-6">
        <div className="p-4 rounded-[2rem] bg-slate-50 border border-slate-100 flex items-center gap-4 group">
          <div className="w-12 h-12 rounded-2xl bg-white shadow-sm flex items-center justify-center text-blue-600 font-black text-lg border border-slate-100">
            L
          </div>
          <div className="flex-1 overflow-hidden">
            <p className="text-sm font-black text-slate-900 truncate tracking-tighter">Diệp Lân</p>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Admin / Sales</p>
          </div>
          <button 
            onClick={handleLogout} 
            className="w-10 h-10 flex items-center justify-center text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all cursor-pointer shadow-sm bg-white border border-slate-100"
            title="Đăng xuất"
          >
            <LogOut className="w-5 h-5" />
          </button>
        </div>
        <p className="text-center text-[10px] text-slate-300 font-bold mt-4 uppercase tracking-[0.3em]">BĐS Manager v1.0</p>
      </div>
    </div>
  );
};

export default Sidebar;
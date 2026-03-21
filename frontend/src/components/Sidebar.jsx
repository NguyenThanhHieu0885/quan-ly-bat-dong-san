import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  Building2, 
  FileText, 
  LogOut 
} from 'lucide-react';

const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;

  const menu = [
    { path: '/', label: 'Tổng quan', icon: LayoutDashboard },
    { path: '/khach-hang', label: 'Quản lý khách hàng', icon: Users },
    { path: '/bat-dong-san', label: 'Quản lý nhà đất', icon: Building2 },
    { path: '/hop-dong', label: 'Hợp đồng & giao dịch', icon: FileText },
  ];

  return (
    <div className="w-72 h-screen bg-white fixed left-0 top-0 border-r border-slate-200 flex flex-col justify-between">

      {/* TOP */}
      <div>
        {/* Logo */}
        <div className="p-8 flex items-center gap-3">
          <div className="w-11 h-11 bg-blue-600 rounded-xl flex items-center justify-center">
            <Building2 className="text-white w-6 h-6" />
          </div>
          <div>
            <h1 className="text-slate-900 font-semibold text-lg">
              BĐS PRO
            </h1>
            <p className="text-xs text-slate-400">
              Management System
            </p>
          </div>
        </div>

        {/* Menu */}
        <nav className="px-3 space-y-2">
          <p className="px-3 text-xs text-slate-500 font-semibold uppercase mb-3">
            Hệ thống
          </p>

          {menu.map((item) => {
            const active = isActive(item.path);

            return (
              <Link
                key={item.path}
                to={item.path}
                className={`relative flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 group ${
                  active
                    ? "bg-blue-50 text-blue-600"
                    : "text-slate-700 hover:bg-slate-50 hover:text-slate-900"
                }`}
              >
                {/* ACTIVE BAR */}
                <span
                  className={`absolute left-0 top-1/2 -translate-y-1/2 h-6 w-1 rounded-r-full transition-all duration-300 ${
                    active
                      ? "bg-blue-600 opacity-100"
                      : "opacity-0 group-hover:opacity-50 bg-blue-400"
                  }`}
                />

                {/* ICON */}
                <item.icon
                  className={`w-5 h-5 transition ${
                    active
                      ? "text-blue-600"
                      : "text-slate-500 group-hover:text-blue-500"
                  }`}
                />

                {/* TEXT */}
                <span className="text-base font-semibold tracking-tight">
                  {item.label}
                </span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* USER */}
      <div className="p-5 border-t border-slate-200">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center font-semibold">
            L
          </div>

          <div className="flex-1">
            <p className="text-sm font-semibold text-slate-900">
              Diệp Lân
            </p>
            <p className="text-xs text-slate-400">
              Admin
            </p>
          </div>

          <button
            onClick={handleLogout}
            className="p-2 rounded-md text-slate-400 hover:text-red-500 hover:bg-red-50 transition"
          >
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
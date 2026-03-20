import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Building2, User, Lock, Eye, EyeOff } from 'lucide-react'; // Sử dụng Lucide để chuyên nghiệp hơn

const Login = () => {
  const [taikhoan, setTaikhoan] = useState('');
  const [matkhau, setMatkhau] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    if (!taikhoan || !matkhau) {
      setError("Vui lòng nhập đầy đủ tài khoản và mật khẩu");
      return;
    }

    if (taikhoan === 'admin' && matkhau === '123456') {
      const userMock = {
        nvid: 'NV001',
        tennv: 'Hoàng Đặng Diệp Lân',
        quyen: 0 
      };
      localStorage.setItem('user', JSON.stringify(userMock));
      navigate('/');
    } else {
      setError("Tài khoản hoặc mật khẩu không chính xác");
    }
  };

  return (
    <div className="min-h-screen bg-[#f1f5f9] flex items-center justify-center p-6 relative overflow-hidden">
      {/* Các khối màu trang trí phía sau để tạo chiều sâu */}
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-blue-100 rounded-full blur-3xl opacity-50"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-indigo-100 rounded-full blur-3xl opacity-50"></div>

      <div className="bg-white p-10 rounded-[2.5rem] shadow-[0_20px_50px_-15px_rgba(0,0,0,0.08)] w-full max-w-md border border-white relative z-10">
        <div className="text-center mb-10">
          <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-blue-200">
            <Building2 className="text-white w-8 h-8" />
          </div>
          <h2 className="text-3xl font-black text-slate-800 tracking-tight">XIN CHÀO!</h2>
          <p className="text-slate-400 mt-2 font-bold text-xs uppercase tracking-[0.2em]">Hệ thống quản lý BĐS</p>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 p-4 rounded-2xl text-xs mb-8 text-center font-bold border border-red-100 animate-shake">
            {error}
          </div>
        )}

        <form className="space-y-6" onSubmit={handleLogin}>
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-4">Tài khoản</label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <User className="h-5 w-5 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
              </div>
              <input 
                type="text" 
                className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all font-bold text-slate-700 placeholder:text-slate-300" 
                placeholder="Nhập taikhoan..." 
                value={taikhoan}
                onChange={(e) => setTaikhoan(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-4">Mật khẩu</label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
              </div>
              <input 
                type={showPassword ? "text" : "password"} 
                className="w-full pl-12 pr-12 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all font-bold text-slate-700 placeholder:text-slate-300" 
                placeholder="••••••••" 
                value={matkhau}
                onChange={(e) => setMatkhau(e.target.value)}
              />
              <button 
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-blue-500 transition-colors"
              >
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
          </div>

          <button 
            type="submit"
            className="w-full bg-blue-600 text-white py-4 rounded-2xl font-black text-sm hover:bg-blue-700 shadow-xl shadow-blue-500/20 active:scale-95 transition-all uppercase tracking-[0.2em] mt-4"
          >
            Đăng nhập ngay
          </button>
        </form>

        <div className="mt-10 text-center">
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">
            © 2026 Quản lý BĐS • <span className="text-blue-500">v1.0.5</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
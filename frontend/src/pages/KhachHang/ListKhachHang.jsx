import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Plus, Edit2, Trash2, User, Building } from 'lucide-react';

const ListKhachHang = () => {
  const navigate = useNavigate();
  // Giả lập danh sách khách hàng từ Database
  const [customers] = useState([
    { id: 1, hoten: 'Hoàng Đặng Diệp Lân', cmnd: '123456789', sodienthoai: '0901234567', loaikh: 0 },
    { id: 2, hoten: 'Công ty BĐS ABC', cmnd: '987654321', sodienthoai: '0988888888', loaikh: 1 },
  ]);

  return (
    // Thêm p-10 và max-w để nội dung thoáng, không bị Sidebar đè
    <div className="p-10 bg-[#f8fafc] min-h-screen">
      
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10">
        <div>
          <h2 className="text-3xl font-black text-slate-800 tracking-tight uppercase">
            Quản lý Khách hàng
          </h2>
          <p className="text-slate-500 font-medium mt-1">Lưu trữ và tra cứu thông tin khách hàng hệ thống</p>
        </div>
        <button 
          onClick={() => navigate('/them-khach-hang')}
          className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-2xl font-bold hover:bg-blue-700 shadow-xl shadow-blue-200 transition-all active:scale-95"
        >
          <Plus className="w-5 h-5" />
          Thêm Khách Hàng
        </button>
      </div>

      {/* Filter & Search Section */}
      <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100 mb-8 flex flex-col md:flex-row gap-4 items-center">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
          <input 
            type="text" 
            placeholder="Tìm kiếm theo tên, số điện thoại hoặc CMND..." 
            className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-xl outline-none focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all font-medium text-slate-700"
          />
        </div>
        <select className="px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl outline-none font-bold text-slate-600 cursor-pointer hover:bg-white transition-all">
          <option>Tất cả loại KH</option>
          <option>Cá nhân</option>
          <option>Công ty</option>
        </select>
      </div>

      {/* Bảng danh sách - Thiết kế lại cho chuyên nghiệp */}
      <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50/50 border-b border-slate-100">
              <th className="p-6 font-black text-slate-400 text-[11px] uppercase tracking-[0.2em]">Khách hàng</th>
              <th className="p-6 font-black text-slate-400 text-[11px] uppercase tracking-[0.2em]">Định danh (CMND)</th>
              <th className="p-6 font-black text-slate-400 text-[11px] uppercase tracking-[0.2em]">Liên hệ</th>
              <th className="p-6 font-black text-slate-400 text-[11px] uppercase tracking-[0.2em]">Loại</th>
              <th className="p-6 font-black text-slate-400 text-[11px] uppercase tracking-[0.2em] text-center">Thao tác</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {customers.map((item) => (
              <tr key={item.id} className="hover:bg-blue-50/30 transition-colors group">
                <td className="p-6">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${item.loaikh === 0 ? 'bg-blue-100 text-blue-600' : 'bg-purple-100 text-purple-600'}`}>
                      {item.loaikh === 0 ? <User className="w-5 h-5" /> : <Building className="w-5 h-5" />}
                    </div>
                    <span className="font-extrabold text-slate-700">{item.hoten}</span>
                  </div>
                </td>
                <td className="p-6 font-bold text-slate-500">{item.cmnd}</td>
                <td className="p-6 font-bold text-slate-600">{item.sodienthoai}</td>
                <td className="p-6">
                  <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${
                    item.loaikh === 0 
                    ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' 
                    : 'bg-purple-50 text-purple-600 border border-purple-100'
                  }`}>
                    {item.loaikh === 0 ? 'Cá nhân' : 'Công ty'}
                  </span>
                </td>
                <td className="p-6">
                  <div className="flex justify-center items-center gap-2">
                    <button title="Chỉnh sửa" className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all">
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button title="Xóa khách hàng" className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        {/* Pagination giả lập */}
        <div className="p-6 border-t border-slate-50 flex justify-between items-center text-sm font-bold text-slate-400 uppercase tracking-widest">
          <span>Hiển thị 2 khách hàng</span>
          <div className="flex gap-2">
            <button className="px-4 py-2 bg-slate-100 rounded-xl text-slate-400 cursor-not-allowed">Trước</button>
            <button className="px-4 py-2 bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-100 transition-all">Sau</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ListKhachHang;
import React, { useState } from "react";
import { mockBDS } from "../../data/mockBatDongSan";
import AddBDSPage from "./AddBDSPage"; // Đảm bảo ông tạo file này theo code bên dưới

const ListBatDongSan = () => {
  // Quản lý việc hiển thị: 'list' là danh sách, 'add' là trang thêm mới
  const [view, setView] = useState("list"); 
  const [bdsList] = useState(mockBDS);

  const formatAddress = (item) => {
    return `${item.sonha} ${item.tenduong}, ${item.phuong}, ${item.quan}, ${item.thanhpho}`;
  };

  // NẾU ĐANG Ở CHẾ ĐỘ THÊM MỚI: HIỆN GIAO DIỆN NHƯ FIGMA
  if (view === "add") {
    return <AddBDSPage onBack={() => setView("list")} />;
  }

  // NẾU KHÔNG THÌ HIỆN DANH SÁCH CARD NHƯ CŨ
  return (
    <div className="p-8 bg-[#f8fafc] min-h-screen">
      <div className="flex justify-between items-center mb-10">
        <div>
          <h2 className="text-3xl font-black text-[#1e293b]">QUẢN LÝ NHÀ ĐẤT</h2>
          <p className="text-slate-400 text-sm font-medium mt-1">Hệ thống quản lý dữ liệu bất động sản chuyên nghiệp</p>
        </div>
        
        {/* Bấm nút này sẽ chuyển view sang 'add' để hiện giao diện ông muốn */}
        <button 
          onClick={() => setView("add")}
          className="bg-blue-600 text-white px-6 py-3 rounded-2xl font-bold shadow-lg shadow-blue-200 hover:bg-blue-700 transition-all active:scale-95"
        >
          + Nhận ký gửi mới
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {bdsList.map((bds) => (
          <div key={bds.bdsid} className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden hover:shadow-2xl transition-all group p-3">
            {/* ... Nội dung Card giữ nguyên như cũ ... */}
            <div className="h-56 bg-slate-100 rounded-[2rem] flex items-center justify-center">
               <div className="text-slate-400 font-bold italic text-sm">Hình ảnh BĐS</div>
            </div>
            <div className="p-5">
              <h3 className="font-black text-[#1e293b] text-xl mb-2">Mã: #{bds.bdsid}</h3>
              <p className="text-slate-500 text-sm mb-6 italic">{formatAddress(bds)}</p>
              <div className="flex justify-between items-center pt-5 border-t border-slate-50">
                <p className="font-bold text-slate-800">{bds.dientich} m²</p>
                <p className="font-black text-blue-600 text-2xl">{(bds.dongia / 1000000000).toFixed(1)} Tỷ</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ListBatDongSan;
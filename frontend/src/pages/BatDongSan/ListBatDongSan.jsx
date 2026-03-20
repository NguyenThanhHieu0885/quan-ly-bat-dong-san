import React, { useState } from 'react';

const ListBatDongSan = () => {
  // Dữ liệu giả định theo thực thể BATDONGSAN [cite: 210]
  const [bdsList] = useState([
    { id: 'BDS001', loai: 'Nhà phố', diachi: '123 Cao Lỗ, P.4, Q.8', dientich: 100, dongia: 50, tinhtrang: 0 },
    { id: 'BDS002', loai: 'Đất nền', diachi: 'Lô B2, Phạm Hùng, Q.8', dientich: 200, dongia: 30, tinhtrang: 0 },
  ]);

  return (
    <div className="p-8 bg-[#f8fafc] min-h-screen">
      <div className="flex justify-between items-center mb-10">
        <h2 className="text-3xl font-black text-[#1e293b]">DANH SÁCH BẤT ĐỘNG SẢN [cite: 54, 91]</h2>
        <button className="bg-blue-600 text-white px-6 py-3 rounded-2xl font-bold shadow-lg shadow-blue-200 hover:bg-blue-700 transition-all">
          + Nhận ký gửi mới [cite: 40]
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {bdsList.map((bds) => (
          <div key={bds.id} className="bg-white rounded-[2rem] shadow-sm border border-slate-100 overflow-hidden hover:shadow-xl transition-all group">
            <div className="h-48 bg-slate-200 relative">
              <span className="absolute top-4 left-4 bg-blue-600 text-white px-3 py-1 rounded-lg text-xs font-bold uppercase">
                {bds.loai}
              </span>
              <div className="w-full h-full flex items-center justify-center text-slate-400 font-bold italic">Hình ảnh BĐS [cite: 41]</div>
            </div>
            <div className="p-6">
              <h3 className="font-black text-[#1e293b] text-xl mb-2">{bds.id}</h3>
              <p className="text-slate-500 text-sm mb-4 font-medium italic leading-snug">{bds.diachi}</p>
              <div className="flex justify-between items-center pt-4 border-t border-slate-50">
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Diện tích [cite: 210]</p>
                  <p className="font-bold text-slate-800">{bds.dientich} m²</p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Đơn giá [cite: 210]</p>
                  <p className="font-bold text-blue-600">{bds.dongia} Tr/m²</p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ListBatDongSan;
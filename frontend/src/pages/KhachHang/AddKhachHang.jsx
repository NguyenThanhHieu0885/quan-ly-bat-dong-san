import React, { useState } from 'react';

const AddKhachHang = () => {
  const [customer, setCustomer] = useState({
    hoten: '', 
    cmnd: '', 
    sodienthoai: '', 
    diachi: '', 
    diachitt: '', 
    ngaysinh: '', 
    gioitinh: true, // true: Nam, false: Nữ 
    email: '', 
    loaikh: 0, // 0: Cá nhân, 1: Công ty 
    mota: '', 
    trangthai: true 
  });
  const [errors, setErrors] = useState({});

  const validate = () => {
    let tempErrors = {};
    
    // 1. Kiểm tra Họ tên: Không được để trống 
    if (!customer.hoten.trim()) {
      tempErrors.hoten = "Họ tên khách hàng không được để trống";
    }

    // 2. Kiểm tra CMND: Bắt buộc đúng 9 chữ số, không âm, không trùng 
    const cmndRegex = /^[0-9]{9}$/;
    if (!cmndRegex.test(customer.cmnd)) {
      tempErrors.cmnd = "Chứng minh nhân dân phải bắt buộc 9 số và không âm";
    }

    // 3. Kiểm tra Số điện thoại: Phải là số, không âm, lớn hơn 5 số [cite: 444]
    // Thắt chặt 10 số theo yêu cầu thực tế của bạn
    const sdtRegex = /^0[0-9]{9}$/;
    if (!sdtRegex.test(customer.sodienthoai)) {
      tempErrors.sodienthoai = "Số điện thoại phải là số dương, bắt đầu bằng 0 và đủ 10 chữ số";
    }

    // 4. Kiểm tra Email (định dạng cơ bản)
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (customer.email && !emailRegex.test(customer.email)) {
      tempErrors.email = "Địa chỉ email không hợp lệ";
    }

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      console.log("Dữ liệu khách hàng hợp lệ theo thực thể KHACHHANG:", customer);
      alert("Đang cập nhật CSDL..."); // 
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-8 bg-white shadow-2xl rounded-2xl mt-8 border border-gray-100">
      <h2 className="text-3xl font-extrabold mb-8 text-blue-800 text-center uppercase tracking-tight">Thêm Khách Hàng Mới</h2>
      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Họ tên  */}
        <div className="md:col-span-2">
          <label className="block font-bold text-gray-700 mb-2">Họ tên khách hàng</label>
          <input 
            type="text" 
            className={`w-full border-2 p-3 rounded-xl focus:ring-4 focus:ring-blue-100 outline-none transition-all ${errors.hoten ? 'border-red-500' : 'border-gray-200 focus:border-blue-500'}`}
            placeholder="Nhập đầy đủ họ tên"
            onChange={e => setCustomer({...customer, hoten: e.target.value})} 
          />
          {errors.hoten && <p className="text-red-500 text-sm mt-1 font-medium">{errors.hoten}</p>}
        </div>

        {/* CMND [cite: 437, 445] */}
        <div>
          <label className="block font-bold text-gray-700 mb-2">Số CMND (9 số)</label>
          <input 
            type="text" 
            className={`w-full border-2 p-3 rounded-xl outline-none ${errors.cmnd ? 'border-red-500' : 'border-gray-200 focus:border-blue-500'}`}
            placeholder="Ví dụ: 123456789"
            onChange={e => setCustomer({...customer, cmnd: e.target.value})} 
          />
          {errors.cmnd && <p className="text-red-500 text-sm mt-1 font-medium">{errors.cmnd}</p>}
        </div>

        {/* Số điện thoại [cite: 437, 444] */}
        <div>
          <label className="block font-bold text-gray-700 mb-2">Số điện thoại</label>
          <input 
            type="text" 
            className={`w-full border-2 p-3 rounded-xl outline-none ${errors.sodienthoai ? 'border-red-500' : 'border-gray-200 focus:border-blue-500'}`}
            placeholder="Ví dụ: 0901234567"
            onChange={e => setCustomer({...customer, sodienthoai: e.target.value})} 
          />
          {errors.sodienthoai && <p className="text-red-500 text-sm mt-1 font-medium">{errors.sodienthoai}</p>}
        </div>

        {/* Ngày sinh  */}
        <div>
          <label className="block font-bold text-gray-700 mb-2">Ngày sinh</label>
          <input 
            type="date" 
            className="w-full border-2 border-gray-200 p-3 rounded-xl focus:border-blue-500 outline-none"
            onChange={e => setCustomer({...customer, ngaysinh: e.target.value})} 
          />
        </div>

        {/* Giới tính [cite: 437, 447] */}
        <div>
          <label className="block font-bold text-gray-700 mb-2">Giới tính</label>
          <select 
            className="w-full border-2 border-gray-200 p-3 rounded-xl focus:border-blue-500 outline-none"
            onChange={e => setCustomer({...customer, gioitinh: e.target.value === 'true'})}
          >
            <option value="true">Nam</option>
            <option value="false">Nữ</option>
          </select>
        </div>

        {/* Địa chỉ  */}
        <div className="md:col-span-2">
          <label className="block font-bold text-gray-700 mb-2">Địa chỉ liên lạc</label>
          <input 
            type="text" 
            className="w-full border-2 border-gray-200 p-3 rounded-xl focus:border-blue-500 outline-none"
            onChange={e => setCustomer({...customer, diachi: e.target.value})} 
          />
        </div>

        {/* Loại khách hàng [cite: 437, 446] */}
        <div>
          <label className="block font-bold text-gray-700 mb-2">Loại khách hàng</label>
          <div className="flex gap-4 mt-2">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="radio" name="loaikh" value="0" defaultChecked onChange={() => setCustomer({...customer, loaikh: 0})} />
              Cá nhân
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="radio" name="loaikh" value="1" onChange={() => setCustomer({...customer, loaikh: 1})} />
              Công ty
            </label>
          </div>
        </div>

        {/* Email  */}
        <div>
          <label className="block font-bold text-gray-700 mb-2">Email</label>
          <input 
            type="email" 
            className={`w-full border-2 p-3 rounded-xl outline-none ${errors.email ? 'border-red-500' : 'border-gray-200 focus:border-blue-500'}`}
            placeholder="name@example.com"
            onChange={e => setCustomer({...customer, email: e.target.value})} 
          />
          {errors.email && <p className="text-red-500 text-sm mt-1 font-medium">{errors.email}</p>}
        </div>

        {/* Mô tả chi tiết  */}
        <div className="md:col-span-2">
          <label className="block font-bold text-gray-700 mb-2">Mô tả chi tiết</label>
          <textarea 
            rows="3"
            className="w-full border-2 border-gray-200 p-3 rounded-xl focus:border-blue-500 outline-none"
            placeholder="Ghi chú thêm về khách hàng..."
            onChange={e => setCustomer({...customer, mota: e.target.value})}
          ></textarea>
        </div>

        <button 
          type="submit" 
          className="md:col-span-2 w-full bg-blue-700 text-white py-4 rounded-2xl font-black text-lg hover:bg-blue-800 transition-all shadow-xl hover:shadow-blue-200 mt-4 active:scale-95"
        >
          LƯU THÔNG TIN KHÁCH HÀNG
        </button>
      </form>
    </div>
  );
};

export default AddKhachHang;
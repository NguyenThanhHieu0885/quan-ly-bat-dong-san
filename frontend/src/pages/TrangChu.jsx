import React from 'react';
import { Link } from 'react-router-dom';

export default function TrangChu() {
  return (
    <div style={{ textAlign: 'center', padding: '80px 20px', minHeight: 'calc(100vh - 80px)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
      <h1 style={{ color: '#00aaff', fontSize: '2.8rem', marginBottom: '20px' }}>Hệ Thống Quản Lý Bất Động Sản</h1>
      
      <p style={{ fontSize: '18px', color: '#cccccc', maxWidth: '600px', margin: '0 auto 40px auto', lineHeight: '1.8' }}>
        Chào mừng bạn đến với nền tảng quản lý và ký gửi nhà đất. 
        Xin vui lòng lựa chọn chức năng bên dưới để tiếp tục công việc của bạn.
      </p>
      
      <div style={{ marginTop: '40px' }}>
        <Link to="/tao-ky-gui" style={btnStyle}>Tạo Ký Gửi Mới</Link>
        <Link to="/quan-ly-ky-gui" style={{...btnStyle, backgroundColor: '#28a745'}}>Bảng Quản Lý</Link>
      </div>
    </div>
  );
}

const btnStyle = {
  display: 'inline-block',
  padding: '12px 24px',
  margin: '0 10px',
  backgroundColor: '#007bff',
  color: 'white',
  textDecoration: 'none',
  borderRadius: '5px',
  fontWeight: 'bold',
  boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
};
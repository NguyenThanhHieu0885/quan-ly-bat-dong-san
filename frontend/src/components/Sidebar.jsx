import React from 'react';
import { Link, useLocation } from 'react-router-dom';

export default function Sidebar() {
  const location = useLocation();

  const menuItems = [
    { path: '/', label: '🏠 Trang Chủ' },
    { path: '/tao-ky-gui', label: '📝 Tạo Hợp Đồng Mới' },
    { path: '/quan-ly-ky-gui', label: '📊 Quản Lý Ký Gửi' }
  ];

  return (
    <div style={{ width: '260px', backgroundColor: '#1e1e2f', borderRight: '1px solid #333', minHeight: '100vh', padding: '20px 0', position: 'fixed', left: 0, top: 0, boxShadow: '2px 0 10px rgba(0,0,0,0.2)' }}>
      <style>{`
        .menu-link:hover {
          background-color: #2a2a40 !important;
          color: #ffffff !important;
          transform: translateX(5px);
        }
      `}</style>
      <h2 style={{ textAlign: 'center', color: '#00aaff', marginBottom: '40px', fontSize: '24px', fontWeight: '800', letterSpacing: '1px' }}>BĐS Admin<span style={{color: '#ff4d4d'}}>.</span></h2>
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path || (location.pathname.includes('/sua-ky-gui') && item.path === '/quan-ly-ky-gui');
          return (
            <li key={item.path}>
              <Link
                to={item.path}
                className="menu-link"
                style={{
                  display: 'block',
                  padding: '14px 20px',
                  margin: '0 15px 10px 15px',
                  borderRadius: '10px',
                  color: isActive ? '#ffffff' : '#a0a0a0',
                  textDecoration: 'none',
                  backgroundColor: isActive ? '#007bff' : 'transparent',
                  boxShadow: isActive ? '0 4px 10px rgba(0, 123, 255, 0.3)' : 'none',
                  fontWeight: '400',
                  transition: 'all 0.2s ease-in-out'
                }}
              >
                {item.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
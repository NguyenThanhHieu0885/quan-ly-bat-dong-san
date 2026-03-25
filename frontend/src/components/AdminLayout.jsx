import React, { useState } from 'react';
import { Layout, Menu, Avatar, Dropdown, theme } from 'antd';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UserOutlined,
  TeamOutlined,
  BankOutlined,
  FileProtectOutlined,
  FileDoneOutlined,
  FileTextOutlined,
  LogoutOutlined,
  DashboardOutlined
} from '@ant-design/icons';

const { Header, Sider, Content } = Layout;

const AdminLayout = () => {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const location = useLocation(); // Lấy đường dẫn hiện tại để bôi sáng menu

  // Khai báo danh sách Menu bên trái
  const menuItems = [
    { key: '/', icon: <DashboardOutlined />, label: 'Tổng Quan' },
    { key: '/khach-hang', icon: <TeamOutlined />, label: 'Quản lý Khách Hàng' },
    { key: '/nhan-vien', icon: <UserOutlined />, label: 'Quản lý Nhân Viên' },
    { key: '/bat-dong-san', icon: <BankOutlined />, label: 'Quản lý Bất Động Sản' },
    { key: '/hop-dong-ky-gui', icon: <FileTextOutlined />, label: 'HĐ Ký Gửi' },
    { key: '/hop-dong-dat-coc', icon: <FileProtectOutlined />, label: 'HĐ Đặt Cọc' },
    { key: '/hop-dong-chuyen-nhuong', icon: <FileDoneOutlined />, label: 'HĐ Chuyển Nhượng' },
  ];

  // Menu rớt xuống khi bấm vào Avatar
  const userMenu = {
    items: [
      { key: 'profile', icon: <UserOutlined />, label: 'Hồ sơ cá nhân' },
      { type: 'divider' },
      { key: 'logout', icon: <LogoutOutlined />, label: 'Đăng xuất', danger: true },
    ]
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      {/* CỘT SIDEBAR BÊN TRÁI */}
      <Sider trigger={null} collapsible collapsed={collapsed} theme="dark" width={250}>
        {/* Logo công ty */}
        <div style={{ height: 32, margin: 16, background: 'rgba(255, 255, 255, 0.2)', borderRadius: 6, display: 'flex', justifyContent: 'center', alignItems: 'center', color: 'white', fontWeight: 'bold' }}>
          {collapsed ? 'BĐS' : 'QUẢN LÝ BĐS'}
        </div>
        
        {/* Render Menu */}
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[location.pathname]} // Tự động bôi sáng thẻ menu đang đứng
          onClick={(e) => navigate(e.key)} // Bấm vào menu là tự động chuyển link
          items={menuItems}
        />
      </Sider>

      {/* KHU VỰC BÊN PHẢI (GỒM HEADER VÀ CONTENT) */}
      <Layout>
        {/* HEADER */}
        <Header style={{ padding: '0 16px', background: '#fff', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 1px 4px rgba(0,21,41,.08)' }}>
          {/* Nút thu phóng menu */}
          <div 
            style={{ fontSize: '18px', cursor: 'pointer' }} 
            onClick={() => setCollapsed(!collapsed)}
          >
            {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
          </div>

          {/* Avatar User */}
          <Dropdown menu={userMenu} placement="bottomRight" arrow>
            <div style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontWeight: 500 }}>Admin Diệp Lân</span>
              <Avatar style={{ backgroundColor: '#1677ff' }} icon={<UserOutlined />} />
            </div>
          </Dropdown>
        </Header>

        {/* NỘI DUNG CHÍNH (NƠI HIẾU VÀ NAM SẼ ĐỔ CODE VÀO) */}
        <Content style={{ margin: '24px 16px', padding: 24, minHeight: 280, background: '#fff', borderRadius: 8 }}>
          {/* Thẻ Outlet này là phép thuật của React Router. Nó sẽ tự động tráo đổi giao diện tùy theo đường dẫn URL */}
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};

export default AdminLayout;
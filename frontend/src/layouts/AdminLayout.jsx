import { Layout, Menu, Avatar, Button, Tag, Space, Typography } from "antd";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { 
  DashboardOutlined, UserOutlined, HomeOutlined, 
  PlusCircleOutlined, FileTextOutlined, SettingOutlined, 
  LogoutOutlined, BankOutlined 
} from "@ant-design/icons";

const { Sider, Content } = Layout;
const { Text } = Typography;

export default function AdminLayout() {
  const navigate = useNavigate();
  const location = useLocation();

  // Kiểm tra dữ liệu an toàn - Không bao giờ để crash ở đây
  const userStr = localStorage.getItem("user");
  let userData = { email: "Admin", role: "admin" };
  
  if (userStr) {
    try {
      userData = JSON.parse(userStr);
    } catch (e) {
      console.error("Dữ liệu user sai định dạng");
    }
  }

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  const menuItems = [
    { key: "/", icon: <DashboardOutlined />, label: "Tổng quan" },
    { key: "/nhan-vien", icon: <UserOutlined />, label: "Nhân viên", adminonly: true },
    { key: "/khach-hang", icon: <UserOutlined />, label: "Khách hàng" },
    { key: "/danh-sach-bds", icon: <HomeOutlined />, label: "Bất động sản" },
    { key: "/bat-dong-san/add", icon: <PlusCircleOutlined />, label: "Thêm mới" },
    { key: "/hop-dong-ky-gui", icon: <FileTextOutlined />, label: "HĐ ký gửi" },
    { key: "/hop-dong-dat-coc", icon: <FileTextOutlined />, label: "HĐ đặt cọc" },
    { key: "/hop-dong-chuyen-nhuong", icon: <FileTextOutlined />, label: "HĐ chuyển nhượng" },
  ];

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sider width={260} theme="light" style={{ borderRight: "1px solid #f0f0f0", position: 'fixed', height: '100vh', left: 0, top: 0 }}>
        <div style={{ height: 64, display: "flex", alignItems: "center", padding: "0 24px", borderBottom: "1px solid #f0f0f0" }}>
          <BankOutlined style={{ fontSize: 24, color: "#1677ff" }} />
          <span style={{ marginLeft: 12, fontSize: 18, fontWeight: 700 }}>Quản lý BĐS</span>
        </div>

        <div style={{ padding: "20px 24px", borderBottom: "1px solid #f0f0f0" }}>
          <Space>
            <Avatar size={40} icon={<UserOutlined />} style={{ backgroundColor: "#e6f4ff" }} />
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <Text strong>{userData.email?.split('@')[0] || "User"}</Text>
              <Tag 
                color={userData.role === 'admin' ? 'red' : 'blue'} 
                style={{ width: 'fit-content', marginTop: 4, textTransform: 'capitalize' }}
              >
                {userData.role === 'admin' ? 'Quản trị viên' : 'Nhân viên'}
              </Tag>
            </div>
          </Space>
        </div>

        <div style={{ flex: 1, overflowY: "auto", padding: "12px 0" }}>
          <Menu
            mode="inline"
            selectedKeys={[location.pathname]}
            items={menuItems.filter(i => !i.adminonly || (i.adminonly && userData.role === 'admin'))}
            onClick={({ key }) => navigate(key)}
            style={{ border: "none" }}
          />
        </div>

        <div style={{ padding: '16px', borderTop: '1px solid #f0f0f0' }}>
          <Button type="text" danger block icon={<LogoutOutlined />} onClick={handleLogout} style={{ textAlign: 'left' }}>
            Đăng xuất
          </Button>
        </div>
      </Sider>

      <Layout style={{ marginLeft: 260 }}>
        <Content style={{ padding: "24px", background: "#f3f4f6", minHeight: "100vh" }}>
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
}
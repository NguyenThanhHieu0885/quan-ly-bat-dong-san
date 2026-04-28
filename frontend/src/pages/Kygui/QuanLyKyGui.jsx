import React, { useState, useEffect } from 'react';
import { layDanhSachKyGui, xoaKyGui } from '../../services/hopdongkyguiServices';
import { Link, useNavigate } from 'react-router-dom';
import Toast from '../../components/Toast';
import { Table, Input, Select, Button, Space, Popconfirm, Tag, Card, Modal, Descriptions } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, SearchOutlined, EyeOutlined } from '@ant-design/icons';

export default function QuanLyKyGui() {
  const [danhSach, setDanhSach] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedContract, setSelectedContract] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await layDanhSachKyGui();
        setDanhSach(response.data);
      } catch (err) {
        console.error('Lỗi khi gọi API lấy danh sách:', err);
        setError('Không thể tải dữ liệu. Vui lòng kiểm tra lại server hoặc kết nối mạng.');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleDelete = async (id) => {
    try {
      await xoaKyGui(id);
      setDanhSach(danhSach.filter(item => item.kgid !== id));
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    } catch (err) {
      console.error('Lỗi khi xóa hợp đồng:', err);
      alert(err.response?.data?.message || 'Có lỗi xảy ra khi xóa hợp đồng.');
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN').format(price);
  };
  
  const formatDate = (dateString) => {
    const options = { day: '2-digit', month: '2-digit', year: 'numeric' };
    return new Date(dateString).toLocaleDateString('vi-VN', options);
  };

  const getTrangThaiProps = (status) => {
    switch (String(status)) {
      case '1': return { text: 'Đang hiệu lực', color: 'success' };
      case '3': return { text: 'Chấm dứt HĐ', color: 'error' };
      default: return { text: status, color: 'default' };
    }
  };

  const showDetails = (record) => {
    setSelectedContract(record);
    setIsModalVisible(true);
  };

  const handleCancelModal = () => {
    setIsModalVisible(false);
    setSelectedContract(null);
  };

  const columns = [
    { title: 'Mã KG', dataIndex: 'kgid', key: 'kgid', sorter: (a, b) => String(a.kgid).localeCompare(String(b.kgid), undefined, { numeric: true }) },
    { title: 'Khách Hàng', dataIndex: ['KhachHang', 'hoten'], key: 'khachhang', sorter: (a, b) => (a.KhachHang?.hoten || '').localeCompare(b.KhachHang?.hoten || '') },
    { title: 'Bất Động Sản', key: 'batdongsan', render: (_, record) => record.BatDongSan ? `${record.BatDongSan.sonha || ''} ${record.BatDongSan.tenduong || ''}`.trim() || record.bdsid : record.bdsid },
    { title: 'Nhân Viên', key: 'nhanvien', render: (_, record) => record.NhanVien?.tennv || record.KhachHang?.NhanVien?.tennv || 'Chưa phân công' },
    { title: 'Giá trị HĐ (VNĐ)', dataIndex: 'giatri', key: 'giatri', align: 'right', render: (text) => formatPrice(text), sorter: (a, b) => a.giatri - b.giatri },
    { title: 'Ngày Bắt Đầu', dataIndex: 'ngaybatdau', key: 'ngaybatdau', render: (text) => formatDate(text) },
    { title: 'Trạng Thái', dataIndex: 'trangthai', key: 'trangthai', render: (status) => { const props = getTrangThaiProps(status); return <Tag color={props.color}>{props.text}</Tag>; }, 
      filters: [
        { text: 'Đang hiệu lực', value: '1' },
        { text: 'Chấm dứt HĐ', value: '3' },
      ],
      onFilter: (value, record) => String(record.trangthai) === value,
    },
    { title: 'Hành Động', key: 'action', align: 'center', render: (_, record) => (
        <Space size="middle">
          <Button type="link" icon={<EyeOutlined />} onClick={() => showDetails(record)} title="Xem chi tiết" />
          <Button type="link" icon={<EditOutlined />} onClick={() => navigate(`/sua-ky-gui/${record.kgid}`)} title="Sửa hợp đồng" />
          <Popconfirm title="Xóa hợp đồng?" description="Bạn có chắc muốn xóa hợp đồng này không?" onConfirm={() => handleDelete(record.kgid)} okText="Xóa" cancelText="Hủy">
            <Button type="link" danger icon={<DeleteOutlined />} title="Xóa hợp đồng" />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const filteredDanhSach = danhSach.filter(item => {
    const matchSearch = String(item.kgid).toLowerCase().includes(searchTerm.toLowerCase()) ||
                        (item.KhachHang?.hoten || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                        (item.NhanVien?.tennv || item.KhachHang?.NhanVien?.tennv || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchStatus = filterStatus === '' || String(item.trangthai) === filterStatus;
    return matchSearch && matchStatus;
  }).sort((a, b) => {
    return String(a.kgid).localeCompare(String(b.kgid), undefined, { numeric: true });
  });

  const darkTheme = {
    container: { color: '#f0f0f0' },
    h2: { color: '#00aaff', textAlign: 'center', marginBottom: '25px' },
    tableContainer: {boxShadow: '0 5px 15px rgba(0,0,0,0.3)', borderRadius: '10px', overflow: 'hidden' },
    table: { width: '100%', borderCollapse: 'collapse', backgroundColor: '#2c2c2c' },
    th: { padding: '15px', fontWeight: 'bold', backgroundColor: '#3b3b3b', borderBottom: '2px solid #555', textAlign: 'center' },
    td: { padding: '15px', borderBottom: '1px solid #444', textAlign: 'center' },
    trEven: { backgroundColor: '#2c2c2c' },
    trOdd: { backgroundColor: '#343434' },
    loading: { textAlign: 'center', padding: '50px', fontSize: '18px', color: '#e0e0e0' },
    error: { textAlign: 'center', color: '#ff4d4d', padding: '50px', fontSize: '18px' },
    empty: { textAlign: 'center', padding: '30px', color: '#999' },
    filterContainer: { display: 'flex', gap: '15px', marginBottom: '20px' },
    filterInput: { padding: '10px', borderRadius: '5px', border: '1px solid #555', backgroundColor: '#3b3b3b', color: '#f0f0f0', fontSize: '15px' }
  };

  if (loading) {
    return (
      <div style={darkTheme.container}>
        <div style={{ textAlign: 'center', marginTop: '100px', fontSize: '18px' }}>
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ display: 'block', margin: '0 auto 15px' }}>
            <circle cx="12" cy="12" r="10" stroke="rgba(255,255,255,0.1)" strokeWidth="4"></circle>
            <path d="M12 2C6.477 2 2 6.477 2 12h4c0-3.314 2.686-6 6-6V2z" fill="#007bff">
              <animateTransform attributeName="transform" type="rotate" from="0 12 12" to="360 12 12" dur="1s" repeatCount="indefinite" />
            </path>
          </svg>
          Đang tải dữ liệu...
        </div>
      </div>
    );
  }
  if (error) return <div style={{ textAlign: 'center', color: '#ff4d4d', padding: '50px', fontSize: '18px' }}>{error}</div>;

  return (
    <div>
      <Toast show={showSuccess} message="Xóa hợp đồng thành công!" />
      
      <Card 
        title="Quản Lý Hợp Đồng Ký Gửi" 
        extra={
          <Space>
            <Input
              placeholder="Tìm mã KG, tên khách, nhân viên..."
              prefix={<SearchOutlined />}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              allowClear
              style={{ width: 250 }}
            />
            <Select
              placeholder="Lọc trạng thái"
              value={filterStatus || undefined}
              onChange={(value) => setFilterStatus(value || '')}
              style={{ width: 180 }}
              allowClear
            >
              <Select.Option value="1">Đang hiệu lực</Select.Option>
              <Select.Option value="3">Chấm dứt HĐ</Select.Option>
            </Select>
            <Button type="primary" icon={<PlusOutlined />} onClick={() => navigate('/tao-ky-gui')}>
              Thêm Mới
            </Button>
          </Space>
        }
      >
        <Table 
          columns={columns} 
          dataSource={filteredDanhSach} 
          rowKey="kgid" 
          pagination={{ pageSize: 10, showSizeChanger: true }} 
          loading={loading}
        />
      </Card>

      {/* Modal hiển thị thông tin chi tiết */}
      <Modal
        title={<span style={{ color: '#1677ff', fontSize: '18px' }}>Chi Tiết Hợp Đồng Ký Gửi</span>}
        open={isModalVisible}
        onCancel={handleCancelModal}
        footer={[
          <Button key="close" onClick={handleCancelModal}>
            Đóng
          </Button>,
        ]}
        width={700}
      >
        {selectedContract && (
          <Descriptions bordered column={2} size="small" style={{ marginTop: '15px' }}>
            <Descriptions.Item label="Mã Ký Gửi" span={1}>
              <strong style={{ color: '#f5222d' }}>{selectedContract.kgid}</strong>
            </Descriptions.Item>
            <Descriptions.Item label="Trạng Thái" span={1}>
              <Tag color={getTrangThaiProps(selectedContract.trangthai).color}>
                {getTrangThaiProps(selectedContract.trangthai).text}
              </Tag>
            </Descriptions.Item>
            
            <Descriptions.Item label="Khách Hàng" span={2}>
              <strong>{selectedContract.KhachHang?.hoten || 'Chưa cập nhật'}</strong>
            </Descriptions.Item>
            <Descriptions.Item label="Nhân Viên Phụ Trách" span={2}>
              {selectedContract.NhanVien?.tennv || selectedContract.KhachHang?.NhanVien?.tennv || 'Chưa phân công'}
            </Descriptions.Item>
            <Descriptions.Item label="Bất Động Sản" span={2}>
              {selectedContract.BatDongSan ? `${selectedContract.BatDongSan.sonha || ''} ${selectedContract.BatDongSan.tenduong || ''}`.trim() || selectedContract.bdsid : selectedContract.bdsid}
            </Descriptions.Item>
            
            <Descriptions.Item label="Giá Trị Hợp Đồng" span={1}><span style={{ color: '#52c41a', fontWeight: 'bold' }}>{formatPrice(selectedContract.giatri)} VNĐ</span></Descriptions.Item>
            <Descriptions.Item label="Phí Dịch Vụ" span={1}><span style={{ color: '#fa8c16', fontWeight: 'bold' }}>{formatPrice(selectedContract.chiphidv)} VNĐ</span></Descriptions.Item>
            
            <Descriptions.Item label="Ngày Bắt Đầu" span={1}>{formatDate(selectedContract.ngaybatdau)}</Descriptions.Item>
            <Descriptions.Item label="Ngày Kết Thúc" span={1}>{selectedContract.ngayketthuc ? formatDate(selectedContract.ngayketthuc) : <span style={{ color: '#999' }}>Chưa xác định</span>}</Descriptions.Item>
          </Descriptions>
        )}
      </Modal>
    </div>
  );
}
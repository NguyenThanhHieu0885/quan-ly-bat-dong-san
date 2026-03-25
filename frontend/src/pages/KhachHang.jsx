import React, { useState } from 'react';
import { Table, Button, Space, Popconfirm, Modal, Form, Input, message, Card } from 'antd';
import { PlusOutlined } from '@ant-design/icons';

const KhachHang = () => {
  // 1. DỮ LIỆU GIẢ (Mock Data) - Xóa đi khi có API thật
  const [data, setData] = useState([
    { id: 1, hoTen: 'Nguyễn Văn A', sdt: '0901234567', cmnd: '025123456', email: 'nva@gmail.com' },
    { id: 2, hoTen: 'Trần Thị B', sdt: '0987654321', cmnd: '025987654', email: 'ttb@gmail.com' },
  ]);

  // 2. STATE QUẢN LÝ GIAO DIỆN
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingData, setEditingData] = useState(null); // Lưu thông tin người đang được sửa
  const [form] = Form.useForm(); // Hook quản lý form của Ant Design

  // 3. CÁC HÀM XỬ LÝ SỰ KIỆN (ACTIONS)
  // Bấm nút Thêm Mới
  const handleOpenAdd = () => {
    setEditingData(null); // Đảm bảo form trống
    form.resetFields(); // Xóa trắng các ô nhập
    setIsModalOpen(true); // Mở Modal
  };

  // Bấm nút Sửa
  const handleOpenEdit = (record) => {
    setEditingData(record); // Ghi nhớ người đang sửa
    form.setFieldsValue(record); // Đổ dữ liệu cũ vào các ô nhập
    setIsModalOpen(true);
  };

  // Bấm nút Xóa (Nằm trong Popconfirm)
  const handleDelete = (id) => {
    // Tạm thời xóa trên giao diện. Sau này gắn API axios.delete vào đây
    const newData = data.filter(item => item.id !== id);
    setData(newData);
    message.success('Đã xóa khách hàng thành công!');
  };

  // Bấm nút Lưu trên Modal (Thêm hoặc Sửa)
  const handleSave = (values) => {
    if (editingData) {
      // Logic Cập nhật (Sửa)
      const updatedData = data.map(item => item.id === editingData.id ? { ...item, ...values } : item);
      setData(updatedData);
      message.success('Cập nhật thành công!');
    } else {
      // Logic Thêm mới
      const newKhachHang = { id: Date.now(), ...values }; // Tạo ID giả
      setData([...data, newKhachHang]);
      message.success('Thêm mới thành công!');
    }
    setIsModalOpen(false); // Đóng Modal
  };

  // 4. CẤU HÌNH CÁC CỘT CỦA BẢNG (Tuân thủ Quy tắc 2)
  const columns = [
    { title: 'Mã KH', dataIndex: 'id', key: 'id', width: 80 },
    { title: 'Họ và Tên', dataIndex: 'hoTen', key: 'hoTen' },
    { title: 'Số điện thoại', dataIndex: 'sdt', key: 'sdt' },
    { title: 'CMND/CCCD', dataIndex: 'cmnd', key: 'cmnd' },
    { title: 'Email', dataIndex: 'email', key: 'email' },
    {
      title: 'Thao tác',
      key: 'action',
      width: 150,
      render: (_, record) => (
        <Space size="middle">
          {/* Nút Sửa dạng Link */}
          <Button type="link" onClick={() => handleOpenEdit(record)} style={{ padding: 0 }}>
            Sửa
          </Button>

          {/* Nút Xóa dạng Link bọc trong Popconfirm */}
          <Popconfirm
            title="Xóa khách hàng này?"
            description="Bạn có chắc chắn muốn xóa không?"
            onConfirm={() => handleDelete(record.id)}
            okText="Xóa"
            cancelText="Hủy"
          >
            <Button type="link" danger style={{ padding: 0 }}>Xóa</Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <Card 
      title={<span style={{ fontSize: '20px', fontWeight: 'bold' }}>Danh Sách Khách Hàng</span>}
      extra={
        <Button type="primary" icon={<PlusOutlined />} onClick={handleOpenAdd}>
          Thêm Mới
        </Button>
      }
    >
      {/* BẢNG HIỂN THỊ DỮ LIỆU */}
      <Table 
        dataSource={data} 
        columns={columns} 
        rowKey="id" 
        pagination={{ pageSize: 5 }} // Phân trang mỗi trang 5 dòng
      />

      {/* FORM MODAL THÊM/SỬA (Tuân thủ Quy tắc 3) */}
      <Modal
        title={editingData ? "Cập Nhật Khách Hàng" : "Thêm Mới Khách Hàng"}
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={null} // Tắt footer mặc định để dùng nút của Form
        centered
        destroyOnClose // Tự động dọn dẹp form khi đóng
      >
        <Form layout="vertical" form={form} onFinish={handleSave}>
          <Form.Item 
            label="Họ và Tên" 
            name="hoTen" 
            rules={[{ required: true, message: 'Vui lòng nhập họ tên!' }]}
          >
            <Input placeholder="Nhập họ và tên..." />
          </Form.Item>

          <Form.Item 
            label="Số điện thoại" 
            name="sdt" 
            rules={[
              { required: true, message: 'Vui lòng nhập số điện thoại!' },
              { pattern: /^[0-9]+$/, message: 'Số điện thoại chỉ được chứa số!' } // Ràng buộc từ tài liệu doc
            ]}
          >
            <Input placeholder="Nhập số điện thoại..." />
          </Form.Item>

          <Form.Item 
            label="CMND/CCCD" 
            name="cmnd"
            rules={[{ required: true, message: 'Vui lòng nhập chứng minh nhân dân!' }]}
          >
            <Input placeholder="Nhập số CMND..." />
          </Form.Item>

          <Form.Item label="Email" name="email">
            <Input type="email" placeholder="Nhập email (không bắt buộc)..." />
          </Form.Item>

          {/* Nút bấm của Form */}
          <Form.Item style={{ textAlign: 'right', marginBottom: 0 }}>
            <Space>
              <Button onClick={() => setIsModalOpen(false)}>Hủy</Button>
              <Button type="primary" htmlType="submit">
                Lưu Dữ Liệu
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </Card>
  );
};

export default KhachHang;
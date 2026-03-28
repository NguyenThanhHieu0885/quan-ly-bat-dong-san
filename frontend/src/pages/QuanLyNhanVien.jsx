// File: frontend/src/pages/QuanLyNhanVien.jsx
import React, { useState, useEffect } from 'react';
import { Table, Button, Card, Modal, Form, Input, Select, DatePicker, message, Space, Popconfirm } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, SearchOutlined } from '@ant-design/icons';
import axios from 'axios';

const QuanLyNhanVien = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form] = Form.useForm();
  const [searchText, setSearchText] = useState("");

  // Gọi API lấy danh sách (Kết hợp tra cứu) [cite: 262, 382]
  const fetchData = async (keyword = "") => {
    setLoading(true);
    try {
      const res = await axios.get(`http://localhost:3000/api/nhanvien?keyword=${keyword}`);
      setData(res.data.filter(nv => nv.trangthai === true)); // Chỉ hiện NV đang làm
    } catch (error) {
      message.error('Lỗi kết nối máy chủ');
    }
    setLoading(false);
  };

  useEffect(() => { fetchData(); }, []);

  // Xử lý Tra cứu [cite: 264, 265]
  const handleSearch = () => {
    if(!searchText) message.warning("Vui lòng nhập thông tin"); // [cite: 268]
    fetchData(searchText);
  };

  // Mở Modal Thêm/Sửa
  const openModal = (record = null) => {
    setIsModalVisible(true);
    if (record) {
      setEditingId(record.nvid);
      form.setFieldsValue(record);
    } else {
      setEditingId(null);
      form.resetFields();
    }
  };

  // Nút Lưu (Gửi API Tạo hoặc Cập nhật) [cite: 90, 150]
  const handleSave = async () => {
    try {
      const values = await form.validateFields();
      if (editingId) {
        await axios.put(`http://localhost:3000/api/nhanvien/${editingId}`, values);
        message.success('Cập nhật thông tin thành công!'); // [cite: 159]
      } else {
        await axios.post('http://localhost:3000/api/nhanvien', values);
        message.success('Thêm nhân viên thành công!'); // [cite: 98]
      }
      setIsModalVisible(false);
      fetchData();
    } catch (error) {
      if(error.response) message.error(error.response.data.message); // Hiển thị lỗi từ backend
    }
  };

  // Nút Xóa (Kèm cảnh báo Popconfirm) [cite: 207, 208]
  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:3000/api/nhanvien/${id}`);
      message.success('Xóa nhân viên thành công!'); // [cite: 216]
      fetchData();
    } catch (error) {
      if(error.response) message.error(error.response.data.message);
    }
  };

  // Cấu hình bảng Ant Design
  const columns = [
    { title: 'Mã NV', dataIndex: 'nvid', key: 'nvid' },
    { title: 'Tên NV', dataIndex: 'tennv', key: 'tennv' },
    { title: 'Tài khoản', dataIndex: 'taikhoan', key: 'taikhoan' },
    { title: 'SĐT', dataIndex: 'sdt', key: 'sdt' },
    { title: 'Email', dataIndex: 'email', key: 'email' },
    { title: 'Phân quyền', dataIndex: 'quyen', render: (val) => val ? 'Quản lý' : 'Nhân viên' },
    {
      title: 'Hành động',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          <Button icon={<EditOutlined />} onClick={() => openModal(record)} type="link" />
          <Popconfirm title="Bạn có chắc chắn muốn xóa nhân viên này?" onConfirm={() => handleDelete(record.nvid)}>
            <Button icon={<DeleteOutlined />} type="link" danger />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <Card 
      title="Quản Lý Nhân Viên" 
      extra={
        <Space>
          <Input 
            placeholder="Nhập tên nhân viên..." 
            value={searchText} 
            onChange={(e) => setSearchText(e.target.value)} 
          />
          <Button icon={<SearchOutlined />} onClick={handleSearch}>Tra cứu</Button>
          <Button type="primary" icon={<PlusOutlined />} onClick={() => openModal()}>Thêm Mới</Button>
        </Space>
      }
    >
      <Table dataSource={data} columns={columns} rowKey="nvid" loading={loading} />

      <Modal
        title={editingId ? "Cập Nhật Nhân Viên" : "Thêm Nhân Viên Mới"}
        open={isModalVisible}
        onOk={handleSave}
        onCancel={() => setIsModalVisible(false)}
        okText="Lưu"
        cancelText="Hủy"
      >
        <Form form={form} layout="vertical">
          <Form.Item name="taikhoan" label="Tài khoản" rules={[{ required: true, message: 'Vui lòng nhập tài khoản!' }]}>
            <Input disabled={!!editingId} /> 
          </Form.Item>
          {!editingId && (
             <Form.Item name="matkhau" label="Mật khẩu" rules={[{ required: true, message: 'Vui lòng nhập mật khẩu!' }]}>
               <Input.Password />
             </Form.Item>
          )}
          <Form.Item name="tennv" label="Tên nhân viên" rules={[{ required: true, message: 'Vui lòng nhập tên!' }]}>
            <Input />
          </Form.Item>
          <Form.Item name="sdt" label="Số điện thoại">
            <Input />
          </Form.Item>
          <Form.Item name="email" label="Email">
            <Input type="email" />
          </Form.Item>
          <Form.Item name="quyen" label="Phân quyền" initialValue={false}>
            <Select>
              <Select.Option value={false}>Nhân viên Sales</Select.Option>
              <Select.Option value={true}>Quản lý</Select.Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </Card>
  );
};

export default QuanLyNhanVien;
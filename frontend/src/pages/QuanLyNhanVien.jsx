// File: frontend/src/pages/QuanLyNhanVien.jsx
import React, { useState, useEffect } from 'react';
import { Table, Button, Card, Modal, Form, Input, Select, DatePicker, message, Space, Popconfirm, Row, Col } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, SearchOutlined } from '@ant-design/icons';
import axios from 'axios';
import dayjs from 'dayjs';

const QuanLyNhanVien = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form] = Form.useForm();
  const [searchText, setSearchText] = useState("");

  const fetchData = async (keyword = "") => {
    setLoading(true);
    try {
      const res = await axios.get(`http://localhost:3000/api/nhanvien?keyword=${keyword}`);
      setData(res.data); 
    } catch (error) {
      message.error('Lỗi kết nối máy chủ');
    }
    setLoading(false);
  };

  useEffect(() => { fetchData(); }, []);

  const handleSearch = () => {
    fetchData(searchText);
  };

  const openModal = (record = null) => {
    setIsModalVisible(true);
    if (record) {
      setEditingId(record.nvid);
      form.setFieldsValue({
        ...record,
        ngaysinh: record.ngaysinh ? dayjs(record.ngaysinh) : null
      });
    } else {
      setEditingId(null);
      form.resetFields();
    }
  };

  const handleSave = async () => {
    try {
      const values = await form.validateFields();
      
      const submitData = {
        ...values,
        ngaysinh: values.ngaysinh ? values.ngaysinh.format('YYYY-MM-DD') : null
      };

      if (editingId) {
        await axios.put(`http://localhost:3000/api/nhanvien/${editingId}`, submitData);
        message.success('Cập nhật thông tin thành công!');
      } else {
        await axios.post('http://localhost:3000/api/nhanvien', submitData);
        message.success('Thêm nhân viên thành công!');
      }
      setIsModalVisible(false);
      fetchData();
    } catch (error) {
      if(error.response) message.error(error.response.data.message);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:3000/api/nhanvien/${id}`);
      message.success('Đã chuyển trạng thái nhân viên thành Nghỉ việc!');
      fetchData();
    } catch (error) {
      if(error.response) message.error(error.response.data.message);
    }
  };

  // ĐÃ BỔ SUNG 3 CỘT: Mật khẩu, Ngày sinh, Địa chỉ
  const columns = [
    { title: 'Mã NV', dataIndex: 'nvid', key: 'nvid', width: 70, fixed: 'left' },
    { title: 'Tài khoản', dataIndex: 'taikhoan', key: 'taikhoan', width: 100, fixed: 'left' },
    { title: 'Mật khẩu', dataIndex: 'matkhau', key: 'matkhau', width: 100, render: (val) => val }, // Có thể đổi thành '******' nếu muốn bảo mật
    { title: 'Tên NV', dataIndex: 'tennv', key: 'tennv', width: 150 },
    { title: 'Ngày sinh', dataIndex: 'ngaysinh', key: 'ngaysinh', width: 120, render: (val) => val ? dayjs(val).format('DD/MM/YYYY') : '' },
    { title: 'Giới tính', dataIndex: 'gioitinh', key: 'gioitinh', width: 90, render: (val) => val ? 'Nam' : 'Nữ' },
    { title: 'SĐT', dataIndex: 'sdt', key: 'sdt', width: 120 },
    { title: 'Email', dataIndex: 'email', key: 'email', width: 180 },
    { title: 'Địa chỉ', dataIndex: 'diachi', key: 'diachi', width: 200 },
    { title: 'Doanh thu', dataIndex: 'doanhthu', key: 'doanhthu', width: 120, render: (val) => val ? val.toLocaleString() + ' đ' : '0 đ' },
    { title: 'Quyền', dataIndex: 'quyen', key: 'quyen', width: 110, render: (val) => val ? 'Quản lý' : 'Nhân viên' },
    { title: 'Trạng thái', dataIndex: 'trangthai', key: 'trangthai', width: 110, render: (val) => val ? 'Đang làm' : 'Nghỉ việc' },
    {
      title: 'Hành động',
      key: 'action',
      fixed: 'right',
      width: 100,
      render: (_, record) => (
        <Space size="middle">
          <Button icon={<EditOutlined />} onClick={() => openModal(record)} type="link" />
          <Popconfirm title="Bạn có chắc chắn muốn cho nhân viên này nghỉ việc?" onConfirm={() => handleDelete(record.nvid)}>
            <Button icon={<DeleteOutlined />} type="link" danger disabled={!record.trangthai} />
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
          <Input placeholder="Nhập tên nhân viên..." value={searchText} onChange={(e) => setSearchText(e.target.value)} onPressEnter={handleSearch} />
          <Button icon={<SearchOutlined />} onClick={handleSearch}>Tra cứu</Button>
          <Button type="primary" icon={<PlusOutlined />} onClick={() => openModal()}>Thêm Mới</Button>
        </Space>
      }
    >
      {/* Tăng scroll x lên 1800 để chứa đủ các cột mà không bị co dúm lại */}
      <Table dataSource={data} columns={columns} rowKey="nvid" loading={loading} scroll={{ x: 1800 }} />

      <Modal title={editingId ? "Cập Nhật Nhân Viên" : "Thêm Nhân Viên Mới"} open={isModalVisible} onOk={handleSave} onCancel={() => setIsModalVisible(false)} width={800} okText="Lưu" cancelText="Hủy">
        <Form form={form} layout="vertical">
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="taikhoan" label="Tài khoản" rules={[{ required: true, message: 'Vui lòng nhập tài khoản!' }]}>
                <Input disabled={!!editingId} /> 
              </Form.Item>
            </Col>
            <Col span={12}>
              {/* Cho phép sửa mật khẩu nếu cần */}
              <Form.Item name="matkhau" label="Mật khẩu" rules={[{ required: true, message: 'Vui lòng nhập mật khẩu!' }]}>
                <Input.Password />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="tennv" label="Tên nhân viên" rules={[{ required: true, message: 'Vui lòng nhập tên!' }]}>
                <Input />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="sdt" label="Số điện thoại">
                <Input />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="ngaysinh" label="Ngày sinh">
                <DatePicker style={{ width: '100%' }} format="DD/MM/YYYY" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="gioitinh" label="Giới tính" initialValue={1}>
                <Select>
                  <Select.Option value={1}>Nam</Select.Option>
                  <Select.Option value={0}>Nữ</Select.Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={24}>
              <Form.Item name="diachi" label="Địa chỉ">
                <Input.TextArea rows={2} />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={8}>
              <Form.Item name="email" label="Email">
                <Input type="email" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="quyen" label="Phân quyền" initialValue={0}>
                <Select>
                  <Select.Option value={0}>Nhân viên Sales</Select.Option>
                  <Select.Option value={1}>Quản lý</Select.Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="trangthai" label="Trạng thái" initialValue={1}>
                <Select>
                  <Select.Option value={1}>Đang làm</Select.Option>
                  <Select.Option value={0}>Nghỉ việc</Select.Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

        </Form>
      </Modal>
    </Card>
  );
};

export default QuanLyNhanVien;
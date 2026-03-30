import { useState } from "react";
import { Table, Button, Space, Popconfirm, Card, Input, message, Modal, Form } from "antd";
import { useNavigate } from "react-router-dom";

export default function KhachHang() {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedKhach, setSelectedKhach] = useState(null);
  const [formReq] = Form.useForm();
  const [keyword, setKeyword] = useState("");

  // Dữ liệu gốc đầy đủ thuộc tính của bạn
  const [data, setData] = useState([
    { khid: 1, hoten: "Nguyễn Văn A", sdt: "0901234567", cmnd: "012345678", email: "a@gmail.com", diachi: "TP.HCM", gioitinh: 1, loaikh: 1, trangthai: 1, hasBDS: true, hasContract: false },
    { khid: 2, hoten: "Nguyễn Văn B", sdt: "0901234568", cmnd: "012345679", email: "b@gmail.com", diachi: "HN", gioitinh: 0, loaikh: 0, trangthai: 1, hasBDS: false, hasContract: false },
  ]);

  // Logic Xóa khách hàng
  const handleDelete = (record) => {
    if (record.hasBDS) {
      message.error("Khách hàng đang có bất động sản ký gửi");
      return;
    }
    if (record.hasContract) {
      message.error("Khách hàng đang có hợp đồng chuyển nhượng");
      return;
    }
    setData((prev) => prev.filter((item) => item.khid !== record.khid));
    message.success("Cập nhật CSDL thành công");
  };

  // Logic Lập yêu cầu
  const handleSaveRequest = (values) => {
    console.log("Yêu cầu mới:", values);
    message.success("Cập nhật CSDL thành công");
    setIsModalOpen(false);
    formReq.resetFields();
  };

  const filtered = data.filter((item) =>
    item.hoten.toLowerCase().includes(keyword.toLowerCase())
  );

  const columns = [
    { title: "Mã", dataIndex: "khid", width: 80 },
    { title: "Họ tên", dataIndex: "hoten" },
    { title: "SĐT", dataIndex: "sdt" },
    { title: "CMND", dataIndex: "cmnd" },
    { title: "Email", dataIndex: "email" },
    { title: "Địa chỉ", dataIndex: "diachi" },
    {
      title: "Giới tính",
      dataIndex: "gioitinh",
      render: (v) => (v ? "Nam" : "Nữ"),
    },
    {
      title: "Loại KH",
      dataIndex: "loaikh",
      render: (v) => (v ? "VIP" : "Thường"),
    },
    {
      title: "Trạng thái",
      dataIndex: "trangthai",
      render: (v) => (v ? "Hoạt động" : "Ngưng"),
    },
    {
      title: "Hành động",
      render: (_, record) => (
        <Space>
          <Button onClick={() => { setSelectedKhach(record); setIsModalOpen(true); }}>
            Lập yêu cầu
          </Button>
          <Button onClick={() => navigate("/khach-hang/add", { state: record })}>
            Sửa
          </Button>
          <Popconfirm
            title="Xóa khách?"
            onConfirm={() => handleDelete(record)}
            okText="Đồng ý"
            cancelText="Hủy"
          >
            <Button danger>Xóa</Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <Card
      title="Quản lý khách hàng"
      extra={
        <Space>
          <Input.Search
            placeholder="Tìm tên..."
            onSearch={(v) => {
              setKeyword(v);
              if (v && filtered.length === 0) message.warning("Không tồn tại thông tin khách hàng");
            }}
            onChange={(e) => setKeyword(e.target.value)}
          />
          <Button type="primary" onClick={() => navigate("/khach-hang/add")}>
            Thêm khách hàng
          </Button>
        </Space>
      }
    >
      <Table dataSource={filtered} columns={columns} rowKey="khid" />

      {/* Modal Lập yêu cầu */}
      <Modal
        title={`Lập yêu cầu: ${selectedKhach?.hoten}`}
        open={isModalOpen}
        onOk={() => formReq.submit()}
        onCancel={() => setIsModalOpen(false)}
        okText="Thêm"
      >
        <Form form={formReq} layout="vertical" onFinish={handleSaveRequest}>
          <Form.Item
            name="noidung"
            label="Nội dung yêu cầu"
            rules={[{ required: true, message: "Thông tin không được rỗng" }]}
          >
            <Input.TextArea rows={4} placeholder="Nhập yêu cầu của khách hàng..." />
          </Form.Item>
        </Form>
      </Modal>
    </Card>
  );
}
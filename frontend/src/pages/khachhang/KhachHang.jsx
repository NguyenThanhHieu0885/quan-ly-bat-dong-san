import { useState, useEffect } from "react";
import { Table, Button, Space, Popconfirm, Card, Input, message, Modal, Form, Tag } from "antd";
import { useNavigate } from "react-router-dom";
import { getAllKhachHang, deleteKhachHang } from "../../services/khachhangServices";

export default function KhachHang() {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedKhach, setSelectedKhach] = useState(null);
  const [formReq] = Form.useForm();
  
  // State quản lý dữ liệu và từ khóa tìm kiếm
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [keyword] = useState("");

async function fetchData(q = "") {
  setLoading(true);
  try {
    const res = await getAllKhachHang({ keyword: q }); 
    
    console.log("Dữ liệu nhận về:", res.data); 
    setData(res.data || []);
    
    return res.data || [];
  } catch (err) {
    console.error("Lỗi gọi API:", err);
    return [];
  } finally {
    setLoading(false);
  }
}

  // Load dữ liệu khi lần đầu vào trang
  useEffect(() => {
    fetchData();
  }, []);

  // Logic Xóa khách hàng 
  const handleDelete = async (record) => {
    try {
      setLoading(true);
      const res = await deleteKhachHang(record.khid); 
      message.success(res.data.message || "Đã ngưng hoạt động khách hàng");
      await fetchData(keyword); 
    } catch (err) {
      const errorDetail = err?.response?.data?.message || "Lỗi khi xóa khách hàng";
      
      Modal.error({
        title: 'Không thể xóa khách hàng',
        content: errorDetail,
        okText: 'Đã hiểu'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSaveRequest = (values) => {
    console.log("Yêu cầu mới:", values);
    message.success("Cập nhật CSDL thành công");
    setIsModalOpen(false);
    formReq.resetFields();
  };

  const columns = [
    { title: "Mã", dataIndex: "khid", width: 80, ellipsis: true },
    { title: "Họ tên", dataIndex: "hoten", ellipsis: true },
    { title: "SĐT", dataIndex: "sdt", width: 140, ellipsis: true },
    { title: "CMND", dataIndex: "cmnd", width: 150, ellipsis: true },
    { title: "Email", dataIndex: "email", width: 200, ellipsis: true },
    { title: "Địa chỉ", dataIndex: "diachi", width: 220, ellipsis: true },
    {
      title: "Giới tính",
      dataIndex: "gioitinh",
      render: (v) => (Number(v) === 1 ? "Nam" : "Nữ"),
    },
    {
      title: "Loại KH",
      dataIndex: "loaikh",
      render: (v) => (Number(v) === 1 ? <Tag color="gold">VIP</Tag> : <Tag>Thường</Tag>),
    },
    {
      title: "Trạng thái",
      dataIndex: "trangthai",
      render: (v) => (Number(v) === 1 ? <Tag color="green">Hoạt động</Tag> : <Tag color="red">Ngưng</Tag>),
    },
    {
      title: "Hành động",
      key: "action",
      render: (_, record) => (
        <Space>
          <Button size="small" onClick={() => { setSelectedKhach(record); setIsModalOpen(true); }}>
            Lập yêu cầu
          </Button>
          <Button size="small" onClick={() => navigate("/khach-hang/add", { state: record })}>
            Sửa
          </Button>
          <Popconfirm
            title="Xóa khách?"
            onConfirm={() => handleDelete(record)}
            okText="Đồng ý"
            cancelText="Hủy"
          >
            <Button size="small" danger>Xóa</Button>
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
            placeholder="Tìm mã, tên, SĐT..."
            allowClear
            onSearch={(v) => fetchData(v)} 
            onChange={(e) => {
              const val = e.target.value;
              if (!val) {
                fetchData(""); 
              }
            }}
          />
          <Button type="primary" onClick={() => navigate("/khach-hang/add")}>Thêm khách hàng</Button>
        </Space>
      }
    >
      <Table
        loading={loading}
        dataSource={data}
        columns={columns}
        rowKey="khid"
        pagination={{ pageSize: 10 }}
        scroll={{ x: 'max-content' }}
      />

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
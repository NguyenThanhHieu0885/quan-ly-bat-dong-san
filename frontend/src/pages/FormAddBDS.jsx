import React, { useState } from "react";
import { Form, Input, InputNumber, Select, Button, Card, Typography, Row, Col, message } from "antd";
import { useNavigate } from "react-router-dom";
import { addBatDongSan } from "../services/api";

const { Title } = Typography;
const { TextArea } = Input;

const TINH_TRANG_OPTIONS = [
  { value: 0, label: "Còn trống" },
  { value: 1, label: "Đã đặt cọc" },
  { value: 2, label: "Đã bán" },
];

export default function ThemBDS() {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (values) => {
    setLoading(true);
    try {
      await addBatDongSan(values);
      message.success("Thêm bất động sản thành công!");
      navigate("/bat-dong-san");
    } catch (error) {
      message.error(error.response?.data?.message || "Có lỗi xảy ra, vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: "24px", background: "#f5f5f5", minHeight: "100vh" }}>
      <Card>
        <Title level={2}>Thêm Bất Động Sản</Title>
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="Mã số QSDĐ" name="masoqsdd" rules={[{ required: true, message: "Vui lòng nhập mã số QSDĐ" }]}>
                <Input placeholder="Nhập mã số QSDĐ" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Tình trạng" name="tinhtrang" initialValue={0}>
                <Select options={TINH_TRANG_OPTIONS} />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={8}>
              <Form.Item label="Số nhà" name="sonha">
                <Input placeholder="Số nhà" />
              </Form.Item>
            </Col>
            <Col span={16}>
              <Form.Item label="Tên đường" name="tenduong" rules={[{ required: true, message: "Vui lòng nhập tên đường" }]}>
                <Input placeholder="Tên đường" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={8}>
              <Form.Item label="Phường/Xã" name="phuong">
                <Input placeholder="Phường/Xã" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="Quận/Huyện" name="quan">
                <Input placeholder="Quận/Huyện" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="Thành phố" name="thanhpho">
                <Input placeholder="Thành phố" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={8}>
              <Form.Item label="Diện tích (m²)" name="dientich" rules={[{ required: true, message: "Vui lòng nhập diện tích" }]}>
                <InputNumber min={0} style={{ width: "100%" }} placeholder="m²" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="Chiều dài (m)" name="chieudai" rules={[{ required: true, message: "Vui lòng nhập chiều dài" }]}>
                <InputNumber min={0} style={{ width: "100%" }} placeholder="m" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="Chiều rộng (m)" name="chieurong" rules={[{ required: true, message: "Vui lòng nhập chiều rộng" }]}>
                <InputNumber min={0} style={{ width: "100%" }} placeholder="m" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="Đơn giá (VNĐ)" name="dongia" rules={[{ required: true, message: "Vui lòng nhập đơn giá" }]}>
                <InputNumber min={0} style={{ width: "100%" }} formatter={(v) => `${v}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")} parser={(v) => v.replace(/,/g, "")} placeholder="VNĐ" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Hoa hồng (%)" name="huehong">
                <InputNumber min={0} max={100} style={{ width: "100%" }} placeholder="%" />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item label="Mô tả" name="mota">
            <TextArea rows={4} placeholder="Mô tả bất động sản..." />
          </Form.Item>

          <Form.Item style={{ textAlign: "right", marginBottom: 0 }}>
            <Button style={{ marginRight: 8 }} onClick={() => navigate("/bat-dong-san")}>
              Hủy
            </Button>
            <Button type="primary" htmlType="submit" loading={loading}>
              Thêm mới
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
}

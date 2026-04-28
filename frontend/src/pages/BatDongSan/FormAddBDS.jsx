import React, { useState, useEffect } from "react";
import { Form, Input, InputNumber, Select, Button, Card, Typography, Row, Col, message } from "antd";
import { useNavigate } from "react-router-dom";
import api, { addBatDongSan } from "../../services/api";

const { Title } = Typography;
const { TextArea } = Input;

const TINH_TRANG_OPTIONS = [
  { value: 0, label: "Còn trống" },
  { value: 1, label: "Đã đặt cọc" },
];

const generateRandomCode = () => {
  const randomNumber = Math.floor(Math.random() * 999) + 1;
  return `QSD${randomNumber}`;
};

const generateUniqueCode = (existingCodes) => {
  const usedCodes = new Set(existingCodes.map((code) => String(code).toUpperCase()));
  let code = generateRandomCode();
  let attempts = 0;
  while (usedCodes.has(code.toUpperCase()) && attempts < 1000) {
    code = generateRandomCode();
    attempts += 1;
  }
  return code;
};

export default function ThemBDS() {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleValuesChange = (changedValues, allValues) => {
    const chieudai = Number(allValues.chieudai);
    const chieurong = Number(allValues.chieurong);
    if (!Number.isNaN(chieudai) && !Number.isNaN(chieurong) && chieudai > 0 && chieurong > 0) {
      form.setFieldsValue({ dientich: chieudai * chieurong });
    } else {
      form.setFieldsValue({ dientich: undefined });
    }
  };

  useEffect(() => {
    const loadUniqueCode = async () => {
      try {
        let response;
        try {
          response = await api.get("/batdongsan/danhsach");
        } catch (err) {
          response = await api.get("/batdongsan");
        }

        const existingCodes = Array.isArray(response.data)
          ? response.data.map((item) => item.masoqsdd).filter(Boolean)
          : [];
        const newCode = generateUniqueCode(existingCodes);
        form.setFieldsValue({ masoqsdd: newCode });
      } catch (error) {
        form.setFieldsValue({ masoqsdd: generateRandomCode() });
      }
    };

    loadUniqueCode();
  }, [form]);

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
        <Form form={form} layout="vertical" onFinish={handleSubmit} onValuesChange={handleValuesChange}>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="Mã số QSDĐ" name="masoqsdd" rules={[{ required: true, message: "Mã số QSDĐ đang được tự tạo" }]}>
                <Input disabled />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="tinhtrang" initialValue={0} hidden>
                <Input />
              </Form.Item>
              <Form.Item label="Tình trạng">
                <Input value="Còn trống" disabled />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Số nhà" name="tenduong" rules={[{ required: true, message: "Vui lòng nhập số nhà" }]}>
                <Input placeholder="Số nhà" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Tên đường" name="tenduong" rules={[{ required: true, message: "Vui lòng nhập tên đường" }]}>
                <Input placeholder="Tên đường" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={8}>
              <Form.Item label="Phường/Xã" name="phuong" rules={[{ required: true, message: "Vui lòng nhập tên phường/xã" }]}>
                <Input placeholder="Phường/Xã" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="Quận/Huyện" name="quan" rules={[{ required: true, message: "Vui lòng nhập quận/huyện" }]}>
                <Input placeholder="Quận/Huyện" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="Thành phố" name="thanhpho" rules={[{ required: true, message: "Vui lòng nhập thành phố" }]}>
                <Input placeholder="Thành phố" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
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
            <Col span={8}>
              <Form.Item label="Diện tích (m²)" name="dientich">
                <InputNumber min={0} style={{ width: "100%" }} placeholder="m²" disabled />
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

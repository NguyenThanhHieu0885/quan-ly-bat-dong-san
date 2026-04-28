import React, { useEffect, useState } from 'react';
import { Modal, Form, Input, InputNumber, Select, message, Upload, Image, Button } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import api from '../../services/api';

const FormCapNhatBDS = ({ visible, record, onCancel, onSuccess }) => {
    const [form] = Form.useForm();
    const [previewImage, setPreviewImage] = useState(null);
    const [uploadFile, setUploadFile] = useState(null);

    const isLocked = record?.tinhtrang === 1;

    const handleValuesChange = (changedValues, allValues) => {
      if (isLocked) return;
      const chieudai = Number(allValues.chieudai);
      const chieurong = Number(allValues.chieurong);
      if (!Number.isNaN(chieudai) && !Number.isNaN(chieurong) && chieudai > 0 && chieurong > 0) {
        form.setFieldsValue({ dientich: chieudai * chieurong });
      }
    };

    useEffect(() => {
        if (visible && record) {
            form.setFieldsValue({
              ...record,
              dientich: record.dientich,
              dongia: record.dongia
            });
            if (record.hinhanh) {
              const base64 = typeof record.hinhanh === 'string' ? record.hinhanh : null;
              setTimeout(() => setPreviewImage(base64), 0);
            } else {
              setTimeout(() => setPreviewImage(null), 0);
            }
        }
    }, [visible, record, form]);

    const handleSave = async () => {
        try {
            const values = await form.validateFields();

            let payload = {
              ...values,
              dientich: Number(values.dientich),
              dongia: Number(values.dongia)
            };

            if (uploadFile) {
              const reader = new FileReader();
              reader.readAsDataURL(uploadFile);
              await new Promise((resolve, reject) => {
                reader.onload = () => {
                  payload.hinhanh = reader.result;
                  resolve();
                };
                reader.onerror = reject;
              });
            }

            const response = await api.put(`/batdongsan/${record.bdsid}`, payload);

            message.success(response.data.message);
            onSuccess();
        } catch (error) {
            const msg = error.response?.data?.message || "Có lỗi xảy ra";
            message.error(msg);
        }
    };

    return (
        <Modal
            title="CẬP NHẬT BẤT ĐỘNG SẢN"
            open={visible}
            onOk={handleSave} 
            onCancel={() => {
              form.resetFields();
              setPreviewImage(null);
              setUploadFile(null);
              onCancel();
            }} 
            okText="Lưu thay đổi"
            cancelText="Hủy bỏ"
        >
            <Form form={form} layout="vertical" onValuesChange={handleValuesChange}>
                <Form.Item name="masoqsdd" label="Mã số QSDĐ" rules={[{ required: true, message: 'Mã số QSDĐ không được để trống' }]}> 
                    <Input disabled />
                </Form.Item>
                <Form.Item name="tenduong" label="Tên đường" rules={[{ required: true, message: 'Tên đường không được để trống' }]}>
                    <Input disabled={isLocked} />
                </Form.Item>
                <Form.Item name="dientich" label="Diện tích (m2)"> 
                    <InputNumber style={{ width: '100%' }} disabled />
                </Form.Item>
                <Form.Item name="dongia" label="Đơn giá (VNĐ)" rules={[{ required: true, message: 'Đơn giá không được để trống' }]}> 
                    <InputNumber style={{ width: '100%' }} disabled={isLocked} />
                </Form.Item>
                <Form.Item name="chieudai" label="Chiều dài (m)" rules={[{ required: true, message: 'Chiều dài không được để trống' }]}> 
                    <InputNumber style={{ width: '100%' }} disabled={isLocked} />
                </Form.Item>
                <Form.Item name="chieurong" label="Chiều rộng (m)" rules={[{ required: true, message: 'Chiều rộng không được để trống' }]}> 
                    <InputNumber style={{ width: '100%' }} disabled={isLocked} />
                </Form.Item>
                <Form.Item name="huehong" label="Huê hồng (%)">
                    <InputNumber style={{ width: '100%' }} disabled={isLocked} />
                </Form.Item>
                <Form.Item name="sonha" label="Số nhà" rules={[{ required: true, message: 'Số nhà không được để trống' }]}> 
                    <Input disabled={isLocked} />
                </Form.Item>
                <Form.Item name="phuong" label="Phường" rules={[{ required: true, message: 'Phường không được để trống' }]}> 
                    <Input disabled={isLocked} />
                </Form.Item>
                <Form.Item name="quan" label="Quận" rules={[{ required: true, message: 'Quận không được để trống' }]}> 
                    <Input disabled={isLocked} />
                </Form.Item>
                <Form.Item name="thanhpho" label="Thành phố" rules={[{ required: true, message: 'Thành phố không được để trống' }]}> 
                    <Input disabled={isLocked} />
                </Form.Item>
                <Form.Item name="mota" label="Mô tả">
                    <Input.TextArea rows={4} disabled={false} />
                </Form.Item>
                <Form.Item name="loaiid" label="Loại ID">
                    <InputNumber style={{ width: '100%' }} disabled={isLocked} />
                </Form.Item>
                <Form.Item name="khid" label="KH ID">
                    <InputNumber style={{ width: '100%' }} disabled={isLocked} />
                </Form.Item>
                <Form.Item name="tinhtrang" label="Tình trạng" rules={[{ required: true, message: 'Vui lòng chọn tình trạng' }]}> 
                    <Select options={[
                      { value: 0, label: 'Còn trống' },
                      { value: 1, label: 'Đặt cọc' }
                    ]} disabled={isLocked} />
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default FormCapNhatBDS;
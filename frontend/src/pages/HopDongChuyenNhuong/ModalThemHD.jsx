// File: frontend/src/pages/HopDongChuyenNhuong/ModalThemHD.jsx
import React, { useState, useEffect } from 'react';
import { Modal, Form, Input, InputNumber, Select, DatePicker, message } from 'antd';
import { hdChuyenNhuongService } from '../../services/hdChuyenNhuongService';
import dayjs from 'dayjs';

const ModalThemHD = ({ open, onClose, onSuccess }) => {
  const [form] = Form.useForm();
  const [listDatCoc, setListDatCoc] = useState([]);

  useEffect(() => {
    if (open) {
      form.resetFields();
      // Load danh sách HĐ Đặt cọc để user chọn (theo đúng sơ đồ include)
      hdChuyenNhuongService.getHDDatCocHopLe()
        .then(res => setListDatCoc(res.data))
        .catch(err => {
          console.error(err);
          setListDatCoc([]);
          message.error("Không tải được danh sách hợp đồng đặt cọc");
        });
    }
  }, [open]);

  const handleSelectDatCoc = (dcid) => {
    // Tự động điền dữ liệu KH và BĐS từ HĐ Đặt cọc được chọn
    const selectedDC = listDatCoc.find(item => item.dcid === dcid);
    if (selectedDC) {
      form.setFieldsValue({
        khid: selectedDC.khid,
        bdsid: selectedDC.bdsid,
        giatri: selectedDC.giatri // Hoặc có thể cho phép nhập tay
      });
    }
  };

  const handleSave = async () => {
    try {
      const values = await form.validateFields();
      const submitData = {
        ...values,
        ngaylap: values.ngaylap.format('YYYY-MM-DD HH:mm:ss')
      };
      
      await hdChuyenNhuongService.create(submitData);
      message.success("Thêm HĐ Chuyển nhượng thành công & Đã cập nhật doanh thu NV!");
      onSuccess();
      onClose();
    } catch (error) {
      if(error.response) message.error(error.response.data.message);
    }
  };

  return (
    <Modal title="Thêm Hợp Đồng Chuyển Nhượng" open={open} onOk={handleSave} onCancel={onClose} okText="Lưu">
      <Form form={form} layout="vertical">
        <Form.Item name="dcid" label="Chọn từ Hợp Đồng Đặt Cọc" rules={[{ required: true }]}>
          <Select onChange={handleSelectDatCoc} placeholder="Chọn HĐ Đặt Cọc...">
            {listDatCoc.map(dc => (
              <Select.Option key={dc.dcid} value={dc.dcid}>Mã HĐ: {dc.dcid}</Select.Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item name="khid" label="Mã Khách Hàng (Tự động điền)" rules={[{ required: true }]}>
          <Input disabled />
        </Form.Item>

        <Form.Item name="bdsid" label="Mã Bất Động Sản (Tự động điền)" rules={[{ required: true }]}>
          <Input disabled />
        </Form.Item>

        <Form.Item name="giatri" label="Giá trị hợp đồng" rules={[{ required: true }]}>
          <InputNumber style={{ width: '100%' }} formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')} />
        </Form.Item>

        <Form.Item name="ngaylap" label="Ngày lập hợp đồng" rules={[{ required: true }]} initialValue={dayjs()}>
          <DatePicker showTime style={{ width: '100%' }} format="DD/MM/YYYY HH:mm:ss" />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default ModalThemHD;
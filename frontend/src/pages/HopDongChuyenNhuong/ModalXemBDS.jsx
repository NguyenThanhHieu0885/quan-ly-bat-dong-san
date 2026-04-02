// File: frontend/src/pages/HopDongChuyenNhuong/ModalXemBDS.jsx
import React, { useState, useEffect } from 'react';
import { Modal, Descriptions, message, Spin } from 'antd';
import { hdChuyenNhuongService } from '../../services/hdChuyenNhuongService';

const ModalXemBDS = ({ open, bdsid, onClose }) => {
  const [bdsInfo, setBdsInfo] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open && bdsid) {
      setLoading(true);
      hdChuyenNhuongService.getBDSInfo(bdsid)
        .then(res => setBdsInfo(res.data))
        .catch(err => message.error("Lỗi tải thông tin BĐS"))
        .finally(() => setLoading(false));
    }
  }, [open, bdsid]);

  return (
    <Modal title="Thông tin chi tiết Bất Động Sản" open={open} onCancel={onClose} footer={null} width={600}>
      <Spin spinning={loading}>
        {bdsInfo ? (
          <Descriptions bordered column={1}>
            <Descriptions.Item label="Mã BĐS">{bdsInfo.bdsid}</Descriptions.Item>
            <Descriptions.Item label="Mã số QSDD">{bdsInfo.masoqsdd}</Descriptions.Item>
            <Descriptions.Item label="Diện tích">{bdsInfo.dientich} m2</Descriptions.Item>
            <Descriptions.Item label="Đơn giá">{bdsInfo.dongia?.toLocaleString()} đ</Descriptions.Item>
            <Descriptions.Item label="Địa chỉ">{`${bdsInfo.sonha} ${bdsInfo.tenduong}, ${bdsInfo.phuong}, ${bdsInfo.quan}, ${bdsInfo.thanhpho}`}</Descriptions.Item>
            <Descriptions.Item label="Mô tả">{bdsInfo.mota}</Descriptions.Item>
          </Descriptions>
        ) : (
          <p>Không có dữ liệu</p>
        )}
      </Spin>
    </Modal>
  );
};

export default ModalXemBDS;
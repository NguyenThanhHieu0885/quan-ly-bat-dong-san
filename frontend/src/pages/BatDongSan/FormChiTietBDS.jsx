import React from 'react';
import { Modal, Descriptions, Tag, Button } from 'antd';

const FormChiTietBDS = ({ record, visible, onCancel }) => {
  return (
    <Modal
      title="BIỂU MẪU CHI TIẾT BẤT ĐỘNG SẢN"
      open={visible}
      onCancel={onCancel}
      footer={[
        <Button key="close" onClick={onCancel}>Thoát</Button>
      ]}
      width={700}
    >
      {record ? (
        <Descriptions bordered column={2} size="small">
          <Descriptions.Item label="Mã số QSDĐ" span={2}>
            <Tag color="blue">{record.masoqsdd}</Tag>
          </Descriptions.Item>
          <Descriptions.Item label="Tên đường" span={2}>{record.tenduong}</Descriptions.Item>
          <Descriptions.Item label="Diện tích">{record.dientich} m²</Descriptions.Item>
          <Descriptions.Item label="Đơn giá">{record.dongia?.toLocaleString()} VNĐ</Descriptions.Item>
          <Descriptions.Item label="Kích thước">{`Dài ${record.chieudai}m x Rộng ${record.chieurong}m`}</Descriptions.Item>
          <Descriptions.Item label="Huê hồng">{record.huehong}%</Descriptions.Item>
          <Descriptions.Item label="Địa chỉ" span={2}>
            {`${record.sonha || ''}, ${record.phuong || ''}, ${record.quan || ''}, ${record.thanhpho || ''}`}
          </Descriptions.Item>
          <Descriptions.Item label="Mô tả" span={2}>{record.mota || "Chưa có mô tả."}</Descriptions.Item>
        </Descriptions>
      ) : (
        <p style={{ textAlign: 'center' }}>Không có dữ liệu</p>
      )}
    </Modal>
  );
};

export default FormChiTietBDS;
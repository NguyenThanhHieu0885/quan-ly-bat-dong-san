import React, { useState, useEffect } from 'react';
import { Modal, Form, Input, Spin, message, Button } from 'antd';
import dayjs from 'dayjs';
import { hdChuyenNhuongService } from '../../services/hdChuyenNhuongService';

const ModalChiTietHD = ({ open, cnid, onClose }) => {
  const [loading, setLoading] = useState(false);
  const [detail, setDetail] = useState(null);

  const readOnlyInputStyle = {
    backgroundColor: '#fff',
    color: '#000',
    WebkitTextFillColor: '#000'
  };

  const renderLabel = (text) => <span style={{ color: '#000' }}>{text}</span>;

  const formatCurrency = (value) => {
    if (value === null || value === undefined || Number.isNaN(Number(value))) return '';
    return `${Number(value).toLocaleString('vi-VN')} đ`;
  };

  useEffect(() => {
    if (open && cnid) {
      setLoading(true);
      hdChuyenNhuongService.getDetail(cnid)
        .then((res) => setDetail(res.data))
        .catch(() => {
          setDetail(null);
          message.error('Không tải được chi tiết hợp đồng chuyển nhượng');
        })
        .finally(() => setLoading(false));
    } else if (!open) {
      setDetail(null);
    }
  }, [open, cnid]);

  return (
    <Modal
      title="Chi Tiết Hợp Đồng Chuyển Nhượng"
      open={open}
      onCancel={onClose}
      width={700}
      styles={{
        header: { backgroundColor: '#fff', color: '#000' },
        body: { backgroundColor: '#fff', color: '#000' },
        content: { backgroundColor: '#fff', color: '#000' }
      }}
      footer={[
        <Button key="close" onClick={onClose}>
          Đóng
        </Button>
      ]}
    >
      <Spin spinning={loading}>
        {detail ? (
          <Form layout="vertical">
            <Form.Item label={renderLabel('Mã HĐ Đặt Cọc liên kết')}>
              <Input readOnly style={readOnlyInputStyle} value={detail.dcid_lienket ?? ''} />
            </Form.Item>

            <Form.Item label={renderLabel('Mã Khách Hàng')}>
              <Input readOnly style={readOnlyInputStyle} value={detail.khid ?? ''} />
            </Form.Item>

            <Form.Item label={renderLabel('Họ tên khách hàng')}>
              <Input readOnly style={readOnlyInputStyle} value={detail.khhoten ?? ''} />
            </Form.Item>

            <Form.Item label={renderLabel('SĐT khách hàng')}>
              <Input readOnly style={readOnlyInputStyle} value={detail.khsdt ?? ''} />
            </Form.Item>

            <Form.Item label={renderLabel('Mã Bất Động Sản')}>
              <Input readOnly style={readOnlyInputStyle} value={detail.bdsid ?? ''} />
            </Form.Item>

            <Form.Item label={renderLabel('Loại BĐS (ID)')}>
              <Input readOnly style={readOnlyInputStyle} value={detail.bdsloai ?? ''} />
            </Form.Item>

            <Form.Item label={renderLabel('Địa chỉ BĐS')}>
              <Input readOnly style={readOnlyInputStyle} value={detail.bdsdiachi ?? ''} />
            </Form.Item>

            <Form.Item label={renderLabel('Diện tích BĐS (m2)')}>
              <Input readOnly style={readOnlyInputStyle} value={detail.bdsdientich ?? ''} />
            </Form.Item>

            <Form.Item label={renderLabel('Giá trị hợp đồng')}>
              <Input readOnly style={readOnlyInputStyle} value={formatCurrency(detail.giatri)} />
            </Form.Item>

            <Form.Item label={renderLabel('Ngày lập hợp đồng')}>
              <Input readOnly style={readOnlyInputStyle} value={detail.ngaylap ? dayjs(detail.ngaylap).format('DD/MM/YYYY HH:mm:ss') : ''} />
            </Form.Item>
          </Form>
        ) : (
          !loading && <p style={{ color: '#000' }}>Không có dữ liệu</p>
        )}
      </Spin>
    </Modal>
  );
};

export default ModalChiTietHD;

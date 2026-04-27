// File: frontend/src/pages/HopDongChuyenNhuong/ModalThemHD.jsx
// Import React hooks và các thư viện cần thiết
<<<<<<< Updated upstream
import React, { useState, useEffect, useRef } from 'react';
=======
import React, { useState, useEffect } from 'react';
>>>>>>> Stashed changes
import { Modal, Form, Input, InputNumber, Select, DatePicker, message } from 'antd';
import { hdChuyenNhuongService } from '../../services/hdChuyenNhuongService';
import dayjs from 'dayjs';

// Component modal thêm hợp đồng chuyển nhượng
const ModalThemHD = ({ open, onClose, onSuccess }) => {
  // Khởi tạo form và state danh sách HĐ đặt cọc
  const [form] = Form.useForm();
  const [listDatCoc, setListDatCoc] = useState([]);
<<<<<<< Updated upstream
  const [loadingDatCoc, setLoadingDatCoc] = useState(false);
  const searchTimeoutRef = useRef(null);

  const loadDatCocOptions = async (keyword = '') => {
    setLoadingDatCoc(true);
    try {
      const res = await hdChuyenNhuongService.getHDDatCocHopLe({
        keyword,
        limit: 50,
      });
      setListDatCoc(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error(err);
      setListDatCoc([]);
      message.error('Không tải được danh sách hợp đồng đặt cọc');
    } finally {
      setLoadingDatCoc(false);
    }
  };

  const handleSearchDatCoc = (value) => {
    const keyword = (value || '').trim();
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }
    searchTimeoutRef.current = setTimeout(() => {
      loadDatCocOptions(keyword);
    }, 300);
  };
=======
>>>>>>> Stashed changes

  // Hàm định dạng tiền tệ theo chuẩn Việt Nam
  const formatCurrency = (value) => {
    if (value === null || value === undefined || Number.isNaN(Number(value))) return '-';
    return Number(value).toLocaleString('vi-VN');
  };

  // Tạo nhãn hiển thị cho từng HĐ đặt cọc trong Select
  const renderDatCocLabel = (dc) => {
    const tenKhachHang = dc.tenkhachhang || `KH #${dc.khid}`;
    const bdsDisplay = dc.masoqsdd
      ? `${dc.masoqsdd}${dc.diachibds ? ` - ${dc.diachibds}` : ''}`
      : `BDS #${dc.bdsid}`;
    const giaTri = formatCurrency(dc.giatri);

    return `HĐ ${dc.dcid} | KH: ${tenKhachHang} | BĐS: ${bdsDisplay} | Cọc: ${giaTri}`;
  };

  // Khi mở modal thì reset form và tải danh sách HĐ đặt cọc hợp lệ
  useEffect(() => {
    if (open) {
      form.resetFields();
<<<<<<< Updated upstream
      loadDatCocOptions();
    }
    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
=======
      // Load danh sách HĐ Đặt cọc để user chọn (theo đúng sơ đồ include)
      hdChuyenNhuongService.getHDDatCocHopLe()
        .then(res => setListDatCoc(res.data))
        .catch(err => {
          console.error(err);
          setListDatCoc([]);
          message.error("Không tải được danh sách hợp đồng đặt cọc");
        });
    }
>>>>>>> Stashed changes
  }, [open]);

  // Khi chọn HĐ đặt cọc thì tự động điền thông tin KH và BĐS
  const handleSelectDatCoc = (dcid) => {
    // Tự động điền dữ liệu KH và BĐS từ HĐ Đặt cọc được chọn
    const selectedDC = listDatCoc.find(item => item.dcid === dcid);
    if (selectedDC) {
      form.setFieldsValue({
        dcid_lienket: selectedDC.dcid,
        khid: selectedDC.khid,
        khhoten: selectedDC.tenkhachhang,
        khsdt: selectedDC.sdtkhachhang,
        bdsid: selectedDC.bdsid,
        bdsloai: selectedDC.loaibds,
        bdsdiachi: selectedDC.diachibds,
        bdsdientich: selectedDC.dientich,
<<<<<<< Updated upstream
        giatri: selectedDC.giabds // Tự động lấy giá BĐS thay vì giá cọc
=======
        giatri: selectedDC.giatri // Hoặc có thể cho phép nhập tay
>>>>>>> Stashed changes
      });
    }
  };

  // Lưu hợp đồng chuyển nhượng sau khi kiểm tra dữ liệu
  const handleSave = async () => {
    try {
      const values = await form.validateFields();
      const { dcid, khid, bdsid, giatri, ngaylap } = values;
      const submitData = {
        dcid,
        khid,
        bdsid,
        giatri,
        ngaylap: ngaylap.format('YYYY-MM-DD HH:mm:ss')
      };
      
      await hdChuyenNhuongService.create(submitData);
      message.success("Thêm HĐ Chuyển nhượng thành công & Đã cập nhật doanh thu NV!");
      onSuccess();
      onClose();
    } catch (error) {
      if(error.response) message.error(error.response.data.message);
    }
  };

  // Giao diện modal và form nhập liệu
  return (
    <Modal title="Thêm Hợp Đồng Chuyển Nhượng" open={open} onOk={handleSave} onCancel={onClose} okText="Lưu">
      <Form form={form} layout="vertical">
        {/* Chọn HĐ đặt cọc để liên kết dữ liệu */}
        <Form.Item name="dcid" label="Chọn từ Hợp Đồng Đặt Cọc" rules={[{ required: true }]}>
<<<<<<< Updated upstream
          <Select
            showSearch
            filterOption={false}
            onSearch={handleSearchDatCoc}
            onChange={handleSelectDatCoc}
            placeholder="Nhập tên khách hàng đặt cọc để tìm..."
            loading={loadingDatCoc}
            notFoundContent={loadingDatCoc ? 'Đang tải dữ liệu...' : 'Không có hợp đồng phù hợp'}
          >
=======
          <Select onChange={handleSelectDatCoc} placeholder="Chọn HĐ Đặt Cọc...">
>>>>>>> Stashed changes
            {listDatCoc.map(dc => (
              <Select.Option key={dc.dcid} value={dc.dcid}>
                {renderDatCocLabel(dc)}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>

        {/* Mã HĐ đặt cọc liên kết */}
        <Form.Item name="dcid_lienket" label="Mã HĐ Đặt Cọc liên kết">
          <Input disabled />
        </Form.Item>

        {/* Thông tin khách hàng được tự động điền */}
        <Form.Item name="khid" label="Mã Khách Hàng (Tự động điền)" rules={[{ required: true }]}>
          <Input disabled />
        </Form.Item>

        <Form.Item name="khhoten" label="Họ tên khách hàng">
          <Input disabled />
        </Form.Item>

        <Form.Item name="khsdt" label="SĐT khách hàng">
          <Input disabled />
        </Form.Item>

        {/* Thông tin bất động sản được tự động điền */}
        <Form.Item name="bdsid" label="Mã Bất Động Sản (Tự động điền)" rules={[{ required: true }]}>
          <Input disabled />
        </Form.Item>

        <Form.Item name="bdsloai" label="Loại BĐS (ID)">
          <Input disabled />
        </Form.Item>

        <Form.Item name="bdsdiachi" label="Địa chỉ BĐS">
          <Input disabled />
        </Form.Item>

        <Form.Item name="bdsdientich" label="Diện tích BĐS (m2)">
          <InputNumber style={{ width: '100%' }} disabled />
        </Form.Item>

        {/* Giá trị hợp đồng có thể chỉnh sửa */}
        <Form.Item name="giatri" label="Giá trị hợp đồng" rules={[{ required: true }]}>
          <InputNumber style={{ width: '100%' }} formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')} />
        </Form.Item>

        {/* Ngày lập hợp đồng */}
        <Form.Item name="ngaylap" label="Ngày lập hợp đồng" rules={[{ required: true }]} initialValue={dayjs()}>
          <DatePicker showTime style={{ width: '100%' }} format="DD/MM/YYYY HH:mm:ss" />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default ModalThemHD;
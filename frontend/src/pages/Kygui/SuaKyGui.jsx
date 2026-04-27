import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { layKyGuiTheoId, capNhatKyGui, layDanhSachBDS, layDanhSachKhachHang, layDanhSachKyGui } from '../../services/hopdongkyguiServices';
import Toast from '../../components/Toast';
import { Select, Card, Input, Button } from 'antd';

export default function SuaKyGui() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    khid: '',
    bdsid: '',
    giatri: '',
    chiphidv: '',
    ngaybatdau: '',
    ngayketthuc: '',
    trangthai: ''
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);
  const [danhSachBDS, setDanhSachBDS] = useState([]);
  const [danhSachKH, setDanhSachKH] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await layKyGuiTheoId(id);
        const data = response.data;
        const formattedData = {
          ...data,
          ngaybatdau: data.ngaybatdau ? new Date(data.ngaybatdau).toISOString().split('T')[0] : '',
          ngayketthuc: data.ngayketthuc ? new Date(data.ngayketthuc).toISOString().split('T')[0] : '',
          giatri: data.giatri ? String(data.giatri).replace(/\B(?=(\d{3})+(?!\d))/g, ',') : '',
          chiphidv: data.chiphidv ? String(data.chiphidv).replace(/\B(?=(\d{3})+(?!\d))/g, ',') : '',
          trangthai: String(data.trangthai)
        };
        setFormData(formattedData);

        // Tải danh sách Bất Động Sản và Khách Hàng
        const [bdsResponse, khResponse, kyGuiResponse] = await Promise.all([
          layDanhSachBDS(),
          layDanhSachKhachHang(),
          layDanhSachKyGui()
        ]);
        
        // Lọc BĐS: Loại bỏ những BĐS đã có HĐ ký gửi hiệu lực (NGOẠI TRỪ HĐ hiện tại đang sửa)
        const activeKyGuiBdsIds = kyGuiResponse.data
          .filter(kg => String(kg.trangthai) === '1' && String(kg.kgid) !== String(id))
          .map(kg => kg.bdsid);
        const availableBDS = bdsResponse.data.filter(bds => !activeKyGuiBdsIds.includes(bds.bdsid));

        setDanhSachBDS(availableBDS);
        setDanhSachKH(khResponse.data);
      } catch (err) {
        setError('Không thể tải dữ liệu hợp đồng. ' + (err.response?.data?.message || ''));
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'giatri' || name === 'chiphidv') {
      const numericValue = String(value).replace(/\D/g, '');
      const formattedValue = numericValue.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
      setFormData({ ...formData, [name]: formattedValue });
    } else if (name === 'khid' || name === 'bdsid') {
      setFormData({ ...formData, [name]: value.toUpperCase() });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    const giatriRaw = String(formData.giatri).replace(/,/g, '');
    const chiphidvRaw = String(formData.chiphidv).replace(/,/g, '');

    const { khid, bdsid, ngaybatdau, ngayketthuc } = formData;
    if (!khid || !bdsid || !giatriRaw || !chiphidvRaw || !ngaybatdau) {
      setError('Vui lòng điền đầy đủ các trường có dấu (*).');
      return;
    }

    if (ngayketthuc && new Date(ngayketthuc) < new Date(ngaybatdau)) {
      setError('Ngày kết thúc không được nhỏ hơn ngày bắt đầu.');
      return;
    }

    setLoading(true);

    try {
      const payload = {
        ...formData,
        giatri: Number(giatriRaw),
        chiphidv: Number(chiphidvRaw)
      };
      await capNhatKyGui(id, payload);
      setShowSuccess(true);
      setTimeout(() => navigate('/quan-ly-ky-gui'), 2000);
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Có lỗi xảy ra, vui lòng thử lại.';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  if (loading && !formData.khid) {
    return (
      <div style={{ padding: '20px' }}>
        <div style={{ textAlign: 'center', marginTop: '100px', fontSize: '18px' }}>
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ display: 'block', margin: '0 auto 15px' }}>
            <circle cx="12" cy="12" r="10" stroke="rgba(255,255,255,0.1)" strokeWidth="4"></circle>
            <path d="M12 2C6.477 2 2 6.477 2 12h4c0-3.314 2.686-6 6-6V2z" fill="#1677ff">
              <animateTransform attributeName="transform" type="rotate" from="0 12 12" to="360 12 12" dur="1s" repeatCount="indefinite" />
            </path>
          </svg>
          Đang tải dữ liệu hợp đồng...
        </div>
      </div>
    );
  }

  return (
    <div style={{ padding: '10px' }}>
      <Toast show={showSuccess} message="Cập nhật hợp đồng thành công!" />

      <Card 
        title={<h2 style={{ textAlign: 'center', margin: 0, color: '#1677ff' }}>Chỉnh Sửa Hợp Đồng Ký Gửi (ID: {id})</h2>} 
        style={{ maxWidth: '800px', margin: '0 auto', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', borderRadius: '12px' }}
      >
        
        <form onSubmit={handleSubmit}>
          <div style={{ maxWidth: '600px', margin: '0 auto' }}>
            <div style={{ color: '#ff4d4d', textAlign: 'center', minHeight: '24px', marginBottom: '15px', fontWeight: 'bold' }}>{error || '\u00A0'}</div>
            
            <div style={{ marginBottom: '15px' }}>
              <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '8px' }}>Mã Khách Hàng (*):</label>
              <Select
                size="large"
                showSearch
                allowClear
                style={{ width: '100%' }}
                placeholder="🔍 Nhập Tên Khách Hàng hoặc ID để tìm..."
                value={formData.khid || undefined}
                onChange={(value) => handleChange({ target: { name: 'khid', value: value || '' } })}
                options={danhSachKH.map(kh => ({
                  value: kh.khid,
                  label: `${kh.hoten || 'Chưa cập nhật tên'} (Mã KH: ${kh.khid})`
                }))}
                filterOption={(input, option) =>
                  String(option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                }
              />
            </div>
            
            <div style={{ marginBottom: '15px' }}>
              <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '8px' }}>Mã Bất Động Sản (*):</label>
              <Select
                size="large"
                showSearch
                allowClear
                style={{ width: '100%' }}
                placeholder="🔍 Nhập Địa chỉ BĐS hoặc ID để tìm..."
                value={formData.bdsid || undefined}
                onChange={(value) => handleChange({ target: { name: 'bdsid', value: value || '' } })}
                options={danhSachBDS.map(bds => {
                  const bdsName = `${bds.sonha || ''} ${bds.tenduong || ''}`.trim();
                  return {
                    value: bds.bdsid,
                    label: bdsName ? `${bdsName} (Mã: ${bds.bdsid})` : `BĐS ${bds.bdsid} - QSDĐ: ${bds.masoqsdd || 'N/A'}`
                  };
                })}
                filterOption={(input, option) =>
                  String(option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                }
              />
            </div>
            
            <div style={{ marginBottom: '15px' }}>
              <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '8px' }}>Giá trị Hợp Đồng (VNĐ) (*):</label>
              <Input size="large" type="text" inputMode="numeric" name="giatri" value={formData.giatri} onChange={handleChange} required placeholder="Ví dụ: 3,500,000,000" />
            </div>
            
            <div style={{ marginBottom: '15px' }}>
              <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '8px' }}>Chi Phí Dịch Vụ (VNĐ) (*):</label>
              <Input size="large" type="text" inputMode="numeric" name="chiphidv" value={formData.chiphidv} onChange={handleChange} required placeholder="Ví dụ: 50,000,000" />
            </div>
            
            <div style={{ marginBottom: '15px' }}>
              <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '8px' }}>Ngày Bắt Đầu (*):</label>
              <Input size="large" type="date" name="ngaybatdau" value={formData.ngaybatdau} onChange={handleChange} required readOnly style={{ backgroundColor: '#f5f5f5', color: '#888', cursor: 'not-allowed' }} />
              <span style={{ fontSize: '13px', color: '#888', marginTop: '5px', display: 'block', fontStyle: 'italic' }}>* Ngày bắt đầu của hợp đồng không thể thay đổi.</span>
            </div>
            
            <div style={{ marginBottom: '15px' }}>
              <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '8px' }}>Ngày Kết Thúc:</label>
              <Input size="large" type="date" name="ngayketthuc" value={formData.ngayketthuc} onChange={handleChange} min={formData.ngaybatdau} />
            </div>
            
            <div style={{ marginBottom: '25px' }}>
              <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '8px' }}>Trạng Thái:</label>
              <Select size="large" style={{ width: '100%' }} value={String(formData.trangthai)} onChange={(value) => handleChange({ target: { name: 'trangthai', value } })}>
                <Select.Option value="1">Đang hiệu lực</Select.Option>
                <Select.Option value="3">Chấm dứt HĐ</Select.Option>
              </Select>
            </div>
            
            <div style={{ display: 'flex', gap: '15px' }}>
              <Button size="large" onClick={() => { if (window.confirm('Bạn có chắc chắn muốn hủy bỏ những thay đổi đang nhập dở không?')) navigate('/quan-ly-ky-gui'); }} style={{ width: '50%' }}>
                Hủy
              </Button>
              <Button size="large" type="primary" htmlType="submit" loading={loading} style={{ width: '50%' }}>
                {loading ? 'Đang lưu...' : 'Lưu Thay Đổi'}
              </Button>
            </div>
          </div>
        </form>
      </Card>
    </div>
  );
}
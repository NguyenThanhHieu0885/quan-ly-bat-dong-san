import React, { useState, useEffect } from 'react';
import { taoKyGuiMoi, layDanhSachBDS, layDanhSachKhachHang, layDanhSachKyGui } from '../../services/hopdongkyguiServices';
import { useNavigate } from 'react-router-dom';
import Toast from '../../components/Toast';
import { Select, Card, Input, Button } from 'antd';

export default function TaoKyGui() {
  const today = new Date().toISOString().split('T')[0];
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    khid: '',
    bdsid: '',
    giatri: '',
    chiphidv: '',
    ngaybatdau: today,
    ngayketthuc: '',
    trangthai: '1' // Mặc định là Đang hiệu lực
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);
  const [danhSachBDS, setDanhSachBDS] = useState([]);
  const [danhSachKH, setDanhSachKH] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [bdsResponse, khResponse, kyGuiResponse] = await Promise.all([
          layDanhSachBDS(),
          layDanhSachKhachHang(),
          layDanhSachKyGui()
        ]);
        
        // Lọc BĐS: Chỉ giữ lại những BĐS CHƯA có hợp đồng ký gửi nào đang hiệu lực
        const activeKyGuiBdsIds = kyGuiResponse.data
          .filter(kg => String(kg.trangthai) === '1')
          .map(kg => kg.bdsid);
        const availableBDS = bdsResponse.data.filter(bds => !activeKyGuiBdsIds.includes(bds.bdsid));

        setDanhSachBDS(availableBDS);
        setDanhSachKH(khResponse.data);
      } catch (err) {
        console.error('Lỗi khi tải dữ liệu dropdown:', err);
      }
    };
    fetchData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'giatri' || name === 'chiphidv') {
      const numericValue = String(value).replace(/\D/g, '');
      const formattedValue = numericValue.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
      setFormData({ ...formData, [name]: formattedValue });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    const giatriRaw = formData.giatri.replace(/,/g, '');
    const chiphidvRaw = formData.chiphidv.replace(/,/g, '');

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
        chiphidv: Number(chiphidvRaw),
        // Tránh lỗi MySQL khi chuỗi ngày tháng bị rỗng
        ngayketthuc: formData.ngayketthuc ? formData.ngayketthuc : null
      };
      await taoKyGuiMoi(payload);
      setFormData({
        khid: '', bdsid: '', giatri: '', chiphidv: '',
        ngaybatdau: today, ngayketthuc: '', trangthai: '1'
      });
      setShowSuccess(true);
      // Đợi 2s để hiện Toast rồi tự động chuyển về trang Quản Lý
      setTimeout(() => navigate('/quan-ly-ky-gui'), 2000);
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Có lỗi xảy ra, vui lòng thử lại.';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '10px' }}>
      <Toast show={showSuccess} message="Tạo hợp đồng thành công!" />

      <Card 
        title={<h2 style={{ textAlign: 'center', margin: 0, color: '#1677ff' }}>Tạo Hợp Đồng Ký Gửi Mới</h2>} 
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
              <span style={{ fontSize: '13px', color: '#888', marginTop: '5px', display: 'block', fontStyle: 'italic' }}>* Ngày bắt đầu là ngày hôm nay và không thể thay đổi.</span>
            </div>
            
            <div style={{ marginBottom: '15px' }}>
              <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '8px' }}>Ngày Kết Thúc:</label>
              <Input size="large" type="date" name="ngayketthuc" value={formData.ngayketthuc} onChange={handleChange} min={formData.ngaybatdau} />
            </div>
            
            <div style={{ marginBottom: '25px' }}>
              <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '8px' }}>Trạng Thái:</label>
              <Select size="large" style={{ width: '100%' }} value={String(formData.trangthai)} onChange={(value) => handleChange({ target: { name: 'trangthai', value } })}>
                <Select.Option value="1">Đang hiệu lực</Select.Option>
              </Select>
            </div>
            
            <div style={{ display: 'flex', gap: '15px' }}>
              <Button size="large" onClick={() => { if (window.confirm('Bạn có chắc chắn muốn hủy và quay lại trang quản lý không?')) navigate('/quan-ly-ky-gui'); }} style={{ width: '50%' }}>
                Hủy
              </Button>
              <Button size="large" type="primary" htmlType="submit" loading={loading} style={{ width: '50%' }}>
                {loading ? 'Đang xử lý...' : 'Tạo Hợp Đồng'}
              </Button>
            </div>
          </div>
        </form>
      </Card>
    </div>
  );
}
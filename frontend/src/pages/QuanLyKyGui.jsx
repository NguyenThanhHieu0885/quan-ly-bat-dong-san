import React, { useState, useEffect } from 'react';
import { layDanhSachKyGui, xoaKyGui } from '../services/kyGuiService';
import { Link } from 'react-router-dom';
import Toast from '../components/Toast';

export default function QuanLyKyGui() {
  const [danhSach, setDanhSach] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await layDanhSachKyGui();
        setDanhSach(response.data);
      } catch (err) {
        console.error('Lỗi khi gọi API lấy danh sách:', err);
        setError('Không thể tải dữ liệu. Vui lòng kiểm tra lại server hoặc kết nối mạng.');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa hợp đồng này không?')) {
      try {
        await xoaKyGui(id);
        setDanhSach(danhSach.filter(item => item.kgid !== id));
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 3000);
      } catch (err) {
        console.error('Lỗi khi xóa hợp đồng:', err);
        alert(err.response?.data?.message || 'Có lỗi xảy ra khi xóa hợp đồng.');
      }
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN').format(price);
  };
  
  const formatDate = (dateString) => {
    const options = { day: '2-digit', month: '2-digit', year: 'numeric' };
    return new Date(dateString).toLocaleDateString('vi-VN', options);
  };

  const formatTrangThai = (status) => {
    switch (String(status)) {
      case '0': return 'Mới tạo';
      case '1': return 'Đang hiệu lực';
      case '2': return 'Đã hết hạn';
      case '3': return 'Đã hủy';
      default: return status;
    }
  };

  const filteredDanhSach = danhSach.filter(item => {
    const matchKhid = item.khid?.toString().toLowerCase().includes(searchTerm.toLowerCase());
    const matchStatus = filterStatus === '' || String(item.trangthai) === filterStatus;
    return matchKhid && matchStatus;
  }).sort((a, b) => {
    return String(a.khid).localeCompare(String(b.khid), undefined, { numeric: true });
  });

  const darkTheme = {
    container: { color: '#f0f0f0' },
    h2: { color: '#00aaff', textAlign: 'center', marginBottom: '25px' },
    tableContainer: {boxShadow: '0 5px 15px rgba(0,0,0,0.3)', borderRadius: '10px' },
    table: { width: '100%', borderCollapse: 'collapse', backgroundColor: '#2c2c2c' },
    th: { padding: '15px', fontWeight: 'bold', backgroundColor: '#3b3b3b', borderBottom: '2px solid #555' },
    td: { padding: '15px', borderBottom: '1px solid #444' },
    trEven: { backgroundColor: '#2c2c2c' },
    trOdd: { backgroundColor: '#343434' },
    loading: { textAlign: 'center', padding: '50px', fontSize: '18px', color: '#e0e0e0' },
    error: { textAlign: 'center', color: '#ff4d4d', padding: '50px', fontSize: '18px' },
    empty: { textAlign: 'center', padding: '30px', color: '#999' },
    filterContainer: { display: 'flex', gap: '15px', marginBottom: '20px' },
    filterInput: { padding: '10px', borderRadius: '5px', border: '1px solid #555', backgroundColor: '#3b3b3b', color: '#f0f0f0', fontSize: '15px' }
  };

  const btnEditStyle = {
    backgroundColor: '#ffc107',
    color: 'black',
    border: 'none',
    padding: '8px 12px',
    borderRadius: '5px',
    cursor: 'pointer',
    textDecoration: 'none',
    display: 'inline-block',
  };

  const btnDeleteStyle = {
    backgroundColor: '#dc3545',
    color: 'white',
    border: 'none',
    padding: '8px 12px',
    borderRadius: '5px',
    cursor: 'pointer',
    transition: 'background-color 0.2s'
  };

  if (loading) {
    return (
      <div style={darkTheme.container}>
        <div style={{ textAlign: 'center', marginTop: '100px', fontSize: '18px' }}>
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ display: 'block', margin: '0 auto 15px' }}>
            <circle cx="12" cy="12" r="10" stroke="rgba(255,255,255,0.1)" strokeWidth="4"></circle>
            <path d="M12 2C6.477 2 2 6.477 2 12h4c0-3.314 2.686-6 6-6V2z" fill="#007bff">
              <animateTransform attributeName="transform" type="rotate" from="0 12 12" to="360 12 12" dur="1s" repeatCount="indefinite" />
            </path>
          </svg>
          Đang tải dữ liệu...
        </div>
      </div>
    );
  }
  if (error) return <div style={darkTheme.error}>{error}</div>;

  return (
    <div style={darkTheme.container}>
      <Toast show={showSuccess} message="Xóa hợp đồng thành công!" />

      <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
        <h2 style={darkTheme.h2}>Bảng Quản Lý Hợp Đồng Ký Gửi</h2>
        
        <div style={darkTheme.filterContainer}>
          <input
            type="text"
            placeholder="🔍 Tìm kiếm theo Mã Khách Hàng..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ ...darkTheme.filterInput, flex: 1 }}
          />
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            style={{ ...darkTheme.filterInput, minWidth: '200px' }}
          >
            <option value="">Tất cả trạng thái</option>
            <option value="0">Mới tạo</option>
            <option value="1">Đang hiệu lực</option>
            <option value="2">Đã hết hạn</option>
            <option value="3">Đã hủy</option>
          </select>
        </div>

        <div style={darkTheme.tableContainer}>
          <table style={darkTheme.table}>
            <thead>
              <tr>
                <th style={darkTheme.th}>Mã KG</th>
                <th style={darkTheme.th}>Mã KH</th>
                <th style={darkTheme.th}>Mã BĐS</th>
                <th style={darkTheme.th}>Giá trị HĐ (VNĐ)</th>
                <th style={darkTheme.th}>Phí DV (VNĐ)</th>
                <th style={darkTheme.th}>Ngày Bắt Đầu</th>
                <th style={darkTheme.th}>Ngày Kết Thúc</th>
                <th style={darkTheme.th}>Trạng Thái</th>
                <th style={darkTheme.th}>Hành Động</th>
              </tr>
            </thead>
            <tbody>
              {filteredDanhSach.length === 0 ? (
                <tr>
                  <td colSpan="9" style={darkTheme.empty}>Không tìm thấy hợp đồng nào phù hợp.</td>
                </tr>
              ) : (
                filteredDanhSach.map((item, index) => (
                  <tr key={item.kgid} style={index % 2 === 0 ? darkTheme.trEven : darkTheme.trOdd}>
                    <td style={darkTheme.td}>{item.kgid}</td>
                    <td style={darkTheme.td}>{item.khid}</td>
                    <td style={darkTheme.td}>{item.bdsid}</td>
                    <td style={{...darkTheme.td, textAlign: 'right'}}>{formatPrice(item.giatri)}</td>
                    <td style={{...darkTheme.td, textAlign: 'right'}}>{formatPrice(item.chiphidv)}</td>
                    <td style={darkTheme.td}>{formatDate(item.ngaybatdau)}</td>
                    <td style={darkTheme.td}>{item.ngayketthuc ? formatDate(item.ngayketthuc) : 'N/A'}</td>
                    <td style={{...darkTheme.td, whiteSpace: 'nowrap'}}>{formatTrangThai(item.trangthai)}</td>
                    <td style={darkTheme.td}>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <Link to={`/sua-ky-gui/${item.kgid}`} style={btnEditStyle}>
                          Sửa
                        </Link>
                        <button style={btnDeleteStyle} onClick={() => handleDelete(item.kgid)}>
                          Xóa
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
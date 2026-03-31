import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import DanhSachBDS from './pages/DanhSachBDS';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/danh-sach-bds" replace />} />
        <Route path="/danh-sach-bds" element={<DanhSachBDS />} />
        <Route path="/bat-dong-san" element={<DanhSachBDS />} />
        <Route path="*" element={<Navigate to="/danh-sach-bds" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
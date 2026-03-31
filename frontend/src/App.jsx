import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import DanhSachBDS from './pages/DanhSachBDS';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/danh-sach-bds" element={<DanhSachBDS />} />
      </Routes>
    </Router>
  );
}

export default App;
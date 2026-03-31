import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import TaoKyGui from './pages/TaoKyGui';
import QuanLyKyGui from './pages/QuanLyKyGui';
import TrangChu from './pages/TrangChu';
import SuaKyGui from './pages/SuaKyGui';
import Layout from './components/Layout';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<TrangChu />} />
          <Route path="tao-ky-gui" element={<TaoKyGui />} />
          <Route path="quan-ly-ky-gui" element={<QuanLyKyGui />} />
          <Route path="sua-ky-gui/:id" element={<SuaKyGui />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
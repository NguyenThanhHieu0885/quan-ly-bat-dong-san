import React from 'react';

const Login = () => {
  return (
    <div className="login-page">
      <h2>Đăng nhập Hệ thống Quản lý BĐS</h2>
      <form>
        <input type="text" placeholder="Tài khoản nhân viên" />
        <input type="password" placeholder="Mật khẩu" />
        <button type="submit">Đăng nhập</button>
      </form>
    </div>
  );
};

export default Login;
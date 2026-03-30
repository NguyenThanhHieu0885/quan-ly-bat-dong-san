import api from "./api";

const USE_FAKE_API = true;

export const loginApi = async (data) => {
  if (USE_FAKE_API) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (
          data.email === "lan@gmail.com" &&
          data.password === "123456"
        ) {
          resolve({
            data: {
              token: "demo-token",
              user: {
                email: data.email,
                role: "admin", // hoặc "nhanvien"
              },
            },
          });
        } else {
          reject(new Error("Sai tài khoản"));
        }
      }, 500);
    });
  }

  return api.post("/auth/login", data);
};
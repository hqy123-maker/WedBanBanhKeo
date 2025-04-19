import { defineStore } from "pinia";
import axios from "axios";

export const useAuthStore = defineStore("auth", {
  state: () => ({
    isLoggedIn: false,
    user: null,
    token: localStorage.getItem("token") || null,
  }),
  actions: {
    async loginUser(credentials) {
      try {
        const response = await axios.post("http://localhost:5000/api/auth/login", credentials);
        this.isLoggedIn = true;
        this.user = response.data.user;
        this.token = response.data.token;
        localStorage.setItem("token", response.data.token);
        return response.data;
      } catch (error) {
        this.isLoggedIn = false;
        this.user = null;
        this.token = null;
        localStorage.removeItem("token");
        throw error;
      }
    },
    async logoutUser() {
      try {
        await axios.post(
          "http://localhost:5000/api/auth/logout",
          {},
          {
            headers: { Authorization: `Bearer ${this.token}` },
          }
        );
        this.isLoggedIn = false;
        this.user = null;
        this.token = null;
        localStorage.removeItem("token");
      } catch (error) {
        console.error("Lỗi đăng xuất:", error);
        this.isLoggedIn = false;
        this.user = null;
        this.token = null;
        localStorage.removeItem("token");
      }
    },
    async checkAuth() {
      if (this.token) {
        try {
          console.log("🔍 Kiểm tra đăng nhập với token:", this.token);
          const response = await axios.get("http://localhost:5000/api/auth/profile", {
            headers: { Authorization: `Bearer ${this.token}` },
          });
          this.isLoggedIn = true;
          this.user = response.data;
          console.log("✅ Đã đăng nhập:", this.user);
          return true;
        } catch (error) {
          console.error("❌ Lỗi kiểm tra đăng nhập:", error.response?.data || error.message);
          this.isLoggedIn = false;
          this.user = null;
          this.token = null;
          localStorage.removeItem("token");
          return false;
        }
      }
      console.log("🚫 Không có token, đăng xuất...");
      this.isLoggedIn = false;
      this.user = null;
      this.token = null;
      localStorage.removeItem("token");
      return false;
    }
    
  },
});
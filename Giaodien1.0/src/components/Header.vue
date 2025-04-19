<template>
  <nav class="header">
    <div class="logo-container" @click="goHome">
      <img alt="logo web" class="logo" src="@/assets/logo.jpg" />
      <span class="site-title">Web Bán Bánh Kẹo</span>
    </div>

    <ul class="nav-links">
      <li><router-link to="/">Trang chủ</router-link></li>
      <li><router-link to="/products">Sản phẩm</router-link></li>
      <li v-if="!isLoggedIn"><router-link to="/login">Đăng nhập</router-link></li>
      <li v-if="isLoggedIn" class="user-info">
        <span>Xin chào, {{ currentUser }}</span>
        <button @click="logout" class="logout-btn">Đăng xuất</button>
      </li>
      <li><router-link to="/cart">Giỏ hàng</router-link></li>
      <li v-if="isAdmin"><router-link to="/admin">Quản trị</router-link></li>
    </ul>
  </nav>
</template>
<script setup>
import { computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "@/store/authStore";

const authStore = useAuthStore();
const router = useRouter();

const isLoggedIn = computed(() => authStore.isLoggedIn);
const currentUser = computed(() => authStore.user?.email || "");
const isAdmin = computed(() => authStore.user?.role === "admin");

onMounted(async () => {
  await authStore.checkAuth(); // Kiểm tra trạng thái đăng nhập khi load trang
});

const logout = async () => {
  await authStore.logoutUser();
  router.push("/");
};
</script>


<style>
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 50px;
  background: linear-gradient(135deg, #ff6b6b, #ff4757);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
  border-radius: 0 0 10px 10px;
}

.logo-container {
  display: flex;
  align-items: center;
  gap: 20px;
  cursor: pointer;
}

.logo {
  width: 110px;
  height: auto;
  border-radius: 10px;
}

.site-title {
  font-size: 30px;
  font-weight: bold;
  color: #fff;
  letter-spacing: 1.5px;
}

.nav-links {
  list-style: none;
  display: flex;
  align-items: center;
  gap: 35px;
}

.nav-links li {
  font-size: 20px;
}

.nav-links a {
  text-decoration: none;
  color: #fff;
  padding: 12px 20px;
  font-weight: 600;
  transition: 0.3s;
  border-radius: 8px;
}

.nav-links a:hover {
  background: rgba(255, 255, 255, 0.2);
}

.user-info {
  display: flex;
  align-items: center;
  gap: 15px;
  color: white;
  font-size: 18px;
  font-weight: 600;
}

.logout-btn {
  background: transparent;
  border: 1px solid white;
  color: white;
  font-size: 18px;
  font-weight: 600;
  cursor: pointer;
  padding: 10px 18px;
  transition: 0.3s;
  border-radius: 8px;
}

.logout-btn:hover {
  background: white;
  color: #ff4757;
}
</style>
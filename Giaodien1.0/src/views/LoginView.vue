<template>
  <div class="login-container">
    <h2>Đăng nhập</h2>
    <form @submit.prevent="login">
      <div class="input-group">
        <label>Email:</label>
        <input type="email" v-model="email" required placeholder="Nhập email của bạn" />
      </div>
      <div class="input-group">
        <label>Mật khẩu:</label>
        <div class="password-wrapper">
          <input :type="showPassword ? 'text' : 'password'" v-model="password" required placeholder="Nhập mật khẩu" />
          <span class="toggle-password" @click="showPassword = !showPassword">
          </span>
        </div>
      </div>
      <button type="submit">Đăng nhập</button>
    </form>
    <p>Chưa có tài khoản? <router-link to="/register">Đăng ký ngay</router-link></p>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "@/store/authStore";

const email = ref("");
const password = ref("");
const showPassword = ref(false);
const router = useRouter();
const authStore = useAuthStore(); // 💡 Sử dụng Pinia store

const login = async () => {
  try {
    await authStore.loginUser({ email: email.value, password: password.value });

    alert("Đăng nhập thành công!");
    
    // Chuyển hướng theo vai trò
    if (authStore.user.role === "admin") {
      router.push("/admin");
    } else {
      router.push("/");
    }
  } catch (error) {
    alert("Sai email hoặc mật khẩu!");
  }
};
</script>


<style>
.login-container {
  max-width: 400px;
  margin: 50px auto;
  padding: 25px;
  border-radius: 10px;
  background: #fff;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
  text-align: center;
}

h2 {
  color: #333;
  margin-bottom: 20px;
}

.input-group {
  margin-bottom: 15px;
  text-align: left;
}

.input-group label {
  display: block;
  font-weight: bold;
  margin-bottom: 5px;
}

.input-group input {
  width: 100%;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 8px;
  font-size: 16px;
}

.password-wrapper {
  position: relative;
}

.password-wrapper .toggle-password {
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
  cursor: pointer;
  font-size: 18px;
}

button {
  width: 100%;
  padding: 10px;
  background: linear-gradient(to right, #4CAF50, #2E7D32);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  cursor: pointer;
  transition: background 0.3s;
}

button:hover {
  background: linear-gradient(to right, #45A049, #256F31);
}

p {
  margin-top: 15px;
  font-size: 14px;
}

router-link {
  color: #007BFF;
  text-decoration: none;
}

router-link:hover {
  text-decoration: underline;
}
</style>
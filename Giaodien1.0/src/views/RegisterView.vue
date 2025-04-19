<template>
  <div class="register-container">
    <h2>Đăng ký</h2>
    <form @submit.prevent="register">
      <div class="input-group">
        <label>Email:</label>
        <input type="email" v-model="email" required placeholder="Nhập email của bạn" />
        <p v-if="emailError" class="error">{{ emailError }}</p>
      </div>
      <div class="input-group">
        <label>Mật khẩu:</label>
        <div class="password-wrapper">
          <input :type="showPassword ? 'text' : 'password'" v-model="password" required placeholder="Nhập mật khẩu" />         
        </div>
        <p v-if="passwordError" class="error">{{ passwordError }}</p>
      </div>
      <div class="input-group">
        <label>Xác nhận mật khẩu:</label>
        <div class="password-wrapper">
          <input :type="showConfirmPassword ? 'text' : 'password'" v-model="confirmPassword" required placeholder="Nhập lại mật khẩu" />
        </div>
        <p v-if="confirmPasswordError" class="error">{{ confirmPasswordError }}</p>
      </div>
      <button type="submit">Đăng ký</button>
    </form>
    <p>Đã có tài khoản? <router-link to="/login">Đăng nhập</router-link></p>
  </div>
</template>

<script>
export default {
  data() {
    return {
      email: "",
      password: "",
      confirmPassword: "",
      showPassword: false,
      showConfirmPassword: false,
      emailError: "",
      passwordError: "",
      confirmPasswordError: "",
    };
  },
  methods: {
    validateForm() {
      this.emailError = "";
      this.passwordError = "";
      this.confirmPasswordError = "";

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(this.email)) {
        this.emailError = "Email không hợp lệ!";
        return false;
      }

      if (this.password.length < 6) {
        this.passwordError = "Mật khẩu phải có ít nhất 6 ký tự!";
        return false;
      }

      if (this.password !== this.confirmPassword) {
        this.confirmPasswordError = "Mật khẩu xác nhận không khớp!";
        return false;
      }

      return true;
    },
    register() {
      if (!this.validateForm()) {
        return;
      }

      const users = JSON.parse(localStorage.getItem("users")) || [];

      if (users.some((user) => user.email === this.email)) {
        this.emailError = "Email đã được sử dụng!";
        return;
      }

      const newUser = { email: this.email, password: this.password, role: "user" };
      users.push(newUser);
      localStorage.setItem("users", JSON.stringify(users));

      alert("Đăng ký thành công!");
      this.$router.push("/login");
    },
  },
};
</script>

<style>
.register-container {
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
  background: linear-gradient(to right, #007bff, #0056b3);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  cursor: pointer;
  transition: background 0.3s;
}

button:hover {
  background: linear-gradient(to right, #0069d9, #004494);
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

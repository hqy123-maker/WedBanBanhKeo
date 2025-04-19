<template>
  <footer class="footer">
    <div class="footer-container">
      <div class="footer-info">
        <p>&copy; 2025 Cửa hàng bánh kẹo | Mọi quyền được bảo lưu</p>
      </div>
      <nav class="footer-nav">
        <div class="footer-section">
          <span class="footer-title">Giới thiệu về cửa hàng</span>
          <p>Cửa hàng bánh kẹo chuyên cung cấp các loại bánh ngọt, kẹo nhập khẩu chất lượng cao, đảm bảo an toàn thực phẩm.</p>
        </div>
        <div class="footer-section">
          <span class="footer-title">Liên hệ hỗ trợ</span>
          <p>Hotline: 0123 456 789</p>
          <p>Email: support@cuahangbanhkeo.com</p>
        </div>
        <div class="footer-section">
          <span class="footer-title">Chính sách bảo mật</span>
          <p>Chúng tôi cam kết bảo vệ thông tin cá nhân của khách hàng và không chia sẻ với bên thứ ba.</p>
        </div>
      </nav>
      <div class="footer-social">
        <span class="social-icon"><i class="fab fa-facebook"></i></span>
        <span class="social-icon"><i class="fab fa-instagram"></i></span>
        <span class="social-icon"><i class="fab fa-twitter"></i></span>
      </div>
    </div>
  </footer>
</template>

<style scoped>
.footer {
  background: linear-gradient(135deg, #ff9a9e, #fad0c4);
  color: black;
  padding: 20px 0;
  text-align: center;
  width: 100%;
}

.footer-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
}

.footer-info p {
  margin: 5px 0;
  font-size: 14px;
  font-weight: 500;
}

.footer-nav {
  display: flex;
  gap: 30px;
  margin-top: 10px;
  flex-wrap: wrap;
  justify-content: center;
}

.footer-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  max-width: 250px;
}

.footer-title {
  font-weight: bold;
  font-size: 16px;
  margin-bottom: 5px;
}

.footer-section p {
  font-size: 14px;
  text-align: center;
  margin: 5px 0;
}

.footer-social {
  display: flex;
  gap: 15px;
  margin-top: 10px;
}

.social-icon {
  color: black;
  font-size: 20px;
  transition: 0.3s;
}

.social-icon:hover {
  color: #ff6b81;
}
</style>

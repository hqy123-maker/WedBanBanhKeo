<template>
  <div class="home-container">
    

   <!-- KHUYẾN MÃI SỐC -->
<section class="promotion">
  <h2 class="section-title">🔥 KHUYẾN MÃI SỐC 🔥</h2>
  <div class="countdown-timer">⏳ Còn lại: {{ countdownTime }}</div>
  <div class="product-list">
    <ProductCard v-for="product in hotDeals" :key="product.id" :product="product" />
  </div>
</section>

    <!-- HÀNG MỚI VỀ -->
    <section class="new-arrivals">
      <h2 class="section-title">✨ HÀNG MỚI VỀ ✨</h2>
      <div class="new-products">
        <ProductCard v-for="product in newProducts" :key="product.id" :product="product" />
      </div>
    </section>
  </div>
</template>

<script>
import ProductCard from '../components/ProductCard.vue';

export default {
  components: { ProductCard },
  data() {
    return {
      banners: [
        { image: '/src/assets/images/banner1.jpg', alt: 'Giảm giá sốc' },
        { image: '/src/assets/images/banner2.jpg', alt: 'Mua 2 tặng 1' }
      ],
      currentSlide: 0,
      hotDeals: [
        { id: 1, name: 'bánh quy danisa', price: 35000, discount: 16, image_url: 'https://banhtrungthu.org/wp-content/uploads/2023/11/banh-quy-bo-danisa-hop-thiec-908g-1.jpg' },
        { id: 2, name: 'kẹo chip chip hải hà ', price: 34350, discount: 25, image_url: 'https://gtmart.com.vn/uploads/product/keo-chip-hai-ha-100g.jpg' },
        { id: 3, name: 'Socola đen Enjoy Chocolate 70% (Ej Farm)', price: 145000, discount: 10, image_url: 'https://product.hstatic.net/200000361859/product/z4885692003680_46d7987c2cffbedd5ce7dec7a86bcf65_67ea65b6ee974006a7f7f50715b5cbe5_master.jpg' },
      ],
      newProducts: [
        { id: 6, name: 'bánh oreo', price: 413000, discount: '25%', image_url: 'https://product.hstatic.net/200000073345/product/banh_cadbury_oreo_socola-pie_360g_5bca686e3613436d8f966e9c071c4004_1024x1024.jpg' },
        { id: 7, name: 'bánh macaron', price: 481000, discount: '4%', image_url: 'https://cdn.tgdd.vn/2021/05/CookProduct/thumbto-1200x676-1.jpg' },
        { id: 8, name: 'RAMUNE', price: 75000, discount: '18%', image_url: 'https://file.hstatic.net/1000261221/article/xkld_nhatban_dunggiangnozomi__2__0aa15f22022d45fe97915f278e378f5f.png' },
       
      ],
      countdownTime: '', // Biến lưu thời gian còn lại
      countdownInterval: null
    };
  },
  methods: {
    updateCountdown() {
      const now = new Date();
      const nextEvent = new Date();
      nextEvent.setHours(24, 0, 0, 0); // Reset vào 00:00 mỗi ngày

      let remainingTime = nextEvent - now;
      if (remainingTime <= 0) {
        nextEvent.setDate(nextEvent.getDate() + 1);
        remainingTime = nextEvent - now;
      }

      const hours = Math.floor(remainingTime / (1000 * 60 * 60));
      const minutes = Math.floor((remainingTime % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((remainingTime % (1000 * 60)) / 1000);

      this.countdownTime = `${hours}h ${minutes}m ${seconds}s`;
    }
  },
  mounted() {
    // Chuyển đổi banner tự động
    setInterval(() => {
      this.currentSlide = (this.currentSlide + 1) % this.banners.length;
    }, 3000);

    // Cập nhật đếm ngược mỗi giây
    this.updateCountdown();
    this.countdownInterval = setInterval(this.updateCountdown, 1000);
  },
  beforeDestroy() {
    clearInterval(this.countdownInterval);
  }
};
</script>

<style scoped>
.home-container {
  padding: 20px;
  font-family: 'Poppins', sans-serif;
  background: #f8f8f8;
}

/* Banner quảng cáo */
.banner-slider {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  overflow: hidden;
  position: relative;
  border-radius: 12px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
}

.slide {
  transition: transform 0.5s ease-in-out;
}

.slide img {
  width: 100%;
  border-radius: 12px;
  object-fit: cover;
}

.dots {
  text-align: center;
  margin-top: 10px;
}

.dot {
  width: 12px;
  height: 12px;
  margin: 5px;
  background-color: #ccc;
  border-radius: 50%;
  cursor: pointer;
  transition: background 0.3s ease;
}

.dot.active {
  background-color: #ff6f00;
}

/* Tiêu đề danh mục */
.section-title {
  font-size: 26px;
  color: #e53935;
  text-align: center;
  margin: 30px 0 15px;
  font-weight: bold;
  text-transform: uppercase;
  letter-spacing: 1.2px;
  position: relative;
}

.section-title::after {
  content: '';
  width: 80px;
  height: 4px;
  background: #ff6f00;
  display: block;
  margin: 8px auto 0;
  border-radius: 2px;
}

/* Danh mục sản phẩm */
.product-list, .new-products {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); /* Tự động căn chỉnh sản phẩm */
  gap: 20px;
  padding: 20px;
  justify-content: center;
}

/* Card sản phẩm */
.product-card {
  background: #fff;
  padding: 15px;
  border-radius: 12px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.08);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.product-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 6px 15px rgba(0, 0, 0, 0.15);
}

/* TÁCH RÕ PHẦN KHUYẾN MÃI & HÀNG MỚI VỀ */
.promotion, .new-arrivals {
  padding: 20px;
  border-radius: 12px;
  margin: 20px auto; /* Thêm khoảng cách giữa hai phần */
  max-width: 95%; /* Giữ bố cục đẹp trên mọi màn hình */
}
/* Khuyến mãi sốc - Chỉnh lại màu sắc */
.promotion {
  background: #ffefd5; /* Cam nhạt hơn để chữ nổi bật */
  padding: 20px;
  border-radius: 12px;
  text-align: center;
  border: 2px solid #ff6f00; /* Viền cam đậm hơn để nổi bật */
}

.promotion .section-title {
  color: #d32f2f; /* Đỏ đậm để dễ nhìn hơn */
}

.countdown-timer {
  font-size: 20px;
  font-weight: bold;
  margin: 10px 0;
  color: #e53935; /* Màu đỏ tươi hơn cho đồng hồ đếm ngược */
}

/* HÀNG MỚI VỀ - Chỉnh lại màu sắc */
.new-arrivals {
  background: #e3f2fd; /* Xanh nhạt tạo cảm giác tươi mới */
  padding: 20px;
  border-radius: 12px;
  text-align: center;
  border: 2px solid #1e88e5; /* Viền xanh dương nổi bật */
}

.new-arrivals .section-title {
  color: #1565c0; /* Xanh dương đậm hơn để dễ đọc */
}

.new-products {
  display: grid;
  grid-template-columns: repeat(5, 1fr); /* 5 sản phẩm mỗi hàng */
  gap: 20px;
  padding: 10px;
}

</style>

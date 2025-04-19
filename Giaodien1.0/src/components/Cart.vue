<template>
  <div class="cart-container">
    <h2>Giỏ hàng</h2>
    
    <table v-if="cart.length">
      <thead>
        <tr>
          <th>Sản phẩm</th>
          <th>Giá</th>
          <th>Số lượng</th>
          <th>Tổng</th>
          <th>Hành động</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(item, index) in cart" :key="index">
          <td>{{ item.name }}</td>
          <td>{{ formatPrice(item.price) }}</td>
          <td>{{ item.quantity }}</td>
          <td>{{ formatPrice(item.price * item.quantity) }}</td>
          <td>
            <button @click="removeFromCart(item)">-</button>
            <button @click="addToCart(item)">+</button>
          </td>
        </tr>
      </tbody>
    </table>

    <p v-else>Giỏ hàng trống</p>

    <div class="cart-summary" v-if="cart.length">
      <p><strong>Tổng tiền:</strong> {{ formatPrice(totalPrice) }}</p>
      <button class="checkout-btn" @click="checkout">Thanh toán</button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import axios from "axios";

const cart = ref([]);
const isAuthenticated = ref(false);

// Hàm định dạng tiền tệ
const formatPrice = (price) => new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(price);

// Lấy giỏ hàng từ API
const fetchCart = async () => {
  try {
    const response = await axios.get("/api/cart", { withCredentials: true });
    cart.value = response.data.cart;
    isAuthenticated.value = true;  // Đánh dấu là đã đăng nhập
  } catch (error) {
    console.error("Lỗi khi lấy giỏ hàng:", error);
    isAuthenticated.value = false; // Nếu lỗi, có thể do chưa đăng nhập
  }
};

// Tính tổng tiền
const totalPrice = computed(() => cart.value.reduce((sum, item) => sum + item.price * item.quantity, 0));

// Thêm sản phẩm vào giỏ hàng
const addToCart = async (item) => {
  try {
    await axios.post("/api/cart/add", { productId: item.id, quantity: 1 }, { withCredentials: true });
    fetchCart();
  } catch (error) {
    console.error("Lỗi khi thêm vào giỏ hàng:", error);
    alert("Bạn cần đăng nhập để thêm vào giỏ hàng!");
  }
};

// Xóa sản phẩm khỏi giỏ hàng
const removeFromCart = async (item) => {
  try {
    await axios.post("/api/cart/remove", { productId: item.id }, { withCredentials: true });
    fetchCart();
  } catch (error) {
    console.error("Lỗi khi xóa sản phẩm:", error);
  }
};

// Thanh toán giỏ hàng
const checkout = async () => {
  if (!isAuthenticated.value) {
    alert("Bạn cần đăng nhập để thanh toán!");
    return;
  }

  try {
    await axios.post("/api/checkout", {}, { withCredentials: true });
    alert("Thanh toán thành công! Cảm ơn bạn đã mua hàng.");
    fetchCart(); // Xóa giỏ hàng sau khi thanh toán
  } catch (error) {
    console.error("Lỗi khi thanh toán:", error);
    alert("Thanh toán thất bại! Vui lòng thử lại.");
  }
};

// Gọi API khi component được tải
onMounted(fetchCart);
</script>

<style>
.cart-container {
  max-width: 800px;
  margin: 50px auto;
  padding: 20px;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
}

table {
  width: 100%;
  border-collapse: collapse;
}

th, td {
  padding: 10px;
  text-align: center;
  border-bottom: 1px solid #ddd;
}

button {
  padding: 5px 10px;
  margin: 5px;
  cursor: pointer;
  border-radius: 5px;
  border: none;
}

button:hover {
  opacity: 0.8;
}

.checkout-btn {
  width: 100%;
  padding: 10px;
  background: #28a745;
  color: white;
  font-size: 16px;
  margin-top: 10px;
}
</style>

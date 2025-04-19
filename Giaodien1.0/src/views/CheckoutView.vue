<template>
  <div class="checkout-container">
    <h2 v-if="!orderDetails">Thanh toán</h2>
    <h2 v-else>Hóa đơn</h2>

    <div v-if="error" class="error-state">
      <p class="error-message">{{ error }}</p>
    </div>

    <div v-if="isLoading" class="loading-state">
      <p>Đang tải thông tin giỏ hàng...</p>
    </div>

    <!-- Hiển thị hóa đơn sau khi thanh toán thành công -->
    <div v-if="orderDetails">
      <div class="invoice">
        <h3>Mã đơn hàng: {{ orderDetails.orderId }}</h3>
        <p>Phương thức thanh toán: {{ formatPaymentMethod(orderDetails.paymentMethod) }}</p>
        <div class="invoice-items">
          <div class="checkout-item" v-for="item in orderDetails.items" :key="item.product_id">
            <img :src="item.image_url" :alt="item.name" class="item-image" />
            <div class="item-info">
              <h3>{{ item.name }}</h3>
              <p class="price">Giá: {{ formatPrice(item.price) }} VND</p>
              <p class="quantity">Số lượng: {{ item.quantity }}</p>
              <p class="total-price">Tổng: {{ formatPrice(item.price * item.quantity) }} VND</p>
            </div>
          </div>
        </div>
        <h3>Tổng cộng: {{ formatPrice(orderDetails.totalPrice) }} VND</h3>
        <button @click="goHome" class="back-btn">Về trang chủ</button>
      </div>
    </div>

    <!-- Form thanh toán nếu chưa thanh toán -->
    <div v-else>
      <div v-if="!cart.length" class="empty-cart-message">
        <p>Giỏ hàng của bạn đang trống.</p>
      </div>

      <div v-else>
        <div class="checkout-item" v-for="item in cart" :key="item.product_id">
          <img :src="item.image_url" :alt="item.name" class="item-image" />
          <div class="item-info">
            <h3>{{ item.name }}</h3>
            <p class="price">Giá: {{ formatPrice(item.price) }} VND</p>
            <p class="quantity">Số lượng: {{ item.quantity }}</p>
            <p class="total-price">Tổng: {{ formatPrice(item.total_price) }} VND</p>
          </div>
        </div>

        <div class="checkout-summary">
          <h3>Tổng cộng: {{ formatPrice(totalAmount) }} VND</h3>
          <div class="payment-method">
            <label for="payment-method">Phương thức thanh toán:</label>
            <select id="payment-method" v-model="selectedPaymentMethod" class="payment-select">
              <option value="cod">Thanh toán khi nhận hàng (COD)</option>
              <option value="credit_card">Thẻ tín dụng</option>
              <option value="paypal">Paypal</option>
              <option value="bank_transfer">Chuyển khoản ngân hàng</option>
            </select>
          </div>
          <button @click="processCheckout" class="checkout-btn" :disabled="isProcessing || !cart.length || !selectedPaymentMethod">
            Xác nhận thanh toán
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "@/store/authStore";
import axios from "axios";

export default {
  setup() {
    const router = useRouter();
    const authStore = useAuthStore();
    const cart = ref([]);
    const error = ref(null);
    const isLoading = ref(true);
    const isProcessing = ref(false);
    const selectedPaymentMethod = ref("");
    const orderDetails = ref(null); // Lưu thông tin hóa đơn sau khi thanh toán

    const fetchCart = async () => {
      try {
        isLoading.value = true;
        error.value = null;

        if (!authStore.token) {
          throw new Error("Vui lòng đăng nhập để xem giỏ hàng");
        }

        const response = await axios.get("http://localhost:5000/api/cart", {
          headers: {
            Authorization: `Bearer ${authStore.token}`,
          },
          withCredentials: true,
        });

        cart.value = Array.isArray(response.data.cart) ? response.data.cart : [];
      } catch (err) {
        error.value = err.response?.data?.message || err.message;
        cart.value = [];
        if (err.response?.status === 401) {
          router.push("/login");
        }
      } finally {
        isLoading.value = false;
      }
    };

    const formatPrice = (price) => {
      const priceNumber = Number.parseFloat(price);
      return isNaN(priceNumber) ? "0" : priceNumber.toLocaleString("vi-VN");
    };

    const formatPaymentMethod = (method) => {
      const methods = {
        cod: "Thanh toán khi nhận hàng (COD)",
        credit_card: "Thẻ tín dụng",
        paypal: "Paypal",
        bank_transfer: "Chuyển khoản ngân hàng",
      };
      return methods[method] || "Không xác định";
    };

    const totalAmount = computed(() => {
      return cart.value.reduce((total, item) => {
        return total + (Number(item.price) || 0) * (Number(item.quantity) || 1);
      }, 0);
    });

    const processCheckout = async () => {
      try {
        isProcessing.value = true;

        await fetchCart();
        if (!cart.value.length) {
          alert("Giỏ hàng của bạn đang trống hoặc đã thay đổi.");
          return;
        }

        if (!selectedPaymentMethod.value) {
          alert("Vui lòng chọn phương thức thanh toán.");
          return;
        }

        const orderItems = cart.value.map(item => ({
          product_id: item.product_id,
          quantity: Number(item.quantity),
          price: Number.parseFloat(item.price),
          image_url: item.image_url,
          name: item.name,
        }));

        if (!orderItems.length) {
          alert("Dữ liệu giỏ hàng không hợp lệ. Vui lòng kiểm tra lại.");
          return;
        }

        const response = await axios.post("http://localhost:5000/api/orders", {
          items: orderItems,
          total_price: totalAmount.value,
          payment_method: selectedPaymentMethod.value,
        }, {
          headers: {
            Authorization: `Bearer ${authStore.token}`,
            "Content-Type": "application/json",
          },
          withCredentials: true,
        });

        orderDetails.value = {
          orderId: response.data.orderId,
          items: orderItems,
          totalPrice: totalAmount.value,
          paymentMethod: selectedPaymentMethod.value,
        };

        cart.value = [];
      } catch (err) {
        error.value = err.response?.data?.message || "Đã xảy ra lỗi khi thanh toán.";
      } finally {
        isProcessing.value = false;
      }
    };

    const goHome = () => {
      router.push("/");
    };

    onMounted(() => {
      if (!authStore.token) {
        router.push("/login");
      } else {
        fetchCart();
      }
    });

    return {
      cart, error, isLoading, isProcessing, selectedPaymentMethod,
      orderDetails, formatPrice, formatPaymentMethod, totalAmount, processCheckout, goHome
    };
  },
};
</script>

<style scoped>
.checkout-container {
  max-width: 800px;
  margin: 40px auto;
  padding: 20px;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0px 4px 15px rgba(0, 0, 0, 0.1);
}

.checkout-item {
  display: flex;
  align-items: center;
  gap: 20px;
  padding: 15px;
  border: 1px solid #ddd;
  border-radius: 10px;
  margin-bottom: 15px;
  background: #fafafa;
  transition: background 0.3s ease, transform 0.3s ease;
}

.checkout-item:hover {
  background: #f0f0f0;
  transform: scale(1.02);
}

.item-image {
  width: 70px;
  height: 70px;
  object-fit: cover;
  border-radius: 8px;
}

.checkout-summary {
  margin-top: 20px;
  padding-top: 20px;
  border-top: 1px solid #ddd;
  text-align: right;
}

.payment-method {
  margin: 20px 0;
  text-align: left;
}

.payment-method label {
  font-weight: bold;
  margin-right: 10px;
  font-size: 16px;
}

.payment-select {
  padding: 10px;
  font-size: 16px;
  border-radius: 8px;
  border: 1px solid #ddd;
  width: 100%;
  max-width: 300px;
  background: #fff;
  cursor: pointer;
}

.checkout-btn {
  width: 100%;
  padding: 12px;
  background: linear-gradient(135deg, #4caf50, #45a049);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 18px;
  cursor: pointer;
  transition: background 0.3s, transform 0.3s ease;
}

.checkout-btn:hover:not(:disabled) {
  background: linear-gradient(135deg, #45a049, #388e3c);
  transform: scale(1.05);
}

.checkout-btn:disabled {
  background: #cccccc;
  cursor: not-allowed;
}

.error-state {
  padding: 10px;
  background-color: #f8d7da;
  color: #721c24;
  border-radius: 8px;
  margin-bottom: 20px;
}

.loading-state {
  text-align: center;
  padding: 20px;
  background-color: #e9ecef;
  border-radius: 8px;
}

.empty-cart-message {
  text-align: center;
  font-size: 18px;
  color: #555;
  margin-top: 20px;
}

.error-message {
  font-size: 16px;
  color: #721c24;
}
</style>
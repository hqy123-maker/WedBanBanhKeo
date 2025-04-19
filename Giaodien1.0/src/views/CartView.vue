<template>
  <div class="cart-container">
    <h2>Giỏ hàng của bạn</h2>

    <!-- Hiển thị trạng thái loading -->
    <div v-if="isLoading" class="loading-state">
      <p>Đang tải giỏ hàng...</p>
    </div>

    <!-- Hiển thị lỗi nếu có -->
    <div v-else-if="error" class="error-state">
      <p class="error-message">{{ error }}</p>
      <button @click="fetchCart" class="retry-btn">Thử lại</button>
    </div>

    <!-- Giỏ hàng trống - CHỈ HIỂN THỊ NÚT MUA SẮM -->
    <div v-else-if="cart.length === 0" class="empty-cart">
      <router-link to="/products" class="shop-now-btn">
        Mua sắm ngay
      </router-link>
    </div>

    <!-- Hiển thị giỏ hàng khi có sản phẩm -->
    <div v-else>
      <div class="cart-item" v-for="item in cart" :key="item.id">
        <img :src="item.image_url" 
              :alt="item.name" 
              class="item-image" 
              @error="handleImageError" />
        <div class="item-info">
          <h3>{{ item.name }}</h3>
          <p class="price">Giá: {{ formatPrice(item.price) }} VND</p>
          <div class="quantity-controls">
            <button @click="decreaseQuantity(item)" 
                    class="quantity-btn"
                    :disabled="isProcessing">
              -
            </button>
            <span class="quantity">{{ item.quantity }}</span>
            <button @click="increaseQuantity(item)" 
                    class="quantity-btn"
                    :disabled="isProcessing">
              +
            </button>
          </div>
          <button @click="removeItem(item.product_id)" class="remove-btn" :disabled="isProcessing">
  Xóa
</button>

        </div>
      </div>

      <div class="cart-summary">
        <h3>Tổng tiền: {{ formatPrice(totalAmount) }} VND</h3>
      <button @click="goToCheckout" 
              class="checkout-btn"
              :disabled="isProcessing || cart.length === 0">
        Thanh toán
      </button>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import { ref, computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "@/store/authStore";

export default {
  setup() {
    const router = useRouter();
    const authStore = useAuthStore();
    const cart = ref([]);
    const isLoading = ref(true);
    const isProcessing = ref(false);
    const error = ref(null);
    
    // Định dạng giá tiền
    const formatPrice = (price) => {
      const priceNumber = Number(price);
      return isNaN(priceNumber) ? '0' : priceNumber.toLocaleString('vi-VN');
    };

    // Xử lý lỗi ảnh
    const handleImageError = (event) => {
      event.target.src = '/placeholder-product.jpg';
    };

    const goToCheckout = () => {
      if (!authStore.token) {
        alert("Bạn cần đăng nhập để thanh toán.");
        router.push("/login");
      } else {
        router.push("/checkout");
      }
    };

    // Lấy giỏ hàng từ API
    const fetchCart = async () => {
      try {
        isLoading.value = true;
        error.value = null;
        
        if (!authStore.token) {
          throw new Error('Vui lòng đăng nhập để xem giỏ hàng');
        }

        const response = await axios.get("http://localhost:5000/api/cart", {
          headers: {
            Authorization: `Bearer ${authStore.token}`,
          },
          withCredentials: true,
        });

        console.log("Dữ liệu API trả về:", response.data); // Kiểm tra console log

        // Lấy dữ liệu từ `cart`, kiểm tra dữ liệu hợp lệ trước khi gán vào biến
        cart.value = Array.isArray(response.data.cart) 
          ? response.data.cart.filter(item => item.product_id && item.name && item.price) 
          : [];
          
      } catch (err) {
        console.error("Lỗi khi lấy giỏ hàng:", err);
        error.value = err.response?.data?.message || err.message;
        cart.value = [];
        
        if (err.response?.status === 401) {
          router.push("/login");
        }
      } finally {
        isLoading.value = false;
      }
    };

    const increaseQuantity = async (item) => {
      if (item && item.product_id) {
        item.quantity += 1; // Tăng số lượng
        await updateCart(item);
      }
    };

    const decreaseQuantity = async (item) => {
      if (item && item.product_id && item.quantity > 1) {
        item.quantity -= 1; // Giảm số lượng
        await updateCart(item);
      } else if (item && item.product_id && item.quantity === 1) {
        await removeItem(item.product_id); // Nếu số lượng = 1, xóa sản phẩm
      }
    };

    // Cập nhật giỏ hàng
    const updateCart = async (item) => {
  try {
    if (item.quantity <= 0 || isNaN(item.quantity)) {
      throw new Error("Số lượng phải là một số dương hợp lệ.");
    }
    const totalPrice = item.quantity * parseFloat(item.price);
    const payload = {
      product_id: item.product_id, // Đảm bảo có product_id
      quantity: item.quantity,
      total_price: totalPrice.toFixed(2), // Sử dụng số sau khi tính lại tổng giá trị
    };

    console.log("Dữ liệu gửi lên API: ", payload);

    const response = await axios.patch(
      `http://localhost:5000/api/cart/${item.product_id}`,
      payload,
      {
        headers: {
          Authorization: `Bearer ${authStore.token}`,
          "Content-Type": "application/json",
        },
        withCredentials: true,
      }
    );

    console.log("Cập nhật giỏ hàng thành công:", response.data);
  } catch (err) {
    console.error("Lỗi khi cập nhật giỏ hàng:", err);
    console.error("Chi tiết lỗi từ server:", err.response?.data);
    error.value = err.response?.data?.message || err.message;
    await fetchCart();
  }
};



    // Xóa sản phẩm khỏi giỏ hàng
    const removeItem = async (product_id) => {
  console.log("product_id nhận được:", product_id); // Kiểm tra giá trị product_id
  if (!product_id || isNaN(Number(product_id))) {
    console.error("ID sản phẩm không hợp lệ:", product_id);
    alert("ID sản phẩm không hợp lệ.");
    return;
  }
  if (!cart.value || cart.value.length === 0) {
    console.log("Giỏ hàng trống, không có sản phẩm để xóa.");
    alert("Giỏ hàng của bạn hiện tại không có sản phẩm.");
    return;
  }
  const itemToRemove = cart.value.find(item => item.product_id === product_id);
  if (!itemToRemove) {
    console.error("Không tìm thấy sản phẩm với ID:", product_id);
    alert("Không tìm thấy sản phẩm trong giỏ hàng.");
    return;
  }

  try {
    const response = await axios.delete(`http://localhost:5000/api/cart/${product_id}`, {
      headers: {
        Authorization: `Bearer ${authStore.token}`,
      },
      withCredentials: true,
    });

    console.log("Xóa sản phẩm thành công:", response.data);
    cart.value = cart.value.filter(item => item.product_id !== product_id);
    alert("Sản phẩm đã được xóa khỏi giỏ hàng.");
  } catch (err) {
    console.error("Lỗi khi xóa sản phẩm:", err);
    alert("Có lỗi xảy ra khi xóa sản phẩm. Vui lòng thử lại.");
  }
};



    // Thanh toán
    const checkout = async () => {
  try {
    if (!authStore.token) {
      throw new Error("Bạn cần đăng nhập để thanh toán.");
    }

    // Kiểm tra giỏ hàng trống
    if (!cart.value || !cart.value.length) {
      console.log("Giỏ hàng của bạn đang trống.");
      throw new Error("Giỏ hàng của bạn đang trống.");
    }

    // Kiểm tra lại nội dung giỏ hàng trước khi gửi
    console.log("Giỏ hàng trước khi thanh toán:", JSON.parse(JSON.stringify(cart.value)));

    // Chuyển Proxy thành mảng thuần túy
    const plainCart = JSON.parse(JSON.stringify(cart.value));

    // Kiểm tra và chuyển đổi price và total_price thành số
    const orderData = plainCart.map(item => ({
      product_id: item.product_id,
      quantity: item.quantity,
      price: parseFloat(item.price),
      total_price: parseFloat(item.total_price),
    }));

    // Kiểm tra lại dữ liệu gửi lên API
    console.log("Dữ liệu gửi lên API:", JSON.stringify(orderData, null, 2));

    const response = await axios.post("http://localhost:5000/api/orders", orderData, {
      headers: {
        Authorization: `Bearer ${authStore.token}`,
        "Content-Type": "application/json",
      },
      withCredentials: true,
    });

    console.log("Đơn hàng đã được tạo:", response.data);
    cart.value = []; // Xóa giỏ hàng sau khi thanh toán thành công
    router.push("/thank-you"); // Chuyển hướng đến trang cảm ơn

  } catch (err) {
    console.error("Lỗi khi thanh toán:", err);

    // Thêm log lỗi chi tiết từ server
    if (err.response) {
      console.log("Chi tiết lỗi từ server:", err.response.data);
      error.value = err.response?.data?.message || err.message;
    } else {
      error.value = "Không thể kết nối đến máy chủ, vui lòng thử lại sau.";
    }
  }
};


    // Khi component được mounted
    onMounted(() => {
      if (!authStore.token) {
        router.push("/login");
      } else {
        fetchCart();
      }
    });

    return {
      cart,
      isLoading,
      isProcessing,
      error,
      increaseQuantity,
      decreaseQuantity,
      removeItem,
      checkout,
      formatPrice,
      goToCheckout,
      handleImageError,
      totalAmount: computed(() => cart.value.reduce((total, item) => {
        const price = Number(item.price) || 0;
        const quantity = Number(item.quantity) || 1;
        return total + (price * quantity);
      }, 0)),
    };
  },
};
</script>

<style scoped>
.cart-container {
  max-width: 800px;
  margin: 40px auto;
  padding: 20px;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0px 4px 15px rgba(0, 0, 0, 0.1);
}

h2 {
  font-size: 28px;
  margin-bottom: 20px;
  color: #333;
  text-align: center;
}

.loading-state {
  text-align: center;
  padding: 40px;
  color: #666;
}

.error-state {
  text-align: center;
  padding: 20px;
  background: #ffeeee;
  border-radius: 8px;
  margin-bottom: 20px;
}

.error-message {
  color: #d32f2f;
  margin-bottom: 15px;
}

.retry-btn {
  padding: 8px 16px;
  background: #f44336;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.empty-cart {
  text-align: center;
  padding: 40px;
}

.empty-cart p {
  font-size: 18px;
  color: #666;
  margin-bottom: 20px;
}

.btn {
  display: inline-block;
  padding: 10px 20px;
  background: linear-gradient(135deg, #ff4081, #e91e63);
  color: white;
  border-radius: 8px;
  text-decoration: none;
  font-size: 16px;
  transition: background 0.3s;
}

.btn:hover {
  background: linear-gradient(135deg, #e91e63, #d81b60);
}

.cart-item {
  display: flex;
  align-items: center;
  gap: 20px;
  padding: 15px;
  border: 1px solid #ddd;
  border-radius: 10px;
  margin-bottom: 15px;
  background: #fafafa;
  transition: transform 0.3s, box-shadow 0.3s;
}

.cart-item:hover {
  transform: translateY(-5px);
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
}

.item-image {
  width: 100px;
  height: 100px;
  object-fit: cover;
  border-radius: 10px;
}

.item-info {
  flex-grow: 1;
}

.item-info h3 {
  font-size: 20px;
  margin-bottom: 10px;
  color: #333;
}

.price {
  font-size: 18px;
  color: #e91e63;
  margin-bottom: 10px;
}

.quantity-controls {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 10px;
}

.quantity-btn {
  width: 30px;
  height: 30px;
  border: none;
  background: #ff9800;
  color: white;
  font-size: 18px;
  border-radius: 50%;
  cursor: pointer;
  transition: background 0.3s;
}

.quantity-btn:hover:not(:disabled) {
  background: #f57c00;
}

.quantity-btn:disabled {
  background: #cccccc;
  cursor: not-allowed;
}

.quantity {
  font-size: 18px;
  font-weight: bold;
  min-width: 20px;
  text-align: center;
}

.remove-btn {
  background: #f44336;
  color: white;
  padding: 8px 12px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 14px;
  transition: background 0.3s;
}

.remove-btn:hover:not(:disabled) {
  background: #d32f2f;
}

.remove-btn:disabled {
  background: #cccccc;
  cursor: not-allowed;
}

.cart-summary {
  margin-top: 20px;
  padding-top: 20px;
  border-top: 1px solid #ddd;
  text-align: right;
}

.cart-summary h3 {
  font-size: 24px;
  color: #333;
  margin-bottom: 20px;
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
  transition: background 0.3s;
}

.checkout-btn:hover:not(:disabled) {
  background: linear-gradient(135deg, #45a049, #388e3c);
}

.checkout-btn:disabled {
  background: #cccccc;
  cursor: not-allowed;
}
.empty-cart {
  text-align: center;
  padding: 20px;
}

.shop-now-btn {
  display: inline-block;
  padding: 12px 24px;
  background: #4CAF50;
  color: white;
  border-radius: 4px;
  text-decoration: none;
  font-size: 16px;
  transition: all 0.3s;
  border: none;
  cursor: pointer;
}

.shop-now-btn:hover {
  background: #45a049;
  transform: translateY(-2px);
  box-shadow: 0 2px 5px rgba(0,0,0,0.2);
}
</style>
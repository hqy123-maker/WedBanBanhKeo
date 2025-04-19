<template>
  <div class="product-card" @click="viewDetails" @mouseover="showDetails = true" @mouseleave="showDetails = false">
    <img :src="product.image_url || 'https://via.placeholder.com/150'" :alt="product.name" class="product-image" />
    <div class="product-info">
      <h3 class="product-name">{{ product.name }}</h3>
      <p class="product-price">{{ product.price.toLocaleString() }} VND</p>
      <button @click.stop="addToCart" class="add-to-cart-btn">Thêm vào giỏ</button>
    </div>
    <div v-if="showDetails" class="product-details">
      <p><strong>Mô tả:</strong> {{ product.description || "Không có mô tả" }}</p>
      <p><strong>Loại:</strong> {{ product.category || "Không xác định" }}</p>
      <p><strong>Xuất xứ:</strong> {{ product.origin || "Không xác định" }}</p>
    </div>
  </div>
</template>

<script>

import { ref } from "vue";
import { useRouter } from "vue-router";
import axios from "axios";
import { useAuthStore } from "../store/authStore";

export default {
  props: ["product"],
  setup(props) {
    const router = useRouter();
    const showDetails = ref(false);
    const authStore = useAuthStore();

    const viewDetails = () => {
      router.push(`/product/${props.product.id}`);
    };

    const addToCart = async () => {
  if (!authStore.isLoggedIn) {
    if (window.confirm("Bạn cần đăng nhập để thêm vào giỏ hàng. Nhấn OK để đăng nhập.")) {
      router.push("/login");
    }
    return;
  }

  if (!authStore.token) {
    alert("Phiên đăng nhập không hợp lệ. Vui lòng đăng nhập lại!");
    router.push("/login");
    return;
  }

  try {
    // Kiểm tra thông tin sản phẩm và giỏ hàng hiện tại
    const response = await axios.get("http://localhost:5000/api/cart", {
      headers: {
        Authorization: `Bearer ${authStore.token}`,
        'Content-Type': 'application/json'
      }
    });

    const existingProduct = response.data.cart.find(item => item.product_id === props.product.id);

    if (existingProduct) {
      // Cập nhật số lượng sản phẩm đã có trong giỏ
      console.log("Cập nhật sản phẩm trong giỏ hàng:", existingProduct.product_id);

      const updateResponse = await axios.patch(
        `http://localhost:5000/api/cart/${existingProduct.product_id}`,
        {
          product_id: existingProduct.product_id, // Truyền đúng product_id
          quantity: existingProduct.quantity + 1 // Cập nhật số lượng
        },
        {
          headers: {
            Authorization: `Bearer ${authStore.token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      alert(`Đã tăng số lượng của ${props.product.name} trong giỏ hàng!`);
    } else {
      // Nếu sản phẩm chưa có trong giỏ, thêm mới vào giỏ hàng
      const addResponse = await axios.post(
        "http://localhost:5000/api/cart",
        {
          product_id: props.product.id, // Đảm bảo truyền đúng product_id
          quantity: 1 // Số lượng ban đầu khi thêm mới
        },
        {
          headers: {
            Authorization: `Bearer ${authStore.token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      alert(`Đã thêm ${props.product.name} vào giỏ hàng!`);
    }
  } catch (error) {
    console.error("Chi tiết lỗi:", error);
    console.error("Dữ liệu phản hồi lỗi:", error.response?.data);
    
    const message = error.response?.data?.message || 
                   error.response?.data?.error || 
                   "Lỗi không xác định";
    
    if (error.response?.status === 401) {
      alert("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại!");
      router.push("/login");
    } else {
      alert(`Không thể thêm vào giỏ hàng: ${message}`);
    }
  }
};


    return { viewDetails, addToCart };
  },
};
</script>

<style scoped>
.product-card {
  border: 1px solid #ddd;
  border-radius: 8px;
  overflow: hidden;
  background: white;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  cursor: pointer;
  text-align: center;
  position: relative;
}

.product-card:hover {
  transform: scale(1.05);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}

.product-image {
  width: 100%;
  height: auto;
}

.product-info {
  padding: 15px;
}

.product-name {
  font-size: 1.2rem;
  color: #333;
  margin-bottom: 8px;
}

.product-price {
  font-size: 1rem;
  color: #ff5722;
  font-weight: bold;
  margin-bottom: 10px;
}

.add-to-cart-btn {
  padding: 8px 12px;
  background: #007bff;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background 0.3s ease;
}

.add-to-cart-btn:hover {
  background: #0056b3;
}

.product-details {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  background: rgba(0, 0, 0, 0.8);
  color: white;
  padding: 10px;
  text-align: left;
  border-top-left-radius: 8px;
  border-top-right-radius: 8px;
}
</style>
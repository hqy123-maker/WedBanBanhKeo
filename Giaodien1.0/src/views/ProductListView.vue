<template>
  <div class="container">
    <h2 class="title">Danh sách sản phẩm</h2>

    <!-- Thanh tìm kiếm -->
    <SearchBar @search="searchProducts" class="search-bar" />

    <!-- Bộ lọc và sắp xếp -->
    <div class="filters">
      <select v-model="selectedCategory" @change="filterProducts" class="filter-select">
        <option value="">Tất cả</option>
        <option value="Bánh">Bánh</option>
        <option value="Kẹo">Kẹo</option>
      </select>

      <select v-model="sortOption" @change="sortProducts" class="filter-select">
        <option value="price_asc">Giá tăng dần</option>
        <option value="price_desc">Giá giảm dần</option>
      </select>
    </div>

    <!-- Danh sách sản phẩm -->
    <div class="product-list">
      <ProductCard 
        v-for="product in paginatedProducts" 
        :key="product.id" 
        :product="product" 
        @click="viewProduct(product.id)"
      />
    </div>

    <!-- Phân trang -->
    <div class="pagination">
      <button @click="prevPage" :disabled="currentPage === 1" class="pagination-btn">❮</button>
      <span class="page-info">Trang {{ currentPage }} / {{ totalPages }}</span>
      <button @click="nextPage" :disabled="currentPage === totalPages" class="pagination-btn">❯</button>
    </div>
  </div>
</template>

<script>
import ProductCard from "../components/ProductCard.vue";
import SearchBar from "../components/SearchBar.vue";
import { ref, computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import axios from "axios"; // Import axios trực tiếp

export default {
  components: { ProductCard, SearchBar },
  setup() {
    const products = ref([]);
    const selectedCategory = ref("");
    const sortOption = ref("price_asc");
    const searchQuery = ref("");
    const currentPage = ref(1);
    const itemsPerPage = ref(8);
    const router = useRouter();

    // URL API cơ bản
    const API_URL = "http://localhost:5000/api/products"; // Backend chạy trên port 5000

    // Hàm lấy tất cả sản phẩm từ backend
    const fetchProducts = async () => {
      try {
        const response = await axios.get(API_URL);
        products.value = response.data; // Gán toàn bộ danh sách sản phẩm từ backend
      } catch (error) {
        console.error("Lỗi tải danh sách sản phẩm:", error);
      }
    };

    // Gọi fetchProducts khi component được mounted
    onMounted(fetchProducts);

    // Lọc sản phẩm phía client
    const filteredProducts = computed(() => {
      return products.value.filter((p) => {
        const matchCategory = selectedCategory.value
          ? p.category === selectedCategory.value // Giả sử backend trả về "category" là tên
          : true;
        const matchSearch = searchQuery.value
          ? p.name.toLowerCase().includes(searchQuery.value.toLowerCase())
          : true;
        return matchCategory && matchSearch;
      });
    });

    // Sắp xếp sản phẩm phía client
    const sortedProducts = computed(() => {
      return [...filteredProducts.value].sort((a, b) =>
        sortOption.value === "price_asc" ? a.price - b.price : b.price - a.price
      );
    });

    // Tính tổng số trang phía client
    const totalPages = computed(() => Math.ceil(sortedProducts.value.length / itemsPerPage.value));

    // Phân trang sản phẩm phía client
    const paginatedProducts = computed(() => {
      const start = (currentPage.value - 1) * itemsPerPage.value;
      return sortedProducts.value.slice(start, start + itemsPerPage.value);
    });

    // Tìm kiếm sản phẩm
    const searchProducts = (query) => {
      searchQuery.value = query;
      currentPage.value = 1;
    };

    // Lọc sản phẩm khi thay đổi danh mục
    const filterProducts = () => {
      currentPage.value = 1;
    };

    // Sắp xếp sản phẩm khi thay đổi sortOption
    const sortProducts = () => {
      currentPage.value = 1;
    };

    // Chuyển trang
    const nextPage = () => {
      if (currentPage.value < totalPages.value) {
        currentPage.value++;
      }
    };

    const prevPage = () => {
      if (currentPage.value > 1) {
        currentPage.value--;
      }
    };

    return {
      selectedCategory,
      sortOption,
      searchQuery,
      currentPage,
      itemsPerPage,
      filteredProducts,
      sortedProducts,
      paginatedProducts,
      totalPages,
      searchProducts,
      filterProducts,
      sortProducts,
      nextPage,
      prevPage,
      viewProduct: (productId) => router.push({ path: `/product/${productId}` }),
    };
  },
};

</script>

<style scoped>
.container {
  padding: 40px;
  text-align: center;
  background: linear-gradient(135deg, #ff9a9e, #fad0c4);
  border-radius: 12px;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.2);
}

.title {
  font-size: 2rem;
  color: #fff;
  margin-bottom: 20px;
  font-weight: bold;
}

.search-bar {
  margin-bottom: 20px;
}

.filters {
  display: flex;
  justify-content: center;
  gap: 15px;
  margin-bottom: 20px;
}

.filter-select {
  padding: 10px;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  background-color: #fff;
  cursor: pointer;
}

.product-list {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
  padding: 20px;
}

.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 20px;
  gap: 10px;
}

.pagination-btn {
  padding: 10px 15px;
  background: #007bff;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 1.2rem;
  transition: all 0.3s ease;
}

.pagination-btn:hover {
  background: #0056b3;
}

.page-info {
  font-size: 1.2rem;
  font-weight: bold;
  color: #fff;
  background: rgba(0, 0, 0, 0.2);
  padding: 8px 15px;
  border-radius: 8px;
}
</style>
<template>
  <div class="admin-container">
    <h2>Quản Lý Sản Phẩm</h2>
    <div class="action-bar">
      <button @click="showAddModal = true" class="btn-add">
        <i class="fas fa-plus"></i> Thêm sản phẩm
      </button>
      <div class="search-box">
        <input 
          v-model="searchKeyword" 
          type="text" 
          placeholder="Tìm kiếm sản phẩm..."
          @keyup.enter="handleSearch"
        />
        <button @click="handleSearch" class="btn-search">
          <i class="fas fa-search"></i>
        </button>
      </div>
    </div>

    <div class="product-table-container">
      <table class="product-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Hình ảnh</th>
            <th>Tên sản phẩm</th>
            <th>Giá</th>
            <th>Danh mục</th>
            <th>Tồn kho</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="product in paginatedProducts" :key="product.id">
            <td>{{ product.id }}</td>
            <td>
              <img 
                :src="getProductImage(product)" 
                :alt="product.name" 
                class="product-image"
                @error="handleImageError"
              />
            </td>
            <td>{{ product.name }}</td>
            <td>{{ formatPrice(product.price) }}đ</td>
            <td>{{ getCategoryName(product.category_id) }}</td>
            <td :class="{'low-stock': product.stock < 10}">{{ product.stock }}</td>
            <td class="actions">
              <button @click="editProduct(product)" class="btn-edit" title="Sửa">
                <i class="fas fa-edit"></i>
              </button>
              <button @click="confirmDelete(product)" class="btn-delete" title="Xóa">
                <i class="fas fa-trash-alt"></i>
              </button>
            </td>
          </tr>
        </tbody>
      </table>

      <div class="pagination" v-if="totalPages > 1">
        <button 
          @click="prevPage" 
          :disabled="currentPage === 1"
          class="page-btn"
        >
          <i class="fas fa-chevron-left"></i>
        </button>
        
        <span 
          v-for="page in totalPages" 
          :key="page"
          @click="goToPage(page)"
          :class="{active: currentPage === page}"
          class="page-number"
        >
          {{ page }}
        </span>
        
        <button 
          @click="nextPage" 
          :disabled="currentPage === totalPages"
          class="page-btn"
        >
          <i class="fas fa-chevron-right"></i>
        </button>
      </div>
    </div>

    <!-- Modal thêm/sửa sản phẩm -->
    <div v-if="showAddModal" class="modal-overlay">
      <div class="modal">
        <div class="modal-header">
          <h3>{{ isEditing ? 'Chỉnh sửa sản phẩm' : 'Thêm sản phẩm mới' }}</h3>
          <button @click="resetForm" class="close-btn">&times;</button>
        </div>
        
        <div class="modal-body">
          <div class="form-row">
            <div class="form-group">
              <label>Tên sản phẩm <span class="required">*</span></label>
              <input 
                v-model="newProduct.name" 
                type="text" 
                class="form-input"
                placeholder="Nhập tên sản phẩm"
              />
            </div>
            
            <div class="form-group">
              <label>Giá (VND) <span class="required">*</span></label>
              <input 
                v-model="newProduct.price" 
                type="number" 
                min="0" 
                step="1000" 
                class="form-input"
                placeholder="Nhập giá sản phẩm"
              />
            </div>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label>Danh mục <span class="required">*</span></label>
              <select v-model="newProduct.category_id" class="form-input">
                <option v-for="category in categories" 
                        :key="category.id" 
                        :value="category.id">
                  {{ category.name }}
                </option>
              </select>
            </div>
            
            <div class="form-group">
              <label>Tồn kho</label>
              <input 
                v-model="newProduct.stock" 
                type="number" 
                min="0" 
                class="form-input"
                placeholder="Số lượng tồn kho"
              />
            </div>
          </div>

          <div class="form-group">
            <label>Mô tả sản phẩm</label>
            <textarea 
              v-model="newProduct.description" 
              class="form-textarea"
              placeholder="Nhập mô tả sản phẩm"
              rows="3"
            ></textarea>
          </div>

          <div class="form-group">
            <label>URL hình ảnh sản phẩm</label>
            <div class="url-input-container">
              <input
                v-model="newProduct.image_url"
                type="text"
                class="form-input"
                placeholder="Nhập URL hình ảnh"
              />
              <button 
                v-if="newProduct.image_url"
                @click="newProduct.image_url = ''" 
                class="btn-clear-url"
                title="Xóa URL"
              >
                <i class="fas fa-times"></i>
              </button>
            </div>
            <p class="help-text">Ví dụ: https://example.com/image.jpg</p>
            
            <div class="image-preview-container">
              <img 
                v-if="newProduct.image_url" 
                :src="newProduct.image_url" 
                class="image-preview"
                @error="handleModalImageError"
              />
              <div v-else class="image-placeholder">
                <i class="fas fa-image"></i>
                <p>Chưa có hình ảnh</p>
              </div>
            </div>
          </div>
        </div>
        
        <div class="modal-footer">
          <button @click="resetForm" class="btn-cancel">
            <i class="fas fa-times"></i> Hủy bỏ
          </button>
          <button @click="saveProduct" class="btn-save">
            <i class="fas fa-save"></i> {{ isEditing ? 'Cập nhật' : 'Lưu lại' }}
          </button>
        </div>
      </div>
    </div>

    <!-- Modal xác nhận xóa -->
    <div v-if="showDeleteModal" class="modal-overlay">
      <div class="modal confirm-modal">
        <div class="modal-header">
          <h3>Xác nhận xóa sản phẩm</h3>
        </div>
        
        <div class="modal-body">
          <p>Bạn có chắc chắn muốn xóa sản phẩm <strong>{{ productToDelete?.name }}</strong>?</p>
          <p class="warning-text">Hành động này không thể hoàn tác!</p>
        </div>
        
        <div class="modal-footer">
          <button @click="showDeleteModal = false" class="btn-cancel">
            <i class="fas fa-times"></i> Hủy bỏ
          </button>
          <button @click="deleteProduct" class="btn-confirm">
            <i class="fas fa-trash-alt"></i> Xác nhận xóa
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import axios from "axios";
import { useToast } from "vue-toastification";

const toast = useToast();
const API_URL = "http://localhost:5000/api/products";
const CATEGORY_URL = "http://localhost:5000/api/categories";

// State
const products = ref([]);
const categories = ref([]);
const searchKeyword = ref("");
const currentPage = ref(1);
const itemsPerPage = 10;
const showAddModal = ref(false);
const showDeleteModal = ref(false);
const isEditing = ref(false);
const productToDelete = ref(null);

const placeholderImage = "/placeholder-product.png";

const newProduct = ref({
  id: null,
  name: "",
  price: "",
  category_id: "",
  description: "",
  stock: 0,
  image_url: ""
});

// Computed
const filteredProducts = computed(() => {
  if (!searchKeyword.value) return products.value;
  
  const keyword = searchKeyword.value.toLowerCase();
  return products.value.filter(product => 
    product.name.toLowerCase().includes(keyword) ||
    product.description?.toLowerCase().includes(keyword) ||
    product.id.toString().includes(keyword)
  );
});

const totalPages = computed(() => {
  return Math.ceil(filteredProducts.value.length / itemsPerPage);
});

const paginatedProducts = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  return filteredProducts.value.slice(start, end);
});

// Methods
const loadProducts = async () => {
  try {
    const response = await axios.get(API_URL);
    products.value = response.data;
  } catch (error) {
    console.error("Lỗi khi tải sản phẩm:", error);
    toast.error("Lỗi khi tải danh sách sản phẩm");
  }
};

const loadCategories = async () => {
  try {
    const response = await axios.get(CATEGORY_URL);
    categories.value = response.data;
    if (categories.value.length > 0) {
      newProduct.value.category_id = categories.value[0].id;
    }
  } catch (error) {
    console.error("Lỗi khi tải danh mục:", error);
    toast.error("Lỗi khi tải danh sách danh mục");
  }
};

const handleSearch = () => {
  currentPage.value = 1;
};

const isValidUrl = (url) => {
  if (!url) return false;
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

const getProductImage = (product) => {
  if (product.image_url && isValidUrl(product.image_url)) {
    return product.image_url;
  }
  return placeholderImage;
};

const saveProduct = async () => {
  try {
    if (!newProduct.value.name?.trim() || !newProduct.value.price) {
      toast.error("Vui lòng điền đầy đủ thông tin bắt buộc");
      return;
    }

    const token = localStorage.getItem('token');
    if (!token) {
      toast.error("Vui lòng đăng nhập lại");
      return;
    }

    const productData = {
      name: newProduct.value.name.trim(),
      price: parseFloat(newProduct.value.price),
      category_id: newProduct.value.category_id,
      description: newProduct.value.description?.trim() || '',
      stock: newProduct.value.stock || 0,
      image_url: newProduct.value.image_url || null
    };

    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    };

    let response;
    if (isEditing.value) {
      response = await axios.patch(
        `${API_URL}/${newProduct.value.id}`, 
        productData,
        { headers }
      );
    } else {
      response = await axios.post(
        API_URL, 
        productData,
        { headers }
      );
    }

    toast.success(response.data.message || (isEditing.value ? "Cập nhật thành công" : "Thêm mới thành công"));
    resetForm();
    await loadProducts();
  } catch (error) {
    console.error("Lỗi khi lưu sản phẩm:", error);
    
    if (error.response?.status === 401) {
      toast.error("Phiên đăng nhập hết hạn, vui lòng đăng nhập lại");
      // localStorage.removeItem('token');
      // window.location.href = '/login';
    } else {
      const errorMsg = error.response?.data?.message || 
                     (isEditing.value ? "Lỗi khi cập nhật sản phẩm" : "Lỗi khi thêm sản phẩm");
      toast.error(errorMsg);
    }
  }
};

const editProduct = (product) => {
  newProduct.value = { ...product };
  isEditing.value = true;
  showAddModal.value = true;
};

const confirmDelete = (product) => {
  productToDelete.value = product;
  showDeleteModal.value = true;
};

const deleteProduct = async () => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      toast.error("Vui lòng đăng nhập lại");
      return;
    }

    const headers = {
      'Authorization': `Bearer ${token}`
    };

    await axios.delete(`${API_URL}/${productToDelete.value.id}`, { 
      headers 
    });

    toast.success(`Đã xóa sản phẩm "${productToDelete.value.name}"`);
    await loadProducts();
    showDeleteModal.value = false;
  } catch (error) {
    console.error("Lỗi khi xóa sản phẩm:", error);
    
    if (error.response?.status === 401) {
      toast.error("Phiên đăng nhập hết hạn, vui lòng đăng nhập lại");
      // localStorage.removeItem('token');
      // window.location.href = '/login';
    } else {
      const errorMsg = error.response?.data?.message || "Lỗi khi xóa sản phẩm";
      toast.error(errorMsg);
    }
  }
};

const resetForm = () => {
  newProduct.value = {
    id: null,
    name: "",
    price: "",
    category_id: categories.value.length > 0 ? categories.value[0].id : "",
    description: "",
    stock: 0,
    image_url: ""
  };
  isEditing.value = false;
  showAddModal.value = false;
};

const prevPage = () => {
  if (currentPage.value > 1) currentPage.value--;
};

const nextPage = () => {
  if (currentPage.value < totalPages.value) currentPage.value++;
};

const goToPage = (page) => {
  currentPage.value = page;
};

const handleImageError = (event) => {
  const img = event.target;
  if (img.src !== placeholderImage) {
    img.src = placeholderImage;
  } else {
    img.style.display = 'none';
  }
};

const handleModalImageError = (event) => {
  event.target.style.display = 'none';
};

const formatPrice = (price) => {
  return new Intl.NumberFormat('vi-VN').format(price);
};

const getCategoryName = (id) => {
  const category = categories.value.find(c => c.id === id);
  return category ? category.name : 'Không xác định';
};

// Lifecycle hooks
onMounted(() => {
  loadProducts();
  loadCategories();
});
</script>

<style scoped>
.admin-container {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

.action-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  gap: 15px;
}

.search-box {
  display: flex;
  align-items: center;
  width: 300px;
}

.search-box input {
  flex: 1;
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 4px 0 0 4px;
  font-size: 14px;
}

.btn-search {
  padding: 8px 12px;
  background-color: #4CAF50;
  color: white;
  border: none;
  border-radius: 0 4px 4px 0;
  cursor: pointer;
}

.btn-search:hover {
  background-color: #45a049;
}

.product-table-container {
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.product-table {
  width: 100%;
  border-collapse: collapse;
}

.product-table th, 
.product-table td {
  padding: 12px 15px;
  text-align: left;
  border-bottom: 1px solid #f0f0f0;
}

.product-table th {
  background-color: #f8f9fa;
  font-weight: 600;
  color: #495057;
}

.product-table tr:hover {
  background-color: #f8f9fa;
}

.product-image {
  width: 50px;
  height: 50px;
  object-fit: cover;
  border-radius: 4px;
  border: 1px solid #eee;
}

.actions {
  display: flex;
  gap: 8px;
}

.btn-edit, .btn-delete {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-edit {
  background-color: #2196F3;
  color: white;
}

.btn-delete {
  background-color: #f44336;
  color: white;
}

.btn-edit:hover {
  background-color: #0b7dda;
}

.btn-delete:hover {
  background-color: #d32f2f;
}

.low-stock {
  color: #f44336;
  font-weight: 500;
}

.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 15px;
  gap: 5px;
}

.page-btn, .page-number {
  padding: 6px 12px;
  border: 1px solid #ddd;
  background: white;
  cursor: pointer;
  border-radius: 4px;
  transition: all 0.2s;
}

.page-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.page-number {
  min-width: 32px;
  text-align: center;
}

.page-number:hover, 
.page-number.active {
  background-color: #4CAF50;
  color: white;
  border-color: #4CAF50;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal {
  background: white;
  border-radius: 8px;
  width: 600px;
  max-width: 95%;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
}

.confirm-modal {
  width: 450px;
}

.modal-header {
  padding: 15px 20px;
  border-bottom: 1px solid #eee;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.modal-header h3 {
  margin: 0;
  font-size: 18px;
  color: #333;
}

.close-btn {
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: #777;
  padding: 0;
  line-height: 1;
}

.close-btn:hover {
  color: #333;
}

.modal-body {
  padding: 20px;
}

.form-row {
  display: flex;
  gap: 15px;
  margin-bottom: 15px;
}

.form-row .form-group {
  flex: 1;
}

.form-group {
  margin-bottom: 15px;
}

.form-group label {
  display: block;
  margin-bottom: 5px;
  font-weight: 500;
  color: #555;
}

.required {
  color: #f44336;
}

.form-input, .form-textarea {
  width: 100%;
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
}

.form-input:focus, 
.form-textarea:focus {
  outline: none;
  border-color: #4CAF50;
  box-shadow: 0 0 0 2px rgba(76, 175, 80, 0.2);
}

.form-textarea {
  min-height: 80px;
  resize: vertical;
}

.url-input-container {
  position: relative;
}

.btn-clear-url {
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  color: #999;
  cursor: pointer;
  padding: 5px;
}

.btn-clear-url:hover {
  color: #f44336;
}

.help-text {
  font-size: 12px;
  color: #666;
  margin-top: 5px;
  font-style: italic;
}

.image-preview-container {
  margin-top: 15px;
  border: 1px dashed #ddd;
  border-radius: 4px;
  padding: 15px;
  text-align: center;
  min-height: 150px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.image-preview {
  max-width: 100%;
  max-height: 200px;
  border-radius: 4px;
}

.image-placeholder {
  text-align: center;
  color: #999;
}

.image-placeholder i {
  font-size: 40px;
  margin-bottom: 10px;
  color: #ddd;
}

.modal-footer {
  padding: 15px 20px;
  border-top: 1px solid #eee;
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}

.btn-cancel, .btn-save, .btn-confirm {
  padding: 8px 16px;
  border-radius: 4px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 5px;
  transition: all 0.2s;
}

.btn-cancel {
  background-color: #f5f5f5;
  color: #333;
  border: 1px solid #ddd;
}

.btn-cancel:hover {
  background-color: #e9e9e9;
}

.btn-save {
  background-color: #4CAF50;
  color: white;
  border: none;
}

.btn-save:hover {
  background-color: #45a049;
}

.btn-confirm {
  background-color: #f44336;
  color: white;
  border: none;
}

.btn-confirm:hover {
  background-color: #d32f2f;
}

.warning-text {
  color: #f44336;
  font-weight: 500;
  margin-top: 10px;
}

/* Responsive */
@media (max-width: 768px) {
  .action-bar {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .search-box {
    width: 100%;
  }
  
  .form-row {
    flex-direction: column;
    gap: 0;
  }
  
  .product-table th, 
  .product-table td {
    padding: 8px;
    font-size: 14px;
  }
  
  .modal {
    width: 95%;
  }
}
</style>
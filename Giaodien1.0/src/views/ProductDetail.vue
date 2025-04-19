<template>
  <div class="product-detail">
    <div v-if="loading">Loading...</div>
    <div v-else-if="error">{{ error }}</div>
    <div v-else>
      <!-- Product Information Section -->
      <div class="product-info">
        <div class="product-image">
          <img :src="product.image_url || 'default_image_url.jpg'" alt="Product Image" />
        </div>
        <div class="product-details">
          <h2>{{ product.name }}</h2>
          <p class="product-description">{{ product.description || 'No description available.' }}</p>
          <div class="product-price">
            <span class="price">${{ product.price }}</span>
          </div>
          <div class="product-stock">
            <span v-if="product.stock > 0">In Stock: {{ product.stock }}</span>
            <span v-else>Out of Stock</span>
          </div>
          <button :disabled="product.stock <= 0" @click="addToCart">Add to Cart</button>
        </div>
      </div>

      <!-- Product Comments Section -->
      <div class="product-comments">
        <h3>Customer Reviews</h3>
        <div v-if="comments.length > 0">
          <div v-for="comment in comments" :key="comment.id" class="comment">
            <p><strong>{{ comment.user_name }}</strong> (Rating: {{ comment.rating }}/5)</p>
            <p>{{ comment.comment }}</p>
          </div>
        </div>
        <div v-else>
          <p>No reviews yet. Be the first to review this product!</p>
        </div>

        <!-- Add Comment Form -->
        <div class="add-comment">
          <h4>Add a Review</h4>
          <form @submit.prevent="submitComment">
            <textarea v-model="newComment.text" placeholder="Write your comment..." required></textarea>
            <div class="rating">
              <label>Rating:</label>
              <select v-model="newComment.rating" required>
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
                <option value="4">4</option>
                <option value="5">5</option>
              </select>
            </div>
            <button type="submit" :disabled="!newComment.text || !newComment.rating">Submit Review</button>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      product: null,
      comments: [],
      newComment: {
        text: '',
        rating: 5
      },
      loading: true,
      error: null
    };
  },
  async created() {
    const productId = this.$route.params.id;
    if (!productId) {
      this.error = "Invalid product ID";
      return;
    }

    await this.fetchProductDetails();
    await this.fetchProductComments();
  },
  methods: {
    async fetchProductDetails() {
      try {
        const response = await axios.get(`http://localhost:5000/api/products/${this.$route.params.id}`);
        console.log("Product Data:", response.data);
        this.product = response.data;
      } catch (error) {
        console.error('Error fetching product details:', error);
        this.error = "Failed to load product details.";
      } finally {
        this.loading = false;
      }
    },

    async fetchProductComments() {
      try {
        const response = await axios.get(`http://localhost:5000/api/products/${this.$route.params.id}/comments`);
        console.log("Comments Data:", response.data);
        this.comments = response.data;
      } catch (error) {
        console.error('Error fetching product comments:', error);
      }
    },

    async submitComment() {
      try {
        const response = await axios.post(`http://localhost:5000/api/products/${this.$route.params.id}/comments`, {
          user_id: 1,
          product_id: this.$route.params.id,
          comment: this.newComment.text,
          rating: this.newComment.rating
        });
        console.log("Comment Submitted:", response.data);
        alert("Your review has been submitted successfully!");
        this.fetchProductComments();
        this.newComment.text = '';
        this.newComment.rating = 5;
      } catch (error) {
        console.error('Error submitting comment:', error);
        alert("Failed to submit review. Please try again.");
      }
    },

    async addToCart() {
    try {
        const token = localStorage.getItem("token"); // Lấy token từ localStorage

        if (!token) {
            alert("Bạn cần đăng nhập để thêm vào giỏ hàng!");
            return;
        }

        const response = await axios.post(
            "http://localhost:5000/api/cart",
            { product_id: this.product.id, quantity: 1 },
            { headers: { Authorization: `Bearer ${token}` } } // Gửi token
        );

        console.log("Thêm vào giỏ hàng:", response.data);
        alert("Sản phẩm đã được thêm vào giỏ hàng!");
    } catch (error) {
        console.error("Lỗi thêm vào giỏ hàng:", error);
        alert(error.response?.data?.message || "Lỗi không xác định!");
    }
}

  }
};
</script>

<style scoped>
.product-detail {
  display: flex;
  flex-direction: column;
  margin: 20px;
}

.product-info {
  display: flex;
  flex-direction: row;
  margin-bottom: 30px;
}

.product-image img {
  width: 300px;
  height: 300px;
  object-fit: cover;
}

.product-details {
  margin-left: 20px;
}

.product-price {
  font-size: 1.5rem;
  color: #333;
}

.product-stock {
  font-size: 1.2rem;
  color: green;
}

button:disabled {
  background-color: #ccc;
}

.product-comments {
  margin-top: 30px;
}

.comment {
  border-bottom: 1px solid #ccc;
  margin-bottom: 10px;
}

.add-comment textarea {
  width: 100%;
  height: 100px;
  margin-bottom: 10px;
  padding: 10px;
  border-radius: 5px;
  border: 1px solid #ccc;
}

.rating {
  margin-bottom: 10px;
}

.rating label {
  margin-right: 10px;
}

button {
  padding: 10px 20px;
  background-color: #28a745;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

button:disabled {
  background-color: #ccc;
}

h3, h4 {
  margin-bottom: 15px;
}
</style>

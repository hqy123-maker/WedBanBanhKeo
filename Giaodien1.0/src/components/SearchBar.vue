<template>
  <div class="search-bar">
    <input
      type="text"
      v-model="query"
      @input="onSearch"
      placeholder="Tìm kiếm sản phẩm..."
    />
  </div>
</template>

<script>
import { ref } from "vue";

export default {
  setup(_, { emit }) {
    const query = ref("");

    const onSearch = () => {
      emit("search", query.value.trim());
    };

    return { query, onSearch };
  }
};
</script>

<style>
.search-bar {
  width: 100%;
  display: flex;
  justify-content: center;
  margin: 10px 0;
}
.search-bar input {
  width: 50%;
  padding: 10px;
  font-size: 16px;
  border: 1px solid #ccc;
  border-radius: 5px;
}
</style>

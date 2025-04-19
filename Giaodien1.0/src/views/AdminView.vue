<template>
    <div class="admin-container">
      <h1>Trang Quản Lý Admin</h1>
      <nav class="admin-nav">
        <button @click="activeTab = 'products'">Quản lý sản phẩm</button>
        <button @click="activeTab = 'orders'">Quản lý đơn hàng</button>
        <button @click="activeTab = 'users'">Quản lý người dùng</button>
      </nav>
  
      <div class="admin-content">
        <ProductManagement v-if="activeTab === 'products'" />
        <OrderManagement v-if="activeTab === 'orders'" />
        <UserManagement v-if="activeTab === 'users'" />
      </div>
  
      
    </div>
  </template>
  
  <script setup>
  import { ref } from "vue";
  import { useRouter } from "vue-router";
  import ProductManagement from "@/components/admin/ProductManagement.vue";
  import OrderManagement from "@/components/admin/OrderManagement.vue";
  import UserManagement from "@/components/admin/UserManagement.vue";
  
  const router = useRouter();
  const activeTab = ref("products"); 
  
  const logout = () => {
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("currentUser");
    router.push("/login");
  };
  </script>
  
  <style>
  .admin-container {
    text-align: center;
    padding: 20px;
  }
  
  .admin-nav {
    margin-bottom: 20px;
  }
  
  .admin-nav button {
    margin: 5px;
    padding: 10px;
    border: none;
    background-color: #007bff;
    color: white;
    cursor: pointer;
  }
  
  .admin-nav button:hover {
    background-color: #0056b3;
  }
  
  .admin-content {
    border: 1px solid #ddd;
    padding: 20px;
    background: #f9f9f9;
  }
  
  .logout-btn {
    margin-top: 20px;
    padding: 10px;
    background-color: red;
    color: white;
    border: none;
    cursor: pointer;
  }
  </style>
  
<template>
  <div class="p-4">
    <h2 class="text-xl font-bold mb-4">Quản lý Đơn Hàng</h2>
    
    <table class="w-full border-collapse border border-gray-300">
      <thead>
        <tr class="bg-gray-200">
          <th class="border p-2">Mã đơn</th>
          <th class="border p-2">Tổng tiền</th>
          <th class="border p-2">Trạng thái</th>
          <th class="border p-2">Hành động</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="order in orders" :key="order.id" class="text-center">
          <td class="border p-2">{{ order.id }}</td>
          <td class="border p-2">{{ order.total_price.toLocaleString() }} VNĐ</td>
          <td class="border p-2">{{ order.status }}</td>
          <td class="border p-2">
            <button class="bg-blue-500 text-white px-2 py-1 rounded" @click="viewDetails(order.id)">Chi tiết</button>
            <button v-if="order.status === 'pending'" class="bg-red-500 text-white px-2 py-1 ml-2 rounded" @click="cancelOrder(order.id)">Hủy</button>
          </td>
        </tr>
      </tbody>
    </table>

    <div v-if="selectedOrder" class="mt-4 p-4 border rounded bg-gray-100">
      <h3 class="font-bold">Chi tiết đơn hàng #{{ selectedOrder.id }}</h3>
      <ul>
        <li v-for="item in selectedOrder.details" :key="item.product_id">
          {{ item.product_name }} - SL: {{ item.quantity }} - Giá: {{ item.price.toLocaleString() }} VNĐ
        </li>
      </ul>
      <button v-if="selectedOrder.status === 'pending'" class="bg-green-500 text-white px-2 py-1 mt-2 rounded" @click="confirmPayment(selectedOrder.id)">Xác nhận thanh toán</button>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
export default {
  data() {
    return {
      orders: [],
      selectedOrder: null,
    };
  },
  methods: {
    async fetchOrders() {
      try {
        const res = await axios.get('/api/orders', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        this.orders = res.data;
      } catch (error) {
        console.error("Lỗi khi tải đơn hàng:", error);
      }
    },
    async viewDetails(orderId) {
      try {
        const res = await axios.get(`/api/orders/${orderId}/details`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        this.selectedOrder = { id: orderId, details: res.data };
      } catch (error) {
        console.error("Lỗi lấy chi tiết đơn hàng:", error);
      }
    },
    async cancelOrder(orderId) {
      try {
        await axios.patch(`/api/orders/${orderId}/cancel`, {}, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        alert("Hủy đơn hàng thành công!");
        this.fetchOrders();
      } catch (error) {
        console.error("Lỗi khi hủy đơn hàng:", error);
      }
    },
    async confirmPayment(orderId) {
      try {
        await axios.patch(`/api/orders/${orderId}/confirm-payment`, { payment_method: "credit_card" }, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        alert("Thanh toán thành công!");
        this.fetchOrders();
      } catch (error) {
        console.error("Lỗi thanh toán:", error);
      }
    }
  },
  mounted() {
    this.fetchOrders();
  }
};
</script>

  
  <style>
  .admin-orders {
    padding: 20px;
  }
  .admin-orders table {
    width: 100%;
    border-collapse: collapse;
  }
  .admin-orders th, .admin-orders td {
    border: 1px solid #ddd;
    padding: 10px;
    text-align: left;
  }
  .admin-orders select {
    padding: 5px;
  }
  </style>
  
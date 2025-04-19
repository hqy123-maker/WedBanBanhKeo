
import { defineStore } from 'pinia';

export const useOrderStore = defineStore('order', {
  state: () => ({
    currentOrder: null
  }),
  actions: {
    async createOrder(orderData) {
      // Gọi API hoặc xử lý dữ liệu
      this.currentOrder = {
        id: 'DH-' + Date.now(),
        createdAt: new Date().toISOString(),
        ...orderData
      };
      return this.currentOrder;
    }
  }
});
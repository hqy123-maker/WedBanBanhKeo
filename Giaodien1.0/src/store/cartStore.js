import { defineStore } from "pinia";

export const useCartStore = defineStore("cart", {
  state: () => ({
    cart: [],
  }),
  getters: {
    totalPrice: (state) => state.cart.reduce((total, item) => total + item.price * item.quantity, 0),
  },
  actions: {
    addToCart(product) {
      const existingItem = this.cart.find((item) => item.id === product.id);
      if (existingItem) {
        existingItem.quantity++;
      } else {
        this.cart.push({ ...product, quantity: 1 });
      }
    },
    updateQuantity(id, change) {
      const item = this.cart.find((item) => item.id === id);
      if (item) {
        item.quantity += change;
        if (item.quantity < 1) {
          this.removeFromCart(id);
        }
      }
    },
    removeFromCart(id) {
      this.cart = this.cart.filter((item) => item.id !== id);
    },
  },
});

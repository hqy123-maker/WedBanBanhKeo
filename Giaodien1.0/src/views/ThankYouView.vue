<template>
    <div class="thank-you">
      <h2>Cảm ơn bạn đã mua hàng!</h2>
      <p>Đơn hàng của bạn đã được xử lý thành công.</p>
      <p v-if="orderId">Mã đơn hàng: {{ orderId }}</p>
      <router-link to="/cart">Quay lại giỏ hàng</router-link>
    </div>
  </template>
  
  <script>
  export default {
    props: {
      orderId: {
        type: [String, Number],
        default: null,
      },
    },
  };
  </script>
  
  <style scoped>
  .thank-you {
    text-align: center;
    margin: 50px auto;
    padding: 20px;
    max-width: 600px;
    background: #fff;
    border-radius: 12px;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  }
  
  h2 {
    color: #4caf50;
    margin-bottom: 20px;
  }
  
  p {
    font-size: 18px;
    color: #555;
    margin: 10px 0;
  }
  
  a {
    display: inline-block;
    margin-top: 20px;
    padding: 10px 20px;
    background: #4caf50;
    color: white;
    text-decoration: none;
    border-radius: 8px;
    transition: background 0.3s;
  }
  
  a:hover {
    background: #45a049;
  }
  </style>
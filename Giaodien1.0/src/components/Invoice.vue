<template>
    <div class="invoice">
      <div class="invoice-header">
        <h2>HÓA ĐƠN THANH TOÁN</h2>
        <div class="invoice-meta">
          <p><strong>Ngày:</strong> {{ currentDate }}</p>
          <p><strong>Mã HD:</strong> {{ orderId }}</p>
        </div>
      </div>
  
      <div class="invoice-body">
        <div class="invoice-section">
          <h3>Thông tin thanh toán</h3>
          <div class="payment-info">
            <p><strong>Phương thức:</strong> {{ paymentMethodLabel }}</p>
            <p><strong>Trạng thái:</strong> <span class="status-paid">Đã thanh toán</span></p>
          </div>
        </div>
  
        <div class="invoice-section">
          <h3>Chi tiết đơn hàng</h3>
          <div class="order-items">
            <slot name="order-items"></slot>
          </div>
        </div>
  
        <div class="invoice-totals">
          <div class="total-row">
            <span>Tạm tính:</span>
            <span>{{ formatCurrency(subtotal) }}</span>
          </div>
          <div class="total-row">
            <span>Phí vận chuyển:</span>
            <span>{{ formatCurrency(shippingFee) }}</span>
          </div>
          <div class="total-row grand-total">
            <span><strong>Tổng cộng:</strong></span>
            <span><strong>{{ formatCurrency(total) }}</strong></span>
          </div>
        </div>
      </div>
  
      <div class="invoice-footer">
        <p>Cảm ơn bạn đã mua hàng!</p>
        <div class="invoice-actions">
          <button @click="printInvoice" class="print-btn">
            <i class="fas fa-print"></i> In hóa đơn
          </button>
          <router-link to="/" class="back-btn">
            <i class="fas fa-home"></i> Về trang chủ
          </router-link>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    props: {
      orderId: { type: [String, Number], required: true },
      subtotal: { type: Number, default: 0 },
      shippingFee: { type: Number, default: 0 },
      paymentMethod: { type: String, default: 'cod' }
    },
    computed: {
      currentDate() {
        return new Date().toLocaleDateString('vi-VN');
      },
      total() {
        return this.subtotal + this.shippingFee;
      },
      paymentMethodLabel() {
        const methods = {
          cod: 'Tiền mặt khi nhận hàng',
          credit_card: 'Thẻ tín dụng',
          paypal: 'PayPal',
          bank_transfer: 'Chuyển khoản ngân hàng'
        };
        return methods[this.paymentMethod] || this.paymentMethod;
      }
    },
    methods: {
      formatCurrency(value) {
        return new Intl.NumberFormat('vi-VN', { 
          style: 'currency', 
          currency: 'VND' 
        }).format(value);
      },
      printInvoice() {
        window.print();
      }
    }
  };
  </script>
  
  <style scoped>
  .invoice {
    background: white;
    border-radius: 12px;
    box-shadow: 0 0 20px rgba(0,0,0,0.1);
    padding: 30px;
    max-width: 800px;
    margin: 30px auto;
  }
  
  .invoice-header {
    text-align: center;
    margin-bottom: 30px;
    padding-bottom: 20px;
    border-bottom: 1px solid #eee;
  }
  
  .invoice-header h2 {
    color: #2c3e50;
    margin-bottom: 10px;
  }
  
  .invoice-meta {
    display: flex;
    justify-content: center;
    gap: 20px;
    color: #7f8c8d;
  }
  
  .invoice-section {
    margin-bottom: 25px;
  }
  
  .invoice-section h3 {
    color: #2c3e50;
    border-bottom: 1px solid #eee;
    padding-bottom: 8px;
    margin-bottom: 15px;
  }
  
  .payment-info p {
    margin: 8px 0;
  }
  
  .status-paid {
    color: #4caf50;
    font-weight: bold;
  }
  
  .invoice-totals {
    background: #f9f9f9;
    padding: 20px;
    border-radius: 8px;
    margin-top: 30px;
  }
  
  .total-row {
    display: flex;
    justify-content: space-between;
    padding: 8px 0;
    border-bottom: 1px dashed #ddd;
  }
  
  .grand-total {
    font-size: 1.1em;
    border-bottom: none;
    padding-top: 10px;
  }
  
  .invoice-footer {
    text-align: center;
    margin-top: 30px;
    padding-top: 20px;
    border-top: 1px solid #eee;
  }
  
  .invoice-actions {
    display: flex;
    justify-content: center;
    gap: 15px;
    margin-top: 20px;
  }
  
  .print-btn, .back-btn {
    padding: 10px 20px;
    border-radius: 6px;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 8px;
    transition: all 0.3s;
  }
  
  .print-btn {
    background: #2196F3;
    color: white;
    border: none;
  }
  
  .print-btn:hover {
    background: #0b7dda;
  }
  
  .back-btn {
    background: #f1f1f1;
    color: #333;
    text-decoration: none;
  }
  
  .back-btn:hover {
    background: #ddd;
  }
  
  @media print {
    body * {
      visibility: hidden;
    }
    .invoice, .invoice * {
      visibility: visible;
    }
    .invoice {
      position: absolute;
      left: 0;
      top: 0;
      width: 100%;
      box-shadow: none;
    }
    .invoice-actions {
      display: none;
    }
  }
  </style>
import express from "express";
import { getAllUsers, toggleUserStatus, deleteUser } from "../controllers/adminController.js";

import { getOrders,updateOrderStatus,getStats } from "../controllers/orderController.js";

import { getAllProducts, getProductById, addProduct, updateProduct, deleteProduct } from "../controllers/productController.js";

import { authMiddleware } from "../middleware/authMiddleware.js";
import { adminMiddleware } from "../middleware/adminMiddleware.js";

const router = express.Router();

// 🛠️ Quản lý người dùng
router.get("/users", authMiddleware, adminMiddleware, getAllUsers);
router.patch("/users/:id/toggle-status", authMiddleware, adminMiddleware, toggleUserStatus);
router.delete("/users/:id", authMiddleware, adminMiddleware, deleteUser);

// 📦 Quản lý đơn hàng
router.get("/orders", authMiddleware, adminMiddleware, getOrders);
router.patch("/orders/:id", authMiddleware, adminMiddleware, updateOrderStatus);

// 📊 Thống kê hệ thống
router.get("/stats", authMiddleware, adminMiddleware, getStats);

// 🛍️ Quản lý sản phẩm (Thêm API cho sản phẩm)
router.get("/products", authMiddleware, adminMiddleware, getAllProducts);
router.get("/products/:id", authMiddleware, adminMiddleware, getProductById);
router.post("/products", authMiddleware, adminMiddleware, addProduct);
router.patch("/products/:id", authMiddleware, adminMiddleware, updateProduct);
router.delete("/products/:id", authMiddleware, adminMiddleware, deleteProduct);

export default router;

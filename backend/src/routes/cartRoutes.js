    import express from "express";
    import { getCart, addToCart, updateCart, removeFromCart, clearCart } from "../controllers/cartController.js";

    import { authMiddleware } from "../middleware/authMiddleware.js";

    const router = express.Router();

    // 🛒 API giỏ hàng
    router.get("/", authMiddleware, getCart); // Lấy danh sách sản phẩm trong giỏ
    router.post("/", authMiddleware, addToCart); // Thêm sản phẩm vào giỏ
    router.patch("/:product_id", authMiddleware, updateCart); // Cập nhật số lượng sản phẩm
    router.delete("/:product_id", authMiddleware, removeFromCart); // Xóa một sản phẩm khỏi giỏ
    router.delete("/", authMiddleware, clearCart); // Xóa toàn bộ giỏ hàng

    export default router;

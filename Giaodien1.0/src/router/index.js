import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";
import ProductListView from "../views/ProductListView.vue";
import ProductDetail from "../views/ProductDetail.vue";
import CartView from "../views/CartView.vue";
import LoginView from "../views/LoginView.vue";
import RegisterView from "../views/RegisterView.vue";
import AdminView from "../views/AdminView.vue";
import CheckoutView from "../views/CheckoutView.vue";
import { useAuthStore } from "../store/authStore"; // Đúng đường dẫn

const routes = [
  { path: "/", component: HomeView },
  { path: "/products", component: ProductListView },
  { path: "/product/:id", component: ProductDetail, props: true },
  { path: "/cart", component: CartView, meta: { requiresAuth: true } },
  { path: "/login", component: LoginView },
  { path: "/register", component: RegisterView },
  { path: "/admin", component: AdminView, meta: { requiresAdmin: true } },
  { path: "/checkout", component: CheckoutView },
  { path: "/thank-you", name: "ThankYou", component: () => import("../views/ThankYouView.vue") },

];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore();

  // Đảm bảo trạng thái đăng nhập được kiểm tra trước
  await authStore.checkAuth();

  // Lấy vai trò người dùng từ authStore.user thay vì localStorage
  const isAdmin = authStore.user?.role === "admin";

  console.log("Trạng thái đăng nhập:", authStore.isLoggedIn);
  console.log("Vai trò người dùng:", authStore.user?.role);

  if (to.meta.requiresAuth && !authStore.isLoggedIn) {
    if (to.path === "/cart") {
      if (window.confirm("Bạn cần đăng nhập để vào giỏ hàng. Nhấn OK để đăng nhập.")) {
        next("/login");
      } else {
        next(false); // Giữ nguyên trang hiện tại nếu bấm Cancel
      }
    } else {
      next("/login");
    }
  } else if (to.meta.requiresAdmin && !isAdmin) {
    console.log("🚫 Không phải admin, chuyển hướng về trang chủ");
    alert("Bạn không có quyền truy cập trang admin!");
    next("/");
  } else {
    next();
  }
});

export default router;